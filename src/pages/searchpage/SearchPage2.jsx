import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchPage2 = () => {
  const [search, setSearch] = useState("Samsung Galaxy F14 5G");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const amazonUrl = `https://www.amazon.in/s?k=${search.replace(/ /g, "+")}`;
  const flipkartUrl = `https://www.flipkart.com/search?q=${search.replace(
    / /g,
    "+"
  )}`;

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleScrape = async () => {
    setIsLoading(true);
    setError("");
    setProducts([]); // Clear previous products
    let errorMessages = [];

    try {
      // Run both scrapers concurrently
      const [amazonResponse, flipkartResponse] = await Promise.all([
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
      ]);

      // Process Amazon results
      let amazonProducts = [];
      if (amazonResponse.error) {
        errorMessages.push(amazonResponse.error);
      } else {
        amazonProducts = amazonResponse.map((product) => ({
          ...product,
          source: "amazon",
        }));
      }

      // Process Flipkart results
      let flipkartProducts = [];
      if (flipkartResponse.error) {
        errorMessages.push(flipkartResponse.error);
      } else {
        flipkartProducts = flipkartResponse.map((product) => ({
          ...product,
          source: "flipkart",
        }));
      }

      // Combine products
      const combinedProducts = [...amazonProducts, ...flipkartProducts];
      setProducts(combinedProducts);

      // Set success or error message
      if (combinedProducts.length > 0) {
        setError("Scraping completed successfully!");
      } else if (errorMessages.length > 0) {
        setError(errorMessages.join(" | "));
      } else {
        setError("No products found from either platform.");
      }

      // Clear error message after 3 seconds
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Search Page</h1>
        {error && (
          <p className="text-red-500 text-xs mb-4 text-center">{error}</p>
        )}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter search term (e.g., Samsung Galaxy F14 5G)"
          />
          <div className="mt-2">
            <button
              onClick={handleScrape}
              disabled={isLoading || !search.trim()}
              className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Scraping..." : "Search"}
            </button>
          </div>
        </div>
        <div className="mb-6">
          <p className="text-gray-600">Amazon URL: {amazonUrl}</p>
          <button
            onClick={() => handleNavigate(amazonUrl)}
            className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Visit Amazon
          </button>
          <p className="text-gray-600 mt-4">Flipkart URL: {flipkartUrl}</p>
          <button
            onClick={() => handleNavigate(flipkartUrl)}
            className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Visit Flipkart
          </button>
        </div>
        {products.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Scraped Products
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product, index) => (
                <div key={index} className="border p-4 rounded-lg shadow-sm">
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
                    Reviews: {product.reviews.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Source:{" "}
                    {product.source.charAt(0).toUpperCase() +
                      product.source.slice(1)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage2;
