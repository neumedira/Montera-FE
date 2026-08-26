import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../../../components/costumer/menu/SearchBar";
import SectionTitle from "../../../components/costumer/menu/SectionTitle";
import ProductCard from "../../../components/costumer/menu/ProductCard";
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
     CHANGE CATEGORY
  ========================================= */

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setCategoryOpen(false);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fffcf4] pb-[150px]">

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

      <div className="relative z-0 mt-[14px] h-[44px] overflow-hidden border-y-2 border-[#292826]">
        <img
          src={checkerboard}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      {/* =====================================
          COMBO
      ===================================== */}

      {(activeCategory === "all" ||
        activeCategory === "combo") &&
        comboItems.length > 0 && (
          <section className="mt-[18px]">
            <SectionTitle>
              COMBO
            </SectionTitle>

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
                      navigate(`/menu/${product.id}`)
                    }
                  />
                ))}
              </div>
            </div>
          </section>
        )}

      {/* =====================================
          BURGER
      ===================================== */}

      {(activeCategory === "all" ||
        activeCategory === "burger") &&
        burgerItems.length > 0 && (
          <section className="mt-[28px]">
            <SectionTitle>
              BURGER
            </SectionTitle>

            <div className="mt-[14px] overflow-x-auto px-4 scrollbar-hide">
              <div className="flex w-max gap-4">
                {burgerItems.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={() =>
                      handleAddToCart(product)
                    }
                    onClick={() =>
                      navigate(`/menu/${product.id}`)
                    }
                  />
                ))}
              </div>
            </div>
          </section>
        )}

      {/* =====================================
          DRINK
      ===================================== */}

      {(activeCategory === "all" ||
        activeCategory === "drink") &&
        drinkItems.length > 0 && (
          <section className="mt-[28px]">
            <SectionTitle>
              DRINK
            </SectionTitle>

            <div className="mt-[14px] overflow-x-auto px-4 scrollbar-hide">
              <div className="flex w-max gap-4">
                {drinkItems.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={() =>
                      handleAddToCart(product)
                    }
                    onClick={() =>
                      navigate(`/menu/${product.id}`)
                    }
                  />
                ))}
              </div>
            </div>
          </section>
        )}

      {/* =====================================
          SNACK
      ===================================== */}

      {(activeCategory === "all" ||
        activeCategory === "snack") &&
        snackItems.length > 0 && (
          <section className="mt-[28px]">
            <SectionTitle>
              SNACK
            </SectionTitle>

            <div className="mt-[14px] overflow-x-auto px-4 scrollbar-hide">
              <div className="flex w-max gap-4">
                {snackItems.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={() =>
                      handleAddToCart(product)
                    }
                    onClick={() =>
                      navigate(`/menu/${product.id}`)
                    }
                  />
                ))}
              </div>
            </div>
          </section>
        )}

      {/* =====================================
          EMPTY RESULT
      ===================================== */}

      {filteredItems.length === 0 && (
        <div className="px-5 py-16 text-center">
          <p className="text-[15px] font-semibold text-[#777]">
            Menu tidak ditemukan
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setActiveCategory("all");
            }}
            className="mt-3 text-[13px] font-bold underline"
          >
            Reset filter
          </button>
        </div>
      )}

      {/* =====================================
          FLOATING MENU + CART
      ===================================== */}

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

    </main>
  );
}