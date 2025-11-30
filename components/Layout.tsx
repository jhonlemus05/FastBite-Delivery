import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, User as UserIcon, LogOut, Eye, Menu as MenuIcon, Type, Minus, Plus, RefreshCw, X } from 'lucide-react';

export const Navbar = () => {
  const {
    cart, user, logout,
    toggleAccessibility, accessibilityMode,
    fontSize, increaseFontSize, decreaseFontSize, resetFontSize
  } = useStore();

  const location = useLocation();
  const [showA11yMenu, setShowA11yMenu] = useState(false);
  const a11yMenuRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isActive = (path: string) => location.pathname === path ? 'text-brand-600 font-bold' : 'text-gray-600 hover:text-brand-500';

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (a11yMenuRef.current && !a11yMenuRef.current.contains(event.target as Node)) {
        setShowA11yMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 bg-white shadow-md ${accessibilityMode ? 'border-b-4 border-black' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className={`text-2xl font-bold ${accessibilityMode ? 'text-black text-3xl' : 'text-brand-600'}`}>
                FastBite 🍔
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className={isActive('/')}>Inicio</Link>
              <Link to="/menu" className={isActive('/menu')}>Menú</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className={isActive('/admin')}>Admin</Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">

            {/* Accessibility Dropdown */}
            <div className="relative" ref={a11yMenuRef}>
              <button
                onClick={() => setShowA11yMenu(!showA11yMenu)}
                title="Menú de Accesibilidad"
                className={`p-2 rounded-full transition-colors ${showA11yMenu
                    ? 'bg-brand-100 text-brand-600'
                    : accessibilityMode
                      ? 'bg-black text-white ring-2 ring-yellow-400'
                      : 'bg-gray-100 text-gray-600 hover:text-brand-500'
                  }`}
              >
                <Eye size={20} />
              </button>

              {/* Popup Menu */}
              {showA11yMenu && (
                <div className={`absolute right-0 mt-2 w-72 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 z-50 transform origin-top-right transition-all ${accessibilityMode ? 'bg-black border-2 border-white text-white' : 'bg-white text-gray-900'}`}>
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                      <h3 className="font-bold flex items-center gap-2"><Eye size={16} /> Accesibilidad</h3>
                      <button onClick={() => setShowA11yMenu(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={16} />
                      </button>
                    </div>

                    {/* High Contrast Toggle */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Alto Contraste</span>
                      <button
                        onClick={toggleAccessibility}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${accessibilityMode ? 'bg-yellow-400' : 'bg-gray-300'}`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${accessibilityMode ? 'translate-x-6' : ''}`}></div>
                      </button>
                    </div>

                    {/* Font Size Controls */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Type size={16} /> Tamaño de Texto
                        </span>
                        <span className="text-xs font-bold bg-gray-100 text-gray-800 px-2 py-1 rounded">{fontSize}%</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <button
                          onClick={decreaseFontSize}
                          disabled={fontSize <= 75}
                          className={`flex-1 py-2 px-2 rounded flex justify-center items-center ${accessibilityMode ? 'bg-white text-black border border-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                          title="Disminuir texto"
                        >
                          <Minus size={16} />
                        </button>
                        <button
                          onClick={resetFontSize}
                          className={`flex-1 py-2 px-2 rounded flex justify-center items-center ${accessibilityMode ? 'bg-white text-black border border-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                          title="Restablecer tamaño"
                        >
                          <RefreshCw size={14} />
                        </button>
                        <button
                          onClick={increaseFontSize}
                          disabled={fontSize >= 150}
                          className={`flex-1 py-2 px-2 rounded flex justify-center items-center ${accessibilityMode ? 'bg-white text-black border border-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                          title="Aumentar texto"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-brand-500">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm hidden md:block font-medium">{user.username}</span>
                <button onClick={logout} className="p-2 text-gray-500 hover:text-red-500" title="Cerrar sesión">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="p-2 text-gray-600 hover:text-brand-500" title="Iniciar sesión">
                <UserIcon size={24} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu (Simplified) */}
      <div className="sm:hidden flex justify-around border-t py-2 bg-gray-50">
        <Link to="/" className="text-sm font-medium p-2">Inicio</Link>
        <Link to="/menu" className="text-sm font-medium p-2">Menú</Link>
        {user?.role === 'admin' && <Link to="/admin" className="text-sm font-medium p-2">Admin</Link>}
      </div>
    </nav>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accessibilityMode } = useStore();

  return (
    <div className={`min-h-screen flex flex-col ${accessibilityMode ? 'text-lg font-semibold bg-white' : 'bg-gray-50'}`}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className={`bg-gray-800 text-white py-6 ${accessibilityMode ? 'bg-black border-t-4 border-white' : ''}`}>
        <div className="container mx-auto text-center">
          <p>© 2025 FastBite Delivery. Jhon Fredy Lemus.</p>
        </div>
      </footer>
    </div>
  );
};