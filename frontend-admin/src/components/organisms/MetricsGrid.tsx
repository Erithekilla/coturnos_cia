import React from 'react';
import { MetricCard } from '../molecules/MetricCard';
import { CurrencyIcon, CartIcon, BoxIcon, PeopleIcon, IconProps } from '../atoms/Icons';

export interface MetricItem {
  id: string;
  label: string;
  value: string;
  trend: number;
  icon?: React.ComponentType<IconProps>;
  bgColor: string;
}

export interface MetricsGridProps {
  metrics?: MetricItem[];
}

const iconMap: Record<string, React.ComponentType<IconProps>> = {
  receita: CurrencyIcon,
  pedidos: CartIcon,
  estoque: BoxIcon,
  clientes: PeopleIcon,
};

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  const displayMetrics: MetricItem[] = (metrics && metrics.length > 0)
    ? metrics.map(m => ({
        ...m,
        icon: m.icon || iconMap[m.id] || BoxIcon,
      }))
    : [
        { id: 'receita', label: 'Receita Total', value: 'Carregando...', trend: 0, icon: CurrencyIcon, bgColor: 'bg-army' },
        { id: 'pedidos', label: 'Pedidos Realizados', value: 'Carregando...', trend: 0, icon: CartIcon, bgColor: 'bg-marrom' },
        { id: 'estoque', label: 'Produtos em Estoque', value: 'Carregando...', trend: 0, icon: BoxIcon, bgColor: 'bg-azul' },
        { id: 'clientes', label: 'Clientes Ativos', value: 'Carregando...', trend: 0, icon: PeopleIcon, bgColor: 'bg-preto' },
      ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-2">
      {displayMetrics.map((metric) => (
        <MetricCard
          key={metric.id}
          label={metric.label}
          value={metric.value}
          trend={metric.trend}
          icon={metric.icon || BoxIcon}
          iconBgColor={metric.bgColor}
        />
      ))}
    </section>
  );
};

export default MetricsGrid;
