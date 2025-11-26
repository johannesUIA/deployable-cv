# Lage portofolio
Lage cv med portofolio. Tilslutt er ideen å ta i bruk GitHub Actions for å innøve CI/CL.

## Media and components

- Images and other media should go in the `media/` folder (there's a `media/README.md` with guidance).
- The large `index.html` has been split into small fragments under `src/components/` and are loaded at runtime by `src/component-loader.js`.
- To add or edit content, update the appropriate file in `src/components/` (for example `src/components/projects.html`) or replace the placeholder image(s) in `media/`.

## Local setup

### Requirements

- Node.js 18+ (ships with `npm`).

### Install dependencies

```powershell
npm install
```

This downloads the Tailwind CLI (`@tailwindcss/cli`), which is required so `tailwindcss -i ./src/input.css -o ./styles.css --minify` works. Without installing, Windows reports `'tailwindcss' is not recognized`.

### Build CSS once

```powershell
npm run build
```

On new Windows machines the default PowerShell execution policy is `Restricted`, which blocks `npm.ps1` and yields `running scripts is disabled`. You can resolve it in one of two ways:

1. **One-off via cmd** (uses `npm.cmd`, no policy change):
	```powershell
	cmd /c "npm run build"
	```
2. **Allow local scripts** (persistent, recommended on dev laptops):
	```powershell
	Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
	npm run build
	```

Either approach will run the Tailwind CLI and emit `styles.css` in the repo root. Commit this file if the site is hosted statically (e.g., GitHub Pages) so the latest styles are available without rebuilding on the server.

### Watch mode during development

```powershell
npm run dev
```

Use the same PowerShell workaround as above if scripts are blocked. The command stays running and rebuilds `styles.css` whenever files under `src/` change.

### Manual fallback (optional)

If you prefer not to use the npm scripts, you can invoke the Tailwind CLI directly via `npx`:

```powershell
cmd /c "npx tailwindcss -i ./src/input.css -o ./styles.css --minify"
```

## Troubleshooting

- `running scripts is disabled`: set the execution policy or run the command through `cmd /c` as shown above.
- `'tailwindcss' is not recognized`: run `npm install` first to download dependencies.
- No `styles.css`: ensure the build command finished without errors and that you have write permissions in the repo folder.

