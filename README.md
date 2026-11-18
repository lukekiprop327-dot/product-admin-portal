# Product Admin Portal

A React single page application for a coffee store ("Coffee R Us"). Visitors can browse and search products, and an administrator can add, edit and delete them. Data is persisted through a simulated backend (json-server).

## Features

- Landing page with store info fetched from the backend
- Shop page with live search and origin (location) checkbox filters
- Admin Portal with a validated form to add products (POST)
- Product detail page to edit price and description (PATCH) and delete products (DELETE)
- Client-side routing with a navigation bar
- Responsive layout based on the design mock-up

## Routes

| Route | Description |
|---|---|
| `/` | Home / landing page |
| `/shop` | Product grid with search and filters |
| `/shop/:id` | Product detail: edit and delete |
| `/admin` | Admin Portal: add product form and product list |

## Tech Stack

React (Vite), React Router, json-server, Vitest, React Testing Library

## Hooks Used

- Standard: `useState`, `useEffect`, `useContext`, `useRef`, `useId`, `useParams`, `useNavigate`
- Custom: `useFetch` (generic GET), `useProducts` (products state and CRUD actions)

## Component Tree

```
App (ProductsProvider)
├── NavBar
└── Routes
    ├── HomePage
    ├── ShopPage
    │   ├── SearchBar
    │   ├── OriginFilter
    │   └── ProductCard (×n)
    ├── ProductDetailPage
    ├── AdminPage
    │   └── ProductForm
    └── NotFoundPage
```

## Getting Started

```bash
git clone https://github.com/luke kiprop 327-dot/product-admin-portal.git
cd product-admin-portal
npm install
```

Run the backend and the app in two terminals:

```bash
npm run server   # json-server at http://localhost:3001
npm run dev      # app at http://localhost:5173
```

Run the tests:

```bash
npx vitest run
```

## Known Limitations

- The json-server backend must be running for data to load.
- No authentication: anyone can open the Admin Portal.
- Only price and description are editable on the detail page.