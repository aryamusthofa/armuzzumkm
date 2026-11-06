const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

function loadGlobalScript(file, name) {
  const context = { window: {} };
  vm.runInNewContext(read(file), context, { filename: file });
  return context.window[name];
}

test("root pages declare a supported language and resolve local links", () => {
  const pages = [
    "index.html", "layanan.html", "portfolio.html", "paket.html",
    "proses.html", "tentang.html", "biodata.html", "faq.html", "kontak.html"
  ];

  for (const page of pages) {
    const html = read(page);
    const copy = loadGlobalScript("assets/js/translations.js", "SITE_COPY");
    const language = html.match(/<html\s+lang="([^"]+)"/i)?.[1];
    assert.ok(["en", "id"].includes(language), `${page} must declare en or id`);

    for (const [, reference] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      if (/^(?:[a-z]+:|\/\/|#)/i.test(reference)) continue;
      const localPath = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
      assert.ok(fs.existsSync(path.resolve(path.dirname(path.join(root, page)), localPath)),
        `${page} references missing local file ${reference}`);
    }

    for (const [, key] of html.matchAll(/data-i18n(?:-[a-z-]+)?="([^"]+)"/g)) {
      assert.ok(copy.en[key], `${page} references missing English translation ${key}`);
      assert.ok(copy.id[key], `${page} references missing Indonesian translation ${key}`);
    }
  }
});

test("configured service, package, and project references are consistent", () => {
  const config = loadGlobalScript("assets/js/site-config.js", "SITE_CONFIG");
  const serviceIds = config.services.map((item) => item.id);
  const packageIds = config.packages.map((item) => item.id);
  const projectIds = config.portfolio.map((item) => item.id);

  assert.equal(new Set(serviceIds).size, serviceIds.length, "service IDs must be unique");
  assert.equal(new Set(packageIds).size, packageIds.length, "package IDs must be unique");
  assert.equal(new Set(projectIds).size, projectIds.length, "project IDs must be unique");
  assert.ok(config.packages.every((item) => serviceIds.includes(item.serviceId)));
  assert.ok(config.portfolio.every((item) => serviceIds.includes(item.serviceId)));
  assert.ok(config.portfolio.every((item) => item.isSample === true),
    "concept artwork must remain identified as sample content");
});

test("translations are complete, unique, and the dummy WhatsApp number is not routable", () => {
  const copy = loadGlobalScript("assets/js/translations.js", "SITE_COPY");
  assert.deepEqual(Object.keys(copy.en).sort(), Object.keys(copy.id).sort());
  const translationSource = read("assets/js/translations.js");
  const englishSource = translationSource.match(/  en: \{([\s\S]*?)\n  \},\n  id: \{/)[1];
  const indonesianSource = translationSource.match(/  id: \{([\s\S]*?)\n  }\n};/)[1];
  for (const section of [englishSource, indonesianSource]) {
    const keys = [...section.matchAll(/^\s*"([^"]+)":/gm)].map((match) => match[1]);
    assert.equal(new Set(keys).size, keys.length, "translation keys must not be duplicated");
  }
  for (const [, key] of read("assets/js/main.js").matchAll(/\bt\("([^"]+)"\)/g)) {
    assert.ok(copy.en[key], `missing English translation ${key}`);
    assert.ok(copy.id[key], `missing Indonesian translation ${key}`);
  }
  for (const type of ["Whatsapp", "Instagram", "Tiktok", "Email"]) {
    assert.ok(copy.en[`form.channel${type}`]);
    assert.ok(copy.id[`form.channel${type}`]);
  }

  const config = loadGlobalScript("assets/js/site-config.js", "SITE_CONFIG");
  const whatsapp = config.orderChannels.find((item) => item.type === "whatsapp")?.value;
  assert.equal(whatsapp, "0000000000000", "the configured WhatsApp number must remain an obvious dummy");
  assert.ok(read("assets/js/main.js").includes("^(?!0+$)\\d{8,15}$"),
    "the all-zero placeholder must be rejected by contact-channel validation");
});

