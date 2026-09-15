/* ==========================================================================
   BOBA BLOOM — script.js
   Contents:
   1. Utilities
   2. Data (menu products + builder options)
   3. Product rendering (best sellers + menu)
   4. Menu filtering
   5. Cart
   6. Builder ("Build Your Boba")
   7. Toasts
   8. Order modal
   9. Reviews carousel
   10. Animated stats
   11. Scroll reveal
   12. Header, mobile menu & active nav link
   13. Location hours
   14. Back to top
   15. Init
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. Utilities
     ------------------------------------------------------------------ */
  const $ = (sel, scope) => (scope || document).querySelector(sel);
  const $$ = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));

  function formatPrice(amount) {
    const rounded = Math.round(amount);
    return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function makeId() {
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }

  function categoryLabel(cat) {
    const labels = {
      'milk-tea': 'Milk Tea',
      'fruit-tea': 'Fruit Tea',
      'matcha': 'Matcha',
      'signature': 'Signature',
      'toppings': 'Topping'
    };
    return labels[cat] || cat;
  }

  /* ------------------------------------------------------------------
     2. Data
     ------------------------------------------------------------------ */
  // Photos: Oscar Nord, TuanAnh Blue, Sebastian Coman Photography, Ann — all on Unsplash
  const PRODUCTS = [
    { id: 'classic-milk-tea', name: 'Classic Milk Tea', category: 'milk-tea', desc: 'Black tea, fresh milk, and classic tapioca pearls — the one that started it all.', price: 2200, tags: ['Classic'], bestSeller: false, c1: '#E9C793', c2: '#BE7F3D', icon: 'bubble' },
    { id: 'brown-sugar-bliss', name: 'Brown Sugar Bliss', category: 'milk-tea', desc: 'Brown sugar milk tea with chewy tapioca pearls, hand-striped for that signature look.', price: 2800, tags: ['Popular', 'Signature'], bestSeller: true, c1: '#BE7F3D', c2: '#8C5A24', icon: 'drizzle', img: 'https://images.unsplash.com/photo-1571215618629-21afa4a91584?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500' },
    { id: 'taro-dream', name: 'Taro Dream', category: 'milk-tea', desc: 'Creamy taro milk tea with a naturally sweet, nutty flavor and a soft violet hue.', price: 2600, tags: ['New'], bestSeller: false, c1: '#D8C8E8', c2: '#8A6BA8', icon: 'swirl' },
    { id: 'oreo-cloud', name: 'Oreo Cloud', category: 'milk-tea', desc: 'Milk tea blended with cookie crumble, finished with a cloud of whipped cream.', price: 2900, tags: ['Indulgent'], bestSeller: false, c1: '#4A3327', c2: '#2A1B12', icon: 'cacao' },

    { id: 'mango-passion', name: 'Mango Passion', category: 'fruit-tea', desc: 'Refreshing mango and passion fruit tea, finished with a spoonful of popping boba.', price: 2500, tags: ['Refreshing'], bestSeller: true, c1: '#F6D18C', c2: '#C97D1E', icon: 'citrus', img: 'https://images.unsplash.com/photo-1786783506825-1bdc1d2acd72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500' },
    { id: 'strawberry-cloud', name: 'Strawberry Cloud', category: 'fruit-tea', desc: 'Strawberry milk tea, creamy foam and popping pearls in every sip.', price: 2700, tags: ['Popular'], bestSeller: true, c1: '#F3AFC2', c2: '#D6335C', icon: 'berry', img: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500' },
    { id: 'lychee-rose', name: 'Lychee Rose', category: 'fruit-tea', desc: 'Lychee tea infused with rose, topped with lychee jelly for a floral finish.', price: 2600, tags: ['Floral'], bestSeller: false, c1: '#F3AFC2', c2: '#8A6BA8', icon: 'flower' },
    { id: 'peach-fizz', name: 'Peach Fizz', category: 'fruit-tea', desc: 'Sparkling peach tea with a light, bubbly finish — our brightest fruit tea yet.', price: 2400, tags: ['Sparkling'], bestSeller: false, c1: '#F0A06B', c2: '#D97840', icon: 'citrus' },

    { id: 'matcha-bloom', name: 'Matcha Bloom', category: 'matcha', desc: 'Premium matcha, fresh milk and brown sugar boba — our house signature.', price: 3000, tags: ['Signature'], bestSeller: true, c1: '#B9CE96', c2: '#43592C', icon: 'flower', img: 'https://images.unsplash.com/photo-1566657040726-62fd1e379726?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500' },
    { id: 'matcha-latte', name: 'Matcha Latte', category: 'matcha', desc: 'Smooth, whisked matcha with steamed milk — simple and endlessly comforting.', price: 2600, tags: ['Classic'], bestSeller: false, c1: '#B9CE96', c2: '#6E8B4F', icon: 'leaf' },
    { id: 'matcha-strawberry-swirl', name: 'Matcha Strawberry Swirl', category: 'matcha', desc: 'Layered matcha and strawberry, hand-swirled for a two-tone finish.', price: 3100, tags: ['Instagrammable'], bestSeller: false, c1: '#6E8B4F', c2: '#D6335C', icon: 'swirl' },
    { id: 'iced-matcha-lemonade', name: 'Iced Matcha Lemonade', category: 'matcha', desc: 'Matcha meets citrus for a bright, energizing sip on a warm Cotonou day.', price: 2500, tags: ['Zesty'], bestSeller: false, c1: '#B9CE96', c2: '#E8A13C', icon: 'drop' },

    { id: 'bloom-sunset', name: 'Bloom Sunset', category: 'signature', desc: 'Layered hibiscus, mango and passion fruit — as good to look at as it is to drink.', price: 3200, tags: ['Signature', 'Instagrammable'], bestSeller: false, c1: '#D6335C', c2: '#E8A13C', icon: 'sparkle' },
    { id: 'golden-pearl', name: 'Golden Pearl', category: 'signature', desc: 'Honey oolong tea with roasted brown sugar pearls and a hint of caramel.', price: 2900, tags: ['Signature'], bestSeller: false, c1: '#F6D18C', c2: '#8C5A24', icon: 'drizzle' },
    { id: 'purple-rain', name: 'Purple Rain', category: 'signature', desc: 'Taro and ube blend with coconut jelly, for a dreamy violet finish.', price: 3100, tags: ['Signature', 'New'], bestSeller: false, c1: '#8A6BA8', c2: '#5E4779', icon: 'swirl' },
    { id: 'dark-cacao-boba', name: 'Dark Cacao Boba', category: 'signature', desc: 'Rich cacao milk tea with dark chocolate pearls — a bold way to end the day.', price: 3000, tags: ['Indulgent'], bestSeller: false, c1: '#4A3327', c2: '#2A1B12', icon: 'cacao' },

    { id: 'tapioca-pearls', name: 'Tapioca Pearls', category: 'toppings', desc: 'Classic chewy tapioca boba, cooked fresh every few hours.', price: 300, tags: ['Add-on'], bestSeller: false, c1: '#4A3327', c2: '#2A1B12', icon: 'bubble' },
    { id: 'popping-boba', name: 'Popping Boba', category: 'toppings', desc: 'Bursting fruit-filled pearls that add a playful pop to any drink.', price: 400, tags: ['Add-on'], bestSeller: false, c1: '#F3AFC2', c2: '#9C2249', icon: 'bubble' },
    { id: 'coconut-jelly', name: 'Coconut Jelly', category: 'toppings', desc: 'Light, refreshing jelly cubes with a delicate coconut flavor.', price: 350, tags: ['Add-on'], bestSeller: false, c1: '#FFFDF9', c2: '#F2DFC0', icon: 'drop', light: true },
    { id: 'cheese-foam', name: 'Cheese Foam', category: 'toppings', desc: 'Creamy salted cheese foam, layered on top for a savory-sweet finish.', price: 500, tags: ['Add-on'], bestSeller: false, c1: '#F2DFC0', c2: '#E9C793', icon: 'drop', light: true }
  ];

  const BASES = [
    { id: 'milk-tea', label: 'Milk Tea', price: 2000, c1: '#E9C793', c2: '#BE7F3D' },
    { id: 'black-tea', label: 'Black Tea', price: 1800, c1: '#BE7F3D', c2: '#4A3327' },
    { id: 'green-tea', label: 'Green Tea', price: 1800, c1: '#D7E4BE', c2: '#A9C07E' },
    { id: 'matcha', label: 'Matcha', price: 2500, c1: '#6E8B4F', c2: '#43592C' }
  ];
  const FLAVORS = [
    { id: 'strawberry', label: 'Strawberry', price: 300, color: '#D6335C' },
    { id: 'mango', label: 'Mango', price: 300, color: '#E8A13C' },
    { id: 'passion-fruit', label: 'Passion Fruit', price: 300, color: '#D97840' },
    { id: 'taro', label: 'Taro', price: 400, color: '#8A6BA8' },
    { id: 'brown-sugar', label: 'Brown Sugar', price: 200, color: '#8C5A24' }
  ];
  const TOPPINGS = [
    { id: 'tapioca', label: 'Tapioca', price: 300, color: '#2A1B12' },
    { id: 'popping-boba', label: 'Popping Boba', price: 400, color: '#D6335C' },
    { id: 'jelly', label: 'Jelly', price: 350, color: '#F2DFC0', stroke: true },
    { id: 'aloe-vera', label: 'Aloe Vera', price: 350, color: '#DCEAD1', stroke: true }
  ];
  const SWEETNESS = [
    { id: '0', label: '0% sugar', opacity: 0 },
    { id: '30', label: '30% sugar', opacity: .3 },
    { id: '50', label: '50% sugar', opacity: .5 },
    { id: '70', label: '70% sugar', opacity: .7 },
    { id: '100', label: '100% sugar', opacity: 1 }
  ];
  const ICE = [
    { id: 'no-ice', label: 'No Ice', count: 0 },
    { id: 'less-ice', label: 'Less Ice', count: 2 },
    { id: 'regular', label: 'Regular Ice', count: 4 },
    { id: 'extra-ice', label: 'Extra Ice', count: 6 }
  ];

  /* ------------------------------------------------------------------
     3. Product rendering
     ------------------------------------------------------------------ */
  function createProductCard(p, featured) {
    const badge = p.bestSeller
      ? '<span class="badge"><svg aria-hidden="true"><use href="#icon-star"/></svg>Best Seller</span>'
      : '';
    const tags = p.tags.map((t) => '<span>' + t + '</span>').join('');
    const media = (featured && p.img)
      ? '<div class="medallion medallion--photo"><img src="' + p.img + '" alt="' + p.name + ', a Boba Bloom bubble tea" loading="lazy" decoding="async"></div>'
      : (
        '<div class="medallion' + (p.light ? ' medallion--light' : '') + '" style="--c1:' + p.c1 + ';--c2:' + p.c2 + '">' +
          '<svg class="medallion-icon" aria-hidden="true"><use href="#icon-' + p.icon + '"/></svg>' +
          '<span class="medallion-pearls" aria-hidden="true"></span>' +
        '</div>'
      );
    return (
      '<article class="product-card">' +
        badge +
        media +
        '<p class="product-cat">' + categoryLabel(p.category) + '</p>' +
        '<h3 class="product-name">' + p.name + '</h3>' +
        '<p class="product-desc">' + p.desc + '</p>' +
        '<div class="product-tags">' + tags + '</div>' +
        '<div class="product-footer">' +
          '<span class="price">' + formatPrice(p.price) + '</span>' +
          '<button type="button" class="add-btn" data-add-product="' + p.id + '">' +
            '<svg aria-hidden="true"><use href="#icon-plus"/></svg>Add' +
          '</button>' +
        '</div>' +
      '</article>'
    );
  }

  function renderBestSellers() {
    const grid = $('#bestSellerGrid');
    if (!grid) return;
    grid.innerHTML = PRODUCTS.filter((p) => p.bestSeller).map((p) => createProductCard(p, true)).join('');
  }

  function renderMenu(category) {
    const grid = $('#menuGrid');
    if (!grid) return;
    const items = category === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);
    grid.innerHTML = items.map((p) => createProductCard(p, false)).join('');
  }

  function handleAddClick(e) {
    const btn = e.target.closest('[data-add-product]');
    if (!btn) return;
    const product = PRODUCTS.find((p) => p.id === btn.dataset.addProduct);
    if (!product) return;
    addProductToCart(product);
    const original = btn.innerHTML;
    btn.classList.add('is-added');
    btn.innerHTML = '<svg aria-hidden="true"><use href="#icon-check"/></svg>Added';
    setTimeout(() => {
      btn.classList.remove('is-added');
      btn.innerHTML = original;
    }, 1300);
  }

  /* ------------------------------------------------------------------
     4. Menu filtering
     ------------------------------------------------------------------ */
  function initMenuFilters() {
    const filterBar = $('#menuFilters');
    if (!filterBar) return;
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      $$('.filter-btn', filterBar).forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      renderMenu(btn.dataset.category);
    });
  }

  /* ------------------------------------------------------------------
     5. Cart
     ------------------------------------------------------------------ */
  const cart = [];
  let lastFocusedElement = null;

  function cartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function cartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function addProductToCart(product) {
    const existing = cart.find((i) => i.refId === product.id && !i.custom);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        lineId: makeId(),
        refId: product.id,
        name: product.name,
        price: product.price,
        qty: 1,
        meta: categoryLabel(product.category),
        c1: product.c1,
        c2: product.c2,
        light: product.light,
        custom: false
      });
    }
    renderCart();
    updateCartBadge();
    showToast('Added ' + product.name + ' to your order');
  }

  function renderCart() {
    const list = $('#cartItems');
    const footer = $('#cartFooter');
    if (!list) return;

    if (cart.length === 0) {
      list.innerHTML =
        '<div class="cart-empty">' +
          '<svg aria-hidden="true"><use href="#icon-bag"/></svg>' +
          '<p>Your order is empty. Add a drink from the menu, or build one that\u2019s entirely yours.</p>' +
          '<div class="cart-empty-actions">' +
            '<a href="#menu" class="btn btn-ghost btn-sm" data-close-cart>Browse Menu</a>' +
            '<a href="#builder" class="btn btn-dark btn-sm" data-close-cart>Build Your Boba</a>' +
          '</div>' +
        '</div>';
      if (footer) footer.hidden = true;
      return;
    }

    list.innerHTML = cart.map((item) => (
      '<div class="cart-item" data-line-id="' + item.lineId + '">' +
        '<div class="cart-item-medallion" style="background:linear-gradient(150deg,' + item.c1 + ',' + item.c2 + ')" aria-hidden="true"></div>' +
        '<div class="cart-item-info">' +
          '<p class="cart-item-name">' + item.name + '</p>' +
          '<p class="cart-item-meta">' + item.meta + '</p>' +
          '<div class="cart-item-row">' +
            '<div class="qty-control">' +
              '<button type="button" class="qty-btn" data-qty="dec" aria-label="Decrease quantity of ' + item.name + '"><svg aria-hidden="true"><use href="#icon-minus"/></svg></button>' +
              '<span class="qty-value">' + item.qty + '</span>' +
              '<button type="button" class="qty-btn" data-qty="inc" aria-label="Increase quantity of ' + item.name + '"><svg aria-hidden="true"><use href="#icon-plus"/></svg></button>' +
            '</div>' +
            '<span class="cart-item-price">' + formatPrice(item.price * item.qty) + '</span>' +
          '</div>' +
          '<button type="button" class="remove-btn" data-remove-line aria-label="Remove ' + item.name + ' from order">Remove</button>' +
        '</div>' +
      '</div>'
    )).join('');

    if (footer) footer.hidden = false;
    const totalEl = $('#cartTotalValue');
    if (totalEl) totalEl.textContent = formatPrice(cartTotal());
  }

  function updateCartBadge() {
    const badge = $('#cartBadge');
    const count = cartCount();
    if (badge) {
      badge.textContent = String(count);
      badge.classList.toggle('is-visible', count > 0);
      badge.classList.remove('is-bumped');
      void badge.offsetWidth;
      badge.classList.add('is-bumped');
    }
    const toggleBtn = $('#cartToggle');
    if (toggleBtn) toggleBtn.setAttribute('aria-label', 'Open your order, ' + count + ' item' + (count === 1 ? '' : 's') + ' in cart');
  }

  function initCartInteractions() {
    const list = $('#cartItems');
    if (!list) return;
    list.addEventListener('click', (e) => {
      const lineEl = e.target.closest('[data-line-id]');
      const qtyBtn = e.target.closest('[data-qty]');
      const removeBtn = e.target.closest('[data-remove-line]');
      if (qtyBtn && lineEl) {
        const item = cart.find((i) => i.lineId === lineEl.dataset.lineId);
        if (!item) return;
        item.qty += qtyBtn.dataset.qty === 'inc' ? 1 : -1;
        if (item.qty <= 0) {
          const idx = cart.indexOf(item);
          cart.splice(idx, 1);
        }
        renderCart();
        updateCartBadge();
      } else if (removeBtn && lineEl) {
        const idx = cart.findIndex((i) => i.lineId === lineEl.dataset.lineId);
        if (idx > -1) cart.splice(idx, 1);
        renderCart();
        updateCartBadge();
      } else if (e.target.closest('[data-close-cart]')) {
        closeCart();
      }
    });

    $('#checkoutBtn').addEventListener('click', () => {
      if (cart.length === 0) return;
      openOrderModal();
      closeCart();
    });
  }

  function openCart() {
    lastFocusedElement = document.activeElement;
    $('#cartOverlay').classList.add('is-open');
    $('#cartDrawer').classList.add('is-open');
    document.body.classList.add('no-scroll');
    const closeBtn = $('#cartCloseBtn');
    if (closeBtn) closeBtn.focus();
  }

  function closeCart() {
    $('#cartOverlay').classList.remove('is-open');
    $('#cartDrawer').classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  /* ------------------------------------------------------------------
     6. Builder
     ------------------------------------------------------------------ */
  const builderState = {
    base: 'milk-tea',
    flavor: null,
    topping: null,
    sweetness: '50',
    ice: 'regular',
    currentStep: 1
  };

  function renderChipGroup(containerId, items, groupName, isAddOn) {
    const container = $(containerId);
    if (!container) return;
    container.innerHTML = items.map((it) => {
      const swatch = it.c1 ? 'linear-gradient(150deg,' + it.c1 + ',' + it.c2 + ')' : it.color;
      const priceLabel = isAddOn ? ('+' + formatPrice(it.price)) : formatPrice(it.price);
      return (
        '<button type="button" class="option-chip" data-group="' + groupName + '" data-value="' + it.id + '" aria-pressed="false">' +
          '<span class="option-swatch" style="background:' + swatch + '" aria-hidden="true"></span>' +
          '<span class="option-chip-text"><span class="option-chip-name">' + it.label + '</span><span class="option-chip-price">' + priceLabel + '</span></span>' +
          '<svg class="check-mark" aria-hidden="true"><use href="#icon-check"/></svg>' +
        '</button>'
      );
    }).join('');
  }

  function renderPillGroup(containerId, items, groupName) {
    const container = $(containerId);
    if (!container) return;
    container.innerHTML = items.map((it) => (
      '<button type="button" class="option-pill" data-group="' + groupName + '" data-value="' + it.id + '" aria-pressed="false">' + it.label + '</button>'
    )).join('');
  }

  function refreshOptionStates() {
    $$('[data-group]').forEach((btn) => {
      const stateValue = builderState[btn.dataset.group];
      btn.setAttribute('aria-pressed', String(btn.dataset.value === stateValue));
    });
  }

  function updateBuilderPreview() {
    const base = BASES.find((b) => b.id === builderState.base) || BASES[0];
    const stopA = $('#cupStopA');
    const stopB = $('#cupStopB');
    if (stopA) stopA.setAttribute('stop-color', base.c1);
    if (stopB) stopB.setAttribute('stop-color', base.c2);

    const swirl = $('#cupSwirl');
    const flavor = FLAVORS.find((f) => f.id === builderState.flavor);
    if (swirl) {
      if (flavor) {
        swirl.setAttribute('fill', flavor.color);
        swirl.setAttribute('opacity', '.55');
      } else {
        swirl.setAttribute('opacity', '0');
      }
    }

    const pearls = $('#cupPearls');
    const topping = TOPPINGS.find((t) => t.id === builderState.topping);
    if (pearls) {
      if (topping) {
        pearls.setAttribute('fill', topping.color);
        pearls.setAttribute('stroke', topping.stroke ? '#2A1B12' : 'none');
        pearls.setAttribute('stroke-width', topping.stroke ? '1' : '0');
      } else {
        pearls.setAttribute('fill', '#2A1B12');
        pearls.setAttribute('stroke', 'none');
      }
    }

    const drizzle = $('#cupDrizzle');
    const sweet = SWEETNESS.find((s) => s.id === builderState.sweetness);
    if (drizzle && sweet) drizzle.setAttribute('opacity', String(sweet.opacity));

    const ice = ICE.find((i) => i.id === builderState.ice) || ICE[2];
    for (let n = 1; n <= 6; n++) {
      const cube = $('#ice' + n);
      if (cube) cube.style.display = n <= ice.count ? 'block' : 'none';
    }
  }

  function computeBuilderTotal() {
    const base = BASES.find((b) => b.id === builderState.base) || BASES[0];
    const flavor = FLAVORS.find((f) => f.id === builderState.flavor);
    const topping = TOPPINGS.find((t) => t.id === builderState.topping);
    return base.price + (flavor ? flavor.price : 0) + (topping ? topping.price : 0);
  }

  function updateBuilderSummary() {
    const base = BASES.find((b) => b.id === builderState.base) || BASES[0];
    const flavor = FLAVORS.find((f) => f.id === builderState.flavor);
    const topping = TOPPINGS.find((t) => t.id === builderState.topping);
    const sweet = SWEETNESS.find((s) => s.id === builderState.sweetness);
    const ice = ICE.find((i) => i.id === builderState.ice);

    $('#sumBase').textContent = base.label;
    $('#sumFlavor').textContent = flavor ? flavor.label : 'No extra flavor';
    $('#sumTopping').textContent = topping ? topping.label : 'No topping';
    $('#sumSweet').textContent = sweet.label.replace(' sugar', '');
    $('#sumIce').textContent = ice.label;
    $('#sumTotal').textContent = formatPrice(computeBuilderTotal());
  }

  function goToBuilderStep(n) {
    builderState.currentStep = n;
    $$('.builder-panel').forEach((panel) => {
      panel.classList.toggle('is-active', Number(panel.dataset.step) === n);
    });
    $$('.step-dot').forEach((dot) => {
      const stepNum = Number(dot.dataset.stepGo);
      dot.classList.toggle('is-active', stepNum === n);
      dot.classList.toggle('is-done', stepNum < n);
    });
    const heading = $('#panel-' + n + ' h3');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }

  function handleBuilderClick(e) {
    const stepBtn = e.target.closest('[data-step-go]');
    const optionBtn = e.target.closest('[data-group]');

    if (optionBtn) {
      const group = optionBtn.dataset.group;
      const value = optionBtn.dataset.value;
      if (group === 'base' || group === 'sweetness' || group === 'ice') {
        builderState[group] = value;
      } else if (group === 'flavor' || group === 'topping') {
        builderState[group] = builderState[group] === value ? null : value;
      }
      refreshOptionStates();
      updateBuilderPreview();
      updateBuilderSummary();
      return;
    }

    if (stepBtn) {
      goToBuilderStep(Number(stepBtn.dataset.stepGo));
    }
  }

  function addBuilderItemToCart() {
    const base = BASES.find((b) => b.id === builderState.base) || BASES[0];
    const flavor = FLAVORS.find((f) => f.id === builderState.flavor);
    const topping = TOPPINGS.find((t) => t.id === builderState.topping);
    const sweet = SWEETNESS.find((s) => s.id === builderState.sweetness);
    const ice = ICE.find((i) => i.id === builderState.ice);

    const metaParts = [
      flavor ? flavor.label : null,
      topping ? topping.label : null,
      sweet.label,
      ice.label
    ].filter(Boolean);

    cart.push({
      lineId: makeId(),
      refId: 'custom-' + makeId(),
      name: base.label + ' \u2014 Custom Boba',
      price: computeBuilderTotal(),
      qty: 1,
      meta: metaParts.join(' \u2022 '),
      c1: base.c1,
      c2: base.c2,
      light: false,
      custom: true
    });

    renderCart();
    updateCartBadge();
    showToast('Your custom boba was added to the order');
  }

  function initBuilder() {
    renderChipGroup('#group-base', BASES, 'base', false);
    renderChipGroup('#group-flavor', FLAVORS, 'flavor', true);
    renderChipGroup('#group-topping', TOPPINGS, 'topping', true);
    renderPillGroup('#group-sweetness', SWEETNESS, 'sweetness');
    renderPillGroup('#group-ice', ICE, 'ice');
    refreshOptionStates();
    updateBuilderPreview();
    updateBuilderSummary();

    const shell = $('.builder-shell');
    if (shell) shell.addEventListener('click', handleBuilderClick);

    const addBtn = $('#addToOrderBtn');
    if (addBtn) addBtn.addEventListener('click', addBuilderItemToCart);
  }

  /* ------------------------------------------------------------------
     7. Toasts
     ------------------------------------------------------------------ */
  function showToast(message) {
    const region = $('#toastRegion');
    if (!region) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<svg aria-hidden="true"><use href="#icon-check"/></svg><span>' + message + '</span>';
    region.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 450);
    }, 3000);
  }

  /* ------------------------------------------------------------------
     8. Order modal
     ------------------------------------------------------------------ */
  function openOrderModal() {
    const summary = $('#orderModalSummary');
    if (summary) {
      const rows = cart.map((item) => (
        '<div class="row"><span>' + item.qty + '\u00d7 ' + item.name + '</span><span>' + formatPrice(item.price * item.qty) + '</span></div>'
      )).join('');
      summary.innerHTML = rows + '<div class="row" style="font-weight:800; padding-top:.4rem; border-top:1px dashed rgba(42,27,18,.25);"><span>Total</span><span>' + formatPrice(cartTotal()) + '</span></div>';
    }
    lastFocusedElement = document.activeElement;
    $('#orderModalOverlay').classList.add('is-open');
    document.body.classList.add('no-scroll');
    const closeBtn = $('#orderModalCloseBtn');
    if (closeBtn) closeBtn.focus();
  }

  function closeOrderModal() {
    $('#orderModalOverlay').classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function completeOrder() {
    // NOTE: this is a frontend-only demo. To connect a real ordering /
    // payment system, send `cart` to your backend or payment provider here
    // before clearing it, e.g.: await fetch('/api/orders', { method: 'POST', body: JSON.stringify(cart) })
    cart.length = 0;
    renderCart();
    updateCartBadge();
    closeOrderModal();
  }

  function initOrderModal() {
    const overlay = $('#orderModalOverlay');
    if (!overlay) return;
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeOrderModal();
    });
    $('#orderModalCloseBtn').addEventListener('click', completeOrder);
  }

  /* ------------------------------------------------------------------
     9. Reviews carousel
     ------------------------------------------------------------------ */
  function initReviewsCarousel() {
    const track = $('#reviewsTrack');
    if (!track) return;
    const cards = $$('.review-card', track);
    const dots = $$('#reviewDots button');
    const live = $('#reviewLiveRegion');
    let index = 0;
    let timer = null;

    function render() {
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      cards.forEach((card, i) => card.setAttribute('aria-hidden', String(i !== index)));
      dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === index)));
      if (live) live.textContent = 'Review ' + (index + 1) + ' of ' + cards.length;
    }

    function go(i) {
      index = (i + cards.length) % cards.length;
      render();
    }

    function start() {
      if (prefersReducedMotion()) return;
      timer = setInterval(() => go(index + 1), 6500);
    }
    function stop() {
      clearInterval(timer);
    }
    function restart() {
      stop();
      start();
    }

    $('#reviewPrev').addEventListener('click', () => { go(index - 1); restart(); });
    $('#reviewNext').addEventListener('click', () => { go(index + 1); restart(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { go(i); restart(); }));

    const carousel = $('.reviews-carousel');
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);

    render();
    start();
  }

  /* ------------------------------------------------------------------
     10. Animated stats
     ------------------------------------------------------------------ */
  function animateStat(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';

    if (prefersReducedMotion()) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }

    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initStatsObserver() {
    const stats = $$('.stat-number');
    if (!stats.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    stats.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------
     11. Scroll reveal
     ------------------------------------------------------------------ */
  function initScrollReveal() {
    const targets = $$('[data-reveal], [data-reveal-group]');
    if (!targets.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------
     12. Header, mobile menu & active nav link
     ------------------------------------------------------------------ */
  function initHeaderScroll() {
    const header = $('#siteHeader');
    const backToTop = $('#backToTopBtn');
    let ticking = false;

    function update() {
      ticking = false;
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 40);
      if (backToTop) backToTop.classList.toggle('is-visible', y > 600);
    }
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  function initMobileMenu() {
    const btn = $('#hamburgerBtn');
    const menu = $('#mobileMenu');
    if (!btn || !menu) return;

    function open() {
      menu.classList.add('is-open');
      btn.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
      const firstLink = $('a', menu);
      if (firstLink) firstLink.focus();
    }
    function close() {
      menu.classList.remove('is-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    }

    btn.addEventListener('click', () => (menu.classList.contains('is-open') ? close() : open()));
    $$('a', menu).forEach((a) => a.addEventListener('click', close));

    $('#mobileOrderNowBtn').addEventListener('click', () => {
      close();
      openCart();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (menu.classList.contains('is-open')) close();
      if ($('#cartDrawer').classList.contains('is-open')) closeCart();
      if ($('#orderModalOverlay').classList.contains('is-open')) closeOrderModal();
    });
  }

  function initActiveNavLink() {
    const sections = $$('main section[id]');
    const links = $$('.nav-link, .mobile-nav-link');
    if (!sections.length || !links.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((link) => {
          const match = link.getAttribute('href') === '#' + id;
          link.classList.toggle('is-active', match);
          if (link.classList.contains('nav-link')) link.setAttribute('aria-current', match ? 'true' : 'false');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach((s) => observer.observe(s));
  }

  function initOrderButtons() {
    $('#cartToggle').addEventListener('click', openCart);
    $('#orderNowBtn').addEventListener('click', openCart);
    $('#cartCloseBtn').addEventListener('click', closeCart);
    $('#cartOverlay').addEventListener('click', closeCart);
  }

  function initScrollCue() {
    const cue = $('#scrollCue');
    if (!cue) return;
    cue.addEventListener('click', () => {
      const target = $('#best-sellers');
      if (target) target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     13. Location hours
     ------------------------------------------------------------------ */
  function formatHour(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return h12 + (m ? ':' + String(m).padStart(2, '0') : '') + ' ' + ampm;
  }

  function updateLocationStatus() {
    const pill = $('#statusPill');
    const text = $('#statusText');
    if (!pill || !text) return;

    const now = new Date();
    const day = now.getDay();
    const minutesNow = now.getHours() * 60 + now.getMinutes();
    const todayHours = day === 0 ? { open: 14 * 60, close: 20 * 60 } : { open: 10 * 60, close: 21 * 60 };
    const isOpen = minutesNow >= todayHours.open && minutesNow < todayHours.close;

    pill.classList.toggle('is-open', isOpen);
    pill.classList.toggle('is-closed', !isOpen);

    if (isOpen) {
      text.textContent = 'Open now \u00b7 Closes at ' + formatHour(todayHours.close);
    } else if (minutesNow < todayHours.open) {
      text.textContent = 'Closed \u00b7 Opens today at ' + formatHour(todayHours.open);
    } else {
      const nextDay = (day + 1) % 7;
      const nextOpen = nextDay === 0 ? 14 * 60 : 10 * 60;
      text.textContent = 'Closed \u00b7 Opens ' + (nextDay === 0 ? 'Sunday' : 'tomorrow') + ' at ' + formatHour(nextOpen);
    }
  }

  /* ------------------------------------------------------------------
     14. Back to top
     ------------------------------------------------------------------ */
  function initBackToTop() {
    const btn = $('#backToTopBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     15. Init
     ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    renderBestSellers();
    renderMenu('all');
    initMenuFilters();
    $('#bestSellerGrid').addEventListener('click', handleAddClick);
    $('#menuGrid').addEventListener('click', handleAddClick);

    initBuilder();

    renderCart();
    updateCartBadge();
    initCartInteractions();
    initOrderButtons();
    initOrderModal();

    initReviewsCarousel();
    initStatsObserver();
    initScrollReveal();

    initHeaderScroll();
    initMobileMenu();
    initActiveNavLink();
    initScrollCue();
    initBackToTop();

    updateLocationStatus();
    setInterval(updateLocationStatus, 60000);
  });
})();
