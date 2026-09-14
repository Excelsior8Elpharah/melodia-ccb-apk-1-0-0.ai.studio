import React, { useState, useEffect } from 'react';
import { getAuditLogs, clearAuditLogs } from '../utils/auditLogger';
import { AuditLogEntry, AuditActionType } from '../types/audit';
import { History, Search, Trash2, X, Clock } from 'lucide-react';

interface AuditLogViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACTION_LABELS: Record<AuditActionType, { label: string; color: string }> = {
  STUDENT_CREATED: { label: 'Novo Cadastro', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  STUDENT_UPDATED: { label: 'Edição de Aluno', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  STUDENT_DELETED: { label: 'Exclusão', color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
  STUDENT_ANONYMIZED: { label: 'Anonimização LGPD', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  ATTENDANCE_LOGGED: { label: 'Chamada / Presença', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' },
  GRADE_UPDATED: { label: 'Nota / Avaliação', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' },
  LGPD_CONSENT_REGISTERED: { label: 'Consentimento LGPD', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' },
  BACKUP_EXPORTED: { label: 'Exportação Backup', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' },
  BACKUP_RESTORED: { label: 'Restauração Backup', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' },
  USER_LOGIN: { label: 'Troca de Perfil', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
};

export const AuditLogViewerModal: React.FC<AuditLogViewerModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  useEffect(() => {
    if (isOpen) {
      setLogs(getAuditLogs());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.detalhes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.targetId && log.targetId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  const handleClear = () => {
    if (window.confirm('Deseja limpar todos os registros de auditoria locais?')) {
      clearAuditLogs();
      setLogs([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-50 duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Cabeçalho */}
        <div className="bg-slate-900 p-5 text-white flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/30 rounded-xl border border-blue-500/30">
              <History className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-base">Trilha de Auditoria & Governança</h3>
              <p className="text-xs text-slate-400">Histórico de ações e alterações do sistema ({logs.length} registros)</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filtros de Busca */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por responsável, detalhes ou ID..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-2">
            <select
              value={selectedAction}
              onChange={e => setSelectedAction(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">Todas as Ações</option>
              {Object.entries(ACTION_LABELS).map(([key, item]) => (
                <option key={key} value={key}>{item.label}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer flex items-center gap-1"
              title="Limpar logs locais de auditoria"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lista de Registros */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Nenhum evento registrado no filtro selecionado.
            </div>
          ) : (
            filteredLogs.map(log => {
              const actionMeta = ACTION_LABELS[log.action] || { label: log.action, color: 'bg-slate-100 text-slate-800' };
              const dateStr = new Date(log.timestamp).toLocaleString('pt-BR');

              return (
                <div
                  key={log.id}
                  className="p-3 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all text-xs shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${actionMeta.color}`}>
                        {actionMeta.label}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {log.userName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ({log.userRole})
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {dateStr}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 font-mono text-[11px] leading-relaxed">
                    {log.detalhes}
                  </p>

                  {/* Exibição de Mudanças de Valores */}
                  {log.mudancas && log.mudancas.length > 0 && (
                    <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-900/60 rounded-lg space-y-1 border border-slate-100 dark:border-slate-800">
                      {log.mudancas.map((m, idx) => (
                        <div key={idx} className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          <strong className="text-slate-700 dark:text-slate-300">{m.campo}:</strong>{' '}
                          <span className="line-through text-rose-500">{String(m.valorAntigo ?? '(vazio)')}</span>{' '}
                          <span className="text-slate-400 mx-1">→</span>{' '}
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{String(m.valorNovo ?? '(vazio)')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
export default AuditLogViewerModal;
