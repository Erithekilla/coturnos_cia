import request from './api';
import { Product } from '../components/organisms/ProductTable';

export interface ProductPayload {
  name: string;
  productType: string;
  brand: string;
  model: string;
  price: number;
  stock: number;
  sizes?: string;
  tamanhos_array?: number[];
  color?: string;
  description?: string;
  active: 'Ativo' | 'Inativo' | string;
  image?: string;
}

export const productService = {
  async getProducts(search?: string): Promise<Product[]> {
    const url = search ? `/produtos?search=${encodeURIComponent(search)}` : '/produtos';
    const response = await request<Product[]>(url);
    return response.data || [];
  },

  async getProduct(id: number | string): Promise<Product> {
    const response = await request<Product>(`/produtos/${id}`);
    if (!response.data) throw new Error('Produto não encontrado');
    return response.data;
  },

  async createProduct(payload: ProductPayload): Promise<Product> {
    const response = await request<Product>('/produtos', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!response.data) throw new Error('Erro ao criar produto');
    return response.data;
  },

  async updateProduct(id: number | string, payload: ProductPayload): Promise<Product> {
    const response = await request<Product>(`/produtos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    if (!response.data) throw new Error('Erro ao atualizar produto');
    return response.data;
  },

  async deleteProduct(id: number | string): Promise<void> {
    await request(`/produtos/${id}`, {
      method: 'DELETE',
    });
  },
};

export default productService;
