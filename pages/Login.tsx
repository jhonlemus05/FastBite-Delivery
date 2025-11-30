import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username);
    if(username.toLowerCase() === 'admin') {
      navigate('/admin');
    } else {
      navigate('/menu');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center">Bienvenido a FastBite</h2>
      <div className="bg-blue-50 p-4 rounded-md mb-6 text-sm text-blue-800">
        <p><strong>Demo Login:</strong></p>
        <p>Usuario: <code>admin</code> (Para panel administrador)</p>
        <p>Usuario: <code>cualquier nombre</code> (Para cliente)</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Usuario</label>
          <input 
            type="text" 
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2 border"
          />
        </div>
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;