/* Tiny, dependency-free enhancements for the portfolio.
   1) keep the footer year current
   2) fade content in on scroll (respecting reduced-motion)
   3) a soft accent glow that follows the cursor across the hero */
(() => {
  "use strict";

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- reveal on scroll ---
  const items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
  } else {
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
  }

  // --- hero pointer glow (desktop pointers only, motion-ok only) ---
  const hero = document.querySelector(".hero");
  const finePointer =
    window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  if (hero && !reduce && finePointer) {
    let queued = false;
    hero.addEventListener("pointermove", (e) => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", `${e.clientX - r.left}px`);
        hero.style.setProperty("--my", `${e.clientY - r.top}px`);
        queued = false;
      });
    });
  }
})();
