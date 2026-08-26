import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // =========================================================
  // TAMBAH KE CART
  // =========================================================

  const addToCart = (product) => {
    setCart((current) => {
      const existingItem = current.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // =========================================================
  // UPDATE QUANTITY
  // =========================================================

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart((current) =>
        current.filter(
          (item) => item.id !== productId
        )
      );

      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      )
    );
  };

  // =========================================================
  // CLEAR CART
  // =========================================================

  const clearCart = () => {
    setCart([]);
  };

  // =========================================================
  // TOTAL ITEMS
  // =========================================================

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // =========================================================
  // TOTAL PRICE
  // =========================================================

  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  // =========================================================
  // PROVIDER
  // =========================================================

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,

        // PENTING
        clearCart,

        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// =========================================================
// USE CART
// =========================================================

export function useCart() {
  return useContext(CartContext);
}