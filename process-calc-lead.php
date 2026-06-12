<?php
/**
 * GPW — CNC cost-calculator lead handler.
 * --------------------------------------------------------------
 * AJAX (fetch) endpoint for the blog cost-calculator email capture
 * (/blog/cnc-cost-mexico-vs-us-2026/). The form posts an email plus the
 * calculator context; we mail() the lead to sales and answer with JSON so
 * the page can still trigger the XLSX download without a redirect.
 *
 * Anti-spam is a hidden honeypot field ("website") — the blog page does not
 * load reCAPTCHA. Reuses the RFQ library's sanitizers (rfq_clean) and the
 * header-safety helper (rfq_header_safe) so behaviour matches the other
 * handlers. No reCAPTCHA here by design.
 */
require __DIR__ . '/request-a-quote/rfq-lib.php';

header('Content-Type: application/json; charset=UTF-8');

function calc_json($payload, $code = 200) {
    http_response_code($code);
    echo json_encode($payload);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    calc_json(['ok' => false], 405);
}

// Honeypot — a real user never fills this hidden field. Silently drop bots
// (respond ok so the bot gets no signal about the trap).
if (trim($_POST['website'] ?? '') !== '') {
    calc_json(['ok' => true]);
}

// FILTER_VALIDATE_EMAIL also blocks newline-injected addresses, so the email
// is safe to use in a Reply-To header (passed through rfq_header_safe too).
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
if ($email === false) {
    calc_json(['ok' => false, 'error' => 'email'], 422);
}

// Optional calculator context (sanitized — these only ever appear in the body).
$spend      = rfq_clean($_POST['spend'] ?? '');
$complexity = rfq_clean($_POST['complexity'] ?? '');
$rate       = rfq_clean($_POST['rate'] ?? '');
$zone       = rfq_clean($_POST['zone'] ?? '');
$result     = rfq_clean($_POST['result'] ?? '');

$to      = 'sales@gpw-solutions.com';
$from    = 'noreply@gpw-solutions.com';
$subject = rfq_header_safe('New CNC Cost-Calculator Lead');

$row = function ($label, $value) {
    $value = ($value !== '') ? $value : 'Not provided';
    return "<tr><td style='padding:8px;font-weight:bold;width:200px;border-bottom:1px solid #eee;'>{$label}</td>"
         . "<td style='padding:8px;border-bottom:1px solid #eee;'>{$value}</td></tr>";
};

$html = "<html><body style='font-family:Arial,sans-serif;color:#333;'>"
  . "<h2 style='color:#095F5C;border-bottom:2px solid #F27257;padding-bottom:8px;'>New CNC Cost-Calculator Lead</h2>"
  . "<table style='width:100%;border-collapse:collapse;'>"
  . "<tr><td style='padding:8px;font-weight:bold;width:200px;border-bottom:1px solid #eee;'>Email</td>"
  . "<td style='padding:8px;border-bottom:1px solid #eee;'><a href='mailto:{$email}'>{$email}</a></td></tr>"
  . $row('Annual CNC Spend', $spend)
  . $row('Part Complexity', $complexity)
  . $row('Current U.S. Shop Rate', $rate)
  . $row('U.S. Region / Zone', $zone)
  . $row('Estimated Annual Savings', $result)
  . "</table>"
  . "<p style='margin-top:20px;font-size:12px;color:#999;'>Source: /blog/cnc-cost-mexico-vs-us-2026/<br>"
  . "Submitted: " . date('Y-m-d H:i:s T') . "</p>"
  . "</body></html>";

$headers  = "From: GPW Website <{$from}>\r\n";
$headers .= "Reply-To: <" . rfq_header_safe($email) . ">\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

if (mail($to, $subject, $html, $headers)) {
    calc_json(['ok' => true]);
}

error_log('Calc lead: mail() failed');
calc_json(['ok' => false, 'error' => 'mail'], 500);
