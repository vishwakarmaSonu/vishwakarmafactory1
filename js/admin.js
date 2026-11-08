const $ = id => document.getElementById(id);
let cats = [], products = [], currentImage = '';
const productViews = ['left', 'right', 'front', 'back'];
let currentViews = {};

function flash(el, text, ok = true) {
  el.textContent = text; el.className = 'msg ' + (ok ? 'ok' : 'err');
  clearTimeout(el._t); el._t = setTimeout(() => el.className = 'msg', 4000);
}

async function init() {
  const { admin } = await api('/api/me').catch(() => ({ admin: false }));
  show(admin);
  if (admin) await load();
}
function show(isAdmin) {
  $('loginView').hidden = isAdmin;
  $('dashView').hidden = !isAdmin;
}

$('loginForm').onsubmit = async e => {
  e.preventDefault();
  try {
    await api('/api/login', { method: 'POST', body: { username: $('u').value, password: $('p').value } });
    $('p').value = ''; show(true); await load();
  } catch (err) { flash($('loginMsg'), err.message, false); }
};
$('logoutBtn').onclick = async () => { await api('/api/logout', { method: 'POST', body: {} }); show(false); };

async function load() {
  try {
    [cats, products] = await Promise.all([api('/api/categories'), api('/api/products')]);
  } catch (err) {
    if (/login/i.test(err.message)) return show(false);
    return flash($('formMsg'), err.message, false);
  }
  renderCats(); renderRows();
  if (!$('pid').value) $('itemId').value = nextReadableItemId();
  if (products.some(p => !p.itemId)) {
    flash($('formMsg'), 'Readable item codes are waiting to be assigned. Restart the site server, then refresh this page.', false);
  }
}

function nextReadableItemId() {
  const used = new Set(products.map(product => String(product.itemId || '').trim().toUpperCase()));
  let sequence = products.reduce((maximum, product) => {
    const match = /^VA-(\d+)$/i.exec(String(product.itemId || '').trim());
    return match ? Math.max(maximum, Number(match[1])) : maximum;
  }, 0) + 1;
  let itemId;
  do {
    itemId = `VA-${String(sequence++).padStart(4, '0')}`;
  } while (used.has(itemId));
  return itemId;
}

