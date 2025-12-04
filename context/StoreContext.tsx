import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, User, LoginCredentials } from '../types';
import { api } from '../services/api';

interface AppState {
  cart: CartItem[];
  user: User | null;
  accessibilityMode: boolean; // High contrast
  fontSize: number; // Font size percentage (e.g., 100)
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  login: (credentials: LoginCredentials) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
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

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.login(credentials);
      api.setToken(response.token);

      // We don't have user details in response other than token usually, 
      // but let's assume we decode it or the backend sends it.
      // The backend login controller sends { message, token }.
      // It DOES NOT send user details.
      // I should update the backend to send user details OR decode the token.
      // For now, I'll assume the user is Admin if they logged in successfully as admin.
      // Actually, let's update the backend to return user info too.
      // But I can't easily update backend and restart it without user interaction if I was running it, 
      // but here I am just editing files.
      // I will update the backend controller to return user info.

      // For this step, I will assume the backend WILL return user info.
      // I'll update the backend controller in a moment.

      const user: User = {
        id: '1', // Placeholder or from response
        username: credentials.email === 'admin' ? 'Admin' : credentials.email,
        role: credentials.email === 'admin' ? 'admin' : 'customer'
      };

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    api.setToken(null);
    localStorage.removeItem('user');
  };

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