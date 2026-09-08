let lastScrollY = window.scrollY;
const header = document.getElementById('mainHeader');

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  // Don't hide navbar when scrolling at the very top of the page
  if (currentScrollY <= 50) {
    header.classList.remove('nav-hidden');
    lastScrollY = currentScrollY;
    return;
  }

  if (currentScrollY > lastScrollY) {
    // Scrolling down -> hide navbar
    header.classList.add('nav-hidden');
  } else {
    // Scrolling up -> show navbar
    header.classList.remove('nav-hidden');
  }

  lastScrollY = currentScrollY;
});

/* ---------- HERO SLIDESHOW ---------- */
function initHeroSlideshow() {
  const track = document.getElementById('heroTrack');
  if (!track) return;

  const slides = Array.from(track.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('#heroDots .dot'));
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  const navItems = Array.from(document.querySelectorAll('.nav-item[data-slide]'));

  const AUTOPLAY_DELAY = 6000;
  let current = Math.max(0, slides.findIndex((s) => s.classList.contains('is-active')));
  let autoplayId = null;

  function showSlide(index) {
    const total = slides.length;
    current = (index + total) % total;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
  }

  function next() {
    showSlide(current + 1);
  }

  function prev() {
    showSlide(current - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(next, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayId) clearInterval(autoplayId);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { showSlide(i); startAutoplay(); });
  });

  navItems.forEach((item) => {
    const idx = parseInt(item.getAttribute('data-slide'), 10);
    if (Number.isNaN(idx)) return;
    item.addEventListener('mouseenter', () => showSlide(idx));
  });

  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  showSlide(current);
  startAutoplay();
}

document.addEventListener('DOMContentLoaded', initHeroSlideshow);

