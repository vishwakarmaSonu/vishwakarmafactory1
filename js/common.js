// Shared site config, API helpers, header/footer, product card + modal.
const SITE = {
  name: 'Vishwakarma Arts',
  tagline: 'Handcrafted Wooden Furniture',
  topbar: 'Handmade wooden furniture • Custom designs available • WhatsApp for quick consultation',
  address: 'Indira Nagar, Sangariya, Jodhpur (Raj)',
  email: 'support@vishwakarmaart.in',
  phones: ['+91 9549759857', '+91 9251628649'],
  whatsapp: '919549759857', // country code + number, no + or spaces
  bookingEndpoint: 'https://script.google.com/macros/s/AKfycbxB9BaOpvGd0yG7WTli7e1tliNZxgf3Nhz0gvfX11ChrvXotOnssYX1aqDI3LgDtSciNA/exec',
  social: [
    ['Facebook', 'https://www.facebook.com/profile.php?id=61555298892002'],
    ['Instagram', 'https://www.instagram.com/vishwakarma_arts_official_/'],
    ['Twitter', 'https://twitter.com/VishwakarmaArt3'],
    ['LinkedIn', 'https://www.linkedin.com/in/vishwakarma-art-a22b79292/']
  ]
};

// Escape any text that comes from the data files / admin before putting it in HTML.
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function api(path, opts = {}) {
  const res = await fetch(path, {
    credentials: 'same-origin',
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function waLink(text) { return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`; }

function displayPrice(price) {
  if (price === null || price === undefined || price === '') return 'Price on request';
  const amount = Number(String(price).replace(/[₹,\s]/g, ''));
  return Number.isFinite(amount) ? `₹${new Intl.NumberFormat('en-IN').format(amount)}` : String(price);
}

function displayItemCode(product) {
  return product.itemId ? `Item ${product.itemId}` : 'Item code pending';
}

function socialIcon(name) {
  const icons = {
    Facebook: '<path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V10H7v3h2.8v8h3.7Z"/>',
    Instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.7" cy="6.5" r=".8" fill="currentColor" stroke="none"/>',
    Twitter: '<path d="M22 5.9a8 8 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.3 8.3 0 0 1-2.7 1 4.1 4.1 0 0 0-7 3.8 11.7 11.7 0 0 1-8.5-4.3 4.1 4.1 0 0 0 1.3 5.5 4 4 0 0 1-1.9-.5v.1a4.1 4.1 0 0 0 3.3 4 4 4 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.8A8.3 8.3 0 0 1 2.7 19a11.7 11.7 0 0 0 18-9.9v-.5A8.4 8.4 0 0 0 22 5.9Z"/>',
    LinkedIn: '<path d="M5.2 8.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6ZM3.7 10h3v10h-3zM9 10h2.9v1.4h.1a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.7 2 3.7 4.6V20h-3v-5c0-1.2 0-2.7-1.7-2.7s-2 1.3-2 2.6V20H9z"/>'
  };
  return `<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[name] || ''}</svg>`;
}

async function renderChrome(active) {
  let cats = [];
  try { cats = await api('/api/categories'); } catch {}
  const header = document.getElementById('site-header');
  if (header) header.outerHTML = `
    <div class="topbar">${esc(SITE.topbar)}</div>
    <header class="site-header"><div class="container nav">
      <a class="brand" href="/" aria-label="${esc(SITE.name)} – ${esc(SITE.tagline)}">
        <img class="brand-mark" src="/assets/brand-mark.png" alt="">
        <span class="brand-copy">${esc(SITE.name)}<small>${esc(SITE.tagline)}</small></span>
      </a>
      <button class="menu-toggle" aria-label="Menu" id="menuToggle">☰</button>
      <ul class="nav-links" id="navLinks">
        <li><a href="/" class="${active === 'home' ? 'active' : ''}">Home</a></li>
        <li class="dropdown"><a href="/#collections" class="${active === 'category' ? 'active' : ''}">Collections ▾</a>
          <ul class="menu">${cats.map(c => `<li><a href="/category.html?cat=${encodeURIComponent(c.slug)}">${esc(c.name)}</a></li>`).join('')}</ul></li>
        <li><a href="/about.html" class="${active === 'about' ? 'active' : ''}">About Us</a></li>
        <li><a class="btn small whatsapp" href="${waLink('Hello, I want to know about your furniture.')}" target="_blank" rel="noopener">WhatsApp</a></li>
      </ul></div></header>`;
  const footer = document.getElementById('site-footer');
  if (footer) footer.outerHTML = `
    <footer class="site-footer"><div class="container">
      <div class="footer-grid">
        <div><h4>${esc(SITE.name)}</h4><p>${esc(SITE.tagline)}. Custom designs made to order.</p></div>
        <div><h4>Contact Us</h4><ul>
          <li>${esc(SITE.address)}</li>
          <li><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></li>
          ${SITE.phones.map(p => `<li><a href="tel:${p.replace(/\s/g, '')}">${esc(p)}</a></li>`).join('')}</ul></div>
        <div><h4>Collections</h4><ul>${cats.slice(0, 6).map(c => `<li><a href="/category.html?cat=${encodeURIComponent(c.slug)}">${esc(c.name)}</a></li>`).join('')}</ul></div>
        <div><h4>Follow Us</h4><ul class="social-links">${SITE.social.map(([n, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener" aria-label="${esc(n)} (opens in a new tab)">${socialIcon(n)}<span>${esc(n)}</span></a></li>`).join('')}</ul></div>
      </div>
      <div class="copy">© ${new Date().getFullYear()} All Rights Reserved by ${esc(SITE.name)}.</div>
    </div></footer>
    <a class="wa-float" href="${waLink('Hello, I want to know about your furniture.')}" target="_blank" rel="noopener">💬 WhatsApp</a>
    <div class="modal" id="productModal" aria-hidden="true"></div>`;
  const t = document.getElementById('menuToggle');
  if (t) t.onclick = () => document.getElementById('navLinks').classList.toggle('open');
  return cats;
}

function productCard(p, catName) {
  return `<article class="product-card" data-id="${esc(p.id)}" tabindex="0">
    ${p.image
      ? `<button class="product-img product-image-button" type="button" aria-label="View larger image of ${esc(p.name)}"><img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"></button>`
      : `<div class="product-img">${esc(p.name.charAt(0))}</div>`}
    <div class="product-body">
      <span class="cat">${esc(catName || '')}</span>
      <h3>${esc(p.name)}</h3>
      <div class="product-meta">
        <span>${esc(displayItemCode(p))}</span>
        ${p.rating ? `<span class="rating" aria-label="Rated ${esc(p.rating)} out of 5">★ ${esc(p.rating)}/5</span>` : ''}
      </div>
    </div></article>`;
}

function openProductModal(p, catName) {
  const m = document.getElementById('productModal');
  const returnFocus = document.activeElement;
  const contactNote = 'Please contact us to confirm the exact dimensions, wood selection, and any custom design requirements.';
  const description = String(p.description || 'Handcrafted to order. Message us for sizes, finishes and custom designs.');
  const hasContactNote = description.includes(contactNote);
  const productDescription = hasContactNote
    ? description.replace(contactNote, '').trim()
    : description;
  m.innerHTML = `<div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="productModalTitle">
    <button class="modal-close" aria-label="Close">×</button>
    <div class="modal-media">
      ${p.image
        ? `<button class="product-img product-image-button" type="button" aria-label="View larger image of ${esc(p.name)}"><img class="modal-product-photo" src="${esc(p.image)}" alt="${esc(p.name)}"></button>`
        : `<div class="product-img">${esc(p.name.charAt(0))}</div>`}
    </div>
    <div class="modal-info">
      <span class="cat" style="color:var(--accent);text-transform:uppercase;font-size:.8rem;letter-spacing:1.2px">${esc(catName || '')}</span>
      <h2 id="productModalTitle">${esc(p.name)}</h2>
      <div class="product-meta modal-meta">
        <span>${esc(displayItemCode(p))}</span>
        ${p.rating ? `<span class="rating" aria-label="Rated ${esc(p.rating)} out of 5">★ ${esc(p.rating)}/5</span>` : ''}
      </div>
      <button class="booking-jump" type="button">Continue to booking <span aria-hidden="true">↓</span></button>
      ${productDescription ? `<p>${esc(productDescription)}</p>` : ''}
      ${hasContactNote ? `<p class="product-contact-note">${esc(contactNote)}</p>` : ''}
      <form class="booking-form" id="bookingForm">
        <h3>Book this product</h3>
        <div class="booking-fields">
          <div class="field"><label for="bookingName">Name</label><input id="bookingName" name="name" autocomplete="name" required></div>
          <div class="field"><label for="bookingPhone">Phone number</label><input id="bookingPhone" name="phone" type="tel" autocomplete="tel" required></div>
          <div class="field"><label for="bookingEmail">Email</label><input id="bookingEmail" name="email" type="email" autocomplete="email" required></div>
          <div class="field"><label for="bookingAddress">Address</label><input id="bookingAddress" name="address" autocomplete="street-address" required></div>
          <div class="field"><label for="bookingWood">Preferred wood</label>
            <select id="bookingWood" name="wood" required>
              <option value="sheesham">Sheesham</option>
              <option value="mango">Mango</option>
              <option value="babula">Babula</option>
              <option value="shagman">Shagman</option>
            </select>
          </div>
        </div>
        <label class="booking-terms"><input name="terms" type="checkbox" required>
          <span>I agree to be contacted about this booking and understand a 40% advance is required to initiate it.</span>
        </label>
        <p class="booking-status" id="bookingStatus" role="status" aria-live="polite"></p>
        <button class="btn" type="submit">Submit booking</button>
        <a class="booking-whatsapp" target="_blank" rel="noopener" href="${waLink('Hello, I am interested in: ' + p.name + ' (' + displayItemCode(p) + ')')}">Prefer WhatsApp? Enquire about this item</a>
      </form>
    </div></div>`;
  m.classList.add('open');
  const handleKeydown = event => {
    if (event.key === 'Escape') {
      if (m.querySelector('.image-viewer')) return;
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...m.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled])')]
      .filter(el => el.getClientRects().length);
    if (!focusable.length) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !m.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !m.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  };
  const close = () => {
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', handleKeydown);
    if (returnFocus instanceof HTMLElement && returnFocus.isConnected) returnFocus.focus();
  };
  const continueButton = m.querySelector('.booking-jump');
  continueButton.onclick = () => {
    const firstField = m.querySelector('#bookingForm input');
    firstField.focus({ preventScroll: true });
    firstField.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center'
    });
  };
  m.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  m.querySelector('.modal-close').onclick = close;
  m.onclick = e => { if (e.target === m) close(); };
  document.addEventListener('keydown', handleKeydown);
  m.querySelector('#bookingForm').addEventListener('submit', event => submitBooking(event, p, catName));
  m.querySelector('.product-image-button')?.addEventListener('click', event => {
    event.stopPropagation();
    const image = m.querySelector('.modal-product-photo');
    openImageViewer(image.src, image.alt, m);
  });
  m.querySelector('.modal-close').focus();
}

function openImageViewer(src, alt, modal) {
  const returnFocus = document.activeElement;
  const parentWasOpen = modal.classList.contains('open');
  const viewer = document.createElement('div');
  viewer.className = 'image-viewer';
  viewer.innerHTML = `
    <button class="image-viewer-close" type="button" aria-label="Close enlarged image">×</button>
    <img class="image-viewer-photo" src="${esc(src)}" alt="${esc(alt)}">
    <p class="image-viewer-caption">${esc(alt)}</p>`;

  const close = () => {
    document.removeEventListener('keydown', onKeydown);
    viewer.remove();
    if (!parentWasOpen) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    }
    if (returnFocus instanceof HTMLElement && returnFocus.isConnected) returnFocus.focus();
  };
  const onKeydown = event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopImmediatePropagation();
      close();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      viewer.querySelector('.image-viewer-close').focus();
    }
  };

  viewer.addEventListener('click', event => {
    if (event.target === viewer) close();
  });
  viewer.querySelector('.image-viewer-close').addEventListener('click', close);
  modal.append(viewer);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onKeydown);
  viewer.querySelector('.image-viewer-close').focus();
}

async function submitBooking(event, product, categoryName) {
  event.preventDefault();
  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  const status = form.querySelector('#bookingStatus');
  const values = new FormData(form);
  const itemId = product.itemId || 'Pending assignment';
  const productLink = new URL(`/category.html?cat=${encodeURIComponent(product.category)}`, window.location.origin).href;
  const payload = new URLSearchParams({
    phone: String(values.get('phone')).trim(),
    'phone no': String(values.get('phone')).trim(),
    'Phone no': String(values.get('phone')).trim(),
    Name: String(values.get('name')).trim(),
    'Email id': String(values.get('email')).trim(),
    address: String(values.get('address')).trim(),
    'wood type': String(values.get('wood')),
    'product name': product.name,
    'item id': itemId,
    price: displayPrice(product.price),
    'website url': window.location.origin,
    'product url': productLink,
    'product category': categoryName || product.category
  });

  submitButton.disabled = true;
  status.className = 'booking-status';
  status.textContent = 'Submitting your booking…';
  try {
    const response = await fetch(SITE.bookingEndpoint, { method: 'POST', mode: 'cors', body: payload });
    if (!response.ok) throw new Error(`Booking request failed with status ${response.status}`);
    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error(/^(error|failed|false)\b/i.test(responseText.trim())
        ? responseText.trim()
        : 'The booking service returned an invalid response.');
    }
    if (result.result !== 'success') throw new Error(result.error || 'The booking could not be submitted.');
    status.classList.add('success');
    status.textContent = result.emailSent
      ? 'Booking submitted! A confirmation was sent to your email.'
      : 'Your booking was received. Vishwakarma Arts will contact you soon.';
    form.reset();
  } catch (error) {
    console.error('Booking submission failed:', error);
    status.classList.add('error');
    status.textContent = 'Booking not submitted. Please try again or use the WhatsApp enquiry link below.';
  } finally {
    submitButton.disabled = false;
  }
}

// Wire up clicks on any .product-grid so cards open the modal.
function bindProductGrid(grid, products, cats) {
  const open = el => {
    const card = el.closest('.product-card'); if (!card) return;
    const p = products.find(x => x.id === card.dataset.id); if (!p) return;
    if (el.closest('.product-image-button') && p.image) {
      openImageViewer(p.image, p.name, document.getElementById('productModal'));
      return;
    }
    openProductModal(p, (cats.find(c => c.slug === p.category) || {}).name);
  };
  grid.onclick = e => open(e.target);
  grid.onkeydown = e => {
    if (e.target.closest('.product-image-button')) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open(e.target);
    }
  };
}
