import React, { useState, useEffect } from 'react';
import { QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QrisPaymentPage() {
  const navigate = useNavigate();

  // ISI ATAU GANTI PATH GAMBAR DI SINI JIKA SUDAH ADA
  // Contoh: const qrisImage = '/images/qris-toko.png';
  const qrisImage = null; 

  const totalAmount = 166000;
  const [timeLeft, setTimeLeft] = useState(299); // 04:59 (in seconds)

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

        {/* QR Code Container / Placeholder */}
        <div className="w-full aspect-square bg-[#D9D9D9] rounded-2xl flex items-center justify-center overflow-hidden mb-6 shadow-inner border border-gray-200/50">
          {qrisImage ? (
            <img 
              src={qrisImage} 
              alt="QRIS Code" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="text-center p-6">
              <QrCode size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-xs text-gray-400 font-medium">QRIS Image Placeholder</p>
            </div>
          )}
        </div>

        {/* Total Label */}
        <div className="text-center">
          <span className="font-bold text-base text-gray-900">Total</span>
          <p className="font-display text-2xl text-gray-900 mt-1">
            Rp {totalAmount.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Done Button */}
      <button 
        onClick={() => navigate('/')}
        className="w-full bg-zinc-900 text-white font-bold tracking-wider rounded-2xl py-4 transition-colors hover:bg-black shadow-lg text-sm uppercase mt-6"
      >
        DONE
      </button>
    </div>
  );
}