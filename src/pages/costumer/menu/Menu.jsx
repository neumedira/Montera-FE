
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../../../components/costumer/menu/SearchBar";
import ProductCard from "../../../components/costumer/menu/ProductCard";
import ProductListItem from "../../../components/costumer/menu/ProductListItem";
import CartBar from "../../../components/costumer/menu/CartBar";
import LoadingScreen from "../../../components/costumer/menu/LoadingScreen";

import bannerburger from "../../../assets/costumer/bannerburger.png";
import checkerboard from "../../../assets/costumer/checkerboard.png";

import { useCart } from "../../../context/CartContext";
import { getCustomerMenus } from "../../../api/costumer";

export default function MenuPage() {
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);

  const [categories, setCategories] = useState([
    {
      id: "all",
      name: "All",
    },
  ]);

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    addToCart,
    totalItems,
    totalPrice,
  } = useCart();

  // =========================================================
  // FETCH CUSTOMER MENU
  // =========================================================

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCustomerMenus();

        console.log("CUSTOMER MENU API:", response);

        const rawMenus = response?.data || [];

        console.log("RAW CUSTOMER MENU:", rawMenus);

        // =====================================================
        // FORMAT MENU
        // =====================================================

        const formattedMenus = rawMenus
          .filter((item) => item.is_active)
          .map((item) => {
            const categoryName =
              item.category?.name?.toLowerCase() ||
              "uncategorized";

            return {
              id: item.id,
              name: item.name,
              price: Number(item.price),
              description: item.description || "",

              // Foto dari backend
              image: item.photo_url || null,

              // Kategori
              category: categoryName,
              categoryId:
                item.category?.id ||
                item.category_id,

              categoryName:
                item.category?.name ||
                "Lainnya",

              // Untuk sementara
              bestseller: false,

              // Add-on dari backend
              addons: item.addons || [],
            };
          });

        console.log(
          "FORMATTED CUSTOMER MENU:",
          formattedMenus
        );

        setMenuItems(formattedMenus);

        // =====================================================
        // BUILD CATEGORY DARI API
        // =====================================================

        const categoryMap = new Map();

        formattedMenus.forEach((item) => {
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

        const formattedCategories = [
          {
            id: "all",
            name: "All",
          },
          ...Array.from(categoryMap.values()),
        ];

        console.log(
          "FORMATTED CUSTOMER CATEGORIES:",
          formattedCategories
        );

        setCategories(formattedCategories);
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
    return menuItems.filter((item) => {
      const categoryMatch =
        activeCategory === "all" ||
        item.category === activeCategory;

      const searchMatch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [
    menuItems,
    activeCategory,
    search,
  ]);

  // =========================================================
  // GROUP MENU BERDASARKAN CATEGORY
  // =========================================================

  const groupedItems = useMemo(() => {
    const groups = {};

    filteredItems.forEach((item) => {
      const categoryKey =
        item.categoryId || "uncategorized";

      if (!groups[categoryKey]) {
        groups[categoryKey] = {
          id: categoryKey,
          name: item.categoryName || "Lainnya",
          items: [],
        };
      }

      groups[categoryKey].items.push(item);
    });

    return Object.values(groups);
  }, [filteredItems]);

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = (product) => {
    addToCart({
      ...product,

      costumizations: {
        cheese: false,
        onion: false,
      },

      notes: "",

      price: product.price,
    });
  };

  // =========================================================
  // PRODUCT DETAIL
  // =========================================================

  const handleProductClick = (product) => {
    navigate(`/menu/${product.id}`);
  };

  // =========================================================
  // CHANGE CATEGORY
  // =========================================================

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setCategoryOpen(false);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return <LoadingScreen />;
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
          onClick={() => window.location.reload()}
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

        {/* =====================================================
            TOP SPACING
        ===================================================== */}

        <div className="h-[42px]" />

        {/* =====================================================
            BANNER
        ===================================================== */}

        <div className="px-[22px]">
          <img
            src={bannerburger}
            alt="Good Burger"
            className="h-[176px] w-full rounded-[17px] object-cover"
          />
        </div>

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <div className="mt-[27px]">
          <SearchBar
            value={search}
            onChange={setSearch}
          />
        </div>

        {/* =====================================================
            CHECKERBOARD
        ===================================================== */}

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

        {groupedItems.map((group) => (
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
                  dark:text-white
                  transition-colors
                  duration-300
                "
              >
                {group.name}
              </h2>
            </div>

            {/* =================================================
                COMBO
                CARD HORIZONTAL
            ================================================= */}

            {group.name.toLowerCase() === "combo" ? (

              <div className="mt-[14px] overflow-x-auto px-4 scrollbar-hide">
                <div className="flex w-max gap-4">

                  {group.items.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAdd={() =>
                        handleAddToCart(product)
                      }
                      onClick={() =>
                        handleProductClick(product)
                      }
                    />
                  ))}

                </div>
              </div>

            ) : (

              /* =================================================
                 CATEGORY BIASA
              ================================================= */

              <div className="mt-[6px] px-4">

                {group.items.map((product) => (
                  <ProductListItem
                    key={product.id}
                    product={product}
                    onAdd={handleAddToCart}
                    onClick={() =>
                      handleProductClick(product)
                    }
                  />
                ))}

              </div>
            )}

          </section>
        ))}

        {/* =====================================================
            EMPTY RESULT
        ===================================================== */}

        {filteredItems.length === 0 && (
          <div className="px-5 py-16 text-center">

            <p className="text-[15px] font-semibold text-[#777] dark:text-[#a1a1aa] transition-colors duration-300">
              Menu tidak ditemukan
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
              }}
              className="mt-3 text-[13px] font-bold underline dark:text-white transition-colors duration-300"
            >
              Reset filter
            </button>

          </div>
        )}

      </main>

      {/* =====================================================
          FIXED MENU + CART
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
            itemCount={totalItems}
            total={totalPrice}
            categories={categories}
            activeCategory={activeCategory}
            categoryOpen={categoryOpen}
            onToggleCategory={() =>
              setCategoryOpen((prev) => !prev)
            }
            onCategoryChange={handleCategoryChange}
          />

        </div>
      </div>

    </div>
  );
}

