import { useState, useEffect, createContext } from "react";
import type { Product } from "../types/product.type";
import axios from "axios";
const FAKE_STORE_API_URL = "https://fakestoreapi.com/products";

const fetchProducts = async () => {
  const response = await axios.get(FAKE_STORE_API_URL);
  return response;
};

interface ProductsContext {
  products: Product[];
  isLoading: boolean;
  error?: string;
  addProduct: (product: Product) => void;
}

const initialValues: ProductsContext = {
  products: [],
  isLoading: true,
  addProduct: () => {},
};

export const ProductsContext = createContext(initialValues);

interface ProductsContextProviderProps {
  children: React.ReactNode;
}

export const ProductsContextProvider = (props: ProductsContextProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      try {
        setError(undefined);
        setIsLoading(true);
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts.data);
      } catch (error) {
        console.error("ERROR FETCHING PRODUCTS", error);
        setError("Failed to fetch products, please try again later.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

    const addProduct = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  return (
    <ProductsContext.Provider
      value={{
        products: products,
        isLoading: isLoading,
        error: error,
        addProduct: addProduct
      }}
    >
      {props.children}
    </ProductsContext.Provider>
  );
};
