/* ---------- BELLE & BEYOND — SHARED CART ----------
   Works with any product card on the site: it reads the product
   name/price straight out of the card's markup, so it doesn't need
   every page to agree on the same HTML structure or a shared product
   list. Cart contents persist across pages via localStorage.
-------------------------------------------------------------------- */
(function () {
  const STORAGE_KEY = 'bb_cart';

  function getCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      /* storage unavailable (e.g. private browsing) — fail silently */
    }
  }

  function parsePrice(text) {
    if (!text) return 0;
    const match = text.replace(/,/g, '').match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('#cartCount, .cart-count').forEach((el) => {
      el.textContent = count;
    });
  }

  function addToCart(name, price, button) {
    const cart = getCart();
    const existing = cart.find((item) => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    saveCart(cart);
    updateCartCount();
    const openDrawer = document.getElementById('cartDrawer');
    if (openDrawer && openDrawer.classList.contains('open')) {
      renderDrawer();
    }

    if (button) {
      const original = button.textContent;
      button.textContent = 'Added ✓';
      button.disabled = true;
      setTimeout(() => {
        button.textContent = original;
        button.disabled = false;
      }, 1100);
    }
  }

  function handleAddClick(event) {
    event.preventDefault();
    const button = event.currentTarget;

    // Support both a data-id/data-name/data-price product card style
    // and cards where we just read the name/price out of the DOM.
    const card = button.closest('[data-id], .product-card, .cart-line');
    const nameEl = card ? card.querySelector('h3, .product-name, [data-product-name]') : null;
    const priceEl = card ? card.querySelector('.price, .product-price, [data-product-price]') : null;

    const name = button.dataset.name || (nameEl ? nameEl.textContent.trim() : 'Product');
    const price = button.dataset.price
      ? parseFloat(button.dataset.price)
      : parsePrice(priceEl ? priceEl.textContent : '');

    addToCart(name, price, button);
  }

  function formatPrice(value) {
    return `$${value.toFixed(2)}`;
  }

  function removeFromCart(name) {
    const cart = getCart().filter((item) => item.name !== name);
    saveCart(cart);
    updateCartCount();
    renderDrawer();
  }

  function renderDrawer() {
    const itemsEl = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('cartSubtotal');
    if (!itemsEl) return;

    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);

    if (cart.length === 0) {
      itemsEl.innerHTML = '<div class="cart-drawer-empty">Your cart is empty.</div>';
      return;
    }

    itemsEl.innerHTML = cart.map((item) => `
      <div class="cart-drawer-line">
        <div class="cart-drawer-line-info">
          <div class="cart-drawer-line-name">${item.name}</div>
          <div class="cart-drawer-line-meta">${item.qty} × ${formatPrice(item.price)}</div>
          <button class="cart-drawer-remove" data-remove="${item.name}">Remove</button>
        </div>
      </div>
    `).join('');

    itemsEl.querySelectorAll('[data-remove]').forEach((btn) => {
      btn.addEventListener('click', () => removeFromCart(btn.getAttribute('data-remove')));
    });
  }

  function initDrawer() {
    const cartBtn = document.getElementById('cartBtn');
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('cartClose');
    if (!cartBtn || !drawer || !overlay) return;

    function open() {
      renderDrawer();
      drawer.classList.add('open');
      overlay.classList.add('open');
    }

    function close() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
    }

    cartBtn.addEventListener('click', open);
    overlay.addEventListener('click', close);
    if (closeBtn) closeBtn.addEventListener('click', close);

    const checkoutBtn = drawer.querySelector('.cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        window.location.href = 'checkout.html';
      });
    }
  }

  function init() {
    updateCartCount();
    document.querySelectorAll('.add-button, .add-btn, [data-add-to-cart]').forEach((btn) => {
      btn.addEventListener('click', handleAddClick);
    });
    initDrawer();
  }

  document.addEventListener('DOMContentLoaded', init);
})();