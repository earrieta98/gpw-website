<?php
/**
 * GPW — RFQ secrets TEMPLATE (committed; safe to share).
 * --------------------------------------------------------------
 * The reCAPTCHA SECRET key must never be committed to git.
 *
 * Provide it in ONE of two ways (env var preferred):
 *   1. Set the GPW_RECAPTCHA_SECRET environment variable in cPanel
 *      (Software → "Setup Environment Variables" / MultiPHP INI), OR
 *   2. Copy this file to  rfq-secrets.php  (which is gitignored) and
 *      paste the real secret below.
 *
 * Get/rotate the secret at https://www.google.com/recaptcha/admin
 */
return [
    'recaptcha_secret' => 'YOUR_RECAPTCHA_SECRET_HERE',
];
