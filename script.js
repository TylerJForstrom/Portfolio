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

  // --- glow that follows the pointer across the whole page ---
  const glow = document.querySelector(".cursor-glow");
  const finePointer =
    window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  if (glow && !reduce && finePointer) {
    let queued = false;
    let lx = 0;
    let ly = 0;
    window.addEventListener("pointermove", (e) => {
      lx = e.clientX;
      ly = e.clientY;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        glow.style.setProperty("--mx", `${lx}px`);
        glow.style.setProperty("--my", `${ly}px`);
        queued = false;
      });
    });
  }
})();
