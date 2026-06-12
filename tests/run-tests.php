<?php
/**
 * GPW — Unified RFQ logic tests (Issue #05)
 * --------------------------------------------------------------
 * Dependency-free test runner for request-a-quote/rfq-lib.php.
 * No framework, no Composer — run with:
 *
 *     php tests/run-tests.php
 *
 * Covers the four logic axes the PRD calls out (module C):
 *   1. Capability routing  — cnc/assembly/both/unsure -> tag, label,
 *                            subject, recipients, capability-aware rows.
 *   2. Field validation    — required fields, email, capability normalize.
 *   3. Upload validation    — allowed/ disallowed extensions, size, none.
 *   4. reCAPTCHA gating     — missing token, !success, low score, wrong
 *                            action, valid (verifier injected/mocked).
 *
 * Tests assert externally-observable behavior, not implementation details.
 */

error_reporting(E_ALL);
require __DIR__ . '/../request-a-quote/rfq-lib.php';

// ── Tiny assertion harness ──────────────────────────────
$GLOBALS['__pass'] = 0;
$GLOBALS['__fail'] = 0;
$GLOBALS['__fails'] = [];

function ok($cond, $label) {
    if ($cond) {
        $GLOBALS['__pass']++;
    } else {
        $GLOBALS['__fail']++;
        $GLOBALS['__fails'][] = $label;
        echo "  FAIL: {$label}\n";
    }
}

function eq($actual, $expected, $label) {
    $cond = ($actual === $expected);
    if (!$cond) {
        $a = var_export($actual, true);
        $e = var_export($expected, true);
        $label .= "  (got {$a}, expected {$e})";
    }
    ok($cond, $label);
}

function section($name) {
    echo "\n# {$name}\n";
}

// Shared config used by recipient routing.
$config = ['to_emails' => ['sales@gpw-solutions.com', 'ventas@gpw-solutions.com']];

// Mock verifier factory: returns a callable yielding a fixed response.
function mock_verifier(array $response) {
    return function ($token) use ($response) { return $response; };
}

// A minimal valid POST for a CNC submission.
function base_post(array $overrides = []) {
    return array_merge([
        'capability'   => 'cnc',
        'company'      => 'Acme OEM',
        'contact_name' => 'Jane Buyer',
        'email'        => 'jane@acme.com',
        'description'  => 'Need 200 machined brackets, 6061-T6.',
        'recaptcha_token' => 'tok',
    ], $overrides);
}

// =====================================================================
section('1. Capability normalization, labels, tags');

eq(rfq_normalize_capability('cnc'), 'cnc', 'normalize cnc');
eq(rfq_normalize_capability('CNC'), 'cnc', 'normalize is case-insensitive');
eq(rfq_normalize_capability(' both '), 'both', 'normalize trims');
eq(rfq_normalize_capability('assembly'), 'assembly', 'normalize assembly');
eq(rfq_normalize_capability('unsure'), 'unsure', 'normalize unsure');
eq(rfq_normalize_capability('hacker'), null, 'unknown capability -> null');
eq(rfq_normalize_capability(''), null, 'empty capability -> null');

eq(rfq_capability_tag('cnc'), 'CNC', 'tag cnc');
eq(rfq_capability_tag('assembly'), 'Assembly', 'tag assembly');
eq(rfq_capability_tag('both'), 'CNC + Assembly', 'tag both');
eq(rfq_capability_tag('unsure'), 'Triage', 'tag unsure -> Triage');

eq(rfq_capability_label('cnc'), 'CNC Machining', 'label cnc');
eq(rfq_capability_label('assembly'), 'Assembly & Integration', 'label assembly');

// =====================================================================
section('1b. Capability routing -> subject + recipients + rows');

// Subjects carry the capability tag.
ok(strpos(rfq_build_subject('cnc', 'Acme', 'Aerospace & Defense'), 'New CNC RFQ: Acme') === 0, 'cnc subject prefix');
ok(strpos(rfq_build_subject('assembly', 'Acme', 'Not specified'), 'New Assembly RFQ: Acme') === 0, 'assembly subject prefix');
ok(strpos(rfq_build_subject('both', 'Acme', 'Telecom'), 'New CNC + Assembly RFQ: Acme') === 0, 'both subject prefix');
ok(strpos(rfq_build_subject('unsure', 'Acme', 'Not specified'), 'New Triage RFQ: Acme') === 0, 'unsure subject prefix');
ok(strpos(rfq_build_subject('cnc', 'Acme', 'Aerospace & Defense'), '— Aerospace & Defense') !== false, 'subject appends real industry');
ok(strpos(rfq_build_subject('cnc', 'Acme', 'Not specified'), '—') === false, 'subject omits "Not specified" industry');

