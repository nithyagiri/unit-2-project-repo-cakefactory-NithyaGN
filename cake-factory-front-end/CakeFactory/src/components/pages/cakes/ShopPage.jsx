import { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router";
import CakeCard from "./CakeCard";
import { useData } from '../../../context/DataContext';
import "./shop.css";

const ShopPage = () => {
  const navigate = useNavigate();
  const { allCakes, isLoading } = useData();
  if (allCakes && allCakes.length > 0) {
    console.log("category value:", allCakes[0].category);
    console.log("category type:", typeof allCakes[0].category);
  }
  const [activeCategory, setActiveCategory] = useState("All");

  const handleSelectCake = (cake) => {
      navigate("/order", { state: { cakeId: cake.id } });
  };

  // Derive unique categories from allCakes
  const categories = useMemo(() => {
    if (!allCakes) return ["All"];
    const cats = allCakes.map((c) => c.category).filter(Boolean);
    return ["All", ...new Set(cats)];
  }, [allCakes]);

  // Filter cakes by selected category
  const filteredCakes = useMemo(() => {
    if (!allCakes) return [];
    if (activeCategory === "All") return allCakes;
    return allCakes.filter((cake) => cake.category === activeCategory);
  }, [allCakes, activeCategory]);

  // Loading state
  if (isLoading) {
    return (
      <main className="main-content">
        <div className="shop-empty">
          <span className="shop-empty-icon">🎂</span>
          <p>⏳ Loading cakes...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content">
      <h1>All Occasion Cakes and Cupcakes</h1>

      {/* Category dropdown filter */}
      <div className="shop-filter-wrapper">
        <label htmlFor="category-filter" className="shop-filter-label">
          Filter by Category:
        </label>
        <select
          id="category-filter"
          className="shop-filter-select"
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="shop-results-count">
        {filteredCakes.length} cake{filteredCakes.length !== 1 ? "s" : ""} found
      </p>

      {/* Cake grid */}
      {filteredCakes.length ? (
        <div id="cake-card-container">
          {filteredCakes.map((cake) => (
            <div className="cake-card" key={cake.id}> 
            <CakeCard
              cake={cake}
              onSelect={handleSelectCake}
            />
             </div>
          ))}
        </div>
      ) : (
        <div className="shop-empty">
          <span className="shop-empty-icon">🎂</span>
          <p>No cakes found in this category. Please visit again.</p>
          <button className="common-btn" onClick={() => setActiveCategory("All")}>
            🔄 Show All Cakes
          </button>
        </div>
      )}
    </main>
  );
};

export default ShopPage;
