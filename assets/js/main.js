(() => {
  "use strict";

  const config = window.SITE_CONFIG;
  const translations = window.SITE_COPY;
  if (!config || !translations) {
    throw new Error("Site configuration or translations failed to load.");
  }

  const supportedLanguages = ["en", "id"];
  const pageKey = document.body.dataset.page || "home";
  const storageKeys = { language: "studio-language", cart: "studio-order-cart" };
  const cartDataVersion = 1;
  const byId = (id) => document.getElementById(id);
  let language = getSavedLanguage();
  let activeProjectFilter = "all";
  let activeServiceFilter = "all";
  let projectDialog;
  let projectDialogTrigger;
  let projectDialogAnimation;
  let orderCart = loadOrderCart();
  let descriptionWasEdited = false;
  let cartStatusRegion;
  let cartToastTimeout;
  let requestConfirmationDialog;
  let confirmedRequestAction;

  function getSavedLanguage() {
    try {
      const saved = localStorage.getItem(storageKeys.language);
      if (supportedLanguages.includes(saved)) return saved;
    } catch (error) {
      console.warn("Language preference could not be read from browser storage.", error);
    }
    const documentLanguage = document.documentElement.lang.toLowerCase().split("-")[0];
    return supportedLanguages.includes(documentLanguage) ? documentLanguage : "en";
  }

  function savePreference(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Preference "${key}" could not be saved in browser storage.`, error);
    }
  }

  function loadOrderCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKeys.cart) || "[]");
      const entries = Array.isArray(saved) ? saved : saved && saved.version === cartDataVersion ? saved.items : null;
      if (!Array.isArray(entries)) throw new TypeError("Saved order list has an unsupported format.");
      return normalizeOrderCart(entries);
    } catch (error) {
      console.warn("Saved request list could not be read; starting with an empty list.", error);
      return [];
    }
  }

  function normalizeOrderCart(entries) {
    const normalized = [];
    entries.forEach((item) => {
      if (!item || !["service", "package"].includes(item.kind) ||
        typeof item.id !== "string" || !Number.isInteger(item.quantity) ||
        item.quantity < 1 || item.quantity > 20) return;
      const knownItem = item.kind === "service"
        ? config.services.some((service) => service.id === item.id)
        : config.packages.some((packageItem) => packageItem.id === item.id);
      if (!knownItem) return;

      const existing = normalized.find((entry) => entry.kind === item.kind && entry.id === item.id);
      if (existing) existing.quantity = Math.min(20, existing.quantity + item.quantity);
      else normalized.push({ kind: item.kind, id: item.id, quantity: item.quantity });
    });
    return normalized;
  }

  function announceCartStatus(message) {
    if (cartStatusRegion) {
      cartStatusRegion.textContent = message;
      cartStatusRegion.hidden = !message;
      clearTimeout(cartToastTimeout);
      if (message) {
        cartToastTimeout = setTimeout(() => {
          cartStatusRegion.hidden = true;
        }, 6000);
      }
    }
    document.querySelectorAll("#cart-feedback-status").forEach((status) => {
      status.textContent = message;
    });
  }

  function saveOrderCart() {
    try {
      localStorage.setItem(storageKeys.cart, JSON.stringify({
        version: cartDataVersion,
        items: orderCart
      }));
      announceCartStatus("");
      renderOrderCart();
      return true;
    } catch (error) {
      console.warn("Request list could not be saved in browser storage.", error);
      announceCartStatus(t("cart.notSaved"));
      renderOrderCart();
      return false;
    }
  }

  function setupOrderCartSync() {
    cartStatusRegion = document.createElement("p");
    cartStatusRegion.className = "cart-toast";
    cartStatusRegion.dataset.cartGlobalStatus = "";
    cartStatusRegion.setAttribute("role", "status");
    cartStatusRegion.setAttribute("aria-live", "polite");
    cartStatusRegion.hidden = true;
    document.body.append(cartStatusRegion);

    window.addEventListener("storage", (event) => {
      if (event.key !== storageKeys.cart && event.key !== null) return;
      if (event.key === null || event.newValue === null) {
        orderCart = [];
      } else {
        try {
          const saved = JSON.parse(event.newValue);
          const entries = Array.isArray(saved)
            ? saved
            : saved && saved.version === cartDataVersion ? saved.items : null;
          if (!Array.isArray(entries)) throw new TypeError("Saved request list has an unsupported format.");
          orderCart = normalizeOrderCart(entries);
        } catch (error) {
          console.warn("Request list changes from another tab could not be read.", error);
          announceCartStatus(t("cart.syncFailed"));
          return;
        }
      }
      renderOrderCart();
      announceCartStatus(t("cart.synced"));
    });
  }

  function text(value) {
    if (value && typeof value === "object") {
      return value[language] || value.en || "";
    }
    return value == null ? "" : String(value);
  }

  function t(key) {
    const value = translations[language][key];
    if (value === undefined) {
      console.error(`Missing "${language}" translation for "${key}".`);
      return key;
    }
    return value;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function safeUrl(value) {
    if (value == null) return "";
    const normalized = String(value).trim();
    if (!normalized) return "";
    try {
      const url = new URL(normalized);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  function orderUrl(kind, id) {
    const params = new URLSearchParams();
    params.set(kind, id);
    params.set("lang", language);
    const service = kind === "service"
      ? findService(id)
      : config.services.find((item) => item.id === config.packages.find((packageItem) => packageItem.id === id)?.serviceId);
    const packageItem = kind === "package" ? config.packages.find((item) => item.id === id) : null;
    const description = [packageItem && text(packageItem.summary), service && text(service.summary)].filter(Boolean).join("\n");
    if (description) params.set("description", description);
    return `./kontak.html?${params.toString()}`;
  }

  function findService(id) {
    return config.services.find((item) => item.id === id);
  }

  function findPrice(serviceId) {
    return config.pricing.find((item) => item.serviceId === serviceId);
  }

  function getCartItem(entry) {
    return entry.kind === "service"
      ? findService(entry.id)
      : config.packages.find((item) => item.id === entry.id);
  }

  function getCartItemName(entry) {
    const item = getCartItem(entry);
    return item ? text(item.name) : "";
  }

  function renderOrderCart() {
    document.querySelectorAll("[data-order-cart]").forEach((container) => {
      if (!orderCart.length) {
        container.innerHTML = `<p>${escapeHtml(t("cart.empty"))}</p>`;
        return;
      }

      container.innerHTML = `<ul class="order-cart__items">${orderCart.map((entry) => `
        <li class="order-cart__item">
          <div><strong>${escapeHtml(getCartItemName(entry))}</strong><span>${escapeHtml(t(`cart.${entry.kind}`))}</span></div>
          <div class="order-cart__controls" aria-label="${escapeHtml(t("cart.quantity"))}">
            <button type="button" data-cart-action="decrease" data-cart-kind="${escapeHtml(entry.kind)}" data-cart-id="${escapeHtml(entry.id)}" aria-label="${escapeHtml(t("cart.decrease"))}">−</button>
            <span>${entry.quantity}</span>
            <button type="button" data-cart-action="increase" data-cart-kind="${escapeHtml(entry.kind)}" data-cart-id="${escapeHtml(entry.id)}" aria-label="${escapeHtml(t("cart.increase"))}">+</button>
            <button type="button" data-cart-action="remove" data-cart-kind="${escapeHtml(entry.kind)}" data-cart-id="${escapeHtml(entry.id)}">${escapeHtml(t("cart.remove"))}</button>
          </div>
        </li>`).join("")}</ul>
        <div class="order-cart__footer">
          <p>${escapeHtml(t("cart.note"))}</p>
          <button type="button" class="button" data-cart-action="clear">${escapeHtml(t("cart.clear"))}</button>
          <a class="button button--primary" href="./kontak.html#inquiry-form">${escapeHtml(t("cart.goToBrief"))}</a>
        </div>`;
    });

    document.querySelectorAll("[data-cart-count]").forEach((node) => {
      node.textContent = String(orderCart.reduce((total, item) => total + item.quantity, 0));
      node.hidden = orderCart.length === 0;
    });
    renderCartNavigation();
  }

  function renderCartNavigation() {
    const count = orderCart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll(".nav-tools").forEach((tools) => {
      let link = tools.querySelector("[data-cart-nav]");
      if (!link) {
        link = document.createElement("a");
        link.className = "nav-cart";
        link.dataset.cartNav = "";
        link.href = "./paket.html#request-list";
        const orderButton = tools.querySelector(".nav-cta");
        tools.insertBefore(link, orderButton || null);
      }
      link.innerHTML = `<svg class="cart-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L22 9H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg><span>${escapeHtml(t("cart.nav"))}${count ? ` (${count})` : ""}</span>`;
      link.setAttribute("aria-label", `${t("cart.title")}: ${count}`);
      link.hidden = count === 0;
    });
  }

  function confirmRequest(message, action) {
    if (!requestConfirmationDialog) {
      requestConfirmationDialog = document.createElement("dialog");
      requestConfirmationDialog.className = "request-confirmation";
      requestConfirmationDialog.setAttribute("aria-labelledby", "request-confirmation-title");
      requestConfirmationDialog.innerHTML = `<form method="dialog">
        <h2 id="request-confirmation-title"></h2>
        <p data-confirmation-message></p>
        <div class="request-confirmation__actions">
          <button type="submit" class="button" value="cancel" data-confirmation-cancel></button>
          <button type="submit" class="button button--primary" value="confirm" data-confirmation-accept></button>
        </div>
      </form>`;
      requestConfirmationDialog.addEventListener("close", () => {
        const shouldContinue = requestConfirmationDialog.returnValue === "confirm";
        const nextAction = confirmedRequestAction;
        confirmedRequestAction = null;
        if (shouldContinue) nextAction?.();
      });
      document.body.append(requestConfirmationDialog);
    }

    requestConfirmationDialog.querySelector("#request-confirmation-title").textContent = t("cart.confirmTitle");
    requestConfirmationDialog.querySelector("[data-confirmation-message]").textContent = message;
    requestConfirmationDialog.querySelector("[data-confirmation-cancel]").textContent = t("cart.cancel");
    requestConfirmationDialog.querySelector("[data-confirmation-accept]").textContent = t("cart.confirm");
    confirmedRequestAction = action;
    if (typeof requestConfirmationDialog.showModal === "function") {
      requestConfirmationDialog.showModal();
    } else if (window.confirm(`${t("cart.confirmTitle")}\n\n${message}`)) {
      const nextAction = confirmedRequestAction;
      confirmedRequestAction = null;
      nextAction?.();
    } else {
      confirmedRequestAction = null;
    }
  }

  function addToOrderCart(kind, id) {
    const exists = kind === "service" ? findService(id) : config.packages.find((item) => item.id === id);
    if (!exists) {
      announceCartStatus(t("cart.invalidItem"));
      return;
    }
    const entry = orderCart.find((item) => item.kind === kind && item.id === id);
    if (entry && entry.quantity >= 20) {
      announceCartStatus(t("cart.limit"));
      return;
    }
    confirmRequest(t("cart.confirmAdd").replace("{item}", text(exists.name)), () => {
      if (entry) entry.quantity += 1;
      else orderCart.push({ kind, id, quantity: 1 });
      if (saveOrderCart()) announceCartStatus(t("cart.added"));
    });
  }

  function updateOrderCart(action, kind, id) {
    if (action === "clear") {
      confirmRequest(t("cart.confirmClear"), () => {
        orderCart = [];
        if (saveOrderCart()) announceCartStatus(t("cart.cleared"));
      });
      return;
    } else {
      const entryIndex = orderCart.findIndex((item) => item.kind === kind && item.id === id);
      if (entryIndex < 0) return;
      if (action === "remove" || (action === "decrease" && orderCart[entryIndex].quantity === 1)) {
        orderCart.splice(entryIndex, 1);
      } else if (action === "increase" && orderCart[entryIndex].quantity < 20) {
        orderCart[entryIndex].quantity += 1;
      } else if (action === "increase") {
        announceCartStatus(t("cart.limit"));
        return;
      } else if (action === "decrease") {
        orderCart[entryIndex].quantity -= 1;
      } else {
        return;
      }
    }
    if (saveOrderCart()) {
      announceCartStatus(t(action === "clear" ? "cart.cleared" : "cart.updated"));
    }
  }

  function getCartBriefLines() {
    return orderCart.map((entry) =>
      `${entry.quantity} × ${getCartItemName(entry)} (${t(`cart.${entry.kind}`)})`
    ).filter(Boolean);
  }

  function renderPrice(price) {
    if (!price) {
      return `<span class="estimate-value">${escapeHtml(t("services.noPrice"))}</span>`;
    }
    if (price.customQuote) {
      return `<span class="estimate-value">${escapeHtml(t("packages.customQuote"))}</span>`;
    }
    return `<span class="estimate-value">${escapeHtml(text(price.price))}</span>
      <span class="estimate-unit">${escapeHtml(text(price.unit))}</span>`;
  }

  function renderServiceCard(service) {
    const price = findPrice(service.id);
    const includeItems = Array.isArray(service.included) ? service.included : [service.included];
    const included = includeItems.map((item) => `<li>${escapeHtml(text(item))}</li>`).join("");
    const displayPrice = price && !price.customQuote ? renderPrice(price) : renderPrice(price);
    const priceExplanation = price ? text(price.includes) : t("services.priceNote");
    const bringMarkup = service.bring ? `<p><strong>${escapeHtml(t("services.bring"))}:</strong> ${escapeHtml(text(service.bring))}</p>` : "";
    return `<article class="service-card" data-service-card data-category="${escapeHtml(service.category)}">
      <div class="service-card__topline">
        <span class="tag">${escapeHtml(service.category === "video" ? t("portfolio.filterVideo") : t("portfolio.filterPhoto"))}</span>
      </div>
      <h2>${escapeHtml(text(service.name))}</h2>
      <p class="service-card__summary">${escapeHtml(text(service.summary))}</p>
      <p class="service-card__suitable"><strong>${escapeHtml(t("services.suitableFor"))}:</strong> ${escapeHtml(text(service.suitableFor))}</p>
      <div class="service-card__details">
        <h3>${escapeHtml(t("services.included"))}</h3>
        <ul>${included}</ul>
        <p><strong>${escapeHtml(t("services.delivery"))}:</strong> ${escapeHtml(text(service.delivery))}</p>
        <p><strong>${escapeHtml(t("services.revisions"))}:</strong> ${escapeHtml(text(service.revisions))}</p>
        ${bringMarkup}
      </div>
      <div class="service-card__estimate">
        <div><span class="estimate-label">${escapeHtml(t("services.priceHeading"))}</span>${displayPrice}</div>
        <p>${escapeHtml(priceExplanation)}</p>
      </div>
      <button class="button button--small" type="button" data-cart-add="service" data-cart-id="${escapeHtml(service.id)}">${escapeHtml(t("cart.addService"))}</button>
      <a class="button button--small button--primary" href="${escapeHtml(orderUrl("service", service.id))}">${escapeHtml(t("global.order"))}</a>
    </article>`;
  }

  function renderServices() {
    document.querySelectorAll("[data-services]").forEach((container) => {
      container.innerHTML = config.services.map(renderServiceCard).join("");
    });

    document.querySelectorAll("[data-services-preview]").forEach((container) => {
      const selected = ["video-pendek", "video-promosi", "foto-warna", "foto-retouch"]
        .map(findService)
        .filter(Boolean);
      container.innerHTML = selected.map((service) => {
        const price = findPrice(service.id);
        return `<article class="service-card service-card--preview">
          <span class="tag">${escapeHtml(service.category === "video" ? t("portfolio.filterVideo") : t("portfolio.filterPhoto"))}</span>
          <h3>${escapeHtml(text(service.name))}</h3>
          <p>${escapeHtml(text(service.summary))}</p>
          <div class="service-card__preview-price">${price ? renderPrice(price) : ""}</div>
          <button class="button button--small" type="button" data-cart-add="service" data-cart-id="${escapeHtml(service.id)}">${escapeHtml(t("cart.addService"))}</button>
          <a class="text-link" href="${escapeHtml(orderUrl("service", service.id))}">${escapeHtml(t("global.learnMore"))} <span aria-hidden="true">↗</span></a>
        </article>`;
      }).join("");
    });

    updateServiceFilter();
    renderServiceSelect();
  }

  function renderPackageCard(item, compact = false) {
    const includeItems = Array.isArray(item.includes) ? item.includes : [item.includes];
    const included = includeItems.map((line) => `<li>${escapeHtml(text(line))}</li>`).join("");
    const service = findService(item.serviceId);
    return `<article class="package-card${item.featured ? " package-card--featured" : ""}${compact ? " package-card--compact" : ""}">
      <div class="package-card__head">
        <span class="tag">${escapeHtml(t("global.samplePrice"))}</span>
        <h2>${escapeHtml(text(item.name))}</h2>
        <p>${escapeHtml(text(item.summary))}</p>
      </div>
      <div class="package-card__price">
        <span class="estimate-label">${escapeHtml(t("packages.priceLabel"))}</span>
        <strong>${escapeHtml(text(item.price))}</strong>
        <span>${escapeHtml(t("packages.unit"))}</span>
      </div>
      <div class="package-card__details">
        <h3>${escapeHtml(t("packages.includes"))}</h3>
        <ul>${included}</ul>
      </div>
      <p class="package-card__service">${service ? `${escapeHtml(t("services.suitableFor"))}: ${escapeHtml(text(service.name))}` : ""}</p>
      <button class="button${compact ? " button--small" : ""}" type="button" data-cart-add="package" data-cart-id="${escapeHtml(item.id)}">${escapeHtml(t("cart.addPackage"))}</button>
      <a class="button button--primary${compact ? " button--small" : ""}" href="${escapeHtml(orderUrl("package", item.id))}">${escapeHtml(t("global.orderPackage"))} <span aria-hidden="true">↗</span></a>
    </article>`;
  }

  function renderPackages() {
    document.querySelectorAll("[data-packages]").forEach((container) => {
      container.innerHTML = config.packages.map((item) => renderPackageCard(item)).join("");
    });
    document.querySelectorAll("[data-packages-preview]").forEach((container) => {
      container.innerHTML = config.packages.map((item) => renderPackageCard(item, true)).join("");
    });
    document.querySelectorAll("[data-pricing-list]").forEach((container) => {
      container.innerHTML = config.pricing.map((price) => {
        const service = findService(price.serviceId);
        if (!service) return "";
        const estimate = price.customQuote
          ? `<strong>${escapeHtml(t("packages.customQuote"))}</strong><span>${escapeHtml(t("packages.customQuoteText"))}</span>`
          : `<strong>${escapeHtml(text(price.price))}</strong><span>${escapeHtml(text(price.unit))}</span>`;
        return `<article class="estimate-row">
          <div><h3>${escapeHtml(text(service.name))}</h3><p>${escapeHtml(text(price.includes))}</p></div>
          <div class="estimate-row__price">${estimate}</div>
          <button class="button button--small" type="button" data-cart-add="service" data-cart-id="${escapeHtml(service.id)}">${escapeHtml(t("cart.addService"))}</button>
          <a class="text-link" href="${escapeHtml(orderUrl("service", service.id))}">${escapeHtml(t("global.order"))} <span aria-hidden="true">↗</span></a>
        </article>`;
      }).join("");
    });
  }

  function projectCard(project) {
    const mediaLabel = project.video ? t("portfolio.hasVideo") : t("portfolio.noVideo");
    return `<article class="project-card" data-project-card data-category="${escapeHtml(project.category)}">
      <button class="project-card__open" type="button" data-project-detail="${escapeHtml(project.id)}" aria-label="${escapeHtml(t("global.viewDetails"))}: ${escapeHtml(text(project.title))}">
        <span class="project-card__image-wrap">
          <img src="${escapeHtml(project.image)}" alt="${escapeHtml(text(project.alt))}" loading="lazy">
          <span class="project-card__badge">${escapeHtml(t("portfolio.sampleBadge"))}</span>
        </span>
        <span class="project-card__content">
          <span class="project-card__meta">${escapeHtml(text(project.output))}</span>
          <strong>${escapeHtml(text(project.title))}</strong>
          <span>${escapeHtml(text(project.description))}</span>
          <span class="project-card__media-note">${escapeHtml(mediaLabel)}</span>
        </span>
      </button>
    </article>`;
  }

  function renderProjects() {
    document.querySelectorAll("[data-projects]").forEach((container) => {
      container.innerHTML = config.portfolio.map(projectCard).join("");
    });
    document.querySelectorAll("[data-featured-projects]").forEach((container) => {
      container.innerHTML = config.portfolio.slice(0, 3).map(projectCard).join("");
    });
    updateProjectFilter();
  }

  function renderFaqs() {
    document.querySelectorAll("[data-faqs]").forEach((container) => {
      container.innerHTML = config.faqs.map((item, index) => `<details class="faq-item"${index === 0 ? " open" : ""}>
        <summary>${escapeHtml(text(item.question))}</summary>
        <div class="faq-item__answer"><p>${escapeHtml(text(item.answer))}</p></div>
      </details>`).join("");
    });
  }

  function renderSocialLinks() {
    const links = config.socialLinks.filter((item) => safeUrl(item.url));
    document.querySelectorAll("[data-social-links]").forEach((container) => {
      container.innerHTML = links.length
        ? links.map((item) => `<a href="${escapeHtml(safeUrl(item.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.label)} <span class="sr-only">(${escapeHtml(t("global.externalLink"))})</span></a>`).join("")
        : `<p>${escapeHtml(t("global.contactOwner"))}</p>`;
    });
  }

  function getConfiguredChannel(type) {
    const configured = config.orderChannels?.find((channel) => channel.type === type)?.value;
    if (configured) return String(configured).trim();
    if (type === "whatsapp") return String(config.contact?.whatsappNumber || "").trim();
    if (type === "email") return String(config.contact?.email || "").trim();
    return "";
  }

  function getAvailableContactChannels() {
    const channels = [];
    const whatsapp = getConfiguredChannel("whatsapp");
    const whatsappDigits = whatsapp.replace(/\D/g, "");
    if (/^[+\d\s()-]+$/.test(whatsapp) && /^(?!0+$)\d{8,15}$/.test(whatsappDigits)) {
      channels.push({ type: "whatsapp", value: whatsappDigits });
    }

    const instagram = getConfiguredChannel("instagram").replace(/^@/, "");
    if (/^[A-Za-z0-9._]{1,30}$/.test(instagram)) {
      channels.push({ type: "instagram", value: instagram });
    }

    const tiktok = getConfiguredChannel("tiktok").replace(/^@/, "");
    if (/^[A-Za-z0-9._]{2,24}$/.test(tiktok)) {
      channels.push({ type: "tiktok", value: tiktok });
    }

    const email = getConfiguredChannel("email");
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      channels.push({ type: "email", value: email });
    }
    return channels;
  }

  function renderProfile() {
    document.querySelectorAll("[data-profile-name]").forEach((node) => { node.textContent = config.ownerName || ""; });
    document.querySelectorAll("[data-profile-role]").forEach((node) => { node.textContent = text(config.ownerRole); });
    document.querySelectorAll("[data-profile-bio]").forEach((node) => { node.textContent = text(config.ownerBio); });
    document.querySelectorAll("[data-business-name]").forEach((node) => { node.textContent = text(config.businessName); });
    document.querySelectorAll("[data-owner-image]").forEach((image) => {
      if (config.ownerImage) image.src = config.ownerImage;
      image.alt = t("profile.imageAlt");
      image.onerror = () => { image.hidden = true; };
    });
    const email = getConfiguredChannel("email");
    document.querySelectorAll("[data-email-link]").forEach((link) => {
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        link.href = `mailto:${email}`;
        link.textContent = email;
        link.hidden = false;
      } else {
        link.hidden = true;
      }
    });
  }

  function renderServiceSelect() {
    const select = byId("service-type");
    if (!select) return;
    const currentValue = select.value;
    select.innerHTML = `<option value="">${escapeHtml(t("form.servicePlaceholder"))}</option>` +
      config.services.map((service) => `<option value="${escapeHtml(service.id)}">${escapeHtml(text(service.name))}</option>`).join("");
    if (config.services.some((service) => service.id === currentValue)) select.value = currentValue;
  }

  function updateServiceFilter() {
    document.querySelectorAll("[data-service-card]").forEach((card) => {
      card.hidden = activeServiceFilter !== "all" && card.dataset.category !== activeServiceFilter;
    });
    document.querySelectorAll("[data-service-filter]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.serviceFilter === activeServiceFilter));
    });
  }

  function updateProjectFilter() {
    document.querySelectorAll("[data-project-card]").forEach((card) => {
      card.hidden = activeProjectFilter !== "all" && card.dataset.category !== activeProjectFilter;
    });
    document.querySelectorAll("[data-project-filter]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.projectFilter === activeProjectFilter));
    });
  }

  function updateMeta() {
    const title = translations[language][`meta.${pageKey}.title`];
    const description = translations[language][`meta.${pageKey}.description`];
    if (title) document.title = title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (descriptionTag && description) descriptionTag.content = description;
    if (ogTitle && title) ogTitle.content = title;
    if (ogDescription && description) ogDescription.content = description;
  }

  function translateStaticContent() {
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
      node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel));
    });
    document.querySelectorAll("[data-i18n-title]").forEach((node) => {
      node.setAttribute("title", t(node.dataset.i18nTitle));
    });
    document.querySelectorAll("[data-i18n-content]").forEach((node) => {
      node.setAttribute("content", t(node.dataset.i18nContent));
    });
    document.querySelectorAll("[data-language-choice]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.languageChoice === language));
    });
    document.documentElement.lang = language;
    updateMeta();
  }

  function renderThemeSettings() {
    document.querySelectorAll(".appearance-menu__panel").forEach((panel) => {
      let settings = panel.querySelector("[data-effect-settings]");
      if (!settings) {
        settings = document.createElement("div");
        settings.className = "appearance-menu__effects";
        settings.dataset.effectSettings = "";
        settings.setAttribute("role", "group");
        settings.innerHTML = `<label class="motion-switch">
          <input class="motion-switch__control" type="checkbox" role="switch" data-motion-choice>
          <span data-motion-label></span>
        </label>
        <label class="motion-switch">
          <input class="motion-switch__control" type="checkbox" role="switch" data-rgb-pulse-choice>
          <span data-rgb-pulse-label></span>
        </label>
        <label class="motion-switch">
          <input class="motion-switch__control" type="checkbox" role="switch" data-sound-choice>
          <span data-sound-label></span>
        </label>
        <div class="ambient-music-control" role="group" data-music-group>
          <span data-music-label></span>
          <button class="ambient-music-toggle" type="button" data-music-toggle aria-pressed="false"></button>
        </div>`;
        panel.append(settings);
      }
      settings.setAttribute("aria-label", t("theme.effects"));
      settings.querySelector("[data-motion-label]").textContent = t("theme.motion");
      settings.querySelector("[data-rgb-pulse-label]").textContent = t("theme.rgbEffect");
      settings.querySelector("[data-sound-label]").textContent = t("theme.soundEffect");
      settings.querySelector("[data-music-label]").textContent = t("theme.ambientMusic");
      settings.querySelector("[data-music-group]").setAttribute("aria-label", t("theme.ambientMusic"));
    });
  }

  function applyLanguage() {
    translateStaticContent();
    renderThemeSettings();
    document.dispatchEvent(new Event("theme-controls-rendered"));
    renderProfile();
    renderServices();
    renderPackages();
    renderProjects();
    renderFaqs();
    renderSocialLinks();
    updateServiceFilter();
    updateProjectFilter();
    updateFormChoices();
    updateProjectDialog();
    renderOrderCart();
  }

  function updateFormChoices() {
    const params = new URLSearchParams(window.location.search);
    const selectedService = params.get("service");
    const selectedPackage = params.get("package");
    const descriptionParam = params.get("description");
    const outputParam = params.get("output");
    const serviceSelect = byId("service-type");
    const packageSelect = byId("package-type");
    const channelSelect = byId("channel-type");
    const description = byId("description");
    const output = byId("output");
    const availableChannels = getAvailableContactChannels();
    if (channelSelect) {
      const currentChannel = channelSelect.value;
      channelSelect.innerHTML = availableChannels.length
        ? availableChannels.map((channel) =>
          `<option value="${escapeHtml(channel.type)}">${escapeHtml(t(`form.channel${channel.type[0].toUpperCase()}${channel.type.slice(1)}`))}</option>`
        ).join("")
        : `<option value="">${escapeHtml(t("form.channelUnavailable"))}</option>`;
      channelSelect.disabled = availableChannels.length === 0;
      if (availableChannels.some((channel) => channel.type === currentChannel)) {
        channelSelect.value = currentChannel;
      } else if (availableChannels.length) {
        channelSelect.value = availableChannels[0].type;
      }
    }
    const submitButton = document.querySelector("#inquiry-form button[type='submit']");
    if (submitButton) submitButton.disabled = availableChannels.length === 0;
    const contactNotice = byId("contact-config-notice");
    if (contactNotice) {
      contactNotice.hidden = availableChannels.length > 0;
      contactNotice.textContent = availableChannels.length ? "" : t("form.noContact");
    }
    const formStatus = byId("form-status");
    if (formStatus && availableChannels.length === 0) formStatus.textContent = t("form.noContact");
    if (serviceSelect && selectedService && findService(selectedService)) serviceSelect.value = selectedService;
    if (packageSelect) {
      packageSelect.innerHTML = `<option value="">${escapeHtml(t("form.packagePlaceholder"))}</option>` +
        config.packages.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(text(item.name))}</option>`).join("");
      if (selectedPackage && config.packages.some((item) => item.id === selectedPackage)) {
        packageSelect.value = selectedPackage;
        const packageItem = config.packages.find((item) => item.id === selectedPackage);
        if (serviceSelect && packageItem) serviceSelect.value = packageItem.serviceId;
        if (description && packageItem && !descriptionWasEdited && !descriptionParam) {
          description.value = text(packageItem.summary);
        }
      }
    }
    if (serviceSelect && !serviceSelect.value && orderCart.length) {
      const first = orderCart[0];
      const item = getCartItem(first);
      serviceSelect.value = first.kind === "service" ? first.id : item?.serviceId || "";
    }
    if (descriptionParam && description && !descriptionWasEdited) description.value = descriptionParam.slice(0, 1200);
    if (outputParam && output && !output.value) output.value = outputParam.slice(0, 100);
    if (description && !description.value && serviceSelect?.value) {
      const selected = findService(serviceSelect.value);
      if (selected) description.value = text(selected.summary);
    }
  }

  function getProject(id) {
    return config.portfolio.find((item) => item.id === id);
  }

  function ensureProjectDialog() {
    projectDialog = byId("project-dialog");
    if (!projectDialog) return;
    projectDialog.addEventListener("click", (event) => {
      if (event.target === projectDialog) closeProjectDialog();
    });
    projectDialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeProjectDialog();
    });
    projectDialog.addEventListener("close", () => {
      projectDialog.dataset.closing = "false";
      projectDialogAnimation = null;
      projectDialogTrigger?.setAttribute("aria-expanded", "false");
      projectDialogTrigger?.focus({ preventScroll: true });
      projectDialogTrigger = null;
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && projectDialog.open) {
        event.preventDefault();
        closeProjectDialog();
      }
    });
    projectDialog.querySelector("[data-dialog-close]")?.addEventListener("click", closeProjectDialog);
  }

  function closeProjectDialog() {
    if (!projectDialog?.open || projectDialog.dataset.closing === "true") return;
    const shouldAnimate = document.documentElement.classList.contains("effects-enabled") &&
      !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches &&
      typeof projectDialog.animate === "function";
    if (!shouldAnimate) {
      projectDialog.close();
      return;
    }

    projectDialog.dataset.closing = "true";
    projectDialogAnimation?.cancel();
    projectDialogAnimation = projectDialog.animate([
      { opacity: 1, transform: "translateY(0) scale(1)" },
      { opacity: 0, transform: "translateY(10px) scale(.98)" }
    ], { duration: 160, easing: "ease-in", fill: "forwards" });
    projectDialogAnimation.onfinish = () => {
      if (projectDialog.open && projectDialog.dataset.closing === "true") projectDialog.close();
    };
  }

  function renderDialogProject(project) {
    if (!projectDialog || !project) return;
    const title = projectDialog.querySelector("[data-dialog-title]");
    const media = projectDialog.querySelector("[data-dialog-media]");
    const description = projectDialog.querySelector("[data-dialog-description]");
    const note = projectDialog.querySelector("[data-dialog-note]");
    const output = projectDialog.querySelector("[data-dialog-output]");
    const order = projectDialog.querySelector("[data-dialog-order]");
    if (title) title.textContent = text(project.title);
    if (description) description.textContent = text(project.description);
    if (output) output.textContent = text(project.output);
    if (note) note.textContent = project.isSample ? t("portfolio.sampleBadge") : "";
    if (order) order.href = orderUrl("service", project.serviceId);
    if (media) {
      let mediaMarkup = `<img src="${escapeHtml(project.image)}" alt="${escapeHtml(text(project.alt))}">`;
      if (project.video) {
        mediaMarkup = `<video controls preload="metadata" poster="${escapeHtml(project.image)}">
          <source src="${escapeHtml(project.video)}" type="video/mp4">
        </video>`;
      } else {
        mediaMarkup += `<p class="project-dialog__media-note">${escapeHtml(t("portfolio.noVideo"))}</p>`;
      }
      if (project.beforeImage) {
        mediaMarkup += `<div class="before-after">
          <figure><img src="${escapeHtml(project.beforeImage)}" alt="${escapeHtml(t("portfolio.before"))}"><figcaption>${escapeHtml(t("portfolio.before"))}</figcaption></figure>
          <figure><img src="${escapeHtml(project.image)}" alt="${escapeHtml(t("portfolio.after"))}"><figcaption>${escapeHtml(t("portfolio.after"))}</figcaption></figure>
        </div>`;
      }
      media.innerHTML = mediaMarkup;
    }
  }

  function updateProjectDialog() {
    if (!projectDialog || !projectDialog.open) return;
    const openButton = document.querySelector("[data-project-detail][aria-expanded='true']");
    if (openButton) renderDialogProject(getProject(openButton.dataset.projectDetail));
  }

  function openProjectDialog(id, trigger) {
    const project = getProject(id);
    if (!project || !projectDialog) return;
    document.querySelectorAll("[data-project-detail]").forEach((button) => button.setAttribute("aria-expanded", "false"));
    projectDialogTrigger = trigger;
    trigger?.setAttribute("aria-expanded", "true");
    renderDialogProject(project);
    if (typeof projectDialog.showModal !== "function") return;
    projectDialogAnimation?.cancel();
    projectDialog.dataset.closing = "false";
    projectDialog.showModal();
    const shouldAnimate = document.documentElement.classList.contains("effects-enabled") &&
      !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches &&
      typeof projectDialog.animate === "function";
    if (shouldAnimate) {
      projectDialogAnimation = projectDialog.animate([
        { opacity: 0, transform: "translateY(14px) scale(.98)" },
        { opacity: 1, transform: "translateY(0) scale(1)" }
      ], { duration: 220, easing: "cubic-bezier(.2,.8,.2,1)" });
    }
    projectDialog.querySelector("[data-dialog-close]")?.focus({ preventScroll: true });
  }

  function setupFilters() {
    document.addEventListener("click", (event) => {
      const addCartButton = event.target.closest("[data-cart-add]");
      if (addCartButton) {
        addToOrderCart(addCartButton.dataset.cartAdd, addCartButton.dataset.cartId);
        return;
      }

      const orderLink = event.target.closest('a[href*="kontak.html?service="], a[href*="kontak.html?package="]');
      if (orderLink) {
        const destination = new URL(orderLink.href, window.location.href);
        const kind = destination.searchParams.has("service") ? "service" : "package";
        const id = destination.searchParams.get(kind);
        const item = kind === "service"
          ? findService(id)
          : config.packages.find((packageItem) => packageItem.id === id);
        if (destination.origin === window.location.origin && item) {
          event.preventDefault();
          confirmRequest(
            t("cart.confirmContinue").replace("{item}", text(item.name)),
            () => { window.location.href = destination.href; }
          );
          return;
        }
      }

      const cartButton = event.target.closest("[data-cart-action]");
      if (cartButton) {
        updateOrderCart(cartButton.dataset.cartAction, cartButton.dataset.cartKind, cartButton.dataset.cartId);
        return;
      }

      const copyButton = event.target.closest("[data-copy-prepared-message]");
      if (copyButton) {
        const message = byId(copyButton.dataset.copyPreparedMessage);
        const status = byId(copyButton.dataset.copyStatus);
        if (!message) return;
        message.focus();
        message.select();
        copyBrief(message.value).then((copied) => {
          if (status) status.textContent = t(copied ? "form.copySuccess" : "form.copySelect");
          if (!copied) message.select();
        });
        return;
      }

      const languageButton = event.target.closest("[data-language-choice]");
      if (languageButton) {
        const chosen = languageButton.dataset.languageChoice;
        if (supportedLanguages.includes(chosen)) {
          language = chosen;
          savePreference(storageKeys.language, language);
          applyLanguage();
        }
        return;
      }

      const projectFilter = event.target.closest("[data-project-filter]");
      if (projectFilter) {
        activeProjectFilter = projectFilter.dataset.projectFilter;
        updateProjectFilter();
        return;
      }

      const serviceFilter = event.target.closest("[data-service-filter]");
      if (serviceFilter) {
        activeServiceFilter = serviceFilter.dataset.serviceFilter;
        updateServiceFilter();
        return;
      }

      const projectButton = event.target.closest("[data-project-detail]");
      if (projectButton) openProjectDialog(projectButton.dataset.projectDetail, projectButton);
    });
  }

  async function copyBrief(message) {
    if (!navigator.clipboard?.writeText) return false;
    let timeoutId;
    try {
      const result = await Promise.race([
        navigator.clipboard.writeText(message).then(
          () => "copied",
          (error) => {
            console.warn("Project brief could not be copied to the clipboard.", error);
            return "failed";
          }
        ),
        new Promise((resolve) => {
          timeoutId = setTimeout(() => resolve("timeout"), 1500);
        })
      ]);
      if (result === "timeout") {
        console.warn("Clipboard copy timed out; showing the manual-copy option.");
      }
      return result === "copied";
    } catch (error) {
      console.warn("Project brief could not be copied to the clipboard.", error);
      return false;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function setupContactForm() {
    const form = byId("inquiry-form");
    if (!form) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const status = byId("form-status");
      const manualCopy = byId("prepared-message");
      const channelLink = byId("contact-channel-link");
      const copyButton = byId("copy-prepared-message");
      const formData = new FormData(form);
      const values = Object.fromEntries(formData.entries());
      if (manualCopy) manualCopy.hidden = true;
      if (channelLink) channelLink.hidden = true;
      if (copyButton) copyButton.hidden = true;
      if (!form.reportValidity()) {
        if (status) status.textContent = t("form.statusRequired");
        return;
      }

      const service = findService(String(values.service || ""));
      const packageItem = config.packages.find((item) => item.id === String(values.package || ""));
      const cartLines = getCartBriefLines();

      const isId = language === "id";
      const message = isId ? [
        `Brief proyek — ${text(config.businessName)}`,
        `Nama: ${String(values.name || "").trim()}`,
        `Layanan: ${service ? text(service.name) : String(values.service || "")}`,
        packageItem ? `Paket: ${text(packageItem.name)}` : "",
        cartLines.length ? `Daftar permintaan:\n${cartLines.join("\n")}` : "",
        `Platform / format hasil: ${String(values.output || "").trim()}`,
        values.deadline ? `Target waktu: ${String(values.deadline).trim()}` : "",
        `Detail: ${String(values.description || "").trim()}`,
        values.reference ? `Referensi: ${String(values.reference).trim()}` : ""
      ].filter(Boolean).join("\n") : [
        `Project brief — ${text(config.businessName)}`,
        `Name: ${String(values.name || "").trim()}`,
        `Service: ${service ? text(service.name) : String(values.service || "")}`,
        packageItem ? `Package: ${text(packageItem.name)}` : "",
        cartLines.length ? `Request list:\n${cartLines.join("\n")}` : "",
        `Platform / output: ${String(values.output || "").trim()}`,
        values.deadline ? `Target timing: ${String(values.deadline).trim()}` : "",
        `Details: ${String(values.description || "").trim()}`,
        values.reference ? `Reference: ${String(values.reference).trim()}` : ""
      ].filter(Boolean).join("\n");

      const channel = String(values.channel || "whatsapp").toLowerCase();
      const destination = getAvailableContactChannels().find((item) => item.type === channel);
      if (!destination) {
        if (status) status.textContent = t("form.noContact");
        return;
      }

      if (channel === "instagram" || channel === "tiktok") {
        const destinationUrl = channel === "instagram"
          ? `https://ig.me/m/${encodeURIComponent(destination.value)}`
          : `https://www.tiktok.com/@${encodeURIComponent(destination.value)}`;
        if (manualCopy) {
          manualCopy.value = message;
          manualCopy.hidden = false;
        }
        if (copyButton) copyButton.hidden = false;
        if (channelLink) {
          channelLink.href = destinationUrl;
          channelLink.textContent = t(channel === "instagram" ? "form.openInstagram" : "form.openTiktok");
          channelLink.hidden = false;
        }
        if (status) status.textContent = t("form.preparedForCopy");
        return;
      }

      if (channel === "email") {
        window.location.href = `mailto:${encodeURIComponent(destination.value)}?subject=${encodeURIComponent(isId ? "Brief proyek" : "Project brief")}&body=${encodeURIComponent(message)}`;
        if (status) status.textContent = t("form.usingEmail");
        return;
      }

      if (channel === "whatsapp") {
        window.location.href = `https://wa.me/${destination.value}?text=${encodeURIComponent(message)}`;
        if (status) status.textContent = t("form.usingWhatsapp");
      }
    });

    const description = byId("description");
    if (description) description.addEventListener("input", () => { descriptionWasEdited = true; });
    const serviceSelect = byId("service-type");
    if (serviceSelect && description) {
      serviceSelect.addEventListener("change", () => {
        if (descriptionWasEdited) return;
        const service = findService(serviceSelect.value);
        if (service) description.value = text(service.summary);
      });
    }
  }

  function setupFeedbackForm() {
    const form = byId("feedback-form");
    if (!form) return;

    const available = getAvailableContactChannels().filter((channel) =>
      ["email", "whatsapp"].includes(channel.type)
    );
    const unavailableNote = form.querySelector("[data-feedback-no-channel]");
    if (unavailableNote) unavailableNote.hidden = available.length > 0;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const details = byId("feedback-details");
      const type = byId("feedback-type");
      const output = byId("feedback-message");
      const status = byId("feedback-status");
      const copyButton = byId("copy-feedback-message");
      const channelLink = byId("feedback-channel-link");
      if (!details || !type || !output || !form.reportValidity()) return;

      const isId = language === "id";
      const message = [
        isId ? `Masukan — ${text(config.businessName)}` : `Feedback — ${text(config.businessName)}`,
        `${isId ? "Jenis" : "Type"}: ${t(type.value === "issue" ? "feedback.issue" : "feedback.suggestion")}`,
        `${isId ? "Pesan" : "Message"}: ${details.value.trim()}`
      ].join("\n");
      output.value = message;
      output.hidden = false;
      if (copyButton) copyButton.hidden = false;

      const destination = available[0];
      if (destination && channelLink) {
        channelLink.href = destination.type === "email"
          ? `mailto:${destination.value}?subject=${encodeURIComponent(isId ? "Masukan situs" : "Website feedback")}&body=${encodeURIComponent(message)}`
          : `https://wa.me/${destination.value}?text=${encodeURIComponent(message)}`;
        channelLink.textContent = t(destination.type === "email" ? "feedback.openEmail" : "feedback.openWhatsapp");
        channelLink.hidden = false;
      }
      if (status) {
        status.textContent = destination ? t("feedback.prepared") : `${t("feedback.prepared")} ${t("feedback.noChannel")}`;
      }
    });
  }

  function setupMobileMenu() {
    document.querySelectorAll(".site-nav details").forEach((details) => {
      details.addEventListener("click", (event) => {
        if (event.target.closest("a")) details.open = false;
      });
      document.addEventListener("click", (event) => {
        if (!details.contains(event.target)) details.open = false;
      });
    });
  }

  function scrollActiveNav() {
    const activeNav = document.querySelector('.site-nav__links a[aria-current="page"]');
    if (activeNav && typeof activeNav.scrollIntoView === "function") {
      activeNav.scrollIntoView({ inline: "center", block: "nearest" });
    }
  }

  function init() {
    setupOrderCartSync();
    ensureProjectDialog();
    setupFilters();
    setupContactForm();
    setupFeedbackForm();
    setupMobileMenu();
    applyLanguage();
    scrollActiveNav();
  }

  init();
})();
