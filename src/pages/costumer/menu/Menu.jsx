
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../../../components/costumer/menu/SearchBar";
import ProductCard from "../../../components/costumer/menu/ProductCard";
import ProductListItem from "../../../components/costumer/menu/ProductListItem";
import CartBar from "../../../components/costumer/menu/CartBar";
import Footer from "../../../components/costumer/menu/Footer";

import bannerburger from "../../../assets/costumer/bannerburger.png";
import checkerboard from "../../../assets/costumer/checkerboard.png";

import { useCart } from "../../../context/CartContext";

import {
  getCustomerMenus,
  getCustomerBundles,
} from "../../../api/costumer";

import echo from "../../../echo";

// =========================================================
// BACKEND URL
// =========================================================

const BACKEND_URL = "http://10.174.91.209:8000";

// =========================================================
// IMAGE HELPER
// =========================================================

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
// CACHE CUSTOMER CATALOG
// =========================================================

const getCachedCatalog = () => {
  try {
    const cached =
      sessionStorage.getItem("customer_catalog");

    if (!cached) {
      return {
        menus: [],
        bundles: [],
      };
    }

    const parsed = JSON.parse(cached);

    return {
      menus: Array.isArray(parsed?.menus)
        ? parsed.menus
        : [],

      bundles: Array.isArray(parsed?.bundles)
        ? parsed.bundles
        : [],
    };
  } catch (error) {
    console.error(
      "Gagal membaca cache customer catalog:",
      error
    );

    return {
      menus: [],
      bundles: [],
    };
  }
};

// =========================================================
// FORMAT MENU
// =========================================================

const formatMenuItem = (item) => {
  const categoryName =
    item.category?.name?.toLowerCase() ||
    "uncategorized";

  return {
    id: item.id,

    type: "menu",

    name: item.name,

    label: item.label || null,

    price: Number(item.price ?? 0),

    description: item.description || "",

    image:
      getImageUrl(item.photo_url) || null,

    category: categoryName,

    categoryId:
      item.category?.id ??
      item.category_id,

    categoryName:
      item.category?.name ||
      "Lainnya",

    bestseller: Boolean(item.label),

    addons: Array.isArray(item.addons)
      ? item.addons.map((addon) => ({
          id: addon.id,
          name: addon.name,
          price: Number(
            addon.price ?? 0
          ),
        }))
      : [],
  };
};

// =========================================================
// FORMAT BUNDLE
// =========================================================

const formatBundleItem = (item) => {
  return {
    id: `bundle-${item.id}`,

    bundleId: item.id,

    type: "bundle",

    name: item.name || "",

    price: Number(
      item.bundle_price ??
        item.price ??
        0
    ),

    normalPrice: Number(
      item.normal_price ?? 0
    ),

    bundlePrice: Number(
      item.bundle_price ??
        item.price ??
        0
    ),

    description:
      item.description || "",

    image:
      getImageUrl(
        item.photo_url
      ) || null,

    is_active:
      item.is_active !== undefined
        ? Boolean(item.is_active)
        : true,

    items: Array.isArray(item.items)
      ? item.items
      : [],
  };
};

// =========================================================
// BUILD CATEGORIES
// =========================================================

const buildCategories = (menus) => {
  const categoryMap = new Map();

  menus.forEach((item) => {
    if (
      item.categoryId &&
      item.categoryName
    ) {
      if (
        !categoryMap.has(
          item.categoryId
        )
      ) {
        categoryMap.set(
          item.categoryId,
          {
            id: item.categoryId,
            name: item.categoryName,
          }
        );
      }
    }
  });

  return [
    {
      id: "all",
      name: "All",
    },

    ...Array.from(
      categoryMap.values()
    ),
  ];
};

// =========================================================
// COMPONENT
// =========================================================

