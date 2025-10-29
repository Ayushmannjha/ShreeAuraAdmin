import  { useState } from 'react';
import { Menu, Search, Bell, User, LogOut, Settings } from 'lucide-react';

// ShreeAuraAdminHeader.tsx
// A responsive admin header component for "Shreeaura" built with React + TypeScript + TailwindCSS.
// Default export a React component so it can be previewed. Tailwind is used for styling — adjust classes to match your design system.

type Props = {
  logoUrl?: string;
  brandName?: string;
  onToggleSidebar?: () => void; // called when burger is clicked (for mobile / collapsing sidebar)
};

export default function ShreeAuraAdminHeader({
  logoUrl = '/logo192.png',
  brandName = 'Shreeaura Admin',
  onToggleSidebar,
}: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
console.log(searchOpen)
  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand + Toggle */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle sidebar"
              onClick={onToggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={logoUrl}
                alt="Shreeaura logo"
                className="w-10 h-10 rounded-md object-cover"
              />
              <div className="hidden sm:block">
                <div className="text-lg font-semibold text-gray-900">{brandName}</div>
                <div className="text-xs text-gray-500">Dashboard</div>
              </div>
            </div>
          </div>

          {/* Middle: Search (collapses on small screens) */}
          <div className="flex-1 flex justify-center px-4">
            <div className="w-full max-w-xl">
              <label className="relative block">
                <span className="sr-only">Search</span>
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Search className="w-4 h-4 text-gray-400" />
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setSearchOpen(false)}
                  className="w-full border rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search orders, customers, products..."
                  type="search"
                />
              </label>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              title="Notifications"
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
            >
              <Bell className="w-5 h-5" />
              {/* sample unread badge */}
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium leading-none text-white bg-red-500 rounded-full transform translate-x-1 -translate-y-1">
                3
              </span>
            </button>

            <button
              title="Settings"
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((s) => !s)}
                aria-haspopup="true"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-sm font-medium text-gray-900">Admin</span>
                  <span className="text-xs text-gray-500">super@shreeaura.com</span>
                </div>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  aria-label="User menu"
                  className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-1 z-30"
                >
                  <a
                    href="#profile"
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                    role="menuitem"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </a>
                  <a
                    href="#settings"
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                    role="menuitem"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </a>
                  <div className="border-t my-1" />
                  <button
                    onClick={() => {
                      // replace with real logout flow
                      console.log('logout clicked');
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
