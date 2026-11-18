import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { API_URL } from "../config";

export default function HomePage() {
  const { data: store, loading, error } = useFetch(`${API_URL}/store_info`);

  if (loading) return <p className="container">Loading...</p>;
  if (error) return <p className="container error">Could not load store info.</p>;

  return (
    <section className="hero">
      <h1>{store.name}</h1>
      <p>{store.description}</p>
      <p className="muted-light">Call us: {store.phone_number}</p>
      <Link to="/shop" className="btn">Browse the Shop</Link>
    </section>
  );
}