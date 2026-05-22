/* ============================================================
   LITERARY LAB — Shared Content Store
   ============================================================ */

(function () {
  const STORAGE_KEY = 'literary-lab-cms-data-v1';

  const DEFAULT_DATA = {
    shared: {
      email: 'lab@zorqstudio.com',
      whatsappNumber: '923472590983',
      whatsappDisplay: '+923472590983',
      footerCreditText: 'Created by Zorq Studio',
      footerCreditUrl: 'https://zorqstudio.com/'
    },
    home: {
      heroEyebrow: "Pakistan's Premier Book Design Studio",
      heroTitleHtml: 'Where Stories<br>Find Their <em>Perfect</em><br>Form',
      heroBody: 'Professional book covers, print-ready interior formatting, and publishing support — crafted with precision for self-published authors worldwide.',
      primaryCtaLabel: 'Start Your Project',
      secondaryCtaLabel: 'View Our Work',
      stats: [
        { target: '200', suffix: '+', prefix: '', label: 'Books Designed' },
        { target: '150', suffix: '+', prefix: '', label: 'Happy Authors' },
        { target: '5', suffix: '', prefix: '★ ', label: 'Average Rating' },
        { target: '100', suffix: '%', prefix: '', label: 'Satisfaction Guaranteed' }
      ],
      testimonials: [
        {
          stars: '★★★★★',
          text: 'The interior formatting was flawless — KDP accepted the file on the first upload. The layout looks genuinely professional, exactly what I wanted for my debut novel.',
          initials: 'SR',
          author: 'Sarah Reynolds',
          role: 'Fiction Author, UK'
        },
        {
          stars: '★★★★★',
          text: 'My book cover went from invisible to ranking on the first page of Amazon. Literary Lab understood my genre instantly and delivered a design that truly sells.',
          initials: 'MK',
          author: 'Marcus K.',
          role: 'Business Author, USA'
        },
        {
          stars: '★★★★★',
          text: 'Fast, professional, and the communication was excellent throughout. They handled both my print and eBook versions perfectly. Will use again for my next book.',
          initials: 'PA',
          author: 'Priya Anand',
          role: 'Non-Fiction Author, India'
        }
      ]
    },
    portfolio: {
      items: [
        { category: 'covers', label: 'Cover Design', title: 'Book Cover Design', alt: 'Book cover design portfolio item', imageSrc: '' },
        { category: 'interior', label: 'Book Interior', title: 'Interior Formatting', alt: 'Interior formatting portfolio item', imageSrc: '' },
        { category: 'covers', label: 'Cover Design', title: 'Creative Cover', alt: 'Creative cover design portfolio item', imageSrc: '' },
        { category: 'ebook', label: 'eBook Conversion', title: 'eBook Design', alt: 'eBook design portfolio item', imageSrc: '' },
        { category: 'covers', label: 'Cover Design', title: 'Non-Fiction Cover', alt: 'Non-fiction cover design portfolio item', imageSrc: '' },
        { category: 'interior', label: 'Book Interior', title: 'Chapter Layouts', alt: 'Chapter layouts portfolio item', imageSrc: '' },
        { category: 'covers', label: 'Cover Design', title: 'Fiction Cover', alt: 'Fiction cover portfolio item', imageSrc: '' },
        { category: 'interior', label: 'Book Interior', title: 'Formatted Spread', alt: 'Formatted spread portfolio item', imageSrc: '' },
        { category: 'ebook', label: 'eBook', title: 'Kindle Edition', alt: 'Kindle edition portfolio item', imageSrc: '' }
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
          title: 'Interior Formatting',
          description: 'Up to 80,000 words',
          price: '99',
          label: 'Per Project',
          featured: false,
          buttonLabel: 'Get Started',
          buttonStyle: 'outline',
          features: [
            'Adobe InDesign layout',
            'KDP / IngramSpark specs',
            'Front matter included',
            'Page numbers & TOC',
            'Print-ready PDF',
            'Unlimited revisions'
          ]
        },
        {
          title: 'Cover + Interior Bundle',
          description: 'Most popular package',
          price: '249',
          label: 'Per Project',
          featured: true,
          buttonLabel: 'Get Started',
          buttonStyle: 'primary',
          features: [
            'Custom cover design',
            'Full print wrap + eBook cover',
            'Interior formatting',
            'KDP & IngramSpark ready',
            'All file formats included',
            'Unlimited revisions'
          ]
        },
        {
          title: 'Cover Design Only',
          description: 'Print wrap + eBook file',
          price: '149',
          label: 'Per Project',
          featured: false,
          buttonLabel: 'Get Started',
          buttonStyle: 'outline',
          features: [
            'Custom genre-targeted design',
            'Front, spine & back cover',
            'Separate eBook cover',
            'High-res print PDF',
            'Web-optimized JPG',
            'Unlimited revisions'
          ]
        }
      ]
    },
    about: {
      visualImage: '',
      storyStats: [
        { value: '200+', label: 'Books Designed' },
        { value: '5★', label: 'Average Rating' },
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
    const keys = new Set([
      ...Object.keys(defaults || {}),
      ...Object.keys(saved || {})
    ]);

    keys.forEach((key) => {
      result[key] = mergeDefaults(defaults[key], saved ? saved[key] : undefined);
    });

    return result;
  }

  function loadSiteData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return deepClone(DEFAULT_DATA);
      const parsed = JSON.parse(raw);
      return mergeDefaults(DEFAULT_DATA, parsed);
    } catch (error) {
      console.warn('Failed to load Literary Lab CMS data. Falling back to defaults.', error);
      return deepClone(DEFAULT_DATA);
    }
  }

  function saveSiteData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function resetSiteData() {
    localStorage.removeItem(STORAGE_KEY);
    return deepClone(DEFAULT_DATA);
  }

  window.LiteraryLabCMS = {
    STORAGE_KEY,
    DEFAULT_DATA: deepClone(DEFAULT_DATA),
    loadSiteData,
    saveSiteData,
    resetSiteData,
    deepClone
  };
})();
