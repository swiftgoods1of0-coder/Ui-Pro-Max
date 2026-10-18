/* ============================================================
   SWIFT GOODS — PRODUCT FORM
   Variant selection · Price update · AJAX cart · Gallery
   ============================================================ */

'use strict';

class SwiftProductForm {
  constructor(container) {
    this.container = container;
    this.sectionId  = container.dataset.sectionId;

    /* Parse product JSON embedded in the section */
    const variantData = container.querySelector('[data-product-variants]');
    const optionData  = container.querySelector('[data-product-options]');
    this.variants = variantData ? JSON.parse(variantData.textContent) : [];
    this.options  = optionData  ? JSON.parse(optionData.textContent)  : [];

    this.form           = container.querySelector('[data-product-form]');
    this.currentVariant = this._resolveInitialVariant();

    this._init();
  }

  /* ── Init ───────────────────────────────────────────────────── */
  _init() {
    this._bindOptions();
    this._bindQty();
    this._bindGallery();
    this._bindFormSubmit();

    /* Reflect initial variant in URL without pushing history */
    if (this.currentVariant) {
      this._updateURL(this.currentVariant, false);
      this._updateAvailability(this.currentVariant);
    }

    /* Handle browser back/forward */
    window.addEventListener('popstate', () => {
      const id = parseInt(new URLSearchParams(window.location.search).get('variant'));
      const v  = this.variants.find(v => v.id === id);
      if (v) this._applyVariant(v, false);
    });
  }

  /* ── Variant Resolution ─────────────────────────────────────── */
  _resolveInitialVariant() {
    const urlVariantId = parseInt(new URLSearchParams(window.location.search).get('variant'));
    if (urlVariantId) {
      const v = this.variants.find(v => v.id === urlVariantId);
      if (v) return v;
    }
    /* First available, then absolute first */
    return this.variants.find(v => v.available) || this.variants[0] || null;
  }

  _findVariantByOptions(selectedOptions) {
    return this.variants.find(v =>
      selectedOptions.every((val, i) => v['option' + (i + 1)] === val)
    ) || null;
  }

  _getSelectedOptions() {
    const vals = [];
    this.container.querySelectorAll('[data-option-select]').forEach(sel => {
      vals.push(sel.value);
    });
    return vals;
  }

  /* ── Apply a Variant ────────────────────────────────────────── */
  _applyVariant(variant, pushHistory = true) {
    if (!variant) return;
    this.currentVariant = variant;

    /* Update hidden variant input so native form submit works too */
    const input = this.form?.querySelector('[name="id"]');
    if (input) input.value = variant.id;

    this._updatePrice(variant);
    this._updateAvailability(variant);
    this._updateGalleryForVariant(variant);
    this._updateURL(variant, pushHistory);
    this._updateOptionStates();
  }

