"use strict";

const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");

if (menuBtn && mainNav) {
  const closeMenu = () => {
    mainNav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  };

  const toggleMenu = () => {
    const isOpen = mainNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  };

  menuBtn.addEventListener("click", toggleMenu);

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    },
    { passive: true },
  );
}
