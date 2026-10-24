# Deltablock static prototype

Clickable HTML prototype of the Deltablock client portal. Sample data only (`js/data.js`); changes you make while clicking
around (invites, tickets, sign-up links, requests) are kept in your browser's localStorage.

Start at `login.html` and pick a role in "Prototype: sign in as": client, multi-company client, guest or admin.
Every page uses the same sidebar and top bar from `js/app.js`; each role gets its own menu and landing page.

After changing a page's classes run `npm run build` to rebuild `css/style.css`.
