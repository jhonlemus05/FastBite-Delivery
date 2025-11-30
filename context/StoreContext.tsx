import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, User } from '../types';

interface AppState {
  cart: CartItem[];
  user: User | null;
  accessibilityMode: boolean; // High contrast
  fontSize: number; // Font size percentage (e.g., 100)
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  login: (username: string) => void;
  logout: () => void;
  toggleAccessibility: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  cartTotal: number;
}

const StoreContext = createContext<AppState | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [fontSize, setFontSize] = useState(100);

  // Initial Accessibility Check (High Contrast)
  useEffect(() => {
    if (accessibilityMode) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [accessibilityMode]);

  // Font Size Logic
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const login = (username: string) => {
    // Simulated Auth Logic
    if (username.toLowerCase() === 'admin') {
      setUser({ id: '1', username: 'Admin User', role: 'admin' });
    } else {
      setUser({ id: '2', username: username, role: 'customer' });
    }
  };

  const logout = () => setUser(null);

  const toggleAccessibility = () => setAccessibilityMode(!accessibilityMode);
  
  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 10, 150)); // Max 150%
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 10, 75)); // Min 75%
  const resetFontSize = () => setFontSize(100);

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <StoreContext.Provider value={{
      cart, user, accessibilityMode, fontSize,
      addToCart, removeFromCart, clearCart,
      login, logout, toggleAccessibility,
      increaseFontSize, decreaseFontSize, resetFontSize,
      cartTotal
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};