/* ---------- PRODUCT CATALOG ---------- */
const PRODUCTS = [
  // Skincare
  { id: 'sc-01', category: 'skincare', name: 'Rosehip Glow Serum', meta: 'Serum · 30ml', price: 42, img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop', bestSeller: true },
  { id: 'sc-02', category: 'skincare', name: 'Cloud Cream Cleanser', meta: 'Cleanser · 150ml', price: 24, img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop', bestSeller: true },
  { id: 'sc-03', category: 'skincare', name: 'Vitamin C Bright Drops', meta: 'Serum · 30ml', price: 46, img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop' },
  { id: 'sc-04', category: 'skincare', name: 'Daily Mineral Sunscreen', meta: 'SPF 30 · 50ml', price: 28, img: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=600&auto=format&fit=crop', bestSeller: true },
  { id: 'sc-05', category: 'skincare', name: 'Overnight Recovery Moisturizer', meta: 'Moisturizer · 50ml', price: 38, img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=600&auto=format&fit=crop' },
  { id: 'sc-06', category: 'skincare', name: 'Clay Reset Mask', meta: 'Face Mask · 75ml', price: 32, img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=600&auto=format&fit=crop' },
  { id: 'sc-07', category: 'skincare', name: 'Bright Eyes Gel', meta: 'Eye Care · 15ml', price: 26, img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop' },

  // Makeup
  { id: 'mk-01', category: 'makeup', name: 'Skin-First Foundation', meta: 'Foundation · 30ml', price: 34, img: 'https://images.unsplash.com/photo-1631214540242-3cd8c4b0b3b4?q=80&w=600&auto=format&fit=crop', bestSeller: true },
  { id: 'mk-02', category: 'makeup', name: 'Sheer Blur Lip Colour', meta: 'Lip Colour', price: 20, img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop', bestSeller: true },
  { id: 'mk-03', category: 'makeup', name: 'Lengthen Mascara', meta: 'Mascara', price: 22, img: 'https://images.unsplash.com/photo-1631214524020-3c2f95f3f56f?q=80&w=600&auto=format&fit=crop' },
  { id: 'mk-04', category: 'makeup', name: 'Warm Glow Blush Duo', meta: 'Blush & Bronzer', price: 26, img: 'https://images.unsplash.com/photo-1631730359585-38a4935cbec4?q=80&w=600&auto=format&fit=crop' },
  { id: 'mk-05', category: 'makeup', name: 'Brow Definer Pencil', meta: 'Mascara & Brows', price: 18, img: 'https://images.unsplash.com/photo-1631214540220-3c2f95f3f45f?q=80&w=600&auto=format&fit=crop' },
  { id: 'mk-06', category: 'makeup', name: 'Second Skin Concealer', meta: 'Foundation · 10ml', price: 24, img: 'https://images.unsplash.com/photo-1631730359585-38a4935cbec4?q=80&w=600&auto=format&fit=crop', bestSeller: true },

  // Haircare
  { id: 'hc-01', category: 'haircare', name: 'Sulfate-Free Renew Shampoo', meta: 'Shampoo · 250ml', price: 24, img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop', bestSeller: true },
  { id: 'hc-02', category: 'haircare', name: 'Weightless Conditioner', meta: 'Conditioner · 250ml', price: 24, img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop' },
  { id: 'hc-03', category: 'haircare', name: 'Rootbound Scalp Oil', meta: 'Hair Oils · 60ml', price: 30, img: 'https://images.unsplash.com/photo-1626015449221-437bdc26c56d?q=80&w=600&auto=format&fit=crop', bestSeller: true },
  { id: 'hc-04', category: 'haircare', name: 'Air-Dry Styling Cream', meta: 'Styling · 100ml', price: 22, img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=600&auto=format&fit=crop' },
  { id: 'hc-05', category: 'haircare', name: 'Overnight Repair Mask', meta: 'Hair Oils · 150ml', price: 34, img: 'https://images.unsplash.com/photo-1626015449221-437bdc26c56d?q=80&w=600&auto=format&fit=crop' },
];

const CATEGORY_LABELS = {
  best: 'Best sellers',
  skincare: 'Skincare',
  makeup: 'Makeup',
  haircare: 'Haircare',
};

let currentCategory = 'best';

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function getProductsForCategory(category) {
  if (category === 'best') {
    return PRODUCTS.filter((p) => p.bestSeller);
  }
  return PRODUCTS.filter((p) => p.category === category);
}

function renderProductGrid(category) {
  const grid = document.getElementById('productGrid');
  const heading = document.querySelector('.section-head h2');
  const countLabel = document.getElementById('productCount');
  if (!grid) return;

  currentCategory = category;
  const items = getProductsForCategory(category);

  grid.innerHTML = items.map((p) => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-image">
        <img src="${p.img}" alt="${p.name}">
      </div>
      <div class="product-name">${p.name}</div>
      <div class="product-meta">${p.meta}</div>
      <div class="product-footer">
        <span class="product-price">${formatPrice(p.price)}</span>
        <button class="add-btn" data-id="${p.id}">Add</button>
      </div>
    </div>
  `).join('');

  if (heading) heading.textContent = CATEGORY_LABELS[category] || 'Shop';
  if (countLabel) countLabel.textContent = `${items.length} of ${items.length} products`;

  // Sync active state on the top nav and category strip
  document.querySelectorAll('.nav-item[data-category]').forEach((item) => {
    item.classList.toggle('active', item.getAttribute('data-category') === category);
  });
  document.querySelectorAll('.category-strip a[data-category]').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('data-category') === category);
  });

  grid.querySelectorAll('.add-btn').forEach((btn) => {
    btn.addEventListener('click', () => addToCart(btn.getAttribute('data-id'), btn));
  });
}

function renderCategoryStrip() {
  const strip = document.getElementById('categoryStrip');
  if (!strip) return;

  const links = [
    { key: 'best', label: 'Best Sellers' },
    { key: 'skincare', label: 'Skincare' },
    { key: 'makeup', label: 'Makeup' },
    { key: 'haircare', label: 'Haircare' },
  ];

  strip.innerHTML = links.map((l) => `<a href="#shop" data-category="${l.key}">${l.label}</a>`).join('');

  strip.querySelectorAll('a[data-category]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      renderProductGrid(link.getAttribute('data-category'));
      document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function initCategoryNav() {
  document.querySelectorAll('.nav-item[data-category]').forEach((item) => {
    const link = item.querySelector('a');
    if (!link) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      renderProductGrid(item.getAttribute('data-category'));
      document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
    });
  });

  const homeLink = document.querySelector('.nav-item[data-slide="0"] a');
  if (homeLink) {
    homeLink.addEventListener('click', () => renderProductGrid('best'));
  }
}

/* ---------- CART ---------- */
let cart = [];

function addToCart(productId, btn) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const line = cart.find((item) => item.id === productId);
  if (line) {
    line.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, qty: 1 });
  }

  renderCart();

  if (btn) {
    btn.classList.add('added');
    btn.textContent = 'Added';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.textContent = 'Add';
    }, 1200);
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartSubtotal = document.getElementById('cartSubtotal');
  if (!cartItems) return;

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  if (cartCount) cartCount.textContent = totalQty;
  if (cartSubtotal) cartSubtotal.textContent = formatPrice(subtotal);

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-line">
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-line-info">
        <div class="cart-line-name">${item.name}</div>
        <div class="cart-line-price">${item.qty} × ${formatPrice(item.price)}</div>
        <div class="cart-remove" data-id="${item.id}">Remove</div>
      </div>
    </div>
  `).join('');

  cartItems.querySelectorAll('.cart-remove').forEach((btn) => {
    btn.addEventListener('click', () => removeFromCart(btn.getAttribute('data-id')));
  });
}

function initCartDrawer() {
  const cartBtn = document.getElementById('cartBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartClose = document.getElementById('cartClose');
  const overlay = document.getElementById('overlay');
  if (!cartBtn || !cartDrawer || !overlay) return;

  function openCart() {
    cartDrawer.classList.add('open');
    overlay.classList.add('open');
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    overlay.classList.remove('open');
  }

  cartBtn.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
}

document.addEventListener('DOMContentLoaded', () => {
  renderCategoryStrip();
  renderProductGrid('best');
  initCategoryNav();
  initCartDrawer();
  renderCart();
});