const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const siteHeader = document.querySelector(".site-header");

let previousScrollY = window.scrollY;
let scrollFramePending = false;
window.addEventListener("scroll", () => {
  if (scrollFramePending) return;
  scrollFramePending = true;

  requestAnimationFrame(() => {
    const currentScrollY = window.scrollY;
    const menuOpen = menuButton?.getAttribute("aria-expanded") === "true";
    const headerHasFocus = siteHeader?.contains(document.activeElement);

    if (currentScrollY < 96 || menuOpen || headerHasFocus || currentScrollY < previousScrollY - 3) {
      siteHeader?.classList.remove("is-hidden");
    } else if (currentScrollY > previousScrollY + 3) {
      siteHeader?.classList.add("is-hidden");
    }

    previousScrollY = currentScrollY;
    scrollFramePending = false;
  });
}, { passive: true });

siteHeader?.addEventListener("focusin", () => siteHeader.classList.remove("is-hidden"));

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

// Reviews expand and collapse
const reviewsGrid = document.querySelector("#client-reviews");
const reviewsToggle = document.querySelector(".feedback-toggle");
reviewsToggle?.addEventListener("click", () => {
  const expanded = reviewsToggle.getAttribute("aria-expanded") === "true";
  if (!reviewsGrid) return;

  const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  reviewsToggle.setAttribute("aria-expanded", String(!expanded));
  reviewsToggle.textContent = expanded ? "View all reviews" : "Show fewer reviews";
  if (reducedMotionPreference) {
    reviewsGrid.classList.toggle("is-expanded", !expanded);
    return;
  }

  reviewsToggle.disabled = true;
  const startHeight = reviewsGrid.getBoundingClientRect().height;
  const animateGridToNaturalHeight = (duration) => {
    reviewsGrid.style.height = "auto";
    const targetHeight = reviewsGrid.getBoundingClientRect().height;
    reviewsGrid.style.height = `${startHeight}px`;
    reviewsGrid.style.overflow = "hidden";
    void reviewsGrid.offsetHeight;

    const animation = reviewsGrid.animate(
      [{ height: `${startHeight}px` }, { height: `${targetHeight}px` }],
      { duration, easing: "cubic-bezier(.2,.7,.2,1)" }
    );
    animation.onfinish = () => {
      reviewsGrid.style.height = "";
      reviewsGrid.style.overflow = "";
      reviewsToggle.disabled = false;
    };
  };

  if (expanded) {
    reviewsGrid.classList.add("is-collapsing");
    window.setTimeout(() => {
      reviewsGrid.classList.remove("is-expanded", "is-collapsing");
      animateGridToNaturalHeight(380);
    }, 200);
  } else {
    reviewsGrid.classList.add("is-expanded");
    animateGridToNaturalHeight(480);
  }
});

const propertySearch = document.querySelector("#property-search");
const advancedToggle = document.querySelector(".search-advanced-toggle");
const advancedRow = document.querySelector(".search-row-advanced");

advancedToggle?.addEventListener("click", () => {
  const isExpanded = advancedToggle.getAttribute("aria-expanded") === "true";
  advancedToggle.setAttribute("aria-expanded", String(!isExpanded));
  advancedToggle.textContent = isExpanded ? "Show filters" : "Hide filters";
  if (advancedRow) advancedRow.hidden = isExpanded;
});

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

