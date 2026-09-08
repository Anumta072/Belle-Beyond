/* ---------- HERO SLIDESHOW ---------- */
const slides = Array.from(document.querySelectorAll('.hero-slide'));
const dots = Array.from(document.querySelectorAll('.dot'));
const navItems = Array.from(document.querySelectorAll('.nav-item[data-slide]'));
let activeSlide = 0;

const categoryMap = {
  0: [{label:"Skincare", cls:""}, {label:"Makeup", cls:""}, {label:"Haircare", cls:""}, {label:"Gifting", cls:""}],
  1: [{label:"All Skincare", cls:"active"}, {label:"Cleansers"}, {label:"Serums"}, {label:"Moisturizers"}, {label:"Sunscreen"}, {label:"Face Masks"}, {label:"Eye Care"}],
  2: [{label:"All Makeup", cls:"active"}, {label:"Foundation"}, {label:"Lip Colour"}, {label:"Mascara & Brows"}, {label:"Blush & Bronzer"}],
  3: [{label:"All Haircare", cls:"active"}, {label:"Shampoo"}, {label:"Conditioner"}, {label:"Hair Oils"}, {label:"Styling"}]
};

function renderCategoryStrip(index){
  const strip = document.getElementById('categoryStrip');
  strip.innerHTML = categoryMap[index].map(c =>
    `<a href="#shop" class="${c.cls || ''}">${c.label}</a>`
  ).join('');
}

function goToSlide(index){
  slides.forEach(s => s.classList.toggle('is-active', Number(s.dataset.slide) === index));
  dots.forEach(d => d.classList.toggle('is-active', Number(d.dataset.slide) === index));
  navItems.forEach(n => n.classList.toggle('active', Number(n.dataset.slide) === index));
  renderCategoryStrip(index);
  activeSlide = index;
}

document.getElementById('heroPrev').addEventListener('click', () => {
  goToSlide((activeSlide - 1 + slides.length) % slides.length);
});
document.getElementById('heroNext').addEventListener('click', () => {
  goToSlide((activeSlide + 1) % slides.length);
});
dots.forEach(dot => dot.addEventListener('click', () => goToSlide(Number(dot.dataset.slide))));
navItems.forEach(item => item.addEventListener('click', (e) => {
  e.preventDefault();
  goToSlide(Number(item.dataset.slide));
}));

goToSlide(0);

/* ---------- PRODUCTS ---------- */
const products = [
  {id:1, name:"Rosehip Glow Serum", meta:"4.9 · Skincare", price:18, img:"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop"},
  {id:2, name:"Vitamin C Brightening Cream", meta:"4.7 · Skincare", price:12, img:"https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=500&auto=format&fit=crop"},
  {id:3, name:"Sheer Silk Foundation", meta:"4.8 · Makeup", price:26, img:"https://images.unsplash.com/photo-1631214540242-3cd8c4b0b3b4?q=80&w=500&auto=format&fit=crop"},
  {id:4, name:"Botanical Tint Blush", meta:"4.6 · Makeup", price:19, img:"https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=500&auto=format&fit=crop"},
  {id:5, name:"Repair Hair Oil", meta:"4.9 · Haircare", price:22, img:"https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=500&auto=format&fit=crop"},
  {id:6, name:"Sulfate-Free Shampoo", meta:"4.5 · Haircare", price:17, img:"https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500&auto=format&fit=crop"}
];

const grid = document.getElementById('productGrid');
grid.innerHTML = products.map(p => `
  <div class="product-card">
    <div class="product-image"><img src="${p.img}" alt="${p.name}"></div>
    <div class="product-name">${p.name}</div>
    <div class="product-meta">${p.meta}</div>
    <div class="product-footer">
      <div class="product-price">$${p.price.toFixed(2)}</div>
      <button class="add-btn" data-id="${p.id}">Add to Cart</button>
    </div>
  </div>
`).join('');

/* ---------- CART ---------- */
let cart = [];

function renderCart(){
  const itemsEl = document.getElementById('cartItems');
  const countEl = document.getElementById('cartCount');
  const subtotalEl = document.getElementById('cartSubtotal');
  const totalCount = cart.reduce((n,i)=>n+i.qty,0);
  countEl.textContent = totalCount;

  if(cart.length === 0){
    itemsEl.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
  } else {
    itemsEl.innerHTML = cart.map(i => `
      <div class="cart-line">
        <img src="${i.img}" alt="${i.name}">
        <div class="cart-line-info">
          <div class="cart-line-name">${i.name}</div>
          <div class="cart-line-price">${i.qty} × $${i.price.toFixed(2)}</div>
          <div class="cart-remove" data-id="${i.id}">Remove</div>
        </div>
      </div>
    `).join('');
  }
  const subtotal = cart.reduce((sum,i)=>sum + i.qty*i.price, 0);
  subtotalEl.textContent = '$' + subtotal.toFixed(2);
}

grid.addEventListener('click', e => {
  const btn = e.target.closest('.add-btn');
  if(!btn) return;
  const id = Number(btn.dataset.id);
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if(existing){ existing.qty += 1; } else { cart.push({...product, qty:1}); }
  renderCart();
  btn.textContent = 'Added';
  btn.classList.add('added');
  setTimeout(()=>{ btn.textContent = 'Add to Cart'; btn.classList.remove('added'); }, 900);
  openCart();
});

document.getElementById('cartItems').addEventListener('click', e => {
  const rm = e.target.closest('.cart-remove');
  if(!rm) return;
  const id = Number(rm.dataset.id);
  cart = cart.filter(i => i.id !== id);
  renderCart();
});

const drawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
function openCart(){ drawer.classList.add('open'); overlay.classList.add('open'); }
function closeCart(){ drawer.classList.remove('open'); overlay.classList.remove('open'); }
document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

renderCart();