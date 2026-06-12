<?php
/**
 * GPW — Unified RFQ logic library (Issue #05)
 * --------------------------------------------------------------
 * Pure, side-effect-free functions for the unified Request-a-Quote
 * handler. This file ONLY declares functions — it performs no I/O at
 * include time — so it can be required by both the live handler
 * (process-rfq.php) and the offline test runner (tests/run-tests.php).
 *
 * The reCAPTCHA verifier is injected as a callable so the gating logic
 * can be tested deterministically without hitting Google's network API.
 *
 * Honesty note (ADR-0002): capability routing/labels keep CNC framed as
 * a managed Monterrey network; assembly as in-house. No copy here claims
 * owned machines.
 */

if (!defined('RFQ_LIB')) {
    define('RFQ_LIB', true);

    /** Canonical capability values accepted by the form/handler. */
    function rfq_capabilities() {
        return ['cnc', 'assembly', 'both', 'unsure'];
    }

    /** Sanitize a scalar text field (trim, strip tags, encode entities). */
    function rfq_clean($val) {
        return htmlspecialchars(strip_tags(trim((string) ($val ?? ''))), ENT_QUOTES, 'UTF-8');
    }

    /**
     * Make a value safe to place inside an email header (Subject, Reply-To).
     * Strips CR/LF so a crafted field can't inject extra headers (e.g. Bcc).
     * htmlspecialchars does NOT remove newlines, so header-bound fields need
     * this in addition to rfq_clean().
     */
    function rfq_header_safe($val) {
        return trim(str_replace(["\r", "\n", "\t"], ' ', (string) ($val ?? '')));
    }

    /** Normalize + validate a capability. Returns canonical value or null. */
    function rfq_normalize_capability($raw) {
        $v = strtolower(trim((string) ($raw ?? '')));
        return in_array($v, rfq_capabilities(), true) ? $v : null;
    }

    /** Human-readable label for a capability value. */
    function rfq_capability_label($cap) {
        switch ($cap) {
            case 'cnc':      return 'CNC Machining';
            case 'assembly': return 'Assembly & Integration';
            case 'both':     return 'CNC Machining + Assembly & Integration';
            case 'unsure':   return 'Not sure yet (needs scoping)';
            default:         return 'Unknown';
        }
    }

    /** Short routing tag for the email subject / triage. */
    function rfq_capability_tag($cap) {
        switch ($cap) {
            case 'cnc':      return 'CNC';
            case 'assembly': return 'Assembly';
            case 'both':     return 'CNC + Assembly';
            case 'unsure':   return 'Triage';
            default:         return 'Unknown';
        }
    }

    /**
     * Recipient list for a capability.
     *
     * Tag-only routing (current decision): every lead goes to the shared
     * sales inboxes and carries its capability tag in the subject/body.
     * Structured as a branch point so per-capability recipients can be
     * wired later without touching the entrypoint.
     */
    function rfq_recipients($cap, array $config) {
        // Future: switch ($cap) { case 'cnc': return [...]; ... }
        return $config['to_emails'];
    }

    /** Capability-aware subject line (header-safe). */
    function rfq_build_subject($cap, $company, $industry) {
        $company  = rfq_header_safe($company);
        $industry = rfq_header_safe($industry);
        $subject = 'New ' . rfq_capability_tag($cap) . ' RFQ: ' . $company;
        if ($industry !== '' && strtolower($industry) !== 'not specified') {
            $subject .= ' — ' . $industry;
        }
        return $subject;
    }

    /** Validate an email. Returns the normalized address or false. */
    function rfq_validate_email($raw) {
        return filter_var(trim((string) ($raw ?? '')), FILTER_VALIDATE_EMAIL);
    }

    /**
     * Required-field check against a normalized data array.
     * Returns the list of missing field keys (empty array = all present).
     * Email is included: an invalid address normalizes to false and is
     * reported here, mirroring the legacy handler's combined check.
     */
    function rfq_missing_required(array $data) {
        $required = ['capability', 'company', 'contact_name', 'email', 'description'];
        $missing = [];
        foreach ($required as $key) {
            $val = $data[$key] ?? null;
            if ($val === '' || $val === null || $val === false) {
                $missing[] = $key;
            }
        }
        return $missing;
    }

    /**
     * Validate an uploaded file WITHOUT moving it (pure / testable).
     * Accepts a $_FILES-style array (or null). Returns:
     *   ['status' => 'ok'|'none'|'error', 'message' => string, 'ext' => string]
     * 'none' means no file was provided (upload is optional).
     */
    function rfq_validate_upload($file, array $allowed_extensions, $max_file_size) {
        if (!is_array($file) || !isset($file['error']) || $file['error'] === UPLOAD_ERR_NO_FILE) {
            return ['status' => 'none', 'message' => '', 'ext' => ''];
        }
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return ['status' => 'error', 'message' => 'File upload failed. Please try again.', 'ext' => ''];
        }
        if (($file['size'] ?? 0) > $max_file_size) {
            return ['status' => 'error', 'message' => 'File exceeds 10 MB limit.', 'ext' => ''];
        }
        $ext = strtolower(pathinfo($file['name'] ?? '', PATHINFO_EXTENSION));
        if (!in_array($ext, $allowed_extensions, true)) {
            return [
                'status'  => 'error',
                'message' => 'File type not allowed. Accepted: PDF, DOC, DOCX, XLS, XLSX, DWG, DXF, STEP, IGES, ZIP, RAR, PNG, JPG.',
                'ext'     => $ext,
            ];
        }
        return ['status' => 'ok', 'message' => '', 'ext' => $ext];
    }

    /**
     * reCAPTCHA v3 gating. $verifier is callable(string $token): array
     * returning Google's siteverify-shaped response (mockable in tests).
     * Returns ['ok'=>bool, 'code'=>int, 'message'=>string, 'score'=>?float].
     */
    function rfq_verify_recaptcha($token, $threshold, $expected_action, callable $verifier) {
        $token = (string) ($token ?? '');
        if ($token === '') {
            return ['ok' => false, 'code' => 400, 'message' => 'reCAPTCHA token missing.', 'score' => null];
        }

        $result = $verifier($token);
        $fail = ['ok' => false, 'code' => 403, 'message' => 'reCAPTCHA verification failed. Please try again.', 'score' => null];

        if (!is_array($result) || empty($result['success'])) {
            return $fail;
        }
        // Action binding — an improvement over the legacy handler, which never
        // verified the action. Strict: when an action is expected, the response
        // MUST carry a matching one (real Google v3 responses always include it).
        if ($expected_action !== null && (!isset($result['action']) || $result['action'] !== $expected_action)) {
            $fail['score'] = isset($result['score']) ? (float) $result['score'] : null;
            return $fail;
        }
        $score = isset($result['score']) ? (float) $result['score'] : 0.0;
        if ($score < $threshold) {
            $fail['score'] = $score;
            return $fail;
        }
        return ['ok' => true, 'code' => 200, 'message' => '', 'score' => $score];
    }

    /** Live Google verifier (network). Returns a callable for injection. */
    function rfq_google_verifier($secret, $remoteip) {
        return function ($token) use ($secret, $remoteip) {
            $verify = @file_get_contents('https://www.google.com/recaptcha/api/siteverify?' . http_build_query([
                'secret'   => $secret,
                'response' => $token,
                'remoteip' => $remoteip,
            ]));
            if ($verify === false) {
                return ['success' => false];
            }
            $decoded = json_decode($verify, true);
            return is_array($decoded) ? $decoded : ['success' => false];
        };
    }

    /** Collect + sanitize all POST fields into a normalized data array. */
    function rfq_collect(array $post) {
        $services = (isset($post['services']) && is_array($post['services']))
            ? implode(', ', array_map('rfq_clean', $post['services']))
            : '';

        return [
            'capability'   => rfq_normalize_capability($post['capability'] ?? ''), // canonical or null
            'company'      => rfq_clean($post['company'] ?? ''),
            'contact_name' => rfq_clean($post['contact_name'] ?? ''),
            'email'        => rfq_validate_email($post['email'] ?? ''), // false if invalid
            'phone'        => rfq_clean($post['phone'] ?? ''),
            'industry'     => rfq_clean($post['industry'] ?? ''),
            'referral'     => rfq_clean($post['referral'] ?? ''),
            'description'  => rfq_clean($post['description'] ?? ''),
            // CNC Machining
            'process_type' => rfq_clean($post['process_type'] ?? ''),
            'material'     => rfq_clean($post['material'] ?? ''),
            'tolerance'    => rfq_clean($post['tolerance'] ?? ''),
            'quantity'     => rfq_clean($post['quantity'] ?? ''),
            'dfm_review'   => (isset($post['dfm_review']) && $post['dfm_review'] !== '') ? 'Yes' : 'No',
            // Assembly & Integration
            'services'     => $services,
            'volume'       => rfq_clean($post['volume'] ?? ''),
            'timeline'     => rfq_clean($post['timeline'] ?? ''),
        ];
    }

    /**
     * Ordered [label, value] rows for the sales email, by capability.
     * CNC rows appear for cnc/both; assembly rows for assembly/both. This is
     * the externally-observable result of the capability-routing branch.
     */
    function rfq_email_rows(array $data) {
        $cap = $data['capability'] ?? '';
        $val = function ($key) use ($data) {
            return (isset($data[$key]) && $data[$key] !== '') ? $data[$key] : 'Not specified';
        };

        $rows = [];
        $rows[] = ['Capability', rfq_capability_label($cap)];

        if ($cap === 'cnc' || $cap === 'both') {
            $rows[] = ['Process Type', $val('process_type')];
            $rows[] = ['Material', $val('material')];
            $rows[] = ['Tolerance', $val('tolerance')];
            $rows[] = ['Quantity', $val('quantity')];
            $rows[] = ['Free DFM Review', isset($data['dfm_review']) ? $data['dfm_review'] : 'No'];
        }
        if ($cap === 'assembly' || $cap === 'both') {
            $rows[] = ['Services', $val('services')];
            $rows[] = ['Estimated Volume', $val('volume')];
            $rows[] = ['Timeline', $val('timeline')];
        }

        $rows[] = ['Industry', $val('industry')];
        $rows[] = ['Project Description', isset($data['description']) ? $data['description'] : ''];
        return $rows;
    }
}
