/* ============================================
   GPW — Main JavaScript
   Industrial-precision interactions
   ============================================ */

(function() {
  'use strict';

  // ---- Header: transparent → solid on scroll ----
  const header = document.getElementById('header');

  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.remove('header--top');
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
      header.classList.add('header--top');
    }
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // ---- Mobile navigation ----
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');

  function openNav() {
    navMenu.classList.add('nav--open');
    navToggle.classList.add('nav__toggle--active');
    if (navOverlay) navOverlay.classList.add('nav-overlay--visible');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    navMenu.classList.remove('nav--open');
    navToggle.classList.remove('nav__toggle--active');
    if (navOverlay) navOverlay.classList.remove('nav-overlay--visible');
    document.body.style.overflow = '';
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      if (navMenu.classList.contains('nav--open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close on overlay click
    if (navOverlay) {
      navOverlay.addEventListener('click', closeNav);
    }

    // Close on link click
    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', closeNav);
    });

    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('nav--open')) {
        closeNav();
      }
    });
  }

  // ---- Scroll reveal (IntersectionObserver) ----
  var revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function(el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything
    revealElements.forEach(function(el) {
      el.classList.add('reveal--visible');
    });
  }

  // ---- Hero entrance animation ----
  var heroElements = document.querySelectorAll('.hero-reveal');

  if (heroElements.length > 0) {
    // Trigger hero animations after a brief delay for page load
    requestAnimationFrame(function() {
      setTimeout(function() {
        heroElements.forEach(function(el) {
          el.classList.add('hero-reveal--visible');
        });
      }, 100);
    });
  }

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
