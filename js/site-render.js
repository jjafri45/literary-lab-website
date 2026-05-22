/* ============================================================
   LITERARY LAB — Page Content Renderer
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (!window.LiteraryLabCMS) return;

  const data = window.LiteraryLabCMS.loadSiteData();
  const page = window.location.pathname.split('/').pop() || 'index.html';

  applySharedContent(data.shared);

  if (page === 'index.html') {
    renderHomePage(data);
  }

  if (page === 'portfolio.html') {
    renderPortfolioPage(data.portfolio);
  }

  if (page === 'services.html') {
    renderServicesPage(data.services);
  }

  if (page === 'about.html') {
    renderAboutPage(data.about);
  }

  if (page === 'contact.html') {
    renderContactPage(data.shared);
  }
});

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function placeholderVariant(index) {
  const variants = ['ph-1', 'ph-2', 'ph-3', 'ph-4', 'ph-5', 'ph-6'];
  return variants[index % variants.length];
}

function createPlaceholder(label, index) {
  return `
    <div class="cover-placeholder ${placeholderVariant(index)}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>
      <span>${escapeHtml(label || 'Portfolio Item')}</span>
    </div>
  `;
}

function buildPortfolioCard(item, index, tall = false) {
  const classes = ['portfolio-item'];
  if (tall) classes.push('portfolio-item-tall');

  const imageMarkup = item.imageSrc
    ? `<img class="managed-portfolio-image" src="${escapeHtml(item.imageSrc)}" alt="${escapeHtml(item.alt || item.title || 'Portfolio item')}" loading="lazy" />`
    : createPlaceholder(item.title || 'Portfolio Item', index);

  return `
    <div class="${classes.join(' ')}" data-category="${escapeHtml(item.category || 'covers')}">
      ${imageMarkup}
      <div class="portfolio-overlay">
        <h4>${escapeHtml(item.title || 'Portfolio Item')}</h4>
        <span>${escapeHtml(item.label || 'Portfolio')}</span>
      </div>
    </div>
  `;
}

function buildWhatsAppHref(currentHref, number) {
  const current = currentHref || '';
  const queryIndex = current.indexOf('?');
  const query = queryIndex >= 0 ? current.slice(queryIndex) : '';
  return `https://wa.me/${number}${query}`;
}

function applySharedContent(shared) {
  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.href = `mailto:${shared.email}`;
    link.textContent = shared.email;
  });

  document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
    link.href = buildWhatsAppHref(link.getAttribute('href'), shared.whatsappNumber);
    if (link.textContent.trim().startsWith('+')) {
      link.textContent = shared.whatsappDisplay;
    }
  });

  document.querySelectorAll('.footer-bottom p a').forEach((link) => {
    link.href = shared.footerCreditUrl;
    link.textContent = shared.footerCreditText;
  });
}

function renderHomePage(data) {
  const { home, portfolio } = data;

  const eyebrow = document.querySelector('.hero-eyebrow span');
  if (eyebrow) eyebrow.textContent = home.heroEyebrow;

  const heroTitle = document.querySelector('.hero-content h1');
  if (heroTitle) heroTitle.innerHTML = home.heroTitleHtml;

  const heroBody = document.querySelector('.hero-content > p');
  if (heroBody) heroBody.textContent = home.heroBody;

  const primaryButton = document.querySelector('.hero-actions .btn-primary');
  if (primaryButton) primaryButton.textContent = home.primaryCtaLabel;

  const secondaryButton = document.querySelector('.hero-actions .btn-outline');
  if (secondaryButton) secondaryButton.textContent = home.secondaryCtaLabel;

  const statsContainer = document.querySelector('.stats-bar .container');
  if (statsContainer) {
    statsContainer.innerHTML = home.stats.map((item, index) => `
      <div class="stat-item">
        <span class="stat-number" data-target="${escapeHtml(item.target)}" data-suffix="${escapeHtml(item.suffix || '')}" data-prefix="${escapeHtml(item.prefix || '')}">${escapeHtml((item.prefix || '') + item.target + (item.suffix || ''))}</span>
        <span class="stat-label">${escapeHtml(item.label)}</span>
      </div>
    `).join('');
  }

  const previewGrid = document.querySelector('.portfolio-grid');
  if (previewGrid) {
    previewGrid.innerHTML = portfolio.items.slice(0, 6).map((item, index) => buildPortfolioCard(item, index, false)).join('');
  }

  const testimonialsGrid = document.querySelector('.testimonials-grid');
  if (testimonialsGrid) {
    testimonialsGrid.innerHTML = home.testimonials.map((item) => `
      <div class="testimonial-card">
        <div class="stars">${escapeHtml(item.stars)}</div>
        <p>${escapeHtml(item.text)}</p>
        <div class="author-wrap">
          <div class="author-avatar">${escapeHtml(item.initials)}</div>
          <div>
            <span class="author-name">${escapeHtml(item.author)}</span>
            <span class="author-title">${escapeHtml(item.role)}</span>
          </div>
        </div>
      </div>
    `).join('');
  }
}

function renderPortfolioPage(portfolio) {
  const fullGrid = document.querySelector('.portfolio-grid-full');
  if (!fullGrid) return;
  fullGrid.innerHTML = portfolio.items.map((item, index) => buildPortfolioCard(item, index, true)).join('');
}

function renderServicesPage(services) {
  document.querySelectorAll('[data-service-visual]').forEach((slot) => {
    const key = slot.dataset.serviceVisual;
    const imageSrc = services.visuals[key];
    if (!imageSrc) return;

    slot.classList.add('has-managed-image');
    slot.innerHTML = `<img class="managed-slot-image" src="${escapeHtml(imageSrc)}" alt="${escapeHtml(key + ' service visual')}" loading="lazy" />`;
  });

  const pricingGrid = document.getElementById('pricingGrid');
  if (!pricingGrid) return;

  pricingGrid.innerHTML = services.pricing.map((pkg) => {
    const cardClass = pkg.featured ? 'pricing-card featured' : 'pricing-card';
    const buttonClass = pkg.buttonStyle === 'primary' ? 'btn btn-primary' : 'btn btn-outline';
    return `
      <div class="${cardClass}">
        <h3>${escapeHtml(pkg.title)}</h3>
        <p class="price-desc">${escapeHtml(pkg.description)}</p>
        <div class="price-amount"><sup>$</sup>${escapeHtml(pkg.price)}</div>
        <span class="price-label">${escapeHtml(pkg.label)}</span>
        <ul class="price-features">
          ${pkg.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}
        </ul>
        <a href="contact.html" class="${buttonClass}" style="width:100%;justify-content:center;">${escapeHtml(pkg.buttonLabel)}</a>
      </div>
    `;
  }).join('');
}

function renderAboutPage(about) {
  const visual = document.getElementById('aboutVisual');
  if (visual && about.visualImage) {
    visual.classList.add('has-managed-image');
    visual.innerHTML = `<img class="managed-slot-image" src="${escapeHtml(about.visualImage)}" alt="About Literary Lab" loading="lazy" />`;
  }

  const storyStats = document.getElementById('aboutStoryStats');
  if (storyStats) {
    storyStats.innerHTML = about.storyStats.map((item) => `
      <div>
        <span style="font-family:var(--font-display); font-size:2.4rem; font-weight:700; color:var(--accent); display:block; line-height:1;">${escapeHtml(item.value)}</span>
        <span style="font-size:0.78rem; letter-spacing:0.18em; text-transform:uppercase; color:var(--text-muted);">${escapeHtml(item.label)}</span>
      </div>
    `).join('');
  }

  const teamGrid = document.getElementById('teamGrid');
  if (!teamGrid) return;

  teamGrid.innerHTML = about.team.map((member) => `
    <div class="team-card">
      <div class="team-photo${member.imageSrc ? ' has-managed-image' : ''}">
        ${member.imageSrc
          ? `<img class="managed-slot-image" src="${escapeHtml(member.imageSrc)}" alt="${escapeHtml(member.name)}" loading="lazy" />`
          : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <path d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>`}
      </div>
      <div class="team-info">
        <h4>${escapeHtml(member.name)}</h4>
        <span class="team-role">${escapeHtml(member.role)}</span>
        <p style="font-size:0.88rem;">${escapeHtml(member.bio)}</p>
      </div>
    </div>
  `).join('');
}

function renderContactPage(shared) {
  const whatsappLink = Array.from(document.querySelectorAll('.contact-method a')).find((link) => link.href.includes('wa.me/'));
  if (whatsappLink) {
    whatsappLink.textContent = shared.whatsappDisplay;
  }
}
