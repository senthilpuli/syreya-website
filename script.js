/* ══════════════════════════════════════════════
   SYREYA RECORDING THEATRE — script.js
══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Navbar Scroll ─── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });


  /* ─── Mobile Menu ─── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /* ─── Smooth Active Nav Highlight ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinkItems = document.querySelectorAll('.nav-links a[href^="#"]');

  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -50% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkItems.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--gold)';
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));


  /* ─── Reveal Animations (Hero) ─── */
  const revealEls = document.querySelectorAll('.reveal');
  setTimeout(() => {
    revealEls.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 100);
    });
  }, 200);


  /* ─── Scroll-triggered Fade-up ─── */
  const fadeTargets = [
    '.service-card',
    '.gallery-item',
    '.portfolio-card',
    '.why-card',
    '.testi-card',
    '.about-grid',
    '.contact-grid',
    '.section-header',
    '.about-stat-block',
  ];

  // Add fade-up class to all target elements
  fadeTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('fade-up');
    });
  });

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stagger siblings
        const parent = entry.target.parentElement;
        const siblings = [...parent.querySelectorAll('.fade-up')];
        const index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 0.08}s`;
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));


  /* ─── Contact Form ─── */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = document.getElementById('fname').value.trim();
      const email   = document.getElementById('femail').value.trim();
      const service = document.getElementById('fservice').value;
      const message = document.getElementById('fmsg').value.trim();

      if (!name || !email) {
        formNote.textContent = 'Please fill in your name and email.';
        formNote.style.color = '#e74c3c';
        return;
      }

      // Build WhatsApp message
      const waText = encodeURIComponent(
        `Hi Syreya Recording Theatre!\n\nName: ${name}\nEmail: ${email}\nService: ${service || 'Not specified'}\n\nMessage: ${message || 'No additional details.'}`
      );

      formNote.textContent = '✓ Redirecting you to WhatsApp...';
      formNote.style.color = 'var(--gold)';

      setTimeout(() => {
        window.open(`https://wa.me/918248622103?text=${waText}`, '_blank');
        contactForm.reset();
        formNote.textContent = '';
      }, 800);
    });
  }


  /* ─── Scroll-to-top on logo click ─── */
  const logoLink = document.querySelector('.nav-logo');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ─── Gallery lightbox (simple) ─── */
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const label = item.querySelector('.gallery-overlay span');

      const overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      overlay.innerHTML = `
        <div class="lightbox-inner">
          <button class="lightbox-close" aria-label="Close">&times;</button>
          <img src="${img.src}" alt="${label ? label.textContent : ''}" />
          ${label ? `<p>${label.textContent}</p>` : ''}
        </div>
      `;
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      // Animate in
      requestAnimationFrame(() => overlay.classList.add('open'));

      const close = () => {
        overlay.classList.remove('open');
        setTimeout(() => {
          document.body.removeChild(overlay);
          document.body.style.overflow = '';
        }, 300);
      };

      overlay.querySelector('.lightbox-close').addEventListener('click', close);
      overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); }, { once: true });
    });
  });

  // Inject lightbox styles
  const lbStyles = document.createElement('style');
  lbStyles.textContent = `
    .lightbox-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.92);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      cursor: zoom-out;
      padding: 20px;
    }
    .lightbox-overlay.open { opacity: 1; }
    .lightbox-inner {
      position: relative;
      max-width: 900px;
      width: 100%;
      cursor: default;
    }
    .lightbox-inner img {
      width: 100%;
      height: auto;
      max-height: 80vh;
      object-fit: contain;
      border-radius: 4px;
      border: 1px solid rgba(201,168,76,0.2);
    }
    .lightbox-inner p {
      text-align: center;
      margin-top: 14px;
      font-size: 11px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--gold, #c9a84c);
    }
    .lightbox-close {
      position: absolute;
      top: -42px;
      right: 0;
      background: none;
      border: 1px solid rgba(201,168,76,0.3);
      color: #fff;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, border-color 0.2s;
      line-height: 1;
    }
    .lightbox-close:hover { background: rgba(201,168,76,0.2); border-color: var(--gold, #c9a84c); }
  `;
  document.head.appendChild(lbStyles);

});
