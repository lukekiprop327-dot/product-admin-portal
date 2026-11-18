import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "../components/ProductCard";

test("ProductCard shows name, description, origin and price", () => {
  render(
    <MemoryRouter>
      <ul>
        <ProductCard id={1} name="Test Coffee" description="Smooth" origin="Brazil" price={9.5} />
      </ul>
    </MemoryRouter>
  );

  expect(screen.getByText("Test Coffee")).toBeInTheDocument();
  expect(screen.getByText("Smooth")).toBeInTheDocument();
  expect(screen.getByText("Brazil")).toBeInTheDocument();
  expect(screen.getByText("$9.50")).toBeInTheDocument();
});