import React from 'react';
import { ConsentRecord } from '../types/lgpd';
import { ShieldCheck, ShieldAlert, UserX } from 'lucide-react';

interface LGPDStatusBadgeProps {
  consent?: ConsentRecord;
  isAnonimizado?: boolean;
  onOpenConsentModal: () => void;
}

export const LGPDStatusBadge: React.FC<LGPDStatusBadgeProps> = ({
  consent,
  isAnonimizado,
  onOpenConsentModal,
}) => {
  if (isAnonimizado) {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
        <UserX className="w-3 h-3 text-slate-500" />
        <span>Anonimizado (LGPD)</span>
      </span>
    );
  }

  if (consent?.consentimentoConcedido) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpenConsentModal();
        }}
        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors cursor-pointer"
        title={`Consentimento registrado em ${new Date(consent.dataConsentimento).toLocaleDateString('pt-BR')}${consent.nomeResponsavelLegal ? ` por ${consent.nomeResponsavelLegal}` : ''}`}
      >
        <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        <span>Consentimento OK</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpenConsentModal();
      }}
      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors animate-pulse cursor-pointer"
      title="Pendente autorização do responsável legal (Clique para registrar)"
    >
      <ShieldAlert className="w-3 h-3 text-amber-600 dark:text-amber-400" />
      <span>Pendente LGPD</span>
    </button>
  );
};
