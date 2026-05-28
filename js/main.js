/* ============================================================
   LITERARY LAB - Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  applyFooterYear();
  initNavbar();
  initMobileMenu();
  initRevealObserver();
  initActiveNavLink();
  initContactForm();
  initSmoothScroll();
  initFaqAccordions();

  initializeDynamicSections();
  document.addEventListener('literarylab:content-rendered', initializeDynamicSections);
});

function applyFooterYear() {
  document.querySelectorAll('[data-current-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav || hamburger.dataset.bound === 'true') return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  hamburger.dataset.bound = 'true';
}

function initRevealObserver() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  reveals.forEach((element) => element.classList.add('visible'));
}

function initializeDynamicSections() {
  reorderHomeSections();
  initAnimatedCounters();
  initPortfolioFilter();
  initFaqAccordions();
}

function reorderHomeSections() {
  if (document.body.dataset.page !== 'home') return;

  const footer = document.querySelector('footer');
  if (!footer) return;

  const sectionOrder = [
    'proof-bar',
    'start-here',
    'portfolio-preview',
    'published-proof',
    'services-overview',
    'case-studies',
    'process',
    'testimonials',
    'trust-policy',
    'about-teaser',
    'faq',
    'final-cta'
  ];

  sectionOrder.forEach((key) => {
    const section = document.querySelector(`[data-home-section="${key}"]`);
    if (section) {
      document.body.insertBefore(section, footer);
    }
  });
}

function initAnimatedCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        if (element.dataset.animated === 'true') {
          counterObserver.unobserve(element);
          return;
        }

        const target = parseInt(element.dataset.target, 10);
        const suffix = element.dataset.suffix || '';
        const prefix = element.dataset.prefix || '';
        let current = 0;
        const steps = 60;
        const increment = target / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            element.textContent = prefix + target + suffix;
            element.dataset.animated = 'true';
            clearInterval(timer);
          } else {
            element.textContent = prefix + Math.floor(current) + suffix;
          }
        }, 20);

        counterObserver.unobserve(element);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => {
    delete counter.dataset.animated;
    counterObserver.observe(counter);
  });
}

function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item[data-category]');
  if (!filterButtons.length || !portfolioItems.length) return;

  filterButtons.forEach((button) => {
    if (button.dataset.bound === 'true') return;

    button.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');

      const filter = button.dataset.filter;
      portfolioItems.forEach((item) => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.style.opacity = match ? '1' : '0.2';
        item.style.transform = match ? 'scale(1)' : 'scale(0.96)';
        item.style.pointerEvents = match ? 'auto' : 'none';
        item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      });
    });

    button.dataset.bound = 'true';
  });
}

function initActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form || form.dataset.bound === 'true') return;

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    const original = button.textContent;
    button.textContent = 'Sending...';
    button.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        form.style.display = 'none';
        const success = document.getElementById('formSuccess');
        if (success) success.style.display = 'block';
      } else {
        alert('Something went wrong. Please try WhatsApp instead.');
        button.textContent = original;
        button.disabled = false;
      }
    } catch {
      alert('Network error. Please try WhatsApp instead.');
      button.textContent = original;
      button.disabled = false;
    }
  });

  form.dataset.bound = 'true';
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    if (anchor.dataset.bound === 'true') return;

    anchor.addEventListener('click', function (event) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    anchor.dataset.bound = 'true';
  });
}

function initFaqAccordions() {
  document.querySelectorAll('.faq-item').forEach((item, index) => {
    const trigger = item.querySelector('.faq-q');
    if (!trigger || trigger.dataset.bound === 'true') return;

    if (index === 0) {
      item.classList.add('open');
    }

    trigger.addEventListener('click', () => {
      item.classList.toggle('open');
    });

    trigger.dataset.bound = 'true';
  });
}
