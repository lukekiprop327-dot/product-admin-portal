import { createContext, useContext } from "react";
import useProducts from "../hooks/useProducts";

const ProductsContext = createContext(null);

// Provides products state and actions to every route
export function ProductsProvider({ children }) {
  const value = useProducts();
  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  );
}

export function useProductsContext() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProductsContext must be used inside ProductsProvider");
  }
  return context;
}