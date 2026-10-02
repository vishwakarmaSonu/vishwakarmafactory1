(function () {
  "use strict";

  const catalog = window.VISHWAKARMA_PRODUCTS;
  const settings = window.VISHWAKARMA_SETTINGS;
  if (!Array.isArray(catalog) || !settings || !settings.whatsappUrl) {
    throw new Error("The product assistant could not load its catalog or contact settings.");
  }

  const styles = document.createElement("link");
  styles.rel = "stylesheet";
  styles.href = new URL("../css/site-assistant.css", document.currentScript.src).href;
  document.head.append(styles);

  const launcher = document.createElement("button");
  launcher.className = "site-assistant-launcher";
  launcher.type = "button";
  launcher.setAttribute("aria-label", "Open product assistant");
  launcher.setAttribute("aria-expanded", "false");
  launcher.innerHTML = '<span aria-hidden="true">✦</span><span class="site-assistant-launcher__label">Ask us</span>';

  const floatingControls = [launcher];
  if (document.body.dataset.hideFloatingFeedback !== "true") {
    const feedback = document.createElement("a");
    feedback.className = "site-feedback-link";
    feedback.href = "#feedback";
    feedback.setAttribute("aria-label", "Share your feedback");
    feedback.innerHTML = '<span class="site-feedback-link__icon" aria-hidden="true">★</span><span>Feedback</span>';
    feedback.addEventListener("click", (event) => {
      event.preventDefault();
      if (typeof window.openVishwakarmaFeedbackModal === "function") {
        window.openVishwakarmaFeedbackModal();
      }
    });
    floatingControls.push(feedback);
  }

  if (document.body.dataset.hideFloatingWhatsapp !== "true") {
    const whatsapp = document.createElement("a");
    whatsapp.className = "site-whatsapp-link";
    whatsapp.href = settings.whatsappUrl;
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener noreferrer";
    whatsapp.setAttribute("aria-label", "Chat with us on WhatsApp");
    whatsapp.innerHTML = '<span class="site-whatsapp-link__icon" aria-hidden="true">◉</span><span>WhatsApp</span>';
    floatingControls.push(whatsapp);
  }

  const panel = document.createElement("section");
  panel.className = "site-assistant";
  panel.id = "site-assistant-panel";
  panel.setAttribute("aria-label", "Vishwakarma Art product assistant");
  panel.hidden = true;
  panel.innerHTML = `
    <header class="site-assistant__header">
      <div>
        <p class="site-assistant__eyebrow">VISHWAKARMA ART</p>
        <h2>Product assistant</h2>
        <p>Ask about products, orders, delivery or store policies.</p>
      </div>
      <button class="site-assistant__close" type="button" aria-label="Close product assistant">×</button>
    </header>
    <div class="site-assistant__messages" role="log" aria-live="polite" aria-relevant="additions">
      <div class="site-assistant__message site-assistant__message--bot">Hello! Ask me about products, prices, custom designs, delivery, booking, or order policies. I’ll point you to our team when details aren’t listed.</div>
      <div class="site-assistant__suggestions">
        <button type="button" data-assistant-prompt="Show me the collections">Browse collections</button>
        <button type="button" data-assistant-prompt="Show all chairs">Browse chairs</button>
        <button type="button" data-assistant-prompt="What is the cheapest item?">Lowest prices</button>
        <button type="button" data-assistant-prompt="Do you deliver?">Delivery</button>
        <button type="button" data-assistant-prompt="How do I book?">Booking & payment</button>
      </div>
    </div>
    <form class="site-assistant__form">
      <label class="site-assistant__visually-hidden" for="site-assistant-input">Ask a product question</label>
      <input id="site-assistant-input" name="question" type="text" maxlength="240" placeholder="Ask about a product..." autocomplete="off" required>
      <button type="submit" aria-label="Send message">Send</button>
    </form>
    <p class="site-assistant__note">Catalog helper · For custom orders, message us on WhatsApp.</p>
  `;

  document.body.append(...floatingControls, panel);

  const feedbackModal = document.createElement("div");
  feedbackModal.className = "site-feedback-modal";
  feedbackModal.hidden = true;
  feedbackModal.setAttribute("aria-hidden", "true");
  feedbackModal.innerHTML = `
    <div class="site-feedback-modal__backdrop" data-feedback-close></div>
    <div class="site-feedback-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="site-feedback-title">
      <button class="site-feedback-modal__close" type="button" aria-label="Close feedback form">×</button>
      <h3 id="site-feedback-title">Share your feedback</h3>
      <p>Tell us how your experience was with Vishwakarma Art.</p>
      <form class="site-feedback-modal__form">
        <label>
          <span>Name</span>
          <input type="text" name="name" maxlength="80" placeholder="Your name">
        </label>
        <label>
          <span>Rating</span>
          <select name="rating">
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Poor</option>
          </select>
        </label>
        <label>
          <span>Feedback</span>
          <textarea name="review" rows="4" maxlength="300" placeholder="Write your review here..." required></textarea>
        </label>
        <button type="submit">Submit feedback</button>
      </form>
    </div>
  `;
  document.body.append(feedbackModal);

  const feedbackForm = feedbackModal.querySelector("form");
  const feedbackCloseButton = feedbackModal.querySelector(".site-feedback-modal__close");
  const feedbackBackdrop = feedbackModal.querySelector("[data-feedback-close]");

  function closeFeedbackModal() {
    feedbackModal.hidden = true;
    feedbackModal.setAttribute("aria-hidden", "true");
    feedbackForm.reset();
  }

  function openFeedbackModal() {
    feedbackModal.hidden = false;
    feedbackModal.setAttribute("aria-hidden", "false");
    feedbackForm.querySelector('input[name="name"]').focus();
  }

  window.openVishwakarmaFeedbackModal = openFeedbackModal;

  feedbackCloseButton.addEventListener("click", closeFeedbackModal);
  feedbackBackdrop.addEventListener("click", closeFeedbackModal);

  feedbackForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(feedbackForm);
    const review = (formData.get("review") || "").toString().trim();
    if (!review) {
      return;
    }

    const payload = {
      name: ((formData.get("name") || "Customer").toString().trim() || "Customer"),
      rating: Number(formData.get("rating") || 5),
      review,
      createdAt: new Date().toISOString(),
      source: "website"
    };

    const submitButton = feedbackForm.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {
      const feedbackUrl = window.VISHWAKARMA_SETTINGS?.feedbackUrl || "";
      if (!feedbackUrl) {
        throw new Error("The Google Sheets feedback endpoint is not configured.");
      }

      const response = await fetch(feedbackUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8", "Accept": "application/json" },
        body: JSON.stringify(payload),
        mode: "cors",
        cache: "no-store"
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result?.result !== "success") {
        throw new Error(result?.error || `The Google Sheet request failed with status ${response.status}.`);
      }

      if (typeof window.renderCustomerReviews === "function") {
        await window.renderCustomerReviews();
      }

      closeFeedbackModal();
      alert("Thank you for your feedback.");
    } catch (error) {
      console.error("Feedback submission failed:", error);
      alert(`Feedback was not saved. Please try again later. ${error.message || ""}`);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit feedback";
    }
  });

  const messages = panel.querySelector(".site-assistant__messages");
  const input = panel.querySelector("input");
  const form = panel.querySelector("form");

  function toggleAssistant(open) {
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    launcher.setAttribute("aria-label", open ? "Close product assistant" : "Open product assistant");
    if (open) input.focus();
    else launcher.focus();
  }

  function addMessage(text, sender) {
    const message = document.createElement("div");
    message.className = `site-assistant__message site-assistant__message--${sender}`;
    message.textContent = text;
    messages.append(message);
    return message;
  }

  function addProductLinks(products) {
    const list = document.createElement("ul");
    list.className = "site-assistant__results";

    products.forEach((product) => {
      const item = document.createElement("li");
      const card = document.createElement("article");
      card.className = "site-assistant__product";

      const imageLink = document.createElement("a");
      imageLink.className = "site-assistant__product-image";
      imageLink.href = product.bookingUrl;
      imageLink.setAttribute("aria-label", `View ${product.name}, item ${product.itemId}`);

      const image = document.createElement("img");
      image.src = new URL(product.image, document.baseURI).href;
      image.alt = `${product.name}, item ${product.itemId}`;
      image.loading = "lazy";
      imageLink.append(image);

      const details = document.createElement("div");
      details.className = "site-assistant__product-details";

      const category = document.createElement("span");
      category.className = "site-assistant__product-category";
      category.textContent = product.categoryLabel;

      const name = document.createElement("a");
      name.className = "site-assistant__product-name";
      name.href = product.bookingUrl;
      name.textContent = product.name;
      name.setAttribute("aria-label", `${product.name}, item ${product.itemId}`);

      const itemId = document.createElement("span");
      itemId.className = "site-assistant__product-id";
      itemId.textContent = `Item ${product.itemId}`;

      const description = document.createElement("span");
      description.className = "site-assistant__product-description";
      description.textContent = product.description;

      const price = document.createElement("span");
      price.className = "site-assistant__product-price";
      price.textContent = product.price === null
        ? "Price on request"
        : `₹${product.price.toLocaleString("en-IN")}`;

      const rating = document.createElement("span");
      rating.className = "site-assistant__product-rating";
      rating.textContent = `Rating: ${product.rating}/5`;

      const book = document.createElement("a");
      book.className = "site-assistant__book";
      book.href = product.bookingUrl;
      book.textContent = "View & book";
      book.setAttribute("aria-label", `View and book ${product.name}, item ${product.itemId}`);

      details.append(category, name, itemId, description, price, rating, book);
      card.append(imageLink, details);
      item.append(card);
      list.append(item);
    });
    messages.append(list);
  }

  function addWhatsAppLink() {
    const link = document.createElement("a");
    link.className = "site-assistant__whatsapp";
    link.href = settings.whatsappUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Continue on WhatsApp";
    messages.append(link);
  }

  function addLocationLink() {
    const link = document.createElement("a");
    link.className = "site-assistant__whatsapp";
    link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Indira Nagar, Sangariya, Jodhpur, Rajasthan")}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open location in Google Maps";
    messages.append(link);
  }

  function findProducts(query, limit = 4) {
    const ignoredTerms = new Set([
      "a", "an", "the", "for", "and", "show", "find", "want", "need", "have",
      "price", "prices", "cost", "costs", "how", "much", "what", "about",
      "please", "item", "items", "product", "products", "me", "some", "is",
      "are", "do", "you", "your", "of", "with", "in", "under", "below",
      "cheapest", "cheap", "lowest", "less", "than", "rupees", "rs", "₹",
      "book", "booking", "order", "purchase", "buy"
    ]);
    const terms = query
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((term) => term.length > 1 && !ignoredTerms.has(term));

    const matches = catalog
      .map((product) => {
        const searchable = `${product.name} ${product.categoryLabel} ${product.itemId} ${product.id}`.toLocaleLowerCase();
        const score = terms.reduce((total, term) => total + (searchable.includes(term) ? 1 : 0), 0);
        return { product, score };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name));
    const bestScore = matches[0]?.score ?? 0;

    return matches
      .filter((result) => result.score === bestScore)
      .slice(0, limit)
      .map((result) => result.product);
  }

  function findProductsByItemId(query) {
    const itemIdMatch = query.match(/\b(?:item\s*(?:(?:id|no\.?|number)\s*)?|(?:product\s*)?(?:id|#)\s*)([a-z0-9-]+)\b/i);
    const standaloneItemId = /^\d+$/.test(query) ? query : null;
    const itemId = itemIdMatch?.[1] || standaloneItemId;
    if (!itemId) return null;

    const products = catalog.filter((product) =>
      String(product.itemId).toLocaleLowerCase() === itemId.toLocaleLowerCase()
    );
    return { itemId, products };
  }

  function findCategoryProducts(query) {
    const categoryAliases = [
      { label: "Mirrors", aliases: ["mirror", "mirrors"] },
      { label: "Bookshelves", aliases: ["bookshelf", "bookshelves", "book shelf", "book shelves"] },
      { label: "Chairs", aliases: ["chair", "chairs"] },
      { label: "Beds", aliases: ["bed", "beds"] },
      { label: "Sideboards", aliases: ["sideboard", "sideboards"] },
      { label: "Study Tables", aliases: ["study table", "study tables", "desk", "desks"] },
      { label: "Dining Tables", aliases: ["dining table", "dining tables"] },
      { label: "Coffee Tables", aliases: ["coffee table", "coffee tables"] },
      { label: "Shoe Racks", aliases: ["shoe rack", "shoe racks", "shoerack", "shoeracks"] },
      { label: "Wooden temples", aliases: ["wooden temple", "wooden temples", "temple", "temples"] }
    ];
    const matchingCategory = categoryAliases
      .flatMap((category) => category.aliases.map((alias) => ({ ...category, alias })))
      .filter(({ alias }) => {
        const pattern = alias.split(/\s+/).map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s+");
        return new RegExp(`\\b${pattern}\\b`, "i").test(query);
      })
      .sort((a, b) => b.alias.length - a.alias.length)[0];

    if (!matchingCategory) return null;
    const nonCategoryTerms = query
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter(Boolean);
    const categoryWords = matchingCategory.alias.toLocaleLowerCase().split(/\s+/);
    const promptWords = new Set([
      "a", "about", "an", "and", "all", "any", "are", "book", "booking", "browse",
      "can", "chair", "could", "detail", "details", "describe", "do", "find", "for",
      "give", "have", "i", "list", "like", "me", "need", "of", "please", "price",
      "prices", "show", "some", "the", "to", "want", "what", "with", "would", "you",
      "cost", "costs", "much", "how"
    ]);
    const specificTerms = nonCategoryTerms.filter((word) => {
      const normalizedWord = word.replace(/s$/, "");
      const isCategoryWord = categoryWords.some((categoryWord) =>
        categoryWord === word || categoryWord.replace(/s$/, "") === normalizedWord
      );
      return !isCategoryWord && !promptWords.has(word);
    });
    if (specificTerms.length) return null;

    return {
      label: matchingCategory.label,
      products: catalog.filter((product) => product.categoryLabel.toLocaleLowerCase() === matchingCategory.label.toLocaleLowerCase())
    };
  }

  function showProducts(products, message) {
    if (!products.length) return false;
    addMessage(message, "bot");
    addProductLinks(products);
    return true;
  }

  function respond(question) {
    const query = question.toLocaleLowerCase().trim();
    if (/^(hi|hello|hey)( there)?[!. ]*$|^good (morning|afternoon|evening)[!. ]*$/.test(query)) {
      addMessage("Hello! I can help you browse furniture, find catalog prices, and learn about booking or delivery. What would you like to know?", "bot");
      return;
    }

    if (/^(thanks|thank you|thx)\b/.test(query)) {
      addMessage("You’re welcome! Ask me anything else about the catalog, or contact our team on WhatsApp for personal help.", "bot");
      return;
    }

    if (/^(bye|goodbye|see you)\b/.test(query)) {
      addMessage("Thanks for visiting Vishwakarma Art. Have a great day!", "bot");
      return;
    }

    if (/\b(what is|what's|who is|tell me about|about)\b/.test(query) && /\bvishwakarma\s*art(s)?\b/.test(query)) {
      const includesLocation = /\b(location|address|directions|where)\b/.test(query);
      addMessage(`Vishwakarma Art is a manufacturer and supplier of handicraft and wooden furniture items. The site offers online booking and home delivery, and says custom designs can be made to customers’ wishes. Mr. Sudhir Vishwakarma is listed as Founder/CEO.${includesLocation ? " The listed address is Indira Nagar, Sangariya, Jodhpur, Rajasthan." : ""}`, "bot");
      if (includesLocation) addLocationLink();
      return;
    }

    const itemLookup = findProductsByItemId(query);
    if (itemLookup) {
      if (itemLookup.products.length) {
        showProducts(itemLookup.products, `Catalog details for item ID ${itemLookup.itemId}:`);
      } else {
        addMessage(`I couldn’t find item ID ${itemLookup.itemId} in the catalog. Check the item ID or ask our team to help.`, "bot");
        addWhatsAppLink();
      }
      return;
    }

    if (/\b(contact|whatsapp|phone|call|speak to someone|talk to someone|human|representative)\b/.test(query)) {
      addMessage("You can contact our team on WhatsApp for product questions, order help, or other details.", "bot");
      addWhatsAppLink();
      return;
    }

    if (/\b(location|address|directions|where are you|where are you located|factory location|visit us)\b/.test(query)) {
      addMessage("Our listed address is Indira Nagar, Sangariya, Jodhpur, Rajasthan. Use the map link for directions, and contact our team to confirm visiting hours before you travel.", "bot");
      addLocationLink();
      addWhatsAppLink();
      return;
    }

    if (/\b(collections|categories|category|browse all|what do you sell|what products|show all)\b/.test(query)) {
      const categories = new Map();
      catalog.forEach((product) => {
        categories.set(product.categoryLabel, (categories.get(product.categoryLabel) || 0) + 1);
      });
      addMessage(`Browse our collections: ${Array.from(categories, ([name, count]) => `${name} (${count})`).join(", ")}.`, "bot");
      return;
    }

    if (/\b(cheapest|lowest price|least expensive|most affordable|budget|under\s*(?:rs\.?|₹)?\s*\d|below\s*(?:rs\.?|₹)?\s*\d)\b/.test(query)) {
      const budgetMatch = query.match(/\b(?:under|below|less than|max(?:imum)?|budget(?: of)?)\s*(?:rs\.?|₹)?\s*([\d,]+)/);
      let products = catalog.filter((product) => product.price !== null);
      const matchingProducts = findProducts(query, catalog.length);
      if (matchingProducts.length) {
        const matchingIds = new Set(matchingProducts.map((product) => product.id));
        products = products.filter((product) => matchingIds.has(product.id));
      }
      if (budgetMatch) {
        const budget = Number(budgetMatch[1].replace(/,/g, ""));
        products = products.filter((product) => product.price <= budget);
        products.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
        if (!products.length) {
          addMessage(`I couldn’t find a catalog item under ₹${budget.toLocaleString("en-IN")}. Ask our team about other options or custom designs.`, "bot");
          addWhatsAppLink();
          return;
        }
        showProducts(products.slice(0, 4), `Catalog items under ₹${budget.toLocaleString("en-IN")}:`);
        return;
      }
      products.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
      showProducts(products.slice(0, 4), "Some of the lowest-priced items in our catalog:");
      return;
    }

    const categoryLookup = findCategoryProducts(query);
    if (categoryLookup) {
      showProducts(categoryLookup.products, `Here are all ${categoryLookup.label.toLocaleLowerCase()} in our catalog. Select a product to view details or book:`);
      return;
    }

    if (/\b(deliver|delivery|shipping|ship|home delivery|deliveries)\b/.test(query)) {
      addMessage("The site says home delivery is available, but delivery areas, charges, and timelines aren’t listed. Please confirm those details with our team before booking.", "bot");
      addWhatsAppLink();
      return;
    }

    if (/\b(return|refund|exchange|replace|replacement|defect|damaged)\b/.test(query)) {
      addMessage("The booking terms say goods once sold are not taken back, and an item found defective from our side can be replaced. Contact our team to discuss a specific order.", "bot");
      addWhatsAppLink();
      return;
    }

    if (/\b(custom|customize|customise|personalized|personalised|made to order|own design|special design)\b/.test(query)) {
      addMessage("The site says custom designs can be made to a customer’s wishes. Share the design, size, and product you have in mind with our team on WhatsApp to discuss feasibility and pricing.", "bot");
      addWhatsAppLink();
      return;
    }

    if (/\b(track|tracking|order status|where is my order|where's my order|order update|cancel|cancellation)\b/.test(query)) {
      addMessage("I can’t access individual order or delivery records here. Contact our team on WhatsApp with your booking name and product details for an update or cancellation help.", "bot");
      addWhatsAppLink();
      return;
    }

    if (/\b(interest|late payment|late fee|overdue)\b/.test(query)) {
      addMessage("The booking terms state that interest of 24% per annum will be charged if the bill is not paid within seven days. Please confirm how this applies to your order with our team.", "bot");
      return;
    }

    if (/\b(payment|pay|paid|advance|deposit|upi|cash|card|installment|instalment)\b/.test(query)) {
      addMessage("The booking terms state that a 40% advance of the product price is required to initiate a booking. Payment options and any balance-payment details aren’t listed here, so please confirm them with our team.", "bot");
      addWhatsAppLink();
      return;
    }

    if (/\b(book|booking|order|purchase|buy)\b/.test(query)) {
      const requestedProducts = findProducts(query);
      if (requestedProducts.length) {
        showProducts(requestedProducts, "Here are matching products. Choose “View & book” on the item you want:");
        return;
      }
      addMessage("To book, open a product and choose “View & book” to fill in the booking form. The listed terms require a 40% advance to initiate the booking. Contact us on WhatsApp if you need help.", "bot");
      addWhatsAppLink();
      return;
    }

    if (/\b(size|dimension|dimensions|measurement|measurements|material|wood type|color|colour|finish|weight)\b/.test(query)) {
      const products = findProducts(query);
      addMessage("Product dimensions, materials, and finish details aren’t consistently listed in the catalog. Open a matching item below for its available details, or ask our team to confirm specifics.", "bot");
      if (products.length) addProductLinks(products);
      addWhatsAppLink();
      return;
    }

    if (/\b(stock|available|availability|in stock|ready to ship)\b/.test(query)) {
      const products = findProducts(query);
      addMessage("I can’t check live stock or made-to-order timelines. Contact our team to confirm availability for the item you want.", "bot");
      if (products.length) addProductLinks(products);
      addWhatsAppLink();
      return;
    }

    if (/\b(login|log in|sign in|register|registration|account|password)\b/.test(query)) {
      addMessage("You can use the Login or Registration options in the site navigation. If you’re having trouble accessing your account, contact our team for help.", "bot");
      addWhatsAppLink();
      return;
    }

    if (/\b(opening hours|hours|location|address|visit|directions|where are you|factory)\b/.test(query)) {
      addMessage("Our listed address is Indira Nagar, Sangariya, Jodhpur, Rajasthan. Visiting hours aren’t listed, so please contact our team before planning a visit.", "bot");
      addLocationLink();
      addWhatsAppLink();
      return;
    }

    if (/\b(about|who are you|who is vishwakarma|company|manufacturer|founder|ceo)\b/.test(query)) {
      addMessage("Vishwakarma Art manufactures and supplies handicraft and wooden furniture items, offers home delivery and online booking, and accepts custom design requests. The site lists Mr. Sudhir Vishwakarma as Founder/CEO.", "bot");
      return;
    }

    if (/\b(warranty|guarantee|care|clean|maintenance|durability)\b/.test(query)) {
      addMessage("Warranty and care instructions aren’t specified in the catalog. Ask our team about the particular item before ordering.", "bot");
      addWhatsAppLink();
      return;
    }

    if (/\b(price|prices|cost|costs|how much)\b/.test(query) && !findProducts(query).length) {
      addMessage("I can look up prices for items listed in the catalog. Which product or collection are you interested in?", "bot");
      return;
    }

    const products = findProducts(query);
    if (showProducts(products, "Here are some matching products from our catalog:")) return;

    if (/^(help|what can you do|what can i ask)\??$/.test(query)) {
      addMessage("Ask me to find a product or price, browse collections, or explain booking, payment terms, delivery, returns, custom designs, or how to contact us. I’ll let you know when a detail isn’t available here.", "bot");
      return;
    }

    addMessage("I don’t have that information in the catalog yet. You can ask about products, prices, collections, booking, delivery, returns, or custom designs—or contact our team for help.", "bot");
    addWhatsAppLink();
  }

  launcher.addEventListener("click", () => toggleAssistant(panel.hidden));
  panel.querySelector(".site-assistant__close").addEventListener("click", () => toggleAssistant(false));
  panel.querySelectorAll("[data-assistant-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      const question = button.dataset.assistantPrompt;
      addMessage(question, "user");
      respond(question);
      messages.scrollTop = messages.scrollHeight;
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    addMessage(question, "user");
    input.value = "";
    respond(question);
    messages.scrollTop = messages.scrollHeight;
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) toggleAssistant(false);
  });
})();
