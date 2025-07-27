# Interactive Periodic Table

A modern, interactive, and responsive periodic table built with **HTML**, **CSS**, and **JavaScript**. Explore all 118 elements with:

- **Color‑coded categories** matching IUPAC/PubChem standards  
- **Search** (starts‑with) by name, symbol or atomic number  
- **Hover tooltips** and **clickable modals** with detailed element data  
- **Dark mode** toggle (persisted in localStorage)  
- **Loading & error states**, plus **smooth animations**  
- Full **keyboard accessibility** (focus, Enter/Space to open modal, Escape to close)  

---

## 📦 Getting Started

### Clone the repo

```bash
git clone https://github.com/GeorgiEnev/periodic-table.git
cd periodic-table
```
## 🚀 Features

| Feature                    | Description                                                                   |
| -------------------------- | ----------------------------------------------------------------------------- |
| **Color‑coded categories** | Alkali metals, noble gases, lanthanides, actinides, & more                    |
| **Search**                 | Case‑insensitive **starts‑with** filter on name, symbol, or atomic number     |
| **Hover tooltips**         | Quick glance at element name, symbol & number                                 |
| **Detailed modals**        | Atomic mass, electron config, electronegativity, melting/boiling points, etc. |
| **Dark mode**              | Toggle between light/dark themes; remembers your preference                   |
| **Responsive design**      | Adapts grid & UI for desktop, tablet, and mobile                              |
| **Loading & error states** | Graceful “Loading…” spinner and retry button on failure                       |
| **Animations**             | Elements animate in on load, pulse on search match, hover & modal transitions |

## 🛠️  File Structure
```
periodic-table-explorer/
├─ index.html         # Main page markup, inline JSON template
├─ styles.css         # Tailwind‑inspired modern styling & theming
├─ script.js          # Fetch, render, search, modal & theme logic
├─ elements.json      # Full 118‑element dataset (IUPAC categories added)
└─ README.md          # This file
```
