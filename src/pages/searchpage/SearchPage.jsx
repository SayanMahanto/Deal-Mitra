import React, { useState } from "react";
import RedBag from "../searchpage/RedBag.jpg";
import black from "../searchpage/blackBag.jpg";
import { FaStar, FaUserCircle } from "react-icons/fa";

const products = [
  {
    id: 1,
    name: "Tiny pouch",
    color: "Blue",
    price: "$100",
    image: RedBag,
    category: "Bags",
    rating: 4.2,
  },
  {
    id: 2,
    name: "Some tote",
    color: "Red",
    price: "$150",
    image: black,
    category: "Bags",
    rating: 3.5,
  },
  {
    id: 3,
    name: "Cozy Jacket",
    color: "Blue",
    price: "$200",
    image: RedBag,
    category: "Jackets",
    rating: 4.8,
  },
  {
    id: 4,
    name: "Fancy Shoes",
    color: "Black",
    price: "$120",
    image: black,
    category: "Shoes",
    rating: 4.0,
  },
];

const filters = [
  "Bags",
  "Shoes",
  "Jackets",
  "Electronics",
  "Books",
  "Clothing",
  "Home & Kitchen",
  "Beauty",
  "Toys",
  "Groceries",
];

const colors = [
  "Blue",
  "Red",
  "Brown",
  "Pink",
  "Silver",
  "Purple",
  "Yellow",
  "Orange",
  "Black",
  "Gray",
  "White",
  "Green",
];

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");
  const [sortByRating, setSortByRating] = useState("");

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const handleColorChange = (e) => {
    const color = e.target.id;
    setSelectedColor((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
  };

  const handleRatingSortChange = (e) => {
    setSortByRating(e.target.value);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = selectedFilter
      ? product.category === selectedFilter
      : true;
    const matchesColor =
      selectedColor.length > 0 ? selectedColor.includes(product.color) : true;
    return matchesSearch && matchesCategory && matchesColor;
  });

  let sortedProducts = [...filteredProducts];

  if (selectedSort === "price-low-high") {
    sortedProducts.sort(
      (a, b) =>
        parseFloat(a.price.replace("$", "")) -
        parseFloat(b.price.replace("$", ""))
    );
  } else if (selectedSort === "price-high-low") {
    sortedProducts.sort(
      (a, b) =>
        parseFloat(b.price.replace("$", "")) -
        parseFloat(a.price.replace("$", ""))
    );
  }

  if (sortByRating === "rating-high-low") {
    sortedProducts.sort((a, b) => b.rating - a.rating);
  } else if (sortByRating === "rating-low-high") {
    sortedProducts.sort((a, b) => a.rating - b.rating);
  }

  return (
    <div className="p-4 md:p-6">
      {/* Top bar with title and user icon */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Search Page</h1>
        <FaUserCircle className="text-3xl text-gray-700 cursor-pointer" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-1/4">
          <h2 className="font-semibold mb-2">Filters</h2>
          <select
            value={selectedFilter}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded px-2 py-2 mb-4"
          >
            <option value="">Select Category</option>
            {filters.map((filter) => (
              <option key={filter} value={filter}>
                {filter}
              </option>
            ))}
          </select>

          <h3 className="font-semibold mb-2">Sort by Rating</h3>
          <select
            value={sortByRating}
            onChange={handleRatingSortChange}
            className="w-full border border-gray-300 rounded px-2 py-2 mb-4"
          >
            <option value="">--</option>
            <option value="rating-high-low">Rating: High to Low</option>
            <option value="rating-low-high">Rating: Low to High</option>
          </select>

          <h3 className="font-semibold mb-2">Color</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {colors.map((color) => (
              <label key={color} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={color}
                  checked={selectedColor.includes(color)}
                  onChange={handleColorChange}
                  className="accent-blue-500"
                />
                <span className="text-sm">{color}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2"
            />
            <select
              value={selectedSort}
              onChange={handleSortChange}
              className="w-full md:w-1/3 border border-gray-300 rounded px-2 py-2"
            >
              <option value="">Sort by</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded overflow-hidden shadow"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 sm:h-60 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.color}</p>
                  <p className="text-md font-medium">{product.price}</p>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < Math.floor(product.rating) ? "" : "text-gray-300"
                        }
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      ({product.rating})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
