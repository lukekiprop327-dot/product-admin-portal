import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/shop">Shop</NavLink>
      <NavLink to="/admin">Admin Portal</NavLink>
    </nav>
  );
}