function renderCats() {
  $('pcat').innerHTML = '<option value="">Select category…</option>' +
    cats.map(c => `<option value="${esc(c.slug)}">${esc(c.name)}</option>`).join('');
  $('catList').innerHTML = cats.map(c => {
    const n = products.filter(p => p.category === c.slug).length;
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--line)">
      <span>${esc(c.name)} <small style="color:var(--muted)">(${n})</small></span>
      <button class="btn danger small" data-delcat="${esc(c.slug)}">Delete</button></div>`;
  }).join('');
}

function renderRows() {
  $('count').textContent = products.length;
  $('rows').innerHTML = products.map(p => {
    const c = (cats.find(x => x.slug === p.category) || {}).name || '—';
    return `<tr>
      <td>${p.image ? `<img src="${esc(p.image)}" alt="">` : '<span class="thumb-ph"></span>'}</td>
      <td>${esc(p.name)}${p.featured ? ' <span title="Featured">★</span>' : ''}<small class="admin-item-id">${p.itemId ? `Item ${esc(p.itemId)}` : 'Readable item code pending'}</small></td>
      <td>${esc(c)}</td><td>${p.price ? '₹' + esc(p.price) : '—'}</td>
      <td><div class="row-actions">
        <button class="btn outline small" data-edit="${esc(p.id)}">Edit</button>
        <button class="btn danger small" data-del="${esc(p.id)}">Delete</button></div></td></tr>`;
  }).join('') || '<tr><td colspan="5" style="color:var(--muted)">No products yet.</td></tr>';
}

function resetForm() {
  $('productForm').reset(); $('pid').value = ''; currentImage = ''; currentViews = {};
  $('itemId').value = nextReadableItemId();
  $('preview').style.display = 'none'; $('formTitle').textContent = 'Add product';
  productViews.forEach(view => {
    $(`pview-${view}`).value = '';
    $(`preview-${view}`).hidden = true;
    $(`remove-${view}`).checked = false;
    $(`remove-label-${view}`).hidden = true;
  });
  $('cancelBtn').hidden = true;
}
$('cancelBtn').onclick = resetForm;

$('passwordToggle').onclick = () => {
  const password = $('p');
  const showPassword = password.type === 'password';
  password.type = showPassword ? 'text' : 'password';
  $('passwordToggle').textContent = showPassword ? 'Hide' : 'Show';
  $('passwordToggle').setAttribute('aria-pressed', String(showPassword));
};

$('pimg').onchange = () => {
  const f = $('pimg').files[0];
  if (!f) return;
  if (f.size > 8 * 1024 * 1024) { flash($('formMsg'), 'Image must be under 8 MB', false); $('pimg').value = ''; return; }
  $('preview').src = URL.createObjectURL(f); $('preview').style.display = 'block';
};

productViews.forEach(view => {
  $(`pview-${view}`).onchange = () => {
    const file = $(`pview-${view}`).files[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      flash($('formMsg'), 'Each image must be under 8 MB', false);
      $(`pview-${view}`).value = '';
      return;
    }
    $(`preview-${view}`).src = URL.createObjectURL(file);
    $(`preview-${view}`).hidden = false;
    $(`remove-${view}`).checked = false;
  };
});

const toDataURL = f => new Promise((res, rej) => {
  const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f);
});

$('productForm').onsubmit = async e => {
  e.preventDefault();
  $('saveBtn').disabled = true;
  try {
    let image = currentImage;
    const f = $('pimg').files[0];
    if (f) image = (await api('/api/upload', { method: 'POST', body: { data: await toDataURL(f) } })).url;
    const views = { ...currentViews };
    for (const view of productViews) {
      const file = $(`pview-${view}`).files[0];
      if (file) views[view] = (await api('/api/upload', { method: 'POST', body: { data: await toDataURL(file) } })).url;
      else if ($(`remove-${view}`).checked) delete views[view];
    }
    const body = {
      itemId: $('itemId').value.trim(),
      name: $('pname').value, category: $('pcat').value, price: $('pprice').value,
      description: $('pdesc').value, featured: $('pfeat').checked, image, views
    };
    const id = $('pid').value;
    const savedProduct = await api(id ? '/api/products/' + id : '/api/products', { method: id ? 'PUT' : 'POST', body });
    flash($('formMsg'), id ? `Product updated with item code ${savedProduct.itemId}` : `Product added with item code ${savedProduct.itemId}`);
    resetForm(); await load();
  } catch (err) {
    flash($('formMsg'), err.message, false);
    if (/login/i.test(err.message)) show(false);
  } finally { $('saveBtn').disabled = false; }
};

$('rows').onclick = async e => {
  const edit = e.target.dataset.edit, del = e.target.dataset.del;
  if (edit) {
    const p = products.find(x => x.id === edit); if (!p) return;
    $('pid').value = p.id; $('pname').value = p.name; $('pcat').value = p.category;
    $('itemId').value = p.itemId || nextReadableItemId();
    $('pprice').value = p.price; $('pdesc').value = p.description; $('pfeat').checked = !!p.featured;
    currentImage = p.image || ''; $('pimg').value = '';
    if (p.image) { $('preview').src = p.image; $('preview').style.display = 'block'; } else $('preview').style.display = 'none';
    currentViews = p.views && typeof p.views === 'object' ? { ...p.views } : {};
    productViews.forEach(view => {
      $(`pview-${view}`).value = '';
      $(`remove-${view}`).checked = false;
      const image = currentViews[view];
      $(`preview-${view}`).hidden = !image;
      if (image) $(`preview-${view}`).src = image;
      $(`remove-label-${view}`).hidden = !image;
    });
    $('formTitle').textContent = 'Edit product'; $('cancelBtn').hidden = false;
    $('productForm').scrollIntoView({ behavior: 'smooth' });
  }
  if (del && confirm('Delete this product?')) {
    try { await api('/api/products/' + del, { method: 'DELETE' }); await load(); }
    catch (err) { flash($('formMsg'), err.message, false); }
  }
};

$('catForm').onsubmit = async e => {
  e.preventDefault();
  try {
    await api('/api/categories', { method: 'POST', body: { name: $('newCat').value } });
    $('newCat').value = ''; flash($('catMsg'), 'Category added'); await load();
  } catch (err) { flash($('catMsg'), err.message, false); }
};
$('catList').onclick = async e => {
  const slug = e.target.dataset.delcat;
  if (slug && confirm('Delete this category?')) {
    try { await api('/api/categories/' + slug, { method: 'DELETE' }); await load(); }
    catch (err) { flash($('catMsg'), err.message, false); }
  }
};

init();
