import React from 'react';
import { anonymizeStudentData, StudentData } from '../utils/anonymize';
import { UserX, Trash2, X } from 'lucide-react';

interface DeleteStudentDialogProps {
  student: StudentData;
  onUpdateStudent: (updated: StudentData) => void;
  onHardDeleteStudent: (id: string) => void;
  onClose?: () => void;
}

export const DeleteStudentDialog: React.FC<DeleteStudentDialogProps> = ({
  student,
  onUpdateStudent,
  onHardDeleteStudent,
  onClose,
}) => {
  const handleAnonymize = () => {
    if (confirm(`Tem certeza que deseja anonimizar os dados de ${student.nome}? Esta ação é irreversível conforme o Artigo 18 da LGPD.`)) {
      const anonimizado = anonymizeStudentData(student);
      onUpdateStudent(anonimizado);
      if (onClose) onClose();
    }
  };

  const handleHardDelete = () => {
    if (confirm(`Excluir permanentemente o registro de ${student.nome}? Todos os dados e vínculos serão removidos.`)) {
      onHardDeleteStudent(student.id);
      if (onClose) onClose();
    }
  };

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Opções de Exclusão / Privacidade LGPD
        </h4>
        {onClose && (
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Anonimização (Opção Recomendada LGPD) */}
        <button
          type="button"
          onClick={handleAnonymize}
          disabled={student.isAnonimizado}
          className="flex-1 p-3 bg-white dark:bg-slate-700 border border-amber-300 dark:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-900 dark:text-amber-200 rounded-lg text-xs font-medium text-left transition-colors flex items-start space-x-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserX className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Anonimizar (Recomendado)</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Remove nome, contatos e documentos, mantendo dados genéricos de presença para relatórios da orquestra.
            </div>
          </div>
        </button>

        {/* Remoção Definitiva */}
        <button
          type="button"
          onClick={handleHardDelete}
          className="flex-1 p-3 bg-white dark:bg-slate-700 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-xs font-medium text-left transition-colors flex items-start space-x-2.5 cursor-pointer"
        >
          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Excluir Tudo</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Apaga completamente o registro e histórico.
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
