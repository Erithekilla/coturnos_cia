import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Sidebar from '../components/organisms/Sidebar';
import PageHeader from '../components/molecules/PageHeader';
import SearchInput from '../components/atoms/SearchInput';
import ProductTable, { Product } from '../components/organisms/ProductTable';
import productService, { ProductPayload } from '../services/productService';

export interface ProductFormData {
  name: string;
  productType: string;
  model: string;
  brand: string;
  description: string;
  active: 'Ativo' | 'Inativo' | string;
  price: number | string;
  stock: number | string;
  sizes: string;
  color: string;
  image: string;
}

type FormMode = 'create' | 'edit' | null;

const AVAILABLE_SIZES = [38, 39, 40, 41, 42, 43, 44];

export default function Produtos_Catalogo(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [formMode, setFormMode] = useState<FormMode>(null); 
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [selectedSizes, setSelectedSizes] = useState<number[]>([38, 39, 40, 41, 42, 43, 44]);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    productType: '',
    model: '',
    brand: '',
    description: '',
    active: 'Ativo',
    price: '',
    stock: '',
    sizes: '',
    color: '',
    image: ''
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err: any) {
      console.error('Erro ao carregar produtos:', err);
      setFeedback({ type: 'error', message: 'Erro ao carregar produtos do banco de dados.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleToggleSize = (size: number) => {
    setSelectedSizes((prev) => {
      if (prev.includes(size)) {
        return prev.filter((s) => s !== size);
      } else {
        return [...prev, size].sort((a, b) => a - b);
      }
    });
  };

  const handleSelectAllSizes = () => {
    setSelectedSizes([...AVAILABLE_SIZES]);
  };

  const handleClearSizes = () => {
    setSelectedSizes([]);
  };

  const handleEdit = (id: string | number): void => {
    const product = products.find(p => p.id === id);
    if (product) {
      const anyProd = product as any;
      setFormData({
        name: product.name,
        productType: product.productType,
        model: product.model,
        brand: product.brand,
        description: anyProd.description || '',
        active: product.active,
        price: product.price,
        stock: product.stock,
        sizes: product.sizes,
        color: product.color,
        image: anyProd.image || ''
      });

      // Extrai os tamanhos selecionados para os checkboxes
      if (Array.isArray(anyProd.tamanhos_array) && anyProd.tamanhos_array.length > 0) {
        setSelectedSizes(anyProd.tamanhos_array.map(Number));
      } else if (typeof product.sizes === 'string') {
        const parsed = product.sizes
          .split(/[,-]/)
          .map(s => parseInt(s.trim(), 10))
          .filter(n => !isNaN(n) && AVAILABLE_SIZES.includes(n));
        setSelectedSizes(parsed.length > 0 ? parsed : [38, 39, 40, 41, 42, 43, 44]);
      } else {
        setSelectedSizes([38, 39, 40, 41, 42, 43, 44]);
      }

      setEditingId(product.id);
      setFormMode('edit');
      setFeedback(null);
    }
  };
  
  const handleOpenCreate = (): void => {
    setFormData({
      name: '',
      productType: '',
      model: '',
      brand: '',
      description: '',
      active: 'Ativo',
      price: '',
      stock: '',
      sizes: '',
      color: '',
      image: ''
    });
    setSelectedSizes([38, 39, 40, 41, 42, 43, 44]);
    setEditingId(null);
    setFormMode('create');
    setFeedback(null);
  };
  
  const handleCloseForm = (): void => {
    setFormMode(null);
    setEditingId(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: `/${file.name}` });
    }
  };

  const handleDelete = async (id: string | number): Promise<void> => {
    const product = products.find(p => p.id === id);
    const prodName = product?.name || `ID #${id}`;
    if (!window.confirm(`Deseja realmente excluir o produto "${prodName}" do banco de dados?`)) {
      return;
    }

    try {
      setLoading(true);
      await productService.deleteProduct(id);
      setFeedback({ type: 'success', message: `Produto "${prodName}" excluído com sucesso!` });
      await loadProducts();
    } catch (err: any) {
      console.error('Erro ao excluir produto:', err);
      setFeedback({ type: 'error', message: err.message || 'Erro ao excluir o produto.' });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.productType && product.productType.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.model && product.model.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (selectedSizes.length === 0) {
      setFeedback({ type: 'error', message: 'Por favor, selecione ao menos um tamanho de 38 a 44 para o produto.' });
      return;
    }

    const parsedPrice = typeof formData.price === 'number' ? formData.price : parseFloat(String(formData.price).replace(',', '.')) || 0;
    const parsedStock = typeof formData.stock === 'number' ? formData.stock : parseInt(String(formData.stock), 10) || 0;

    const payload: ProductPayload = {
      name: formData.name,
      productType: formData.productType,
      model: formData.model || formData.name,
      brand: formData.brand,
      price: parsedPrice,
      stock: parsedStock,
      sizes: selectedSizes.join(', '),
      tamanhos_array: selectedSizes,
      color: formData.color,
      description: formData.description,
      active: formData.active,
      image: formData.image || '/coturno1.jpeg'
    };

    try {
      setSaving(true);
      setFeedback(null);

      if (formMode === 'edit' && editingId !== null) {
        await productService.updateProduct(editingId, payload);
        setFeedback({ type: 'success', message: `Produto "${formData.name}" atualizado com sucesso no banco de dados!` });
      } else {
        await productService.createProduct(payload);
        setFeedback({ type: 'success', message: `Produto "${formData.name}" cadastrado com sucesso no banco de dados com os tamanhos selecionados!` });
      }

      handleCloseForm();
      await loadProducts();
    } catch (err: any) {
      console.error('Erro ao salvar produto:', err);
      setFeedback({ type: 'error', message: err.message || 'Erro ao salvar produto no banco de dados.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 pt-10 pe-5">
      <Sidebar activePage="produtos" />
      <main className="pl-72 flex-1 pb-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <PageHeader 
            title="Gerenciamento de Produtos" 
            subtitle="Gerencie o catálogo de calçados diretamente no banco de dados" 
            onActionClick={handleOpenCreate} 
            hideButton={formMode !== null}
            buttonClassName="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors px-4 py-2 text-sm flex items-center shadow-sm"
          />

          {feedback && (
            <div className={`p-4 rounded-xl text-sm font-medium border flex items-center justify-between transition-all ${
              feedback.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              <span>{feedback.message}</span>
              <button 
                type="button" 
                onClick={() => setFeedback(null)} 
                className="text-xs underline hover:opacity-75 font-semibold ml-4"
              >
                Fechar
              </button>
            </div>
          )}

          {formMode !== null ? (
            <div className="w-full bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {formMode === 'edit' ? 'Editar Produto no Banco de Dados' : 'Cadastrar Novo Produto'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Preencha os campos e selecione os tamanhos disponíveis (38 ao 44).
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={handleCloseForm}
                  className="text-slate-400 hover:text-slate-600 text-sm font-medium"
                >
                  ✕ Voltar
                </button>
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Nome do Produto</label>
                    <input 
                      type="text"
                      placeholder="Ex: Coturno Tático Fox"
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Tipo do produto</label>
                    <select 
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 bg-white"
                      value={formData.productType}
                      onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                      required
                    >
                      <option value="">Selecione um tipo</option>
                      <option value="coturno">Coturno</option>
                      <option value="bota-tatica">Bota Tática</option>
                      <option value="sapato-social">Sapato Social</option>
                      <option value="borzeguim">Borzeguim</option>
                      <option value="tenis-esportivo">Tênis Esportivo</option>
                      <option value="sandalias">Sandálias</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Modelo</label>
                    <input 
                      type="text"
                      placeholder="Ex: Combat Pro X"
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Marca</label>
                    <select 
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 bg-white"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      required
                    >
                      <option value="">Selecione uma marca</option>
                      <option value="Atalaia">Atalaia</option>
                      <option value="Acero">Acero</option>
                      <option value="Bull Terrier">Bull Terrier</option>
                      <option value="Oakley">Oakley</option>
                      <option value="Macboot">Macboot</option>
                      <option value="Airstrike">Airstrike</option>
                      <option value="Outra">Outra</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Preço (R$)</label>
                    <input 
                      type="number"
                      step="0.01"
                      placeholder="Ex: 599.90"
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Quantidade Total em Estoque</label>
                    <input 
                      type="number"
                      placeholder="Ex: 50"
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Cor</label>
                    <input 
                      type="text"
                      placeholder="Ex: Preto / Marrom / Coyote"
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Status do Produto</label>
                    <div className="flex space-x-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, active: 'Ativo' })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                          formData.active === 'Ativo'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Ativo
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, active: 'Inativo' })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                          formData.active === 'Inativo'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Inativo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Seção dos Checkboxes de Tamanho (38 ao 44) */}
                <div className="flex flex-col space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-semibold text-slate-800">
                        Tamanhos Disponíveis (Checkbox 38 a 44)
                      </label>
                      <p className="text-xs text-slate-500">
                        Selecione múltiplos tamanhos para cadastrar a grade na tabela <code className="text-blue-600">tamanho_produtos</code>.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <button 
                        type="button" 
                        onClick={handleSelectAllSizes}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Marcar todos
                      </button>
                      <span className="text-slate-300">|</span>
                      <button 
                        type="button" 
                        onClick={handleClearSizes}
                        className="text-slate-500 hover:underline font-medium"
                      >
                        Limpar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
                    {AVAILABLE_SIZES.map((size) => {
                      const isSelected = selectedSizes.includes(size);
                      return (
                        <label
                          key={size}
                          className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg border text-sm font-bold cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSize(size)}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                          />
                          <span>{size}</span>
                        </label>
                      );
                    })}
                  </div>
                  {selectedSizes.length === 0 && (
                    <span className="text-xs text-rose-600 font-semibold pt-1">
                      * Obrigatório selecionar pelo menos um tamanho.
                    </span>
                  )}
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-slate-600">Descrição</label>
                  <textarea 
                    rows={3}
                    placeholder="Digite os detalhes, especificações técnicas e materiais do produto..."
                    className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-slate-600">Imagem do Produto</label>
                  <div className="flex items-center space-x-3">
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center">
                      <span>Anexar Imagem</span>
                      <input 
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    <span className="text-sm text-slate-500 truncate max-w-xs">
                      {formData.image ? formData.image : 'Nenhum arquivo escolhido (será usado padrão)'}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-slate-100">
                  <button 
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors shadow-sm text-sm"
                  >
                    {saving ? 'Salvando no Banco...' : formMode === 'edit' ? 'Salvar Alterações' : 'Cadastrar Produto'}
                  </button>
                  <button 
                    type="button"
                    onClick={handleCloseForm}
                    disabled={saving}
                    className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="w-full bg-white rounded-xl mb-5 mt-7">
                <SearchInput 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  placeholder="Buscar produtos por nome, tipo ou marca..." 
                />
              </div>

              {loading ? (
                <div className="w-full bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-3" />
                  <p className="font-medium text-sm">Carregando catálogo do banco de dados...</p>
                </div>
              ) : (
                <ProductTable 
                  products={filteredProducts} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
