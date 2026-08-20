import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../../../components/costumer/menu/SearchBar";
import CategoryTabs from "../../../components/costumer/menu/CategoryTabs";
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

  const {
    addToCart,
    totalItems,
    totalPrice,
  } = useCart();

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

  const comboItems = filteredItems.filter(
    (item) => item.category === "combo"
  );

  const burgerItems = filteredItems.filter(
    (item) => item.category === "burger"
  );

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

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fffcf4] pb-24">

      {/* ================= TOP SPACING ================= */}
      <div className="h-[42px]" />

      {/* ================= BANNER ================= */}
      <div className="px-[22px]">
        <img
          src={bannerburger}
          alt="Good Burger"
          className="h-[176px] w-full rounded-[17px] object-cover"
        />
      </div>

      {/* ================= SEARCH ================= */}
      <div className="mt-[17px]">
        <SearchBar
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* ================= CATEGORIES ================= */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* ================= CHECKERBOARD ================= */}
      <div className="mt-2 h-[44px] overflow-hidden border-y-2 border-[#292826]">
        <img
          src={checkerboard}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      {/* ================= COMBO ================= */}
      {(activeCategory === "all" ||
        activeCategory === "combo") &&
        comboItems.length > 0 && (
          <section className="mt-[16px]">
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
                      navigate(`costumer/menu/${product.id}`)
                    }
                  />
                ))}

              </div>
            </div>
          </section>
        )}

      {/* ================= BEST BURGER ================= */}
      {(activeCategory === "all" ||
        activeCategory === "burger") &&
        burgerItems.length > 0 && (
          <section className="mt-[28px]">
            <SectionTitle>
              BEST BURGER
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
                      navigate(`costumer/menu/${product.id}`)
                    }
                  />
                ))}

              </div>
            </div>
          </section>
        )}

      {/* ================= CART BAR ================= */}
      <CartBar
        itemCount={totalItems}
        total={totalPrice}
      />

    </main>
  );
}