import React, { useEffect, useState } from "react";
import Sidebar from "../components/organisms/Sidebar";
import { MetricsGrid } from "../components/organisms/MetricsGrid";
import { ChartsSection } from "../components/organisms/ChartsSection";
import { TopProductsSection } from "../components/organisms/TopProductsSection";
import dashboardService, { DashboardData } from "../services/dashboardService";

export default function Home_admin(): React.JSX.Element {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="flex min-h-screen w-full pe-10 pt-10 bg-slate-50 text-slate-900 antialiased">
      <Sidebar />
      <main className="pl-72 flex-1 overflow-y-auto pb-12">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-barlow font-bold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Painel administrativo conectado em tempo real à base de dados Coturnos & Cia
            </p>
          </div>
          {loading && (
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              Sincronizando dados...
            </span>
          )}
        </header>

        <MetricsGrid metrics={dashboardData?.metrics} />
        <ChartsSection
          vendasMensais={dashboardData?.vendasMensais}
          categorias={dashboardData?.categorias}
        />
        <TopProductsSection products={dashboardData?.topProdutos} />
      </main>
    </div>
  );
}
