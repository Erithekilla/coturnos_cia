import React, { useEffect, useState } from 'react';

export interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps): React.JSX.Element {
  const [checking, setChecking] = useState<boolean>(true);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    // 1. Captura credenciais repassadas via URL (em ambiente de desenvolvimento multi-porta)
    const searchParams = new URLSearchParams(window.location.search);
    const urlToken = searchParams.get('token');
    const urlUser = searchParams.get('user');

    if (urlToken && urlUser) {
      try {
        localStorage.setItem('coturnos_auth_token', urlToken);
        localStorage.setItem('coturnos_usuario_logado', urlUser);
        // Limpa a URL sem recarregar a página
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (e) {
        console.error('Erro ao sincronizar sessão:', e);
      }
    }

    // 2. Lê a sessão salva no localStorage
    try {
      const userRaw = localStorage.getItem('coturnos_usuario_logado');
      const token = localStorage.getItem('coturnos_auth_token');

      if (!userRaw || !token) {
        setAuthorized(false);
        setUserInfo(null);
        setChecking(false);
        return;
      }

      const parsedUser = JSON.parse(userRaw);
      setUserInfo(parsedUser);

      // 3. Validação ESTRITA: somente role === 'admin' pode acessar
      if (parsedUser && parsedUser.role === 'admin') {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    } catch (e) {
      setAuthorized(false);
      setUserInfo(null);
    } finally {
      setChecking(false);
    }
  }, []);

  const getStoreUrl = () => (window.location.port === '5174' ? 'http://localhost:5173/' : '/');
  const getLoginUrl = () => (window.location.port === '5174' ? 'http://localhost:5173/login' : '/login');

  const handleLogout = () => {
    localStorage.removeItem('coturnos_auth_token');
    localStorage.removeItem('coturnos_usuario_logado');
    window.location.href = getLoginUrl();
  };

  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white font-sans">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-300">
          Autenticando sessão administrativa...
        </p>
      </div>
    );
  }

  // 1. NÃO AUTENTICADO
  if (!authorized && !userInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4 font-sans text-slate-100">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-950/80 border border-red-800 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-white mb-2">
            Acesso Restrito
          </h1>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            O Painel de Controle de Coturnos & Cia é exclusivo para contas autorizadas com privilégio de administrador.
          </p>
          <div className="space-y-3">
            <a
              href={getLoginUrl()}
              className="block w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-md"
            >
              Fazer Login como Administrador
            </a>
            <a
              href={getStoreUrl()}
              className="block w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase text-xs tracking-wider rounded-xl transition-all border border-slate-700"
            >
              Ir para a Loja Virtual
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTENTICADO, MAS NÃO É ADMIN (role !== 'admin')
  if (!authorized && userInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4 font-sans text-slate-100">
        <div className="w-full max-w-md bg-slate-900 border border-red-900/60 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-950 border border-red-800 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <span className="inline-block bg-red-950 border border-red-800 text-red-300 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Erro 403 • Não Autorizado
          </span>
          <h1 className="text-2xl font-black uppercase tracking-wider text-white mb-2">
            Permissão Insuficiente
          </h1>
          <p className="text-sm text-slate-400 mb-2 leading-relaxed">
            Olá, <span className="text-white font-bold">{userInfo.nome}</span>. Sua conta possui a permissão:
          </p>
          <p className="inline-block bg-slate-800 border border-slate-700 text-amber-400 font-mono text-xs uppercase px-3 py-1 rounded-lg mb-4 font-bold">
            role: &quot;{userInfo.role || 'cliente'}&quot;
          </p>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Apenas contas com a role <span className="text-amber-400 font-bold">&quot;admin&quot;</span> possuem permissão para acessar o painel de gerenciamento.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="block w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
            >
              Entrar com Conta de Administrador
            </button>
            <a
              href={getStoreUrl()}
              className="block w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase text-xs tracking-wider rounded-xl transition-all border border-slate-700"
            >
              Voltar para a Loja Virtual
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 3. AUTORIZADO (role === 'admin')
  return <>{children}</>;
}

