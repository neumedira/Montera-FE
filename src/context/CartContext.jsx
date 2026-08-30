import { createContext, useContext, useState } from "react";

const CartContext = createContext();

// =========================================================
// BUAT IDENTITAS ITEM CART
// =========================================================
//
// Setiap kombinasi produk + addon + notes dianggap sebagai
// satu variasi item cart.
//
// Contoh:
//
// Burger
// Burger + Cheese
// Burger + Egg
// Burger + Cheese + Egg
//
// semuanya punya cartKey berbeda.
//
// Bundle juga dipisahkan dari menu biasa berdasarkan type.
// =========================================================

const createCartKey = (product) => {
  const type = product.type || "menu";

  const productId =
    product.bundleId ??
    product.id ??
    product.menu_item_id ??
    "unknown";

  // =======================================================
  // ADDON KEY
  // =======================================================
  //
  // Untuk bundle, addon bisa berasal dari menu item berbeda.
  // Karena itu kita ikutkan menu_item_id jika tersedia.
  // =======================================================

  const addonIds = (product.addons || [])
    .map((addon) => {
      const menuItemId =
        addon.menu_item_id ??
        addon.menuId ??
        "";

      return `${menuItemId}:${addon.id}`;
    })
    .sort();

  // =======================================================
  // NOTES
  // =======================================================

  const notes = String(
    product.notes || ""
  ).trim();

  // =======================================================
  // HASIL CART KEY
  // =======================================================

  return [
    type,
    productId,
    addonIds.join(","),
    notes,
  ].join("|");
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // =========================================================
  // TAMBAH KE CART
  // =========================================================

  const addToCart = (product) => {
    const cartKey = createCartKey(product);

    setCart((current) => {
      const existingItem = current.find(
        (item) => item.cartKey === cartKey
      );

      // =====================================================
      // ITEM DENGAN KOMBINASI YANG SAMA
      // =====================================================

      if (existingItem) {
        return current.map((item) =>
          item.cartKey === cartKey
            ? {
                ...item,
                quantity:
                  Number(item.quantity || 0) + 1,
              }
            : item
        );
      }

      // =====================================================
      // ITEM BARU
      // =====================================================

      return [
        ...current,
        {
          ...product,
          cartKey,
          quantity: 1,
        },
      ];
    });
  };

  // =========================================================
  // UPDATE QUANTITY
  // =========================================================
  //
  // Bisa dipanggil dengan:
  //
  // updateQuantity(productId, quantity)
  //
  // atau:
  //
  // updateQuantity(productId, quantity, cartKey)
  //
  // cartKey lebih aman kalau produk yang sama punya beberapa
  // variasi addon.
  // =========================================================

  const updateQuantity = (
    productId,
    newQuantity,
    cartKey = null
  ) => {
    const quantity = Number(newQuantity);

    // =======================================================
    // HAPUS ITEM
    // =======================================================

    if (quantity <= 0) {
      setCart((current) =>
        current.filter((item) => {
          if (cartKey) {
            return item.cartKey !== cartKey;
          }

          return item.id !== productId;
        })
      );

      return;
    }

    // =======================================================
    // UPDATE ITEM
    // =======================================================

    setCart((current) =>
      current.map((item) => {
        const isTarget = cartKey
          ? item.cartKey === cartKey
          : item.id === productId;

        if (!isTarget) {
          return item;
        }

        return {
          ...item,
          quantity,
        };
      })
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
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  // =========================================================
  // TOTAL PRICE
  // =========================================================

  const totalPrice = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
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