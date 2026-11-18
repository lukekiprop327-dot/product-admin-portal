import { useState } from "react";
import { useProductsContext } from "../context/ProductsContext";
import SearchBar from "../components/SearchBar";
import OriginFilter from "../components/OriginFilter";
import ProductCard from "../components/ProductCard";

export default function ShopPage() {
  const { products, loading, error } = useProductsContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrigins, setSelectedOrigins] = useState([]);

  // Unique origins for the checkbox filter
  const origins = [...new Set(products.map((p) => p.origin))].sort();

  const toggleOrigin = (origin) => {
    setSelectedOrigins((prev) =>
      prev.includes(origin) ? prev.filter((o) => o !== origin) : [...prev, origin]
    );
  };

  // Derived value: name matches the search AND (no origin selected OR origin is selected)
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedOrigins.length === 0 || selectedOrigins.includes(p.origin))
  );

  if (loading) return <p className="container">Loading...</p>;
  if (error) return <p className="container error">{error}</p>;

  return (
    <div className="shop">
      <aside className="sidebar">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <OriginFilter origins={origins} selected={selectedOrigins} onToggle={toggleOrigin} />
      </aside>

      <section className="shop-content">
        {filtered.length === 0 ? (
          <p className="muted-light">No products found.</p>
        ) : (
          <ul className="product-list">
            {filtered.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}