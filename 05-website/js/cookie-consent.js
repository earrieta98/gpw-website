/* ============================================
   GPW — Cookie Consent Banner
   GDPR/CCPA-ready cookie consent with
   localStorage persistence
   ============================================ */

(function() {
  'use strict';

  var STORAGE_KEY = 'gpw_cookie_consent';

  // Public API: other scripts check this before firing tracking
  window.gpwCookieConsent = function() {
    return localStorage.getItem(STORAGE_KEY) === 'accepted';
  };

  // If user already responded, don't show banner
  if (localStorage.getItem(STORAGE_KEY)) return;

  // Inject styles
  var style = document.createElement('style');
  style.textContent = [
    '.cc-banner{position:fixed;bottom:0;left:0;right:0;z-index:9999;',
    'background:#1a1a1a;border-top:1px solid rgba(255,255,255,.08);',
    'padding:16px 24px;font-family:Lato,sans-serif;',
    'transform:translateY(100%);opacity:0;',
    'transition:transform .4s ease,opacity .4s ease;}',

    '.cc-banner--visible{transform:translateY(0);opacity:1;}',

    '.cc-inner{max-width:1140px;margin:0 auto;',
    'display:flex;align-items:center;justify-content:space-between;',
    'gap:20px;flex-wrap:wrap;}',

    '.cc-text{color:rgba(255,255,255,.85);font-size:14px;line-height:1.6;',
    'flex:1 1 400px;margin:0;}',

    '.cc-text a{color:#23555A;text-decoration:underline;}',
    '.cc-text a:hover{color:#ED835E;}',

    '.cc-actions{display:flex;gap:10px;flex-shrink:0;}',

    '.cc-btn{font-family:Lato,sans-serif;font-size:14px;font-weight:700;',
    'padding:10px 24px;border-radius:4px;cursor:pointer;',
    'transition:background .2s,color .2s,border-color .2s;',
    'border:2px solid transparent;line-height:1;}',

    '.cc-btn--accept{background:#ED835E;color:#fff;border-color:#ED835E;}',
    '.cc-btn--accept:hover{background:#d96f4a;border-color:#d96f4a;}',

    '.cc-btn--decline{background:transparent;color:rgba(255,255,255,.7);',
    'border-color:rgba(255,255,255,.25);}',
    '.cc-btn--decline:hover{color:#fff;border-color:rgba(255,255,255,.5);}',

    '@media(max-width:600px){',
    '.cc-inner{flex-direction:column;text-align:center;}',
    '.cc-actions{width:100%;justify-content:center;}',
    '.cc-text{flex-basis:100%;}}'
  ].join('\n');
  document.head.appendChild(style);

  // Inject banner HTML
  var banner = document.createElement('div');
  banner.className = 'cc-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.innerHTML =
    '<div class="cc-inner">' +
      '<p class="cc-text">' +
        'We use cookies to analyze site traffic and improve your experience. ' +
        'By clicking &ldquo;Accept,&rdquo; you consent to our use of analytics cookies. ' +
        '<a href="/privacy-policy.html">Privacy Policy</a>' +
      '</p>' +
      '<div class="cc-actions">' +
        '<button class="cc-btn cc-btn--decline" id="ccDecline">Decline</button>' +
        '<button class="cc-btn cc-btn--accept" id="ccAccept">Accept</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(banner);

  // Animate in after brief delay
  requestAnimationFrame(function() {
    setTimeout(function() {
      banner.classList.add('cc-banner--visible');
    }, 500);
  });

  function closeBanner(choice) {
    localStorage.setItem(STORAGE_KEY, choice);
    banner.classList.remove('cc-banner--visible');
    setTimeout(function() {
      banner.remove();
    }, 400);
  }

  document.getElementById('ccAccept').addEventListener('click', function() {
    closeBanner('accepted');
  });

  document.getElementById('ccDecline').addEventListener('click', function() {
    closeBanner('declined');
  });
})();
