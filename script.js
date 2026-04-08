/* ============================================
   PRECISIÓN ESTRATÉGICA — PREMIUM CONSULTING
   JavaScript — Interactions, Animations & i18n
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════
  // i18n — LANGUAGE SYSTEM ENGINE
  // ═══════════════════════════════════════════

  const I18N = (() => {
    const DEFAULT_LANG = 'es';
    const STORAGE_KEY = 'kevin_site_lang';
    let currentLang = DEFAULT_LANG;

    const getSavedLang = () => {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    };

    const saveLang = (lang) => {
      localStorage.setItem(STORAGE_KEY, lang);
    };

    const t = (key, lang) => {
      const entry = translations[key];
      if (!entry) {
        console.warn(`[i18n] Missing key: "${key}"`);
        return '';
      }
      return entry[lang] || entry[DEFAULT_LANG] || '';
    };

    const applyTranslations = (lang, animate = true) => {
      currentLang = lang;

      document.documentElement.setAttribute('lang', lang);

      const titleText = t('meta_title', lang);
      if (titleText) document.title = titleText;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', t('meta_description', lang));
      }

      const elements = document.querySelectorAll('[data-i18n]');
      const attrElements = document.querySelectorAll('[data-i18n-attr]');

      if (animate) {
        elements.forEach(el => el.classList.add('i18n-fade'));
        attrElements.forEach(el => el.classList.add('i18n-fade'));

        setTimeout(() => {
          _setTextContent(elements, lang);
          _setAttrContent(attrElements, lang);

          elements.forEach(el => el.classList.remove('i18n-fade'));
          attrElements.forEach(el => el.classList.remove('i18n-fade'));
        }, 300);
      } else {
        _setTextContent(elements, lang);
        _setAttrContent(attrElements, lang);
      }

      _updateWhatsAppLinks(lang);
    };

    const _setTextContent = (elements, lang) => {
      elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = t(key, lang);
        if (text) {
          const svg = el.querySelector('svg');
          if (svg && el.tagName !== 'H1' && el.tagName !== 'H2' && el.tagName !== 'H3' && el.tagName !== 'H4') {
            const svgHTML = svg.outerHTML;
            el.innerHTML = text + ' ' + svgHTML;
          } else {
            el.innerHTML = text;
          }
        }
      });
    };

    const _setAttrContent = (elements, lang) => {
      elements.forEach(el => {
        const value = el.getAttribute('data-i18n-attr');
        if (!value) return;

        value.split(',').forEach(pair => {
          const [attr, key] = pair.trim().split(':');
          const text = t(key, lang);
          if (text && attr) {
            el.setAttribute(attr.trim(), text);
          }
        });
      });
    };

    const _updateWhatsAppLinks = (lang) => {
      const greeting = lang === 'es'
        ? 'Hola%20Kevin,%20estoy%20interesado%20en%20una%20consulta.'
        : 'Hello%20Kevin,%20I\'m%20interested%20in%20a%20consultation.';
      const baseUrl = 'https://wa.me/1234567890?text=';

      document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.setAttribute('href', baseUrl + greeting);
      });
    };

    const getCurrentLang = () => currentLang;

    return {
      DEFAULT_LANG,
      getSavedLang,
      saveLang,
      applyTranslations,
      getCurrentLang,
      t
    };
  })();

  // ═══════════════════════════════════════════
  // LANGUAGE TOGGLE — UI Controller
  // ═══════════════════════════════════════════

  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    const labelES = langToggle.querySelector('.lang-label-es');
    const labelEN = langToggle.querySelector('.lang-label-en');

    const updateToggleUI = (lang) => {
      if (lang === 'en') {
        langToggle.classList.add('is-en');
        labelES.classList.remove('active');
        labelEN.classList.add('active');
      } else {
        langToggle.classList.remove('is-en');
        labelEN.classList.remove('active');
        labelES.classList.add('active');
      }
    };

    const toggleLanguage = () => {
      const newLang = I18N.getCurrentLang() === 'es' ? 'en' : 'es';
      I18N.saveLang(newLang);
      updateToggleUI(newLang);
      I18N.applyTranslations(newLang, true);
    };

    langToggle.addEventListener('click', toggleLanguage);

    langToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleLanguage();
      }
    });

    // Initialize
    const savedLang = I18N.getSavedLang();
    updateToggleUI(savedLang);
    I18N.applyTranslations(savedLang, false);
  }

  // ═══════════════════════════════════════════
  // NAVBAR — Scroll Effect
  // ═══════════════════════════════════════════

  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ═══════════════════════════════════════════
  // HAMBURGER — Mobile Menu Toggle
  // ═══════════════════════════════════════════

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ═══════════════════════════════════════════
  // SMOOTH SCROLL — Anchor Links
  // ═══════════════════════════════════════════

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ═══════════════════════════════════════════
  // SCROLL REVEAL — Intersection Observer
  // ═══════════════════════════════════════════

  const revealElements = document.querySelectorAll('.reveal, .services-bar-card, .pain-card, .methab-step, .case-card, .trust-logo');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`;
    revealObserver.observe(el);
  });

  // ═══════════════════════════════════════════
  // ACTIVE NAV LINK — Highlighting
  // ═══════════════════════════════════════════

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-menu a');

  const highlightNav = () => {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ═══════════════════════════════════════════
  // CONTACT FORM — Submission Handler
  // ═══════════════════════════════════════════

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('.btn-gold');
      const lang = I18N.getCurrentLang();

      btn.textContent = I18N.t('form_sending', lang);
      btn.style.opacity = '0.7';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = I18N.t('form_sent', lang);
        btn.style.opacity = '1';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

        contactForm.reset();

        setTimeout(() => {
          btn.textContent = I18N.t('contact_form_submit', lang);
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  // ═══════════════════════════════════════════
  // PARTICLE BACKGROUND — Canvas Animation
  // ═══════════════════════════════════════════

  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        this.opacity += this.fadeDirection * 0.002;
        if (this.opacity >= 0.6) this.fadeDirection = -1;
        if (this.opacity <= 0.1) this.fadeDirection = 1;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.fill();
      }
    }

    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.1;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      connectParticles();

      animationFrame = requestAnimationFrame(animateParticles);
    };

    animateParticles();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrame);
      } else {
        animateParticles();
      }
    });
  }

});
