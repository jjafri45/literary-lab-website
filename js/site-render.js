/* ============================================================
   LITERARY LAB - Page Content Renderer
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  if (!window.LiteraryLabCMS) return;

  const page = window.location.pathname.split('/').pop() || 'index.html';
  const fallbackData = window.LiteraryLabCMS.resetSiteData();

  renderCurrentPage(page, fallbackData);

  try {
    const data = await window.LiteraryLabCMS.loadSiteData();
    renderCurrentPage(page, data);
  } catch (error) {
    console.warn('Failed to render fresh Literary Lab content.', error);
  }
});

function renderCurrentPage(page, data) {
  const selectedBlog = page === 'blog.html' ? findBlogBySlug(data.blogs) : null;

  applyCustomSnippets(data.snippets);
  applySharedContent(data.shared);
  applySeoMetadata(page, selectedBlog);
  injectStructuredData(page, data, selectedBlog);

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

  applyAdvancedBlocks(page, data.advancedBlocks || {});

  document.dispatchEvent(new CustomEvent('literarylab:content-rendered', {
    detail: { page, data }
  }));
}

function applyCustomSnippets(snippets = {}) {
  document.querySelectorAll('[data-custom-snippet]').forEach((node) => node.remove());

  injectSnippetMarkup(document.head, snippets.headHtml, 'head');

  const body = document.body;
  if (!body) return;

  injectSnippetMarkup(body, snippets.bodyOpenHtml, 'body-open', true);
  injectSnippetMarkup(body, snippets.bodyCloseHtml, 'body-close', false);
}

function injectSnippetMarkup(target, html, location, prepend = false) {
  if (!target || !html || !html.trim()) return;

  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-custom-snippet', location);
  wrapper.innerHTML = html;

  if (prepend && target.firstChild) {
    target.insertBefore(wrapper, target.firstChild);
  } else {
    target.appendChild(wrapper);
  }
}

function applyAdvancedBlocks(page, blocks) {
  if (!blocks) return;

  const assignments = [];

  if (page === 'index.html') {
    assignments.push(
      ['#homeQuickPathsGrid', blocks.homeQuickPathsHtml],
      ['#homeProofGrid', blocks.homeProofCardsHtml],
      ['#homeCaseStudiesGrid', blocks.homeCaseStudiesHtml],
      ['#homeFaqBlock', blocks.homeFaqHtml]
    );
  }

  if (page === 'services.html') {
    assignments.push(['#serviceGuidesWrap', blocks.servicesGuidesHtml]);
  }

  if (page === 'published.html') {
    assignments.push(
      ['#publishedClientBooksGrid', blocks.publishedClientBooksHtml],
      ['#publishedStudioBooksGrid', blocks.publishedStudioBooksHtml]
    );
  }

  if (page === 'contact.html') {
    assignments.push(
      ['#contactSidebarCards', blocks.contactSidebarHtml],
      ['#contactFaqList', blocks.contactFaqHtml]
    );
  }

  assignments.forEach(([selector, html]) => {
    if (!html || !html.trim()) return;
    const target = document.querySelector(selector);
    if (target) target.innerHTML = html;
  });
}

function applySeoMetadata(page, selectedBlog) {
  const baseUrl = getSiteBaseUrl();
  const pageUrls = {
    'index.html': `${baseUrl}/`,
    'services.html': `${baseUrl}/services.html`,
    'portfolio.html': `${baseUrl}/portfolio.html`,
    'about.html': `${baseUrl}/about.html`,
    'contact.html': `${baseUrl}/contact.html`,
    'published.html': `${baseUrl}/published.html`,
    'blogs.html': `${baseUrl}/blogs.html`,
    'book-formatting-services.html': `${baseUrl}/book-formatting-services.html`,
    'book-cover-design-services.html': `${baseUrl}/book-cover-design-services.html`,
    'ebook-conversion-services.html': `${baseUrl}/ebook-conversion-services.html`,
    'book-proofreading-services.html': `${baseUrl}/book-proofreading-services.html`,
    'kdp-formatting-services.html': `${baseUrl}/kdp-formatting-services.html`,
    'ingramspark-formatting-services.html': `${baseUrl}/ingramspark-formatting-services.html`,
    'self-publishing-consultation.html': `${baseUrl}/self-publishing-consultation.html`,
    'blog.html': selectedBlog
      ? `${baseUrl}/blog.html?slug=${encodeURIComponent(selectedBlog.slug)}`
      : `${baseUrl}/blog.html`
  };
  const defaultImage = `${baseUrl}/images/cms/published/brand-loud-amazon-laptop.webp`;

  const metaMap = {
    'index.html': {
      title: 'Professional Book Design & Formatting Services | Literary Lab Studio',
      description: 'Literary Lab Studio helps authors turn manuscripts into print-ready and upload-ready books for Amazon KDP, Kindle, paperback, hardcover, and ebook publishing.',
      ogTitle: 'Professional Book Design & Formatting Services | Literary Lab Studio',
      ogDescription: 'Book formatting services, book cover design services, ebook formatting, and self-publishing support for first-time and indie authors.',
      canonical: pageUrls['index.html'],
      ogUrl: pageUrls['index.html'],
      ogImage: defaultImage
    },
    'services.html': {
      title: 'Book Formatting, Cover Design & Self-Publishing Services | Literary Lab Studio',
      description: 'Explore book formatting services, KDP formatting support, book cover design services, ebook formatting, proofreading, and self-publishing help for authors.',
      ogTitle: 'Book Formatting, Cover Design & Self-Publishing Services | Literary Lab Studio',
      ogDescription: 'Professional book formatting, custom book cover design, ebook formatting service, and self-publishing support for authors.',
      canonical: pageUrls['services.html'],
      ogUrl: pageUrls['services.html'],
      ogImage: defaultImage
    },
    'portfolio.html': {
      title: 'Book Cover Design & Interior Layout Portfolio | Literary Lab Studio',
      description: 'Browse book cover design services and book interior layout design samples created for self-published authors, nonfiction writers, and independent publishers.',
      ogTitle: 'Book Cover Design & Interior Layout Portfolio | Literary Lab Studio',
      ogDescription: 'Portfolio samples of professional book formatting, custom book cover design, and interior layout design for self-published authors.',
      canonical: pageUrls['portfolio.html'],
      ogUrl: pageUrls['portfolio.html'],
      ogImage: defaultImage
    },
    'about.html': {
      title: 'About Literary Lab Studio | Book Design & Formatting Support for Authors',
      description: 'Learn about Literary Lab Studio, a publishing-aware team providing professional book formatting, cover design, ebook formatting, and self-publishing support.',
      ogTitle: 'About Literary Lab Studio | Book Design & Formatting Support for Authors',
      ogDescription: 'Meet the publishing-aware team behind Literary Lab Studio and learn how we support self-published authors from manuscript to upload-ready files.',
      canonical: pageUrls['about.html'],
      ogUrl: pageUrls['about.html'],
      ogImage: defaultImage
    },
    'contact.html': {
      title: 'Contact Literary Lab Studio | Book Formatting Quote & Project Review',
      description: 'Contact Literary Lab Studio for professional book formatting, book cover design, ebook formatting, and self-publishing support. Get a project review.',
      ogTitle: 'Contact Literary Lab Studio | Book Formatting Quote & Project Review',
      ogDescription: 'Tell us about your manuscript, publishing format, and design needs. We will reply with the clearest next step for your book project.',
      canonical: pageUrls['contact.html'],
      ogUrl: pageUrls['contact.html'],
      ogImage: defaultImage
    },
    'published.html': {
      title: 'Published Books & Amazon KDP Proof | Literary Lab Studio',
      description: 'See published books and Amazon proof of work from Literary Lab Studio, including client publishing projects and in-house titles.',
      ogTitle: 'Published Books & Amazon KDP Proof | Literary Lab Studio',
      ogDescription: 'Amazon publishing proof showing how Literary Lab Studio supports authors with book formatting, cover design, proofreading, and publishing-ready delivery.',
      canonical: pageUrls['published.html'],
      ogUrl: pageUrls['published.html'],
      ogImage: defaultImage
    },
    'blogs.html': {
      title: 'Self-Publishing Blog for Book Formatting & KDP Help | Literary Lab Studio',
      description: 'Read practical guides on professional book formatting, Amazon KDP formatting, book cover design, ebook formatting, and self-publishing support.',
      ogTitle: 'Self-Publishing Blog for Book Formatting & KDP Help | Literary Lab Studio',
      ogDescription: 'Helpful articles on book formatting services, KDP book formatting, ebook conversion, and self-publishing support for first-time authors.',
      canonical: pageUrls['blogs.html'],
      ogUrl: pageUrls['blogs.html'],
      ogImage: defaultImage
    },
    'book-formatting-services.html': {
      title: 'Book Formatting Services for Self-Published Authors | Literary Lab Studio',
      description: 'Professional book formatting services for authors who need print-ready PDF files for paperback, hardcover, KDP, and IngramSpark publishing.',
      ogTitle: 'Book Formatting Services for Self-Published Authors | Literary Lab Studio',
      ogDescription: 'Professional book formatting and book interior layout design for Amazon KDP, IngramSpark, paperback, and hardcover publishing.',
      canonical: pageUrls['book-formatting-services.html'],
      ogUrl: pageUrls['book-formatting-services.html'],
      ogImage: defaultImage
    },
    'book-cover-design-services.html': {
      title: 'Book Cover Design Services for Self-Published Authors | Literary Lab Studio',
      description: 'Custom book cover design services for self-published authors who need genre-aware covers for Kindle thumbnails, paperback wraps, and hardcover editions.',
      ogTitle: 'Book Cover Design Services for Self-Published Authors | Literary Lab Studio',
      ogDescription: 'Custom book cover design for Kindle, paperback, and hardcover books built for strong thumbnail visibility and professional print presentation.',
      canonical: pageUrls['book-cover-design-services.html'],
      ogUrl: pageUrls['book-cover-design-services.html'],
      ogImage: defaultImage
    },
    'ebook-conversion-services.html': {
      title: 'eBook Formatting Service for Kindle & EPUB | Literary Lab Studio',
      description: 'eBook formatting service for authors who need clean Kindle formatting, EPUB delivery, and digital files prepared for current publishing requirements.',
      ogTitle: 'eBook Formatting Service for Kindle & EPUB | Literary Lab Studio',
      ogDescription: 'Clean ebook formatting for Kindle and EPUB with digital files prepared for reliable reading across major ebook platforms.',
      canonical: pageUrls['ebook-conversion-services.html'],
      ogUrl: pageUrls['ebook-conversion-services.html'],
      ogImage: defaultImage
    },
    'book-proofreading-services.html': {
      title: 'Book Proofreading Services for Authors | Literary Lab Studio',
      description: 'Book proofreading services for authors who need grammar, spelling, punctuation, and consistency cleanup before formatting, cover design, and publishing.',
      ogTitle: 'Book Proofreading Services for Authors | Literary Lab Studio',
      ogDescription: 'Proofreading support that cleans the manuscript before design, formatting, and self-publishing production begin.',
      canonical: pageUrls['book-proofreading-services.html'],
      ogUrl: pageUrls['book-proofreading-services.html'],
      ogImage: defaultImage
    },
    'kdp-formatting-services.html': {
      title: 'KDP Book Formatting Service for Self-Published Authors | Literary Lab Studio',
      description: 'KDP book formatting service for authors who need Amazon trim setup, bleed, margins, print-ready PDF export, Kindle formatting, and upload-ready files.',
      ogTitle: 'KDP Book Formatting Service for Self-Published Authors | Literary Lab Studio',
      ogDescription: 'Amazon KDP formatting support for paperback, hardcover, and Kindle preparation with fewer upload mistakes and cleaner print files.',
      canonical: pageUrls['kdp-formatting-services.html'],
      ogUrl: pageUrls['kdp-formatting-services.html'],
      ogImage: defaultImage
    },
    'ingramspark-formatting-services.html': {
      title: 'IngramSpark Book Formatting Services | Literary Lab Studio',
      description: 'IngramSpark formatting services for authors needing professional manuscript formatting, print-ready interiors, and wider print distribution support.',
      ogTitle: 'IngramSpark Book Formatting Services | Literary Lab Studio',
      ogDescription: 'Professional IngramSpark formatting support for authors who need clean interiors and upload-ready print files for wider distribution.',
      canonical: pageUrls['ingramspark-formatting-services.html'],
      ogUrl: pageUrls['ingramspark-formatting-services.html'],
      ogImage: defaultImage
    },
    'self-publishing-consultation.html': {
      title: 'Self-Publishing Support for Authors | Literary Lab Studio',
      description: 'Self-publishing support for authors who need guidance on book formatting, KDP preparation, ebook files, print-ready specs, and the right publishing workflow.',
      ogTitle: 'Self-Publishing Support for Authors | Literary Lab Studio',
      ogDescription: 'Publishing-aware support for first-time authors who need help choosing the right files, formats, and production path before launch.',
      canonical: pageUrls['self-publishing-consultation.html'],
      ogUrl: pageUrls['self-publishing-consultation.html'],
      ogImage: defaultImage
    },
    'blog.html': selectedBlog
      ? {
          title: `${selectedBlog.title} | Literary Lab Studio Blog`,
          description: selectedBlog.metaDescription || selectedBlog.excerpt,
          ogTitle: `${selectedBlog.title} | Literary Lab Studio Blog`,
          ogDescription: selectedBlog.metaDescription || selectedBlog.excerpt,
          canonical: pageUrls['blog.html'],
          ogUrl: pageUrls['blog.html'],
          ogImage: defaultImage
        }
      : {
          title: 'Book Publishing Article | Literary Lab Studio Blog',
          description: 'Read publishing guidance from Literary Lab Studio for self-published and first-time authors.',
          ogTitle: 'Book Publishing Article | Literary Lab Studio Blog',
          ogDescription: 'Read publishing guidance from Literary Lab Studio for self-published and first-time authors.',
          canonical: pageUrls['blog.html'],
          ogUrl: pageUrls['blog.html'],
          ogImage: defaultImage
        }
  };

  const meta = metaMap[page];
  if (!meta) return;

  document.title = meta.title;
  upsertMetaTag('name', 'description', meta.description);
  upsertMetaTag('property', 'og:title', meta.ogTitle);
  upsertMetaTag('property', 'og:description', meta.ogDescription);
  upsertMetaTag('property', 'og:type', 'website');
  upsertMetaTag('property', 'og:site_name', 'Literary Lab Studio');
  if (meta.ogUrl) upsertMetaTag('property', 'og:url', meta.ogUrl);
  if (meta.ogImage) upsertMetaTag('property', 'og:image', meta.ogImage);
  upsertMetaTag('name', 'twitter:card', 'summary_large_image');
  upsertMetaTag('name', 'twitter:title', meta.ogTitle);
  upsertMetaTag('name', 'twitter:description', meta.ogDescription);
  if (meta.ogImage) upsertMetaTag('name', 'twitter:image', meta.ogImage);
  upsertCanonical(meta.canonical);
}

function injectStructuredData(page, data, selectedBlog) {
  const schemaId = 'literarylab-structured-data';
  const existing = document.getElementById(schemaId);
  if (existing) existing.remove();

  const baseUrl = getSiteBaseUrl();
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Literary Lab Studio',
    alternateName: 'Literary Lab',
    url: `${baseUrl}/`,
    logo: `${baseUrl}/favicon.svg`,
    image: `${baseUrl}/images/cms/published/brand-loud-amazon-laptop.webp`,
    sameAs: [
      'https://www.facebook.com/literarylab/',
      'https://www.instagram.com/literarylabofficial/',
      'https://www.linkedin.com/company/literary-lab',
      'https://wa.me/923472590983'
    ]
  };

  const professionalService = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${baseUrl}/#professional-service`,
    name: 'Literary Lab Studio',
    url: `${baseUrl}/`,
    image: `${baseUrl}/images/cms/published/brand-loud-amazon-laptop.webp`,
    email: 'hello@literarylabstudio.com',
    telephone: '+923472590983',
    areaServed: 'Worldwide',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Karachi',
      addressCountry: 'PK'
    },
    sameAs: organization.sameAs,
    description: 'Literary Lab Studio provides book design services, book formatting services, ebook formatting, and self-publishing support for authors.',
    makesOffer: [
      'Book Formatting Services',
      'Book Cover Design Services',
      'KDP Formatting Services',
      'eBook Formatting Services',
      'Self-Publishing Support'
    ].map((name) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name
      }
    }))
  };

  const schema = [organization, professionalService];
  const servicePageSchema = getServiceSchemaForPage(page, baseUrl);

  if (page === 'index.html') {
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Literary Lab Studio',
      url: `${baseUrl}/`
    });
  }

  if (page === 'services.html') {
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Literary Lab Studio Services',
      itemListElement: (data.services?.pricing || []).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Service',
          name: item.title,
          description: item.description,
          provider: {
            '@id': `${baseUrl}/#professional-service`
          },
          areaServed: 'Worldwide'
        }
      }))
    });
  }

  if (page === 'blogs.html') {
    const posts = normalizeBlogsCollection(data.blogs);
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Literary Lab Blog',
      url: `${baseUrl}/blogs.html`,
      blogPost: posts.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        url: `${baseUrl}/blog.html?slug=${encodeURIComponent(post.slug)}`,
        description: post.metaDescription || post.excerpt,
        keywords: post.tags.join(', ')
      }))
    });
  }

  if (page === 'blog.html' && selectedBlog) {
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: selectedBlog.title,
      description: selectedBlog.metaDescription || selectedBlog.excerpt,
      url: `${baseUrl}/blog.html?slug=${encodeURIComponent(selectedBlog.slug)}`,
      articleSection: selectedBlog.tags[0] || 'Self-publishing',
      keywords: selectedBlog.tags.join(', '),
      author: {
        '@type': 'Organization',
        name: 'Literary Lab Studio'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Literary Lab Studio'
      }
    });
  }

  if (servicePageSchema) {
    schema.push(servicePageSchema);
  }

  const breadcrumbSchema = buildBreadcrumbSchema(baseUrl);
  if (breadcrumbSchema) {
    schema.push(breadcrumbSchema);
  }

  const faqItems = Array.from(document.querySelectorAll('.faq-item')).map((item) => {
    const question = item.querySelector('.faq-q')?.textContent?.trim();
    const answer = item.querySelector('.faq-a')?.textContent?.trim();
    if (!question || !answer) return null;
    return {
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer
      }
    };
  }).filter(Boolean);

  if (faqItems.length) {
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems
    });
  }

  const script = document.createElement('script');
  script.id = schemaId;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema.length === 1 ? schema[0] : schema);
  document.head.appendChild(script);
}

function getServiceSchemaForPage(page, baseUrl) {
  const servicePages = {
    'book-formatting-services.html': {
      name: 'Book Formatting Services',
      description: 'Professional book formatting and manuscript formatting for authors who need print-ready PDF files for paperback and hardcover publishing.',
      serviceType: 'Book formatting services',
      url: `${baseUrl}/book-formatting-services.html`
    },
    'book-cover-design-services.html': {
      name: 'Book Cover Design Services',
      description: 'Custom book cover design services for Kindle, paperback, and hardcover books.',
      serviceType: 'Book cover design services',
      url: `${baseUrl}/book-cover-design-services.html`
    },
    'ebook-conversion-services.html': {
      name: 'eBook Formatting Services',
      description: 'eBook formatting service for Kindle and EPUB delivery.',
      serviceType: 'eBook formatting service',
      url: `${baseUrl}/ebook-conversion-services.html`
    },
    'book-proofreading-services.html': {
      name: 'Book Proofreading Services',
      description: 'Proofreading support for authors before book design and formatting begin.',
      serviceType: 'Book proofreading services',
      url: `${baseUrl}/book-proofreading-services.html`
    },
    'kdp-formatting-services.html': {
      name: 'KDP Formatting Services',
      description: 'Amazon KDP formatting service for trim setup, bleed, margins, and upload-ready files.',
      serviceType: 'KDP book formatting service',
      url: `${baseUrl}/kdp-formatting-services.html`
    },
    'ingramspark-formatting-services.html': {
      name: 'IngramSpark Formatting Services',
      description: 'Professional formatting support for authors publishing through IngramSpark.',
      serviceType: 'IngramSpark book formatting service',
      url: `${baseUrl}/ingramspark-formatting-services.html`
    },
    'self-publishing-consultation.html': {
      name: 'Self-Publishing Support',
      description: 'Self-publishing support for authors who need help choosing formats, files, and platform workflows.',
      serviceType: 'Self-publishing support for authors',
      url: `${baseUrl}/self-publishing-consultation.html`
    }
  };

  const service = servicePages[page];
  if (!service) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    serviceType: service.serviceType,
    provider: {
      '@id': `${baseUrl}/#professional-service`
    },
    areaServed: 'Worldwide',
    url: service.url
  };
}

function buildBreadcrumbSchema(baseUrl) {
  const breadcrumb = document.querySelector('.breadcrumb');
  if (!breadcrumb) return null;

  const elements = [];
  let position = 1;

  breadcrumb.querySelectorAll('a, span').forEach((node) => {
    if (node.classList.contains('breadcrumb-sep')) return;
    const name = node.textContent?.trim();
    if (!name) return;
    const href = node.tagName === 'A' ? new URL(node.getAttribute('href'), `${baseUrl}/`).toString() : window.location.href;
    elements.push({
      '@type': 'ListItem',
      position,
      name,
      item: href
    });
    position += 1;
  });

  if (!elements.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: elements
  };
}

function upsertMetaTag(attributeName, attributeValue, content) {
  if (!content) return;
  let tag = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attributeName, attributeValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertCanonical(href) {
  if (!href) return;
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function getSiteOrigin() {
  const origin = window.location.origin;
  if (!origin || origin === 'null' || origin.startsWith('file')) {
    return 'https://literarylabstudio.com';
  }
  return origin;
}

function getSiteBaseUrl() {
  const origin = getSiteOrigin();
  if (origin.includes('github.io')) {
    return `${origin}/literary-lab-website`;
  }
  return origin;
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
    </div>
  `;
}

function createServicePlaceholder(key) {
  const labels = {
    ebook: {
      eyebrow: 'Digital Delivery',
      title: 'Kindle and EPUB-ready exports',
      body: 'Prepared for self-published authors who need clean digital files without format confusion.'
    },
    consult: {
      eyebrow: 'Publishing Guidance',
      title: 'Clear next steps before you upload',
      body: 'Trim size, platform fit, file readiness, and the practical publishing path for first-time authors.'
    },
    editing: {
      eyebrow: 'Manuscript Cleanup',
      title: 'Proofreading before design begins',
      body: 'Polish the manuscript first so the layout, cover, and publishing files all start from stronger copy.'
    }
  };

  const content = labels[key] || {
    eyebrow: 'Service Visual',
    title: 'Publishing support built around your manuscript',
    body: 'Structured guidance, cleaner files, and production-ready deliverables for independent authors.'
  };

  return `
    <div class="service-visual-copy">
      <span>${escapeHtml(content.eyebrow)}</span>
      <strong>${escapeHtml(content.title)}</strong>
      <p>${escapeHtml(content.body)}</p>
    </div>
  `;
}

function buildPortfolioCard(item, index, tall = false, loadingModeOverride = null) {
  const classes = ['portfolio-item'];
  if (tall) classes.push('portfolio-item-tall');
  const imageFit = item.imageFit === 'contain' ? 'fit-contain' : 'fit-cover';
  const loadingMode = loadingModeOverride || (tall ? 'eager' : 'lazy');
  const decodingMode = tall ? 'sync' : 'async';
  const fetchPriority = tall && index < 4 ? 'high' : 'auto';

  const imageMarkup = item.imageSrc
    ? `<img class="managed-portfolio-image ${imageFit}" src="${escapeHtml(item.imageSrc)}" alt="${escapeHtml(item.alt || item.title || 'Portfolio item')}" loading="${loadingMode}" decoding="${decodingMode}" fetchpriority="${fetchPriority}" />`
    : createPlaceholder(item.title || 'Portfolio Item', index);

  return `
    <div class="${classes.join(' ')}" data-category="${escapeHtml(item.category || 'covers')}">
      ${imageMarkup}
    </div>
  `;
}

function buildWhatsAppHref(currentHref, number) {
  const current = currentHref || '';
  const queryIndex = current.indexOf('?');
  const query = queryIndex >= 0 ? current.slice(queryIndex) : '';
  return `https://wa.me/${number}${query}`;
}

function shuffleItems(items) {
  const copy = Array.isArray(items) ? [...items] : [];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
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

  ensureLegalFooterLinks();
}

function ensureLegalFooterLinks() {
  const legalLinks = [
    ['privacy-policy.html', 'Privacy Policy'],
    ['refund-policy.html', 'Refund Policy'],
    ['terms-and-conditions.html', 'Terms & Conditions'],
    ['cookie-policy.html', 'Cookie Policy']
  ];

  document.querySelectorAll('.footer-col').forEach((column) => {
    const heading = column.querySelector('h5');
    const list = column.querySelector('ul');
    if (!heading || !list) return;
    if (heading.textContent.trim() !== 'Company') return;

    const existing = new Set(Array.from(list.querySelectorAll('a')).map((link) => link.getAttribute('href')));
    legalLinks.forEach(([href, label]) => {
      if (existing.has(href)) return;
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      item.appendChild(link);
      list.appendChild(item);
    });
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
    const homeItems = shuffleItems(portfolio.items.filter((item) => item.showOnHome !== false)).slice(0, 6);
    previewGrid.innerHTML = homeItems.map((item, index) => buildPortfolioCard(item, index, false, 'eager')).join('');
  }

  const testimonialsGrid = document.querySelector('.testimonials-grid');
  if (testimonialsGrid) {
    testimonialsGrid.innerHTML = home.testimonials.map((item) => `
      <div class="testimonial-card">
        <div class="testimonial-proof-header">
          <span>${escapeHtml(item.source || 'Client Review')}</span>
          <span>${escapeHtml(item.proof || 'Publishing Support')}</span>
        </div>
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
    if (!imageSrc) {
      slot.classList.remove('has-managed-image');
      slot.innerHTML = createServicePlaceholder(key);
      return;
    }

    slot.classList.add('has-managed-image');
    slot.innerHTML = `<img class="managed-slot-image" src="${escapeHtml(imageSrc)}" alt="${escapeHtml(key + ' service visual')}" loading="lazy" />`;
  });

  const pricingGrid = document.getElementById('pricingGrid');
  if (!pricingGrid) return;

  pricingGrid.innerHTML = services.pricing.map((pkg) => {
    const cardClass = pkg.featured ? 'pricing-card featured' : 'pricing-card';
    const buttonClass = pkg.buttonStyle === 'primary' ? 'btn btn-primary' : 'btn btn-outline';
    const amountMarkup = pkg.price === 'Custom'
      ? `<div class="price-amount price-amount-custom">${escapeHtml(pkg.price)}</div>`
      : `<div class="price-amount"><sup>$</sup>${escapeHtml(pkg.price)}</div>`;
    return `
      <div class="${cardClass}">
        <h3>${escapeHtml(pkg.title)}</h3>
        <p class="price-desc">${escapeHtml(pkg.description)}</p>
        ${amountMarkup}
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
  const form = document.getElementById('contactForm');
  if (form) {
    const submitButton = form.querySelector('[type="submit"]');
    let notice = document.getElementById('contactFormNotice');

    if (shared.contactFormAction) {
      form.action = shared.contactFormAction;
      form.dataset.actionReady = 'true';
      if (submitButton) submitButton.disabled = false;
      if (notice) notice.remove();
    } else {
      form.removeAttribute('action');
      form.dataset.actionReady = 'false';
      if (submitButton) submitButton.disabled = true;
      if (!notice) {
        notice = document.createElement('p');
        notice.id = 'contactFormNotice';
        notice.className = 'admin-security-note';
        notice.textContent = 'Direct form submission is not configured yet. Use WhatsApp or email until the live form endpoint is added in the admin panel.';
        form.appendChild(notice);
      }
    }
  }

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
    <a href="/">Home</a>
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
