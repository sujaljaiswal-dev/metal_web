# Metal Web — React Frontend

A Vite + React rebuild of the Metal Web agency website with routed pages and reusable components.

## Structure

```
frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
  ├── App.jsx
  ├── main.jsx
  ├── styles.css
  ├── components/
  ├── data/
  └── pages/
```

## Sections

| Route      | Description                            |
|------------|----------------------------------------|
| `/`        | Full homepage with all sections        |
| `/services`| Services-focused page                  |
| `/work`    | Portfolio-focused page                 |
| `/agency`  | Process and team page                  |
| `/contact` | Contact-focused CTA page               |

## Features

- ✅ Routed navigation with React Router
- ✅ Sticky navbar with scroll shadow
- ✅ Mobile hamburger menu
- ✅ Scroll-triggered reveal animations
- ✅ Ticker pause on hover
- ✅ Fully responsive (desktop / tablet / mobile)

## Usage

Install dependencies and run the Vite dev server from `frontend/`.

```bash
npm install
npm run dev
```

To deploy: build with `npm run build` and publish the generated `dist/` folder.

## Customisation

- **Colors**: Edit `:root` variables in `css/style.css`
  - `--y` = accent yellow (`#efe13f`)
  - `--dark` = navy text/border (`#0d1b2a`)
- **Content**: Edit the page components in `src/pages/` and shared data in `src/data/siteData.js`
- **Styles**: Edit `src/styles.css`
- **Fonts**: Swap Google Fonts `<link>` in `index.html` and update `--font-sans` / `--font-mono`