export default function MenuPage() {
  const navigate = useNavigate();

  // =========================================================
  // CACHE
  // =========================================================

  const cachedCatalog =
    getCachedCatalog();

  // =========================================================
  // STATE
  // =========================================================

  const [menuItems, setMenuItems] =
    useState(
      cachedCatalog.menus
    );

  const [bundleItems, setBundleItems] =
    useState(
      cachedCatalog.bundles
    );

  const [categories, setCategories] =
    useState(
      buildCategories(
        cachedCatalog.menus
      )
    );

  const [activeCategory, setActiveCategory] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [categoryOpen, setCategoryOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(
      cachedCatalog.menus.length === 0 &&
        cachedCatalog.bundles.length === 0
    );

  const [error, setError] =
    useState("");

  // =========================================================
  // BANNER
  // =========================================================

  const [bannerImage, setBannerImage] =
    useState(bannerburger);

  // =========================================================
  // CART
  // =========================================================

  const {
    addToCart,
    totalItems,
    totalPrice,
  } = useCart();

  // =========================================================
  // UPDATE CACHE
  // =========================================================

  const updateCatalogCache = (
    menus,
    bundles
  ) => {
    try {
      sessionStorage.setItem(
        "customer_catalog",
        JSON.stringify({
          menus,
          bundles,
        })
      );

      sessionStorage.setItem(
        "customer_menu",
        JSON.stringify(menus)
      );
    } catch (error) {
      console.error(
        "Gagal update cache customer catalog:",
        error
      );
    }
  };

  // =========================================================
  // UPDATE MENU STATE
  // =========================================================

  const updateMenuState = (menus) => {
    setMenuItems(menus);

    setCategories(
      buildCategories(menus)
    );
  };

  // =========================================================
  // FETCH CUSTOMER SETTINGS / BANNER
  // =========================================================

  const fetchBannerSettings = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/customer/settings`
      );

      if (!response.ok) {
        throw new Error(
          `Customer settings request failed: ${response.status}`
        );
      }

      const result =
        await response.json();

      console.log(
        "CUSTOMER SETTINGS API:",
        result
      );

      const banner =
        result?.data
          ?.business_profile
          ?.banner_image_url;

      console.log(
        "RAW CUSTOMER BANNER:",
        banner
      );

      if (banner) {
        const bannerUrl =
          getImageUrl(banner);

        console.log(
          "CUSTOMER BANNER URL:",
          bannerUrl
        );

        if (bannerUrl) {
          setBannerImage(
            bannerUrl
          );
        }
      } else {
        setBannerImage(
          bannerburger
        );
      }
    } catch (error) {
      console.error(
        "Gagal mengambil customer settings:",
        error
      );

      setBannerImage(
        bannerburger
      );
    }
  };

  // =========================================================
  // FETCH CUSTOMER CATALOG
  // =========================================================

  const fetchMenus = async () => {
    try {
      setError("");

      console.log(
        "🔄 Fetching customer menus..."
      );

      console.log(
        "🔄 Fetching customer bundles..."
      );

      // =====================================================
      // CUSTOMER MENU
      // =====================================================

      const menuResult =
        await getCustomerMenus();

      // =====================================================
      // CUSTOMER BUNDLE
      // =====================================================

      let bundleResult = null;

      try {
        bundleResult =
          await getCustomerBundles();
      } catch (bundleError) {
        if (
          bundleError?.response?.status ===
          404
        ) {
          console.warn(
            "⚠️ Endpoint customer bundles belum tersedia. Bundle dikosongkan sementara."
          );
        } else {
          console.error(
            "Gagal mengambil customer bundles:",
            bundleError
          );
        }

        bundleResult = null;
      }

      console.log(
        "CUSTOMER MENU API:",
        menuResult
      );

      console.log(
        "CUSTOMER BUNDLE API:",
        bundleResult
      );

      // =====================================================
      // EXTRACT MENU
      // =====================================================

      const menuData =
        menuResult?.data;

      let rawMenus = [];

      if (
        Array.isArray(menuData)
      ) {
        rawMenus = menuData;
      } else if (
        Array.isArray(
          menuData?.menus
        )
      ) {
        rawMenus =
          menuData.menus;
      }

      // =====================================================
      // EXTRACT BUNDLE
      // =====================================================

      const bundleData =
        bundleResult?.data;

      let rawBundles = [];

      if (
        Array.isArray(bundleData)
      ) {
        rawBundles =
          bundleData;
      } else if (
        Array.isArray(
          bundleData?.bundles
        )
      ) {
        rawBundles =
          bundleData.bundles;
      }

      console.log(
        "RAW CUSTOMER MENUS:",
        rawMenus
      );

      console.log(
        "RAW CUSTOMER BUNDLES:",
        rawBundles
      );

      // =====================================================
      // FORMAT MENU
      // =====================================================

      const formattedMenus =
        rawMenus
          .filter(
            (item) =>
              item.is_active === true ||
              item.is_active === 1 ||
              item.is_active === "1"
          )
          .map(
            formatMenuItem
          );

      // =====================================================
      // FORMAT BUNDLE
      // =====================================================

      const formattedBundles =
        rawBundles
          .filter(
            (item) =>
              item.is_active === true ||
              item.is_active === 1 ||
              item.is_active === "1"
          )
          .map(
            formatBundleItem
          );

      console.log(
        "FORMATTED CUSTOMER MENUS:",
        formattedMenus
      );

      console.log(
        "FORMATTED CUSTOMER BUNDLES:",
        formattedBundles
      );

      // =====================================================
      // UPDATE STATE
      // =====================================================

      updateMenuState(
        formattedMenus
      );

      setBundleItems(
        formattedBundles
      );

      // =====================================================
      // UPDATE CACHE
      // =====================================================

      updateCatalogCache(
        formattedMenus,
        formattedBundles
      );
    } catch (err) {
      console.error(
        "Gagal mengambil menu customer:",
        err
      );

      setError(
        "Gagal memuat menu. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchMenus();
    fetchBannerSettings();
  }, []);

  // =========================================================
  // REALTIME
  // =========================================================

  useEffect(() => {
    console.log(
      "🔌 Connecting to customer-menu..."
    );

    const channel =
      echo.channel(
        "customer-menu"
      );

    // =======================================================
    // MENU UPDATED
    // =======================================================

    channel.listen(
      ".menu.updated",
      (event) => {
        console.log(
          "🔥 REALTIME MENU UPDATED:",
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

        // ===================================================
        // DELETE MENU
        // ===================================================

        if (menu.deleted) {
          setMenuItems(
            (currentMenus) => {
              const updatedMenus =
                currentMenus.filter(
                  (item) =>
                    Number(item.id) !==
                    Number(menu.id)
                );

              setCategories(
                buildCategories(
                  updatedMenus
                )
              );

              const currentCatalog =
                getCachedCatalog();

              updateCatalogCache(
                updatedMenus,
                currentCatalog.bundles
              );

              return updatedMenus;
            }
          );

          return;
        }

        // ===================================================
        // MENU NONAKTIF
        // ===================================================

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

              setCategories(
                buildCategories(
                  updatedMenus
                )
              );

              const currentCatalog =
                getCachedCatalog();

              updateCatalogCache(
                updatedMenus,
                currentCatalog.bundles
              );

              return updatedMenus;
            }
          );

          return;
        }

        // ===================================================
        // PAYLOAD TIDAK LENGKAP
        // ===================================================

        if (
          !menu.category &&
          !menu.category_id
        ) {
          fetchMenus();
          return;
        }

        // ===================================================
        // FORMAT MENU
        // ===================================================

        const formattedMenu =
          formatMenuItem(menu);

        // ===================================================
        // UPDATE MENU
        // ===================================================

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

            setCategories(
              buildCategories(
                updatedMenus
              )
            );

            const currentCatalog =
              getCachedCatalog();

            updateCatalogCache(
              updatedMenus,
              currentCatalog.bundles
            );

            return updatedMenus;
          }
        );
      }
    );

    // =======================================================
    // BUNDLE UPDATED
    // =======================================================

    channel.listen(
      ".bundle.updated",
      (event) => {
        console.log(
          "🔥 REALTIME BUNDLE UPDATED:",
          event
        );

        const bundle =
          event?.bundle;

        if (!bundle) {
          console.warn(
            "⚠️ Payload bundle.updated tidak memiliki bundle."
          );

          return;
        }

        // ===================================================
        // DELETE BUNDLE
        // ===================================================

        if (bundle.deleted) {
          setBundleItems(
            (currentBundles) => {
              const updatedBundles =
                currentBundles.filter(
                  (item) =>
                    Number(
                      item.bundleId
                    ) !==
                    Number(
                      bundle.id
                    )
                );

              const currentCatalog =
                getCachedCatalog();

              updateCatalogCache(
                currentCatalog.menus,
                updatedBundles
              );

              return updatedBundles;
            }
          );

          return;
        }

        // ===================================================
        // BUNDLE NONAKTIF
        // ===================================================

        if (
          bundle.is_active === false ||
          bundle.is_active === 0 ||
          bundle.is_active === "0"
        ) {
          setBundleItems(
            (currentBundles) => {
              const updatedBundles =
                currentBundles.filter(
                  (item) =>
                    Number(
                      item.bundleId
                    ) !==
                    Number(
                      bundle.id
                    )
                );

              const currentCatalog =
                getCachedCatalog();

              updateCatalogCache(
                currentCatalog.menus,
                updatedBundles
              );

              return updatedBundles;
            }
          );

          return;
        }

        // ===================================================
        // FORMAT BUNDLE
        // ===================================================

        const formattedBundle =
          formatBundleItem(
            bundle
          );

        // ===================================================
        // UPDATE / CREATE
        // ===================================================

        setBundleItems(
          (currentBundles) => {
            const existingIndex =
              currentBundles.findIndex(
                (item) =>
                  Number(
                    item.bundleId
                  ) ===
                  Number(
                    bundle.id
                  )
              );

            let updatedBundles;

            if (
              existingIndex !== -1
            ) {
              updatedBundles =
                [...currentBundles];

              updatedBundles[
                existingIndex
              ] =
                formattedBundle;
            } else {
              updatedBundles = [
                ...currentBundles,
                formattedBundle,
              ];
            }

            const currentCatalog =
              getCachedCatalog();

            updateCatalogCache(
              currentCatalog.menus,
              updatedBundles
            );

            return updatedBundles;
          }
        );
      }
    );

    // =======================================================
    // CLEANUP
    // =======================================================

    return () => {
      console.log(
        "🔌 Leaving customer-menu..."
      );

      echo.leave(
        "customer-menu"
      );
    };
  }, []);

  // =========================================================
  // FILTER MENU
  // =========================================================

  const filteredItems =
    useMemo(() => {
      return menuItems.filter(
        (item) => {
          const categoryMatch =
            activeCategory ===
              "all" ||
            item.categoryId ===
              activeCategory ||
            String(
              item.categoryId
            ) ===
              String(
                activeCategory
              );

          const searchMatch =
            item.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          return (
            categoryMatch &&
            searchMatch
          );
        }
      );
    }, [
      menuItems,
      activeCategory,
      search,
    ]);

  // =========================================================
  // FILTER BUNDLE
  // =========================================================

  const filteredBundles =
    useMemo(() => {
      return bundleItems.filter(
        (bundle) =>
          bundle.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [
      bundleItems,
      search,
    ]);

  // =========================================================
  // LABELED MENU
  // =========================================================

  const labeledGroups =
    useMemo(() => {
      const groups = {};

      filteredItems
        .filter(
          (item) =>
            item.label
        )
        .forEach((item) => {
          const label =
            item.label.trim();

          if (!groups[label]) {
            groups[label] = [];
          }

          groups[label].push(
            item
          );
        });

      return Object.entries(
        groups
      ).map(
        ([label, items]) => ({
          label,
          items,
        })
      );
    }, [
      filteredItems,
    ]);

  // =========================================================
  // GROUP MENU CATEGORY
  // =========================================================

  const groupedItems =
    useMemo(() => {
      const groups = {};

      filteredItems.forEach(
        (item) => {
          const categoryKey =
            item.categoryId ||
            "uncategorized";

          if (
            !groups[categoryKey]
          ) {
            groups[categoryKey] = {
              id: categoryKey,

              name:
                item.categoryName ||
                "Lainnya",

              items: [],
            };
          }

          groups[
            categoryKey
          ].items.push(item);
        }
      );

      return Object.values(
        groups
      );
    }, [
      filteredItems,
    ]);

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = (
    product
  ) => {
    addToCart({
      ...product,

      costumizations: {},

      notes: "",

      price: product.price,
    });
  };

  // =========================================================
  // PRODUCT DETAIL
  // =========================================================

  const handleProductClick = (
    product
  ) => {
    navigate(
      `/menu/${product.id}`
    );
  };

  // =========================================================
  // BUNDLE DETAIL
  // =========================================================

  const handleBundleClick = (
    bundle
  ) => {
    navigate(
      `/menu/bundle/${bundle.bundleId}`
    );
  };

  // =========================================================
  // CATEGORY
  // =========================================================

  const handleCategoryChange = (
    categoryId
  ) => {
    setActiveCategory(
      categoryId
    );

    setCategoryOpen(false);

    if (
      categoryId === "all"
    ) {
      setTimeout(() => {
        const mainElement =
          document.querySelector(
            ".menu-page-enter"
          );

        if (mainElement) {
          mainElement.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      }, 80);

      return;
    }

    setTimeout(() => {
      const categoryElement =
        document.getElementById(
          `category-${categoryId}`
        );

      if (!categoryElement) {
        return;
      }

      categoryElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (
    loading &&
    menuItems.length === 0 &&
    bundleItems.length === 0
  ) {
    return null;
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#fffcf4] px-6 text-center transition-colors duration-300 dark:bg-[#121212]">

        <p className="text-[15px] font-semibold text-[#777] dark:text-[#aaa]">
          {error}
        </p>

        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem(
              "customer_catalog"
            );

            sessionStorage.removeItem(
              "customer_menu"
            );

            window.location.reload();
          }}
          className="mt-3 text-[13px] font-bold underline dark:text-white"
        >
          Coba lagi
        </button>

      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#fffcf4] transition-colors duration-300 dark:bg-[#121212]">

      <main
        className="
          menu-page-enter
          absolute
          inset-0
          overflow-x-hidden
          overflow-y-auto
          scroll-smooth
          pb-[155px]
        "
      >

        <div className="h-[42px]" />

        {/* =================================================
            BANNER CUSTOMER
        ================================================= */}

        <div className="px-[22px]">

          <img
            src={bannerImage}
            alt="Banner Customer"
            onError={(e) => {
              console.error(
                "Gagal menampilkan banner:",
                bannerImage
              );

              if (
                bannerImage !==
                bannerburger
              ) {
                setBannerImage(
                  bannerburger
                );
              }

              e.currentTarget.src =
                bannerburger;
            }}
            className="
              h-[176px]
              w-full
              rounded-[17px]
              object-cover
            "
          />

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="mt-[27px]">

          <SearchBar
            value={search}
            onChange={setSearch}
          />

        </div>

        {/* =================================================
            CHECKERBOARD
        ================================================= */}

        <div className="relative z-0 mt-[14px] h-[44px] overflow-hidden border-y-2 border-[#292826] dark:border-[#333333]">

          <img
            src={checkerboard}
            alt=""
            className="h-full w-full object-cover dark:opacity-80"
          />

        </div>

        {/* =================================================
            BUNDLE
        ================================================= */}

        {filteredBundles.length > 0 && (
          <section className="mt-[28px]">

            <div className="px-4">

              <h2
                className="
                  text-[22px]
                  font-black
                  uppercase
                  leading-[26px]
                  tracking-[-0.5px]
                  text-[#111]
                  dark:text-white
                "
              >
                Bundle
              </h2>

            </div>

            <div className="mt-[14px] overflow-x-auto px-4 scrollbar-hide">

              <div className="flex w-max gap-4">

                {filteredBundles.map(
                  (bundle) => (
                    <div
                      key={bundle.id}
                      className="w-[239px] shrink-0"
                    >

                      <button
                        type="button"
                        onClick={() =>
                          handleBundleClick(
                            bundle
                          )
                        }
                        className="
                          relative
                          w-full
                          cursor-pointer
                          overflow-hidden
                          rounded-[17px]
                          border
                          border-[#d8d5cf]
                          bg-[#f8f8f8]
                          text-left
                          shadow-[0_1px_0_rgba(0,0,0,0.02)]
                        "
                      >

                        <div
                          className="
                            relative
                            flex
                            h-[140px]
                            items-center
                            justify-center
                            overflow-hidden
                            bg-[#f5f5f5]
                          "
                        >

                          <div
                            className="
                              absolute
                              right-[12px]
                              top-0
                              h-[55px]
                              w-[28px]
                              opacity-70
                            "
                            style={{
                              backgroundImage: `
                                linear-gradient(45deg, #292826 25%, transparent 25%),
                                linear-gradient(-45deg, #292826 25%, transparent 25%),
                                linear-gradient(45deg, transparent 75%, #292826 75%),
                                linear-gradient(-45deg, transparent 75%, #292826 75%)
                              `,
                              backgroundSize:
                                "12px 12px",
                              backgroundPosition:
                                "0 0, 0 6px, 6px -6px, -6px 0",
                            }}
                          />

                          <div
                            className="
                              absolute
                              left-[8px]
                              top-[8px]
                              z-20
                              rounded-full
                              bg-[#292826]
                              px-[9px]
                              py-[5px]
                              text-[9px]
                              font-black
                              uppercase
                              tracking-[0.05em]
                              text-white
                            "
                          >
                            Bundle
                          </div>

                          {bundle.image ? (
                            <img
                              src={bundle.image}
                              alt={bundle.name}
                              className="
                                relative
                                z-10
                                h-full
                                w-full
                                object-contain
                                drop-shadow-[0_8px_8px_rgba(0,0,0,0.18)]
                              "
                            />
                          ) : (
                            <div className="relative z-10 text-[12px] text-[#999]">
                              No Image
                            </div>
                          )}

                        </div>

                        <div
                          className="
                            relative
                            bg-[#292826]
                            px-3
                            pb-3
                            pt-[12px]
                            text-white
                          "
                        >

                          <h3
                            className="
                              text-[15px]
                              font-bold
                              uppercase
                              tracking-[0.04em]
                            "
                          >
                            {bundle.name}
                          </h3>

                          <div
                            className="
                              mt-[18px]
                              flex
                              items-center
                              justify-between
                            "
                          >

                            <div className="flex flex-col">

                              {bundle.normalPrice >
                                bundle.bundlePrice &&
                                bundle.normalPrice >
                                  0 && (
                                  <span
                                    className="
                                      text-[10px]
                                      font-medium
                                      text-white/45
                                      line-through
                                    "
                                  >
                                    {`Rp${bundle.normalPrice.toLocaleString(
                                      "id-ID"
                                    )}`}
                                  </span>
                                )}

                              <span
                                className="
                                  text-[14px]
                                  font-bold
                                  tracking-wide
                                  text-white/90
                                "
                              >
                                {`Rp${bundle.bundlePrice.toLocaleString(
                                  "id-ID"
                                )}`}
                              </span>

                            </div>

                            <div
                              className="
                                flex
                                h-[33px]
                                w-[33px]
                                items-center
                                justify-center
                                rounded-full
                                bg-white
                                text-[#292826]
                              "
                            >
                              <span className="text-[21px] leading-none">
                                +
                              </span>
                            </div>

                          </div>

                        </div>

                      </button>

                    </div>
                  )
                )}

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            LABELED MENU
        ================================================= */}

        {labeledGroups.map(
          (group) => (
            <section
              key={group.label}
              className="mt-[28px]"
            >

              <div className="px-4">

                <h2
                  className="
                    text-[22px]
                    font-black
                    uppercase
                    leading-[26px]
                    tracking-[-0.5px]
                    text-[#111]
                    dark:text-white
                  "
                >
                  {group.label}
                </h2>

              </div>

              <div className="mt-[14px] overflow-x-auto px-4 scrollbar-hide">

                <div className="flex w-max gap-4">

                  {group.items.map(
                    (product) => (
                      <ProductCard
                        key={
                          product.id
                        }
                        product={
                          product
                        }
                        onAdd={() =>
                          handleAddToCart(
                            product
                          )
                        }
                        onClick={() =>
                          handleProductClick(
                            product
                          )
                        }
                      />
                    )
                  )}

                </div>

              </div>

            </section>
          )
        )}

        {/* =================================================
            REGULAR CATEGORY MENU
        ================================================= */}

        {groupedItems.map(
          (group) => (
            <section
              key={group.id}
              id={`category-${group.id}`}
              className="
                mt-[28px]
                scroll-mt-[20px]
              "
            >

              <div className="px-4">

                <h2
                  className="
                    text-[22px]
                    font-black
                    uppercase
                    leading-[26px]
                    tracking-[-0.5px]
                    text-[#111]
                    dark:text-white
                  "
                >
                  {group.name}
                </h2>

              </div>

              <div className="mt-[6px] px-4">

                {group.items.map(
                  (product) => (
                    <ProductListItem
                      key={
                        product.id
                      }
                      product={{
                        ...product,

                        label: null,

                        bestseller:
                          false,
                      }}
                      onAdd={
                        handleAddToCart
                      }
                      onClick={() =>
                        handleProductClick(
                          product
                        )
                      }
                    />
                  )
                )}

              </div>

            </section>
          )
        )}

        {/* =================================================
            EMPTY RESULT
        ================================================= */}

        {filteredItems.length === 0 &&
          filteredBundles.length === 0 && (
            <div className="px-5 py-16 text-center">

              <p className="text-[15px] font-semibold text-[#777] dark:text-[#a1a1aa]">
                Menu tidak ditemukan
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");

                  setActiveCategory(
                    "all"
                  );
                }}
                className="mt-3 text-[13px] font-bold underline dark:text-white"
              >
                Reset filter
              </button>

            </div>
          )}

        {/* =================================================
            FOOTER
        ================================================= */}

        <Footer />

      </main>

      {/* ===================================================
          FIXED CART
      =================================================== */}

      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-[9999]
          pointer-events-none
        "
      >

        <div className="pointer-events-auto">

          <CartBar
            itemCount={totalItems}
            total={totalPrice}
            categories={categories}
            activeCategory={
              activeCategory
            }
            categoryOpen={
              categoryOpen
            }
            onToggleCategory={() =>
              setCategoryOpen(
                (prev) =>
                  !prev
              )
            }
            onCategoryChange={
              handleCategoryChange
            }
          />

        </div>

      </div>

    </div>
  );
}

