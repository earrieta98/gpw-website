<?php
/**
 * GPW — Unified RFQ Form Processor (Issue #05)
 * --------------------------------------------------------------
 * Thin entrypoint over rfq-lib.php. Extends the prior EMS handler:
 * same reCAPTCHA v3 gating, field sanitization, CAD-capable upload
 * validation, JSON {success,message} envelope and HTTP status codes,
 * mail() to sales + branded auto-reply — now capability-aware so each
 * lead is tagged CNC / Assembly / Both / Triage.
 *
 * Routing model (current): tag-only — all leads go to the shared sales
 * inboxes, tagged by capability in the subject and body. See
 * rfq_recipients() in rfq-lib.php for the per-capability branch point.
 */

require __DIR__ . '/rfq-lib.php';

// ── Config ──────────────────────────────────────────────
$config = [
    'recaptcha_secret'   => '6Lf9UJssAAAAADAH1L--Id7n9Ete4fwd6wl5wQCw',
    'recaptcha_action'   => 'submit_rfq',
    'score_threshold'    => 0.5,
    'to_emails'          => ['sales@gpw-solutions.com', 'ventas@gpw-solutions.com'],
    'from_email'         => 'noreply@gpw-solutions.com',
    'max_file_size'      => 10 * 1024 * 1024, // 10 MB
    'allowed_extensions' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'dwg', 'dxf', 'step', 'stp', 'iges', 'igs', 'zip', 'rar', 'png', 'jpg', 'jpeg'],
    'upload_dir'         => __DIR__ . '/uploads/',
];

header('Content-Type: application/json; charset=utf-8');

function rfq_fail($code, $message) {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

// ── Method check ────────────────────────────────────────
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    rfq_fail(405, 'Method not allowed.');
}

// ── reCAPTCHA verification (v3, action-checked) ─────────
$verifier = rfq_google_verifier($config['recaptcha_secret'], $_SERVER['REMOTE_ADDR'] ?? '');
$captcha = rfq_verify_recaptcha(
    $_POST['recaptcha_token'] ?? '',
    $config['score_threshold'],
    $config['recaptcha_action'],
    $verifier
);
if (!$captcha['ok']) {
    rfq_fail($captcha['code'], $captcha['message']);
}

// ── Collect + sanitize ──────────────────────────────────
$data = rfq_collect($_POST);

// ── Validate capability (drives routing) ────────────────
if ($data['capability'] === null) {
    rfq_fail(400, 'Please choose what you would like us to quote.');
}

// ── Validate required fields ────────────────────────────
if (!empty(rfq_missing_required($data))) {
    rfq_fail(400, 'Required fields are missing.');
}

// ── Handle file upload (optional, CAD-capable) ──────────
$attachment_path = '';
$attachment_name = '';
$upload = rfq_validate_upload($_FILES['attachment'] ?? null, $config['allowed_extensions'], $config['max_file_size']);
if ($upload['status'] === 'error') {
    rfq_fail(400, $upload['message']);
}
if ($upload['status'] === 'ok') {
    $file = $_FILES['attachment'];
    if (!is_dir($config['upload_dir'])) {
        mkdir($config['upload_dir'], 0755, true);
    }
    $safe_name   = preg_replace('/[^a-zA-Z0-9._-]/', '_', $file['name']);
    $unique_name = date('Ymd_His') . '_' . $safe_name;
    $attachment_path = $config['upload_dir'] . $unique_name;
    // Use the sanitized name in MIME headers too — never the raw client
    // filename, which could carry CR/LF or quotes and inject headers.
    $attachment_name = $safe_name;
    if (!move_uploaded_file($file['tmp_name'], $attachment_path)) {
        rfq_fail(500, 'File upload failed.');
    }
}

// ── Resolve display values ──────────────────────────────
$capability = $data['capability'];
$company    = $data['company'];
$contact    = $data['contact_name'];
$email      = $data['email'];
$phone      = $data['phone']    !== '' ? $data['phone']    : 'Not provided';
$referral   = $data['referral'] !== '' ? $data['referral'] : 'Not specified';
$industry   = $data['industry'] !== '' ? $data['industry'] : 'Not specified';

// ── Build sales email ───────────────────────────────────
$boundary = md5(uniqid((string) mt_rand(), true));
$subject  = rfq_build_subject($capability, $company, $industry);

// Project rows are capability-aware; values are already sanitized.
$rows_html = '';
foreach (rfq_email_rows($data) as $row) {
    $label = htmlspecialchars($row[0], ENT_QUOTES, 'UTF-8');
    $value = nl2br($row[1]);
    $rows_html .= "<tr><td style='padding:8px;font-weight:bold;width:200px;border-bottom:1px solid #eee;vertical-align:top;'>{$label}</td>"
        . "<td style='padding:8px;border-bottom:1px solid #eee;'>{$value}</td></tr>";
}

$cap_tag = rfq_capability_tag($capability);

