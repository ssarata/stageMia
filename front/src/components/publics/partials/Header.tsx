import { Link } from "@tanstack/react-router";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";
import { Route } from "../../../routes/__root";

const navItems = [
  { name: "Accueil", to: "/" },
 
];

const Header = () => {
  const { auth } = Route.useRouteContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    auth.logout();
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center text-xl sm:text-2xl font-bold text-gray-900 hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-2 border-green-600 text-green-600 font-bold">
            M
          </div>
          <span className="ml-2">
            IA <span className="text-green-600">-BF</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map(({ name, to }) => (
            <li key={name}>
              <Link
                to={to}
                className="text-gray-700 font-medium hover:text-green-600 transition-colors duration-200 [&.active]:text-green-600 [&.active]:font-semibold"
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center gap-4 relative">
          {auth.isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                aria-label="Menu utilisateur"
                aria-expanded={isDropdownOpen}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">
                    {auth.user?.nom?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {auth.user?.nom || "Utilisateur"}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {auth.user?.email || "email@example.com"}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={closeMenus}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-sm">Dashboard</span>
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 my-1" />

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium text-sm">Déconnexion</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Se Connecter
              </Link>
              <Link
                to="/auth/register"
                className="border-2 border-green-600 text-green-600 px-6 py-2.5 rounded-lg hover:bg-green-600 hover:text-white transition-all font-medium"
              >
                Créer un Compte
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMenuOpen}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white border-t border-gray-200 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {/* Navigation Links */}
          {navItems.map(({ name, to }) => (
            <Link
              key={name}
              to={to}
              onClick={closeMenus}
              className="block py-2.5 px-4 text-gray-700 hover:bg-gray-50 hover:text-green-600 rounded-lg transition-colors font-medium [&.active]:bg-green-50 [&.active]:text-green-600"
            >
              {name}
            </Link>
          ))}

          {/* User Section */}
          {auth.isAuthenticated ? (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {auth.user?.nom?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {auth.user?.nom || "Utilisateur"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {auth.user?.email || "email@example.com"}
                  </p>
                </div>
              </button>

              {isDropdownOpen && (
                <div className="mt-2 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <Link
                    to="/dashboard"
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm">Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium text-sm">Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <Link
                to="/auth/login"
                onClick={closeMenus}
                className="block text-center w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-green-600 text-white font-medium hover:shadow-lg transition-all"
              >
                Se Connecter
              </Link>
              <Link
                to="/auth/register"
                onClick={closeMenus}
                className="block text-center w-full py-2.5 rounded-lg border-2 border-green-600 text-green-600 font-medium hover:bg-green-600 hover:text-white transition-all"
              >
                Créer un Compte
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
