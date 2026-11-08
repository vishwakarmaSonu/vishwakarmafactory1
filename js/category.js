(async function () {
  const cats = await renderChrome('category');
  const slug = new URLSearchParams(location.search).get('cat');
  const cat = cats.find(c => c.slug === slug);
  const grid = document.getElementById('grid');

  document.getElementById('pills').innerHTML = cats.map(c =>
    `<a class="pill ${c.slug === slug ? 'active' : ''}" href="/category.html?cat=${encodeURIComponent(c.slug)}">${esc(c.name)}</a>`).join('');

  if (!cat) {
    document.getElementById('catTitle').textContent = 'Collection not found';
    grid.innerHTML = '<p class="empty">Please choose a collection above.</p>';
    return;
  }
  document.title = `${cat.name} – ${SITE.name}`;
  document.getElementById('catTitle').textContent = cat.name;
  document.getElementById('crumb').textContent = cat.name;

  let products = [];
  try { products = await api('/api/products?category=' + encodeURIComponent(slug)); }
  catch { grid.innerHTML = '<p class="empty">Could not load products. Please refresh.</p>'; return; }

  function draw() {
    const q = document.getElementById('q').value.trim().toLowerCase();
    const sort = document.getElementById('sort').value;
    let list = products.filter(p => !q || (p.name + ' ' + p.itemId + ' ' + p.description).toLowerCase().includes(q));
    if (sort === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
    grid.innerHTML = list.length ? list.map(p => productCard(p, cat.name)).join('')
      : `<p class="empty">${products.length ? 'No products match your search.' : 'No products in this collection yet – check back soon or WhatsApp us for custom orders.'}</p>`;
    bindProductGrid(grid, list, cats);
  }
  document.getElementById('q').oninput = draw;
  document.getElementById('sort').onchange = draw;
  draw();
})();
