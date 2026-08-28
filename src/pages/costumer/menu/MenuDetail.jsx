import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import CostumizationOption from "../../../components/costumer/menu/CostumizationOption";
import { menuItems } from "../../../data/menuData";

import { useCart } from "../../../context/CartContext";

export default function MenuDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { addToCart } = useCart();

  // =========================================================
  // FIND PRODUCT
  // =========================================================

  const product = useMemo(() => {
    return menuItems.find(
      (item) => item.id === Number(id)
    );
  }, [id]);

  // =========================================================
  // STATE
  // =========================================================

  const [costumizations, setCostumizations] = useState({
    cheese: false,
    onion: false,
  });

  const [notes, setNotes] = useState("");

  // =========================================================
  // PRODUCT NOT FOUND
  // =========================================================

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffcf4] dark:bg-[#121212] transition-colors duration-300">
        <p className="font-semibold text-[#111] dark:text-white">
          Menu tidak ditemukan.
        </p>
      </main>
    );
  }

  // =========================================================
  // CUSTOMIZATION PRICE
  // =========================================================

  const extraPrice =
    (costumizations.cheese ? 5000 : 0) +
    (costumizations.onion ? 5000 : 0);

  const totalPrice =
    product.price + extraPrice;

  // =========================================================
  // TOGGLE CUSTOMIZATION
  // =========================================================

  const toggleCostumization = (name) => {
    setCostumizations((current) => ({
      ...current,
      [name]: !current[name],
    }));
  };

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = () => {
    const cartItem = {
      ...product,

      costumizations: {
        cheese: costumizations.cheese,
        onion: costumizations.onion,
      },

      notes,

      price: totalPrice,
    };

    // Tambahkan ke keranjang
    addToCart(cartItem);

    // Kembali ke menu TANPA loading
    navigate("/", {
      state: {
        skipLoading: true,
      },
    });
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fffcf4] dark:bg-[#121212] transition-colors duration-300">

      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}

      <section className="relative h-[458px] overflow-hidden bg-[#fffcf4] dark:bg-[#121212] transition-colors duration-300">

        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Kembali"
          className="
            absolute
            left-[28px]
            top-[78px]
            z-30
            flex
            h-[46px]
            w-[46px]
            items-center
            justify-center
            rounded-full
            border
            border-[#e8e5df]
            dark:border-[#333333]
            bg-white
            dark:bg-[#1e1e1e]
            text-[#111]
            dark:text-white
            transition
            active:scale-95
          "
        >
          <ArrowLeft
            size={25}
            strokeWidth={1.8}
          />
        </button>


        {/* PRODUCT IMAGE */}

        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            pt-[45px]
          "
        >
          <img
            src={product.image}
            alt={product.name}
            className="
              h-[320px]
              w-[360px]
              object-contain
            "
          />
        </div>

      </section>


      {/* =====================================================
          DETAIL CARD
      ===================================================== */}

      <section
        className="
          relative
          -mt-[1px]
          min-h-[500px]
          rounded-t-[24px]
          border-t
          border-[#e4e0d8]
          dark:border-[#333333]
          bg-[#fffcf4]
          dark:bg-[#1e1e1e]
          px-[28px]
          pb-8
          pt-[42px]
          shadow-[0_-2px_10px_rgba(0,0,0,0.03)]
          transition-colors
          duration-300
        "
      >

        {/* ===================================================
            NAME + PRICE
        =================================================== */}

        <div className="flex items-center justify-between gap-4">

          <h1
            className="
              font-anton
              text-[28px]
              uppercase
              leading-none
              text-[#111]
              dark:text-white
              transition-colors
              duration-300
            "
          >
            {product.name}
          </h1>

          <span
            className="
              whitespace-nowrap
              text-[26px]
              font-extrabold
              text-[#111]
              dark:text-white
              transition-colors
              duration-300
            "
          >
            Rp{" "}
            {product.price.toLocaleString("id-ID")}
          </span>

        </div>


        {/* ===================================================
            DESCRIPTION
        =================================================== */}

        <p
          className="
            mt-[20px]
            text-[18px]
            leading-[1.55]
            text-[#5d5a57]
            dark:text-[#a1a1aa]
            transition-colors
            duration-300
          "
        >
          {product.description}
        </p>


        {/* ===================================================
            CUSTOMIZATION
        =================================================== */}

        <div className="mt-[26px]">

          <h2
            className="
              text-[17px]
              font-bold
              tracking-wide
              text-[#111]
              dark:text-white
              transition-colors
              duration-300
            "
          >
            CUSTOMIZATION
          </h2>

          <div className="mt-[7px] border-t border-[#e8e4dc] dark:border-[#333333] transition-colors duration-300" />

          <div className="mt-[24px] space-y-[24px]">

            <CostumizationOption
              label="Extra Cheese"
              price={5000}
              checked={costumizations.cheese}
              onChange={() =>
                toggleCostumization("cheese")
              }
            />

            <CostumizationOption
              label="Extra Onion"
              price={5000}
              checked={costumizations.onion}
              onChange={() =>
                toggleCostumization("onion")
              }
            />

          </div>

        </div>


        {/* ===================================================
            NOTES
        =================================================== */}

        <div className="mt-[24px]">

          <input
            type="text"
            placeholder="Notes (Optional)"
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            className="
              h-[59px]
              w-full
              rounded-[17px]
              border
              border-[#e5e1da]
              dark:border-[#444444]
              bg-white
              dark:bg-[#2d2d2d]
              px-[15px]
              text-[15px]
              text-[#111]
              dark:text-white
              outline-none
              placeholder:text-[#999]
              dark:placeholder:text-[#888888]
              focus:border-[#292826]
              dark:focus:border-white
              transition-colors
              duration-300
            "
          />

        </div>


        {/* ===================================================
            ADD TO CART
        =================================================== */}

        <button
          type="button"
          onClick={handleAddToCart}
          className="
            mt-[31px]
            flex
            h-[61px]
            w-full
            items-center
            justify-between
            gap-3
            rounded-[18px]
            bg-[#292826]
            dark:bg-white
            px-[22px]
            text-white
            dark:text-[#111]
            transition
            active:scale-[0.98]
          "
        >

          <span
            className="
              whitespace-nowrap
              text-[12px]
              font-bold
              tracking-[0.3px]
            "
          >
            TAMBAH KE KERANJANG
          </span>

          <span
            className="
              whitespace-nowrap
              text-[16px]
              font-bold
            "
          >
            Rp{" "}
            {totalPrice.toLocaleString("id-ID")}
          </span>

        </button>

      </section>

    </main>
  );
}