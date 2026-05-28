/* ============================================================
   LITERARY LAB - Shared Content Store
   ============================================================ */

(function () {
  const ADMIN_TOKEN_STORAGE_KEY = 'literary-lab-github-token-v1';
  const REPO_CONFIG = {
    owner: 'jjafri45',
    repo: 'literary-lab-website',
    branch: 'main',
    contentPath: 'data/site-content.json',
    assetBasePath: 'images/cms'
  };

  const DEFAULT_DATA = {
    shared: {
      email: 'lab@zorqstudio.com',
      whatsappNumber: '923472590983',
      whatsappDisplay: '+923472590983',
      footerCreditText: 'Created by Zorq Studio',
      footerCreditUrl: 'https://zorqstudio.com/'
    },
    home: {
      heroEyebrow: 'For self-published and first-time authors',
      heroTitleHtml: 'Turn Your Rough Manuscript Into a Book Readers Can Trust',
      heroBody: 'Editing, proofreading, cover design, interior formatting, and publishing support in one place - built for authors who want a professional book without guessing their way through Amazon.',
      primaryCtaLabel: 'Get My Book Plan',
      secondaryCtaLabel: 'See Published Proof',
      stats: [
        { target: '200', suffix: '+', prefix: '', label: 'Books Designed' },
        { target: '150', suffix: '+', prefix: '', label: 'Authors Helped' },
        { target: '5', suffix: '.0', prefix: '* ', label: 'Rating' },
        { target: '100', suffix: '%', prefix: '', label: 'Upload-Ready Delivery' }
      ],
      testimonials: [
        {
          stars: '*****',
          text: 'The interior formatting was flawless and KDP accepted the file on the first upload. As a first-time author, that removed a huge amount of stress and made the whole launch feel manageable.',
          initials: 'SR',
          author: 'Sarah Reynolds',
          role: 'Fiction Author, UK'
        },
        {
          stars: '*****',
          text: 'My book cover went from invisible to looking commercially ready. They understood the genre, made the thumbnail stronger, and the final package looked like something readers could trust immediately.',
          initials: 'MK',
          author: 'Marcus K.',
          role: 'Business Author, USA'
        },
        {
          stars: '*****',
          text: 'Fast, professional, and clear from start to finish. They handled the print files, Kindle version, and revisions without making me guess what came next, which is exactly what new authors need.',
          initials: 'PA',
          author: 'Priya Anand',
          role: 'Non-Fiction Author, India'
        }
      ]
    },
    portfolio: {
      items: [
        { category: 'covers', label: 'Cover Design', title: 'Book Cover Design', alt: 'Book cover design portfolio item', imageSrc: '', imageFit: 'cover', showOnHome: true },
        { category: 'interior', label: 'Book Interior', title: 'Interior Formatting', alt: 'Interior formatting portfolio item', imageSrc: '', imageFit: 'contain', showOnHome: true },
        { category: 'covers', label: 'Cover Design', title: 'Creative Cover', alt: 'Creative cover design portfolio item', imageSrc: '', imageFit: 'cover', showOnHome: true },
        { category: 'ebook', label: 'eBook Conversion', title: 'eBook Design', alt: 'eBook design portfolio item', imageSrc: '', imageFit: 'cover', showOnHome: true },
        { category: 'covers', label: 'Cover Design', title: 'Non-Fiction Cover', alt: 'Non-fiction cover design portfolio item', imageSrc: '', imageFit: 'cover', showOnHome: true },
        { category: 'interior', label: 'Book Interior', title: 'Chapter Layouts', alt: 'Chapter layouts portfolio item', imageSrc: '', imageFit: 'contain', showOnHome: true },
        { category: 'covers', label: 'Cover Design', title: 'Fiction Cover', alt: 'Fiction cover portfolio item', imageSrc: '', imageFit: 'cover', showOnHome: false },
        { category: 'interior', label: 'Book Interior', title: 'Formatted Spread', alt: 'Formatted spread portfolio item', imageSrc: '', imageFit: 'contain', showOnHome: false },
        { category: 'ebook', label: 'eBook', title: 'Kindle Edition', alt: 'Kindle edition portfolio item', imageSrc: '', imageFit: 'cover', showOnHome: false }
      ]
    },
    services: {
      visuals: {
        interior: '',
        covers: '',
        ebook: '',
        consult: ''
      },
      pricing: [
        {
          title: 'Manuscript to Print-Ready',
          description: 'For authors with a finished draft',
          price: '99',
          label: 'Flat Project Rate',
          featured: false,
          buttonLabel: 'Get Started',
          buttonStyle: 'outline',
          features: [
            'Interior formatting in Adobe InDesign',
            'KDP and IngramSpark specs',
            'Front matter and chapter styling',
            'Page numbers, TOC, headers and footers',
            'Print-ready PDF delivery',
            'Unlimited revisions'
          ]
        },
        {
          title: 'Author Launch Package',
          description: 'Best for first-time self-publishers',
          price: '249',
          label: 'Flat Project Rate',
          featured: true,
          buttonLabel: 'Get Started',
          buttonStyle: 'primary',
          features: [
            'Custom cover design for Kindle and print',
            'Full print wrap plus eBook cover',
            'Interior formatting and export',
            'KDP and IngramSpark ready files',
            'Clear deliverables and launch assets',
            'Unlimited revisions'
          ]
        },
        {
          title: 'Cover That Converts',
          description: 'For authors who need stronger first impressions',
          price: '149',
          label: 'Flat Project Rate',
          featured: false,
          buttonLabel: 'Get Started',
          buttonStyle: 'outline',
          features: [
            'Custom genre-targeted cover design',
            'Front, spine and back cover',
            'Separate Kindle cover file',
            'High-res print PDF',
            'Thumbnail-friendly web JPG',
            'Unlimited revisions'
          ]
        },
        {
          title: 'Proofreading Before Design',
          description: 'For rough or nearly-finished manuscripts',
          price: '49',
          label: 'Flat Project Rate',
          featured: false,
          buttonLabel: 'Get Started',
          buttonStyle: 'outline',
          features: [
            'Full manuscript proofread',
            'Grammar and spelling corrections',
            'Tracked changes in Word',
            '5-7 day turnaround',
            'One revision round included'
          ]
        }
      ]
    },
    blogs: {
      posts: [
        {
          id: 'blog-welcome',
          title: 'Welcome to the Literary Lab Blog',
          slug: 'welcome-to-the-literary-lab-blog',
          metaDescription: 'Insights for self-published authors on book covers, formatting, proofreading, and getting manuscripts ready for Amazon.',
          tags: ['self-publishing', 'book design'],
          contentHtml: '<p>This is a placeholder post. Replace it from the admin dashboard when you are ready to publish real blog content.</p>'
        }
      ]
    },
    about: {
      visualImage: '',
      storyStats: [
        { value: '200+', label: 'Books Designed' },
        { value: '5*', label: 'Average Rating' },
        { value: '24h', label: 'Response Time' }
      ],
      team: [
        {
          name: 'Jari',
          role: 'Founder & Lead Designer',
          bio: 'Over 5 years of professional book design experience. Specializes in cover design and InDesign interior layouts for KDP and IngramSpark.',
          imageSrc: ''
        },
        {
          name: 'Sheeraz',
          role: 'Client Success & Project Manager',
          bio: 'Handles client communication, project coordination, and ensures every project is delivered on time and to spec.',
          imageSrc: ''
        },
        {
          name: 'Design Team',
          role: 'Interior Formatting Specialists',
          bio: 'Our formatting specialists handle manuscript cleanup, typesetting, and print file preparation across all genres and formats.',
          imageSrc: ''
        }
      ]
    }
  };

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function isPlainObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
  }

  function mergeDefaults(defaults, saved) {
    if (Array.isArray(defaults)) {
      if (!Array.isArray(saved)) return deepClone(defaults);
      return saved.map((item, index) => mergeDefaults(defaults[index] ?? defaults[0] ?? {}, item));
    }

    if (!isPlainObject(defaults)) {
      return saved === undefined ? defaults : saved;
    }

    const result = {};
    const keys = new Set([...Object.keys(defaults || {}), ...Object.keys(saved || {})]);

    keys.forEach((key) => {
      result[key] = mergeDefaults(defaults[key], saved ? saved[key] : undefined);
    });

    return result;
  }

  function getContentUrl(forceFresh = false) {
    const suffix = forceFresh ? `?t=${Date.now()}` : '';
    return `data/site-content.json${suffix}`;
  }

  async function loadSiteData(options = {}) {
    const forceFresh = Boolean(options.forceFresh);
    try {
      const response = await fetch(getContentUrl(forceFresh), {
        cache: forceFresh ? 'no-store' : 'default'
      });

      if (!response.ok) {
        throw new Error(`Failed to load content file (${response.status})`);
      }

      const parsed = await response.json();
      return mergeDefaults(DEFAULT_DATA, parsed);
    } catch (error) {
      console.warn('Failed to load Literary Lab content file. Falling back to defaults.', error);
      return deepClone(DEFAULT_DATA);
    }
  }

  function resetSiteData() {
    return deepClone(DEFAULT_DATA);
  }

  function loadAdminToken() {
    try {
      return localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || '';
    } catch (error) {
      console.warn('Failed to read saved GitHub token.', error);
      return '';
    }
  }

  function saveAdminToken(token) {
    try {
      if (token) {
        localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
      } else {
        localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to persist GitHub token.', error);
    }
  }

  function slugify(value) {
    return String(value || 'asset')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'asset';
  }

  function getFileExtension(file) {
    const fromName = (file.name.split('.').pop() || '').toLowerCase();
    if (fromName && fromName !== file.name.toLowerCase()) return fromName;

    const typeMap = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'image/svg+xml': 'svg',
      'image/avif': 'avif'
    };

    return typeMap[file.type] || 'jpg';
  }

  function createAssetPath(asset) {
    const ext = getFileExtension(asset.file);
    const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
    const folder = slugify(asset.folder || 'misc');
    const label = slugify(asset.label || asset.file.name || 'image');
    return `${REPO_CONFIG.assetBasePath}/${folder}/${stamp}-${label}.${ext}`;
  }

  function setByPath(target, path, value) {
    const parts = Array.isArray(path) ? path : String(path).split('.');
    let current = target;

    for (let index = 0; index < parts.length - 1; index += 1) {
      const rawPart = parts[index];
      const part = /^\d+$/.test(rawPart) ? Number(rawPart) : rawPart;
      current = current[part];
    }

    const finalRawPart = parts[parts.length - 1];
    const finalPart = /^\d+$/.test(finalRawPart) ? Number(finalRawPart) : finalRawPart;
    current[finalPart] = value;
  }

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;

    for (let index = 0; index < bytes.length; index += chunkSize) {
      const chunk = bytes.subarray(index, index + chunkSize);
      binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
  }

  async function createBlob(token, content, encoding) {
    const response = await githubRequest('/git/blobs', token, {
      method: 'POST',
      body: JSON.stringify({ content, encoding })
    });
    return response.sha;
  }

  async function getBranchRef(token) {
    return githubRequest(`/git/ref/heads/${REPO_CONFIG.branch}`, token);
  }

  async function getCommit(token, commitSha) {
    return githubRequest(`/git/commits/${commitSha}`, token);
  }

  async function createTree(token, baseTreeSha, tree) {
    const response = await githubRequest('/git/trees', token, {
      method: 'POST',
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree
      })
    });
    return response.sha;
  }

  async function createCommit(token, message, treeSha, parentSha) {
    const response = await githubRequest('/git/commits', token, {
      method: 'POST',
      body: JSON.stringify({
        message,
        tree: treeSha,
        parents: [parentSha]
      })
    });
    return response.sha;
  }

  async function updateBranch(token, commitSha) {
    return githubRequest(`/git/refs/heads/${REPO_CONFIG.branch}`, token, {
      method: 'PATCH',
      body: JSON.stringify({
        sha: commitSha,
        force: false
      })
    });
  }

  async function githubRequest(path, token, options = {}) {
    const response = await fetch(`https://api.github.com/repos/${REPO_CONFIG.owner}/${REPO_CONFIG.repo}${path}`, {
      ...options,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      const message = await response.text();
      const error = new Error(`GitHub API ${response.status}: ${message}`);
      error.status = response.status;
      error.responseText = message;
      throw error;
    }

    if (response.status === 204) return null;
    return response.json();
  }

  function isFastForwardConflict(error) {
    return error && error.status === 422 && String(error.responseText || error.message || '').includes('not a fast forward');
  }

  async function publishSiteData(data, assets, token) {
    if (!token) {
      throw new Error('GitHub token is required to publish changes.');
    }

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const payload = deepClone(data);
      const treeEntries = [];

      for (const asset of assets) {
        const targetPath = createAssetPath(asset);
        const fileBuffer = await asset.file.arrayBuffer();
        const blobSha = await createBlob(token, arrayBufferToBase64(fileBuffer), 'base64');
        treeEntries.push({
          path: targetPath,
          mode: '100644',
          type: 'blob',
          sha: blobSha
        });
        setByPath(payload, asset.path, targetPath);
      }

      const contentSha = await createBlob(token, JSON.stringify(payload, null, 2) + '\n', 'utf-8');
      treeEntries.push({
        path: REPO_CONFIG.contentPath,
        mode: '100644',
        type: 'blob',
        sha: contentSha
      });

      const branchRef = await getBranchRef(token);
      const headCommitSha = branchRef.object.sha;
      const headCommit = await getCommit(token, headCommitSha);
      const newTreeSha = await createTree(token, headCommit.tree.sha, treeEntries);

      const message = assets.length
        ? `Update Literary Lab content and ${assets.length} image${assets.length === 1 ? '' : 's'}`
        : 'Update Literary Lab content';

      const newCommitSha = await createCommit(token, message, newTreeSha, headCommitSha);

      try {
        await updateBranch(token, newCommitSha);
        return payload;
      } catch (error) {
        if (!isFastForwardConflict(error) || attempt === 2) {
          throw error;
        }
      }
    }

    throw new Error('Publishing failed after multiple retries.');
  }

  window.LiteraryLabCMS = {
    ADMIN_TOKEN_STORAGE_KEY,
    REPO_CONFIG: { ...REPO_CONFIG },
    DEFAULT_DATA: deepClone(DEFAULT_DATA),
    deepClone,
    loadSiteData,
    resetSiteData,
    loadAdminToken,
    saveAdminToken,
    publishSiteData
  };
})();
