(async function () {
  const cats = await renderChrome('home');
  let products = [];
  try { products = await api('/api/products'); } catch {}

  const counts = {};
  products.forEach(p => counts[p.category] = (counts[p.category] || 0) + 1);
  const productCount = document.getElementById('productCount');
  const categoryCount = document.getElementById('categoryCount');
  if (productCount) productCount.textContent = `${products.length}+`;
  if (categoryCount) categoryCount.textContent = cats.length;
  const customContact = document.getElementById('customContact');
  if (customContact) customContact.href = waLink('Hello, I would like to discuss a custom furniture design.');

  const heroImage = document.querySelector('.hero-visual img');
  const heroCaption = document.querySelector('.hero-caption');
  const heroProducts = products.filter(p => p.image && (p.featured || !products.some(item => item.featured && item.image)));
  if (heroImage && heroProducts.length) {
    let previousImage = '';
    try { previousImage = sessionStorage.getItem('heroProductImage') || ''; } catch {}
    const choices = heroProducts.filter(p => p.image !== previousImage);
    const selected = choices[Math.floor(Math.random() * choices.length)] || heroProducts[0];
    heroImage.src = selected.image;
    heroImage.alt = selected.name;
    if (heroCaption) {
      const categoryName = (cats.find(c => c.slug === selected.category) || {}).name || 'Handcrafted furniture';
      heroCaption.innerHTML = `<span>${esc(categoryName)} · Item ${esc(selected.itemId || '')}</span><strong>${esc(selected.name)}</strong>`;
    }
    try { sessionStorage.setItem('heroProductImage', selected.image); } catch {}
  }

  document.getElementById('catGrid').innerHTML = cats.map(c => {
    const first = products.find(p => p.category === c.slug && p.image);
    const img = c.image || (first && first.image);
    const n = counts[c.slug] || 0;
    return `<a class="cat-card" href="/category.html?cat=${encodeURIComponent(c.slug)}">
      <div class="cat-thumb">${img ? `<img src="${esc(img)}" alt="${esc(c.name)}" loading="lazy">` : esc(c.name.charAt(0))}</div>
      <h3>${esc(c.name)}</h3><span>${n} product${n === 1 ? '' : 's'}</span></a>`;
  }).join('');

  const featured = products.filter(p => p.featured).slice(0, 8);
  const list = featured.length ? featured : products.slice(0, 8);
  const grid = document.getElementById('featuredGrid');
  grid.innerHTML = list.length
    ? list.map(p => productCard(p, (cats.find(c => c.slug === p.category) || {}).name)).join('')
    : '<p class="empty">Products coming soon.</p>';

  if ('IntersectionObserver' in window && document.visibilityState === 'visible') {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll('.home-page .section-head, .home-page .cat-card, .home-page .product-card, .home-page .home-story-image, .home-page .home-story-copy, .home-page .feature')
      .forEach((element, index) => {
        element.classList.add('home-reveal');
        element.style.setProperty('--reveal-delay', `${index % 5 * 65}ms`);
        revealObserver.observe(element);
      });
  }

  const siteHeader = document.querySelector('.home-page .site-header');
  if (siteHeader) {
    const updateHeader = () => siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  bindProductGrid(grid, products, cats);
})();
