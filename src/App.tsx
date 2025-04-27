import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Listings } from "./pages/Listings";
import { PropertyDetail } from "./pages/PropertyDetail";
import { AddProperty } from "./pages/AddProperty";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/add-property" element={<AddProperty />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
