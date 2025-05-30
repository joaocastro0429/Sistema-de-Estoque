import React, { useState } from 'react';

// Configuração da API
const API_URL = 'https://sistema-de-estoque-ar9k.onrender.com';

// Tipos
interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface ProductForm {
  name: string;
  price: string;
  quantity: string;
}

export const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Notebook Dell', price: 2500.99, quantity: 10 },
    { id: 2, name: 'Mouse Logitech', price: 299.90, quantity: 25 },
    { id: 3, name: 'Teclado Mecânico', price: 459.90, quantity: 8 }
  ]);

  const [newProduct, setNewProduct] = useState<ProductForm>({
    name: '',
    price: '',
    quantity: ''
  });

  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Adicionar produto
  const addProduct = (): void => {
    if (newProduct.name && newProduct.price && newProduct.quantity) {
      const product: Product = {
        id: Date.now(),
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity)
      };
      setProducts([...products, product]);
      setNewProduct({ name: '', price: '', quantity: '' });
      setShowForm(false);
    }
  };

  // Deletar produto
  const deleteProduct = (id: number): void => {
    setProducts(products.filter(product => product.id !== id));
  };

  // Iniciar edição
  const startEdit = (product: Product): void => {
    setEditingId(product.id);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity.toString()
    });
  };

  // Salvar edição
  const saveEdit = (): void => {
    setProducts(products.map(product =>
      product.id === editingId
        ? {
            ...product,
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            quantity: parseInt(newProduct.quantity)
          }
        : product
    ));
    setEditingId(null);
    setNewProduct({ name: '', price: '', quantity: '' });
  };

  // Cancelar edição
  const cancelEdit = (): void => {
    setEditingId(null);
    setNewProduct({ name: '', price: '', quantity: '' });
  };

  // Logout funcional - removido localStorage para compatibilidade com Render
  const handleLogout = (): void => {
    alert('Você saiu do sistema!');
    // Redireciona para página de login ou home
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">📦</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Meus Produtos</h1>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <span className="text-lg font-bold">+</span>
              <span>Novo Produto</span>
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Resumo */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Resumo</h2>
          <p className="text-gray-600">Total de produtos: {products.length}</p>
          <p className="text-sm text-gray-500 mt-2">
            API: {API_URL}
          </p>
        </div>

        {/* Formulário de adicionar/editar */}
        {(showForm || editingId !== null) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingId !== null ? 'Editar Produto' : 'Novo Produto'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Notebook"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 299.90"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                <input
                  type="number"
                  value={newProduct.quantity}
                  onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 10"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-4">
              <button
                onClick={editingId !== null ? saveEdit : addProduct}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                {editingId !== null ? 'Salvar' : 'Adicionar'}
              </button>
              <button
                onClick={editingId !== null ? cancelEdit : () => setShowForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de Produtos */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Lista de Produtos</h3>
          </div>

          {products.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <div className="h-12 w-12 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center opacity-50">
                <span className="text-gray-600 text-xl">📦</span>
              </div>
              <p>Nenhum produto encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {(product.price * product.quantity).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => startEdit(product)}
                          className="text-blue-600 hover:text-blue-900 mr-3 p-1"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Deletar"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};