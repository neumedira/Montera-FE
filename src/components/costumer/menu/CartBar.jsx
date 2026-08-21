import { ShoppingBasket } from "lucide-react";
import { useNavigate } from "react-router-dom";

function formatPrice(price) {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export default function CartBar({ itemCount, total }) {
  const navigate = useNavigate();

  if (itemCount === 0) return null;

  const handleClick = () => {
    navigate("/cart");
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex w-[270px] -translate-x-1/2 items-center overflow-hidden rounded-full bg-[#292826] text-white shadow-xl">
      <button
        onClick={handleClick}
        className="flex h-[48px] w-[73px] items-center justify-center rounded-full bg-[#292826]"
      >
        <ShoppingBasket size={23} />
      </button>

      <button
        onClick={handleClick}
        className="flex h-[48px] flex-1 items-center justify-center gap-5 rounded-full bg-[#292826] text-[14px] font-semibold"
      >
        <span>{itemCount} items</span>

        <span>{formatPrice(total)}</span>
      </button>
    </div>
  );
}