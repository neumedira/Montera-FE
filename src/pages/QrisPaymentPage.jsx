import React, { useState, useEffect } from 'react';
import { QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function QrisPaymentPage() {
  const navigate = useNavigate();
  
  // Ambil total harga dari CartContext
  const { totalPrice } = useCart();

  // Ubah ke '/images/qris-code.png' jika gambar QRIS sudah dimasukkan ke folder public/images/
  const qrisImage = '/images/qris-code.png';

  const [timeLeft, setTimeLeft] = useState(299); // 04:59 (dalam detik)

  // Timer Countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] max-w-md mx-auto p-4 flex flex-col justify-between">
      <div>
        {/* Header QRIS */}
        <div className="flex items-center gap-2 mb-6 text-gray-900">
          <QrCode size={24} />
          <h1 className="font-bold text-lg tracking-wider uppercase">QRIS</h1>
        </div>

        {/* Subtitle & Timer */}
        <div className="text-center mb-6">
          <p className="font-bold text-sm text-gray-900 mb-1">
            Complete the payment within the timeframe
          </p>
          <span className="font-display text-4xl text-gray-900 tracking-wider">
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* QR Code Container */}
        <div className="w-full aspect-square bg-[#D9D9D9] rounded-2xl flex items-center justify-center overflow-hidden mb-6 shadow-inner border border-gray-200/50">
          {qrisImage ? (
            <img 
              src={qrisImage} 
              alt="QRIS Store Code" 
              className="w-full h-full object-contain p-4 bg-white"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.classList.add('flex-col');
                e.target.parentElement.innerHTML = '<span class="text-xs text-gray-400 font-medium">Gambar /public/images/qris-code.png belum ditemukan</span>';
              }}
            />
          ) : (
            <div className="text-center p-6">
              <QrCode size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-xs text-gray-400 font-medium">QRIS Image Placeholder</p>
            </div>
          )}
        </div>

        {/* Total Label Dinamis */}
        <div className="text-center">
          <span className="font-bold text-base text-gray-900">Total</span>
          <p className="font-display text-2xl text-gray-900 mt-1">
            Rp {(totalPrice || 0).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Done Button */}
      <button 
        onClick={() => {
          // Opsional: Anda bisa memanggil fungsi clearCart() di sini
          navigate('/');
        }}
        className="w-full bg-zinc-900 text-white font-bold tracking-wider rounded-2xl py-4 transition-colors hover:bg-black shadow-lg text-sm uppercase mt-6"
      >
        DONE
      </button>
    </div>
  );
}