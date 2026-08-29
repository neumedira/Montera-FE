
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../../../components/costumer/menu/SearchBar";
import ProductCard from "../../../components/costumer/menu/ProductCard";
import ProductListItem from "../../../components/costumer/menu/ProductListItem";
import CartBar from "../../../components/costumer/menu/CartBar";

import bannerburger from "../../../assets/costumer/bannerburger.png";
import checkerboard from "../../../assets/costumer/checkerboard.png";

import { useCart } from "../../../context/CartContext";
import { getCustomerMenus } from "../../../api/costumer";

export default function MenuPage() {
  const navigate = useNavigate();

  // =========================================================
  // GET CACHE MENU
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
  // INITIAL DATA
  // =========================================================

  const cachedMenu = getCachedMenu();

  const buildCategories = (menus) => {
    const categoryMap = new Map();

    menus.forEach((item) => {
      if (
        item.categoryId &&
        item.categoryName
      ) {
        if (!categoryMap.has(item.categoryId)) {
          categoryMap.set(item.categoryId, {
            id: item.category,
            name: item.categoryName,
          });
        }
      }
    });

    return [
      {
        id: "all",
        name: "All",
      },
      ...Array.from(categoryMap.values()),
    ];
  };

  // =========================================================
  // STATE
  // =========================================================

  const [menuItems, setMenuItems] =
    useState(cachedMenu);

  const [categories, setCategories] =
    useState(
      buildCategories(cachedMenu)
    );

  const [activeCategory, setActiveCategory] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [categoryOpen, setCategoryOpen] =
    useState(false);

  /*
   * PENTING:
   *
   * Kalau cache sudah ada → langsung false.
   *
   * Jadi saat balik dari Detail:
   *
   * Detail
   *   ↓
   * Back
   *   ↓
   * MenuPage mount ulang
   *   ↓
   * baca sessionStorage
   *   ↓
   * loading = false
   *   ↓
   * MENU LANGSUNG MUNCUL
   */

  const [loading, setLoading] =
    useState(cachedMenu.length === 0);

  const [error, setError] =
    useState("");

  const {
    addToCart,
    totalItems,
    totalPrice,
  } = useCart();

  // =========================================================
  // FETCH CUSTOMER MENU
  // =========================================================

  useEffect(() => {
    /*
     * Kalau sudah ada cache,
     * JANGAN fetch ulang.
     */

    if (cachedMenu.length > 0) {
      return;
    }

    const fetchMenus = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getCustomerMenus();

        console.log(
          "CUSTOMER MENU API:",
          response
        );

        const rawMenus =
          response?.data || [];

        console.log(
          "RAW CUSTOMER MENU:",
          rawMenus
        );

        // =====================================================
        // FORMAT MENU
        // =====================================================

        const formattedMenus =
          rawMenus
            .filter(
              (item) => item.is_active
            )
            .map((item) => {
              const categoryName =
                item.category?.name?.toLowerCase() ||
                "uncategorized";

              return {
                id: item.id,

                name: item.name,

                price: Number(
                  item.price
                ),

                description:
                  item.description ||
                  "",

                image:
                  item.photo_url ||
                  null,

                category:
                  categoryName,

                categoryId:
                  item.category?.id ||
                  item.category_id,

                categoryName:
                  item.category?.name ||
                  "Lainnya",

                bestseller: false,

                addons:
                  (item.addons || []).map(
                    (addon) => ({
                      id: addon.id,
                      name: addon.name,
                      price: Number(
                        addon.price
                      ),
                    })
                  ),
              };
            });

        console.log(
          "FORMATTED CUSTOMER MENU:",
          formattedMenus
        );

        // =====================================================
        // SAVE STATE
        // =====================================================

        setMenuItems(
          formattedMenus
        );

        // =====================================================
        // SAVE CACHE
        // =====================================================

        sessionStorage.setItem(
          "customer_menu",
          JSON.stringify(
            formattedMenus
          )
        );

        // =====================================================
        // BUILD CATEGORY
        // =====================================================

        const formattedCategories =
          buildCategories(
            formattedMenus
          );

        console.log(
          "FORMATTED CUSTOMER CATEGORIES:",
          formattedCategories
        );

        setCategories(
          formattedCategories
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

    fetchMenus();
  }, []);

  // =========================================================
  // FILTER MENU
  // =========================================================

  const filteredItems = useMemo(() => {
    return menuItems.filter(
      (item) => {
        const categoryMatch =
          activeCategory === "all" ||
          item.category ===
            activeCategory;

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
  // GROUP MENU
  // =========================================================

  const groupedItems = useMemo(() => {
    const groups = {};

    filteredItems.forEach(
      (item) => {
        const categoryKey =
          item.categoryId ||
          "uncategorized";

        if (!groups[categoryKey]) {
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

    return Object.values(groups);
  }, [filteredItems]);

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
  // CHANGE CATEGORY
  // =========================================================

  const handleCategoryChange = (
    categoryId
  ) => {
    setActiveCategory(
      categoryId
    );

    setCategoryOpen(false);
  };

  // =========================================================
  // LOADING
  // =========================================================

  /*
   * Hanya terjadi ketika BENAR-BENAR
   * belum punya cache.
   *
   * Tidak akan muncul saat:
   *
   * Menu → Detail → Back → Menu
   */

  if (loading) {
    return null;
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#fffcf4] px-6 text-center dark:bg-[#121212] transition-colors duration-300">

        <p className="text-[15px] font-semibold text-[#777] dark:text-[#aaa]">
          {error}
        </p>

        <button
          type="button"
          onClick={() => {
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
    <div className="fixed inset-0 overflow-hidden bg-[#fffcf4] dark:bg-[#121212] transition-colors duration-300">

      {/* =====================================================
          SCROLLABLE CONTENT
      ===================================================== */}

      <main
        className="
          menu-page-enter
          absolute
          inset-0
          overflow-x-hidden
          overflow-y-auto
          pb-[155px]
        "
      >

        {/* TOP SPACING */}

        <div className="h-[42px]" />

        {/* BANNER */}

        <div className="px-[22px]">

          <img
            src={bannerburger}
            alt="Good Burger"
            className="h-[176px] w-full rounded-[17px] object-cover"
          />

        </div>

        {/* SEARCH */}

        <div className="mt-[27px]">

          <SearchBar
            value={search}
            onChange={setSearch}
          />

        </div>

        {/* CHECKERBOARD */}

        <div className="relative z-0 mt-[14px] h-[44px] overflow-hidden border-y-2 border-[#292826] dark:border-[#333333]">

          <img
            src={checkerboard}
            alt=""
            className="h-full w-full object-cover dark:opacity-80"
          />

        </div>

        {/* =====================================================
            MENU
        ===================================================== */}

        {groupedItems.map(
          (group) => (

            <section
              key={group.id}
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
                    transition-colors
                    duration-300
                  "
                >
                  {group.name}
                </h2>

              </div>

              {/* COMBO */}

              {group.name
                .toLowerCase() ===
              "combo" ? (

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

              ) : (

                /* CATEGORY BIASA */

                <div className="mt-[6px] px-4">

                  {group.items.map(
                    (product) => (

                      <ProductListItem
                        key={
                          product.id
                        }
                        product={
                          product
                        }
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

              )}

            </section>

          )
        )}

        {/* =====================================================
            EMPTY RESULT
        ===================================================== */}

        {filteredItems.length ===
          0 && (

          <div className="px-5 py-16 text-center">

            <p className="text-[15px] font-semibold text-[#777] dark:text-[#a1a1aa] transition-colors duration-300">
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
              className="mt-3 text-[13px] font-bold underline dark:text-white transition-colors duration-300"
            >
              Reset filter
            </button>

          </div>

        )}

      </main>

      {/* =====================================================
          FIXED CART
      ===================================================== */}

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
            itemCount={
              totalItems
            }
            total={
              totalPrice
            }
            categories={
              categories
            }
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
