const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  menuButton.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
  siteNav?.classList.toggle("is-open", !open);
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
  });
});

const gallery = document.querySelector(".gallery-section");
const galleryMain = gallery?.querySelector("[data-gallery-main]");
const galleryThumbs = [...(gallery?.querySelectorAll(".gallery-thumb") || [])];
const galleryStatus = gallery?.querySelector("[data-gallery-status]");
const galleryCaption = gallery?.querySelector("[data-gallery-caption]");
const galleryNext = gallery?.querySelector("[data-gallery-next]");
const galleryDelay = 6500;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeGalleryIndex = Math.max(0, galleryThumbs.findIndex((button) => button.getAttribute("aria-pressed") === "true"));
let galleryTimer;
let galleryTransition = 0;
let interactionPaused = false;

function updateSlideshow() {
  if (!gallery) return;
  const paused = interactionPaused || document.hidden;
  clearTimeout(galleryTimer);
  if (!paused && !reducedMotion.matches) {
    galleryTimer = setTimeout(() => selectGalleryPhoto(activeGalleryIndex + 1), galleryDelay);
  }
}

async function selectGalleryPhoto(index) {
  if (!galleryThumbs.length || !galleryMain) return;
  activeGalleryIndex = (index + galleryThumbs.length) % galleryThumbs.length;
  const selected = galleryThumbs[activeGalleryIndex];
  const nextSrc = selected.dataset.full;
  const nextAlt = selected.dataset.alt || "Photo from Marci Metzger’s gallery";
  const token = ++galleryTransition;

  if (galleryNext && !reducedMotion.matches && galleryMain.src !== nextSrc) {
    galleryNext.classList.remove("is-visible");
    galleryNext.src = nextSrc;
    try {
      await galleryNext.decode();
      if (token === galleryTransition) {
        galleryNext.classList.add("is-visible");
        await new Promise((resolve) => setTimeout(resolve, 480));
      }
    } catch {
      // Fall back to a direct image swap if the hosted photo cannot be decoded.
    }
  }
  if (token !== galleryTransition) return;
  galleryMain.src = nextSrc;
  galleryMain.alt = nextAlt;
  galleryNext?.classList.remove("is-visible");

  galleryThumbs.forEach((button, buttonIndex) => {
    const isSelected = buttonIndex === activeGalleryIndex;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  if (galleryStatus) galleryStatus.textContent = `Photo ${activeGalleryIndex + 1} of ${galleryThumbs.length}`;
  if (galleryCaption) galleryCaption.textContent = selected.dataset.caption || "From Marci’s photo gallery";
  updateSlideshow();
}

galleryThumbs.forEach((button, index) => {
  button.addEventListener("click", () => selectGalleryPhoto(index));
});
gallery?.querySelectorAll("[data-gallery-step]").forEach((button) => {
  button.addEventListener("click", () => selectGalleryPhoto(activeGalleryIndex + Number(button.dataset.galleryStep)));
});
gallery?.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  event.preventDefault();
  selectGalleryPhoto(activeGalleryIndex + (event.key === "ArrowRight" ? 1 : -1));
});
gallery?.addEventListener("mouseenter", () => { interactionPaused = true; updateSlideshow(); });
gallery?.addEventListener("mouseleave", () => { interactionPaused = false; updateSlideshow(); });
gallery?.addEventListener("focusin", () => { interactionPaused = true; updateSlideshow(); });
gallery?.addEventListener("focusout", (event) => {
  if (!gallery.contains(event.relatedTarget)) {
    interactionPaused = false;
    updateSlideshow();
  }
});
document.addEventListener("visibilitychange", updateSlideshow);
reducedMotion.addEventListener?.("change", (event) => {
  updateSlideshow();
});
selectGalleryPhoto(activeGalleryIndex);

const reviewsGrid = document.querySelector("#client-reviews");
const reviewsToggle = document.querySelector(".feedback-toggle");
reviewsToggle?.addEventListener("click", () => {
  const expanded = reviewsToggle.getAttribute("aria-expanded") === "true";
  if (!reviewsGrid) return;

  const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  reviewsToggle.setAttribute("aria-expanded", String(!expanded));
  reviewsToggle.textContent = expanded ? "View All Reviews" : "Show Fewer Reviews";
  if (reducedMotionPreference) {
    reviewsGrid.classList.toggle("is-expanded", !expanded);
    return;
  }

  const startHeight = reviewsGrid.getBoundingClientRect().height;
  const firstRowHeight = Math.max(...[...reviewsGrid.children].slice(0, 3).map((card) => card.getBoundingClientRect().height));

  reviewsGrid.style.height = `${startHeight}px`;
  reviewsGrid.style.overflow = "hidden";
  void reviewsGrid.offsetHeight;

  if (expanded) {
    reviewsGrid.classList.add("is-collapsing");
    reviewsGrid.style.transition = "height 380ms cubic-bezier(.2,.7,.2,1)";
    requestAnimationFrame(() => { reviewsGrid.style.height = `${firstRowHeight}px`; });
  } else {
    reviewsGrid.classList.add("is-expanded");
    const endHeight = reviewsGrid.scrollHeight;
    reviewsGrid.style.transition = "height 480ms cubic-bezier(.2,.7,.2,1)";
    requestAnimationFrame(() => { reviewsGrid.style.height = `${endHeight}px`; });
  }

  reviewsToggle.disabled = true;

  const finishTransition = () => {
    reviewsGrid.classList.toggle("is-expanded", !expanded);
    reviewsGrid.classList.remove("is-collapsing");
    reviewsGrid.style.height = "";
    reviewsGrid.style.overflow = "";
    reviewsGrid.style.transition = "";
    reviewsToggle.disabled = false;
  };

  setTimeout(finishTransition, expanded ? 400 : 500);
});

