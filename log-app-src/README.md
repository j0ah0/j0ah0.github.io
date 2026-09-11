# log-app-src

Source for the `/log/` page's 3D carousel (React Three Fiber + drei),
adapted from https://codesandbox.io/p/sandbox/dc5fjy.

The Jekyll site has no build step, so this is built separately and the
output is committed as a single bundle at `../assets/log-app.js`, loaded
by `../log.html`. That page injects real post data as `window.__LOG_ITEMS__`
before the bundle runs (see `src/App.jsx`, which reads from that global).

## Editing

```
npm install
npm run dev       # local dev server, uses dummy data from index.html
```

## Deploying a change

```
npm run build
cp dist/log-app.js ../assets/log-app.js
```

Then commit `../assets/log-app.js` (and this source if you changed it) and push.
