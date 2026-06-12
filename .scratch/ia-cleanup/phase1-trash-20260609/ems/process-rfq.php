<?php
/**
 * GPW — RFQ Form Processor
 * Handles form submission with reCAPTCHA v3 validation,
 * file upload, and email to sales team.
 */

// ── Config ──────────────────────────────────────────────
$recaptcha_secret = '6Lf9UJssAAAAADAH1L--Id7n9Ete4fwd6wl5wQCw';
$to_emails = ['sales@gpw-solutions.com', 'ventas@gpw-solutions.com'];
$from_email = 'noreply@gpw-solutions.com';
$score_threshold = 0.5;
$max_file_size = 10 * 1024 * 1024; // 10 MB
$allowed_extensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'dwg', 'dxf', 'step', 'stp', 'iges', 'igs', 'zip', 'rar', 'png', 'jpg', 'jpeg'];
$upload_dir = __DIR__ . '/uploads/';

// ── CORS & method check ─────────────────────────────────
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ── reCAPTCHA verification ──────────────────────────────
$token = $_POST['recaptcha_token'] ?? '';
if (!$token) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'reCAPTCHA token missing.']);
    exit;
}

$verify = file_get_contents('https://www.google.com/recaptcha/api/siteverify?' . http_build_query([
    'secret' => $recaptcha_secret,
    'response' => $token,
    'remoteip' => $_SERVER['REMOTE_ADDR']
]));

$result = json_decode($verify, true);

if (!$result['success'] || ($result['score'] ?? 0) < $score_threshold) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'reCAPTCHA verification failed. Please try again.']);
    exit;
}

// ── Sanitize form fields ────────────────────────────────
function clean($val) {
    return htmlspecialchars(strip_tags(trim($val ?? '')), ENT_QUOTES, 'UTF-8');
}

$industry    = clean($_POST['industry'] ?? '');
$services    = isset($_POST['services']) && is_array($_POST['services'])
               ? implode(', ', array_map('clean', $_POST['services']))
               : 'Not specified';
$description = clean($_POST['description'] ?? '');
$volume      = clean($_POST['volume'] ?? 'Not specified');
$timeline    = clean($_POST['timeline'] ?? 'Not specified');
$company     = clean($_POST['company'] ?? '');
$contact     = clean($_POST['contact_name'] ?? '');
$email       = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone       = clean($_POST['phone'] ?? 'Not provided');
$referral    = clean($_POST['referral'] ?? 'Not specified');

// ── Validate required fields ────────────────────────────
if (!$industry || !$description || !$company || !$contact || !$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Required fields are missing.']);
    exit;
}

// ── Handle file upload ──────────────────────────────────
$attachment_path = '';
$attachment_name = '';

if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['attachment'];

    // Check size
    if ($file['size'] > $max_file_size) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'File exceeds 10 MB limit.']);
        exit;
    }

    // Check extension
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowed_extensions)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'File type not allowed. Accepted: PDF, DOC, DOCX, XLS, XLSX, DWG, DXF, STEP, IGES, ZIP, RAR, PNG, JPG.']);
        exit;
    }

    // Create uploads dir if needed
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    // Save with unique name
    $safe_name = preg_replace('/[^a-zA-Z0-9._-]/', '_', $file['name']);
    $unique_name = date('Ymd_His') . '_' . $safe_name;
    $attachment_path = $upload_dir . $unique_name;
    $attachment_name = $file['name'];

    if (!move_uploaded_file($file['tmp_name'], $attachment_path)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'File upload failed.']);
        exit;
    }
}

// ── Build email ─────────────────────────────────────────
$boundary = md5(uniqid(time()));

$subject = "New RFQ: {$company} — {$industry}";

$html_body = "
<html><body style='font-family:Arial,sans-serif;color:#333;'>
<h2 style='color:#23555A;border-bottom:2px solid #ED835E;padding-bottom:8px;'>New RFQ Submission</h2>

<h3 style='color:#2A4E64;'>Project Details</h3>
<table style='width:100%;border-collapse:collapse;'>
<tr><td style='padding:8px;font-weight:bold;width:200px;border-bottom:1px solid #eee;'>Industry</td><td style='padding:8px;border-bottom:1px solid #eee;'>{$industry}</td></tr>
<tr><td style='padding:8px;font-weight:bold;border-bottom:1px solid #eee;'>Services Required</td><td style='padding:8px;border-bottom:1px solid #eee;'>{$services}</td></tr>
<tr><td style='padding:8px;font-weight:bold;border-bottom:1px solid #eee;'>Project Description</td><td style='padding:8px;border-bottom:1px solid #eee;'>{$description}</td></tr>
</table>

