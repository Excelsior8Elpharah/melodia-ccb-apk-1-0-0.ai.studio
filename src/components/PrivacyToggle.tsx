import React from 'react';
import { usePrivacy } from '../context/PrivacyContext';
import { Eye, EyeOff } from 'lucide-react';

export const PrivacyToggle: React.FC = () => {
  const { isPrivacyMode, togglePrivacyMode } = usePrivacy();

  return (
    <button
      onClick={togglePrivacyMode}
      className={`h-9 px-2.5 sm:px-3 rounded-xl border text-xs font-semibold transition-all shadow-2xs cursor-pointer flex items-center gap-2 shrink-0 select-none whitespace-nowrap ${
        isPrivacyMode
          ? 'bg-amber-500/15 border-amber-500/50 text-amber-800 dark:text-amber-300 ring-2 ring-amber-500/20 shadow-xs'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/80'
      }`}
      title={isPrivacyMode ? 'Modo Projeção Ativo (Nomes e contatos mascarados). Clique para desativar.' : 'Ativar Modo Projeção (Mascara dados de alunos na tela)'}
      type="button"
      aria-label="Alternar Modo Projeção"
    >
      {isPrivacyMode ? (
        <>
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <EyeOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="hidden sm:inline font-bold">Projeção Ativa</span>
        </>
      ) : (
        <>
          <Eye className="w-4 h-4 text-slate-400 dark:text-slate-400 shrink-0" />
          <span className="hidden sm:inline font-medium">Modo Projeção</span>
        </>
      )}
    </button>
  );
};

export default PrivacyToggle;
