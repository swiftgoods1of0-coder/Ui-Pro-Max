/* ============================================================
   SWIFT GOODS — THEME JS
   Premium Luxury Streetwear | Shopify 2.0
   ============================================================ */

'use strict';

/* ── State ───────────────────────────────────────────────────── */
const State = {
  cartOpen: false,
  mobileMenuOpen: false,
  cartData: null,
};

/* ── DOM Refs ────────────────────────────────────────────────── */
const dom = {};

/* ── Utils ───────────────────────────────────────────────────── */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function formatMoney(cents) {
  const amount = (cents / 100).toFixed(2);
  return `$${amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

/* ── Navigation ─────────────────────────────────────────────── */
function initNavigation() {
  const header   = $('#site-header');
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  const mobileClose = $('#mobile-menu-close');

  if (!header) return;

  // Sticky header on scroll
  const onScroll = debounce(() => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }, 10);

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => toggleMobileMenu(true));

    if (mobileClose) {
      mobileClose.addEventListener('click', () => toggleMobileMenu(false));
    }

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && State.mobileMenuOpen) toggleMobileMenu(false);
    });

    // Close on overlay click (mobileMenu itself acts as overlay on mobile)
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) toggleMobileMenu(false);
    });
  }
}

function toggleMobileMenu(open) {
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  if (!mobileMenu) return;

  State.mobileMenuOpen = open;
  mobileMenu.classList.toggle('is-open', open);
  hamburger && hamburger.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';

  // Focus trap
  if (open) {
    const firstLink = mobileMenu.querySelector('a, button');
    if (firstLink) setTimeout(() => firstLink.focus(), 50);
  }
}

/* ── Cart Drawer ─────────────────────────────────────────────── */
function initCart() {
  const cartBtn     = $$('[data-cart-toggle]');
  const cartOverlay = $('#cart-overlay');
  const cartClose   = $('#cart-close');
  const cartDrawer  = $('#cart-drawer');

  cartBtn.forEach(btn => btn.addEventListener('click', () => openCart()));
  cartOverlay && cartOverlay.addEventListener('click', () => closeCart());
  cartClose && cartClose.addEventListener('click', () => closeCart());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && State.cartOpen) closeCart();
  });

  // Fetch cart on init
  fetchCart();
}

function openCart() {
  const cartOverlay = $('#cart-overlay');
  const cartDrawer  = $('#cart-drawer');
  State.cartOpen = true;
  cartOverlay && cartOverlay.classList.add('is-open');
  cartDrawer  && cartDrawer.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const cartOverlay = $('#cart-overlay');
  const cartDrawer  = $('#cart-drawer');
  State.cartOpen = false;
  cartOverlay && cartOverlay.classList.remove('is-open');
  cartDrawer  && cartDrawer.classList.remove('is-open');
  document.body.style.overflow = '';
}

async function fetchCart() {
  try {
    const res = await fetch('/cart.js');
    const data = await res.json();
    State.cartData = data;
    updateCartUI(data);
  } catch (err) {
    console.warn('Cart fetch failed:', err);
  }
}

function updateCartUI(cart) {
  const count   = cart.item_count;
  const countEls = $$('.cart-count');

  countEls.forEach(el => {
    el.textContent = count;
    el.classList.toggle('is-visible', count > 0);
  });

  const subtotalEl = $('#cart-subtotal-amount');
  if (subtotalEl) subtotalEl.textContent = formatMoney(cart.total_price);

  renderCartItems(cart);
}

function renderCartItems(cart) {
  const body = $('#cart-items');
  const emptyMsg = $('#cart-empty');
  if (!body) return;

  if (cart.item_count === 0) {
    body.innerHTML = '';
    emptyMsg && (emptyMsg.style.display = 'flex');
    return;
  }

  emptyMsg && (emptyMsg.style.display = 'none');

  body.innerHTML = cart.items.map(item => `
    <div class="cart-item" data-key="${item.key}">
      <div class="cart-item__image">
        ${item.image ? `<img src="${item.image}" alt="${item.product_title}" loading="lazy">` : ''}
      </div>
      <div class="cart-item__info">
        <p class="cart-item__title">${item.product_title}</p>
        ${item.variant_title && item.variant_title !== 'Default Title' ? `<p class="cart-item__variant">${item.variant_title}</p>` : ''}
        <p class="cart-item__price">${formatMoney(item.line_price)}</p>
        <div class="cart-item__qty">
          <button class="cart-qty-btn" data-action="decrease" data-key="${item.key}" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button class="cart-qty-btn" data-action="increase" data-key="${item.key}" aria-label="Increase quantity">+</button>
        </div>
      </div>
    </div>
  `).join('');

  // Attach qty buttons
  $$('.cart-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      const action = btn.dataset.action;
      const item = cart.items.find(i => i.key === key);
      if (!item) return;

      const newQty = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
      updateCartItem(key, newQty);
    });
  });
}

async function updateCartItem(key, quantity) {
  try {
    const res = await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity }),
    });
    const data = await res.json();
    updateCartUI(data);
  } catch (err) {
    console.warn('Cart update failed:', err);
  }
}

async function addToCart(variantId, quantity = 1) {
  try {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity }),
    });
    await res.json();
    await fetchCart();
    openCart();
  } catch (err) {
    console.warn('Add to cart failed:', err);
  }
}

// Expose globally for product pages
window.SwiftGoods = window.SwiftGoods || {};
window.SwiftGoods.addToCart = addToCart;
window.SwiftGoods.openCart = openCart;

/* ── Scroll Animations (CSS fallback — GSAP takes over when loaded) ─ */
function initScrollAnimationsFallback() {
  /* GSAP handles this — only activate if GSAP hasn't loaded after 2.5s */
  setTimeout(() => {
    if (window.SwiftGoods?.gsapReady) return;
    $$('[data-animate]').forEach(el => el.classList.add('is-visible'));
  }, 2500);
}

/* ── Video Autoplay ──────────────────────────────────────────── */
function initVideos() {
  const videos = $$('video[data-autoplay]');

  if (!('IntersectionObserver' in window)) {
    videos.forEach(v => v.play().catch(() => {}));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play().catch(() => {});
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.2 });

  videos.forEach(v => observer.observe(v));
}

/* ── Newsletter Form ─────────────────────────────────────────── */
function initNewsletterForm() {
  const forms = $$('[data-newsletter-form]');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const input   = form.querySelector('input[type="email"]');
      const btn     = form.querySelector('button[type="submit"]');
      const success = form.closest('[data-newsletter]')?.querySelector('[data-newsletter-success]');

      if (!input || !input.value.trim()) return;

      btn && (btn.disabled = true);
      btn && (btn.textContent = 'Subscribing...');

      // Shopify accepts newsletter signups via /contact
      const data = new FormData();
      data.append('form_type', 'customer');
      data.append('utf8', '✓');
      data.append('customer[email]', input.value.trim());
      data.append('customer[tags]', 'newsletter');

      try {
        await fetch('/', { method: 'POST', body: data });
        form.style.display = 'none';
        success && success.classList.add('is-visible');
      } catch {
        btn && (btn.disabled = false);
        btn && (btn.textContent = 'Subscribe');
      }
    });
  });
}

/* ── Social Gallery ──────────────────────────────────────────── */
function initSocialGallery() {
  const items = $$('.social-gallery__item');

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      items.forEach(i => i !== item && i.classList.add('is-dimmed'));
    });

    item.addEventListener('mouseleave', () => {
      items.forEach(i => i.classList.remove('is-dimmed'));
    });
  });
}

/* ── Horizontal Ticker ───────────────────────────────────────── */
function initTicker() {
  const tickers = $$('.ticker__inner');

  tickers.forEach(ticker => {
    const content = ticker.innerHTML;
    ticker.innerHTML = content + content + content;
  });
}

/* ── Cursor (optional luxury touch) ─────────────────────────── */
function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.innerHTML = '<div class="custom-cursor__dot"></div><div class="custom-cursor__ring"></div>';
  document.body.appendChild(cursor);

  const dot  = cursor.querySelector('.custom-cursor__dot');
  const ring = cursor.querySelector('.custom-cursor__ring');

  let mouse = { x: -100, y: -100 };
  let ring_pos = { x: -100, y: -100 };

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
  });

  // Smooth ring follow
  const animateRing = () => {
    ring_pos.x += (mouse.x - ring_pos.x) * 0.12;
    ring_pos.y += (mouse.y - ring_pos.y) * 0.12;
    ring.style.transform = `translate(${ring_pos.x}px, ${ring_pos.y}px)`;
    requestAnimationFrame(animateRing);
  };
  animateRing();

  // Hover states
  $$('a, button, [data-cursor-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
  });
}

/* ── Image Lazy Loading Fallback ─────────────────────────────── */
function initLazyImages() {
  if ('loading' in HTMLImageElement.prototype) return;

  const images = $$('img[loading="lazy"]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => observer.observe(img));
}

/* ── Add To Cart Buttons ─────────────────────────────────────── */
function initProductCards() {
  $$('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const variantId = btn.dataset.addToCart;
      if (!variantId) return;

      const originalText = btn.textContent;
      btn.textContent = 'Adding...';
      btn.disabled = true;

      await addToCart(variantId);

      btn.textContent = 'Added';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2000);
    });
  });
}

/* ── Announcement Bar Dismiss ────────────────────────────────── */
function initAnnounceBar() {
  const bar = $('#announce-bar');
  const close = $('#announce-close');

  if (!bar || !close) return;

  const dismissed = sessionStorage.getItem('announce-dismissed');
  if (dismissed) { bar.remove(); return; }

  close.addEventListener('click', () => {
    bar.style.height = bar.offsetHeight + 'px';
    bar.style.overflow = 'hidden';
    bar.style.transition = 'height 0.3s ease';
    requestAnimationFrame(() => {
      bar.style.height = '0';
      setTimeout(() => bar.remove(), 300);
    });
    sessionStorage.setItem('announce-dismissed', '1');
  });
}

/* ── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCart();
  initScrollAnimationsFallback(); /* GSAP animations.js takes over when loaded */
  initVideos();
  initNewsletterForm();
  initSocialGallery();
  initTicker();
  initLazyImages();
  initProductCards();
  initAnnounceBar();

  // Luxury cursor on desktop
  if (!document.documentElement.classList.contains('no-cursor')) {
    initCustomCursor();
  }
});

/* ── Shopify Section Events (for theme editor) ───────────────── */
document.addEventListener('shopify:section:load', () => {
  /* GSAP animations.js handles scroll-based re-init via shopify:section:load */
  initVideos();
  initSocialGallery();
  initTicker();
  initProductCards();
});
