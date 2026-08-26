import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Fungsi Tambah/Update Barang
  const addToCart = (product) => {
    setCart((current) => {
      // Cek apakah barang sudah ada di keranjang
      const existingItem = current.find(item => item.id === product.id);
      
      if (existingItem) {
        // Jika sudah ada, tambahkan quantity-nya saja
        return current.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      // Jika belum ada, masukkan sebagai barang baru dengan quantity = 1
      return [...current, { ...product, quantity: 1 }];
    });
  };

  // Fungsi Update Quantity khusus (untuk tombol + dan - di Cart)
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // Hapus jika quantity 0
      setCart(current => current.filter(item => item.id !== productId));
      return;
    }
    
    setCart(current =>
      current.map(item =>
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  // Hitung total item berdasarkan jumlah quantity
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Hitung total harga berdasarkan harga * quantity
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}