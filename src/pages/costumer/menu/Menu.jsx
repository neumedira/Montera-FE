import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../../../components/costumer/menu/SearchBar";
import ProductCard from "../../../components/costumer/menu/ProductCard";
import ProductListItem from "../../../components/costumer/menu/ProductListItem";
import CartBar from "../../../components/costumer/menu/CartBar";

import { categories, menuItems } from "../../../data/menuData";

import bannerburger from "../../../assets/costumer/bannerburger.png";
import checkerboard from "../../../assets/costumer/checkerboard.png";

import { useCart } from "../../../context/CartContext";

export default function MenuPage() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  const {
    addToCart,
    totalItems,
    totalPrice,
  } = useCart();

  /* =========================================
     FILTER MENU
  ========================================= */

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
  }, [activeCategory, search]);

  /* =========================================
     CATEGORY DATA
  ========================================= */

  const comboItems = filteredItems.filter(
    (item) => item.category === "combo"
  );

  const burgerItems = filteredItems.filter(
    (item) => item.category === "burger"
  );

  const drinkItems = filteredItems.filter(
    (item) => item.category === "drink"
  );

  const snackItems = filteredItems.filter(
    (item) => item.category === "snack"
  );

  /* =========================================
     ADD TO CART
  ========================================= */

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

  /* =========================================
     PRODUCT DETAIL
  ========================================= */

  const handleProductClick = (product) => {
    navigate(`/menu/${product.id}`);
  };

  /* =========================================
     CHANGE CATEGORY
  ========================================= */

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setCategoryOpen(false);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#fffcf4] dark:bg-[#121212] transition-colors duration-300">
      {/* Komentar boleh ditaruh di dalam div ini */}
      {/* =====================================
         SCROLLABLE CONTENT
      ===================================== */}

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

        {/* =====================================
            TOP SPACING
        ===================================== */}

        <div className="h-[42px]" />

        {/* =====================================
            BANNER
        ===================================== */}

        <div className="px-[22px]">
          <img
            src={bannerburger}
            alt="Good Burger"
            className="h-[176px] w-full rounded-[17px] object-cover"
          />
        </div>

        {/* =====================================
            SEARCH
        ===================================== */}

        <div className="mt-[27px]">
          <SearchBar
            value={search}
            onChange={setSearch}
          />
        </div>

        {/* =====================================
            CHECKERBOARD
        ===================================== */}

        {/* Menambahkan border yang lebih menyesuaikan saat dark mode */}
        <div className="relative z-0 mt-[14px] h-[44px] overflow-hidden border-y-2 border-[#292826] dark:border-[#333333]">
          <img
            src={checkerboard}
            alt=""
            className="h-full w-full object-cover dark:opacity-80" 
          />
        </div>

        {/* =====================================
            COMBO
            HORIZONTAL CARD
        ===================================== */}

        {(activeCategory === "all" ||
          activeCategory === "combo") &&
          comboItems.length > 0 && (
            <section className="mt-[18px]">

              <div className="px-4">
                {/* Mengubah teks menjadi putih saat dark mode */}
                <h2 className="text-[22px] font-black uppercase leading-[26px] tracking-[-0.5px] text-[#111] dark:text-white transition-colors duration-300">
                  COMBO
                </h2>
              </div>

              <div className="mt-[14px] overflow-x-auto px-4 scrollbar-hide">
                <div className="flex w-max gap-4">
                  {comboItems.map((product) => (
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

            </section>
          )}

        {/* =====================================
            BURGER
            VERTICAL LIST
        ===================================== */}

        {(activeCategory === "all" ||
          activeCategory === "burger") &&
          burgerItems.length > 0 && (
            <section className="mt-[28px]">

              <div className="px-4">
                <h2 className="text-[22px] font-black uppercase leading-[26px] tracking-[-0.5px] text-[#111] dark:text-white transition-colors duration-300">
                  BURGER
                </h2>
              </div>

              <div className="mt-[6px] px-4">
                {burgerItems.map((product) => (
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

            </section>
          )}

        {/* =====================================
            DRINK
            VERTICAL LIST
        ===================================== */}

        {(activeCategory === "all" ||
          activeCategory === "drink") &&
          drinkItems.length > 0 && (
            <section className="mt-[28px]">

              <div className="px-4">
                <h2 className="text-[22px] font-black uppercase leading-[26px] tracking-[-0.5px] text-[#111] dark:text-white transition-colors duration-300">
                  DRINK
                </h2>
              </div>

              <div className="mt-[6px] px-4">
                {drinkItems.map((product) => (
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

            </section>
          )}

        {/* =====================================
            SNACK
            VERTICAL LIST
        ===================================== */}

        {(activeCategory === "all" ||
          activeCategory === "snack") &&
          snackItems.length > 0 && (
            <section className="mt-[28px]">

              <div className="px-4">
                <h2 className="text-[22px] font-black uppercase leading-[26px] tracking-[-0.5px] text-[#111] dark:text-white transition-colors duration-300">
                  SNACK
                </h2>
              </div>

              <div className="mt-[6px] px-4">
                {snackItems.map((product) => (
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

            </section>
          )}

        {/* =====================================
            EMPTY RESULT
        ===================================== */}

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

      {/* =====================================
          FIXED MENU + CART
          TIDAK IKUT SCROLL
      ===================================== */}

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