import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginModal } from './LoginModal';
import { Shield, UserCheck, BookOpen, ChevronDown, LogOut } from 'lucide-react';

export const UserBadge: React.FC = () => {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) return null;

  const roleConfig = {
    ADMIN: {
      color: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      label: 'Admin',
      icon: Shield,
    },
    INSTRUTOR: {
      color: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
      label: 'Instrutor',
      icon: UserCheck,
    },
    CONSULTA: {
      color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      label: 'Aluno',
      icon: BookOpen,
    },
  }[user.role];

  const RoleIcon = roleConfig.icon;

  return (
    <>
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Botão de Troca Rápida de Perfil */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-9 px-2 sm:px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-2xs flex items-center gap-2 cursor-pointer group select-none max-w-[180px] sm:max-w-[220px]"
          title="Clique para alternar o perfil de acesso"
          type="button"
        >
          <div className={`p-1 rounded-lg border ${roleConfig.color} shrink-0`}>
            <RoleIcon className="w-3.5 h-3.5" />
          </div>

          <div className="text-left min-w-0 hidden md:block">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">
              {user.nome.split(' ')[0]} {user.nome.split(' ')[1] || ''}
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-tight">
              {roleConfig.label}
            </div>
          </div>

          <div className="md:hidden">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
              {roleConfig.label}
            </span>
          </div>

          <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform shrink-0" />
        </button>

        {/* Botão de Logout */}
        <button
          onClick={logout}
          className="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-rose-600 hover:border-rose-200 dark:hover:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all shadow-2xs flex items-center justify-center cursor-pointer shrink-0"
          title="Sair (Voltar à tela de login)"
          type="button"
          aria-label="Sair do sistema"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default UserBadge;