// Tag-only recipients: every capability -> shared sales inboxes.
foreach (['cnc', 'assembly', 'both', 'unsure'] as $cap) {
    eq(rfq_recipients($cap, $config), $config['to_emails'], "recipients tag-only for {$cap}");
}

// Capability-aware email rows.
function row_labels(array $rows) {
    return array_map(function ($r) { return $r[0]; }, $rows);
}

$cncRows = row_labels(rfq_email_rows(rfq_collect(base_post(['capability' => 'cnc', 'process_type' => 'CNC Milling']))));
ok(in_array('Process Type', $cncRows, true), 'cnc rows include Process Type');
ok(in_array('Free DFM Review', $cncRows, true), 'cnc rows include Free DFM Review');
ok(!in_array('Services', $cncRows, true), 'cnc rows exclude Services');

$asmRows = row_labels(rfq_email_rows(rfq_collect(base_post(['capability' => 'assembly']))));
ok(in_array('Services', $asmRows, true), 'assembly rows include Services');
ok(in_array('Timeline', $asmRows, true), 'assembly rows include Timeline');
ok(!in_array('Process Type', $asmRows, true), 'assembly rows exclude Process Type');

$bothRows = row_labels(rfq_email_rows(rfq_collect(base_post(['capability' => 'both']))));
ok(in_array('Process Type', $bothRows, true), 'both rows include Process Type');
ok(in_array('Services', $bothRows, true), 'both rows include Services');

$triageRows = row_labels(rfq_email_rows(rfq_collect(base_post(['capability' => 'unsure']))));
ok(!in_array('Process Type', $triageRows, true), 'triage rows exclude CNC fields');
ok(!in_array('Services', $triageRows, true), 'triage rows exclude assembly fields');
ok(in_array('Project Description', $triageRows, true), 'triage rows still include description');

// DFM checkbox normalization.
eq(rfq_collect(base_post(['dfm_review' => 'Yes']))['dfm_review'], 'Yes', 'dfm checked -> Yes');
eq(rfq_collect(base_post([]))['dfm_review'], 'No', 'dfm absent -> No');

// Services array -> comma-joined string.
eq(
    rfq_collect(base_post(['capability' => 'assembly', 'services' => ['Box Build Integration', 'System Integration']]))['services'],
    'Box Build Integration, System Integration',
    'services array joined'
);

// =====================================================================
section('2. Field validation (required + email)');

eq(rfq_missing_required(rfq_collect(base_post())), [], 'valid CNC post -> nothing missing');
eq(rfq_missing_required(rfq_collect(base_post(['capability' => 'unsure']))), [], 'valid triage post -> nothing missing');

ok(in_array('company', rfq_missing_required(rfq_collect(base_post(['company' => ''])))), 'missing company flagged');
ok(in_array('contact_name', rfq_missing_required(rfq_collect(base_post(['contact_name' => ''])))), 'missing contact_name flagged');
ok(in_array('description', rfq_missing_required(rfq_collect(base_post(['description' => ''])))), 'missing description flagged');
ok(in_array('capability', rfq_missing_required(rfq_collect(base_post(['capability' => 'bogus'])))), 'invalid capability flagged as missing');
ok(in_array('email', rfq_missing_required(rfq_collect(base_post(['email' => 'not-an-email'])))), 'invalid email flagged');

eq(rfq_validate_email('jane@acme.com'), 'jane@acme.com', 'valid email passes');
eq(rfq_validate_email('  jane@acme.com '), 'jane@acme.com', 'email trimmed');
eq(rfq_validate_email('nope'), false, 'invalid email -> false');
eq(rfq_validate_email(''), false, 'empty email -> false');

// Sanitization strips tags / encodes entities (XSS guard).
$dirty = rfq_collect(base_post(['company' => "<script>alert('x')</script>Acme & Co"]));
ok(strpos($dirty['company'], '<script>') === false, 'sanitizer strips <script>');
ok(strpos($dirty['company'], '&amp;') !== false, 'sanitizer encodes ampersand');

// Email-header injection guard: CR/LF stripped from header-bound fields.
$inject = rfq_header_safe("Jane\r\nBcc: evil@x.com");
ok(strpos($inject, "\r") === false && strpos($inject, "\n") === false, 'header_safe strips CR/LF');
$injSubject = rfq_build_subject('cnc', "Acme\r\nBcc: evil@x.com", 'Not specified');
ok(strpos($injSubject, "\n") === false && strpos($injSubject, "\r") === false, 'subject has no CR/LF from company');