const propertySearch = document.querySelector("#property-search");
propertySearch?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(propertySearch);
  const minPrice = Number(form.get("minPrice")) || undefined;
  const maxPrice = Number(form.get("maxPrice")) || undefined;
  const note = document.querySelector("#search-note");
  if (minPrice && maxPrice && minPrice > maxPrice) {
    note.textContent = "Minimum price must be less than or equal to maximum price.";
    propertySearch.elements.maxPrice.focus();
    return;
  }

  const location = propertySearch.elements.location.selectedOptions[0];
  const searchTerm = location.dataset.label;
  const filterState = {
    sortSelection: { value: form.get("sort") || "globalrelevanceex" },
  };
  if (minPrice || maxPrice) filterState.price = { min: minPrice || null, max: maxPrice || null };
  if (form.get("beds")) filterState.beds = { min: Number(form.get("beds")) };
  if (form.get("baths")) filterState.baths = { min: Number(form.get("baths")) };

  const state = {
    pagination: {},
    usersSearchTerm: searchTerm,
    isMapVisible: false,
    filterState,
    isListVisible: true,
  };
  const destination = new URL(`https://www.zillow.com/${location.value}/`);
  const type = form.get("type");
  if (type) destination.pathname += `${type}/`;
  destination.searchParams.set("searchQueryState", JSON.stringify(state));
  window.open(destination.toString(), "_blank", "noopener,noreferrer");
  note.textContent = `Opening Zillow search results for ${searchTerm}. For Marci’s own listings, use the profile link above.`;
});

const receptionist = document.querySelector("#receptionist");
const receptionistPanel = receptionist?.querySelector(".receptionist-panel");
const receptionistInput = document.querySelector("#receptionist-input");
const receptionistMessages = document.querySelector("#receptionist-messages");
const receptionistLauncher = receptionist?.querySelector(".receptionist-launcher");
const receptionistForm = document.querySelector("#receptionist-form");
const receptionistSubmit = receptionistForm?.querySelector("button[type='submit']");
const chatHistory = [];

function setReceptionistOpen(open) {
  if (!receptionist || !receptionistPanel) return;
  receptionist.classList.toggle("is-open", open);
  receptionistPanel.setAttribute("aria-hidden", String(!open));
  receptionistLauncher?.setAttribute("aria-expanded", String(open));
  if (open) receptionistInput?.focus();
  else receptionistLauncher?.focus();
}

function addReceptionistMessage(text, role) {
  if (!receptionistMessages) return;
  const message = document.createElement("div");
  message.className = `chat-message chat-message-${role}`;
  message.textContent = text;
  receptionistMessages.append(message);
  receptionistMessages.scrollTop = receptionistMessages.scrollHeight;
}

async function sendReceptionistQuestion(question) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) return;
  addReceptionistMessage(cleanQuestion, "user");
  chatHistory.push({ role: "user", content: cleanQuestion.slice(0, 1500) });
  if (receptionistInput) receptionistInput.disabled = true;
  if (receptionistSubmit) receptionistSubmit.disabled = true;
  const pending = document.createElement("div");
  pending.className = "chat-message chat-message-assistant chat-message-pending";
  pending.textContent = "One moment…";
  receptionistMessages?.append(pending);
  try {
    const response = await fetch("/api/receptionist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatHistory.slice(-12) }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "The receptionist is temporarily unavailable.");
    pending.remove();
    chatHistory.push({ role: "assistant", content: data.answer });
    addReceptionistMessage(data.answer, "assistant");
  } catch (error) {
    pending.remove();
    chatHistory.pop();
    const message = error instanceof TypeError
      ? "I can answer once this site is deployed with its Vercel AI service. You can reach Marci at (206) 919-6886 or marcimetzger@gmail.com."
      : error.message;
    addReceptionistMessage(message, "assistant");
  } finally {
    if (receptionistInput) receptionistInput.disabled = false;
    if (receptionistSubmit) receptionistSubmit.disabled = false;
    receptionistInput?.focus();
  }
}

document.querySelectorAll("[data-open-receptionist]").forEach((button) => {
  button.addEventListener("click", () => setReceptionistOpen(true));
});
document.querySelector("[data-close-receptionist]")?.addEventListener("click", () => setReceptionistOpen(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && receptionist?.classList.contains("is-open")) setReceptionistOpen(false);
});
receptionistForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = receptionistInput?.value || "";
  sendReceptionistQuestion(value);
  if (receptionistInput) receptionistInput.value = "";
});
document.querySelectorAll("[data-question]").forEach((button) => {
  button.addEventListener("click", () => sendReceptionistQuestion(button.dataset.question || ""));
});

