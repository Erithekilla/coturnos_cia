import request from './api';

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  trend: number;
  bgColor: string;
}

export interface DashboardMonthlySale {
  mes: string;
  vendas: number;
  pedidos: number;
}

export interface DashboardCategory {
  nome: string;
  quantidade: number;
  porcentagem: number;
  cor: string;
  classesTexto: string;
}

export interface DashboardTopProduct {
  id: number;
  name: string;
  sales: number;
  revenue: string;
  rating: number;
}

export interface DashboardData {
  metrics: DashboardMetric[];
  vendasMensais: DashboardMonthlySale[];
  categorias: DashboardCategory[];
  topProdutos: DashboardTopProduct[];
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const response = await request<DashboardData>('/admin/dashboard');
    return response.data as DashboardData;
  },
};

export default dashboardService;
