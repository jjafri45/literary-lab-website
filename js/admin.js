/* ============================================================
   LITERARY LAB — Admin Dashboard
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (!window.LiteraryLabCMS) return;

  const cms = window.LiteraryLabCMS;
  let data = cms.loadSiteData();

  const statusEl = document.getElementById('adminStatus');
  const sharedSection = document.getElementById('sharedSection');
  const homeSection = document.getElementById('homeSection');
  const portfolioSection = document.getElementById('portfolioSection');
  const pricingSection = document.getElementById('pricingSection');
  const aboutSection = document.getElementById('aboutSection');
  const imageSection = document.getElementById('imageSection');

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function saveAll() {
    cms.saveSiteData(data);
    setStatus('Changes saved. Open the site in this browser to see the updated content.');
  }

  function renderAll() {
    renderShared();
    renderHome();
    renderPortfolio();
    renderPricing();
    renderAbout();
    renderImages();
  }

  function createTextField(label, value, attrs = '') {
    return `
      <div class="admin-field">
        <label>${label}</label>
        <input type="text" value="${escapeAttr(value)}" ${attrs} />
      </div>
    `;
  }

  function renderShared() {
    sharedSection.innerHTML = `
      <div class="admin-grid">
        <div class="admin-field">
          <label>Email</label>
          <input type="email" id="sharedEmail" value="${escapeAttr(data.shared.email)}" />
        </div>
        <div class="admin-field">
          <label>WhatsApp Number</label>
          <input type="text" id="sharedWhatsappNumber" value="${escapeAttr(data.shared.whatsappNumber)}" />
        </div>
        <div class="admin-field">
          <label>WhatsApp Display Text</label>
          <input type="text" id="sharedWhatsappDisplay" value="${escapeAttr(data.shared.whatsappDisplay)}" />
        </div>
        <div class="admin-field">
          <label>Footer Credit Text</label>
          <input type="text" id="sharedFooterCreditText" value="${escapeAttr(data.shared.footerCreditText)}" />
        </div>
        <div class="admin-field" style="grid-column:1 / -1;">
          <label>Footer Credit URL</label>
          <input type="url" id="sharedFooterCreditUrl" value="${escapeAttr(data.shared.footerCreditUrl)}" />
        </div>
      </div>
    `;

    sharedSection.querySelector('#sharedEmail').addEventListener('input', (event) => {
      data.shared.email = event.target.value;
    });
    sharedSection.querySelector('#sharedWhatsappNumber').addEventListener('input', (event) => {
      data.shared.whatsappNumber = event.target.value.replace(/[^\d]/g, '');
    });
    sharedSection.querySelector('#sharedWhatsappDisplay').addEventListener('input', (event) => {
      data.shared.whatsappDisplay = event.target.value;
    });
    sharedSection.querySelector('#sharedFooterCreditText').addEventListener('input', (event) => {
      data.shared.footerCreditText = event.target.value;
    });
    sharedSection.querySelector('#sharedFooterCreditUrl').addEventListener('input', (event) => {
      data.shared.footerCreditUrl = event.target.value;
    });
  }

  function renderHome() {
    homeSection.innerHTML = `
      <div class="admin-grid">
        <div class="admin-field">
          <label>Hero Eyebrow</label>
          <input type="text" id="homeHeroEyebrow" value="${escapeAttr(data.home.heroEyebrow)}" />
        </div>
        <div class="admin-field">
          <label>Primary Button</label>
          <input type="text" id="homePrimaryCta" value="${escapeAttr(data.home.primaryCtaLabel)}" />
        </div>
        <div class="admin-field">
          <label>Secondary Button</label>
          <input type="text" id="homeSecondaryCta" value="${escapeAttr(data.home.secondaryCtaLabel)}" />
        </div>
        <div class="admin-field" style="grid-column:1 / -1;">
          <label>Hero Title (HTML allowed for line breaks and emphasis)</label>
          <textarea id="homeHeroTitle">${escapeHtml(data.home.heroTitleHtml)}</textarea>
        </div>
        <div class="admin-field" style="grid-column:1 / -1;">
          <label>Hero Body</label>
          <textarea id="homeHeroBody">${escapeHtml(data.home.heroBody)}</textarea>
        </div>
      </div>
      <div class="admin-list" id="homeStatsList" style="margin-top:20px;"></div>
    `;

    homeSection.querySelector('#homeHeroEyebrow').addEventListener('input', (event) => {
      data.home.heroEyebrow = event.target.value;
    });
    homeSection.querySelector('#homePrimaryCta').addEventListener('input', (event) => {
      data.home.primaryCtaLabel = event.target.value;
    });
    homeSection.querySelector('#homeSecondaryCta').addEventListener('input', (event) => {
      data.home.secondaryCtaLabel = event.target.value;
    });
    homeSection.querySelector('#homeHeroTitle').addEventListener('input', (event) => {
      data.home.heroTitleHtml = event.target.value;
    });
    homeSection.querySelector('#homeHeroBody').addEventListener('input', (event) => {
      data.home.heroBody = event.target.value;
    });

    const statsList = homeSection.querySelector('#homeStatsList');
    statsList.innerHTML = data.home.stats.map((item, index) => `
      <div class="admin-card">
        <div class="admin-card-head">
          <h3>Stat ${index + 1}</h3>
        </div>
        <div class="admin-grid">
          <div class="admin-field">
            <label>Value</label>
            <input type="text" data-home-stat="target" data-index="${index}" value="${escapeAttr(item.target)}" />
          </div>
          <div class="admin-field">
            <label>Label</label>
            <input type="text" data-home-stat="label" data-index="${index}" value="${escapeAttr(item.label)}" />
          </div>
          <div class="admin-field">
            <label>Prefix</label>
            <input type="text" data-home-stat="prefix" data-index="${index}" value="${escapeAttr(item.prefix || '')}" />
          </div>
          <div class="admin-field">
            <label>Suffix</label>
            <input type="text" data-home-stat="suffix" data-index="${index}" value="${escapeAttr(item.suffix || '')}" />
          </div>
        </div>
      </div>
    `).join('');

    statsList.querySelectorAll('[data-home-stat]').forEach((input) => {
      input.addEventListener('input', (event) => {
        const index = Number(event.target.dataset.index);
        const key = event.target.dataset.homeStat;
        data.home.stats[index][key] = event.target.value;
      });
    });
  }

  function renderPortfolio() {
    portfolioSection.innerHTML = `
      <div class="admin-toolbar">
        <p class="admin-note">These items feed both the home page preview and the full portfolio page.</p>
        <button type="button" class="btn btn-outline" id="addPortfolioItemBtn">Add Portfolio Item</button>
      </div>
      <div class="admin-list" id="portfolioList"></div>
    `;

    portfolioSection.querySelector('#addPortfolioItemBtn').addEventListener('click', () => {
      data.portfolio.items.push({
        category: 'covers',
        label: 'Cover Design',
        title: 'New Portfolio Item',
        alt: 'Portfolio item',
        imageSrc: ''
      });
      renderPortfolio();
    });

    const list = portfolioSection.querySelector('#portfolioList');
    list.innerHTML = data.portfolio.items.map((item, index) => `
      <div class="admin-card">
        <div class="admin-card-head">
          <h3>Portfolio Item ${index + 1}</h3>
          <button type="button" class="btn btn-outline remove-portfolio-btn" data-index="${index}">Remove</button>
        </div>
        <div class="admin-grid">
          <div class="admin-field">
            <label>Title</label>
            <input type="text" data-portfolio-field="title" data-index="${index}" value="${escapeAttr(item.title)}" />
          </div>
          <div class="admin-field">
            <label>Category Label</label>
            <input type="text" data-portfolio-field="label" data-index="${index}" value="${escapeAttr(item.label)}" />
          </div>
          <div class="admin-field">
            <label>Filter Category</label>
            <select data-portfolio-field="category" data-index="${index}">
              <option value="covers"${item.category === 'covers' ? ' selected' : ''}>covers</option>
              <option value="interior"${item.category === 'interior' ? ' selected' : ''}>interior</option>
              <option value="ebook"${item.category === 'ebook' ? ' selected' : ''}>ebook</option>
            </select>
          </div>
          <div class="admin-field">
            <label>Alt Text</label>
            <input type="text" data-portfolio-field="alt" data-index="${index}" value="${escapeAttr(item.alt)}" />
          </div>
          <div class="admin-field" style="grid-column:1 / -1;">
            <label>Upload Image</label>
            <div class="admin-inline">
              <div class="admin-image-preview">
                ${item.imageSrc ? `<img src="${escapeAttr(item.imageSrc)}" alt="" />` : '<div class="admin-image-empty">No image</div>'}
              </div>
              <label class="btn btn-outline admin-upload-button">
                Choose Image
                <input type="file" class="portfolio-image-input" data-index="${index}" accept="image/*" hidden />
              </label>
              <button type="button" class="btn btn-outline clear-portfolio-image-btn" data-index="${index}">Clear Image</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('[data-portfolio-field]').forEach((input) => {
      input.addEventListener('input', (event) => {
        const index = Number(event.target.dataset.index);
        const key = event.target.dataset.portfolioField;
        data.portfolio.items[index][key] = event.target.value;
      });
    });

    list.querySelectorAll('.remove-portfolio-btn').forEach((button) => {
      button.addEventListener('click', () => {
        data.portfolio.items.splice(Number(button.dataset.index), 1);
        renderPortfolio();
      });
    });

    list.querySelectorAll('.clear-portfolio-image-btn').forEach((button) => {
      button.addEventListener('click', () => {
        data.portfolio.items[Number(button.dataset.index)].imageSrc = '';
        renderPortfolio();
      });
    });

    list.querySelectorAll('.portfolio-image-input').forEach((input) => {
      input.addEventListener('change', async (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        const index = Number(event.target.dataset.index);
        data.portfolio.items[index].imageSrc = await fileToDataUrl(file, 1200);
        renderPortfolio();
        setStatus('Portfolio image prepared. Save changes to publish it in this browser.');
      });
    });
  }

  function renderPricing() {
    pricingSection.innerHTML = `
      <div class="admin-toolbar">
        <p class="admin-note">These cards render directly into the Services pricing grid.</p>
        <button type="button" class="btn btn-outline" id="addPricingBtn">Add Package</button>
      </div>
      <div class="admin-list" id="pricingList"></div>
    `;

    pricingSection.querySelector('#addPricingBtn').addEventListener('click', () => {
      data.services.pricing.push({
        title: 'New Package',
        description: '',
        price: '0',
        label: 'Per Project',
        featured: false,
        buttonLabel: 'Get Started',
        buttonStyle: 'outline',
        features: ['Feature 1']
      });
      renderPricing();
    });

    const list = pricingSection.querySelector('#pricingList');
    list.innerHTML = data.services.pricing.map((pkg, index) => `
      <div class="admin-card">
        <div class="admin-card-head">
          <h3>Package ${index + 1}</h3>
          <button type="button" class="btn btn-outline remove-pricing-btn" data-index="${index}">Remove</button>
        </div>
        <div class="admin-grid">
          <div class="admin-field">
            <label>Title</label>
            <input type="text" data-pricing-field="title" data-index="${index}" value="${escapeAttr(pkg.title)}" />
          </div>
          <div class="admin-field">
            <label>Description</label>
            <input type="text" data-pricing-field="description" data-index="${index}" value="${escapeAttr(pkg.description)}" />
          </div>
          <div class="admin-field">
            <label>Price</label>
            <input type="text" data-pricing-field="price" data-index="${index}" value="${escapeAttr(pkg.price)}" />
          </div>
          <div class="admin-field">
            <label>Price Label</label>
            <input type="text" data-pricing-field="label" data-index="${index}" value="${escapeAttr(pkg.label)}" />
          </div>
          <div class="admin-field">
            <label>Button Label</label>
            <input type="text" data-pricing-field="buttonLabel" data-index="${index}" value="${escapeAttr(pkg.buttonLabel)}" />
          </div>
          <div class="admin-field">
            <label>Button Style</label>
            <select data-pricing-field="buttonStyle" data-index="${index}">
              <option value="outline"${pkg.buttonStyle === 'outline' ? ' selected' : ''}>outline</option>
              <option value="primary"${pkg.buttonStyle === 'primary' ? ' selected' : ''}>primary</option>
            </select>
          </div>
          <div class="admin-field">
            <label>Featured</label>
            <select data-pricing-field="featured" data-index="${index}">
              <option value="false"${!pkg.featured ? ' selected' : ''}>No</option>
              <option value="true"${pkg.featured ? ' selected' : ''}>Yes</option>
            </select>
          </div>
          <div class="admin-field" style="grid-column:1 / -1;">
            <label>Features (one per line)</label>
            <textarea data-pricing-field="features" data-index="${index}">${escapeHtml(pkg.features.join('\n'))}</textarea>
          </div>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('[data-pricing-field]').forEach((input) => {
      input.addEventListener('input', (event) => {
        const index = Number(event.target.dataset.index);
        const key = event.target.dataset.pricingField;
        if (key === 'features') {
          data.services.pricing[index].features = event.target.value.split('\n').map((value) => value.trim()).filter(Boolean);
          return;
        }
        if (key === 'featured') {
          data.services.pricing[index].featured = event.target.value === 'true';
          return;
        }
        data.services.pricing[index][key] = event.target.value;
      });
    });

    list.querySelectorAll('.remove-pricing-btn').forEach((button) => {
      button.addEventListener('click', () => {
        data.services.pricing.splice(Number(button.dataset.index), 1);
        renderPricing();
      });
    });
  }

  function renderAbout() {
    aboutSection.innerHTML = `
      <div class="admin-list">
        <div class="admin-card">
          <div class="admin-card-head">
            <h3>Story Stats</h3>
          </div>
          <div class="admin-grid" id="aboutStatsGrid"></div>
        </div>
        <div class="admin-card">
          <div class="admin-toolbar">
            <p class="admin-note">Team members on the About page.</p>
            <button type="button" class="btn btn-outline" id="addTeamBtn">Add Member</button>
          </div>
          <div class="admin-list" id="teamList"></div>
        </div>
      </div>
    `;

    const statsGrid = aboutSection.querySelector('#aboutStatsGrid');
    statsGrid.innerHTML = data.about.storyStats.map((item, index) => `
      <div class="admin-field">
        <label>Stat ${index + 1} Value</label>
        <input type="text" data-about-stat="value" data-index="${index}" value="${escapeAttr(item.value)}" />
      </div>
      <div class="admin-field">
        <label>Stat ${index + 1} Label</label>
        <input type="text" data-about-stat="label" data-index="${index}" value="${escapeAttr(item.label)}" />
      </div>
    `).join('');

    statsGrid.querySelectorAll('[data-about-stat]').forEach((input) => {
      input.addEventListener('input', (event) => {
        const index = Number(event.target.dataset.index);
        const key = event.target.dataset.aboutStat;
        data.about.storyStats[index][key] = event.target.value;
      });
    });

    aboutSection.querySelector('#addTeamBtn').addEventListener('click', () => {
      data.about.team.push({
        name: 'New Member',
        role: 'Role',
        bio: 'Short bio',
        imageSrc: ''
      });
      renderAbout();
    });

    const teamList = aboutSection.querySelector('#teamList');
    teamList.innerHTML = data.about.team.map((member, index) => `
      <div class="admin-card">
        <div class="admin-card-head">
          <h3>Team Member ${index + 1}</h3>
          <button type="button" class="btn btn-outline remove-team-btn" data-index="${index}">Remove</button>
        </div>
        <div class="admin-grid">
          <div class="admin-field">
            <label>Name</label>
            <input type="text" data-team-field="name" data-index="${index}" value="${escapeAttr(member.name)}" />
          </div>
          <div class="admin-field">
            <label>Role</label>
            <input type="text" data-team-field="role" data-index="${index}" value="${escapeAttr(member.role)}" />
          </div>
          <div class="admin-field" style="grid-column:1 / -1;">
            <label>Bio</label>
            <textarea data-team-field="bio" data-index="${index}">${escapeHtml(member.bio)}</textarea>
          </div>
          <div class="admin-field" style="grid-column:1 / -1;">
            <label>Photo</label>
            <div class="admin-inline">
              <div class="admin-image-preview square">
                ${member.imageSrc ? `<img src="${escapeAttr(member.imageSrc)}" alt="" />` : '<div class="admin-image-empty">No image</div>'}
              </div>
              <label class="btn btn-outline admin-upload-button">
                Choose Photo
                <input type="file" class="team-image-input" data-index="${index}" accept="image/*" hidden />
              </label>
              <button type="button" class="btn btn-outline clear-team-image-btn" data-index="${index}">Clear Photo</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    teamList.querySelectorAll('[data-team-field]').forEach((input) => {
      input.addEventListener('input', (event) => {
        const index = Number(event.target.dataset.index);
        const key = event.target.dataset.teamField;
        data.about.team[index][key] = event.target.value;
      });
    });

    teamList.querySelectorAll('.remove-team-btn').forEach((button) => {
      button.addEventListener('click', () => {
        data.about.team.splice(Number(button.dataset.index), 1);
        renderAbout();
      });
    });

    teamList.querySelectorAll('.clear-team-image-btn').forEach((button) => {
      button.addEventListener('click', () => {
        data.about.team[Number(button.dataset.index)].imageSrc = '';
        renderAbout();
      });
    });

    teamList.querySelectorAll('.team-image-input').forEach((input) => {
      input.addEventListener('change', async (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        const index = Number(event.target.dataset.index);
        data.about.team[index].imageSrc = await fileToDataUrl(file, 1000);
        renderAbout();
        setStatus('Team image prepared. Save changes to publish it in this browser.');
      });
    });
  }

  function renderImages() {
    const imageFields = [
      { key: 'visualImage', label: 'About Story Image', group: 'about', previewClass: 'wide' },
      { key: 'interior', label: 'Services: Interior Visual', group: 'services', previewClass: 'wide' },
      { key: 'covers', label: 'Services: Cover Visual', group: 'services', previewClass: 'wide' },
      { key: 'ebook', label: 'Services: eBook Visual', group: 'services', previewClass: 'wide' },
      { key: 'consult', label: 'Services: Consultation Visual', group: 'services', previewClass: 'wide' }
    ];

    imageSection.innerHTML = `
      <div class="admin-list">
        ${imageFields.map((field) => {
          const imageSrc = field.group === 'about' ? data.about.visualImage : data.services.visuals[field.key];
          return `
            <div class="admin-card">
              <div class="admin-card-head">
                <h3>${field.label}</h3>
              </div>
              <div class="admin-inline">
                <div class="admin-image-preview ${field.previewClass}">
                  ${imageSrc ? `<img src="${escapeAttr(imageSrc)}" alt="" />` : '<div class="admin-image-empty">No image</div>'}
                </div>
                <label class="btn btn-outline admin-upload-button">
                  Choose Image
                  <input type="file" class="page-image-input" data-group="${field.group}" data-key="${field.key}" accept="image/*" hidden />
                </label>
                <button type="button" class="btn btn-outline clear-page-image-btn" data-group="${field.group}" data-key="${field.key}">Clear Image</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    imageSection.querySelectorAll('.clear-page-image-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const { group, key } = button.dataset;
        if (group === 'about') {
          data.about.visualImage = '';
        } else {
          data.services.visuals[key] = '';
        }
        renderImages();
      });
    });

    imageSection.querySelectorAll('.page-image-input').forEach((input) => {
      input.addEventListener('change', async (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        const { group, key } = event.target.dataset;
        const imageSrc = await fileToDataUrl(file, 1400);
        if (group === 'about') {
          data.about.visualImage = imageSrc;
        } else {
          data.services.visuals[key] = imageSrc;
        }
        renderImages();
        setStatus('Page image prepared. Save changes to publish it in this browser.');
      });
    });
  }

  document.getElementById('saveDataBtn').addEventListener('click', saveAll);

  document.getElementById('exportDataBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'literary-lab-content.json';
    link.click();
    URL.revokeObjectURL(url);
    setStatus('Exported current dashboard data to JSON.');
  });

  document.getElementById('importDataInput').addEventListener('change', async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const text = await file.text();
    data = mergeImportedData(cms.DEFAULT_DATA, JSON.parse(text));
    saveAll();
    renderAll();
    setStatus('Imported content JSON and saved it to this browser.');
    event.target.value = '';
  });

  document.getElementById('resetDataBtn').addEventListener('click', () => {
    data = cms.resetSiteData();
    renderAll();
    setStatus('Dashboard reset to default content. Save only if you want to keep the reset.');
  });

  renderAll();
});

function escapeAttr(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function mergeImportedData(defaults, imported) {
  if (Array.isArray(defaults)) {
    return Array.isArray(imported) ? imported : defaults;
  }
  if (defaults && typeof defaults === 'object') {
    const output = {};
    Object.keys(defaults).forEach((key) => {
      output[key] = mergeImportedData(defaults[key], imported ? imported[key] : undefined);
    });
    Object.keys(imported || {}).forEach((key) => {
      if (!(key in output)) output[key] = imported[key];
    });
    return output;
  }
  return imported === undefined ? defaults : imported;
}

async function fileToDataUrl(file, maxSide) {
  const source = await readFileAsDataUrl(file);
  const image = await loadImage(source);
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);
  const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const quality = type === 'image/png' ? undefined : 0.86;
  return canvas.toDataURL(type, quality);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}
