// src/components/organisms/TopProductsSection.tsx
import React from 'react';
import { ChartHeader } from '../molecules/Chartheader';
import { ProductRow } from '../molecules/ProductRow';

export interface TopProductItem {
  id: number;
  name: string;
  sales: number;
  revenue: string;
  rating: number;
}

export interface TopProductsSectionProps {
  products?: TopProductItem[];
}

export const TopProductsSection: React.FC<TopProductsSectionProps> = ({ products }) => {
  const displayProducts: TopProductItem[] = products || [];

  return (
    <div className="w-full bg-white rounded-xl border border-slate-300 shadow-sm mt-6 overflow-hidden">
      {/* Cabeçalho da Seção */}
      <div className="p-6 pb-4">
        <ChartHeader title="Top 5 Produtos em Destaque no Catálogo" />
      </div>

      {/* Tabela Estruturada */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 tracking-wider bg-slate-50/30">
              <th className="py-3.5 pl-6 font-semibold">PRODUTO</th>
              <th className="py-3.5 font-semibold">VENDAS</th>
              <th className="py-3.5 font-semibold">RECEITA ESTIMADA</th>
              <th className="py-3.5 pr-6 font-semibold">AVALIAÇÃO</th>
            </tr>
          </thead>
          <tbody>
            {displayProducts.length > 0 ? (
              displayProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  name={product.name}
                  sales={product.sales}
                  revenue={product.revenue}
                  rating={product.rating}
                />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-6 text-center text-sm text-slate-400">
                  Nenhum produto cadastrado no catálogo ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopProductsSection;
