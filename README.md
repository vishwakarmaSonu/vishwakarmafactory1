# Vishwakarma Arts website

Plain HTML + CSS + JavaScript front end with a tiny zero-dependency Node.js server (no `npm install` needed).

## Run

```bash
cd craft-store
ADMIN_USER=admin ADMIN_PASS='choose-a-strong-password' node server.js
```

- Website: http://localhost:3000
- Admin panel: http://localhost:3000/admin.html

If `ADMIN_PASS` is not set, the password is `change-me-now`. Always set your own before putting the site online.

## Pages

| Page | File | Notes |
|---|---|---|
| Home | `index.html` | Hero, collections grid, popular products |
| Category | `category.html?cat=chair` | One page template, shows products of the chosen category, with search and sort |
| About | `about.html` | |
| Admin | `admin.html` | Login required to add, edit or delete products, upload photos, manage categories |

## How admin-only access works

The admin page needs a login. Every write action (add/edit/delete product, upload photo, add/delete category) is checked on the **server** using a session cookie (HttpOnly, SameSite=Strict), so visitors cannot change data even if they call the API directly. Login is rate limited (5 wrong tries = 5 minute lock).

If you host behind HTTPS, the cookie is automatically marked Secure when the proxy sends `X-Forwarded-Proto: https`.

## Data

- Products: `data/products.json`
- Categories: `data/categories.json`
- Imported catalog photos: `assets/product-images/`
- Admin-uploaded photos: `uploads/`

The catalog contains the original Vishwakarma Arts products and any products added through the admin panel. Original item codes, listed prices, ratings, descriptions, and photos are preserved. Back up the data and image folders regularly.

Selecting a product opens its details and booking form. Clicking its photo opens the enlarged image viewer. Booking requests are sent to the Vishwakarma Arts booking service configured as `SITE.bookingEndpoint` in `js/common.js`.

The admin form suggests the next readable item code (for example, `VA-0100`) and lets you enter a different unique code. IDs may contain letters, numbers, hyphens, and underscores. The server validates IDs and rejects duplicates; suggested `VA-####` codes continue from the highest existing code. Products missing a code are assigned one automatically when the server starts. Restart the server after updating its code.

Admins can optionally add separate left, right, front, and back photos when creating or editing a product. These photos appear as view buttons in the product details modal; views without a photo remain unavailable until one is added.

## Customise

Business name, phone numbers, WhatsApp number, address and social links are in the `SITE` object at the top of `js/common.js`. The header logo and favicon use `assets/brand-mark.png`. Colours are CSS variables at the top of `css/style.css`.

## Hosting note

This needs a host that can run Node.js (a VPS, Render, Railway, etc.). Ordinary static-only hosting cannot save admin uploads.
