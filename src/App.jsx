import "./App.css";
import { Routes, Route } from "react-router-dom";
import {
  Dashboard,
  Login,
  Signup,
  SearchPage,
  SearchPage2,
  FilterPage,
} from "./pages/index.js";

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/filterpage" element={<FilterPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/searchpage" element={<SearchPage2 />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
