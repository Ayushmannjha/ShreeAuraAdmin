import { useState } from "react";
import { X } from "lucide-react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ShreeAuraAdminHeader from "./components/Header";

// ✅ Import admin pages
import AddCategory from "./components/Categories";
import ShopByNamePage from "./components/ShopByName";
import ShopByCategoryPage from "./components/ShopByCategory"; // ✅ New Page
import AdminLogin from "./components/login";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        {/* ✅ Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-white border-r shadow-md transform transition-transform duration-300 z-40 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-indigo-600 text-lg">ShreeAura Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Sidebar Links */}
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

            <li className="hover:text-indigo-600 cursor-pointer">Products</li>
            <li className="hover:text-indigo-600 cursor-pointer">Users</li>
            <li className="hover:text-indigo-600 cursor-pointer">Settings</li>
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
              {/* ✅ Dashboard */}
              <Route
                path="/"
                element={
                  <div>
                    <h1 className="text-3xl font-semibold mb-4">
                      Welcome to ShreeAura Admin
                    </h1>
                    <p className="text-gray-600 mb-8">
                      Use the sidebar to manage categories, products, and more.
                    </p>
                    <div className="flex justify-center gap-8">
                      <img src={viteLogo} className="logo" alt="Vite logo" />
                      <img src={reactLogo} className="logo react" alt="React logo" />
                    </div>
                  </div>
                }
              />

              {/* ✅ Category Page */}
              <Route path="/category" element={<AddCategory />} />

              {/* ✅ Shop By Name Page */}
              <Route path="/shopbyname" element={<ShopByNamePage />} />

              {/* ✅ Shop By Category Page */}
              <Route path="/shopbycategory" element={<ShopByCategoryPage />} />

              {/* ✅ Admin Login Page */}
              <Route path="/login" element={<AdminLogin />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
