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

  document.querySelectorAll("[data-product-view]").forEach((image) => {
    const view = image.dataset.productView;
    image.src = product.images?.[view] || product.image;
    image.alt = `${product.name} - ${view} view`;
  });

  const gallery = document.querySelector("[data-product-gallery]");
  if (gallery) {
    const track = gallery.querySelector("[data-product-track]");
    const slides = Array.from(track.querySelectorAll(".details-gallery__item"));
    const position = gallery.querySelector("[data-gallery-position]");
    let currentSlide = 0;

    const updatePosition = () => {
      currentSlide = Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth));
      position.textContent = `${currentSlide + 1} / ${slides.length}`;
    };

    const showSlide = (index) => {
      currentSlide = (index + slides.length) % slides.length;
      position.textContent = `${currentSlide + 1} / ${slides.length}`;
      track.scrollTo({
        left: currentSlide * track.clientWidth,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    };

    track.addEventListener("scroll", updatePosition, { passive: true });
    track.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showSlide(currentSlide - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showSlide(currentSlide + 1);
      }
    });
    gallery.querySelector("[data-gallery-previous]").addEventListener("click", () => showSlide(currentSlide - 1));
    gallery.querySelector("[data-gallery-next]").addEventListener("click", () => showSlide(currentSlide + 1));
  }

  document.getElementById("details-title").textContent = product.name;
  document.getElementById("details-productid").textContent = `Item ID ${product.itemId}`;

  document.getElementById("details-description").textContent =
    typeof product.description === "string" ? product.description : "";

  const woodTypes = {
    sheesham: { name: "Sheesham", rate: 900 },
    mango: { name: "Mango", rate: 700 },
    babula: { name: "Babula", rate: 600 },
    shagman: { name: "Shagman", rate: 3000 },
  };
  const woodSelector = document.getElementById("wood-type-selector");
  const bookingWood = document.getElementById("wood");
  const bookingWoodDisplay = document.getElementById("preferred-wood-display");
  const amount = document.getElementById("details-amount");
  const basePrice = product.price === null ? null : Number(product.price);
  const babulaRate = woodTypes.babula.rate;

  const updateWoodPrice = () => {
    const selectedWood = woodTypes[woodSelector.value] || woodTypes.babula;
    const selectedPrice = basePrice === null ? null : Math.round((basePrice / babulaRate) * selectedWood.rate);

    bookingWood.value = woodSelector.value;
    bookingWoodDisplay.value = selectedWood.name;
    amount.textContent = selectedPrice === null
      ? "Price on request"
      : `₹${selectedPrice.toLocaleString("en-IN")}`;
  };

  woodSelector.addEventListener("change", updateWoodPrice);
  updateWoodPrice();

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
