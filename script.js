/* Tiny, dependency-free enhancements for the portfolio.
   1) keep the footer year current
   2) gently fade project cards in as you scroll (respecting reduced-motion) */
(() => {
  "use strict";

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const items = document.querySelectorAll(".reveal");
  const reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  items.forEach((el) => io.observe(el));
})();
