/* A small, dependency-free "ask about my projects" assistant.
 *
 * It answers from a curated knowledge base using lightweight keyword scoring —
 * no API, no backend, no cost, and (by design) it never makes things up. If a
 * question doesn't match anything it knows, it says so and offers topics.
 */
(() => {
  "use strict";

  const toggle = document.getElementById("chat-toggle");
  const panel = document.getElementById("chat-panel");
  const closeBtn = document.getElementById("chat-close");
  const log = document.getElementById("chat-log");
  const chipsWrap = document.getElementById("chat-chips");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  if (!toggle || !panel || !log || !form || !input) return;

  const L = {
    demo: "https://stockmarketsimtyler.netlify.app",
    repo: "https://github.com/TylerJForstrom/Stock-Market-Sim",
    gh: "https://github.com/TylerJForstrom",
    li: "https://www.linkedin.com/in/tyler-forstrom-b78730226/",
    copilotDemo: "https://portfolio-insight-tyler.netlify.app",
    copilotRepo: "https://github.com/TylerJForstrom/Portfolio-Insight-Copilot",
    rippleDemo: "https://ripple-tyler.netlify.app",
    rippleRepo: "https://github.com/TylerJForstrom/Ripple",
  };
  const ext = (href, text) =>
    `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;

  const SUGGESTIONS = [
    "What has Tyler built?",
    "Tell me about the AI copilot",
    "How does the estimator work?",
    "What tech does he use?",
    "How do I contact him?",
  ];

  // Knowledge base. Earlier entries win ties; multi-word keywords score higher.
  const KB = [
    {
      keywords: ["estimator", "estimate", "estimates", "estimated", "simulation-backed",
        "simulation backed", "mock data", "market data", "less prominent", "ticker",
        "tickers", "listed symbol", "listed symbols", "benchmark", "spy", "qqq", "schd"],
      answer:
        "In Portfolio Insight Copilot, the estimator is an honest fallback for listed symbols " +
        "that do not have curated live-style demo data. It combines U.S. listed ticker metadata, " +
        "security type classification, deterministic symbol seeding, and calibration from Tyler's " +
        "Stock Market Simulation export, including benchmark movement and volatility context. It " +
        "is not pretending to be a live quote feed: the app labels these as simulation-backed " +
        "estimates so a reviewer can see the data quality and provenance.",
    },
    {
      keywords: ["market", "simulator", "simulation", "stock", "trading", "trade",
        "quant", "finance", "financial", "sharpe", "validation", "firewall", "sim",
        "order book", "market simulator", "stock market"],
      answer:
        "His flagship project is an <strong>agent-based stock market simulator</strong>: " +
        "prices emerge from thousands of competing trading agents on a real order book. " +
        "He paired it with a statistical validation firewall (Deflated Sharpe Ratio, " +
        "walk-forward testing, realistic costs) that honestly tests strategies - it found " +
        "no reliable directional edge across eight strategy families, but showed volatility " +
        "is forecastable. That simulator now also calibrates the Portfolio Insight Copilot's " +
        "benchmark and listed-symbol estimates, so the AI demo is not relying on unexplained " +
        "mock values. Pure Python, ~350 tests. " +
        ext(L.demo, "Live demo") + " · " + ext(L.repo, "Code") + ".",
    },
    {
      keywords: ["copilot", "rag", "retrieval", "llm", "insight", "ai project",
        "portfolio insight", "schwab", "fintech", "dashboard", "working on",
        "portfolio builder", "builder", "holdings", "risk", "risk score",
        "demo guide", "prompt packet", "guardrails", "portfolio"],
      answer:
        "Tyler built an <strong>AI Portfolio Insight Copilot</strong>: a no-cost static fintech " +
        "AI demo where users can build a portfolio, add/edit/delete holdings, search a broad " +
        "U.S. listed ticker universe, compare against SPY/QQQ/SCHD, and run an AI risk review " +
        "with transparent scoring factors. It uses citation-backed context, non-advisory " +
        "guardrails, simulation-backed estimates for less-prominent listed symbols, and an " +
        "optional prompt-packet view for technical walkthroughs. " +
        ext(L.copilotDemo, "Live demo") + " · " + ext(L.copilotRepo, "Code") + ".",
    },
    {
      keywords: ["game", "games", "ripple", "puzzle", "play", "wave", "interference", "arcade"],
      answer:
        "Tyler built <strong>Ripple</strong>, a logic puzzle based on real wave interference: " +
        "place emitters so the ripples reinforce to light up targets and cancel to keep others " +
        "quiet. Vanilla JS + Canvas, with procedurally generated, guaranteed-solvable levels. " +
        ext(L.rippleDemo, "Play") + " · " + ext(L.rippleRepo, "Code") + ".",
    },
    {
      keywords: ["project", "projects", "built", "build", "made", "work", "works",
        "portfolio", "showcase", "what has", "everything"],
      answer:
        "Tyler's projects span an <strong>AI Portfolio Insight Copilot</strong> with a portfolio " +
        "builder, simulation-backed ticker estimates, benchmark comparison, citation-backed " +
        "reasoning, and AI guardrails; plus an <strong>agent-based stock market simulator</strong> " +
        "with a statistical validation firewall. He also built <strong>Ripple</strong>, a " +
        "wave-interference puzzle game. Want details on any?",
      chips: ["What's the AI copilot?", "How does the estimator work?", "Tell me about the market simulator"],
    },
    {
      keywords: ["skill", "skills", "tech", "stack", "language", "languages", "tools",
        "technology", "technologies", "programming", "frameworks", "framework",
        "python", "java", "ocaml", "sql", "tensorflow"],
      answer:
        "Tyler works in <strong>Python, Java, C, OCaml, and SQL</strong>, with " +
        "<strong>PyTorch</strong> and <strong>TensorFlow</strong> for ML, plus " +
        "JavaScript / HTML / CSS and Git. He's comfortable across ML, simulation, and web.",
    },
    {
      keywords: ["looking", "hiring", "hire", "job", "jobs", "role", "roles",
        "internship", "intern", "opportunity", "opportunities", "available",
        "employment", "seeking", "open to", "looking for"],
      answer:
        "Tyler is <strong>open to software engineering roles</strong> and graduates in " +
        "May 2026. The fastest way to reach him is email — want his contact info?",
      chips: ["How do I contact him?", "What tech does he use?"],
    },
    {
      keywords: ["contact", "email", "reach", "linkedin", "github", "resume", "cv",
        "connect", "touch", "message", "get in touch", "reach out"],
      answer:
        "You can email Tyler at " +
        "<a href=\"mailto:tylerjamesforstrom@gmail.com\">tylerjamesforstrom@gmail.com</a>, " +
        "or connect on " + ext(L.li, "LinkedIn") + " and " + ext(L.gh, "GitHub") +
        ". His résumé is the “Résumé (PDF)” button at the top of the page.",
    },
    {
      keywords: ["school", "college", "university", "cornell", "study", "studying",
        "studies", "major", "degree", "graduate", "graduation", "grad", "education",
        "student"],
      answer:
        "He studies <strong>Computer Science at Cornell University</strong>'s College of " +
        "Engineering, with a minor in Business, graduating <strong>May 2026</strong>.",
    },
    {
      keywords: ["who", "about", "yourself", "background", "bio", "intro", "introduce",
        "summary"],
      answer:
        "<strong>Tyler Forstrom</strong> is a computer science student at Cornell " +
        "(graduating May 2026, business minor). He likes building things end to end and " +
        "cares about whether they actually work — so he tests heavily and tries not to " +
        "oversell results. He's interned as an app developer at Kahua and co-founded an " +
        "investing club at Cornell.",
    },
    {
      keywords: ["location", "where", "based", "live", "lives", "from", "relocate",
        "located", "city", "state"],
      answer:
        "Tyler is based in <strong>Connecticut</strong> (East Hartford) and studies at " +
        "Cornell in Ithaca, NY.",
    },
    {
      keywords: ["hobby", "hobbies", "interest", "interests", "fun", "outside", "golf",
        "gaming", "game", "weightlifting", "gym", "lifting", "martial arts", "free time"],
      answer:
        "Outside of code, Tyler is into <strong>martial arts, weightlifting, golf, gaming, " +
        "and investing</strong>.",
    },
    {
      keywords: ["help", "options", "suggestions", "topics", "menu", "what can", "ask you"],
      answer:
        "I can tell you about Tyler's background, his projects (an AI Portfolio Insight " +
        "Copilot with portfolio building and simulation-backed estimates, an agent-based " +
        "stock market simulator, and the Ripple puzzle game), the " +
        "tech he uses, what he's looking for, or how to contact him. What would you like to know?",
    },
    {
      keywords: ["thanks", "thank", "ty", "appreciate", "thx", "cheers"],
      answer: "Anytime! Anything else you'd like to know about Tyler or his projects?",
    },
    {
      keywords: ["hi", "hello", "hey", "yo", "sup", "howdy", "hiya", "greetings"],
      answer: "Hey! 👋 Ask me anything about Tyler and his projects, or tap a suggestion.",
    },
  ];

  const FALLBACK =
    "I'm not totally sure about that one — I'm a small bot that sticks to what it knows. " +
    "I can tell you about Tyler's projects, his skills, what he's looking for, or how to reach him.";

  function normalize(s) {
    return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  }

  function findAnswer(raw) {
    const q = normalize(raw);
    if (!q) return null;
    const tokens = new Set(q.split(" "));
    let best = null;
    let bestScore = 0;
    for (const entry of KB) {
      let score = 0;
      for (const kw of entry.keywords) {
        if (kw.includes(" ")) {
          if (q.includes(kw)) score += 2;
        } else if (tokens.has(kw)) {
          score += 1;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    }
    return bestScore > 0 ? best : { answer: FALLBACK };
  }

  function addMessage(content, who, isHTML) {
    const el = document.createElement("div");
    el.className = "chat-msg " + who;
    if (isHTML) el.innerHTML = content;
    else el.textContent = content;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function renderChips(list) {
    chipsWrap.innerHTML = "";
    (list || SUGGESTIONS).forEach((text) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chat-chip";
      chip.textContent = text;
      chip.addEventListener("click", () => ask(text));
      chipsWrap.appendChild(chip);
    });
  }

  function botReply(raw) {
    const entry = findAnswer(raw);
    const typing = addMessage("•••", "bot", false);
    typing.classList.add("typing");
    setTimeout(() => {
      typing.remove();
      addMessage(entry.answer, "bot", true);
      renderChips(entry.chips);
    }, 420);
  }

  function ask(text) {
    const q = text.trim();
    if (!q) return;
    addMessage(q, "user", false);
    chipsWrap.innerHTML = "";
    botReply(q);
  }

  let greeted = false;
  function openPanel() {
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    toggle.style.display = "none";
    if (!greeted) {
      greeted = true;
      addMessage(
        "Hi! I'm a quick assistant that can answer questions about Tyler and his work. " +
          "Ask me anything, or tap a suggestion.",
        "bot",
        false,
      );
      renderChips(SUGGESTIONS);
    }
    setTimeout(() => input.focus(), 60);
  }
  function closePanel() {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.style.display = "inline-flex";
    toggle.focus();
  }

  toggle.addEventListener("click", openPanel);
  closeBtn.addEventListener("click", closePanel);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value;
    input.value = "";
    ask(q);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("open")) closePanel();
  });
})();
