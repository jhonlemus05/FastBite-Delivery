import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, ShoppingBag, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, clearCart, cartTotal, accessibilityMode } = useStore();
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.createOrder({
        customerName,
        customerAddress,
        items: cart,
        total: cartTotal
      });
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      alert("Error al procesar el pedido");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600" size={48} />
        </div>
        <h2 className="text-3xl font-bold mb-4">¡Pedido Recibido!</h2>
        <p className="text-gray-600 mb-8">Tu comida está en camino a {customerAddress}.</p>
        <Link to="/menu" className="text-brand-600 font-bold hover:underline">Volver al menú</Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-400">Tu carrito está vacío</h2>
        <Link to="/menu" className="text-brand-600 font-bold mt-4 inline-block hover:underline">Ir a pedir comida</Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-12">
      {/* Items List */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Tu Pedido</h2>
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className={`flex items-center justify-between p-4 rounded-lg ${accessibilityMode ? 'border-2 border-black' : 'bg-white shadow-sm'}`}>
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-500">Cant: {item.quantity} x ${item.price}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between items-center text-xl font-bold border-t pt-4">
          <span>Total:</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Form */}
      <div className={`p-6 rounded-xl ${accessibilityMode ? 'border-4 border-black' : 'bg-white shadow-lg'}`}>
        <h2 className="text-2xl font-bold mb-6">Datos de Entrega</h2>
        <form onSubmit={handleCheckout} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input 
              required
              type="text" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="Juan Pérez"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Entrega</label>
            <input 
              required
              type="text" 
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="Calle 123 #45-67"
            />
          </div>
          <button 
            type="submit" 
            disabled={submitting}
            className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${submitting ? 'bg-gray-400' : 'bg-brand-600 hover:bg-brand-700'}`}
          >
            {submitting ? 'Procesando...' : `Pagar $${cartTotal.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Cart;