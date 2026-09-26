// src/pages/UsuariosGestao.tsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/organisms/Sidebar';
import PageHeader_usuario from '../components/molecules/PageHeader_usuario';
import SearchInput from '../components/atoms/SearchInput';
import UserTable, { UserItem } from '../components/organisms/UserTable';
import userService from '../services/userService';

type FormMode = 'create' | 'edit' | null;

export interface UserFormData {
  id?: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  cpf?: string;
  type?: string;
  provider?: string;
  status?: string;
  createdAt?: string;
  password?: string;
}

export default function UsuariosGestao(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [formMode, setFormMode] = useState<FormMode>(null); 
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cpf: '',
    type: 'Cliente',
    provider: 'Local',
    status: 'Ativo',
    createdAt: '',
    password: ''
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('Erro ao carregar usuários:', err);
      setFeedback({ type: 'error', message: 'Erro ao carregar usuários do banco de dados.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEdit = (id: number | string): void => {
    const user = users.find(u => u.id === id);
    if (user) {
      setFormData({
        ...user,
        password: ''
      });
      setEditingId(id);
      setFormMode('edit');
      setFeedback(null);
    }
  };
  
  const handleNovoUsuario = (): void => {
    const today = new Date().toLocaleDateString('pt-BR');
    setFormData({ 
      firstName: '', 
      lastName: '', 
      email: '', 
      phone: '', 
      cpf: '', 
      type: 'Cliente', 
      provider: 'Local', 
      status: 'Ativo', 
      createdAt: today,
      password: ''
    });
    setEditingId(null);
    setFormMode('create');
    setFeedback(null);
  };
  
  const handleCloseForm = (): void => {
    setFormMode(null);
    setEditingId(null);
  };

  const handleDelete = async (id: number | string): Promise<void> => {
    const user = users.find(u => u.id === id);
    const userName = user ? `${user.firstName} ${user.lastName}` : `ID #${id}`;

    if (!window.confirm(`Tem certeza que deseja remover o usuário "${userName}" do banco de dados?`)) {
      return;
    }

    try {
      setLoading(true);
      await userService.deleteUser(id);
      setFeedback({ type: 'success', message: `Usuário "${userName}" removido com sucesso!` });
      await loadUsers();
    } catch (err: any) {
      console.error('Erro ao excluir usuário:', err);
      setFeedback({ type: 'error', message: err.message || 'Erro ao excluir usuário do banco.' });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.cpf && user.cpf.includes(searchTerm))
  );

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      setSaving(true);
      setFeedback(null);

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        nome: formData.firstName,
        sobrenome: formData.lastName,
        email: formData.email,
        cpf: formData.cpf,
        type: formData.type,
        role: formData.type === 'Administrador' ? 'admin' : 'cliente',
        provider: formData.provider,
        ...(formData.password ? { senha: formData.password } : {})
      };

      if (formMode === 'edit' && editingId !== null) {
        await userService.updateUser(editingId, payload);
        setFeedback({ type: 'success', message: `Usuário "${formData.firstName}" atualizado com sucesso!` });
      } else {
        await userService.createUser(payload);
        setFeedback({ type: 'success', message: `Usuário "${formData.firstName}" cadastrado com sucesso!` });
      }

      handleCloseForm();
      await loadUsers();
    } catch (err: any) {
      console.error('Erro ao salvar usuário:', err);
      setFeedback({ type: 'error', message: err.message || 'Erro ao salvar usuário no banco de dados.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 antialiased pt-10 pe-5">
      <Sidebar activePage="usuarios" />

      <main className="pl-72 flex-1 pb-12">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <PageHeader_usuario
            title="Gestão de Usuários" 
            subtitle="Gerencie os usuários e administradores da base de dados em tempo real" 
            buttonText="Novo Usuário"
            onButtonClick={handleNovoUsuario}
            showButton={formMode === null}
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
                <h2 className="text-xl font-bold text-slate-900">
                  {formMode === 'edit' ? 'Editar Usuário no Banco' : 'Cadastrar Novo Usuário'}
                </h2>
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
                    <label className="text-sm font-medium text-slate-600">Nome</label>
                    <input type="text" className="p-2 border border-slate-200 rounded-lg text-slate-900" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Sobrenome</label>
                    <input type="text" className="p-2 border border-slate-200 rounded-lg text-slate-900" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">E-mail</label>
                    <input type="email" className="p-2 border border-slate-200 rounded-lg text-slate-900" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">CPF</label>
                    <input type="text" className="p-2 border border-slate-200 rounded-lg text-slate-900" value={formData.cpf || ''} onChange={(e) => setFormData({...formData, cpf: e.target.value})} />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Tipo de Usuário</label>
                    <select className="p-2 border border-slate-200 rounded-lg bg-white text-slate-900" value={formData.type || 'Cliente'} onChange={(e) => setFormData({...formData, type: e.target.value as any})}>
                      <option value="Cliente">Cliente</option>
                      <option value="Administrador">Administrador</option>
                    </select>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Provedor</label>
                    <select className="p-2 border border-slate-200 rounded-lg bg-white text-slate-900" value={formData.provider || 'Local'} onChange={(e) => setFormData({...formData, provider: e.target.value})}>
                      <option value="Local">Local</option>
                      <option value="Google">Google</option>
                      <option value="Apple">Apple</option>
                    </select>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Senha {formMode === 'edit' && '(Deixe em branco para não alterar)'}</label>
                    <input 
                      type="password" 
                      placeholder={formMode === 'edit' ? '••••••••' : 'Digite a senha do usuário'} 
                      className="p-2 border border-slate-200 rounded-lg text-slate-900" 
                      value={formData.password || ''} 
                      onChange={(e) => setFormData({...formData, password: e.target.value})} 
                      required={formMode === 'create'}
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Status</label>
                    <select className="p-2 border border-slate-200 rounded-lg bg-white text-slate-900" value={formData.status || 'Ativo'} onChange={(e) => setFormData({...formData, status: e.target.value as any})}>
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-slate-100">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors shadow-sm text-sm"
                  >
                    {saving ? 'Salvando no Banco...' : formMode === 'edit' ? 'Salvar Alterações' : 'Cadastrar Usuário'}
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
                <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar usuários por nome, email ou CPF..." />
              </div>

              {loading ? (
                <div className="w-full bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-3" />
                  <p className="font-medium text-sm">Carregando usuários do banco de dados...</p>
                </div>
              ) : (
                <UserTable 
                  users={filteredUsers} 
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
