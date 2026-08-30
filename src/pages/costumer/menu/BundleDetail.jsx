
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import CostumizationOption from "../../../components/costumer/menu/CostumizationOption";
import { useCart } from "../../../context/CartContext";

// =========================================================
// IMAGE HELPER
// =========================================================

const BACKEND_URL = "http://10.174.91.209:8000";

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
    value.startsWith("blob:")
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
// GET REAL BUNDLE ID
// =========================================================
//
// Priority:
// 1. bundle.bundleId
// 2. bundle.id kalau berupa angka
//
// Jangan sampai memakai "bundle-1" sebagai bundle_id,
// karena backend membutuhkan integer ID.
// =========================================================

const getBundleId = (bundle) => {
  if (!bundle) {
    return null;
  }

  if (
    bundle.bundleId !== null &&
    bundle.bundleId !== undefined &&
    bundle.bundleId !== ""
  ) {
    const numericId =
      Number(bundle.bundleId);

    return Number.isNaN(numericId)
      ? null
      : numericId;
  }

  const rawId = bundle.id;

  if (
    rawId !== null &&
    rawId !== undefined
  ) {
    const numericId = Number(rawId);

    if (!Number.isNaN(numericId)) {
      return numericId;
    }
  }

  return null;
};

// =========================================================
// BUNDLE DETAIL
// =========================================================

