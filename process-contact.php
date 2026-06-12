<?php
/**
 * GPW — Contact form handler.
 * --------------------------------------------------------------
 * Plain server-side POST endpoint for the general Contact page form
 * (no file upload, no capability routing). Reuses the RFQ library's
 * sanitizers so behaviour matches the RFQ handler. Anti-spam is a hidden
 * honeypot field; add reCAPTCHA later if abuse appears. Works without
 * JavaScript: it mail()s to sales and 302-redirects back to the Contact
 * page with a ?sent=1 / ?error=1 status the page reads to show a banner.
 */
require __DIR__ . '/request-a-quote/rfq-lib.php';

function contact_redirect($status) {
    header('Location: /contact.html?' . $status . '#contact-form');
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    contact_redirect('error=1');
}

// Honeypot — a real user never fills this hidden field. Silently drop bots.
if (trim($_POST['website'] ?? '') !== '') {
    contact_redirect('sent=1');
}

$name    = rfq_clean($_POST['name'] ?? '');
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$company = rfq_clean($_POST['company'] ?? '');
$phone   = rfq_clean($_POST['phone'] ?? '');
$topic   = rfq_clean($_POST['topic'] ?? 'general');
$message = rfq_clean($_POST['message'] ?? '');

if ($name === '' || $email === false || $message === '') {
    contact_redirect('error=1');
}

$to      = 'sales@gpw-solutions.com';
$from    = 'noreply@gpw-solutions.com';
$company_label = $company !== '' ? $company : $name;
$subject = rfq_header_safe('New contact message — ' . $topic . ' — ' . $company_label);

$html = "<html><body style='font-family:Arial,sans-serif;color:#333;'>"
  . "<h2 style='color:#095F5C;border-bottom:2px solid #F27257;padding-bottom:8px;'>New Contact Message</h2>"
  . "<table style='width:100%;border-collapse:collapse;'>"
  . "<tr><td style='padding:8px;font-weight:bold;width:180px;border-bottom:1px solid #eee;'>Name</td><td style='padding:8px;border-bottom:1px solid #eee;'>{$name}</td></tr>"
  . "<tr><td style='padding:8px;font-weight:bold;border-bottom:1px solid #eee;'>Company</td><td style='padding:8px;border-bottom:1px solid #eee;'>" . ($company !== '' ? $company : 'Not provided') . "</td></tr>"
  . "<tr><td style='padding:8px;font-weight:bold;border-bottom:1px solid #eee;'>Email</td><td style='padding:8px;border-bottom:1px solid #eee;'><a href='mailto:{$email}'>{$email}</a></td></tr>"
  . "<tr><td style='padding:8px;font-weight:bold;border-bottom:1px solid #eee;'>Phone</td><td style='padding:8px;border-bottom:1px solid #eee;'>" . ($phone !== '' ? $phone : 'Not provided') . "</td></tr>"
  . "<tr><td style='padding:8px;font-weight:bold;border-bottom:1px solid #eee;'>Topic</td><td style='padding:8px;border-bottom:1px solid #eee;'>{$topic}</td></tr>"
  . "<tr><td style='padding:8px;font-weight:bold;border-bottom:1px solid #eee;vertical-align:top;'>Message</td><td style='padding:8px;border-bottom:1px solid #eee;'>" . nl2br($message) . "</td></tr>"
  . "</table>"
  . "<p style='margin-top:20px;font-size:12px;color:#999;'>Submitted: " . date('Y-m-d H:i:s T') . "</p>"
  . "</body></html>";

$headers  = "From: GPW Website <{$from}>\r\n";
$headers .= "Reply-To: " . rfq_header_safe($name) . " <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

if (mail($to, $subject, $html, $headers)) {
    contact_redirect('sent=1');
}

error_log('Contact: mail() failed');
contact_redirect('error=1');
