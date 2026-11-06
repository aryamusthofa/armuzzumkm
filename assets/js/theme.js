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
  let ambientMusicBus;
  let ambientMusicStarting = false;
  let ambientMusicPlaying = false;
  let ambientMusicNodes = [];
  let ambientMusicTimer;
  let ambientMusicStep = 0;
  let nextAmbientMusicStepAt = 0;
  let ambientNoiseBuffer;
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
      "Play lo-fi music";
    const pauseLabel = window.SITE_COPY?.[document.documentElement.lang]?.["theme.musicPause"] ||
      "Pause lo-fi music";
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
    const now = audioContext.currentTime;
    nodes.forEach(({ sources, gain, filter }) => {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(0, now, 0.045);
      sources.forEach((source) => {
        try {
          source.stop(now + 0.18);
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.warn("An ambient music voice could not be stopped.", error);
          }
        }
      });
      sources[0]?.addEventListener("ended", () => {
        sources.forEach((source) => source.disconnect());
        filter?.disconnect();
        gain.disconnect();
      }, { once: true });
    });
    updateAmbientMusicControl();
  }

  function midiFrequency(note) {
    return 440 * 2 ** ((note - 69) / 12);
  }

  function trackAmbientMusicVoice(sources, gain, filter) {
    const voice = { sources, gain, filter };
    ambientMusicNodes.push(voice);
    sources[0].addEventListener("ended", () => {
      ambientMusicNodes = ambientMusicNodes.filter((item) => item !== voice);
      sources.forEach((source) => source.disconnect());
      filter?.disconnect();
      gain.disconnect();
    }, { once: true });
  }

  function playAmbientTone(frequency, startAt, duration, volume, filterFrequency = 1800) {
    const fundamental = audioContext.createOscillator();
    const overtone = audioContext.createOscillator();
    const blend = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    const envelope = audioContext.createGain();
    fundamental.type = "triangle";
    fundamental.frequency.setValueAtTime(frequency, startAt);
    overtone.type = "sine";
    overtone.frequency.setValueAtTime(frequency * 2, startAt);
    blend.gain.setValueAtTime(0.18, startAt);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(filterFrequency, startAt);
    filter.Q.setValueAtTime(0.7, startAt);
    envelope.gain.setValueAtTime(0.0001, startAt);
    envelope.gain.linearRampToValueAtTime(volume, startAt + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    fundamental.connect(filter);
    overtone.connect(blend);
    blend.connect(filter);
    filter.connect(envelope);
    envelope.connect(ambientMusicBus);
    fundamental.start(startAt);
    overtone.start(startAt);
    fundamental.stop(startAt + duration + 0.02);
    overtone.stop(startAt + duration + 0.02);
    trackAmbientMusicVoice([fundamental, overtone], envelope, filter);
  }

  function playAmbientNoise(startAt, duration, volume, filterType, filterFrequency) {
    const source = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const envelope = audioContext.createGain();
    source.buffer = ambientNoiseBuffer;
    filter.type = filterType;
    filter.frequency.setValueAtTime(filterFrequency, startAt);
    envelope.gain.setValueAtTime(0.0001, startAt);
    envelope.gain.linearRampToValueAtTime(volume, startAt + 0.004);
    envelope.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(ambientMusicBus);
    source.start(startAt);
    source.stop(startAt + duration + 0.02);
    trackAmbientMusicVoice([source], envelope, filter);
  }

  function scheduleAmbientMusicStep(step, startAt) {
    const beatsPerMinute = 78;
    const beatLength = 60 / beatsPerMinute;
    const sixteenthLength = beatLength / 4;
    const stepInBar = step % 16;
    const bar = Math.floor(step / 16) % 4;
    const chords = [
      { notes: [60, 64, 67, 71], bass: 36 },
      { notes: [57, 60, 64, 67], bass: 33 },
      { notes: [53, 57, 60, 64], bass: 29 },
      { notes: [55, 59, 62, 65], bass: 31 }
    ];
    const chord = chords[bar];
    const swungAt = startAt + (stepInBar % 4 === 2 ? sixteenthLength * 0.12 : 0);

    if (stepInBar === 0 || stepInBar === 8) {
      chord.notes.forEach((note, index) => {
        playAmbientTone(midiFrequency(note), swungAt + index * 0.018, 0.95, 0.028, 1500);
      });
      playAmbientTone(midiFrequency(chord.bass), swungAt, 0.72, 0.075, 420);
    } else if (stepInBar === 6 || stepInBar === 14) {
      playAmbientTone(midiFrequency(chord.notes[2] + 12), swungAt, 0.38, 0.012, 2100);
    }

    if (stepInBar === 0 || stepInBar === 8 || stepInBar === 10) {
      const kick = audioContext.createOscillator();
      const envelope = audioContext.createGain();
      kick.type = "sine";
      kick.frequency.setValueAtTime(stepInBar === 10 ? 72 : 105, startAt);
      kick.frequency.exponentialRampToValueAtTime(42, startAt + 0.11);
      envelope.gain.setValueAtTime(0.16, startAt);
      envelope.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.16);
      kick.connect(envelope);
      envelope.connect(ambientMusicBus);
      kick.start(startAt);
      kick.stop(startAt + 0.18);
      trackAmbientMusicVoice([kick], envelope);
    }

    if (stepInBar === 4 || stepInBar === 12) {
      playAmbientNoise(startAt, 0.16, 0.035, "bandpass", 1900);
    } else if (stepInBar % 4 === 2) {
      playAmbientNoise(swungAt, 0.045, 0.009, "highpass", 7200);
    }

    const melodicNotes = [null, 76, null, 74, null, 71, null, 67, null, 69, null, 72, null, 71, null, 67];
    const melody = melodicNotes[stepInBar];
    if (melody && (bar === 0 || bar === 2)) {
      playAmbientTone(midiFrequency(melody), swungAt, 0.32, 0.009, 2600);
    }
  }

  function scheduleAmbientMusic() {
    if (!ambientMusicPlaying || !audioContext) return;
    const sixteenthLength = 60 / 78 / 4;
    while (nextAmbientMusicStepAt < audioContext.currentTime + 0.12) {
      scheduleAmbientMusicStep(ambientMusicStep, nextAmbientMusicStepAt);
      ambientMusicStep += 1;
      nextAmbientMusicStepAt += sixteenthLength;
    }
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

      const now = audioContext.currentTime;
      ambientMusicBus ||= audioContext.createGain();
      ambientMusicBus.gain.setValueAtTime(0.62, now);
      ambientMusicBus.connect(audioContext.destination);
      if (!ambientNoiseBuffer) {
        ambientNoiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate);
        const noise = ambientNoiseBuffer.getChannelData(0);
        let value = 0;
        for (let index = 0; index < noise.length; index += 1) {
          value = (value + 0.025 * (Math.random() * 2 - 1)) / 1.025;
          noise[index] = value * 3.5;
        }
      }
      ambientMusicStep = 0;
      nextAmbientMusicStepAt = now + 0.04;
      ambientMusicStarting = false;
      ambientMusicPlaying = true;
      updateAmbientMusicControl();
      scheduleAmbientMusic();
      ambientMusicTimer = window.setInterval(scheduleAmbientMusic, 25);
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
