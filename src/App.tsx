import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "motion/react";

import viteLogo from "/vite.svg";
import "./App.css";
import ShreeAuraAdminHeader from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Admin Pages
import AddCategory from "./components/Categories";
import ShopByNamePage from "./components/ShopByName";
import ShopByCategoryPage from "./components/ShopByCategory";
import AdminLogin from "./components/login";
import BlogManagement from "./components/BlogManagement";
import AdminOrders from "./components/AdminOrders";
import AdminSellers from "./components/AdminSellers";
import SellerPaymentPage from "./components/SellerPaymentPage";
import { getDashboardData } from "./services/api";
import { BarChart3, Users, Package, DollarSign } from "lucide-react";

/* ===========================================
   🧩 DASHBOARD COMPONENT
=========================================== */
function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await getDashboardData();
        setData(res);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <motion.h1
        className="text-4xl font-bold text-indigo-700 mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        ShreeAura Admin Dashboard
      </motion.h1>
      <motion.p
        className="text-gray-600 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Overview of platform performance and key metrics
      </motion.p>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl border border-indigo-100 flex flex-col items-center"
        >
          <div className="bg-indigo-100 p-3 rounded-full mb-3">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Total Sellers</h3>
          <p className="text-2xl font-bold text-indigo-700 mt-1">
            {data["total-seller"]}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl border border-indigo-100 flex flex-col items-center"
        >
          <div className="bg-purple-100 p-3 rounded-full mb-3">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Total Customers</h3>
          <p className="text-2xl font-bold text-purple-700 mt-1">
            {data["total-costumers"]}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl border border-indigo-100 flex flex-col items-center"
        >
          <div className="bg-green-100 p-3 rounded-full mb-3">
            <Package className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {data["total-products"]}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl border border-indigo-100 flex flex-col items-center"
        >
          <div className="bg-yellow-100 p-3 rounded-full mb-3">
            <DollarSign className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
          <p className="text-2xl font-bold text-yellow-700 mt-1">
            ₹{data["revenue"].toFixed(2)}
          </p>
        </motion.div>
      </div>

      {/* Chart Placeholder */}
      <motion.div
        className="mt-12 bg-white rounded-2xl shadow-md border border-indigo-100 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center mb-4">
          <BarChart3 className="w-5 h-5 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-700">Revenue Trend</h2>
        </div>
        <div className="h-56 flex items-center justify-center text-gray-400">
          (Chart visualization coming soon)
        </div>
      </motion.div>
    </div>
  );
}

/* ===========================================
   🧩 MAIN APP COMPONENT
=========================================== */
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <Routes>
        {/* ✅ Public route */}
        <Route path="/login" element={<AdminLogin />} />

        {/* ✅ Protected admin routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen bg-gray-50">
                {/* ✅ Sidebar */}
                <aside
                  className={`fixed top-0 left-0 h-full w-64 bg-white border-r shadow-md transform transition-transform duration-300 z-40 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                  }`}
                >
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-semibold text-indigo-600 text-lg">
                      ShreeAura Menu
                    </h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <ul className="p-4 space-y-3 text-gray-700">
                    <li>
                      <Link
                        to="/"
                        onClick={() => setSidebarOpen(false)}
                        className="block hover:text-indigo-600"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={() => setSidebarOpen(false)}
                        className="block hover:text-indigo-600"
                      >
                        Categories
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shopbyname"
                        onClick={() => setSidebarOpen(false)}
                        className="block hover:text-indigo-600"
                      >
                        Shop By Name
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shopbycategory"
                        onClick={() => setSidebarOpen(false)}
                        className="block hover:text-indigo-600"
                      >
                        Shop By Category
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/blog"
                        onClick={() => setSidebarOpen(false)}
                        className="block hover:text-indigo-600"
                      >
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin-orders"
                        onClick={() => setSidebarOpen(false)}
                        className="block hover:text-indigo-600"
                      >
                        Admin orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/seller"
                        onClick={() => setSidebarOpen(false)}
                        className="block hover:text-indigo-600"
                      >
                        Sellers
                      </Link>
                    </li>
                  </ul>
                </aside>

                {/* ✅ Mobile Overlay */}
                {sidebarOpen && (
                  <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
                  />
                )}

                {/* ✅ Main Content */}
                <div className="flex-1 flex flex-col">
                  <ShreeAuraAdminHeader
                    logoUrl={viteLogo}
                    brandName="ShreeAura Admin"
                    onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                  />

                  <main className="flex-1 overflow-auto p-6 text-center">
                    <Routes>
                      <Route
                        path="/admin/payments/:sellerId"
                        element={<SellerPaymentPage />}
                      />
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/seller" element={<AdminSellers />} />
                      <Route path="/admin-orders" element={<AdminOrders />} />
                      <Route path="/blog" element={<BlogManagement />} />
                      <Route path="/category" element={<AddCategory />} />
                      <Route path="/shopbyname" element={<ShopByNamePage />} />
                      <Route
                        path="/shopbycategory"
                        element={<ShopByCategoryPage />}
                      />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
