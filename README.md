# FormLens

Turns Excel and CSV form submissions into a focused, one-response-at-a-time review workspace. Files and review metadata remain entirely in the browser and are persisted with IndexedDB.

## Features

- Drag-and-drop `.xlsx`, `.xls`, and `.csv` import with friendly validation
- Instant worksheet switching and response search
- Adaptive short- and long-answer layout with empty-field controls
- Reviewed status, stars, five-point ratings, and private notes
- Progress statistics and JSON metadata export
- Persistent light, dark, and system themes, density, type size, and review behavior
- Keyboard navigation and a virtualized response list for large workbooks

## Development

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm run build
```

FormLens has no API routes, backend, analytics, or database service. Spreadsheet content never leaves the device.
