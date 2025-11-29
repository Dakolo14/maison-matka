"use strict";

/**  Preload  * Loading will be end after document is loaded with minimum display time  */

const preloader = document.querySelector("[data-preaload]");

// Track when page starts loading
const loadStartTime = Date.now();
const minimumLoadTime = 2000; // 2 seconds minimum display time

window.addEventListener("load", function () {
  const loadEndTime = Date.now();
  const loadDuration = loadEndTime - loadStartTime;

  // Calculate remaining time to meet minimum display duration
  const remainingTime = minimumLoadTime - loadDuration;

  if (remainingTime > 0) {
    // Wait for the remaining time before hiding preloader
    setTimeout(() => {
      preloader.classList.add("loaded");
      document.body.classList.add("loaded");
    }, remainingTime);
  } else {
    // Page took longer than minimum time, hide immediately
    preloader.classList.add("loaded");
    document.body.classList.add("loaded");
  }
});

/* Add event listeners on multiple events  */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};

/* Navbar */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
};

addEventOnElements(navTogglers, "click", toggleNavbar);

/* Dropdown Menu Toggle for Mobile */
const dropdownItems = document.querySelectorAll(".dropdown-item");

dropdownItems.forEach((item) => {
  const dropdownToggle = item.querySelector(".dropdown-toggle");

  dropdownToggle.addEventListener("click", function (e) {
    // Only prevent default on mobile
    if (window.innerWidth < 1200) {
      e.preventDefault();
      item.classList.toggle("active");

      // Close other dropdowns
      dropdownItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });
    }
  });
});

/* Header & Back to top Button */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
};

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

/* Smooth Scroll for Scroll Down Button */
const scrollDownBtn = document.querySelector(".scroll-down");

if (scrollDownBtn) {
  scrollDownBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const headerOffset = 100;
      const elementPosition = targetSection.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
}

/* Smooth Scroll for All Anchor Links */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    // Don't process if it's just "#"
    if (href === "#") return;

    e.preventDefault();
    const targetSection = document.querySelector(href);

    if (targetSection) {
      const headerOffset = 100;
      const elementPosition = targetSection.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

/* Parallax Effect */

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {
  x = (event.clientX / window.innerWidth) * 10 - 5;
  y = (event.clientY / window.innerHeight) * 10 - 5;

  // reverse the number e.g 20 -> -20, -5 -> 5
  x = x - x * 2;
  y = y - y * 2;

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }
});

// Render Lucide Icons
lucide.createIcons();

// FAQ Accordion Logic
document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-custom-scope__item");

  faqItems.forEach((item) => {
    const header = item.querySelector(".faq-custom-scope__header");
    const content = item.querySelector(".faq-custom-scope__content");

    header.addEventListener("click", () => {
      // Toggle 'active' class on the clicked item
      const isOpen = item.classList.contains("active");

      // Close others (Accordion style)
      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("active");
        otherItem.querySelector(".faq-custom-scope__content").style.maxHeight =
          null;
      });

      if (!isOpen) {
        item.classList.add("active");
        // Set max-height to scrollHeight to animate opening
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
});

// Initialize icons
lucide.createIcons();

// JavaScript for Search and Filter Functionality
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const locationSelect = document.getElementById("locationSelect");
  const typeSelect = document.getElementById("typeSelect");
  const minPriceInput = document.getElementById("minPrice");
  const maxPriceInput = document.getElementById("maxPrice");
  const clearSelectionBtn = document.getElementById("clearSelectionBtn");
  const cards = document.querySelectorAll(".listing-card");
  const noResultsMsg = document.getElementById("noResults");

  function filterProperties() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedLocation = locationSelect.value;
    const selectedType = typeSelect.value;
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

    let visibleCount = 0;

    cards.forEach((card) => {
      const title = card.getAttribute("data-title").toLowerCase();
      const location = card.getAttribute("data-location");
      const type = card.getAttribute("data-type");
      const price = parseFloat(card.getAttribute("data-price"));

      const matchesSearch = title.includes(searchTerm);
      const matchesLocation =
        selectedLocation === "" || location === selectedLocation;
      const matchesType = selectedType === "" || type === selectedType;
      const matchesPrice = price >= minPrice && price <= maxPrice;

      if (matchesSearch && matchesLocation && matchesType && matchesPrice) {
        card.classList.remove("hidden");
        visibleCount++;
      } else {
        card.classList.add("hidden");
      }
    });

    // Show/Hide No Results Message
    if (visibleCount === 0) {
      noResultsMsg.classList.add("visible");
    } else {
      noResultsMsg.classList.remove("visible");
    }
  }

  // Event Listeners
  searchInput.addEventListener("input", filterProperties);
  locationSelect.addEventListener("change", filterProperties);
  typeSelect.addEventListener("change", filterProperties);
  minPriceInput.addEventListener("input", filterProperties);
  maxPriceInput.addEventListener("input", filterProperties);

  // Clear Selection / Reset Button
  clearSelectionBtn.addEventListener("click", () => {
    searchInput.value = "";
    locationSelect.value = "";
    typeSelect.value = "";
    minPriceInput.value = "";
    maxPriceInput.value = "";
    filterProperties();
  });
});
