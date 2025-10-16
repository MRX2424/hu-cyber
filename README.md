# HU Cybersecurity Web Academy

Static, Tailwind-powered training site for the HU Cybersecurity community.

## Local development

1. Ensure you have Node.js 18 or newer installed.
2. Install dependencies (none are required, but running `npm install` will create a lockfile if you prefer).
3. Start the local server:

```bash
npm start
```

The site will be served from [http://localhost:4173](http://localhost:4173). You can change the port by setting the `PORT` environment variable:

```bash
PORT=5000 npm start
```

The custom server ships with sensible MIME types for all static assets and automatically resolves `index.html` files when navigating to directories like `/tracks/` or `/lesson/...`.

To stop the server, press `Ctrl+C` in the terminal.
