/* A small, dependency-free "ask about my projects" assistant.
 *
 * It answers from a curated knowledge base using lightweight keyword scoring,
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
    photonDemo: "https://photonforge.netlify.app",
    photonRepo: "https://github.com/TylerJForstrom/Photon-Forge",
    rippleDemo: "https://ripple-tyler.netlify.app",
    rippleRepo: "https://github.com/TylerJForstrom/Ripple",
    banditDemo: "https://banditfeed.netlify.app",
    banditRepo: "https://github.com/TylerJForstrom/BanditFeed",
    plainDemo: "https://plaincodinglanguage.netlify.app",
    plainRepo: "https://github.com/TylerJForstrom/Plain",
    nycDemo: "https://nycrealestatemap.netlify.app",
    nycRepo: "https://github.com/TylerJForstrom/NYCRealEstateMap",
    pulseDemo: "https://tickerpulse-demo.netlify.app",
    pulseRepo: "https://github.com/TylerJForstrom/TickerPulse",
    glassDemo: "https://glassdb.netlify.app",
    glassRepo: "https://github.com/TylerJForstrom/Storage",
    mathDemo: "https://mathematical-solver.netlify.app",
    mathRepo: "https://github.com/TylerJForstrom/Mathematical_Solver",
  };
  const ext = (href, text) =>
    `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;

  const SUGGESTIONS = [
    "What has Tyler built?",
    "Tell me about TickerPulse",
    "Tell me about the NYC real estate map",
    "Tell me about the Plain language",
    "Tell me about GlassDB",
    "Tell me about the Mathematical Solver",
    "Tell me about BanditFeed",
    "Tell me about Photon Forge",
    "What tech does he use?",
    "How do I contact him?",
  ];

  // Knowledge base. Earlier entries win ties; multi-word keywords score higher.
  const KB = [
    {
      keywords: ["tickerpulse", "ticker pulse", "sentiment", "social sentiment",
        "trend radar", "trending tickers", "trending", "wallstreetbets", "wsb",
        "reddit", "stocktwits", "bluesky", "finbert", "buzz", "meme stocks",
        "meme stock", "social media stocks", "chatter", "velocity", "breakout",
        "topic map", "topic clustering", "lead lag", "hype", "what's hot"],
      answer:
        "Tyler built <strong>TickerPulse</strong>, a social sentiment & trend radar for the " +
        "stock market. A Python pipeline ingests public chatter from Reddit, StockTwits, " +
        "Bluesky, and Hacker News, extracts tickers (cashtags + a curated dictionary + " +
        "company-name matching with junk disambiguation), scores each post with " +
        "finance-tuned FinBERT sentiment, and clusters themes with embeddings + HDBSCAN. " +
        "The dashboard ranks trending tickers by volume, velocity, and breakout score, " +
        "flags unusual spikes, and overlays social buzz on real price data with a lead/lag " +
        "correlation readout — does chatter predict the move or chase it? It runs free: " +
        "GitHub Actions cron + Supabase + Netlify. " +
        ext(L.pulseDemo, "Live demo") + " · " + ext(L.pulseRepo, "Code") + ".",
    },
    {
      keywords: ["real estate", "realestate", "nyc", "housing", "house prices",
        "property", "properties", "home prices", "zillow", "map", "maps", "mapping",
        "postgis", "geospatial", "gis", "open data", "neighborhood", "neighborhoods",
        "brooklyn", "manhattan", "queens", "repeat sales", "heatmap", "choropleth",
        "maplibre", "mapbox", "where to buy", "nyc real estate", "real estate map"],
      answer:
        "Tyler built the <strong>NYC Real Estate Map</strong>, a full-stack market " +
        "analytics platform on 338k recorded property sales from NYC Open Data (real " +
        "deeds, not scraped listings). It has an interactive map with clustered sale " +
        "markers, a price heatmap, and neighborhood choropleths, plus a Market Insights " +
        "tab built for the where-to-buy question: repeat-sales returns from the same " +
        "property selling twice, price-vs-momentum quadrants, liquidity, and seasonality. " +
        "Stack: FastAPI, PostgreSQL/PostGIS (all geospatial queries in the database), " +
        "React + TypeScript, MapLibre GL, and a daily ingest pipeline with dedupe and " +
        "outlier detection. The live demo serves a real 25k-sale snapshot. " +
        ext(L.nycDemo, "Live demo") + " · " + ext(L.nycRepo, "Code") + ".",
    },
    {
      keywords: ["estimator", "estimate", "estimates", "estimated", "simulation-backed",
        "simulation backed", "mock data", "market data", "less prominent", "ticker",
        "tickers", "listed symbol", "listed symbols", "benchmark", "spy", "qqq", "schd"],
      answer:
        "In Portfolio Insight Copilot, the estimator is a labeled fallback for listed symbols " +
        "that do not have curated live-style demo data. It combines U.S. ticker metadata, " +
        "security type classification, deterministic symbol seeding, and calibration from Tyler's " +
        "Stock Market Simulation export. The point is to be clear about the data source instead " +
        "of pretending every ticker has a live quote feed.",
    },
    {
      keywords: ["market", "simulator", "simulation", "stock", "trading", "trade",
        "quant", "finance", "financial", "sharpe", "validation", "firewall", "sim",
        "order book", "market simulator", "stock market"],
      answer:
        "Tyler built an <strong>agent-based stock market simulator</strong> where prices come " +
        "from thousands of trading agents interacting through an order book. He added a validation " +
        "layer with Deflated Sharpe Ratio, walk-forward testing, and realistic costs to check " +
        "whether strategies actually had edge. Most directional strategies did not hold up, which " +
        "was the honest result; volatility forecasting was the useful signal. The simulator itself " +
        "is audited with controlled whale-order experiments against the square-root impact law — " +
        "failures get published and drive mechanism fixes, never quiet re-tuning. Pure Python, " +
        "~390 tests. " +
        ext(L.demo, "Live demo") + " · " + ext(L.repo, "Code") + ".",
    },
    {
      keywords: ["copilot", "rag", "retrieval", "llm", "insight", "ai project",
        "portfolio insight", "schwab", "fintech", "dashboard", "working on",
        "portfolio builder", "builder", "holdings", "risk", "risk score",
        "demo guide", "prompt packet", "guardrails", "portfolio"],
      answer:
        "Tyler built an <strong>AI Portfolio Insight Copilot</strong> to show how an AI finance " +
        "tool can be useful without pretending to be a financial advisor. Users can build a " +
        "portfolio, add or edit holdings, search a broad U.S. ticker universe, compare against " +
        "SPY/QQQ/SCHD, and run an AI risk review with clear scoring factors. It labels " +
        "simulation-backed estimates for less-prominent listed symbols. " +
        ext(L.copilotDemo, "Live demo") + " · " + ext(L.copilotRepo, "Code") + ".",
    },
    {
      keywords: ["bandit", "banditfeed", "bandit feed", "recommendation",
        "recommendations", "recommender", "ranking", "rankings", "feed",
        "articles", "article", "rss", "real articles", "linucb", "thompson",
        "exploration", "exploitation", "search recommendations", "social media"],
      answer:
        "Tyler built <strong>BanditFeed</strong>, a recommender demo that makes the learning loop " +
        "visible. It ranks real RSS articles with contextual bandit algorithms, shows match scores " +
        "and ranking reasons, links to the original articles, and updates its beliefs as users " +
        "click or skip items. The \"Why?\" section connects the demo to feeds, search, and content " +
        "ranking systems. Tech: FastAPI, vanilla JavaScript, LinUCB-style scoring, and real article metadata. " +
        ext(L.banditDemo, "Live demo") + " · " + ext(L.banditRepo, "Code") + ".",
    },
    {
      keywords: ["plain", "plain language", "programming language", "coding language",
        "own language", "made a language", "built a language", "interpreter", "compiler",
        "parser", "tokenizer", "english", "reads like english", "leetcode", "playground",
        "learn to code", "beginner", "beginners", "teaching", "pyodide", "syntax",
        "bytecode", "vm", "virtual machine", "stack machine", "disassembler",
        "stack-based", "opcodes", "debugger", "step debugger", "optimizer",
        "constant folding", "superinstructions", "fuzzing", "fuzzer"],
      answer:
        "Tyler designed and built <strong>Plain</strong>, a programming language that reads " +
        "like English — tokenizer, parser, optimizing bytecode compiler, and a stack-based " +
        "virtual machine, all written from scratch in pure Python. A peephole optimizer " +
        "folds constants and fuses hot instruction pairs, so programs run up to ~4.8x " +
        "faster than the original tree-walking interpreter (still there behind " +
        "--engine=ast). Every push runs a differential suite plus hundreds of fuzzed random " +
        "programs in CI to prove both engines produce identical output — friendly " +
        "line-numbered errors included. The demo site runs the real compiler in your " +
        "browser, with a <em>visual step-debugger</em> (watch variables and the call stack " +
        "change line by line), a Show-bytecode view, practice problems that stay pinned " +
        "beside the editor, and 16 solved LeetCode problems. " +
        ext(L.plainDemo, "Live demo") + " · " + ext(L.plainRepo, "Code") + ".",
    },
    {
      keywords: ["glassdb", "glass db", "glass", "database", "databases", "database engine",
        "sql engine", "storage engine", "b+tree", "btree", "b tree", "write ahead log",
        "write-ahead log", "wal", "pager", "buffer pool", "page cache", "rust",
        "crash", "crash safe", "crash recovery", "crash testing", "crash injection",
        "acid", "transaction", "transactions", "durability", "query planner",
        "query plan", "explain", "wasm", "webassembly", "sqlite", "postgres",
        "systems programming", "built a database", "own database"],
      answer:
        "Tyler built <strong>GlassDB</strong>, a crash-safe SQL database engine written " +
        "from scratch in Rust — pager with a buffer pool, write-ahead log, B+tree, SQL " +
        "parser, and a query planner that explains its choices — with zero dependencies " +
        "and no unsafe code. The demo runs the real engine in your browser via " +
        "WebAssembly and visualizes every page read, every WAL write, and the B+tree " +
        "shape as queries execute, so you can watch a primary-key lookup touch 2 pages " +
        "while a full scan walks them all. Testing is the headline: differential " +
        "fuzzing against Rust's BTreeMap as an oracle, plus crash injection — a " +
        "simulated disk cuts power at every single disk operation, and the suite " +
        "proves committed transactions always survive and unfinished ones vanish. " +
        ext(L.glassDemo, "Live demo") + " · " + ext(L.glassRepo, "Code") + ".",
    },
    {
      keywords: ["math", "maths", "mathematical", "math solver", "mathematical solver",
        "solver", "calculus", "algebra", "statistics", "stats", "derivative",
        "integral", "equation", "equations", "linear algebra", "matrix", "matrices",
        "probability", "regression", "numerical", "numerical methods", "newton's method",
        "time series", "word problem", "word problems", "symbolic math", "natural language math"],
      answer:
        "Tyler built the <strong>Mathematical Solver</strong>, a from-scratch math & stats " +
        "engine in plain JavaScript with zero libraries doing the math. You type a question " +
        "the way you'd actually ask it — \"what is the probability of 3 heads in 10 coin " +
        "flips\" or \"does the sum of 1/n^2 converge\" — and a natural-language parser maps " +
        "it to the right kind of problem, then routes it to the matching engine. It spans " +
        "algebra, calculus, linear algebra, graphing, numerical methods, probability, " +
        "statistics, and time series, and every answer shows step-by-step work, a table of " +
        "artifacts, and a graph or expression tree when it helps. Everything is hand-written " +
        "— Newton's method, Holt exponential smoothing, chi-square goodness-of-fit — and " +
        "200+ regression tests keep it honest as the engine grows. " +
        ext(L.mathDemo, "Live demo") + " · " + ext(L.mathRepo, "Code") + ".",
      chips: ["Tell me about GlassDB", "Tell me about the Plain language", "What tech does he use?"],
    },
    {
      keywords: ["game", "games", "ripple", "puzzle", "play", "wave", "interference", "arcade"],
      answer:
        "Tyler has two browser games/demos: <strong>Photon Forge</strong>, a 3D " +
        "ray-traced optics puzzle built with Three.js and a custom level sandbox, " +
        "and <strong>Ripple</strong>, a Canvas puzzle based on real wave interference. " +
        ext(L.photonDemo, "Photon Forge") + " · " + ext(L.rippleDemo, "Ripple") + ".",
    },
    {
      keywords: ["photon", "forge", "photon forge", "graphics", "computer graphics",
        "three", "threejs", "three.js", "3d", "ray", "ray tracing", "ray traced",
        "light puzzle", "optics", "reflection", "prism", "sandbox", "custom level",
        "cs 4620", "webgl"],
      answer:
        "Tyler built <strong>Photon Forge</strong>, a 3D light puzzle game that makes " +
        "computer graphics concepts playable. Players drag optics onto a Three.js board, " +
        "rotate the camera, solve reflection and color-routing puzzles, and build custom " +
        "levels with sources, targets, and walls. Under the hood it uses ray-segment " +
        "intersections, reflection vectors, color filtering, height-layer beam routing, " +
        "and camera controls. " +
        ext(L.photonDemo, "Live demo") + " · " + ext(L.photonRepo, "Code") + ".",
    },
    {
      keywords: ["project", "projects", "built", "build", "made", "work", "works",
        "portfolio", "showcase", "what has", "everything"],
      answer:
        "Tyler's projects include <strong>TickerPulse</strong>, a social sentiment & trend " +
        "radar for the stock market (Python NLP pipeline, FinBERT, React dashboard with " +
        "buzz-vs-price correlation); the <strong>NYC Real Estate Map</strong>, a full-stack " +
        "market analytics platform over 338k real NYC property sales (FastAPI + PostGIS + " +
        "React/MapLibre); <strong>Plain</strong>, a programming language that reads " +
        "like English (optimizing bytecode compiler + stack VM built from scratch, with " +
        "an in-browser playground and step-debugger); " +
        "<strong>GlassDB</strong>, a crash-safe SQL database engine built from scratch " +
        "in Rust that runs visibly in the browser via WebAssembly; the " +
        "<strong>Mathematical Solver</strong>, a from-scratch math & stats engine that " +
        "turns plain-English questions into the right problem type and shows its work; " +
        "<strong>BanditFeed</strong>, a real-article recommendation demo using contextual " +
        "bandits; <strong>Photon Forge</strong>, a 3D light puzzle with a sandbox level " +
        "builder; an <strong>AI Portfolio Insight Copilot</strong> with portfolio building, " +
        "ticker estimates, benchmark comparison, and AI guardrails; and an " +
        "<strong>agent-based stock market simulator</strong> with a validation layer. " +
        "He also built <strong>Ripple</strong>, a wave-interference puzzle game. " +
        "Want details on any?",
      chips: ["Tell me about GlassDB", "Tell me about the Plain language", "Tell me about the NYC real estate map"],
    },
    {
      keywords: ["skill", "skills", "tech", "stack", "language", "languages", "tools",
        "technology", "technologies", "programming", "frameworks", "framework",
        "python", "java", "ocaml", "sql", "tensorflow", "fastapi"],
      answer:
        "Tyler works in <strong>Python, Java, C, Rust, OCaml, and SQL</strong>, with " +
        "<strong>PyTorch</strong> and <strong>TensorFlow</strong> for ML, plus " +
        "JavaScript / <strong>TypeScript &amp; React</strong>, HTML / CSS, " +
        "<strong>FastAPI</strong>, <strong>PostgreSQL/PostGIS</strong>, " +
        "<strong>Three.js/WebGL</strong>, and Git. He's comfortable across ML, " +
        "recommendation systems, data engineering and geospatial work, simulation, " +
        "systems programming, computer graphics, and web.",
    },
    {
      keywords: ["looking", "hiring", "hire", "job", "jobs", "role", "roles",
        "internship", "intern", "opportunity", "opportunities", "available",
        "employment", "seeking", "open to", "looking for"],
      answer:
        "Tyler is <strong>open to software engineering roles</strong> and graduates in " +
        "December 2026. The fastest way to reach him is email. Want his contact info?",
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
        "Engineering, with a minor in Business, graduating <strong>December 2026</strong>.",
    },
    {
      keywords: ["who", "about", "yourself", "background", "bio", "intro", "introduce",
        "summary"],
      answer:
        "<strong>Tyler Forstrom</strong> is a computer science student at Cornell " +
        "(graduating December 2026, business minor). He likes building things end to end " +
        "and cares about whether they actually work. He's interned as an app developer " +
        "at Kahua and co-founded an investing club at Cornell.",
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
        "I can tell you about Tyler's background, his projects (TickerPulse — a social " +
        "sentiment & trend radar for stocks, the NYC Real Estate Map, " +
        "Plain — his own programming language, GlassDB — a from-scratch SQL database " +
        "engine in Rust, the Mathematical Solver — a from-scratch math & stats engine, " +
        "BanditFeed, an AI Portfolio Insight Copilot " +
        "with portfolio building and simulation-backed estimates, an agent-based stock " +
        "market simulator, Photon Forge, and the Ripple puzzle game), the tech he uses, " +
        "what he's looking for, or how to contact him. What would you like to know?",
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
    "Hmm, that one's outside what I know — I'm a small bot that sticks to the facts " +
    "I was given rather than guessing. I can tell you about Tyler's projects, his " +
    "skills, what he's looking for, or how to reach him.";

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
        "Hi! 👋 I can answer questions about Tyler and his work — what he's built, " +
          "the tech he uses, or how to get in touch. Ask away, or tap a suggestion.",
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
