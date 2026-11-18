import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useProductsContext } from "../context/ProductsContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading, updateProduct, deleteProduct } = useProductsContext();

  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const priceRef = useRef(null);

  const product = products.find((p) => String(p.id) === id);

  // Focus the price field when edit mode opens
  useEffect(() => {
    if (isEditing) priceRef.current?.focus();
  }, [isEditing]);

  if (loading) return <main className="container"><p>Loading...</p></main>;

  if (!product) {
    return (
      <main className="container">
        <section className="card">
          <h1>Product not found</h1>
          <Link to="/shop">Back to shop</Link>
        </section>
      </main>
    );
  }

  const startEditing = () => {
    setPrice(String(product.price));
    setDescription(product.description);
    setError("");
    setIsEditing(true);
  };

  // PATCH: only the changed fields are sent
  const handleSave = async (e) => {
    e.preventDefault();
    if (!(Number(price) > 0) || !description.trim()) {
      setError("Enter a valid price and description.");
      return;
    }
    try {
      await updateProduct(product.id, {
        price: Number(price),
        description: description.trim(),
      });
      setIsEditing(false);
    } catch {
      setError("Could not save changes.");
    }
  };

  const handleDelete = async () => {
    await deleteProduct(product.id);
    navigate("/shop");
  };

  return (
    <main className="container">
      <section className="card">
        <Link to="/shop">← Back to shop</Link>
        <h1>{product.name}</h1>
        <p className="muted">Origin: {product.origin}</p>

        {isEditing ? (
          <form className="form" onSubmit={handleSave}>
            <label htmlFor="edit-price">Price</label>
            <input
              id="edit-price"
              ref={priceRef}
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <label htmlFor="edit-description">Description</label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {error && <p className="error" role="alert">{error}</p>}
            <div className="actions">
              <button type="submit" className="btn">Save</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <p>{product.description}</p>
            <p className="price">${product.price.toFixed(2)}</p>
            <div className="actions">
              <button type="button" className="btn" onClick={startEditing}>Edit</button>
              <button type="button" className="danger" onClick={handleDelete}>Delete</button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}