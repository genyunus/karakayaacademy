const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const faqButtons = document.querySelectorAll(".faq-question");
const revealTargets = document.querySelectorAll(
  ".section, .faq-section, .contact-section, .manifesto, .editorial-card, .info-strip article, .photo-panel, .photo-banner"
);

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const nextState = !siteNav.classList.contains("is-open");
    siteNav.classList.toggle("is-open", nextState);
    menuToggle.setAttribute("aria-expanded", String(nextState));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const isOpen = item?.classList.contains("is-open");

    faqButtons.forEach((otherButton) => {
      otherButton.setAttribute("aria-expanded", "false");
      otherButton.closest(".faq-item")?.classList.remove("is-open");
    });

    if (!item || isOpen) {
      return;
    }

    item.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.18 }
);

revealTargets.forEach((target) => {
  target.classList.add("reveal");
  observer.observe(target);
});

document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button[type='submit']");

  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  const originalText = button.textContent;
  button.textContent = "Inquiry Sent";
  button.disabled = true;

  window.setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, 2200);
});