export default function BundleDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { addToCart } = useCart();

  // =======================================================
  // GET BUNDLE FROM SESSION STORAGE
  // =======================================================

  const bundleItems = useMemo(() => {
    try {
      const cachedCatalog =
        sessionStorage.getItem(
          "customer_catalog"
        );

      if (!cachedCatalog) {
        return [];
      }

      const parsedCatalog =
        JSON.parse(cachedCatalog);

      return Array.isArray(
        parsedCatalog?.bundles
      )
        ? parsedCatalog.bundles
        : [];

    } catch (error) {
      console.error(
        "Gagal membaca cache bundle:",
        error
      );

      return [];
    }
  }, []);

  // =======================================================
  // FIND BUNDLE
  // =======================================================

  const bundle = useMemo(() => {
    return bundleItems.find(
      (item) => {
        const bundleId =
          getBundleId(item);

        return (
          Number(bundleId) ===
          Number(id)
        );
      }
    );
  }, [bundleItems, id]);

  // =======================================================
  // ADDON STATE
  // =======================================================

  const [selectedAddons, setSelectedAddons] =
    useState({});

  const [notes, setNotes] =
    useState("");

  // =======================================================
  // BUNDLE NOT FOUND
  // =======================================================

  if (!bundle) {
    return (
      <main
        className="
          flex
          min-h-screen
          flex-col
          items-center
          justify-center
          bg-[#fffcf4]
          px-6
          text-center
          dark:bg-[#121212]
        "
      >

        <p
          className="
            font-semibold
            text-[#111]
            dark:text-white
          "
        >
          Bundle tidak ditemukan.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/")
          }
          className="
            mt-3
            text-[13px]
            font-bold
            underline
            dark:text-white
          "
        >
          Kembali ke menu
        </button>

      </main>
    );
  }

  // =======================================================
  // REAL BUNDLE ID
  // =======================================================

  const bundleId =
    getBundleId(bundle);

  // =======================================================
  // TOGGLE ADDON
  // =======================================================

  const toggleAddon = (
    menuId,
    addonId
  ) => {
    setSelectedAddons(
      (current) => ({
        ...current,

        [menuId]: {
          ...(current[menuId] || {}),

          [addonId]:
            !current[menuId]?.[
              addonId
            ],
        },
      })
    );
  };

  // =======================================================
  // ADDON EXTRA PRICE
  // =======================================================

  const extraPrice =
    useMemo(() => {
      if (!bundle?.items) {
        return 0;
      }

      return bundle.items.reduce(
        (
          bundleTotal,
          bundleItem
        ) => {
          const menu =
            bundleItem?.menu_item;

          if (!menu?.addons) {
            return bundleTotal;
          }

          const menuAddonTotal =
            menu.addons.reduce(
              (
                menuTotal,
                addon
              ) => {
                if (
                  selectedAddons[
                    menu.id
                  ]?.[addon.id]
                ) {
                  return (
                    menuTotal +
                    Number(
                      addon.price ?? 0
                    )
                  );
                }

                return menuTotal;
              },
              0
            );

          return (
            bundleTotal +
            menuAddonTotal
          );
        },
        0
      );
    }, [
      bundle,
      selectedAddons,
    ]);

  // =======================================================
  // TOTAL PRICE
  // =======================================================

  const totalPrice =
    Number(
      bundle.bundlePrice ??
        bundle.price ??
        0
    ) + extraPrice;

  // =======================================================
  // ADD TO CART
  // =======================================================

  const handleAddToCart = () => {
    const selectedAddonList = [];

    // =====================================================
    // COLLECT ADDONS
    // =====================================================

    bundle.items?.forEach(
      (bundleItem) => {
        const menu =
          bundleItem?.menu_item;

        if (!menu?.addons) {
          return;
        }

        menu.addons.forEach(
          (addon) => {
            if (
              selectedAddons[
                menu.id
              ]?.[addon.id]
            ) {
              selectedAddonList.push({
                ...addon,

                menu_item_id:
                  menu.id,

                menu_item_name:
                  menu.name,
              });
            }
          }
        );
      }
    );

    // =====================================================
    // VALIDATE BUNDLE ID
    // =====================================================

    if (!bundleId) {
      console.error(
        "❌ BUNDLE ID TIDAK DITEMUKAN:",
        bundle
      );

      alert(
        "ID bundle tidak ditemukan. Silakan kembali ke menu dan coba lagi."
      );

      return;
    }

    // =====================================================
    // CREATE CART ITEM
    // =====================================================

    const cartItem = {
      ...bundle,

      // ID cart berbeda dengan ID bundle database.
      id:
        `bundle-${bundleId}`,

      type:
        "bundle",

      // ===================================================
      // PENTING:
      // ID ASLI BUNDLE DATABASE
      // ===================================================

      bundleId:
        bundleId,

      // ===================================================
      // ADDONS
      // ===================================================

      addons:
        selectedAddonList,

      // ===================================================
      // CUSTOMIZATIONS
      // ===================================================

      costumizations:
        selectedAddonList.reduce(
          (
            result,
            addon
          ) => {

            if (
              !result[
                addon.menu_item_id
              ]
            ) {
              result[
                addon.menu_item_id
              ] = {};
            }

            result[
              addon.menu_item_id
            ][addon.id] = true;

            return result;
          },
          {}
        ),

      // ===================================================
      // NOTES
      // ===================================================

      notes,

      // ===================================================
      // FINAL PRICE
      // ===================================================

      price:
        totalPrice,
    };

    // =====================================================
    // DEBUG
    // =====================================================

    console.log(
      "🧺 ADD BUNDLE TO CART:",
      cartItem
    );

    console.log(
      "🆔 REAL BUNDLE ID:",
      bundleId
    );

    console.log(
      "📦 BUNDLE ITEMS:",
      bundle.items
    );

    // =====================================================
    // ADD TO CART
    // =====================================================

    addToCart(
      cartItem
    );

    // =====================================================
    // BACK TO MENU
    // =====================================================

    navigate(
      "/",
      {
        state: {
          skipLoading: true,
        },
      }
    );
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <main
      className="
        min-h-screen
        overflow-x-hidden
        bg-[#fffcf4]
        transition-colors
        duration-300
        dark:bg-[#121212]
      "
    >

      {/* ===================================================
          BUNDLE IMAGE
      =================================================== */}

      <section
        className="
          relative
          h-[458px]
          overflow-hidden
          bg-[#fffcf4]
          dark:bg-[#121212]
        "
      >

        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
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
            bg-white
            text-[#111]
            dark:border-[#333333]
            dark:bg-[#1e1e1e]
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

        {/* BUNDLE IMAGE */}

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

          {bundle.image ? (
            <img
              src={getImageUrl(
                bundle.image
              )}
              alt={bundle.name}
              className="
                h-[320px]
                w-[360px]
                object-contain
                drop-shadow-[0_12px_12px_rgba(0,0,0,0.15)]
              "
            />
          ) : (
            <div
              className="
                flex
                h-[320px]
                w-[360px]
                items-center
                justify-center
                text-[14px]
                text-[#999]
              "
            >
              Tidak ada foto
            </div>
          )}

        </div>

      </section>

      {/* ===================================================
          DETAIL CARD
      =================================================== */}

      <section
        className="
          relative
          -mt-[1px]
          min-h-[600px]
          rounded-t-[24px]
          border-t
          border-[#e4e0d8]
          bg-[#fffcf4]
          px-[28px]
          pb-10
          pt-[42px]
          shadow-[0_-2px_10px_rgba(0,0,0,0.03)]
          transition-colors
          duration-300
          dark:border-[#333333]
          dark:bg-[#1e1e1e]
        "
      >

        {/* =================================================
            NAME + PRICE
        ================================================= */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >

          <div>

            <div
              className="
                mb-[8px]
                inline-flex
                rounded-full
                bg-[#292826]
                px-[10px]
                py-[5px]
                text-[9px]
                font-black
                uppercase
                tracking-[0.08em]
                text-white
              "
            >
              Bundle
            </div>

            <h1
              className="
                font-anton
                text-[28px]
                uppercase
                leading-none
                text-[#111]
                dark:text-white
              "
            >
              {bundle.name}
            </h1>

          </div>

          <div
            className="
              flex
              shrink-0
              flex-col
              items-end
            "
          >

            {Number(
              bundle.normalPrice ?? 0
            ) >
              Number(
                bundle.bundlePrice ??
                  bundle.price ??
                  0
              ) && (
              <span
                className="
                  text-[12px]
                  font-medium
                  text-[#999]
                  line-through
                "
              >
                Rp{" "}
                {Number(
                  bundle.normalPrice
                ).toLocaleString(
                  "id-ID"
                )}
              </span>
            )}

            <span
              className="
                whitespace-nowrap
                text-[24px]
                font-extrabold
                text-[#111]
                dark:text-white
              "
            >
              Rp{" "}
              {Number(
                bundle.bundlePrice ??
                  bundle.price ??
                  0
              ).toLocaleString(
                "id-ID"
              )}
            </span>

          </div>

        </div>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        {bundle.description && (
          <p
            className="
              mt-[20px]
              text-[16px]
              leading-[1.55]
              text-[#5d5a57]
              dark:text-[#a1a1aa]
            "
          >
            {bundle.description}
          </p>
        )}

        {/* =================================================
            BUNDLE CONTENT
        ================================================= */}

        <div className="mt-[30px]">

          <h2
            className="
              text-[17px]
              font-bold
              tracking-wide
              text-[#111]
              dark:text-white
            "
          >
            ISI BUNDLE
          </h2>

          <div
            className="
              mt-[7px]
              border-t
              border-[#e8e4dc]
              dark:border-[#333333]
            "
          />

          <div
            className="
              mt-[22px]
              space-y-[28px]
            "
          >

            {bundle.items?.map(
              (bundleItem) => {

                const menu =
                  bundleItem?.menu_item;

                if (!menu) {
                  return null;
                }

                return (
                  <div
                    key={
                      bundleItem.id
                    }
                    className="
                      rounded-[17px]
                      border
                      border-[#e5e1da]
                      bg-white
                      p-[14px]
                      dark:border-[#444444]
                      dark:bg-[#292929]
                    "
                  >

                    {/* MENU HEADER */}

                    <div className="flex gap-3">

                      {/* IMAGE */}

                      <div
                        className="
                          h-[78px]
                          w-[78px]
                          shrink-0
                          overflow-hidden
                          rounded-[13px]
                          bg-[#f5f5f5]
                          dark:bg-[#222]
                        "
                      >

                        {menu.photo_url ? (
                          <img
                            src={getImageUrl(
                              menu.photo_url
                            )}
                            alt={menu.name}
                            className="
                              h-full
                              w-full
                              object-contain
                            "
                          />
                        ) : (
                          <div
                            className="
                              flex
                              h-full
                              items-center
                              justify-center
                              text-[10px]
                              text-[#999]
                            "
                          >
                            No Image
                          </div>
                        )}

                      </div>

                      {/* MENU INFO */}

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-3
                          "
                        >

                          <h3
                            className="
                              text-[16px]
                              font-bold
                              uppercase
                              leading-[1.2]
                              text-[#111]
                              dark:text-white
                            "
                          >
                            {menu.name}
                          </h3>

                          <span
                            className="
                              shrink-0
                              text-[14px]
                              font-bold
                              text-[#111]
                              dark:text-white
                            "
                          >
                            {
                              bundleItem.quantity
                            }x
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* =================================================
                        ADDONS
                    ================================================= */}

                    {menu.addons &&
                      menu.addons.length >
                        0 && (
                      <div
                        className="
                          mt-[18px]
                          border-t
                          border-[#eeeae3]
                          pt-[17px]
                          dark:border-[#3d3d3d]
                        "
                      >

                        <h4
                          className="
                            text-[12px]
                            font-bold
                            uppercase
                            tracking-wide
                            text-[#111]
                            dark:text-white
                          "
                        >
                          Add On
                        </h4>

                        <div
                          className="
                            mt-[14px]
                            space-y-[18px]
                          "
                        >

                          {menu.addons.map(
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
                                    menu.id
                                  ]?.[
                                    addon.id
                                  ]
                                }
                                onChange={() =>
                                  toggleAddon(
                                    menu.id,
                                    addon.id
                                  )
                                }
                              />
                            )
                          )}

                        </div>

                      </div>
                    )}

                  </div>
                );
              }
            )}

          </div>

        </div>

        {/* =================================================
            NOTES
        ================================================= */}

        <div className="mt-[26px]">

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
              bg-white
              px-[15px]
              text-[15px]
              text-[#111]
              outline-none
              placeholder:text-[#999]
              focus:border-[#292826]
              dark:border-[#444444]
              dark:bg-[#2d2d2d]
              dark:text-white
              dark:placeholder:text-[#888888]
              dark:focus:border-white
            "
          />

        </div>

        {/* =================================================
            ADD TO CART
        ================================================= */}

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
            px-[22px]
            text-white
            transition
            active:scale-[0.98]
            dark:bg-white
            dark:text-[#111]
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

