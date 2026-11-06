(() => {
  "use strict";

  const storageKey = "studio-theme";
  const effectsStorageKey = "studio-effects-enabled";
  const rgbPulseStorageKey = "studio-rgb-pulse-enabled";
  const soundEffectsStorageKey = "studio-sound-effects-enabled";
  const defaultTheme = "warm-paper";
  const themes = new Set(["warm-paper", "deep-dark", "clean-light", "rgb-pulse"]);
  const legacyThemes = {
    warm: "warm-paper",
    dark: "deep-dark",
    light: "clean-light",
    rgb: "rgb-pulse"
  };
  const browserColors = {
    "warm-paper": "#f6efe8",
    "deep-dark": "#171918",
    "clean-light": "#f6f8f6",
    "rgb-pulse": "#11141d"
  };

  let activeTheme = defaultTheme;
  let effectsEnabled = false;
  let rgbPulseEnabled = false;
  let soundEffectsEnabled = false;
  let audioContext;
  let ambientMusicStarting = false;
  let ambientMusicPlaying = false;
  let ambientMusicNodes = [];
  let ambientMusicTimer;
  let ambientChordIndex = 0;
  let lastSoundAt = 0;
  let revealObserver;
  const reducedMotionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  try {
    const savedTheme = localStorage.getItem(storageKey);
    if (themes.has(savedTheme)) {
      activeTheme = savedTheme;
    } else if (legacyThemes[savedTheme]) {
      activeTheme = legacyThemes[savedTheme];
    }
  } catch (error) {
    console.warn("Theme preference could not be read from browser storage.", error);
  }

  try {
    effectsEnabled = localStorage.getItem(effectsStorageKey) === "true";
    rgbPulseEnabled = localStorage.getItem(rgbPulseStorageKey) === "true";
    soundEffectsEnabled = localStorage.getItem(soundEffectsStorageKey) === "true";
  } catch (error) {
    console.warn("Motion preferences could not be read from browser storage.", error);
  }

  function applyMotionPreferences() {
    const reducedMotion = Boolean(reducedMotionQuery?.matches);
    const reducedMotionNote = window.SITE_COPY?.[document.documentElement.lang]?.["theme.reducedMotionNote"] ||
      "Disabled by reduced-motion preference";
    document.documentElement.classList.toggle("effects-enabled", effectsEnabled && !reducedMotion);
    document.documentElement.classList.toggle("rgb-pulse-enabled", rgbPulseEnabled && !reducedMotion);
    document.querySelectorAll("[data-motion-choice]").forEach((toggle) => {
      toggle.checked = effectsEnabled && !reducedMotion;
      toggle.disabled = reducedMotion;
      toggle.title = reducedMotion ? reducedMotionNote : "";
    });
    document.querySelectorAll("[data-rgb-pulse-choice]").forEach((toggle) => {
      toggle.checked = rgbPulseEnabled && !reducedMotion;
      toggle.disabled = reducedMotion;
      toggle.title = reducedMotion ? reducedMotionNote : "";
    });
    document.querySelectorAll("[data-sound-choice]").forEach((toggle) => {
      toggle.checked = soundEffectsEnabled;
    });
    updateAmbientMusicControl();
  }

  function updateAmbientMusicControl() {
    const playLabel = window.SITE_COPY?.[document.documentElement.lang]?.["theme.musicPlay"] ||
      "Play ambient music";
    const pauseLabel = window.SITE_COPY?.[document.documentElement.lang]?.["theme.musicPause"] ||
      "Pause ambient music";
    document.querySelectorAll("[data-music-toggle]").forEach((button) => {
      button.textContent = ambientMusicPlaying ? pauseLabel : playLabel;
      button.setAttribute("aria-label", button.textContent);
      button.setAttribute("aria-pressed", String(ambientMusicPlaying));
    });
  }

  function stopAmbientMusic() {
    ambientMusicStarting = false;
    if (ambientMusicTimer) {
      window.clearInterval(ambientMusicTimer);
      ambientMusicTimer = null;
    }
    ambientMusicPlaying = false;
    const nodes = ambientMusicNodes;
    ambientMusicNodes = [];
    if (!nodes.length || !audioContext) {
      updateAmbientMusicControl();
      return;
    }
    const stopAt = audioContext.currentTime + 0.6;
    nodes.forEach(({ oscillator, gain }) => {
      gain.gain.cancelScheduledValues(audioContext.currentTime);
      gain.gain.setTargetAtTime(0, audioContext.currentTime, 0.12);
      oscillator.stop(stopAt);
      oscillator.addEventListener("ended", () => {
        oscillator.disconnect();
        gain.disconnect();
      }, { once: true });
    });
    updateAmbientMusicControl();
  }

  async function startAmbientMusic() {
    if (ambientMusicPlaying || ambientMusicStarting) return;
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) {
      console.warn("Ambient music is unavailable because this browser does not support Web Audio.");
      return;
    }

    try {
      ambientMusicStarting = true;
      audioContext ||= new AudioContextConstructor();
      await audioContext.resume();
      if (document.hidden || !ambientMusicStarting) {
        ambientMusicStarting = false;
        updateAmbientMusicControl();
        return;
      }

      const chords = [
        [261.63, 329.63, 392.00],
        [220.00, 261.63, 329.63],
        [174.61, 220.00, 261.63],
        [196.00, 246.94, 293.66]
      ];
      ambientChordIndex = 0;
      const now = audioContext.currentTime;
      ambientMusicNodes = chords[0].map((frequency) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.035, now + 2.5);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(now);
        return { oscillator, gain };
      });
      ambientMusicStarting = false;
      ambientMusicPlaying = true;
      updateAmbientMusicControl();
      ambientMusicTimer = window.setInterval(() => {
        if (document.hidden) {
          stopAmbientMusic();
          return;
        }
        ambientChordIndex = (ambientChordIndex + 1) % chords.length;
        const chord = chords[ambientChordIndex];
        const chordStart = audioContext.currentTime;
        ambientMusicNodes.forEach(({ oscillator }, index) => {
          oscillator.frequency.cancelScheduledValues(chordStart);
          oscillator.frequency.setTargetAtTime(chord[index], chordStart, 1.8);
        });
      }, 8000);
    } catch (error) {
      stopAmbientMusic();
      console.warn("Ambient music could not be played.", error);
    }
  }

  function toggleAmbientMusic() {
    if (ambientMusicPlaying || ambientMusicStarting) stopAmbientMusic();
    else void startAmbientMusic();
  }

  function playUiSound() {
    if (!soundEffectsEnabled || document.hidden) return;
    const now = performance.now();
    if (now - lastSoundAt < 70) return;
    lastSoundAt = now;
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) return;

    try {
      audioContext ||= new AudioContextConstructor();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = audioContext.currentTime;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(660, start);
      oscillator.frequency.exponentialRampToValueAtTime(520, start + 0.045);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.025, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.055);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.06);
      if (audioContext.state === "suspended") {
        audioContext.resume().catch((error) => {
          console.warn("The interface sound could not be played.", error);
        });
      }
    } catch (error) {
      console.warn("The interface sound could not be played.", error);
    }
  }

  function revealableElements(root) {
    const selector = "main > section, main > .page-intro, .project-card, .service-card, .package-card, .estimate-row, .process-steps > li, .faq-item, .profile-focus-card";
    if (root instanceof Element && root.matches(selector)) return [root];
    return root.querySelectorAll ? [...root.querySelectorAll(selector)] : [];
  }

  function observeRevealable(root = document) {
    if (!revealObserver) return;
    revealableElements(root).forEach((element) => {
      if (element.classList.contains("motion-reveal")) return;
      element.classList.add("motion-reveal");
      revealObserver.observe(element);
    });
  }

  function setupScrollEffects() {
    if (!("IntersectionObserver" in window)) return;
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("motion-reveal--visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -36px 0px" });
    observeRevealable();
    if (!("MutationObserver" in window)) return;
    const revealMutationObserver = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node instanceof Element) observeRevealable(node);
      }));
    });
    revealMutationObserver.observe(document.querySelector("main") || document.body, {
      childList: true,
      subtree: true
    });
  }

  function animateInteraction(target) {
    if (!document.documentElement.classList.contains("effects-enabled") ||
      reducedMotionQuery?.matches) return;
    const element = target.closest("button, a, summary, select, input[type='checkbox'], input[type='radio'], .project-card__open");
    if (!element || element.matches(":disabled")) return;
    element.classList.remove("interaction-feedback");
    void element.offsetWidth;
    element.classList.add("interaction-feedback");
    const clearFeedback = () => {
      element.classList.remove("interaction-feedback");
    };
    element.addEventListener("animationend", clearFeedback, { once: true });
    element.addEventListener("animationcancel", clearFeedback, { once: true });
  }

  function updateThemeControls() {
    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.themeChoice === activeTheme));
    });
  }

  function applyTheme(theme, persist = false) {
    if (!themes.has(theme)) return;

    activeTheme = theme;
    document.documentElement.dataset.theme = theme;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = browserColors[theme];

    updateThemeControls();

    if (persist) {
      try {
        localStorage.setItem(storageKey, theme);
      } catch (error) {
        console.warn("Theme preference could not be saved in browser storage.", error);
      }
    }
  }

  applyTheme(activeTheme);
  document.addEventListener("theme-controls-rendered", () => {
    applyMotionPreferences();
    updateAmbientMusicControl();
  });
  document.addEventListener("DOMContentLoaded", () => {
    updateThemeControls();
    applyMotionPreferences();
    setupScrollEffects();
  }, { once: true });
  reducedMotionQuery?.addEventListener?.("change", applyMotionPreferences);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAmbientMusic();
  });

  document.addEventListener("change", (event) => {
    const motionToggle = event.target.closest("[data-motion-choice]");
    const rgbPulseToggle = event.target.closest("[data-rgb-pulse-choice]");
    const soundToggle = event.target.closest("[data-sound-choice]");
    if (!motionToggle && !rgbPulseToggle && !soundToggle) return;
    if ((motionToggle || rgbPulseToggle) && reducedMotionQuery?.matches) return;

    const storage = motionToggle ? effectsStorageKey : rgbPulseToggle ? rgbPulseStorageKey : soundEffectsStorageKey;
    if (motionToggle) effectsEnabled = motionToggle.checked;
    else if (rgbPulseToggle) rgbPulseEnabled = rgbPulseToggle.checked;
    else soundEffectsEnabled = soundToggle.checked;
    try {
      localStorage.setItem(storage, String(motionToggle ? effectsEnabled : rgbPulseToggle ? rgbPulseEnabled : soundEffectsEnabled));
    } catch (error) {
      console.warn("Motion preference could not be saved in browser storage.", error);
    }
    applyMotionPreferences();
  });

  document.addEventListener("click", (event) => {
    animateInteraction(event.target);
    if (event.target.closest("[data-music-toggle]")) {
      toggleAmbientMusic();
      return;
    }
    if (event.target.closest("[data-sound-choice]")) {
      if (soundEffectsEnabled) playUiSound();
      return;
    }
    if (!event.target.closest("[data-theme-choice]")) playUiSound();

    const button = event.target.closest("[data-theme-choice]");
    if (button) {
      applyTheme(button.dataset.themeChoice, true);
      const menu = button.closest(".appearance-menu");
      if (menu) {
        menu.open = false;
        menu.querySelector("summary")?.focus({ preventScroll: true });
      }
      return;
    }

    document.querySelectorAll(".appearance-menu[open]").forEach((menu) => {
      if (!menu.contains(event.target)) menu.open = false;
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const menu = document.querySelector(".appearance-menu[open]");
    if (!menu) return;
    menu.open = false;
    menu.querySelector("summary")?.focus({ preventScroll: true });
  });
})();
