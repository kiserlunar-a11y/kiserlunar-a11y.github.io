(() => {
  "use strict";

  const storageKey = "waypoint-code-language";
  const supportedLanguages = new Set(["en", "ko", "ja"]);

  function readSavedLanguage() {
    try {
      const saved = window.localStorage.getItem(storageKey);
      return supportedLanguages.has(saved) ? saved : "en";
    } catch (_) {
      return "en";
    }
  }

  function saveLanguage(language) {
    try {
      window.localStorage.setItem(storageKey, language);
    } catch (_) {
      // 저장소 사용이 제한되어도 현재 페이지의 언어 전환은 계속 제공한다.
    }
  }

  function localizedAttribute(element, prefix, language) {
    return element.getAttribute(`${prefix}-${language}`);
  }

  function applyLanguage(language, persist) {
    const selected = supportedLanguages.has(language) ? language : "en";
    document.documentElement.lang = selected;

    document.querySelectorAll("[data-language-panel]").forEach((panel) => {
      panel.hidden = panel.getAttribute("data-language-panel") !== selected;
    });

    document.querySelectorAll("[data-copy]").forEach((element) => {
      const value = localizedAttribute(element, "data-copy", selected);
      if (value !== null) {
        element.textContent = value;
      }
    });

    document.querySelectorAll("[data-copy-aria]").forEach((element) => {
      const value = localizedAttribute(element, "data-copy-aria", selected);
      if (value !== null) {
        element.setAttribute("aria-label", value);
      }
    });

    document.querySelectorAll("[data-copy-alt]").forEach((element) => {
      const value = localizedAttribute(element, "data-copy-alt", selected);
      if (value !== null) {
        element.setAttribute("alt", value);
      }
    });

    const title = localizedAttribute(document.body, "data-title", selected);
    if (title !== null) {
      document.title = title;
    }

    const description = localizedAttribute(
      document.body,
      "data-description",
      selected
    );
    const descriptionElement = document.querySelector('meta[name="description"]');
    if (description !== null && descriptionElement) {
      descriptionElement.setAttribute("content", description);
    }

    document.querySelectorAll("[data-language-choice]").forEach((button) => {
      const active = button.getAttribute("data-language-choice") === selected;
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    if (persist) {
      saveLanguage(selected);
    }
  }

  document.querySelectorAll("[data-language-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      applyLanguage(button.getAttribute("data-language-choice"), true);
    });
  });

  applyLanguage(readSavedLanguage(), false);
})();
