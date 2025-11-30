import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Product, ProductCategory } from '../types';
import { useStore } from '../context/StoreContext';
import { Plus, Loader2 } from 'lucide-react';

const Menu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ProductCategory | 'ALL'>('ALL');
  const { addToCart, accessibilityMode } = useStore();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = filter === 'ALL' 
    ? products 
    : products.filter(p => p.category === filter);

  if (loading) return <div className="text-center py-20"><Loader2 className="animate-spin h-10 w-10 mx-auto text-brand-600" /></div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-bold mb-4 md:mb-0">Nuestro Menú</h2>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'ALL' ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Todos
          </button>
          {Object.values(ProductCategory).map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${filter === cat ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => (
          <div key={product.id} className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${accessibilityMode ? 'border-2 border-black' : ''}`}>
            <div className="relative h-48 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-800">
                {product.category}
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{product.name}</h3>
                <span className="text-lg font-bold text-brand-600">${product.price.toFixed(2)}</span>
              </div>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
              <button 
                onClick={() => addToCart(product)}
                className={`w-full flex items-center justify-center py-2 px-4 rounded-lg font-medium transition-colors ${accessibilityMode ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-800 hover:bg-brand-50 hover:text-brand-600'}`}
              >
                <Plus size={18} className="mr-2" /> Agregar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;