<h3 style='color:#2A4E64;margin-top:20px;'>Scope &amp; Timeline</h3>
<table style='width:100%;border-collapse:collapse;'>
<tr><td style='padding:8px;font-weight:bold;width:200px;border-bottom:1px solid #eee;'>Estimated Volume</td><td style='padding:8px;border-bottom:1px solid #eee;'>{$volume}</td></tr>
<tr><td style='padding:8px;font-weight:bold;border-bottom:1px solid #eee;'>Timeline</td><td style='padding:8px;border-bottom:1px solid #eee;'>{$timeline}</td></tr>
</table>

<h3 style='color:#2A4E64;margin-top:20px;'>Contact Information</h3>
<table style='width:100%;border-collapse:collapse;'>
<tr><td style='padding:8px;font-weight:bold;width:200px;border-bottom:1px solid #eee;'>Company</td><td style='padding:8px;border-bottom:1px solid #eee;'>{$company}</td></tr>
<tr><td style='padding:8px;font-weight:bold;border-bottom:1px solid #eee;'>Contact Name</td><td style='padding:8px;border-bottom:1px solid #eee;'>{$contact}</td></tr>
<tr><td style='padding:8px;font-weight:bold;border-bottom:1px solid #eee;'>Email</td><td style='padding:8px;border-bottom:1px solid #eee;'><a href='mailto:{$email}'>{$email}</a></td></tr>
<tr><td style='padding:8px;font-weight:bold;border-bottom:1px solid #eee;'>Phone</td><td style='padding:8px;border-bottom:1px solid #eee;'>{$phone}</td></tr>
<tr><td style='padding:8px;font-weight:bold;border-bottom:1px solid #eee;'>How They Found GPW</td><td style='padding:8px;border-bottom:1px solid #eee;'>{$referral}</td></tr>
</table>

<p style='margin-top:20px;font-size:12px;color:#999;'>reCAPTCHA score: " . ($result['score'] ?? 'N/A') . " — Submitted: " . date('Y-m-d H:i:s T') . "</p>
</body></html>";

// ── Build MIME message ──────────────────────────────────
$headers  = "From: GPW RFQ System <{$from_email}>\r\n";
$headers .= "Reply-To: {$contact} <{$email}>\r\n";
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

// ── Send emails ─────────────────────────────────────────
$sent = true;
foreach ($to_emails as $to) {
    if (!mail($to, $subject, $body, $headers)) {
        $sent = false;
    }
}

// ── Auto-reply to sender ────────────────────────────────
$auto_subject = "GPW has received your RFQ — {$company}";
$auto_body = "
<html><body style='font-family:Arial,sans-serif;color:#333;'>
<p>Dear {$contact},</p>
<p>Thank you for submitting your Request for Quote to <strong>Global Precision Works</strong>.</p>
<p>Our engineering team has received your project details and will respond within <strong>24 hours</strong> with an initial assessment.</p>
<p><strong>What happens next:</strong></p>
<ol>
<li>Engineering review of your project scope and requirements</li>
<li>Preliminary assessment and any follow-up questions (24–48 hours)</li>
<li>Formal quotation with pricing, timeline, and capabilities summary</li>
</ol>
<p>If you need to add information or have urgent questions, reply to this email or contact us directly.</p>
<p>Best regards,<br><strong>GPW Engineering Team</strong><br>Global Precision Works<br>Monterrey, Mexico</p>
</body></html>";

$auto_headers  = "From: GPW Engineering Team <{$from_email}>\r\n";
$auto_headers .= "Reply-To: sales@gpw-solutions.com\r\n";
$auto_headers .= "MIME-Version: 1.0\r\n";
$auto_headers .= "Content-Type: text/html; charset=UTF-8\r\n";

mail($email, $auto_subject, $auto_body, $auto_headers);

// ── Respond ─────────────────────────────────────────────
if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Your RFQ has been submitted successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'There was a problem sending your request. Please email sales@gpw-solutions.com directly.']);
}
