
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
import { getCustomerMenus } from "../../../api/costumer";

import echo from "../../../echo";

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
  // BUILD CATEGORIES
  // =========================================================

  const buildCategories = (menus) => {
    const categoryMap = new Map();

    menus.forEach((item) => {
      // Menu yang memiliki label tidak dijadikan
      // bagian dari kategori biasa.
      if (item.label) {
        return;
      }

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
  // FORMAT MENU ITEM
  // =========================================================

  const formatMenuItem = (item) => {
    const categoryName =
      item.category?.name?.toLowerCase() ||
      "uncategorized";

    return {
      id: item.id,

      name: item.name,

      // =====================================================
      // LABEL
      // =====================================================

      label:
        item.label || null,

      price: Number(
        item.price
      ),

      description:
        item.description || "",

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

      // Menu yang memiliki label otomatis
      // dianggap sebagai Best Seller.
      bestseller:
        Boolean(item.label),

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
  };

  // =========================================================
  // INITIAL DATA
  // =========================================================

  const cachedMenu =
    getCachedMenu();

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

  const [loading, setLoading] =
    useState(
      cachedMenu.length === 0
    );

  const [error, setError] =
    useState("");

  const {
    addToCart,
    totalItems,
    totalPrice,
  } = useCart();

  // =========================================================
  // UPDATE MENU STATE + CACHE
  // =========================================================

  const updateMenuState = (
    menus
  ) => {
    setMenuItems(menus);

    setCategories(
      buildCategories(menus)
    );

    sessionStorage.setItem(
      "customer_menu",
      JSON.stringify(menus)
    );
  };

  // =========================================================
  // FETCH CUSTOMER MENU
  // =========================================================

  const fetchMenus = async () => {
    try {
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
            (item) =>
              item.is_active
          )
          .map(
            formatMenuItem
          );

      console.log(
        "FORMATTED CUSTOMER MENU:",
        formattedMenus
      );

      // =====================================================
      // SAVE STATE + CACHE
      // =====================================================

      updateMenuState(
        formattedMenus
      );

      console.log(
        "FORMATTED CUSTOMER CATEGORIES:",
        buildCategories(
          formattedMenus
        )
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
  }, []);

  // =========================================================
  // REALTIME CUSTOMER MENU
  // =========================================================

  useEffect(() => {
    console.log(
      "🔌 Connecting to customer-menu..."
    );

    const channel =
      echo.channel(
        "customer-menu"
      );

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

        // =====================================================
        // DELETE
        // =====================================================

        if (menu.deleted) {
          setMenuItems(
            (currentMenus) => {
              const updatedMenus =
                currentMenus.filter(
                  (item) =>
                    item.id !==
                    menu.id
                );

              // Update cache
              sessionStorage.setItem(
                "customer_menu",
                JSON.stringify(
                  updatedMenus
                )
              );

              // Update categories
              setCategories(
                buildCategories(
                  updatedMenus
                )
              );

              return updatedMenus;
            }
          );

          console.log(
            "🗑️ Menu dihapus dari customer:",
            menu.id
          );

          return;
        }

        // =====================================================
        // TAMBAH / UPDATE
        // =====================================================

        const formattedMenu =
          formatMenuItem(menu);

        // =====================================================
        // CEK DATA REALTIME
        // =====================================================

        if (
          !menu.category &&
          !menu.category_id
        ) {
          console.log(
            "⚠️ Payload realtime kurang lengkap. Fetch ulang API..."
          );

          fetchMenus();

          return;
        }

        setMenuItems(
          (currentMenus) => {
            const existingIndex =
              currentMenus.findIndex(
                (item) =>
                  item.id ===
                  formattedMenu.id
              );

            let updatedMenus;

            // =================================================
            // MENU SUDAH ADA → UPDATE
            // =================================================

            if (
              existingIndex !== -1
            ) {
              updatedMenus =
                [...currentMenus];

              updatedMenus[
                existingIndex
              ] =
                formattedMenu;

              console.log(
                "✏️ Menu diperbarui:",
                formattedMenu
              );
            }

            // =================================================
            // MENU BELUM ADA → TAMBAH
            // =================================================

            else {
              updatedMenus = [
                ...currentMenus,
                formattedMenu,
              ];

              console.log(
                "➕ Menu baru ditambahkan:",
                formattedMenu
              );
            }

            // =================================================
            // UPDATE CACHE
            // =================================================

            sessionStorage.setItem(
              "customer_menu",
              JSON.stringify(
                updatedMenus
              )
            );

            // =================================================
            // UPDATE CATEGORY
            // =================================================

            setCategories(
              buildCategories(
                updatedMenus
              )
            );

            return updatedMenus;
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
  // LABELED MENU GROUPS
  // =========================================================

  const labeledGroups =
    useMemo(() => {
      const groups = {};

      filteredItems
        .filter(
          (item) =>
            item.label
        )
        .forEach(
          (item) => {
            const label =
              item.label.trim();

            if (!groups[label]) {
              groups[label] = [];
            }

            groups[label].push(
              item
            );
          }
        );

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
  // REGULAR MENU
  // =========================================================

  const regularItems =
    useMemo(() => {
      return filteredItems.filter(
        (item) =>
          !item.label
      );
    }, [
      filteredItems,
    ]);

  // =========================================================
  // GROUP MENU BY CATEGORY
  // =========================================================

  const groupedItems =
    useMemo(() => {
      const groups = {};

      regularItems.forEach(
        (item) => {
          const categoryKey =
            item.categoryId ||
            "uncategorized";

          if (
            !groups[
              categoryKey
            ]
          ) {
            groups[
              categoryKey
            ] = {
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
      regularItems,
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

      price:
        product.price,
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

  if (
    loading &&
    menuItems.length === 0
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

        {/* ===================================================
            TOP SPACING
        =================================================== */}

        <div className="h-[42px]" />

        {/* ===================================================
            BANNER
        =================================================== */}

        <div className="px-[22px]">

          <img
            src={bannerburger}
            alt="Good Burger"
            className="h-[176px] w-full rounded-[17px] object-cover"
          />

        </div>

        {/* ===================================================
            SEARCH
        =================================================== */}

        <div className="mt-[27px]">

          <SearchBar
            value={search}
            onChange={setSearch}
          />

        </div>

        {/* ===================================================
            CHECKERBOARD
        =================================================== */}

        <div className="relative z-0 mt-[14px] h-[44px] overflow-hidden border-y-2 border-[#292826] dark:border-[#333333]">

          <img
            src={checkerboard}
            alt=""
            className="h-full w-full object-cover dark:opacity-80"
          />

        </div>

        {/* ===================================================
            LABELED MENU
        =================================================== */}

        {labeledGroups.map(
          (group) => (

            <section
              key={group.label}
              className="mt-[28px]"
            >

              {/* LABEL TITLE */}

              <div className="px-4">

                <h2
                  className="
                    text-[22px]
                    font-black
                    uppercase
                    leading-[26px]
                    tracking-[-0.5px]
                    text-[#111]
                    transition-colors
                    duration-300
                    dark:text-white
                  "
                >
                  {group.label}
                </h2>

              </div>

              {/* HORIZONTAL CARDS */}

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

        {/* ===================================================
            REGULAR CATEGORY MENU
        =================================================== */}

        {groupedItems.map(
          (group) => (

            <section
              key={group.id}
              className="mt-[28px]"
            >

              {/* CATEGORY TITLE */}

              <div className="px-4">

                <h2
                  className="
                    text-[22px]
                    font-black
                    uppercase
                    leading-[26px]
                    tracking-[-0.5px]
                    text-[#111]
                    transition-colors
                    duration-300
                    dark:text-white
                  "
                >
                  {group.name}
                </h2>

              </div>

              {/* CATEGORY ITEMS */}

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

            </section>

          )
        )}

        {/* ===================================================
            EMPTY RESULT
        =================================================== */}

        {filteredItems.length ===
          0 && (

          <div className="px-5 py-16 text-center">

            <p className="text-[15px] font-semibold text-[#777] transition-colors duration-300 dark:text-[#a1a1aa]">

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
              className="mt-3 text-[13px] font-bold underline transition-colors duration-300 dark:text-white"
            >
              Reset filter
            </button>

          </div>

        )}

        {/* ===================================================
            FOOTER
            FOOTER SEKARANG ADA DI DALAM MAIN
            JADI IKUT SCROLL DAN BERADA SETELAH SEMUA MENU
        =================================================== */}

        <Footer />

      </main>

      {/* =====================================================
          FIXED CART
          TETAP NEMPEL DI BAWAH LAYAR
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

