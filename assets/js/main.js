(() => {
  "use strict";

  const config = window.SITE_CONFIG;
  const translations = window.SITE_COPY;
  if (!config || !translations) {
    throw new Error("Site configuration or translations failed to load.");
  }

  const supportedLanguages = ["en", "id"];
  const pageKey = document.body.dataset.page || "home";
  const storageKeys = { language: "studio-language" };
  const byId = (id) => document.getElementById(id);
  let language = getSavedLanguage();
  let activeProjectFilter = "all";
  let activeServiceFilter = "all";
  let projectDialog;
  let projectDialogTrigger;

  function getSavedLanguage() {
    try {
      const saved = localStorage.getItem(storageKeys.language);
      return supportedLanguages.includes(saved) ? saved : "en";
    } catch (error) {
      console.warn("Language preference could not be read from browser storage.", error);
      return "en";
    }
  }

  function savePreference(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Preference "${key}" could not be saved in browser storage.`, error);
    }
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
    return `./kontak.html?${params.toString()}`;
  }

  function findService(id) {
    return config.services.find((item) => item.id === id);
  }

  function findPrice(serviceId) {
    return config.pricing.find((item) => item.serviceId === serviceId);
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
    return `<article class="service-card" data-service-card data-category="${escapeHtml(service.category)}">
      <div class="service-card__topline">
        <span class="tag">${escapeHtml(service.category === "video" ? t("portfolio.filterVideo") : t("portfolio.filterPhoto"))}</span>
        <span class="service-card__id">${escapeHtml(service.id)}</span>
      </div>
      <h2>${escapeHtml(text(service.name))}</h2>
      <p class="service-card__summary">${escapeHtml(text(service.summary))}</p>
      <p class="service-card__suitable"><strong>${escapeHtml(t("services.suitableFor"))}:</strong> ${escapeHtml(text(service.suitableFor))}</p>
      <div class="service-card__details">
        <h3>${escapeHtml(t("services.included"))}</h3>
        <ul>${included}</ul>
        <p><strong>${escapeHtml(t("services.delivery"))}:</strong> ${escapeHtml(text(service.delivery))}</p>
        <p><strong>${escapeHtml(t("services.revisions"))}:</strong> ${escapeHtml(text(service.revisions))}</p>
      </div>
      <div class="service-card__estimate">
        <div><span class="estimate-label">${escapeHtml(t("services.priceHeading"))}</span>${displayPrice}</div>
        <p>${escapeHtml(priceExplanation)}</p>
      </div>
      <a class="button button--small button--primary" href="${escapeHtml(orderUrl("service", service.id))}">${escapeHtml(t("global.order"))} <span aria-hidden="true">↗</span></a>
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
    const email = String(config.contact.email || "").trim();
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

  function applyLanguage() {
    translateStaticContent();
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
  }

  function updateFormChoices() {
    const params = new URLSearchParams(window.location.search);
    const selectedService = params.get("service");
    const selectedPackage = params.get("package");
    const serviceSelect = byId("service-type");
    const packageSelect = byId("package-type");
    if (serviceSelect && selectedService && findService(selectedService)) serviceSelect.value = selectedService;
    if (packageSelect) {
      packageSelect.innerHTML = `<option value="">${escapeHtml(t("form.packagePlaceholder"))}</option>` +
        config.packages.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(text(item.name))}</option>`).join("");
      if (selectedPackage && config.packages.some((item) => item.id === selectedPackage)) {
        packageSelect.value = selectedPackage;
        const packageItem = config.packages.find((item) => item.id === selectedPackage);
        if (serviceSelect && packageItem) serviceSelect.value = packageItem.serviceId;
      }
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
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && projectDialog.open) {
        event.preventDefault();
        closeProjectDialog();
      }
    });
    projectDialog.querySelector("[data-dialog-close]")?.addEventListener("click", closeProjectDialog);
  }

  function closeProjectDialog() {
    if (!projectDialog?.open) return;
    projectDialog.close();
    projectDialogTrigger?.setAttribute("aria-expanded", "false");
    projectDialogTrigger?.focus({ preventScroll: true });
    projectDialogTrigger = null;
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
    if (typeof projectDialog.showModal === "function") projectDialog.showModal();
  }

  function setupFilters() {
    document.addEventListener("click", (event) => {
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

  function setupContactForm() {
    const form = byId("inquiry-form");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = byId("form-status");
      const formData = new FormData(form);
      const values = Object.fromEntries(formData.entries());
      if (!form.reportValidity()) {
        if (status) status.textContent = t("form.statusRequired");
        return;
      }

      const service = findService(String(values.service || ""));
      const packageItem = config.packages.find((item) => item.id === String(values.package || ""));
      const message = [
        `Project brief — ${text(config.businessName)}`,
        `Name: ${String(values.name || "").trim()}`,
        `Service: ${service ? text(service.name) : String(values.service || "")}`,
        packageItem ? `Package: ${text(packageItem.name)}` : "",
        `Platform / output: ${String(values.output || "").trim()}`,
        values.deadline ? `Target timing: ${String(values.deadline).trim()}` : "",
        `Details: ${String(values.description || "").trim()}`,
        values.reference ? `Reference: ${String(values.reference).trim()}` : ""
      ].filter(Boolean).join("\n");
      const whatsappNumber = String(config.contact.whatsappNumber || "").replace(/\D/g, "");
      const validWhatsapp = /^\d{8,15}$/.test(whatsappNumber);
      const email = String(config.contact.email || "").trim();
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (validWhatsapp) {
        window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        if (status) status.textContent = t("form.usingWhatsapp");
      } else if (validEmail) {
        window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Project brief")}&body=${encodeURIComponent(message)}`;
        if (status) status.textContent = t("form.usingEmail");
      } else if (status) {
        status.textContent = t("form.noContact");
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

  function init() {
    ensureProjectDialog();
    setupFilters();
    setupContactForm();
    setupMobileMenu();
    applyLanguage();
  }

  init();
})();
