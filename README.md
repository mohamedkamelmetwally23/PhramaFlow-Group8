<!-- PROJECT LOGO -->
<p align="center">
  <img src="assets/imgs/logo.png" alt="PharmaFlow logo" width="80" height="80" />
  <br />
  <strong><font size="6">PharmaFlow</font></strong>
  <br />
  <sub><b>Pharmacy Inventory Management — responsive, lightweight, and mock‑API driven</b></sub>
</p>

<div align="center">

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](#) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen)](https://pharma-flow-black.vercel.app/)

</div>

## Description

A comprehensive web-based inventory system tailored for pharmacies. Manage medicines, track expiry dates, handle suppliers, and generate smart reports.
_Project developed as part of the ITI Full‑Stack (MEARN) scholarship program._

---

## Key Features

- 📊 **Dashboard** – overview of inventory, KPIs and real‑time alerts
- 🧾 **Product CRUD** – add, edit, delete, view products with unique SKU
- 🗂️ **Categories & Suppliers** – manage pharmaceutical categories (dosage forms) and supplier contacts
- 📦 **Purchase Orders** – create, send, receive orders; auto‑update stock on reception
- 🔧 **Stock Adjustments** – manual corrections with reasons (increase/decrease) – no negative stock allowed
- 🚨 **Low‑stock & Reorder Level Alerts** – automatic warnings when quantity ≤ reorderLevel
- 📊 **Reports** – low stock report, inventory valuation, category summary with charts (Chart.js)
- 📝 **Activity Log** – full audit trail of all actions (create, update, delete, receive, adjust)
- 🔔 **Custom Notifications** – in‑app toast notifications for success/error/warning
- 📱 **Responsive UI** – Bootstrap 5, works on desktop, tablet and mobile
- 🔐 **Authentication** – login with token stored in cookies (2‑day expiry), role‑based views

---

## Technologies

- **Frontend**: HTML5, CSS3, Bootstrap 5, JavaScript (ES6+), Chart.js, Font Awesome 6
- **Backend (Mock)**: json-server (mock REST API)
- **Tooling**: `live-server`, `npm`, `npm-run-all`

---

## 📂 Project Structure

```plaintext
PharmaFlow/
├─ index.html                     # Main dashboard entry point
├─ FormRender.js                  # Modal/form helper scripts
├─ package.json                   # npm scripts and dependencies
├─ README.md                      # Project documentation
├─ .gitignore                     # Git ignore rules
├─ server/                        # Mock API data for json-server
│  ├─ db.json                     # Development database snapshot
│  └─ *.json                      (personal copies, ignored)
├─ views/                         # HTML pages for each section
│  ├─ activity-log.html
│  ├─ categories.html
│  ├─ orders.html
│  ├─ products.html
│  ├─ reports.html
│  ├─ stock-adjustments.html
│  └─ suppliers.html
└─ assets/                        # Front-end assets
   ├─ api/                        # API client + resource‑specific modules
   ├─ components/                 # Reusable UI components (table, forms)
   ├─ css/                        # Stylesheets (custom + Bootstrap)
   ├─ imgs/                       # Images, icons, logo
   ├─ libs/                       # Third‑party libraries (Bootstrap, FontAwesome)
   ├─ models/                     # Data model classes (Product, Category, etc.)
   ├─ pages/                      # Page‑specific JavaScript logic
   └─ utils/                      # Helpers, constants, notification system
```

Note: JavaScript sources are organized under `assets/` (API helpers, UI components, page scripts, models and utilities).

---

## Getting Started

Follow these steps to run the project locally.

```bash
# Clone the repository
git clone https://github.com/mohamedkamelmetwally23/PhramaFlow-Group8.git
cd PhramaFlow-Group8

# Install dependencies
npm install

# Run both json-server (mock API) and live-server (frontend) in parallel
npm run dev
```

- The `dev` script runs two services in parallel (defined in `package.json`):
  - `json-server` (mock API) — runs on port `3000`
  - `live-server` (static front-end) — runs on port `2210`

Open your browser to the live-server address (typically http://127.0.0.1:2210 or http://localhost:2210) to view the app.

---

## API Endpoints

The mock database (`server/db.json`) exposes the following top-level resources.
All endpoints support full CRUD via json‑server.

| Resource          | Method | Endpoint             | Description                           |
| ----------------- | -----: | -------------------- | ------------------------------------- |
| Categories        |    GET | /categories          | List all categories                   |
| Categories        |    GET | /categories/:id      | Get a category by id                  |
| Categories        |   POST | /categories          | Create a new category                 |
| Categories        |    PUT | /categories/:id      | Update category                       |
| Categories        | DELETE | /categories/:id      | Delete category                       |
| Products          |    GET | /products            | List all products                     |
| Products          |    GET | /products/:id        | Get product by id                     |
| Products          |   POST | /products            | Create product                        |
| Products          |    PUT | /products/:id        | Update product                        |
| Products          | DELETE | /products/:id        | Delete product                        |
| Suppliers         |    GET | /suppliers           | List suppliers                        |
| Suppliers         |   POST | /suppliers           | Create supplier                       |
| Suppliers         |    PUT | /suppliers/:id       | Update supplier                       |
| Suppliers         | DELETE | /suppliers/:id       | Delete supplier                       |
| Purchase Orders   |    GET | /purchase_orders     | List purchase orders                  |
| Purchase Orders   |   POST | /purchase_orders     | Create purchase order                 |
| Purchase Orders   |    PUT | /purchase_orders/:id | Update order (receive, change status) |
| Stock Adjustments |    GET | /stock_adjustments   | List adjustments                      |
| Stock Adjustments |   POST | /stock_adjustments   | Record manual adjustment              |
| Activity Log      |    GET | /activity_log        | List activity log entries             |
| Activity Log      |   POST | /activity_log        | Record an action                      |
| Users             |    GET | /users               | List users (if present)               |

> Note: status of products is not stored – it is calculated client‑side using quantity and reorderLevel.
> All POST, PUT, DELETE requests persist changes to db.json (when running json‑server locally).

---

## Team

Built by the project team.

| Name                         | Role                 | LinkedIn Profile                                                                                                                                                    |
| ---------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mahmoud Mostafa Elshahat** | Full‑Stack Developer | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mahmoudmostafa99)                  |
| **Hababa Ahmed Elbaghdady**  | Full‑Stack Developer | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/habeba-ahmed-elbaghdady-6a9b851b4) |
| **Hajar Zain El Abidin**     | Full‑Stack Developer | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/hajarzain222)                      |
| **Mohammed Kamel Metwally**  | Full‑Stack Developer | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mohammed-kamel-5262a7280)          |

---

## 🙏 Acknowledgements

We extend our deepest thanks to our supervisor **Eng. Aya Shehata** at ITI for their continuous guidance and support.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

⭐ If you like this project, don't forget to give it a star on GitHub! ⭐
