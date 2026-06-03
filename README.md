# Personal portfolio — Tyler Forstrom

A fast, self-contained one-page portfolio. No frameworks, no build step — just
`index.html`, `styles.css`, and `script.js`. Drops onto any static host and
takes a custom domain (e.g. `yourname.site`) in a couple of clicks.

## View it locally

Double-click `index.html`, or serve the folder:

```powershell
python -m http.server 8091
# then open http://localhost:8091
```

## Fill these in (the only edits you need)

Search `index.html` for `TODO` — every spot to personalize is marked:

- [ ] **LinkedIn URL** — two `href="#"` buttons (hero + contact).
- [ ] **Email** — `mailto:you@example.com` in the contact section.
- [ ] **Résumé** — drop a `resume.pdf` in this folder, or delete the
      "Résumé (PDF)" button if you're not ready.
- [ ] **Live demo link** for the market sim — replace its `href="#"` with the
      URL you get after deploying that project.
- [ ] **About paragraph** — the bracketed `[ ... ]` text. One or two honest
      sentences about who you are and what you're looking for.
- [ ] **Projects 2 & 3** — the two dashed "placeholder" cards. Copy the card
      block for more; delete any you don't need.
- [ ] **Skills list** — edit the chips under "Tools I work with" to match you.

## Deploy it free

Static files live at the **repo root** (not a subfolder), so every host's
default settings work:

- **Netlify**: New site → import from GitHub → Deploy. Publish directory is the
  root (leave blank). Rename the site to something like `tyler-forstrom`.
- **Cloudflare Pages**: Create → Pages → connect repo → Framework preset
  **None**, build command empty, output directory `/`.
- **GitHub Pages**: Settings → Pages → deploy from branch `main`, folder
  `/ (root)`.

Every push to `main` redeploys automatically.

## Point your domain

After buying `yourname.site` (Cloudflare Registrar, Porkbun, and Namecheap are
all good), open your host's **Domains → Add a custom domain**, enter it, and add
the one or two DNS records it shows you. Free HTTPS is automatic.

> Heads up on `.site`: the first year is cheap but **renewals can jump** (often
> $25–35/yr). Check the renewal price before buying. `.com`, `.dev`, and `.me`
> are solid alternatives if you'd rather lock in a steadier price.

## Make it yours

Colors live in `styles.css` under `:root`. The accent (`--accent`) is the indigo
used throughout — change that one value to re-theme the whole site.
