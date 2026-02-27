# StockPulse - Digital Inventory Management

StockPulse is a modern, comprehensive inventory management system designed for retailers to efficiently track stock, manage products, and analyze sales performance. Built with React and TypeScript, it offers a responsive and intuitive interface for both administrators and staff.

## 🚀 Features

### 📊 Dashboard
- **Real-time Metrics:** Instant view of total items, inventory value, low stock alerts, and daily sales.
- **Visual Analytics:** Interactive charts showing stock movement trends over the last 30 days.
- **Activity Feed:** Live feed of recent transactions (stock in/out).

### 📦 Inventory Management
- **Product Tracking:** Detailed product list with images, SKUs, categories, and stock levels.
- **Smart Search:** Fuzzy search capability to find products by name, SKU, supplier, or description.
- **Advanced Filtering:** Filter by category and stock status (In Stock, Low Stock, Critical).
- **CRUD Operations:** Add, edit, and delete products (Admin only for critical actions).

### 🔄 Stock Operations
- **Stock In:** Record incoming shipments, update quantities, and track supplier details.
- **Stock Out:** Process sales, record damaged goods, expired items, or internal usage.
- **Transaction History:** Detailed log of all stock movements with timestamps and user attribution.

### 👥 Role-Based Access Control
- **Admin Role:** Full access to all features, including cost price visibility, product deletion, and sensitive reports.
- **Staff Role:** Optimized interface for daily operations (sales, restocking) with restricted access to sensitive business data.

### 🎨 UI/UX
- **Dark Mode:** Fully supported dark theme for low-light environments.
- **Responsive Design:** Works seamlessly on desktop and tablet devices.
- **Offline Awareness:** Visual indicators when the application loses internet connection.

## 🛠️ Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **Persistence:** LocalStorage (Client-side persistence)

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stockpulse.git
   cd stockpulse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

### Demo Accounts

For testing purposes, the application comes with pre-configured accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@stockpulse.com` | `admin123` |
| **Staff** | `staff@stockpulse.com` | `staff123` |

## 📱 Application Structure

```
/src
  /components
    Dashboard.tsx       # Main analytics view
    Inventory.tsx       # Product list and management
    StockOperations.tsx # Stock in/out forms
    Layout.tsx          # Main app shell and navigation
    ...
  App.tsx               # Main application logic and routing
  db.ts                 # LocalStorage data persistence layer
  types.ts              # TypeScript interfaces and enums
```

## 🔒 Data Persistence

StockPulse uses the browser's `localStorage` to persist data. This means:
- Data remains available even after refreshing the page.
- Clearing browser cache will reset the application to its initial state with mock data.

## 📄 License

This project is licensed under the MIT License.
