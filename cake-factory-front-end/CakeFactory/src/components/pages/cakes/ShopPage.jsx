import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import CakeCard from "./CakeCard";
import { useData } from '../../../context/DataContext.jsx';
import "./shop.css";

const ShopPage = () => {
  const navigate = useNavigate();
  const { allCakes, isLoading, currentUser } = useData();

  const [activeCategory, setActiveCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSelectCake = (cake) => {
        if (!currentUser) {
        // If NOT logged in, go to login and save intended destination
           navigate('/login', {
            state: { redirectTo: '/order', cakeId: cake.id }
        });
        } else {
            // If ALREADY logged in, go straight to order
            navigate('/order', { state: { cakeId: cake.id } });
        }
  };

  // Deriving unique categories from allCakes
  const categories = useMemo(() => {
        if (!allCakes) return ["All"];
        const cats = allCakes.map((c) => c.category).filter(Boolean);
        return ["All", ...new Set(cats)];
  }, [allCakes]);

  // Deriving price bounds for placeholder values in price filter inputs
  const { lowestPrice, highestPrice } = useMemo(() => {
        if (!allCakes || !allCakes.length) return { lowestPrice: 0, highestPrice: 0 };
        const prices = allCakes.map((c) => Number(c.price)).filter((p) => !isNaN(p));
        return { lowestPrice: Math.min(...prices), highestPrice: Math.max(...prices) };
  }, [allCakes]);

  // Filter cakes by category + price range
  const filteredCakes = useMemo(() => {
        if (!allCakes) return [];
        return allCakes.filter((cake) => {
            const matchesCategory = activeCategory === "All" || cake.category === activeCategory;
            const price = Number(cake.price);
            const matchesMin = minPrice === "" || price >= Number(minPrice);
            const matchesMax = maxPrice === "" || price <= Number(maxPrice);
            return matchesCategory && matchesMin && matchesMax;
        });
  }, [allCakes, activeCategory, minPrice, maxPrice]);

  const hasActiveFilters = activeCategory !== "All" || minPrice !== "" || maxPrice !== "";

  const clearFilters = () => {
        setActiveCategory("All");
        setMinPrice("");
        setMaxPrice("");
  };

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

      {/* Filters row */}
      <div className="shop-filter-wrapper">
        {/* Category */}
        <div className="shop-filter-group">
          <label htmlFor="category-filter" className="shop-filter-label">
            Category:
          </label>
          <select
            id="category-filter"
            className="shop-filter-select-Input"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Min price */}
        <div className="shop-filter-group">
          <label htmlFor="min-price" className="shop-filter-label">
            Min Price ($) :
          </label>
          <input
            id="min-price"
            type="number"
            className="shop-filter-select-Input"
            placeholder={`e.g. ${lowestPrice}`}
            value={minPrice}
            min={0}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        {/* Max price */}
        <div className="shop-filter-group">
          <label htmlFor="max-price" className="shop-filter-label">
            Max Price ($) :
          </label>
          <input
            id="max-price"
            type="number"
            className="shop-filter-select-Input"
            placeholder={`e.g. ${highestPrice}`}
            value={maxPrice}
            min={0}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button onClick={clearFilters}>
            ✕ Clear Filters
          </button>
        )}
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
              <CakeCard cake={cake} onSelect={handleSelectCake} />
            </div>
          ))}
        </div>
      ) : (
        <div className="shop-empty">
          <span className="shop-empty-icon">🎂</span>
          <p>No cakes found matching your filters.</p>
          <button className="common-btn" onClick={clearFilters}>
            🔄 Show All Cakes
          </button>
        </div>
      )}
    </main>
  );
};

export default ShopPage;