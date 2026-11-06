/*  ─────────────────────────────────────────────────────────────
    COMPONENTS.JS — Komponen Antarmuka Bersama (Shared UI Shell)
    ─────────────────────────────────────────────────────────────
    Mengelola:
    • Header bersama (Brand, Pemilih Tema, Pengalih Bahasa)
    • Navigasi strip geser horizontal (Swipeable side-scrolling navbar)
    • Footer bersama dengan tautan sosial
    • Bilah pesan mengambang di mobile (Bottom Order Bar)
    • Modal dialog pemesanan (Order Dialog Modal)
    • Integrasi saluran (WhatsApp, Instagram DM, TikTok DM, Email)
    • Salin otomatis ke clipboard untuk IG/TikTok
    ─────────────────────────────────────────────────────────────  */

(function () {
  "use strict";

  var C = window.SITE_CONFIG;
  var I = window.I18N;
  var THEMES = ["warm-paper", "deep-dark", "clean-light", "rgb-pulse"];

  var A = (window.App = { C: C });

  function setStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  }

  /* Bahasa aktif ('id' atau 'en') */
  A.lang = function () {
    var l = document.documentElement.lang;
    return I && I[l] ? l : "id";
  };

  /* Helper penerjemah dengan interpolasi variabel {key} */
  A.t = function (key, vars) {
    var curLang = A.lang();
    var str = (I[curLang] && I[curLang][key] != null) ? I[curLang][key] : (I.id && I.id[key]);
    if (str == null) return key;
    if (vars) {
      for (var k in vars) {
        str = str.split("{" + k + "}").join(vars[k]);
      }
    }
    return str;
  };

  /* Memilih nilai sesuai bahasa aktif dari objek { id: "...", en: "..." } */
  A.pick = function (obj) {
    if (obj && typeof obj === "object") {
      return obj[A.lang()] || obj.id || "";
    }
    return obj == null ? "" : String(obj);
  };

  /* Sanitasi HTML */
  A.esc = function (str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[c];
    });
  };

  /* Format mata uang: IDR untuk Indonesia, SGD untuk English (tanpa konversi) */
  A.money = function (item) {
    if (A.lang() === "id") {
      return "Rp " + Number(item.idr || 0).toLocaleString("id-ID");
    }
    return "S$" + Number(item.sgd || 0).toLocaleString("en-SG");
  };

  /* Saluran pemesanan yang aktif (value tidak kosong) */
  A.channels = function () {
    return (C.orderChannels || []).filter(function (c) {
      return c && c.value && String(c.value).trim().length > 0;
    });
  };

  /* Pembuat tautan saluran */
  A.url = function (channel, message) {
    var val = String(channel.value || "").trim();
    var username = val.replace(/^@/, "");

    if (channel.type === "whatsapp") {
      var digits = val.replace(/\D/g, "");
      return "https://wa.me/" + digits + "?text=" + encodeURIComponent(message || "");
    }
    if (channel.type === "email") {
      return "mailto:" + val + "?subject=" + encodeURIComponent(A.t("mail.subject")) + "&body=" + encodeURIComponent(message || "");
    }
    if (channel.type === "instagram") {
      return "https://ig.me/m/" + encodeURIComponent(username);
    }
    if (channel.type === "tiktok") {
      return "https://www.tiktok.com/@" + encodeURIComponent(username);
    }
    return "#";
  };

  /* Format draf pesan pemesanan */
  A.msg = function (lines) {
    var greeting = A.t("msg.hello", { biz: C.businessName });
    var body = lines && lines.length ? lines.join("\n") : A.t("msg.general");
    var tail = A.t("msg.tail");
    return greeting + "\n" + body + "\n" + tail;
  };

  /* Format satu baris layanan untuk draf pesan */
  A.line = function (service) {
    var name = A.pick(service.name);
    var price = A.money(service);
    var unit = service.unit ? A.pick(service.unit) : "";
    return "- " + name + " (" + price + (unit ? " " + unit : "") + ")";
  };

  /* Render panel aksi pemesanan */
  A.panel = function (container, lines) {
    var channels = A.channels();
    var defaultMsg = A.msg(lines);

    var markup = '<label for="brief">' + A.t("ui.brief") + '</label>' +
      '<textarea id="brief" rows="7"></textarea>' +
      '<p class="status" role="status" aria-live="polite"></p>';

    if (channels.length) {
      markup += '<p class="via">' + A.t("ui.via") + '</p>' +
        '<div class="chs">' +
        channels.map(function (c, i) {
          return '<a class="btn" data-ch="' + i + '" target="_blank" rel="noopener noreferrer" href="' + A.esc(A.url(c, defaultMsg)) + '">' +
            A.t("ch." + c.type) + '</a>';
        }).join("") +
        '</div>';
    } else {
      markup += '<p class="note">' + A.t("ui.noch") + '</p>';
    }

    container.innerHTML = markup;

    var textarea = container.querySelector("textarea");
    var status = container.querySelector(".status");
    textarea.value = defaultMsg;

    container.querySelectorAll("[data-ch]").forEach(function (button) {
      button.addEventListener("click", function () {
        var ch = channels[Number(button.dataset.ch)];
        button.href = A.url(ch, textarea.value);

        /* Untuk IG dan TikTok: salin teks ke clipboard terlebih dahulu */
        if (ch.type === "instagram" || ch.type === "tiktok") {
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(textarea.value).catch(function () {});
            }
          } catch (err) {}
          if (status) {
            status.textContent = A.t("ui.copied");
          }
        }
      });
    });
  };

  /* Membuka modal dialog pemesanan */
  A.open = function (lines) {
    var dialog = document.getElementById("orderdlg");
    if (!dialog) return;

    var body = dialog.querySelector(".dlg-body");
    var title = dialog.querySelector("h2");
    var closeBtn = dialog.querySelector(".x");

    A.panel(body, lines || []);
    if (title) title.textContent = A.t("ui.ordertitle");
    if (closeBtn) closeBtn.setAttribute("aria-label", A.t("ui.close"));

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  };

  /* Render Shell bersama (Header, Scrolling Nav Strip, Footer, Mobile Order Bar) */
  A.shell = function () {
    var pageKey = document.body.dataset.page || "home";
    var pages = [
      ["home", "index"],
      ["services", "layanan"],
      ["packages", "paket"],
      ["portfolio", "portfolio"],
      ["process", "proses"],
      ["about", "tentang"],
      ["faq", "faq"],
      ["contact", "kontak"],
      ["bio", "biodata"]
    ];

    var curTheme = document.documentElement.dataset.theme;
    var targetLang = A.lang() === "id" ? "en" : "id";

    /* Header & Strip Nav */
    var hdr = document.getElementById("hdr");
    if (hdr) {
      hdr.innerHTML =
        '<a class="skip" href="#main">' + A.t("ui.skip") + '</a>' +
        '<div class="bar wrap">' +
          '<a class="brand" href="./index.html">' + A.esc(C.businessName) + '</a>' +
          '<div class="tools">' +
            '<select id="themesel" aria-label="' + A.t("ui.theme") + '">' +
              THEMES.map(function (k) {
                return '<option value="' + k + '"' + (k === curTheme ? " selected" : "") + '>' + A.t("theme." + k) + '</option>';
              }).join("") +
            '</select>' +
            '<button class="lang" id="langbtn" aria-label="' + A.t("ui.lang") + '">' + targetLang.toUpperCase() + '</button>' +
          '</div>' +
        '</div>' +
        '<nav class="strip" aria-label="' + A.t("nav.label") + '">' +
          pages.map(function (x) {
            var isCurrent = (x[0] === pageKey);
            return '<a href="./' + x[1] + '.html"' + (isCurrent ? ' aria-current="page"' : "") + '>' + A.t("nav." + x[0]) + '</a>';
          }).join("") +
        '</nav>';

      /* Auto-scroll tab aktif ke posisi nyaman */
      var currentTab = hdr.querySelector('.strip [aria-current="page"]');
      if (currentTab && typeof currentTab.scrollIntoView === "function") {
        currentTab.scrollIntoView({ inline: "center", block: "nearest" });
      }
    }

    /* Footer & Order Bar */
    var ftr = document.getElementById("ftr");
    if (ftr) {
      var socLinks = (C.socialLinks || [])
        .filter(function (x) { return x && x.url; })
        .map(function (x) {
          return '<a href="' + A.esc(x.url) + '" target="_blank" rel="noopener noreferrer">' + A.esc(x.label) + '</a>';
        }).join("");

      var currentYear = new Date().getFullYear();
      var hasChannels = A.channels().length > 0;
      var showOrderBar = (pageKey !== "contact" && hasChannels);

      ftr.innerHTML =
        '<div class="wrap">' +
          '<p><strong>' + A.esc(C.businessName) + '</strong> · ' + A.t("ft.text") + '</p>' +
          (socLinks ? '<p class="soc">' + socLinks + '</p>' : "") +
          '<p>© ' + currentYear + '</p>' +
        '</div>' +
        (showOrderBar ? '<div class="obar"><button class="btn" id="obtn">' + A.t("ui.order") + '</button></div>' : "");

      document.documentElement.classList.toggle("has-obar", showOrderBar);
    }
  };

  /* Inisialisasi Aplikasi */
  A.init = function (pageRenderFn) {
    A.page = pageRenderFn;

    /* Buat modal dialog pemesanan jika belum ada di DOM */
    if (!document.getElementById("orderdlg")) {
      var dlg = document.createElement("dialog");
      dlg.id = "orderdlg";
      dlg.setAttribute("aria-labelledby", "dlgt");
      dlg.innerHTML =
        '<div class="dlg-in">' +
          '<button class="x" type="button" aria-label="Close">×</button>' +
          '<h2 id="dlgt"></h2>' +
          '<div class="dlg-body"></div>' +
        '</div>';
      document.body.appendChild(dlg);

      dlg.querySelector(".x").onclick = function () {
        dlg.close();
      };
      dlg.addEventListener("click", function (e) {
        if (e.target === dlg) dlg.close();
      });
      dlg.addEventListener("keydown", function (e) {
        if (e.key === "Escape") dlg.close();
      });
    }

    /* Listener pemilih tema */
    document.addEventListener("change", function (e) {
      if (e.target.id === "themesel") {
        document.documentElement.dataset.theme = e.target.value;
        setStorage("studio-theme", e.target.value);
      }
    });

    /* Listener pengalih bahasa & tombol order bar */
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;

      if (btn.id === "langbtn") {
        var newLang = A.lang() === "id" ? "en" : "id";
        document.documentElement.lang = newLang;
        setStorage("studio-language", newLang);
        A.render();
      }

      if (btn.id === "obtn") {
        A.open([]);
      }
    });

    A.render();
  };

  /* Siklus Render Utama */
  A.render = function () {
    A.shell();
    if (A.page) {
      A.page();
    }
  };
})();
