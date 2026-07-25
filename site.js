document.addEventListener("DOMContentLoaded", () => {
    const primaryNav = document.querySelector(".buttons-container");
    const languageOptions = document.querySelectorAll("[data-language-option]");
    const translatableElements = document.querySelectorAll("[data-en][data-ko]");
    const sections = document.querySelectorAll(".subtitle");
    const projectTitle = document.querySelector("#Title .site-info-header ~ .title-and-buttons > h1");
    let layoutFrame = null;

    function getCurrentNavLabel(pathname) {
        const cleanPath = pathname.replace(/\/+$/, "");

        if (cleanPath.includes("/about/")) return "about";
        if (cleanPath.endsWith("/menu.html")) return "menu";
        if (cleanPath === "" || cleanPath === "/" || cleanPath === "/index.html") return "home";
        return "menu";
    }

    if (primaryNav) {
        const currentLabel = getCurrentNavLabel(window.location.pathname);

        primaryNav.querySelectorAll(".btn").forEach((link) => {
            const label = link.textContent.trim().toLowerCase();
            const isCurrent = label === currentLabel;

            link.classList.toggle("is-current", isCurrent);
            if (isCurrent) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    function getStoredLanguage() {
        try {
            return localStorage.getItem("portfolioLanguage");
        } catch {
            return null;
        }
    }

    function storeLanguage(language) {
        try {
            localStorage.setItem("portfolioLanguage", language);
        } catch {
            // Ignore private browsing or blocked storage.
        }
    }

    function updateExpandedSections() {
        document.querySelectorAll(".detailsContent.expanded").forEach((content) => {
            content.style.maxHeight = `${content.scrollHeight}px`;
        });
    }

    function getProjectTitleMinimumSize() {
        if (window.matchMedia("(max-width: 480px)").matches) return 14;
        if (window.matchMedia("(max-width: 900px)").matches) return 16;
        return 22;
    }

    function fitProjectTitle() {
        if (!projectTitle) return;

        projectTitle.style.fontSize = "";

        let computedStyle = window.getComputedStyle(projectTitle);
        let baseSize = Number.parseFloat(computedStyle.fontSize);
        const minSize = getProjectTitleMinimumSize();

        if (!baseSize) return;

        for (let attempt = 0; attempt < 4; attempt += 1) {
            const availableWidth = projectTitle.clientWidth;
            const overflowWidth = projectTitle.scrollWidth;

            if (!availableWidth || overflowWidth <= availableWidth) return;

            baseSize = Math.max(minSize, baseSize * (availableWidth / overflowWidth));
            projectTitle.style.fontSize = `${baseSize}px`;

            computedStyle = window.getComputedStyle(projectTitle);
            baseSize = Number.parseFloat(computedStyle.fontSize);

            if (baseSize <= minSize) return;
        }
    }

    function updateLayout() {
        fitProjectTitle();
        updateExpandedSections();
    }

    function queueLayoutUpdate() {
        if (layoutFrame) {
            window.cancelAnimationFrame(layoutFrame);
        }

        layoutFrame = window.requestAnimationFrame(() => {
            layoutFrame = null;
            updateLayout();
        });
    }

    function setLanguage(language, shouldStore = true) {
        const currentLanguage = language === "ko" ? "ko" : "en";

        document.documentElement.lang = currentLanguage === "ko" ? "ko" : "en";
        document.body.dataset.language = currentLanguage;

        translatableElements.forEach((element) => {
            const translatedText = currentLanguage === "ko" ? element.dataset.ko : element.dataset.en;

            if (element.hasAttribute("data-i18n-html")) {
                element.innerHTML = translatedText;
            } else {
                element.textContent = translatedText;
            }
        });

        languageOptions.forEach((option) => {
            const isActive = option.dataset.languageOption === currentLanguage;
            option.classList.toggle("is-active", isActive);
            option.setAttribute("aria-pressed", String(isActive));
        });

        if (shouldStore) {
            storeLanguage(currentLanguage);
        }

        queueLayoutUpdate();
    }

    if (languageOptions.length && translatableElements.length) {
        setLanguage(getStoredLanguage() || "en", false);

        languageOptions.forEach((option) => {
            option.addEventListener("click", () => {
                setLanguage(option.dataset.languageOption);
            });
        });
    }

    updateLayout();

    function setExpanded(button, content, expanded) {
        content.classList.toggle("expanded", expanded);
        content.style.opacity = expanded ? "1" : "0";
        content.style.maxHeight = expanded ? `${content.scrollHeight}px` : null;
        button.setAttribute("aria-expanded", String(expanded));
    }

    sections.forEach((section, index) => {
        const button = section.querySelector(".detailsButton");
        const content = section.querySelector(".detailsContent");

        if (!button || !content) return;

        button.setAttribute("type", "button");
        if (!content.id) {
            content.id = `details-${index + 1}`;
        }

        button.setAttribute("aria-controls", content.id);

        const startsExpanded = content.classList.contains("expanded") || Boolean(content.style.maxHeight);
        setExpanded(button, content, startsExpanded);

        button.addEventListener("click", () => {
            setExpanded(button, content, !content.classList.contains("expanded"));
        });
    });

    window.addEventListener("resize", () => {
        queueLayoutUpdate();
    });
});
