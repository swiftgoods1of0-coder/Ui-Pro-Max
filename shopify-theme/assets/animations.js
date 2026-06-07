/* ============================================================
   SWIFT GOODS — GSAP ANIMATIONS
   Premium Luxury Streetwear | Shopify 2.0
   ============================================================
   Stack: GSAP 3.12 + ScrollTrigger
   Principles:
     - Slow, deliberate timing (0.9–1.4s)
     - power4.out for snappy arrivals, power2.out for soft
     - Parallax scrub on desktop only
     - Respects prefers-reduced-motion
     - Shopify Customizer safe (section:load / section:unload)
   ============================================================ */

(function () {
  'use strict';

  /* ── Guards ─────────────────────────────────────────────────── */
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  /* When reduced motion is preferred, reveal everything immediately
     and let CSS/browser handle the rest. */
  if (REDUCED) {
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    window.SwiftGoods = window.SwiftGoods || {};
    window.SwiftGoods.gsapReady = true;
    return;
  }

  /* ── Namespace ──────────────────────────────────────────────── */
  window.SwiftGoods = window.SwiftGoods || {};

  /* ── Text Splitting ─────────────────────────────────────────── */

  /**
   * Splits a headline by <br> tags into masked lines.
   * Each line slides up from behind an overflow:hidden wrapper.
   * Returns NodeList of the inner .sg-line spans.
   */
  function splitByLines(el) {
    if (!el || el.dataset.sgSplit) return [];
    el.dataset.sgSplit = 'lines';

    const raw = el.innerHTML;
    const lines = raw.split(/<br\s*\/?>/gi).map(l => l.trim()).filter(Boolean);

    el.innerHTML = lines.map(line =>
      `<span class="sg-line-wrap"><span class="sg-line">${line}</span></span>`
    ).join('');

    return Array.from(el.querySelectorAll('.sg-line'));
  }

  /**
   * Splits plain text into masked words.
   * Each word slides up from behind an overflow:hidden wrapper.
   * Returns NodeList of the inner .sg-word spans.
   */
  function splitToWords(el) {
    if (!el || el.dataset.sgSplit) return [];
    el.dataset.sgSplit = 'words';

    const text = el.textContent.trim();
    if (!text) return [];

    const words = text.split(/\s+/);
    el.innerHTML = words.map(w =>
      `<span class="sg-word-wrap"><span class="sg-word">${w}</span></span>`
    ).join('&thinsp;&thinsp;');

    return Array.from(el.querySelectorAll('.sg-word'));
  }

  /* ── Hero: Cinematic Text Reveal ────────────────────────────── */
  function initHero(gsap) {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const eyebrow  = hero.querySelector('.hero__eyebrow');
    const headline = hero.querySelector('.hero__headline');
    const subtext  = hero.querySelector('.hero__subtext');
    const actions  = hero.querySelector('.hero__actions');
    const scroll   = hero.querySelector('.hero__scroll');
    const overlay  = hero.querySelector('.hero__overlay');

    const tl = gsap.timeline({ delay: 0.3, defaults: { ease: 'power4.out' } });

    /* 1. Overlay dims in (media is already visible from CSS) */
    if (overlay) {
      gsap.set(overlay, { opacity: 0 });
      tl.to(overlay, { opacity: 1, duration: 1.6, ease: 'power2.inOut' }, 0);
    }

    /* 2. Eyebrow: fades in with letter-spacing collapse */
    if (eyebrow) {
      gsap.set(eyebrow, { opacity: 0, letterSpacing: '0.5em', y: 8 });
      tl.to(eyebrow, {
        opacity: 1,
        letterSpacing: '0.25em',
        y: 0,
        duration: 1.1,
        ease: 'power3.out'
      }, 0.3);
    }

    /* 3. Headline: per-line curtain reveal (mask sliding up) */
    if (headline) {
      const lines = splitByLines(headline);
      if (lines.length) {
        gsap.set(lines, { y: '108%' });
        tl.to(lines, {
          y: '0%',
          duration: 1.15,
          stagger: 0.1,
          ease: 'power4.out'
        }, eyebrow ? 0.55 : 0.3);
      }
    }

    /* 4. Subtext: fade up */
    if (subtext) {
      gsap.set(subtext, { opacity: 0, y: 28 });
      tl.to(subtext, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.55');
    }

    /* 5. CTA buttons: staggered fade up */
    if (actions) {
      const btns = Array.from(actions.querySelectorAll('.btn'));
      gsap.set(btns, { opacity: 0, y: 22 });
      tl.to(btns, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.13,
        ease: 'power3.out'
      }, '-=0.55');
    }

    /* 6. Scroll indicator: subtle fade */
    if (scroll) {
      gsap.set(scroll, { opacity: 0 });
      tl.to(scroll, { opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.3');
    }
  }

  /* ── Section Heading Word Reveal ────────────────────────────── */
  function initHeadingReveal(gsap, ScrollTrigger) {
    const SELECTORS = [
      '.section-title',
      '.brand-story__heading',
      '.craftsmanship__heading',
      '.newsletter__heading',
      '.lifestyle-image__text',
      '.brand-statement__quote',
    ].join(',');

    document.querySelectorAll(SELECTORS).forEach(heading => {
      /* Don't touch headings inside hero (handled separately) */
      if (heading.closest('.hero')) return;

      const words = splitToWords(heading);
      if (!words.length) return;

      gsap.set(words, { y: '112%' });

      ScrollTrigger.create({
        trigger: heading,
        start: 'top 87%',
        once: true,
        onEnter: () => {
          gsap.to(words, {
            y: '0%',
            duration: 0.95,
            ease: 'power4.out',
            stagger: 0.045
          });
        }
      });
    });
  }

  /* ── Generic Scroll Fade-ins ────────────────────────────────── */
  function initScrollFadeIns(gsap, ScrollTrigger) {
    document.querySelectorAll('[data-animate]').forEach(el => {
      /* Hero elements handled by hero timeline */
      if (el.closest('.hero')) return;
      /* Skip if already wired */
      if (el._sg) return;
      el._sg = true;

      const delayAttr = el.dataset.animateDelay;
      const delay     = delayAttr ? parseFloat(delayAttr) * 0.11 : 0;

      gsap.set(el, { opacity: 0, y: 38 });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.88,
            delay,
            ease: 'power3.out'
          });
        }
      });
    });
  }

  /* ── Image Scale Reveal ─────────────────────────────────────── */
  function initImageReveal(gsap, ScrollTrigger) {
    /* Editorial images: scale + fade as they enter */
    const EDITORIAL = [
      '.brand-story__image--main img',
      '.craftsmanship__image-wrap img',
      '.best-sellers__featured-media img',
    ].join(',');

    document.querySelectorAll(EDITORIAL).forEach(img => {
      if (img._sg) return;
      img._sg = true;

      gsap.set(img, { scale: 1.12, opacity: 0.6 });

      ScrollTrigger.create({
        trigger: img,
        start: 'top 92%',
        once: true,
        onEnter: () => {
          gsap.to(img, {
            scale: 1,
            opacity: 1,
            duration: 1.4,
            ease: 'power2.out'
          });
        }
      });
    });

    /* Product cards: staggered reveal within each grid */
    document.querySelectorAll('.products-grid, .best-sellers__grid').forEach(grid => {
      if (grid._sg) return;
      grid._sg = true;

      const cards = grid.querySelectorAll('.product-card');
      gsap.set(cards, { opacity: 0, y: 48 });

      ScrollTrigger.create({
        trigger: grid,
        start: 'top 86%',
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.08
          });
        }
      });
    });
  }

  /* ── Parallax ───────────────────────────────────────────────── */
  function initParallax(gsap, ScrollTrigger) {
    /* Disable on mobile — battery / performance */
    if (isMobile()) return;

    /* Hero: background drifts 28% as you scroll out */
    const heroMedia = document.querySelector('.hero__media');
    if (heroMedia) {
      gsap.to(heroMedia, {
        yPercent: 28,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    /* Lifestyle images: gentle depth push */
    document.querySelectorAll('.lifestyle-image').forEach(section => {
      const img = section.querySelector('.lifestyle-image__media img');
      if (!img) return;

      gsap.fromTo(img,
        { yPercent: -14 },
        {
          yPercent: 14,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        }
      );
    });

    /* Brand statement background: slow drift */
    const bsMedia = document.querySelector('.brand-statement__media');
    if (bsMedia) {
      gsap.fromTo(bsMedia,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: '.brand-statement',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.8
          }
        }
      );
    }

    /* Brand story primary image: subtle upward drift */
    const storyImg = document.querySelector('.brand-story__image--main');
    if (storyImg) {
      gsap.to(storyImg, {
        y: -52,
        ease: 'none',
        scrollTrigger: {
          trigger: storyImg.closest('section'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    /* Secondary floating image: slightly faster drift for depth */
    const storyImgAccent = document.querySelector('.brand-story__image--accent');
    if (storyImgAccent) {
      gsap.to(storyImgAccent, {
        y: -28,
        ease: 'none',
        scrollTrigger: {
          trigger: storyImgAccent.closest('section'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8
        }
      });
    }

    /* Craftsmanship image: slow reveal upward */
    const craftImg = document.querySelector('.craftsmanship__image-wrap img');
    if (craftImg) {
      gsap.fromTo(craftImg,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: '.craftsmanship',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        }
      );
    }
  }

  /* ── Product Card Hover ─────────────────────────────────────── */
  function initProductCardHover(gsap) {
    document.querySelectorAll('.product-card').forEach(card => {
      if (card._sgHover) return;
      card._sgHover = true;

      const title    = card.querySelector('.product-card__title');
      const quickAdd = card.querySelector('.product-card__quick-add');
      const actions  = card.querySelector('.product-card__actions');

      /* CSS handles the primary↔hover image swap via transition classes.
         GSAP manages: quick-add slide, title tint, action buttons.
         Image scale/swap is CSS-driven (no conflict). */
      if (quickAdd) gsap.set(quickAdd, { y: '100%' });
      if (actions)  gsap.set(actions,  { opacity: 0, x: 8 });

      card.addEventListener('mouseenter', () => {
        if (quickAdd) {
          gsap.to(quickAdd, {
            y: '0%',
            duration: 0.4,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        }
        if (actions) {
          gsap.to(actions, {
            opacity: 1,
            x: 0,
            duration: 0.32,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
        if (title) {
          gsap.to(title, {
            color: 'var(--accent)',
            duration: 0.28,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        if (quickAdd) {
          gsap.to(quickAdd, {
            y: '100%',
            duration: 0.32,
            ease: 'power3.in',
            overwrite: 'auto'
          });
        }
        if (actions) {
          gsap.to(actions, {
            opacity: 0,
            x: 8,
            duration: 0.24,
            ease: 'power2.in',
            overwrite: 'auto'
          });
        }
        if (title) {
          gsap.to(title, {
            color: 'var(--text)',
            duration: 0.28,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });
    });
  }

  /* ── Button Hover ───────────────────────────────────────────── */
  function initButtonHover(gsap) {
    /* Primary: light shimmer sweep */
    document.querySelectorAll('.btn--primary').forEach(btn => {
      if (btn._sgShimmer) return;
      btn._sgShimmer = true;

      const shimmer = document.createElement('span');
      shimmer.className = 'sg-shimmer';
      btn.appendChild(shimmer);

      gsap.set(shimmer, { xPercent: -220 });

      btn.addEventListener('mouseenter', () => {
        gsap.to(shimmer, {
          xPercent: 220,
          duration: 0.68,
          ease: 'power2.inOut',
          overwrite: true
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.set(shimmer, { xPercent: -220 });
      });
    });

    /* Secondary / collection-link: arrow nudge */
    document.querySelectorAll('.btn--secondary, .collection-link').forEach(btn => {
      if (btn._sgArrow) return;
      btn._sgArrow = true;

      const arrow = btn.querySelector('svg');
      if (!arrow) return;

      btn.addEventListener('mouseenter', () => {
        gsap.to(arrow, { x: 6, duration: 0.32, ease: 'power2.out', overwrite: 'auto' });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(arrow, { x: 0, duration: 0.32, ease: 'power2.inOut', overwrite: 'auto' });
      });
    });
  }

  /* ── Line Draws ─────────────────────────────────────────────── */
  function initLineDraws(gsap, ScrollTrigger) {
    const LINES = [
      '.brand-statement__accent-bar',
      '.brand-story__accent-line',
      '.divider--accent',
    ].join(',');

    document.querySelectorAll(LINES).forEach(line => {
      if (line._sg) return;
      line._sg = true;

      gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });

      ScrollTrigger.create({
        trigger: line,
        start: 'top 93%',
        once: true,
        onEnter: () => {
          gsap.to(line, {
            scaleX: 1,
            duration: 1.05,
            ease: 'power3.out'
          });
        }
      });
    });
  }

  /* ── Stat Counter ───────────────────────────────────────────── */
  function initCounters(gsap, ScrollTrigger) {
    document.querySelectorAll('.craft-stat__value').forEach(stat => {
      if (stat._sg) return;
      stat._sg = true;

      const raw    = stat.textContent.trim();
      const suffix = raw.replace(/[\d.]+/, '');
      const num    = parseFloat(raw);
      if (isNaN(num)) return;

      const obj = { value: 0 };

      ScrollTrigger.create({
        trigger: stat,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            value: num,
            duration: 1.9,
            ease: 'power2.out',
            onUpdate() {
              stat.textContent = Math.round(obj.value) + suffix;
            }
          });
        }
      });
    });
  }

  /* ── Craft Feature Stagger ──────────────────────────────────── */
  function initCraftFeatures(gsap, ScrollTrigger) {
    const features = document.querySelectorAll('.craft-feature');
    if (!features.length) return;

    const unwired = Array.from(features).filter(f => !f._sg);
    if (!unwired.length) return;

    unwired.forEach(f => { f._sg = true; });

    gsap.set(unwired, { opacity: 0, x: -28 });

    ScrollTrigger.create({
      trigger: unwired[0],
      start: 'top 86%',
      once: true,
      onEnter: () => {
        gsap.to(unwired, {
          opacity: 1,
          x: 0,
          duration: 0.78,
          ease: 'power3.out',
          stagger: 0.11
        });
      }
    });
  }

  /* ── Social Gallery Reveal ──────────────────────────────────── */
  function initGalleryReveal(gsap, ScrollTrigger) {
    const gallery = document.querySelector('.social-gallery');
    if (!gallery || gallery._sg) return;
    gallery._sg = true;

    const items = gallery.querySelectorAll('.social-gallery__item');
    gsap.set(items, { opacity: 0, scale: 0.93 });

    ScrollTrigger.create({
      trigger: gallery,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          scale: 1,
          duration: 0.62,
          ease: 'power2.out',
          stagger: { amount: 0.55, from: 'random' }
        });
      }
    });
  }

  /* ── Craftsmanship Panel Slide ──────────────────────────────── */
  function initCraftPanel(gsap, ScrollTrigger) {
    const panel = document.querySelector('.craftsmanship__features');
    if (!panel || panel._sg) return;
    panel._sg = true;

    gsap.set(panel, { opacity: 0, x: 44 });

    ScrollTrigger.create({
      trigger: panel,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(panel, {
          opacity: 1,
          x: 0,
          duration: 0.95,
          ease: 'power3.out'
        });
      }
    });
  }

  /* ── Newsletter Panel ───────────────────────────────────────── */
  function initNewsletterReveal(gsap, ScrollTrigger) {
    const formCol = document.querySelector('.newsletter__form-col');
    if (!formCol || formCol._sg) return;
    formCol._sg = true;

    gsap.set(formCol, { opacity: 0, y: 32 });

    ScrollTrigger.create({
      trigger: formCol,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(formCol, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
      }
    });
  }

  /* ── Brand Story Founding Year Badge ───────────────────────── */
  function initYearBadge(gsap, ScrollTrigger) {
    const badge = document.querySelector('.brand-story__year');
    if (!badge || badge._sg) return;
    badge._sg = true;

    gsap.set(badge, { opacity: 0, scale: 0.85, y: 24 });

    ScrollTrigger.create({
      trigger: badge,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(badge, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.85,
          ease: 'back.out(1.4)'
        });
      }
    });
  }

  /* ── Ticker Setup ───────────────────────────────────────────── */
  function initTicker(gsap) {
    /* CSS animation handles the scroll; GSAP just pauses on hover */
    document.querySelectorAll('.ticker').forEach(ticker => {
      const inner = ticker.querySelector('.ticker__inner');
      if (!inner) return;

      ticker.addEventListener('mouseenter', () => {
        gsap.to(inner, { timeScale: 0, ease: 'power2.out', duration: 0.4,
          onUpdate() { /* CSS animation pause workaround */ }
        });
        inner.style.animationPlayState = 'paused';
      });

      ticker.addEventListener('mouseleave', () => {
        inner.style.animationPlayState = 'running';
      });
    });
  }

  /* ── Nav Link Hover ─────────────────────────────────────────── */
  function initNavHover(gsap) {
    document.querySelectorAll('.header-nav__link').forEach(link => {
      if (link._sgNav) return;
      link._sgNav = true;

      /* Create a real element GSAP can animate (pseudo ::after can't be tweened) */
      const line = document.createElement('span');
      line.style.cssText = [
        'position:absolute',
        'bottom:-4px',
        'left:0',
        'height:1px',
        'width:100%',
        'background:var(--accent)',
        'transform-origin:left center',
        'pointer-events:none',
      ].join(';');
      link.appendChild(line);
      gsap.set(line, { scaleX: 0 });

      /* Hide the CSS ::after so it doesn't double-render the underline */
      link.style.setProperty('--sg-nav-after', 'none');

      link.addEventListener('mouseenter', () => {
        gsap.to(line, {
          scaleX: 1,
          transformOrigin: 'left center',
          duration: 0.34,
          ease: 'power2.out',
          overwrite: true
        });
      });

      link.addEventListener('mouseleave', () => {
        gsap.to(line, {
          scaleX: 0,
          transformOrigin: 'right center',
          duration: 0.27,
          ease: 'power2.in',
          overwrite: true
        });
      });
    });
  }

  /* ── Smooth Scroll on Anchor Clicks ────────────────────────── */
  function initSmoothScroll(gsap) {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const id = link.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: target, offsetY: 72 },
          ease: 'power3.inOut'
        });
      });
    });
  }

  /* ── Main Init ──────────────────────────────────────────────── */
  function init() {
    const gsap         = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    if (!gsap || !ScrollTrigger) {
      console.warn('[Swift Goods] GSAP or ScrollTrigger not available.');
      /* Fallback: reveal everything */
      document.querySelectorAll('[data-animate]').forEach(el => {
        el.classList.add('is-visible');
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* ScrollTrigger defaults */
    ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });
    ScrollTrigger.defaults({ markers: false });

    /* Signal that GSAP is active (used by theme.js fallback) */
    window.SwiftGoods.gsapReady = true;

    /* ── Run all animation modules ── */
    initHero(gsap);
    initHeadingReveal(gsap, ScrollTrigger);
    initScrollFadeIns(gsap, ScrollTrigger);
    initImageReveal(gsap, ScrollTrigger);
    initParallax(gsap, ScrollTrigger);
    initProductCardHover(gsap);
    initButtonHover(gsap);
    initLineDraws(gsap, ScrollTrigger);
    initCounters(gsap, ScrollTrigger);
    initCraftFeatures(gsap, ScrollTrigger);
    initGalleryReveal(gsap, ScrollTrigger);
    initCraftPanel(gsap, ScrollTrigger);
    initNewsletterReveal(gsap, ScrollTrigger);
    initYearBadge(gsap, ScrollTrigger);
    initTicker(gsap);
    initNavHover(gsap);

    /* ScrollPlugin for smooth anchor scroll (optional, loaded separately) */
    if (window.ScrollToPlugin) {
      gsap.registerPlugin(window.ScrollToPlugin);
      initSmoothScroll(gsap);
    }
  }

  /* ── Shopify Theme Editor Compatibility ─────────────────────── */
  function onSectionLoad() {
    const { gsap, ScrollTrigger } = window;
    if (!gsap || !ScrollTrigger) return;

    /* Refresh triggers after DOM changes */
    ScrollTrigger.refresh();

    /* Re-run all modules (they all guard against double-init via el._sg) */
    setTimeout(() => {
      initHeadingReveal(gsap, ScrollTrigger);
      initScrollFadeIns(gsap, ScrollTrigger);
      initImageReveal(gsap, ScrollTrigger);
      initProductCardHover(gsap);
      initButtonHover(gsap);
      initLineDraws(gsap, ScrollTrigger);
      initCounters(gsap, ScrollTrigger);
      initCraftFeatures(gsap, ScrollTrigger);
      initGalleryReveal(gsap, ScrollTrigger);
      initCraftPanel(gsap, ScrollTrigger);
      initNewsletterReveal(gsap, ScrollTrigger);
      initYearBadge(gsap, ScrollTrigger);
      initTicker(gsap);
      ScrollTrigger.refresh();
    }, 120);
  }

  function onSectionUnload() {
    /* Kill all ScrollTrigger instances to prevent memory leaks */
    if (window.ScrollTrigger) {
      window.ScrollTrigger.getAll().forEach(st => st.kill());
    }
  }

  /* ── Boot ───────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('shopify:section:load', onSectionLoad);
  document.addEventListener('shopify:section:unload', onSectionUnload);

})();
