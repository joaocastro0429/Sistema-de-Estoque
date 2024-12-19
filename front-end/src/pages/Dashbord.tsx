import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard: React.FC = () => {

  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', quantity: '' });
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const navigate = useNavigate();

  // Função para obter todos os produtos
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4444/getProducts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setProducts(response.data);
      setSuccessMessage('Produtos carregados com sucesso!');
      setError('');
    } catch (err) {
      setError('Erro ao carregar os produtos');
      setSuccessMessage('');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Função para criar um novo produto
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação dos campos obrigatórios
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.quantity) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    // Garantir que price e quantity sejam números válidos
    const price = parseFloat(newProduct.price);
    const quantity = parseInt(newProduct.quantity);

    if (isNaN(price) || isNaN(quantity)) {
      setError('Preço e quantidade devem ser números válidos');
      return;
    }

    const productData = { ...newProduct, price, quantity };

    try {
      await axios.post(
        'http://localhost:4444/addProducts',
        productData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );
      setSuccessMessage('Produto criado com sucesso!');
      setError('');
      setNewProduct({ name: '', description: '', price: '', quantity: '' });
      fetchProducts();
    } catch (err) {
      setError('Erro ao criar o produto');
      setSuccessMessage('');
    }
  };

  // Função para editar um produto
  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      // Garantir que price e quantity sejam números válidos
      const price = parseFloat(editingProduct.price);
      const quantity = parseInt(editingProduct.quantity);

      if (isNaN(price) || isNaN(quantity)) {
        setError('Preço e quantidade devem ser números válidos');
        return;
      }

      const updatedProduct = { ...editingProduct, price, quantity };

      try {
        await axios.put(
          `http://localhost:4444/updateProducts/${editingProduct.id}`,
          updatedProduct,
          { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
        );
        setSuccessMessage('Produto atualizado com sucesso!');
        setError('');
        setEditingProduct(null);
        fetchProducts();
      } catch (err) {
        setError('Erro ao atualizar o produto');
        setSuccessMessage('');
      }
    }
  };

  // Função para excluir um produto
  const handleDeleteProduct = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4444/deleteProducts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setSuccessMessage('Produto excluído com sucesso!');
      setError('');
      fetchProducts();
    } catch (err) {
      setError('Erro ao excluir o produto');
      setSuccessMessage('');
    }
  };

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard de Produtos</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      <button onClick={handleLogout} className="bg-red-500 text-white p-2 mb-4">Logout</button>

      {/* Formulário para criar produto */}
      <form onSubmit={handleCreateProduct} className="mb-4">
        <input
          type="text"
          placeholder="Nome"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="p-2 border mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Descrição"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          className="p-2 border mb-2 w-full"
        />
        <input
          type="number"
          placeholder="Preço"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          className="p-2 border mb-2 w-full"
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={newProduct.quantity}
          onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
          className="p-2 border mb-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Criar Produto</button>
      </form>

      {/* Lista de Produtos */}
      <h3 className="font-semibold mb-2">Lista de Produtos</h3>
      {products.length > 0 ? (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Nome</th>
              <th className="px-4 py-2 border">Descrição</th>
              <th className="px-4 py-2 border">Preço</th>
              <th className="px-4 py-2 border">Quantidade</th>
              <th className="px-4 py-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-2 border">{product.name}</td>
                <td className="px-4 py-2 border">{product.description}</td>
                <td className="px-4 py-2 border">{product.price}</td>
                <td className="px-4 py-2 border">{product.quantity}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="bg-yellow-500 text-white p-1"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-500 text-white p-1 ml-2"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhum produto encontrado.</p>
      )}

      {/* Formulário de edição */}
      {editingProduct && (
        <form onSubmit={handleEditProduct} className="mb-4">
          <input
            type="text"
            value={editingProduct.name}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, name: e.target.value })
            }
            className="p-2 border mb-2 w-full"
          />
          <input
            type="text"
            value={editingProduct.description}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, description: e.target.value })
            }
            className="p-2 border mb-2 w-full"
          />
          <input
            type="number"
            value={editingProduct.price}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, price: e.target.value })
            }
            className="p-2 border mb-2 w-full"
          />
          <input
            type="number"
            value={editingProduct.quantity}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, quantity: e.target.value })
            }
            className="p-2 border mb-2 w-full"
          />
          <button type="submit" className="bg-blue-500 text-white p-2">
            Atualizar Produto
          </button>
        </form>
      )}
    </div>
  );
};

export { Dashboard };
