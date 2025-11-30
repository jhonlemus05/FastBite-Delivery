import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Star, Clock, ShieldCheck } from 'lucide-react';

const Home = () => {
  const { accessibilityMode } = useStore();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-brand-50 to-white rounded-3xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <h1 className={`text-4xl sm:text-6xl font-extrabold mb-6 ${accessibilityMode ? 'text-black tracking-wider' : 'text-gray-900'}`}>
            Comida rápida, <span className="text-brand-600">entregada flash</span>.
          </h1>
          <p className={`text-xl mb-8 ${accessibilityMode ? 'text-black font-bold' : 'text-gray-600'}`}>
            Los mejores sabores de la ciudad directamente a tu puerta. Hamburguesas, pizzas y más.
          </p>
          <Link 
            to="/menu" 
            className={`inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-sm text-white ${accessibilityMode ? 'bg-black border-2 border-white hover:bg-gray-800' : 'bg-brand-600 hover:bg-brand-700'} transition-all transform hover:scale-105`}
          >
            Ver Menú <ArrowRight className="ml-2" />
          </Link>
        </div>
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-64 h-64 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className={`p-6 rounded-xl ${accessibilityMode ? 'border-4 border-black' : 'bg-white shadow-lg'}`}>
          <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4 text-brand-600">
            <Clock size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Entrega en 30 min</h3>
          <p className="text-gray-600">Si llega fría, no la pagas. Nuestro compromiso es la velocidad.</p>
        </div>
        <div className={`p-6 rounded-xl ${accessibilityMode ? 'border-4 border-black' : 'bg-white shadow-lg'}`}>
          <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4 text-brand-600">
            <Star size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Calidad Premium</h3>
          <p className="text-gray-600">Ingredientes frescos seleccionados diariamente por nuestros chefs.</p>
        </div>
        <div className={`p-6 rounded-xl ${accessibilityMode ? 'border-4 border-black' : 'bg-white shadow-lg'}`}>
          <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4 text-brand-600">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Pago Seguro</h3>
          <p className="text-gray-600">Transacciones encriptadas y múltiples métodos de pago.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;