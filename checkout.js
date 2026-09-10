(function () {
  const STORAGE_KEY = 'bb_cart';
  const SHIPPING_FLAT = 6.0;

  function getCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function clearCart() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      /* ignore */
    }
    document.querySelectorAll('#cartCount, .cart-count').forEach((el) => {
      el.textContent = '0';
    });
  }

  function formatPrice(value) {
    return `$${value.toFixed(2)}`;
  }

  function renderSummary() {
    const cart = getCart();
    const itemsEl = document.getElementById('summaryItems');
    const subtotalEl = document.getElementById('summarySubtotal');
    const shippingEl = document.getElementById('summaryShipping');
    const totalEl = document.getElementById('summaryTotal');
    const placeOrderBtn = document.getElementById('placeOrderBtn');

    const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
    const shipping = cart.length ? SHIPPING_FLAT : 0;
    const total = subtotal + shipping;

    if (itemsEl) {
      itemsEl.innerHTML = cart.length
        ? cart.map((item) => `
            <div class="summary-line">
              <div>
                <div class="summary-line-name">${item.name}</div>
                <div class="summary-line-qty">Qty ${item.qty}</div>
              </div>
              <span>${formatPrice(item.qty * item.price)}</span>
            </div>
          `).join('')
        : '<div class="summary-empty">Your cart is empty — add something before checking out.</div>';
    }

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = cart.length ? formatPrice(shipping) : '—';
    if (totalEl) totalEl.textContent = formatPrice(total);

    if (placeOrderBtn) {
      placeOrderBtn.disabled = cart.length === 0;
      placeOrderBtn.textContent = cart.length === 0 ? 'Your cart is empty' : 'Place Order';
    }
  }

  function generateOrderNumber() {
    const digits = Math.floor(10000 + Math.random() * 89999);
    return `#BB-${digits}`;
  }

  function showOrderModal() {
    const overlay = document.getElementById('orderOverlay');
    const modal = document.getElementById('orderModal');
    const orderNumberEl = document.getElementById('orderNumber');
    if (orderNumberEl) orderNumberEl.textContent = generateOrderNumber();
    if (overlay) overlay.classList.add('open');
    if (modal) modal.classList.add('open');
  }

  function initForm() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const cart = getCart();
      if (cart.length === 0) return;

      if (!form.reportValidity()) return;

      clearCart();
      renderSummary();
      form.reset();
      showOrderModal();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderSummary();
    initForm();
  });
})();
