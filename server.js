// Zero-dependency Node server: serves the website, a small JSON API, and admin-only product management.
// Run:  ADMIN_USER=admin ADMIN_PASS='your-strong-password' node server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'change-me-now';
const PRODUCTS_FILE = path.join(ROOT, 'data', 'products.json');
const CATEGORIES_FILE = path.join(ROOT, 'data', 'categories.json');
const UPLOAD_DIR = path.join(ROOT, 'uploads');
const MAX_BODY = 12 * 1024 * 1024; // 12 MB (base64 image uploads)

if (!process.env.ADMIN_PASS) {
  console.warn('\n[WARNING] ADMIN_PASS not set. Using default password "change-me-now". Set ADMIN_PASS before going live.\n');
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp4': 'video/mp4'
};
// Only these top-level locations are publicly served (data/ and server.js are never exposed).
const PUBLIC_DIRS = ['css', 'js', 'uploads', 'assets'];
const PUBLIC_PAGES = ['index.html', 'category.html', 'about.html', 'admin.html'];

// ---------- helpers ----------
const readJSON = (f, fallback) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return fallback; } };
const writeJSON = (f, data) => {
  const tmp = f + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, f);
};
const send = (res, status, body, headers = {}) => {
  const isObj = typeof body === 'object' && !Buffer.isBuffer(body);
  res.writeHead(status, {
    'Content-Type': isObj ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff', ...headers
  });
  res.end(isObj ? JSON.stringify(body) : body);
};
const slugify = s => String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
const clean = (s, max) => String(s ?? '').trim().slice(0, max);
const normalizeItemId = s => clean(s, 30).toUpperCase();
const validItemId = s => /^[A-Z0-9][A-Z0-9_-]{0,29}$/.test(s);
const validUploadPath = s => typeof s === 'string' && /^\/uploads\/[A-Za-z0-9][A-Za-z0-9._-]*$/.test(s);
const cleanProductViews = views => {
  if (!views || typeof views !== 'object' || Array.isArray(views)) return {};
  return Object.fromEntries(['left', 'right', 'front', 'back']
    .filter(direction => validUploadPath(views[direction]))
    .map(direction => [direction, views[direction]]));
};

function nextItemId(products) {
  const sequence = products.reduce((maximum, product) => {
    const match = /^VA-(\d+)$/i.exec(String(product.itemId || '').trim());
    return match ? Math.max(maximum, Number(match[1])) : maximum;
  }, 0) + 1;
  return `VA-${String(sequence).padStart(4, '0')}`;
}

function ensureProductItemIds() {
  const products = readJSON(PRODUCTS_FILE, []);
  let changed = false;
  for (const product of products) {
    if (!String(product.itemId || '').trim()) {
      product.itemId = nextItemId(products);
      changed = true;
    }
  }
  if (changed) writeJSON(PRODUCTS_FILE, products);
}

ensureProductItemIds();

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > MAX_BODY) { reject(Object.assign(new Error('Payload too large'), { status: 413 })); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}); }
      catch { reject(Object.assign(new Error('Invalid JSON'), { status: 400 })); }
    });
    req.on('error', reject);
  });
}

// ---------- auth (in-memory sessions) ----------
const sessions = new Map(); // token -> expiry
const SESSION_MS = 8 * 60 * 60 * 1000;
const sha = s => crypto.createHash('sha256').update(String(s)).digest();
const safeEq = (a, b) => crypto.timingSafeEqual(sha(a), sha(b));
const attempts = new Map(); // ip -> {count, until}

function getCookie(req, name) {
  const m = (req.headers.cookie || '').split(/;\s*/).find(c => c.startsWith(name + '='));
  return m ? decodeURIComponent(m.slice(name.length + 1)) : null;
}
function isAdmin(req) {
  const t = getCookie(req, 'sid');
  const exp = t && sessions.get(t);
  if (!exp) return false;
  if (exp < Date.now()) { sessions.delete(t); return false; }
  return true;
}
function requireAdmin(req, res) {
  if (isAdmin(req)) return true;
  send(res, 401, { error: 'Admin login required' });
  return false;
}

