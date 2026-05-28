/* ============================================================
   LITERARY LAB - Page Content Renderer
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  if (!window.LiteraryLabCMS) return;

  const data = await window.LiteraryLabCMS.loadSiteData();
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const selectedBlog = page === 'blog.html' ? findBlogBySlug(data.blogs) : null;

  applySharedContent(data.shared);
  applySeoMetadata(page, selectedBlog);

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

  if (page === 'blogs.html') {
    renderBlogsPage(data.blogs);
  }

  if (page === 'blog.html') {
    renderBlogPage(selectedBlog);
  }

  document.dispatchEvent(new CustomEvent('literarylab:content-rendered', {
    detail: { page, data }
  }));
});

function applySeoMetadata(page, selectedBlog) {
  const metaMap = {
    'index.html': {
      title: 'Literary Lab - Book Design, Formatting, and Publishing Support for Self-Published Authors',
      description: 'Literary Lab helps self-published authors with proofreading, book cover design, interior formatting, and Amazon-ready publishing files for Kindle, paperback, and hardcover.',
      ogTitle: 'Literary Lab - Book Design and Publishing Support for Self-Published Authors',
      ogDescription: 'Proofreading, covers, interior formatting, and publishing-ready book files for self-published authors who want a professional launch.'
    },
    'services.html': {
      title: 'Services - Literary Lab | Book Formatting, Cover Design, Proofreading, and Publishing Support',
      description: 'Choose proofreading, book cover design, interior formatting, eBook conversion, or a full author launch package. Built for self-published authors and Amazon-ready delivery.',
      ogTitle: 'Services - Literary Lab | Self-Publishing Support for Authors',
      ogDescription: 'Professional proofreading, cover design, formatting, and publishing-ready book services for self-published authors.'
    },
    'contact.html': {
      title: 'Contact Us - Literary Lab | Get a Free Book Readiness Review',
      description: 'Tell Literary Lab about your manuscript and get a free readiness review for proofreading, cover design, formatting, and publishing support within 24 hours.',
      ogTitle: 'Contact - Literary Lab | Free Book Readiness Review',
      ogDescription: 'Tell us what stage your manuscript is in and get a clear readiness review within 24 hours.'
    },
    'published.html': {
      title: 'Published Books - Literary Lab | Amazon Publishing Proof',
      description: 'Browse published books Literary Lab has helped bring to Amazon, with direct links to each live listing.',
      ogTitle: 'Published Books - Literary Lab | Amazon Publishing Proof',
      ogDescription: 'Real Amazon listings that show Literary Lab publishing support from rough manuscript to live book page.'
    },
    'blogs.html': {
      title: 'Blog - Literary Lab | Self-Publishing Advice for Authors',
      description: 'Read Literary Lab articles on self-publishing, proofreading, book covers, interior formatting, and preparing your manuscript for Amazon.',
      ogTitle: 'Blog - Literary Lab | Advice for Self-Published Authors',
      ogDescription: 'Actionable advice for self-published authors on formatting, proofreading, covers, and publishing-ready book files.'
    },
    'blog.html': selectedBlog
      ? {
          title: `${selectedBlog.title} - Literary Lab Blog`,
          description: selectedBlog.metaDescription || selectedBlog.excerpt,
          ogTitle: `${selectedBlog.title} - Literary Lab Blog`,
          ogDescription: selectedBlog.metaDescription || selectedBlog.excerpt,
          canonical: `${window.location.origin}${window.location.pathname}?slug=${encodeURIComponent(selectedBlog.slug)}`
        }
      : {
          title: 'Blog Post - Literary Lab',
          description: 'Read publishing guidance from Literary Lab for self-published and first-time authors.',
          ogTitle: 'Blog Post - Literary Lab',
          ogDescription: 'Read publishing guidance from Literary Lab for self-published and first-time authors.'
        }
  };

  const meta = metaMap[page];
  if (!meta) return;

  document.title = meta.title;

  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', meta.description);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', meta.ogTitle);

  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute('content', meta.ogDescription);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical && meta.canonical) canonical.setAttribute('href', meta.canonical);
}

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
  const imageFit = item.imageFit === 'contain' ? 'fit-contain' : 'fit-cover';

  const imageMarkup = item.imageSrc
    ? `<img class="managed-portfolio-image ${imageFit}" src="${escapeHtml(item.imageSrc)}" alt="${escapeHtml(item.alt || item.title || 'Portfolio item')}" loading="lazy" decoding="async" />`
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
    statsContainer.innerHTML = home.stats.map((item) => `
      <div class="stat-item">
        <span class="stat-number" data-target="${escapeHtml(item.target)}" data-suffix="${escapeHtml(item.suffix || '')}" data-prefix="${escapeHtml(item.prefix || '')}">${escapeHtml((item.prefix || '') + item.target + (item.suffix || ''))}</span>
        <span class="stat-label">${escapeHtml(item.label)}</span>
      </div>
    `).join('');
  }

  const previewGrid = document.querySelector('.portfolio-grid');
  if (previewGrid) {
    const homeItems = portfolio.items.filter((item) => item.showOnHome !== false).slice(0, 6);
    previewGrid.innerHTML = homeItems.map((item, index) => buildPortfolioCard(item, index, false)).join('');
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
  const coversGrid = document.getElementById('portfolioCoversGrid');
  const interiorGrid = document.getElementById('portfolioInteriorGrid');
  if (!coversGrid || !interiorGrid) return;

  const coverItems = portfolio.items.filter((item) => item.category !== 'interior');
  const interiorItems = portfolio.items.filter((item) => item.category === 'interior');

  coversGrid.innerHTML = coverItems.map((item, index) => buildPortfolioCard(item, index, true)).join('');
  interiorGrid.innerHTML = interiorItems.map((item, index) => buildPortfolioCard(item, index, true)).join('');
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

function normalizeBlogPost(post, index) {
  const safeTitle = post?.title || `Blog Post ${index + 1}`;
  const safeSlug = post?.slug || slugifyValue(safeTitle) || `blog-post-${index + 1}`;
  const contentHtml = String(post?.contentHtml || '').trim();
  const tags = Array.isArray(post?.tags) ? post.tags.map((tag) => String(tag).trim()).filter(Boolean) : [];
  const excerpt = truncateText(stripHtml(contentHtml), 180);
  return {
    id: post?.id || `blog-${index + 1}`,
    title: safeTitle,
    slug: safeSlug,
    metaDescription: post?.metaDescription || excerpt,
    tags,
    contentHtml,
    excerpt
  };
}

function normalizeBlogsCollection(blogs) {
  return (blogs?.posts || []).map(normalizeBlogPost);
}

function slugifyValue(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function stripHtml(html) {
  const temp = document.createElement('div');
  temp.innerHTML = String(html || '');
  return (temp.textContent || temp.innerText || '').replace(/\s+/g, ' ').trim();
}

function truncateText(value, maxLength) {
  const text = String(value || '').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}…`;
}

function findBlogBySlug(blogs) {
  const slug = new URLSearchParams(window.location.search).get('slug');
  if (!slug) return null;
  return normalizeBlogsCollection(blogs).find((post) => post.slug === slug) || null;
}

function renderBlogsPage(blogs) {
  const grid = document.getElementById('blogsGrid');
  if (!grid) return;

  const posts = normalizeBlogsCollection(blogs);
  if (!posts.length) {
    grid.innerHTML = `
      <div class="blog-empty-state">
        <h2>No blog posts yet</h2>
        <p>Use the admin panel to publish the first Literary Lab article.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = posts.map((post) => `
    <article class="blog-card">
      <div class="blog-card-inner">
        <div class="blog-tag-row">
          ${(post.tags.length ? post.tags : ['literary lab']).slice(0, 4).map((tag) => `<span class="blog-tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.metaDescription || post.excerpt)}</p>
        <a href="blog.html?slug=${encodeURIComponent(post.slug)}" class="btn btn-outline">Read Article</a>
      </div>
    </article>
  `).join('');
}

function renderBlogPage(selectedBlog) {
  const content = document.getElementById('blogArticleContent');
  const emptyState = document.getElementById('blogEmptyState');
  const title = document.getElementById('blogTitle');
  const description = document.getElementById('blogMetaDescription');
  const kicker = document.getElementById('blogKicker');
  const breadcrumb = document.getElementById('blogBreadcrumb');
  if (!content || !emptyState || !title || !description || !kicker || !breadcrumb) return;

  if (!selectedBlog) {
    content.hidden = true;
    emptyState.hidden = false;
    title.textContent = 'Blog post not found';
    description.textContent = 'The requested article could not be loaded.';
    return;
  }

  title.textContent = selectedBlog.title;
  description.textContent = selectedBlog.metaDescription || selectedBlog.excerpt;
  kicker.textContent = selectedBlog.tags[0] || 'Literary Lab Blog';
  breadcrumb.innerHTML = `
    <a href="index.html">Home</a>
    <span class="breadcrumb-sep">></span>
    <a href="blogs.html">Blog</a>
    <span class="breadcrumb-sep">></span>
    <span>${escapeHtml(selectedBlog.title)}</span>
  `;
  content.hidden = false;
  emptyState.hidden = true;
  content.innerHTML = `
    <div class="blog-tag-row blog-tag-row-top">
      ${selectedBlog.tags.map((tag) => `<span class="blog-tag">${escapeHtml(tag)}</span>`).join('')}
    </div>
    <div class="blog-article-body">
      ${selectedBlog.contentHtml}
    </div>
    <div class="blog-article-cta">
      <p>Need help turning your manuscript into a professional, publishing-ready book?</p>
      <a href="contact.html" class="btn btn-primary">Get a Free Book Readiness Review</a>
    </div>
  `;
}
