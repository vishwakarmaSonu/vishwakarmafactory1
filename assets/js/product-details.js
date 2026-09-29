(function () {
  "use strict";

  const products = window.VISHWAKARMA_PRODUCTS;
  const settings = window.VISHWAKARMA_SETTINGS;
  const params = new URLSearchParams(window.location.search);
  const product = products.find((item) => item.id === params.get("id"));
  const content = document.querySelector("[data-product-details]");

  if (!product) {
    content.classList.add("product-details--missing");
    content.innerHTML = "";

    const heading = document.createElement("h1");
    heading.textContent = "Product not found";
    const message = document.createElement("p");
    message.textContent = "This product link may be out of date. Browse our collections to find another item.";
    const link = document.createElement("a");
    link.href = "al.html";
    link.textContent = "Browse products";
    content.append(heading, message, link);
    return;
  }

  document.title = `${product.name} | Vishwakarma Art`;
  document.querySelector('meta[name="description"]').content =
    `${product.name} handmade furniture by Vishwakarma Art. Item ${product.itemId}.`;

  const image = document.getElementById("details-image");
  image.src = product.image;
  image.alt = product.name;
  document.getElementById("details-title").textContent = product.name;
  document.getElementById("details-productid").textContent = `Item ID ${product.itemId}`;

  const descriptionText = product.description && !product.description.includes("Size is not decided yet")
    ? product.description
    : `${product.name} by Vishwakarma Art is a handcrafted ${product.categoryLabel ? product.categoryLabel.toLowerCase() : 'furniture'} piece designed for everyday use. Contact us for exact size, wood finish, and customisation options.`;
  document.getElementById("details-description").textContent = descriptionText;

  document.getElementById("details-amount").textContent = product.price === null
    ? "Price on request"
    : `₹${product.price.toLocaleString("en-IN")}`;

  const rating = document.getElementById("star-rating");
  rating.setAttribute("aria-label", `${product.rating} out of 5 stars`);
  for (let i = 0; i < product.rating; i += 1) {
    const star = document.createElement("span");
    star.className = "star";
    star.textContent = "★";
    rating.append(star);
  }

  const contact = document.getElementById("details-contact");
  contact.href = product.contactUrl || settings.contactUrl;

  const booking = document.getElementById("book-button");
  booking.href = "#booking";

  if (window.location.hash === "#booking") {
    window.setTimeout(() => window.openModal(), 0);
  }
})();
