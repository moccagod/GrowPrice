import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ItemList from "./pages/admin/ItemList";
import ItemInputList from "./pages/admin/ItemInputList";
import PriceInputForm from "./pages/admin/PriceInputForm";
import ItemHistoryList from "./pages/admin/ItemHistoryList";
import PriceHistory from "./pages/admin/PriceHistory";

// User Pages
import Home from "./pages/Home";
import ItemPriceHistory from "./pages/users/ItemPriceHistory";
import Tentang from "./pages/users/tentang";
import Riwayat from "./pages/users/Riwayat";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/riwayat/:itemId" element={<ItemPriceHistory />} />
        <Route path="/tentang" element={<Tentang />} />
        <Route path="/riwayat" element={<Riwayat />} />

        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="items" element={<ItemList />} />
          <Route path="input-harga" element={<ItemInputList />} />
          <Route path="input-harga/:itemId" element={<PriceInputForm />} />
          <Route path="riwayat-harga" element={<ItemHistoryList />} />
          <Route path="riwayat-harga/:itemId" element={<PriceHistory />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
