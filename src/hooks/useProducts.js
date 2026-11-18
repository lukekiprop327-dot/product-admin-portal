import { useState, useEffect } from "react";
import { API_URL } from "../config";

const JSON_HEADERS = { "Content-Type": "application/json" };

// Custom hook: holds the products list and the CRUD actions that change it
export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // READ (GET)
  useEffect(() => {
    let ignore = false;

    fetch(`${API_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data) => !ignore && setProducts(data))
      .catch((err) => !ignore && setError(err.message))
      .finally(() => !ignore && setLoading(false));

    return () => {
      ignore = true;
    };
  }, []);

  // CREATE (POST)
  const addProduct = async (product) => {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Failed to add product");
    const created = await res.json();
    setProducts((prev) => [...prev, created]);
    return created;
  };

  // UPDATE (PATCH): only sends the changed fields
  const updateProduct = async (id, changes) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "PATCH",
      headers: JSON_HEADERS,
      body: JSON.stringify(changes),
    });
    if (!res.ok) throw new Error("Failed to update product");
    const updated = await res.json();
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  // DELETE
  const deleteProduct = async (id) => {
    const res = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete product");
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return { products, loading, error, addProduct, updateProduct, deleteProduct };
}