// ---------- API ----------
async function api(req, res, url) {
  const p = url.pathname, m = req.method;

  // Public reads
  if (p === '/api/categories' && m === 'GET') return send(res, 200, readJSON(CATEGORIES_FILE, []));
  if (p === '/api/products' && m === 'GET') {
    let list = readJSON(PRODUCTS_FILE, []);
    const cat = url.searchParams.get('category');
    if (cat) list = list.filter(x => x.category === cat);
    return send(res, 200, list);
  }

  // Auth
  if (p === '/api/me' && m === 'GET') return send(res, 200, { admin: isAdmin(req) });
  if (p === '/api/login' && m === 'POST') {
    const ip = req.socket.remoteAddress;
    const a = attempts.get(ip) || { count: 0, until: 0 };
    if (a.until > Date.now()) return send(res, 429, { error: 'Too many attempts. Try again in a few minutes.' });
    const b = await readBody(req);
    const ok = safeEq(clean(b.username, 100), ADMIN_USER) & safeEq(clean(b.password, 200), ADMIN_PASS);
    if (!ok) {
      a.count++; if (a.count >= 5) { a.until = Date.now() + 5 * 60 * 1000; a.count = 0; }
      attempts.set(ip, a);
      return send(res, 401, { error: 'Wrong username or password' });
    }
    attempts.delete(ip);
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, Date.now() + SESSION_MS);
    const secure = req.headers['x-forwarded-proto'] === 'https' ? '; Secure' : '';
    return send(res, 200, { ok: true }, {
      'Set-Cookie': `sid=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_MS / 1000}${secure}`
    });
  }
  if (p === '/api/logout' && m === 'POST') {
    const t = getCookie(req, 'sid'); if (t) sessions.delete(t);
    return send(res, 200, { ok: true }, { 'Set-Cookie': 'sid=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' });
  }

  // ---- everything below is admin only ----
  if (!requireAdmin(req, res)) return;

  if (p === '/api/upload' && m === 'POST') {
    const b = await readBody(req);
    const match = /^data:(image\/(png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(b.data || '');
    if (!match) return send(res, 400, { error: 'Only PNG, JPG or WebP images are allowed' });
    const ext = match[2] === 'jpeg' ? 'jpg' : match[2];
    const buf = Buffer.from(match[3], 'base64');
    if (buf.length > 8 * 1024 * 1024) return send(res, 413, { error: 'Image must be under 8 MB' });
    const name = crypto.randomBytes(10).toString('hex') + '.' + ext;
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    fs.writeFileSync(path.join(UPLOAD_DIR, name), buf);
    return send(res, 201, { url: '/uploads/' + name });
  }

  if (p === '/api/products' && m === 'POST') {
    const b = await readBody(req);
    const cats = readJSON(CATEGORIES_FILE, []);
    const name = clean(b.name, 120);
    if (!name) return send(res, 400, { error: 'Product name is required' });
    if (!cats.some(c => c.slug === b.category)) return send(res, 400, { error: 'Choose a valid category' });
    const list = readJSON(PRODUCTS_FILE, []);
    const requestedItemId = normalizeItemId(b.itemId);
    if (!validItemId(requestedItemId))
      return send(res, 400, { error: 'Enter an item ID using letters, numbers, hyphens, or underscores.' });
    if (list.some(product => normalizeItemId(product.itemId) === requestedItemId))
      return send(res, 409, { error: 'That item code was just used. Refresh products and try again.' });
    const item = {
      id: crypto.randomUUID(), name, category: b.category,
      itemId: requestedItemId,
      price: clean(b.price, 40), description: clean(b.description, 2000),
      image: String(b.image || '').startsWith('/uploads/') ? b.image : '',
      views: cleanProductViews(b.views),
      featured: !!b.featured, createdAt: new Date().toISOString()
    };
    list.unshift(item); writeJSON(PRODUCTS_FILE, list);
    return send(res, 201, item);
  }

  const pm = /^\/api\/products\/([\w-]+)$/.exec(p);
  if (pm && m === 'PUT') {
    const b = await readBody(req);
    const list = readJSON(PRODUCTS_FILE, []);
    const it = list.find(x => x.id === pm[1]);
    if (!it) return send(res, 404, { error: 'Not found' });
    const cats = readJSON(CATEGORIES_FILE, []);
    if (b.category !== undefined && !cats.some(c => c.slug === b.category)) return send(res, 400, { error: 'Choose a valid category' });
    if (b.itemId !== undefined) {
      const itemId = normalizeItemId(b.itemId);
      if (!validItemId(itemId)) return send(res, 400, { error: 'Enter an item ID using letters, numbers, hyphens, or underscores.' });
      if (list.some(product => product.id !== it.id && normalizeItemId(product.itemId) === itemId))
        return send(res, 409, { error: 'That item code is already used by another product.' });
      it.itemId = itemId;
    }
    if (b.name !== undefined) { const n = clean(b.name, 120); if (!n) return send(res, 400, { error: 'Name required' }); it.name = n; }
    if (b.category !== undefined) it.category = b.category;
    if (b.price !== undefined) it.price = clean(b.price, 40);
    if (b.description !== undefined) it.description = clean(b.description, 2000);
    if (b.featured !== undefined) it.featured = !!b.featured;
    if (b.image !== undefined && (b.image === '' || String(b.image).startsWith('/uploads/'))) it.image = b.image;
    if (b.views !== undefined) it.views = cleanProductViews(b.views);
    writeJSON(PRODUCTS_FILE, list);
    return send(res, 200, it);
  }
  if (pm && m === 'DELETE') {
    const list = readJSON(PRODUCTS_FILE, []);
    const next = list.filter(x => x.id !== pm[1]);
    if (next.length === list.length) return send(res, 404, { error: 'Not found' });
    writeJSON(PRODUCTS_FILE, next);
    return send(res, 200, { ok: true });
  }

  if (p === '/api/categories' && m === 'POST') {
    const b = await readBody(req);
    const name = clean(b.name, 60), slug = slugify(name);
    if (!slug) return send(res, 400, { error: 'Category name is required' });
    const cats = readJSON(CATEGORIES_FILE, []);
    if (cats.some(c => c.slug === slug)) return send(res, 409, { error: 'Category already exists' });
    const c = { slug, name, image: '' };
    cats.push(c); writeJSON(CATEGORIES_FILE, cats);
    return send(res, 201, c);
  }
  const cm = /^\/api\/categories\/([\w-]+)$/.exec(p);
  if (cm && m === 'DELETE') {
    if (readJSON(PRODUCTS_FILE, []).some(x => x.category === cm[1]))
      return send(res, 409, { error: 'Move or delete this category\'s products first' });
    const cats = readJSON(CATEGORIES_FILE, []);
    writeJSON(CATEGORIES_FILE, cats.filter(c => c.slug !== cm[1]));
    return send(res, 200, { ok: true });
  }

  return send(res, 404, { error: 'Unknown API route' });
}

// ---------- static files ----------
function serveStatic(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  if (rel === '/') rel = '/index.html';
  const clean_ = path.normalize(rel).replace(/^([/\\])+/, '');
  const top = clean_.split(path.sep)[0];
  if (!PUBLIC_PAGES.includes(clean_) && !PUBLIC_DIRS.includes(top)) return send(res, 404, 'Not found');
  const file = path.join(ROOT, clean_);
  if (!file.startsWith(ROOT + path.sep)) return send(res, 403, 'Forbidden');
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return send(res, 404, 'Not found');
    const ext = path.extname(file).toLowerCase();
    const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' };
    if (clean_ === 'admin.html') { headers['Cache-Control'] = 'no-store'; headers['X-Robots-Tag'] = 'noindex'; }
    res.writeHead(200, headers);
    fs.createReadStream(file).pipe(res);
  });
}

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/')) {
      if (req.method !== 'GET' && !(req.headers['content-type'] || '').includes('application/json') && req.method !== 'DELETE')
        return send(res, 415, { error: 'JSON required' });
      return await api(req, res, url);
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
    serveStatic(req, res, url);
  } catch (e) {
    send(res, e.status || 500, { error: e.status ? e.message : 'Server error' });
    if (!e.status) console.error(e);
  }
}).listen(PORT, () => console.log(`Site running at http://localhost:${PORT}  (admin: /admin.html)`));
