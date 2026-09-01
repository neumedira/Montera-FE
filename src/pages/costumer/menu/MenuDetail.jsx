import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import CostumizationOption from "../../../components/costumer/menu/CostumizationOption";

import { useCart } from "../../../context/CartContext";

import echo from "../../../echo";

// =========================================================
// IMAGE HELPER
// =========================================================

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getImageUrl = (photo) => {
  if (!photo) {
    return "";
  }

  const value = String(photo).trim();

  if (!value) {
    return "";
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  if (value.startsWith("/storage/")) {
    return `${BACKEND_URL}${value}`;
  }

  if (value.startsWith("storage/")) {
    return `${BACKEND_URL}/${value}`;
  }

  if (value.startsWith("/")) {
    return `${BACKEND_URL}${value}`;
  }

  return `${BACKEND_URL}/storage/${value}`;
};

// =========================================================
// GET CACHED MENU
// =========================================================

const getCachedMenu = () => {
  try {
    const cachedMenu =
      sessionStorage.getItem("customer_menu");

    if (!cachedMenu) {
      return [];
    }

    const parsedMenu = JSON.parse(cachedMenu);

    return Array.isArray(parsedMenu)
      ? parsedMenu
      : [];
  } catch (error) {
    console.error(
      "Gagal membaca cache menu:",
      error
    );

    return [];
  }
};

// =========================================================
// UPDATE MENU CACHE
// =========================================================

const updateMenuCache = (menus) => {
  try {
    sessionStorage.setItem(
      "customer_menu",
      JSON.stringify(menus)
    );

    const cachedCatalog =
      sessionStorage.getItem(
        "customer_catalog"
      );

    const parsedCatalog = cachedCatalog
      ? JSON.parse(cachedCatalog)
      : {
          menus: [],
          bundles: [],
        };

    sessionStorage.setItem(
      "customer_catalog",
      JSON.stringify({
        menus,
        bundles: Array.isArray(
          parsedCatalog?.bundles
        )
          ? parsedCatalog.bundles
          : [],
      })
    );
  } catch (error) {
    console.error(
      "Gagal update cache menu:",
      error
    );
  }
};

// =========================================================
// FORMAT MENU REALTIME
// =========================================================

const formatRealtimeMenu = (menu) => {
  return {
    ...menu,

    id: Number(menu.id),

    price: Number(
      menu.price ?? 0
    ),

    image:
      getImageUrl(
        menu.photo_url ??
          menu.image ??
          menu.photo
      ) || null,

    description:
      menu.description || "",

    addons: Array.isArray(
      menu.addons
    )
      ? menu.addons.map((addon) => ({
          ...addon,

          id: Number(addon.id),

          price: Number(
            addon.price ?? 0
          ),
        }))
      : [],
  };
};

// =========================================================
// COMPONENT
// =========================================================

export default function MenuDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { addToCart } = useCart();

  // =======================================================
  // MENU STATE
  // =======================================================

  const [menuItems, setMenuItems] =
    useState(() => getCachedMenu());

  // =======================================================
  // FIND PRODUCT
  // =======================================================

  const product = useMemo(() => {
    return menuItems.find(
      (item) =>
        Number(item.id) === Number(id)
    );
  }, [menuItems, id]);

  // =======================================================
  // STATE
  // =======================================================

  const [selectedAddons, setSelectedAddons] =
    useState({});

  const [notes, setNotes] = useState("");

  // =======================================================
  // REALTIME MENU
  // =======================================================

  useEffect(() => {
    console.log(
      "🔌 MenuDetail connecting to customer-menu..."
    );

    const channel =
      echo.channel("customer-menu");

    // =====================================================
    // MENU UPDATED
    // =====================================================

    channel.listen(
      ".menu.updated",
      (event) => {
        console.log(
          "🔥 MenuDetail REALTIME MENU UPDATED:",
          event
        );

        const menu =
          event?.menu;

        if (!menu) {
          console.warn(
            "⚠️ Payload menu.updated tidak memiliki menu."
          );

          return;
        }

        // Pastikan hanya menu yang sedang dibuka
        // yang diproses.

        if (
          Number(menu.id) !==
          Number(id)
        ) {
          return;
        }

        // =================================================
        // MENU DIHAPUS
        // =================================================

        if (menu.deleted) {
          setMenuItems(
            (currentMenus) => {
              const updatedMenus =
                currentMenus.filter(
                  (item) =>
                    Number(item.id) !==
                    Number(menu.id)
                );

              updateMenuCache(
                updatedMenus
              );

              return updatedMenus;
            }
          );

          return;
        }

        // =================================================
        // MENU NONAKTIF
        // =================================================

        if (
          menu.is_active === false ||
          menu.is_active === 0 ||
          menu.is_active === "0"
        ) {
          setMenuItems(
            (currentMenus) => {
              const updatedMenus =
                currentMenus.filter(
                  (item) =>
                    Number(item.id) !==
                    Number(menu.id)
                );

              updateMenuCache(
                updatedMenus
              );

              return updatedMenus;
            }
          );

          return;
        }

        // =================================================
        // MENU AKTIF / UPDATED
        // =================================================

        const formattedMenu =
          formatRealtimeMenu(menu);

        setMenuItems(
          (currentMenus) => {
            const existingIndex =
              currentMenus.findIndex(
                (item) =>
                  Number(item.id) ===
                  Number(
                    formattedMenu.id
                  )
              );

            let updatedMenus;

            if (
              existingIndex !== -1
            ) {
              updatedMenus =
                [...currentMenus];

              updatedMenus[
                existingIndex
              ] =
                formattedMenu;
            } else {
              updatedMenus = [
                ...currentMenus,
                formattedMenu,
              ];
            }

            updateMenuCache(
              updatedMenus
            );

            return updatedMenus;
          }
        );
      }
    );

    // =====================================================
    // CLEANUP
    // =====================================================

    return () => {
      console.log(
        "🔌 MenuDetail leaving customer-menu..."
      );

      echo.leave(
        "customer-menu"
      );
    };
  }, [id]);

  // =======================================================
  // PRODUCT NOT FOUND
  // =======================================================

  if (!product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#fffcf4] px-6 text-center dark:bg-[#121212]">
        <p className="font-semibold text-[#111] dark:text-white">
          Menu tidak ditemukan.
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-3 text-[13px] font-bold underline dark:text-white"
        >
          Kembali ke menu
        </button>
      </main>
    );
  }

  // =======================================================
  // ADDON PRICE
  // =======================================================

  const extraPrice = useMemo(() => {
    if (!product?.addons) {
      return 0;
    }

    return product.addons.reduce(
      (total, addon) => {
        if (selectedAddons[addon.id]) {
          return (
            total +
            Number(
              addon.price ?? 0
            )
          );
        }

        return total;
      },
      0
    );
  }, [product, selectedAddons]);

  // =======================================================
  // TOTAL PRICE
  // =======================================================

  const totalPrice =
    Number(product.price ?? 0) +
    extraPrice;

  // =======================================================
  // TOGGLE ADDON
  // =======================================================

  const toggleAddon = (
    addonId
  ) => {
    setSelectedAddons(
      (current) => ({
        ...current,

        [addonId]:
          !current[addonId],
      })
    );
  };

  // =======================================================
  // ADD TO CART
  // =======================================================

  const handleAddToCart = () => {
    const selectedAddonList =
      product.addons?.filter(
        (addon) =>
          selectedAddons[
            addon.id
          ]
      ) || [];

    const cartItem = {
      ...product,

      addons:
        selectedAddonList,

      costumizations:
        selectedAddonList.reduce(
          (result, addon) => {
            result[addon.id] =
              true;

            return result;
          },
          {}
        ),

      notes,

      price: totalPrice,
    };

    console.log(
      "ADD TO CART:",
      cartItem
    );

    addToCart(cartItem);

    navigate("/", {
      state: {
        skipLoading: true,
      },
    });
  };

  // =======================================================
  // RENDER
  // =======================================================

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
          {product.image ? (
            <img
              src={getImageUrl(
                product.image
              )}
              alt={product.name}
              className="
                h-[320px]
                w-[360px]
                object-contain
              "
            />
          ) : (
            <div className="flex h-[320px] w-[360px] items-center justify-center text-[14px] text-[#999]">
              Tidak ada foto
            </div>
          )}
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

        {/* NAME + PRICE */}

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
            {Number(
              product.price ?? 0
            ).toLocaleString(
              "id-ID"
            )}
          </span>

        </div>

        {/* DESCRIPTION */}

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

        {/* ADDONS */}

        {product.addons &&
          product.addons.length >
            0 && (
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
                ADD ON
              </h2>

              <div className="mt-[7px] border-t border-[#e8e4dc] dark:border-[#333333]" />

              <div className="mt-[24px] space-y-[24px]">

                {product.addons.map(
                  (addon) => (
                    <CostumizationOption
                      key={
                        addon.id
                      }
                      label={
                        addon.name
                      }
                      price={Number(
                        addon.price ??
                          0
                      )}
                      checked={
                        !!selectedAddons[
                          addon.id
                        ]
                      }
                      onChange={() =>
                        toggleAddon(
                          addon.id
                        )
                      }
                    />
                  )
                )}

              </div>

            </div>
          )}

        {/* NO ADDON */}

        {(!product.addons ||
          product.addons.length ===
            0) && (
          <div className="mt-[26px]">

            <h2
              className="
                text-[17px]
                font-bold
                tracking-wide
                text-[#111]
                dark:text-white
              "
            >
              ADD ON
            </h2>

            <div className="mt-[7px] border-t border-[#e8e4dc] dark:border-[#333333]" />

            <p className="mt-[18px] text-[14px] text-[#888] dark:text-[#999]">
              Tidak ada add on untuk
              menu ini.
            </p>

          </div>
        )}

        {/* NOTES */}

        <div className="mt-[24px]">

          <input
            type="text"
            placeholder="Notes (Optional)"
            value={notes}
            onChange={(e) =>
              setNotes(
                e.target.value
              )
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

        {/* ADD TO CART */}

        <button
          type="button"
          onClick={
            handleAddToCart
          }
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
            {totalPrice.toLocaleString(
              "id-ID"
            )}
          </span>

        </button>

      </section>

    </main>
  );
}