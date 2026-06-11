/* Tiny, dependency-free enhancements for the portfolio.
   1) keep the footer year current
   2) fade content in on scroll (respecting reduced-motion)
   3) a soft accent glow that follows the cursor across the hero
   4) project search + topic filter */
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

  // --- project search + topic filter ---
  const searchBox = document.getElementById("project-search");
  const chips = Array.from(document.querySelectorAll(".filter-chip"));
  const cards = Array.from(document.querySelectorAll("#work .project"));
  const groups = Array.from(document.querySelectorAll(".project-group"));
  const emptyNote = document.getElementById("filter-empty");
  const clearBtn = document.getElementById("filter-clear");

  if (searchBox && cards.length) {
    let topic = "all";

    const applyFilters = () => {
      const q = searchBox.value.trim().toLowerCase();
      let shown = 0;
      cards.forEach((card) => {
        const topics = (card.dataset.topics || "").split(/\s+/);
        const matchesTopic = topic === "all" || topics.includes(topic);
        const matchesText = !q || card.textContent.toLowerCase().includes(q);
        const show = matchesTopic && matchesText;
        card.hidden = !show;
        if (show) {
          shown += 1;
          // make sure re-shown cards aren't stuck waiting on the scroll reveal
          card.classList.add("in");
        }
      });
      // hide group headings whose cards are all filtered out
      groups.forEach((group) => {
        group.hidden = !group.querySelector(".project:not([hidden])");
      });
      if (emptyNote) emptyNote.hidden = shown > 0;
    };

    searchBox.addEventListener("input", applyFilters);

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        topic = chip.dataset.topic || "all";
        chips.forEach((c) => {
          const active = c === chip;
          c.classList.toggle("active", active);
          c.setAttribute("aria-pressed", String(active));
        });
        applyFilters();
      });
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        searchBox.value = "";
        topic = "all";
        chips.forEach((c) => {
          const active = c.dataset.topic === "all";
          c.classList.toggle("active", active);
          c.setAttribute("aria-pressed", String(active));
        });
        applyFilters();
      });
    }
  }
})();
