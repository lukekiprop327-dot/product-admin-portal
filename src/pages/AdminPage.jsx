import { Link } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { useProductsContext } from "../context/ProductsContext";

export default function AdminPage() {
  const { products, addProduct } = useProductsContext();

  return (
    <div className="admin">
      <div className="admin-panel">
        <ProductForm onSubmit={addProduct} />

        <section className="manage">
          <h2>Manage Products</h2>
          <ul className="manage-list">
            {products.map((p) => (
              <li key={p.id}>
                <span>{p.name} (${p.price.toFixed(2)})</span>
                <Link to={`/shop/${p.id}`}>Edit</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}