# FormLens

Turns Excel and CSV form submissions into a focused, one-response-at-a-time review workspace. Files and review metadata remain entirely in the browser and are persisted with IndexedDB.

## Features

- Drag-and-drop `.xlsx`, `.xls`, and `.csv` import with friendly validation
- Instant worksheet switching, response search, category filters, and sorting
- Adaptive short- and long-answer layout with empty-field controls
- Finished status, favorites, five-point ratings, and private notes
- Always-visible progress and Excel export with answers and review notes
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
