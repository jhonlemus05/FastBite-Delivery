import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Order, OrderStatus, Product, ProductCategory, DashboardStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2, Edit, Save, Plus } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');

  // Data State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State for Products
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const data = await api.getDashboardStats();
        setStats(data);
      } else if (activeTab === 'products') {
        const data = await api.getProducts();
        setProducts(data);
      } else if (activeTab === 'orders') {
        const data = await api.getOrders();
        setOrders(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // --- Handlers ---

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await api.updateOrderStatus(orderId, newStatus);
    fetchData(); // Refresh
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.price) return;

    if (editingProduct.id) {
      await api.updateProduct(editingProduct as Product);
    } else {
      await api.addProduct({
        name: editingProduct.name,
        description: editingProduct.description || '',
        price: Number(editingProduct.price),
        category: editingProduct.category || ProductCategory.BURGER,
        image: editingProduct.image || 'https://picsum.photos/400/300'
      });
    }
    setIsEditing(false);
    setEditingProduct({});
    fetchData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      await api.deleteProduct(id);
      fetchData();
    }
  };

  // --- Renders ---

  if (loading && !stats && products.length === 0 && orders.length === 0) return <div>Cargando panel...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-8">
        <button onClick={() => setActiveTab('dashboard')} className={`pb-2 px-4 ${activeTab === 'dashboard' ? 'border-b-2 border-brand-600 font-bold' : 'text-gray-500'}`}>Dashboard</button>
        <button onClick={() => setActiveTab('products')} className={`pb-2 px-4 ${activeTab === 'products' ? 'border-b-2 border-brand-600 font-bold' : 'text-gray-500'}`}>Productos</button>
        <button onClick={() => setActiveTab('orders')} className={`pb-2 px-4 ${activeTab === 'orders' ? 'border-b-2 border-brand-600 font-bold' : 'text-gray-500'}`}>Pedidos</button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && stats && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-500">Ventas Totales</p>
              <p className="text-3xl font-bold text-green-600">${stats.totalSales.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-500">Pedidos Totales</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-500">Pendientes</p>
              <p className="text-3xl font-bold text-orange-500">{stats.pendingOrders}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-500">Más Popular</p>
              <p className="text-xl font-bold">{stats.popularCategory}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border h-80">
            <h3 className="text-lg font-bold mb-4">Ventas Recientes (Simulado)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Lun', sales: 400 },
                { name: 'Mar', sales: 300 },
                { name: 'Mie', sales: 500 },
                { name: 'Jue', sales: 200 },
                { name: 'Vie', sales: 700 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#e11d48" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Gestión de Menú</h2>
            <button onClick={() => { setIsEditing(true); setEditingProduct({}); }} className="bg-brand-600 text-white px-4 py-2 rounded flex items-center">
              <Plus size={16} className="mr-2" /> Nuevo Producto
            </button>
          </div>

          {isEditing && (
            <form onSubmit={handleSaveProduct} className="bg-gray-100 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input placeholder="Nombre" value={editingProduct.name || ''} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} className="p-2 border rounded" required />
                <input placeholder="Precio" type="number" step="0.01" value={editingProduct.price || ''} onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })} className="p-2 border rounded" required />
                <select value={editingProduct.category || ProductCategory.BURGER} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })} className="p-2 border rounded">
                  {Object.values(ProductCategory).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input placeholder="Descripción" value={editingProduct.description || ''} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} className="p-2 border rounded" />
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="URL de la Imagen"
                    value={editingProduct.image || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    className="p-2 border rounded"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditingProduct({ ...editingProduct, image: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded flex items-center"><Save size={16} className="mr-2" /> Guardar</button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map(p => (
                  <tr key={p.id}>
                    <td className="px-6 py-4">{p.name}</td>
                    <td className="px-6 py-4">{p.category}</td>
                    <td className="px-6 py-4">${p.price}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => { setEditingProduct(p); setIsEditing(true); }} className="text-blue-600 hover:text-blue-900"><Edit size={18} /></button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-brand-600 flex justify-between items-center">
              <div>
                <p className="font-bold">Pedido #{order.id} <span className="text-xs text-gray-400">({new Date(order.date).toLocaleDateString()})</span></p>
                <p className="text-sm">{order.customerName} - {order.customerAddress}</p>
                <p className="text-sm text-gray-600">{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
                <p className="font-bold text-green-600">${order.total.toFixed(2)}</p>
              </div>
              <div className="flex flex-col gap-2">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  className={`p-2 rounded text-sm font-bold ${order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' :
                    order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100'
                    }`}
                >
                  {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;