test("request list and feedback stay local and use only configured destinations", () => {
  const main = read("assets/js/main.js");
  const contact = read("kontak.html");
  const packages = read("paket.html");
  assert.match(main, /studio-order-cart/);
  assert.match(main, /const cartDataVersion = 1/);
  assert.match(main, /version: cartDataVersion,\s+items: orderCart/);
  assert.match(main, /function normalizeOrderCart\(entries\)/);
  assert.match(main, /Math\.min\(20, existing\.quantity \+ item\.quantity\)/);
  assert.match(main, /window\.addEventListener\("storage"/);
  assert.match(main, /cart\.notSaved/);
  assert.match(main, /function confirmRequest\(message, action\)/);
  assert.match(main, /cart\.confirmAdd/);
  assert.match(main, /cart\.confirmContinue/);
  assert.match(main, /class="cart-icon"/);
  assert.match(main, /item\.quantity > 20/);
  assert.match(main, /data-cart-add="service"/);
  assert.match(main, /data-cart-add="package"/);
  assert.match(main, /Request list:\\n/);
  assert.match(main, /getAvailableContactChannels\(\)\.filter/);
  assert.doesNotMatch(main, /window\.open\(destinationUrl/);
  assert.match(contact, /data-order-cart/);
  assert.match(packages, /data-order-cart/);
  assert.doesNotMatch(contact, /id="feedback-form"/);
  assert.match(contact, /faq\.html#feedback/);
  const faq = read("faq.html");
  assert.match(faq, /id="feedback-form"/);
  assert.match(faq, /data-feedback-no-channel/);
  assert.match(faq, /<details class="feedback-disclosure">/);
});

test("profile examples, reduced-motion controls, and social links remain honest", () => {
  const profile = read("biodata.html");
  const theme = read("assets/js/theme.js");
  const config = loadGlobalScript("assets/js/site-config.js", "SITE_CONFIG");
  assert.match(profile, /profile\.testimonialLabel/);
  assert.match(profile, /profile\.testimonialsNote/);
  assert.match(theme, /let effectsEnabled = false/);
  assert.match(theme, /let rgbPulseEnabled = false/);
  assert.match(theme, /let soundEffectsEnabled = false/);
  assert.match(theme, /studio-sound-effects-enabled/);
  assert.match(theme, /new AudioContextConstructor/);
  assert.match(theme, /function startAmbientMusic\(\)/);
  assert.match(theme, /function stopAmbientMusic\(\)/);
  assert.match(theme, /ambientMusicSource\.src = new URL\("\.\/loficafe\.m4a", document\.baseURI\)\.href/);
  assert.match(theme, /ambientMusicSource\.type = "audio\/mp4"/);
  assert.match(theme, /ambientMusic\.loop = true/);
  assert.match(theme, /ambientMusic\.volume = 0\.22/);
  assert.match(theme, /void startAmbientMusic\(\)/);
  assert.match(theme, /function restoreAmbientMusicPosition\(\)/);
  assert.match(theme, /data-music-toggle/);
  assert.match(theme, /formatMusicTime\(ambientMusic\.duration\)/);
  assert.match(theme, /theme\.musicTapToStart/);
  assert.ok(fs.existsSync(path.join(root, "loficafe.m4a")), "the configured background track must exist");
  assert.ok(fs.statSync(path.join(root, "loficafe.m4a")).size > 0, "the background track must not be empty");
  assert.match(theme, /motion-reveal--visible/);
  assert.match(theme, /prefers-reduced-motion/);
  assert.match(theme, /toggle\.checked = effectsEnabled && !reducedMotion/);
  assert.match(theme, /toggle\.checked = rgbPulseEnabled && !reducedMotion/);
  assert.match(read("assets/js/translations.js"), /"theme\.soundEffect": "UI sounds"/);
  assert.match(read("assets/js/translations.js"), /"theme\.soundEffect": "Suara antarmuka"/);
  assert.match(read("assets/js/translations.js"), /"theme\.ambientMusic": "Lo-fi music"/);
  assert.match(read("assets/js/translations.js"), /"theme\.ambientMusic": "Musik lo-fi"/);
  assert.doesNotMatch(theme, /function scheduleAmbientMusicStep/);
  assert.match(read("assets/js/main.js"), /data-music-group/);
  assert.match(read("assets/css/style.css"), /html\.effects-enabled \.motion-reveal/);
  assert.match(read("assets/css/style.css"), /html\.effects-enabled \.interaction-feedback/);
  assert.match(read("assets/js/main.js"), /projectDialogAnimation\.onfinish/);
  assert.match(read("assets/js/main.js"), /role="switch"/);
  assert.ok(config.socialLinks.every((link) => !/github/i.test(link.label + link.url)));
  assert.doesNotMatch(read("README.md"), /github/i);
});

test("static output excludes duplicate site copies and test files", () => {
  const config = read("_config.yml");
  assert.match(config, /^\s+- armuzzumkm-main\s*$/m);
  assert.match(config, /^\s+- armuzzumkm\(referensikedua\)\s*$/m);
  assert.match(config, /^\s+- tests\s*$/m);
});
