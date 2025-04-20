import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SearchPagev3 = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("none");
  const [filterSource, setFilterSource] = useState("both");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [ratingFilter, setRatingFilter] = useState("all");
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleScrape = async () => {
    setIsLoading(true);
    setError("");
    setProducts([]);
    let errorMessages = [];

    try {
      const [
        amazonResponse,
        flipkartResponse,
        zeptoResponse,
        instamartResponse,
        bigbasketResponse,
      ] = await Promise.all([
        fetch(
          `http://localhost:3001/scrape-amazon?search=${search.replace(
            / /g,
            "+"
          )}`
        )
          .then((res) => res.json())
          .catch((e) => ({ error: `Amazon scraping failed: ${e.message}` })),
        fetch(
          `http://localhost:3001/scrape-flipkart?search=${search.replace(
            / /g,
            "+"
          )}`
        )
          .then((res) => res.json())
          .catch((e) => ({ error: `Flipkart scraping failed: ${e.message}` })),
        fetch(
          `http://localhost:3001/scrape-zepto?search=${search.replace(
            / /g,
            "+"
          )}`
        )
          .then((res) => res.json())
          .catch((e) => ({ error: `Zepto scraping failed: ${e.message}` })),
        fetch(
          `http://localhost:3001/scrape-instamart?search=${search.replace(
            / /g,
            "+"
          )}`
        )
          .then((res) => res.json())
          .catch((e) => ({ error: `Instamart scraping failed: ${e.message}` })),
        fetch(
          `http://localhost:3001/scrape-bigbasket?search=${search.replace(
            / /g,
            "+"
          )}`
        )
          .then((res) => res.json())
          .catch((e) => ({ error: `BigBasket scraping failed: ${e.message}` })),
      ]);

      let amazonProducts = [];
      if (amazonResponse.error) {
        errorMessages.push(amazonResponse.error);
      } else {
        amazonProducts = amazonResponse.slice(0, 5).map((product) => ({
          ...product,
          source: "amazon",
        }));
      }

      let flipkartProducts = [];
      if (flipkartResponse.error) {
        errorMessages.push(flipkartResponse.error);
      } else {
        flipkartProducts = flipkartResponse.slice(0, 5).map((product) => ({
          ...product,
          source: "flipkart",
        }));
      }

      let zeptoProducts = [];
      if (zeptoResponse.error) {
        errorMessages.push(zeptoResponse.error);
      } else {
        zeptoProducts = zeptoResponse.slice(0, 5).map((product) => ({
          ...product,
          source: "zepto",
        }));
      }

      let instamartProducts = [];
      if (instamartResponse.error) {
        errorMessages.push(instamartResponse.error);
      } else {
        instamartProducts = instamartResponse.slice(0, 5).map((product) => ({
          ...product,
          source: "instamart",
        }));
      }

      let bigbasketProducts = [];
      if (bigbasketResponse.error) {
        errorMessages.push(bigbasketResponse.error);
      } else {
        bigbasketProducts = bigbasketResponse.slice(0, 5).map((product) => ({
          ...product,
          source: "bigbasket",
        }));
      }

      const combinedProducts = [
        ...amazonProducts,
        ...flipkartProducts,
        ...zeptoProducts,
        ...instamartProducts,
        ...bigbasketProducts,
      ];
      setProducts(combinedProducts);

      if (combinedProducts.length > 0) {
        setError("Scraping completed successfully!");
      } else if (errorMessages.length > 0) {
        setError(errorMessages.join(" | "));
      } else {
        setError("No products found from either platform.");
      }

      setTimeout(() => setError(""), 3000);
    } catch (err) {
      setError(`Error scraping data: ${err.message}`);
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (url) => {
    window.open(url, "_blank");
  };

  const handleProductClick = (productUrl) => {
    if (productUrl !== "N/A") {
      handleNavigate(productUrl);
    }
  };

  const handleDashboard = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  const sortProducts = (products) => {
    if (sortBy === "price-low-high") {
      return [...products].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high-low") {
      return [...products].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating-high-low") {
      return [...products].sort((a, b) => b.rating - a.rating);
    }
    return products;
  };

  const filterProducts = (products) => {
    return products.filter((product) => {
      const withinPriceRange =
        product.price >= priceRange.min && product.price <= priceRange.max;
      const matchesSource =
        filterSource === "both" || product.source === filterSource;
      const matchesRating =
        ratingFilter === "all" ||
        (ratingFilter === "3" && product.rating >= 3) ||
        (ratingFilter === "4" && product.rating >= 4) ||
        (ratingFilter === "5" && product.rating >= 5);

      return withinPriceRange && matchesSource && matchesRating;
    });
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange((prev) => ({
      ...prev,
      [e.target.name === "min" ? "min" : "max"]: value,
    }));
  };

  const displayedProducts = sortProducts(filterProducts(products));

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col">
      {/* Header with User Icon on the Left */}
      <div className="flex items-center justify-between p-4 bg-white shadow-md">
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-gray-800">
          SEARCH PAGE
        </h1>
        <FaUserCircle
          className="ml-auto text-3xl text-gray-700 cursor-pointer mr-2"
          onClick={handleDashboard}
        />
      </div>

      <div className="flex-grow p-4 overflow-auto">
        {error && (
          <p className="text-red-500 text-xs mb-4 text-center">{error}</p>
        )}
        <div className="flex flex-col md:flex-row gap-6 h-full">
          {/* Filter Panel */}
          <div className="w-full md:w-1/4 bg-orange-100 p-4 rounded-lg h-full overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">FILTER</h3>
            <div className="space-y-4">
              {/* Price Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price Range (₹)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="min"
                    value={priceRange.min}
                    onChange={handlePriceChange}
                    min="0"
                    max={priceRange.max}
                    className="w-1/2 px-2 py-1 border rounded"
                  />
                  <input
                    type="number"
                    name="max"
                    value={priceRange.max}
                    onChange={handlePriceChange}
                    min={priceRange.min}
                    max="1000000"
                    className="w-1/2 px-2 py-1 border rounded"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({
                      ...prev,
                      max: parseInt(e.target.value),
                    }))
                  }
                  className="w-full mt-2"
                />
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rating
                </label>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="all">All</option>
                  <option value="3">3 Stars and Above</option>
                  <option value="4">4 Stars and Above</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4 h-full overflow-y-auto">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                className="w-full md:w-2/3 px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter search term (e.g., Samsung Galaxy F14 5G)"
              />
              <div className="mt-2 md:mt-0 md:ml-4 flex space-x-20">
                <button
                  onClick={handleScrape}
                  disabled={isLoading || !search.trim()}
                  className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Scraping..." : "Search"}
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">Sort by: None</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating-high-low">Rating: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {displayedProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {displayedProducts.map((product, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-lg shadow-sm bg-white cursor-pointer"
                    onClick={() => handleProductClick(product.product_url)}
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-contain mb-2"
                    />
                    <h4 className="text-md font-semibold text-gray-800">
                      {product.name}
                    </h4>
                    <p className="text-gray-600">
                      Price: ₹{product.price.toLocaleString()}
                    </p>
                    <p className="text-gray-600">Rating: {product.rating} ★</p>
                    <p className="text-gray-600">
                      Reviews:{" "}
                      {product.reviews
                        ? product.reviews.toLocaleString()
                        : "N/A"}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Source:{" "}
                      {product.source.charAt(0).toUpperCase() +
                        product.source.slice(1)}
                    </p>
                    <p className="text-blue-500 text-sm mt-2 underline">
                      {product.product_url !== "N/A"
                        ? "View Product"
                        : "No link available"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPagev3;
