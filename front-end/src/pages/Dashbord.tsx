const [quantityFilter, setQuantityFilter] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Simular dados para demonstração
  const mockProducts = [
    { id: 1, name: 'Notebook Dell', description: 'Notebook Dell Inspiron 15 8GB RAM', price: 2500.99, quantity: 10 },
    { id: 2, name: 'Mouse Logitech', description: 'Mouse wireless Logitech MX Master', price: 299.90, quantity: 25 },
    { id: 3, name: 'Teclado Mecânico', description: 'Teclado mecânico RGB switches blue', price: 459.90, quantity: 8 },
    { id: 4, name: 'Monitor Samsung', description: 'Monitor Samsung 24" Full HD', price: 899.99, quantity: 15 },
    { id: 5, name: 'SSD Kingston', description: 'SSD Kingston 500GB NVMe', price: 389.90, quantity: 30 }
  ];import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, LogOut, Package, DollarSign, Hash, FileText, Search, Filter, X, CheckCircle, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', quantity: '' });
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [quantityFilter, setQuantityFilter] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Função para obter todos os produtos
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4444/getProducts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setProducts(response.data);
      setFilteredProducts(response.data);
      setSuccessMessage('Produtos carregados com sucesso!');
      setError('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Erro ao carregar os produtos');
      setSuccessMessage('');
      setTimeout(() => setError(''), 3000);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Função de filtro
  useEffect(() => {
    let filtered = products;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por preço
    if (priceFilter.min) {
      filtered = filtered.filter(product => product.price >= parseFloat(priceFilter.min));
    }
    if (priceFilter.max) {
      filtered = filtered.filter(product => product.price <= parseFloat(priceFilter.max));
    }

    // Filtro por quantidade
    if (quantityFilter.min) {
      filtered = filtered.filter(product => product.quantity >= parseInt(quantityFilter.min));
    }
    if (quantityFilter.max) {
      filtered = filtered.filter(product => product.quantity <= parseInt(quantityFilter.max));
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, priceFilter, quantityFilter]);

  // Função para criar um novo produto
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.quantity) {
      setError('Todos os campos são obrigatórios');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const price = parseFloat(newProduct.price);
    const quantity = parseInt(newProduct.quantity);

    if (isNaN(price) || isNaN(quantity)) {
      setError('Preço e quantidade devem ser números válidos');
      setTimeout(() => setError(''), 3000);
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
      setShowCreateForm(false);
      fetchProducts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Erro ao criar o produto');
      setSuccessMessage('');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Função para editar um produto
  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      const price = parseFloat(editingProduct.price);
      const quantity = parseInt(editingProduct.quantity);

      if (isNaN(price) || isNaN(quantity)) {
        setError('Preço e quantidade devem ser números válidos');
        setTimeout(() => setError(''), 3000);
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
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError('Erro ao atualizar o produto');
        setSuccessMessage('');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  // Função para excluir um produto
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await axios.delete(`http://localhost:4444/deleteProducts/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        setSuccessMessage('Produto excluído com sucesso!');
        setError('');
        fetchProducts();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError('Erro ao excluir o produto');
        setSuccessMessage('');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  // Limpar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setPriceFilter({ min: '', max: '' });
    setQuantityFilter({ min: '', max: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Dashboard de Produtos</h1>
                <p className="text-purple-200">Gerencie seus produtos com facilidade</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 border border-red-500/30"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notificações */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-500/20 border border-green-500/30 text-green-200 px-4 py-3 rounded-lg flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Total de Produtos</p>
                <p className="text-3xl font-bold text-white">{products.length}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Valor Total</p>
                <p className="text-3xl font-bold text-white">
                  R$ {products.reduce((acc, product) => acc + (product.price * product.quantity), 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Produtos Filtrados</p>
                <p className="text-3xl font-bold text-white">{filteredProducts.length}</p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <Hash className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 hover:text-white px-6 py-3 rounded-lg transition-all duration-200 border border-purple-500/30"
            >
              <Filter className="h-5 w-5" />
              <span>Filtros</span>
            </button>
            
            {/* Add Product Button */}
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Produto</span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Preço Mínimo</label>
                  <input
                    type="number"
                    value={priceFilter.min}
                    onChange={(e) => setPriceFilter({...priceFilter, min: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Preço Máximo</label>
                  <input
                    type="number"
                    value={priceFilter.max}
                    onChange={(e) => setPriceFilter({...priceFilter, max: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="999.99"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Qtd. Mínima</label>
                  <input
                    type="number"
                    value={quantityFilter.min}
                    onChange={(e) => setQuantityFilter({...quantityFilter, min: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Qtd. Máxima</label>
                  <input
                    type="number"
                    value={quantityFilter.max}
                    onChange={(e) => setQuantityFilter({...quantityFilter, max: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="999"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                  <span>Limpar filtros</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create Product Form */}
        {showCreateForm && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Criar Novo Produto</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-purple-300 hover:text-white transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">Nome</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nome do produto"
                />
              </div>
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">Preço</label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.00"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-purple-200 text-sm font-medium mb-2">Quantidade</label>
                <input
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-purple-200 text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none"
                  placeholder="Descrição do produto"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium"
                >
                  Criar Produto
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Grid */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/20">
            <h3 className="text-xl font-bold text-white">Produtos ({filteredProducts.length})</h3>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left px-6 py-4 text-purple-200 font-medium">Nome</th>
                    <th className="text-left px-6 py-4 text-purple-200 font-medium">Descrição</th>
                    <th className="text-left px-6 py-4 text-purple-200 font-medium">Preço</th>
                    <th className="text-left px-6 py-4 text-purple-200 font-medium">Quantidade</th>
                    <th className="text-left px-6 py-4 text-purple-200 font-medium">Total</th>
                    <th className="text-right px-6 py-4 text-purple-200 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr key={product.id} className={`border-b border-white/10 hover:bg-white/5 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white/5' : ''}`}>
                      <td className="px-6 py-4 text-white font-medium">{product.name}</td>
                      <td className="px-6 py-4 text-purple-200 max-w-xs truncate">{product.description}</td>
                      <td className="px-6 py-4 text-green-400 font-medium">R$ {product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-blue-400 font-medium">{product.quantity}</td>
                      <td className="px-6 py-4 text-yellow-400 font-medium">R$ {(product.price * product.quantity).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 rounded-lg transition-all duration-200"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-purple-400 mx-auto mb-4 opacity-50" />
              <p className="text-purple-200 text-lg">Nenhum produto encontrado</p>
              <p className="text-purple-300 text-sm mt-2">Tente ajustar os filtros ou adicionar novos produtos</p>
            </div>
          )}
        </div>

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-xl p-6 border border-white/20 w-full max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Editar Produto</h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-purple-300 hover:text-white transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleEditProduct} className="space-y-4">
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Nome</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Descrição</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">Preço</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">Quantidade</label>
                    <input
                      type="number"
                      value={editingProduct.quantity}
                      onChange={(e) => setEditingProduct({ ...editingProduct, quantity: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                  >
                    Atualizar Produto
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white border border-white/20 rounded-lg transition-all duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { Dashboard };