$html_body = "
<html><body style='font-family:Arial,sans-serif;color:#333;'>
<h2 style='color:#095F5C;border-bottom:2px solid #F27257;padding-bottom:8px;'>New RFQ Submission &mdash; {$cap_tag}</h2>

<h3 style='color:#205364;'>Project Details</h3>
<table style='width:100%;border-collapse:collapse;'>
{$rows_html}
</table>

<h3 style='color:#205364;margin-top:20px;'>Contact Information</h3>
<table style='width:100%;border-collapse:collapse;'>
<tr><td style='padding:8px;font-weight:bold;width:200px;border-bottom:1px solid #eee;'>Company</td><td style='padding:8px;border-bottom:1px solid #eee;'>{$company}</td></tr>
<tr><td style='padding:8px;font-weight:bold;border-bottom:1px solid #eee;'>Contact Name</td><td style='padding:8px;border-bottom:1px solid #eee;'>{$contact}</td></tr>
<tr><td style='padding:8px;font-weight:bold;border-bottom:1px solid #eee;'>Email</td><td style='padding:8px;border-bottom:1px solid #eee;'><a href='mailto:{$email}'>{$email}</a></td></tr>
<tr><td style='padding:8px;font-weight:bold;border-bottom:1px solid #eee;'>Phone</td><td style='padding:8px;border-bottom:1px solid #eee;'>{$phone}</td></tr>
<tr><td style='padding:8px;font-weight:bold;border-bottom:1px solid #eee;'>How They Found GPW</td><td style='padding:8px;border-bottom:1px solid #eee;'>{$referral}</td></tr>
</table>

<p style='margin-top:20px;font-size:12px;color:#999;'>Capability: {$cap_tag} &nbsp;|&nbsp; reCAPTCHA score: " . ($captcha['score'] ?? 'N/A') . " &nbsp;|&nbsp; Submitted: " . date('Y-m-d H:i:s T') . "</p>
</body></html>";

// ── Build MIME message ──────────────────────────────────
$reply_name = rfq_header_safe($contact);
$headers  = "From: GPW RFQ System <{$config['from_email']}>\r\n";
$headers .= "Reply-To: {$reply_name} <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";

if ($attachment_path && file_exists($attachment_path)) {
    $headers .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";
    $file_content = chunk_split(base64_encode(file_get_contents($attachment_path)));

    $body  = "--{$boundary}\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n\r\n";
    $body .= $html_body . "\r\n\r\n";
    $body .= "--{$boundary}\r\n";
    $body .= "Content-Type: application/octet-stream; name=\"{$attachment_name}\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n";
    $body .= "Content-Disposition: attachment; filename=\"{$attachment_name}\"\r\n\r\n";
    $body .= $file_content . "\r\n";
    $body .= "--{$boundary}--";
} else {
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body = $html_body;
}

// ── Send to sales (capability-routed recipients) ────────
// Success = at least one recipient accepted; a single inbox outage must not
// fail the whole submission. Per-recipient failures are logged.
$sent = false;
foreach (rfq_recipients($capability, $config) as $to) {
    if (mail($to, $subject, $body, $headers)) {
        $sent = true;
    } else {
        error_log("RFQ: mail() failed to {$to}");
    }
}

// ── Auto-reply to submitter ─────────────────────────────
$auto_subject = "GPW has received your request — " . rfq_header_safe($company);
$auto_body = "
<html><body style='font-family:Arial,sans-serif;color:#333;'>
<p>Dear {$contact},</p>
<p>Thank you for submitting your Request for Quote to <strong>Global Precision Works</strong>.</p>
<p>Our engineering team has received your project details and will respond within <strong>24 business hours</strong> with an initial assessment.</p>
<p><strong>What happens next:</strong></p>
<ol>
<li>Engineering review of your project scope and requirements</li>
<li>Preliminary assessment and any follow-up questions</li>
<li>A detailed quote with pricing, lead time, and recommendations</li>
</ol>
<p>If you need to add information or have urgent questions, reply to this email or contact us directly.</p>
<p>Best regards,<br><strong>GPW Engineering Team</strong><br>Global Precision Works<br>Monterrey, Mexico</p>
</body></html>";

$auto_headers  = "From: GPW Engineering Team <{$config['from_email']}>\r\n";
$auto_headers .= "Reply-To: sales@gpw-solutions.com\r\n";
$auto_headers .= "MIME-Version: 1.0\r\n";
$auto_headers .= "Content-Type: text/html; charset=UTF-8\r\n";

mail($email, $auto_subject, $auto_body, $auto_headers);

// ── Respond ─────────────────────────────────────────────
if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Your RFQ has been submitted successfully.']);
} else {
    // No recipient accepted the message — don't leave the upload orphaned.
    if ($attachment_path && file_exists($attachment_path)) {
        @unlink($attachment_path);
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'There was a problem sending your request. Please email sales@gpw-solutions.com directly.']);
}
