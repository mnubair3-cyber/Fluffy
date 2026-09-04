/* =========================================================
   FLUFFISTRY — script.js
   Loaded on every page. Every feature checks that its
   elements exist before touching them, so no page throws
   console errors regardless of which markup is present.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------
     1. MOBILE NAVIGATION
     --------------------------------------------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    var closeMenu = function () {
      navToggle.classList.remove('is-open');
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };
    var openMenu = function () {
      navToggle.classList.add('is-open');
      navLinks.classList.add('is-open');
      navToggle.setAttribute('aria-expanded', 'true');
    };

    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (navLinks.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close after selecting a link
    var navLinkItems = navLinks.querySelectorAll('a');
    navLinkItems.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    // Close when clicking outside the menu / toggle
    document.addEventListener('click', function (e) {
      if (!navLinks.classList.contains('is-open')) return;
      var clickedInsideMenu = navLinks.contains(e.target);
      var clickedToggle = navToggle.contains(e.target);
      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  /* ---------------------------------------------------
     2. ACTIVE NAV LINK HIGHLIGHT
     --------------------------------------------------- */
  var currentPage = (window.location.pathname.split('/').pop() || 'index.html');
  if (currentPage === '') currentPage = 'index.html';
  var allNavLinks = document.querySelectorAll('.nav-links a, .footer-col a');
  allNavLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    if (href === currentPage || (currentPage === 'index.html' && href === './')) {
      link.classList.add('active');
    }
  });

  /* ---------------------------------------------------
     3. SCROLL REVEAL (IntersectionObserver, with fallback)
     --------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

      revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
      // No IntersectionObserver support: just show everything
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* ---------------------------------------------------
     4. HERO VIDEO FALLBACK
     --------------------------------------------------- */
  var heroVideo = document.querySelector('.hero-media video');
  var heroFallback = document.querySelector('.hero-fallback');
  if (heroVideo) {
    var showFallback = function () {
      heroVideo.style.display = 'none';
      if (heroFallback) heroFallback.style.display = 'block';
    };
    heroVideo.addEventListener('error', showFallback);
    // If the video has no playable source at all, catch that too
    heroVideo.addEventListener('stalled', function () {
      if (heroVideo.readyState === 0) showFallback();
    });
  }

  /* ---------------------------------------------------
     5. PORTFOLIO FILTER
     --------------------------------------------------- */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var category = btn.getAttribute('data-filter');

        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        galleryItems.forEach(function (item) {
          var itemCategory = item.getAttribute('data-category');
          if (category === 'all' || itemCategory === category) {
            item.classList.remove('is-hidden');
          } else {
            item.classList.add('is-hidden');
          }
        });
      });
    });
  }

  /* ---------------------------------------------------
     6. PORTFOLIO LIGHTBOX
     --------------------------------------------------- */
  var lightbox = document.querySelector('.lightbox');
  var lightboxImg = document.querySelector('.lightbox-img');
  var lightboxCaption = document.querySelector('.lightbox-caption');
  var lightboxClose = document.querySelector('.lightbox-close');

  if (lightbox && lightboxImg && galleryItems.length) {
    var openLightbox = function (item) {
      var img = item.querySelector('img');
      var title = item.querySelector('h3');
      var cat = item.querySelector('.gallery-cat');
      if (!img) return;

      lightboxImg.src = img.getAttribute('src');
      lightboxImg.alt = img.getAttribute('alt') || '';

      if (lightboxCaption) {
        var titleText = title ? title.textContent : '';
        var catText = cat ? cat.textContent : '';
        lightboxCaption.textContent = catText && titleText ? (titleText + ' — ' + catText) : titleText;
      }

      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    var closeLightbox = function () {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () { openLightbox(item); });
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item);
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close when clicking the dark backdrop (outside the image)
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Close with Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

  /* ---------------------------------------------------
     7. FAQ ACCORDION
     --------------------------------------------------- */
  var accordionItems = document.querySelectorAll('.accordion-item');
  if (accordionItems.length) {
    accordionItems.forEach(function (item) {
      var trigger = item.querySelector('.accordion-trigger');
      var panel = item.querySelector('.accordion-panel');
      if (!trigger || !panel) return;

      trigger.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Close all
        accordionItems.forEach(function (other) {
          other.classList.remove('is-open');
          var otherPanel = other.querySelector('.accordion-panel');
          var otherTrigger = other.querySelector('.accordion-trigger');
          if (otherPanel) otherPanel.style.maxHeight = null;
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        });

        // Open this one if it wasn't already open
        if (!isOpen) {
          item.classList.add('is-open');
          panel.style.maxHeight = panel.scrollHeight + 'px';
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ---------------------------------------------------
     8. CONTACT FORM (EmailJS-ready, safe if library absent)
     --------------------------------------------------- */
  var contactForm = document.querySelector('#commission-form');
  if (contactForm) {
    var statusEl = document.querySelector('.form-status');

    // Only attempt to initialize EmailJS if the library was actually loaded.
    // FLUFFISTRY does not load the EmailJS script by default; when the
    // studio is ready to connect a live inbox, add the EmailJS <script>
    // tag to contact.html and set the IDs below.
    var EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
    var EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
    var EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
    var emailjsReady = (typeof window.emailjs !== 'undefined');

    if (emailjsReady) {
      try {
        window.emailjs.init(EMAILJS_PUBLIC_KEY);
      } catch (err) {
        emailjsReady = false;
      }
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (statusEl) {
        statusEl.textContent = 'Sending your commission request…';
      }

      if (emailjsReady) {
        window.emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
          .then(function () {
            if (statusEl) statusEl.textContent = 'Thank you — your request has been sent. We reply within 2–3 business days.';
            contactForm.reset();
          })
          .catch(function () {
            if (statusEl) statusEl.textContent = 'Something went wrong sending your message. Please email us directly at hello@fluffistry.studio.';
          });
      } else {
        // Graceful fallback when EmailJS isn't connected yet.
        if (statusEl) {
          statusEl.textContent = 'Thank you — your request has been noted. Please also reach us at hello@fluffistry.studio to guarantee delivery.';
        }
        contactForm.reset();
      }
    });
  }

  /* ---------------------------------------------------
     9. FOOTER YEAR (safety-checked, in case markup changes)
     --------------------------------------------------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
