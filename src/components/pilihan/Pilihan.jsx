import { useNavigate } from "react-router-dom";

import monteraLogo from "../../assets/costumer/montera.png";
import takeawayIcon from "../../assets/costumer/boxicons_takeaway.png";
import dineInIcon from "../../assets/costumer/material-symbols_calendar-meal-outline.png";

export default function Pilihan() {
  const navigate = useNavigate();

  const handleDineIn = () => {
    navigate("/costumer/menu?type=dine-in");
  };

  const handleTakeAway = () => {
    navigate("/costumer/menu?type=take-away");
  };

  // Banyak kotak supaya selalu memenuhi seluruh layar
  const checkerBoxes = Array.from({ length: 80 });

  return (
    <div className="min-h-screen w-full bg-[#FFFCF3]">

      {/* =========================================
          BAGIAN ATAS
          Maksimal 430px
      ========================================== */}
      <div className="w-full max-w-[430px] mx-auto">

        {/* Logo */}
        <div className="flex justify-center pt-[60px] pb-[45px]">
          <img
            src={monteraLogo}
            alt="Montera"
            className="w-[135px] h-auto object-contain"
          />
        </div>

      </div>

      {/* =========================================
          CHECKERBOARD
          FULL WIDTH VIEWPORT
      ========================================== */}
      <div className="w-full overflow-hidden">

        {/* Row 1 */}
        <div className="flex h-[22px] w-max">
          {checkerBoxes.map((_, index) => (
            <div
              key={`top-${index}`}
              className={`
                w-[27px]
                h-[22px]
                flex-none
                ${
                  index % 2 === 0
                    ? "bg-[#292827]"
                    : "bg-[#FFFCF3]"
                }
              `}
            />
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex h-[22px] w-max">
          {checkerBoxes.map((_, index) => (
            <div
              key={`bottom-${index}`}
              className={`
                w-[27px]
                h-[22px]
                flex-none
                ${
                  index % 2 === 0
                    ? "bg-[#FFFCF3]"
                    : "bg-[#292827]"
                }
              `}
            />
          ))}
        </div>

      </div>

      {/* =========================================
          CONTENT
          Maksimal 430px
      ========================================== */}
      <div className="w-full max-w-[430px] mx-auto">

        <div className="px-5 pt-[26px]">

          {/* Title */}
          <h1
            className="
              text-center
              text-[#292827]
              font-black
              text-[clamp(22px,7vw,27px)]
              leading-[1.08]
              tracking-[-0.8px]
            "
          >
            WELCOME TO MONTERA BURGER
          </h1>

          {/* Subtitle */}
          <p
            className="
              text-center
              mt-3
              text-[#696969]
              text-[13px]
              sm:text-[14px]
              font-semibold
            "
          >
            DINE IN OR TAKE AWAY?
          </p>

          {/* =========================================
              BUTTONS
          ========================================== */}
          <div
            className="
              mt-7
              grid
              grid-cols-2
              gap-4
              w-full
              max-w-[334px]
              mx-auto
            "
          >

            {/* =======================================
                DINE IN
            ======================================== */}
            <button
              type="button"
              onClick={handleDineIn}
              className="
                group
                w-full
                aspect-square
                max-h-[150px]
                rounded-[8px]
                bg-[#292827]
                text-white
                flex
                flex-col
                items-center
                justify-center
                gap-3
                shadow-[0_6px_6px_rgba(0,0,0,0.25)]
                transition-all
                duration-200
                hover:scale-[1.03]
                hover:bg-[#333231]
                active:scale-[0.97]
              "
            >
              <img
                src={dineInIcon}
                alt="Dine In"
                className="
                  w-[48px]
                  h-[48px]
                  object-contain
                  transition-transform
                  duration-200
                  group-hover:scale-105
                "
              />

              <span className="text-[16px] sm:text-[18px] font-semibold">
                Dine in
              </span>
            </button>

            {/* =======================================
                TAKE AWAY
            ======================================== */}
            <button
              type="button"
              onClick={handleTakeAway}
              className="
                group
                w-full
                aspect-square
                max-h-[150px]
                rounded-[8px]
                bg-[#292827]
                text-white
                flex
                flex-col
                items-center
                justify-center
                gap-3
                shadow-[0_6px_6px_rgba(0,0,0,0.25)]
                transition-all
                duration-200
                hover:scale-[1.03]
                hover:bg-[#333231]
                active:scale-[0.97]
              "
            >
              <img
                src={takeawayIcon}
                alt="Take Away"
                className="
                  w-[48px]
                  h-[48px]
                  object-contain
                  transition-transform
                  duration-200
                  group-hover:scale-105
                "
              />

              <span className="text-[16px] sm:text-[18px] font-semibold">
                Take Away
              </span>
            </button>

          </div>

        </div>
      </div>

    </div>
  );
}