  /* ── Option Binding ─────────────────────────────────────────── */
  _bindOptions() {
    /* Hidden selects (drive the logic) */
    this.container.querySelectorAll('[data-option-select]').forEach(sel => {
      sel.addEventListener('change', () => this._onOptionChange());
    });

    /* Visual size pills */
    this.container.querySelectorAll('[data-size-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled || btn.classList.contains('is-unavailable')) return;

        const group = btn.closest('[data-size-group]');
        group.querySelectorAll('[data-size-btn]').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');

        const optIndex = group.dataset.optionIndex;
        const sel = this.container.querySelector(`[data-option-select][data-option-index="${optIndex}"]`);
        if (sel) { sel.value = btn.dataset.sizeBtn; this._onOptionChange(); }
      });
    });

    /* Visual color swatches */
    this.container.querySelectorAll('[data-swatch-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.closest('[data-swatch-group]');
        group.querySelectorAll('[data-swatch-btn]').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');

        const optIndex = group.dataset.optionIndex;
        const sel = this.container.querySelector(`[data-option-select][data-option-index="${optIndex}"]`);
        if (sel) { sel.value = btn.dataset.swatchValue; this._onOptionChange(); }
      });
    });
  }

  _onOptionChange() {
    const selected = this._getSelectedOptions();
    const variant  = this._findVariantByOptions(selected);
    if (variant) {
      this._applyVariant(variant);
    } else {
      /* No exact match — still update unavailability indicators */
      this._updateOptionStates();
    }
  }

  /* Mark option pills/swatches unavailable based on current selections */
  _updateOptionStates() {
    const selected = this._getSelectedOptions();

    /* For each option position, test each value against remaining options */
    this.container.querySelectorAll('[data-size-btn], [data-swatch-btn]').forEach(btn => {
      const group     = btn.closest('[data-size-group], [data-swatch-group]');
      const optIndex  = parseInt(group?.dataset.optionIndex ?? 0);
      const testValue = btn.dataset.sizeBtn || btn.dataset.swatchValue;

      const testOptions = [...selected];
      testOptions[optIndex] = testValue;

      const hasAvailable = this.variants.some(v =>
        testOptions.every((val, i) => !val || v['option' + (i + 1)] === val) && v.available
      );

      btn.classList.toggle('is-unavailable', !hasAvailable);
      /* Don't set disabled — let UX show strikethrough and handle gracefully */
    });
  }

  /* ── Price Update ───────────────────────────────────────────── */
  _updatePrice(variant) {
    const priceEl   = this.container.querySelector('[data-product-price]');
    const compareEl = this.container.querySelector('[data-product-compare-price]');
    const badgeEl   = this.container.querySelector('[data-sale-badge]');

    if (!priceEl) return;

    const isSale = variant.compare_at_price && variant.compare_at_price > variant.price;

    priceEl.textContent = this._money(variant.price);
    priceEl.classList.toggle('price--sale', isSale);

    if (compareEl) {
      if (isSale) {
        compareEl.textContent = this._money(variant.compare_at_price);
        compareEl.hidden = false;
      } else {
        compareEl.textContent = '';
        compareEl.hidden = true;
      }
    }

    if (badgeEl) {
      if (isSale) {
        const pct = Math.round((variant.compare_at_price - variant.price) / variant.compare_at_price * 100);
        badgeEl.textContent = `−${pct}%`;
        badgeEl.hidden = false;
      } else {
        badgeEl.hidden = true;
      }
    }
  }

  /* ── Availability Update ────────────────────────────────────── */
  _updateAvailability(variant) {
    const addBtn      = this.form?.querySelector('[data-add-btn]');
    const soldOutMsg  = this.container.querySelector('[data-sold-out-msg]');

    if (!addBtn) return;

    if (variant.available) {
      addBtn.disabled    = false;
      addBtn.textContent = addBtn.dataset.addLabel || 'Add to Bag';
      if (soldOutMsg) soldOutMsg.hidden = true;
    } else {
      addBtn.disabled    = true;
      addBtn.textContent = 'Sold Out';
      if (soldOutMsg) soldOutMsg.hidden = false;
    }
  }

  /* ── Gallery ────────────────────────────────────────────────── */
  _bindGallery() {
    this.container.querySelectorAll('[data-gallery-thumb]').forEach((thumb, i) => {
      thumb.addEventListener('click', () => this._activateSlide(i));
    });

    /* Keyboard navigation */
    this.container.querySelector('[data-gallery-main]')?.addEventListener('keydown', e => {
      const slides = this.container.querySelectorAll('[data-gallery-slide]');
      const active = [...slides].findIndex(s => s.classList.contains('is-active'));
      if (e.key === 'ArrowRight') this._activateSlide(Math.min(active + 1, slides.length - 1));
      if (e.key === 'ArrowLeft')  this._activateSlide(Math.max(active - 1, 0));
    });
  }

  _activateSlide(index) {
    const slides = this.container.querySelectorAll('[data-gallery-slide]');
    const thumbs = this.container.querySelectorAll('[data-gallery-thumb]');

    if (!slides[index]) return;

    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    thumbs.forEach((t, i) => t.classList.toggle('is-active', i === index));

    /* GSAP cross-fade if loaded */
    if (window.gsap) {
      gsap.fromTo(slides[index], { opacity: 0, scale: 1.02 }, {
        opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out'
      });
    } else {
      slides[index].style.opacity = '1';
    }
  }

  _updateGalleryForVariant(variant) {
    if (!variant.featured_image) return;
    const pos = parseInt(variant.featured_image.position) - 1;
    if (pos >= 0) this._activateSlide(pos);
  }

  /* ── URL Management ─────────────────────────────────────────── */
  _updateURL(variant, push = true) {
    if (!variant) return;
    const url = new URL(window.location.href);
    url.searchParams.set('variant', variant.id);
    const method = push ? 'pushState' : 'replaceState';
    window.history[method]({ variant: variant.id }, '', url.toString());
  }

  /* ── Quantity ───────────────────────────────────────────────── */
  _bindQty() {
    const input = this.container.querySelector('[name="quantity"]');
    if (!input) return;

    this.container.querySelectorAll('[data-qty-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = btn.dataset.qtyBtn === 'increase' ? 1 : -1;
        input.value = Math.max(1, Math.min(99, (parseInt(input.value) || 1) + delta));
      });
    });
  }

  /* ── Form Submit ────────────────────────────────────────────── */
  _bindFormSubmit() {
    this.form?.addEventListener('submit', async e => {
      e.preventDefault();
      await this._addToCart();
    });
  }

  async _addToCart() {
    const variant = this.currentVariant;
    const addBtn  = this.form?.querySelector('[data-add-btn]');
    const qty     = parseInt(this.form?.querySelector('[name="quantity"]')?.value || '1');

    if (!variant?.available || !addBtn) return;

    const originalLabel = addBtn.dataset.addLabel || 'Add to Bag';
    addBtn.disabled    = true;
    addBtn.textContent = '—';

    try {
      const addRes = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: variant.id, quantity: qty })
      });

      if (!addRes.ok) {
        const err = await addRes.json().catch(() => ({}));
        throw new Error(err.description || 'Add to cart failed');
      }

      /* Refresh cart state */
      const cartRes  = await fetch('/cart.js', { headers: { 'Accept': 'application/json' } });
      const cartData = await cartRes.json();

      window.SwiftGoods?.updateCartUI?.(cartData);
      window.SwiftGoods?.openCart?.();

      addBtn.textContent = 'Added ✓';
      addBtn.classList.add('is-success');
    } catch (err) {
      console.error('[Swift Goods] Cart error:', err);
      addBtn.textContent = 'Error — Try Again';
      addBtn.classList.add('is-error');
    } finally {
      setTimeout(() => {
        addBtn.disabled    = false;
        addBtn.textContent = originalLabel;
        addBtn.classList.remove('is-success', 'is-error');
      }, 2200);
    }
  }

  /* ── Helpers ────────────────────────────────────────────────── */
  _money(cents) {
    return '$' + (cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

/* ── Auto-init ──────────────────────────────────────────────── */
function initProductForms() {
  document.querySelectorAll('[data-product-container]:not([data-pf-init])').forEach(el => {
    el.dataset.pfInit = 'true';
    new SwiftProductForm(el);
  });
}

document.addEventListener('DOMContentLoaded', initProductForms);
document.addEventListener('shopify:section:load', initProductForms);
