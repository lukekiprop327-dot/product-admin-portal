import { Link } from "react-router-dom";

export default function ProductCard({ id, name, description, origin, price }) {
  return (
    <li className="product-card">
      <Link to={`/shop/${id}`}>
        <h3>{name}</h3>
      </Link>
      <p>{description}</p>
      <p>{origin}</p>
      <p className="price">${price.toFixed(2)}</p>
    </li>
  );
}