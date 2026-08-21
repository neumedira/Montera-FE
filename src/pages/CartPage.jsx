import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { initialCartItems } from '../data/dummyCart';
import CartItem from '../components/cart/CartItem';
import NotesInput from '../components/cart/NotesInput';
import OrderSummary from '../components/cart/OrderSummary';

export default function CartPage() {
  const navigate = useNavigate(); // 2. Inisialisasi hook navigate
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [note, setNote] = useState('');

  const handleUpdateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal;

  return (
    <div className="min-h-screen bg-[#FAF7F2] max-w-md mx-auto p-4 flex flex-col justify-between">
      <div>
        <div className="space-y-3">
          {cartItems.map(item => (
            <CartItem 
              key={item.id} 
              item={item} 
              onUpdateQuantity={handleUpdateQuantity} 
            />
          ))}
        </div>

        <NotesInput note={note} setNote={setNote} />

        <OrderSummary subtotal={subtotal} total={total} />
      </div>

      {/* 3. Tambahkan onClick untuk berpindah halaman */}
      <button 
        onClick={() => navigate('/order-details')}
        className="w-full bg-zinc-900 text-white font-bold tracking-wider rounded-2xl py-4 px-6 flex items-center justify-between hover:bg-black transition-colors shadow-lg"
      >
        <span>CHECKOUT</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
}