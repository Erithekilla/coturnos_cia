// src/components/organisms/Sidebar.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarNavItem } from '../molecules/SidebarNavItem'; 
import { HomeIcon, ProductsIcon, UsersIcon, LogoutIcon, LogIcon, ImageIcon } from '../atoms/Icons';

export interface SidebarProps {
  activePage?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getHomeUrl = (): string => {
    return window.location.port === '5174' ? 'http://localhost:5174/' : '/';
  };

  const handleLogout = (): void => {
    try {
      localStorage.removeItem('coturnos_auth_token');
      localStorage.removeItem('coturnos_usuario_logado');
    } catch (e) {
      console.error(e);
    }
    // Leva para a página inicial da loja
    window.location.href = getHomeUrl();
  };

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-pretoclaro flex flex-col justify-between py-8 select-none">
      {/* Topo: Logo e Menu */}
      <div className="space-y-8">
        <div className="px-6 flex items-center justify-between">
          <a
            href={getHomeUrl()}
            title="Ir para a Página Inicial da Loja"
            className="text-white font-barlow font-bold text-2xl tracking-wide hover:text-amber-400 transition-colors"
          >
            Coturnos & Cia
          </a>
          <button className="text-gray-400 hover:text-white sm:hidden" aria-label="Fechar menu" type="button">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Links de Navegação */}
        <nav className="font-barlow flex flex-col space-y-1">
          <SidebarNavItem 
            icon={HomeIcon} 
            label="Dashboard" 
            isActive={activePage === 'dashboard' || location.pathname === '/admin' || location.pathname === '/'} 
            onClick={() => navigate('/admin')}
          />
          <SidebarNavItem 
            icon={ProductsIcon} 
            label="Produtos" 
            isActive={activePage === 'produtos' || location.pathname === '/admin/produtos'} 
            onClick={() => navigate('/admin/produtos')}
          />
          <SidebarNavItem 
            icon={UsersIcon} 
            label="Usuários" 
            isActive={activePage === 'usuarios' || location.pathname === '/admin/usuarios'} 
            onClick={() => navigate('/admin/usuarios')}
          />
          <SidebarNavItem 
            icon={ImageIcon} 
            label="Imagens da Loja" 
            isActive={activePage === 'imagens' || location.pathname === '/admin/imagens'} 
            onClick={() => navigate('/admin/imagens')}
          />
          <SidebarNavItem 
            icon={LogIcon} 
            label="Logs de Eventos" 
            isActive={activePage === 'logs' || location.pathname === '/admin/logs'} 
            onClick={() => navigate('/admin/logs')}
          />
        </nav>
      </div>

      {/* Rodapé: Acessar Loja e Botão Sair */}
      <div className="px-2 space-y-1">
        <a
          href={getHomeUrl()}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-gray-400 hover:bg-zinc-900 hover:text-white rounded-lg transition-colors group cursor-pointer"
          title="Ir para a Página Inicial da Loja"
        >
          <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Página Inicial</span>
        </a>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 rounded-lg transition-colors group cursor-pointer"
          title="Encerrar sessão e voltar para a página inicial"
        >
          <LogoutIcon className="w-5 h-5 text-red-400 group-hover:text-red-300" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;