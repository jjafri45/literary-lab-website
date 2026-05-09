/* ============================================================
   LITERARY LAB — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // FOOTER YEAR
  // ============================================================
  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ============================================================
  // NAVBAR SCROLL EFFECT
  // ============================================================
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on load
  }

  // ============================================================
  // MOBILE MENU
  // ============================================================
  const hamburger = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================================
  // SCROLL REVEAL
  // ============================================================
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -56px 0px' }
    );
    reveals.forEach(el => revealObserver.observe(el));
  }

  // ============================================================
  // ANIMATED COUNTER (stats bar)
  // ============================================================
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el      = entry.target;
            const target  = parseInt(el.dataset.target);
            const suffix  = el.dataset.suffix || '';
            const prefix  = el.dataset.prefix || '';
            let   current = 0;
            const steps   = 60;
            const inc     = target / steps;
            const timer   = setInterval(() => {
              current += inc;
              if (current >= target) {
                el.textContent = prefix + target + suffix;
                clearInterval(timer);
              } else {
                el.textContent = prefix + Math.floor(current) + suffix;
              }
            }, 20);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(c => counterObserver.observe(c));
  }

  // ============================================================
  // PORTFOLIO FILTER
  // ============================================================
  const filterBtns     = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item[data-category]');

  if (filterBtns.length && portfolioItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        portfolioItems.forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.style.opacity         = match ? '1' : '0.2';
          item.style.transform       = match ? 'scale(1)' : 'scale(0.96)';
          item.style.pointerEvents   = match ? 'auto' : 'none';
          item.style.transition      = 'opacity 0.35s ease, transform 0.35s ease';
        });
      });
    });
  }

  // ============================================================
  // ACTIVE NAV LINK
  // ============================================================
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ============================================================
  // CONTACT FORM — loading state + Formspree AJAX submit
  // ============================================================
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn       = form.querySelector('[type="submit"]');
      const original  = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled    = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          form.style.display = 'none';
          const success = document.getElementById('formSuccess');
          if (success) success.style.display = 'block';
        } else {
          alert('Something went wrong. Please try WhatsApp instead.');
          btn.textContent = original;
          btn.disabled    = false;
        }
      } catch {
        alert('Network error. Please try WhatsApp instead.');
        btn.textContent = original;
        btn.disabled    = false;
      }
    });
  }

  // ============================================================
  // SMOOTH SCROLL for anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
