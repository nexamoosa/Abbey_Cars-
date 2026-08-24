# React + Vite

## Google Sheets booking sync

Bookings are saved to MySQL first and then sent server-side to Google Sheets. To enable the sync:

1. Create or open a Google Sheet and open **Extensions > Apps Script**.
2. Paste the contents of `google-sheets-apps-script.gs`.
3. Set a private token in `SECRET_TOKEN`.
4. Deploy the script as a web app, allowing access to anyone with the link, and copy its `/exec` URL.
5. Configure Apache/PHP environment variables:

```text
ABBEY_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
ABBEY_GOOGLE_SHEETS_TOKEN=the_same_private_token
```

Restart Apache after setting the variables. New bookings from every booking form will then be appended to a `Bookings` sheet. Existing bookings are not sent automatically; export or backfill those separately if needed.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
