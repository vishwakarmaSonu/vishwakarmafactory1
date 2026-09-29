(function () {
  "use strict";

  const products = window.VISHWAKARMA_PRODUCTS;
  if (!Array.isArray(products)) {
    throw new Error("The product catalog could not be loaded.");
  }

  const settings = window.VISHWAKARMA_SETTINGS;
  const lists = document.querySelectorAll("[data-product-list]");

  function createCard(product) {
    const item = document.createElement("li");
    item.className = "catalog-item";

    const card = document.createElement("article");
    card.className = "catalog-card";

    const imageLink = document.createElement("a");
    imageLink.className = "catalog-card__image";
    imageLink.href = product.bookingUrl;
    imageLink.setAttribute("aria-label", `View ${product.name}`);

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";
    imageLink.append(image);

    const content = document.createElement("div");
    content.className = "catalog-card__content";

    const category = document.createElement("p");
    category.className = "catalog-card__category";
    category.textContent = product.categoryLabel;

    const title = document.createElement("h3");
    title.className = "catalog-card__title";
    const titleLink = document.createElement("a");
    titleLink.href = product.bookingUrl;
    titleLink.textContent = product.name;
    title.append(titleLink);

    const excerpt = document.createElement("p");
    excerpt.className = "catalog-card__excerpt";
    excerpt.textContent = (product.description || "Handcrafted furniture made for everyday living.")
      .replace(/\s+/g, " ")
      .split(".")
      .filter(Boolean)[0]
      .trim();
    if (!excerpt.textContent) {
      excerpt.textContent = "Handcrafted furniture made for everyday living.";
    }

    const meta = document.createElement("div");
    meta.className = "catalog-card__meta";

    const itemId = document.createElement("span");
    itemId.textContent = `Item ${product.itemId}`;

    const price = document.createElement("span");
    price.className = "catalog-card__price";
    price.textContent = product.price === null
      ? "Price on request"
      : `₹${product.price.toLocaleString("en-IN")}`;

    meta.append(itemId, price);

    const actions = document.createElement("div");
    actions.className = "catalog-card__actions";

    const book = document.createElement("a");
    book.className = "catalog-card__book";
    book.href = product.bookingUrl;
    book.textContent = "View & book";

    const contact = document.createElement("a");
    contact.className = "catalog-card__contact";
    contact.href = product.contactUrl || settings.contactUrl;
    contact.textContent = "Contact";
    contact.setAttribute("aria-label", `Contact us about ${product.name}`);

    actions.append(book, contact);
    content.append(category, title, excerpt, meta, actions);
    card.append(imageLink, content);
    item.append(card);
    return item;
  }

  function installSearch(list, category) {
    if (category === "all") return null;

    const toolbar = document.createElement("div");
    toolbar.className = "catalog-toolbar";

    const search = document.createElement("input");
    search.className = "catalog-search";
    search.type = "search";
    search.placeholder = "Search this collection";
    search.setAttribute("aria-label", "Search products");

    const count = document.createElement("p");
    count.className = "catalog-count";
    count.setAttribute("aria-live", "polite");

    toolbar.append(search, count);
    list.before(toolbar);
    return { search, count };
  }

  lists.forEach((list) => {
    const category = list.dataset.productCategory || "all";
    const requestedIds = list.dataset.productIds
      ? new Set(list.dataset.productIds.split(",").map((id) => id.trim()))
      : null;
    const available = products.filter((product) =>
      requestedIds
        ? requestedIds.has(product.id)
        : category === "all" || product.category === category
    );

    const toolbar = installSearch(list, category);

    function render(searchText) {
      const query = searchText.trim().toLocaleLowerCase();
      const visible = available.filter((product) =>
        `${product.name} ${product.itemId} ${product.categoryLabel}`
          .toLocaleLowerCase()
          .includes(query)
      );

      list.replaceChildren(...visible.map(createCard));
      if (toolbar) {
        toolbar.count.textContent = `${visible.length} ${visible.length === 1 ? "product" : "products"}`;
      }

      if (visible.length === 0) {
        const empty = document.createElement("li");
        empty.className = "catalog-empty";
        empty.textContent = "No products match your search.";
        list.append(empty);
      }
    }

    if (toolbar) {
      toolbar.search.addEventListener("input", () => render(toolbar.search.value));
    }
    render("");
  });
})();