// =====================================================================
section('3. Upload validation');

$allowed = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'dwg', 'dxf', 'step', 'stp', 'iges', 'igs', 'zip', 'rar', 'png', 'jpg', 'jpeg'];
$max = 10 * 1024 * 1024;

function fake_file($name, $size, $error = UPLOAD_ERR_OK) {
    return ['name' => $name, 'size' => $size, 'error' => $error, 'tmp_name' => '/tmp/x'];
}

// No file is valid (optional upload).
eq(rfq_validate_upload(null, $allowed, $max)['status'], 'none', 'null file -> none');
eq(rfq_validate_upload(fake_file('x', 0, UPLOAD_ERR_NO_FILE), $allowed, $max)['status'], 'none', 'UPLOAD_ERR_NO_FILE -> none');

// CAD formats accepted.
foreach (['part.step', 'part.STP', 'model.iges', 'model.igs', 'drawing.dwg', 'drawing.dxf', 'spec.pdf', 'bundle.zip'] as $f) {
    eq(rfq_validate_upload(fake_file($f, 1024), $allowed, $max)['status'], 'ok', "accepts {$f}");
}

// Disallowed extensions rejected.
foreach (['evil.exe', 'evil.php', 'script.js', 'archive.7z'] as $f) {
    eq(rfq_validate_upload(fake_file($f, 1024), $allowed, $max)['status'], 'error', "rejects {$f}");
}

// Oversized rejected with the size message.
$big = rfq_validate_upload(fake_file('huge.step', 11 * 1024 * 1024), $allowed, $max);
eq($big['status'], 'error', 'oversized -> error');
ok(strpos($big['message'], '10 MB') !== false, 'oversized message mentions 10 MB');

// Upstream upload error surfaced.
eq(rfq_validate_upload(fake_file('x.pdf', 1024, UPLOAD_ERR_PARTIAL), $allowed, $max)['status'], 'error', 'partial upload -> error');

// =====================================================================
section('4. reCAPTCHA gating');

$threshold = 0.5;
$action = 'submit_rfq';

// Missing token -> 400 before the verifier is ever called.
$called = false;
$spy = function ($t) use (&$called) { $called = true; return ['success' => true, 'score' => 0.9, 'action' => 'submit_rfq']; };
$r = rfq_verify_recaptcha('', $threshold, $action, $spy);
ok(!$r['ok'] && $r['code'] === 400, 'missing token -> not ok, 400');
ok($called === false, 'verifier not called when token missing');

// success=false -> 403.
$r = rfq_verify_recaptcha('tok', $threshold, $action, mock_verifier(['success' => false]));
ok(!$r['ok'] && $r['code'] === 403, 'success=false -> 403');

// Low score -> 403.
$r = rfq_verify_recaptcha('tok', $threshold, $action, mock_verifier(['success' => true, 'score' => 0.3, 'action' => 'submit_rfq']));
ok(!$r['ok'] && $r['code'] === 403, 'low score -> 403');

// Wrong action -> 403 (improvement over legacy).
$r = rfq_verify_recaptcha('tok', $threshold, $action, mock_verifier(['success' => true, 'score' => 0.9, 'action' => 'login']));
ok(!$r['ok'] && $r['code'] === 403, 'wrong action -> 403');

// Valid: success + score >= threshold + matching action -> ok.
$r = rfq_verify_recaptcha('tok', $threshold, $action, mock_verifier(['success' => true, 'score' => 0.9, 'action' => 'submit_rfq']));
ok($r['ok'] && $r['code'] === 200, 'valid token -> ok, 200');
eq($r['score'], 0.9, 'valid token returns score');

// Score exactly at threshold passes.
$r = rfq_verify_recaptcha('tok', $threshold, $action, mock_verifier(['success' => true, 'score' => 0.5, 'action' => 'submit_rfq']));
ok($r['ok'], 'score == threshold passes');

// Response missing the action field is rejected (strict action binding).
$r = rfq_verify_recaptcha('tok', $threshold, $action, mock_verifier(['success' => true, 'score' => 0.8]));
ok(!$r['ok'] && $r['code'] === 403, 'missing action field in response -> 403 (strict)');

// =====================================================================
$pass = $GLOBALS['__pass'];
$fail = $GLOBALS['__fail'];
echo "\n────────────────────────────────────────\n";
echo "Passed: {$pass}   Failed: {$fail}\n";
if ($fail > 0) {
    echo "FAILURES:\n - " . implode("\n - ", $GLOBALS['__fails']) . "\n";
    exit(1);
}
echo "All tests passed.\n";
exit(0);
