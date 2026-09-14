/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { 
  Database, 
  RefreshCcw, 
  Trash2, 
  Download, 
  UploadCloud, 
  AlertTriangle, 
  CheckCircle, 
  FileJson,
  Info,
  FileSpreadsheet,
  ArrowRight,
  Lock,
  ShieldCheck,
  History,
  Monitor
} from 'lucide-react';
import { downloadMasterLegacyExcel } from '../utils/legacyExcelGenerator';
import { ProtectedContent } from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

interface ConfigProps {
  counts: {
    pessoas: number;
    turmas: number;
    aulas: number;
    escalas: number;
    catalogo?: number;
  };
  onSeed: () => void;
  onClear: () => void;
  onBackup: () => void;
  onRestore: (jsonStr: string) => boolean;
  toast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onOpenEncryptedBackup?: () => void;
  onOpenAuditLogs?: () => void;
}

export default function Config({ 
  counts, 
  onSeed, 
  onClear, 
  onBackup, 
  onRestore, 
  toast, 
  onOpenEncryptedBackup,
  onOpenAuditLogs
}: ConfigProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  // Handle manual file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  // Process selected file
  const processFile = (file: File) => {
    if (file.name.endsWith('.melodia')) {
      if (onOpenEncryptedBackup) {
        onOpenEncryptedBackup();
        toast('Arquivo .melodia criptografado detectado. Insira a senha master na Central de Backup.', 'info');
      }
      return;
    }

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      toast('Por favor, envie arquivos de backup no formato .melodia ou .json.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        try {
          const parsed = JSON.parse(result);
          if (parsed.algorithm === 'AES-GCM-256' || parsed.ciphertext) {
            if (onOpenEncryptedBackup) {
              onOpenEncryptedBackup();
              toast('Backup criptografado com AES-256 detectado. Digite a senha master para restaurar.', 'info');
            }
            return;
          }
        } catch {
          // ignore error and proceed
        }

        const success = onRestore(result);
        if (success) {
          toast('Banco de dados restaurado com sucesso!', 'success');
          if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
          toast('Falha ao restaurar backup. Verifique a integridade do arquivo JSON.', 'error');
        }
      }
    };
    reader.readAsText(file);
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6" id="config-tab-container">
      {/* Description Header */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Configurações & Banco de Dados</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500">Faça a manutenção dos registros locais, backups de segurança e restauração de dados da orquestra.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="config-grid">
        {/* Left column: DB Health Stats & Seed/Wipe */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Health Index / Counts Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-500" />
              <span>Estatísticas de Armazenamento Local</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-xl font-bold text-slate-800 dark:text-white block">{counts.pessoas}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Pessoas</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-xl font-bold text-slate-800 dark:text-white block">{counts.turmas}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Turmas</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-xl font-bold text-slate-800 dark:text-white block">{counts.aulas}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Aulas / Diários</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-xl font-bold text-slate-800 dark:text-white block">{counts.escalas}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Escalas</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center col-span-2 sm:col-span-1">
                <span className="text-xl font-bold text-slate-800 dark:text-white block">{counts.catalogo || 0}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Catálogo</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-blue-50/40 dark:bg-blue-950/20 p-3.5 rounded-xl border border-dashed border-blue-200 dark:border-blue-850 text-xs text-blue-700 dark:text-blue-300">
              <Info className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <p>
                Os dados do Orquestra Manager são salvos localmente de forma privada no seu próprio navegador. 
                Sempre faça backup periódico para evitar perda de dados ao limpar o cache do navegador.
              </p>
            </div>
          </div>

          {/* Seed and Clean Section */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Operações Especiais</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Carregue dados simulados para testes ou limpe o banco de dados.</p>
            </div>

            <ProtectedContent 
              permission="EXPORT_BACKUP"
              fallback={
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>Operações de alteração estrutural no banco de dados são restritas ao Encarregado / Administrador.</span>
                </div>
              }
            >
              <div className="flex flex-col sm:flex-row gap-4 pt-1">
                <button
                  onClick={() => {
                    if (confirm('Deseja realmente carregar os dados demonstrativos? Isso mesclará ou substituirá registros existentes.')) {
                      onSeed();
                      toast('Dados de exemplo populados com sucesso!', 'success');
                    }
                  }}
                  className="flex-1 py-3.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCcw className="w-4 h-4 text-blue-500" />
                  <span>Carregar Dados de Exemplo</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('⚠️ ATENÇÃO: Deseja realmente APAGAR TODOS OS DADOS? Esta ação é irreversível e excluirá todas as pessoas, turmas, chamadas e escalas.')) {
                      onClear();
                      toast('Todo o banco de dados local foi limpo.', 'info');
                    }
                  }}
                  className="flex-1 py-3.5 px-4 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Apagar Todos os Dados</span>
                </button>
              </div>
            </ProtectedContent>
          </div>

        </div>

        {/* Right column: Interactive Backup & Restore Dropzone */}
        <div className="space-y-6">
          
          {/* Export / Import Box */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">Backup de Segurança</h4>

            <ProtectedContent
              permission="EXPORT_BACKUP"
              fallback={
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 text-xs">
                  <span>A exportação e restauração de dados do sistema exigem privilégios de Administrador.</span>
                </div>
              }
            >
              <div className="space-y-2.5">
                {onOpenEncryptedBackup && (
                  <button
                    onClick={onOpenEncryptedBackup}
                    className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer border border-blue-400/30"
                  >
                    <Lock className="w-4 h-4 text-blue-200" />
                    <span>Backup Criptografado (AES-256 / .melodia)</span>
                  </button>
                )}

                <button
                  onClick={onBackup}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/80 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-600"
                >
                  <Download className="w-4 h-4 text-blue-500" />
                  <span>Baixar Backup JSON (Sem Senha)</span>
                </button>

                <button
                  onClick={() => {
                    downloadMasterLegacyExcel();
                    toast('Exportando Acervo Completo em Pasta de Trabalho Excel (.xlsx)...', 'success');
                  }}
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Baixar Acervo em Excel (.xlsx - 5 Abas)</span>
                </button>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700/60 my-4 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Restaurar Backup (.melodia / .json)
                  </label>
                  {onOpenEncryptedBackup && (
                    <button
                      type="button"
                      onClick={onOpenEncryptedBackup}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>Descriptografar</span>
                    </button>
                  )}
                </div>

                {/* Uploader Dropzone */}
                <div 
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 select-none ${isDragActive ? 'border-blue-500 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".melodia,.json"
                    className="hidden"
                  />

                  <UploadCloud className={`w-8 h-8 ${isDragActive ? 'text-blue-500' : 'text-slate-400'}`} />

                  <div>
                    <span className="text-xs font-semibold block text-slate-700 dark:text-slate-300">
                      Arraste o arquivo ou toque para selecionar
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Arquivos .melodia (criptografados) ou .json
                    </span>
                  </div>
                </div>
              </div>
            </ProtectedContent>
          </div>

          {/* Legacy Excel Import Card Banner */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white p-6 rounded-2xl border border-emerald-700/50 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-sm">Migração de Planilhas de Excel</h4>
            </div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Importe planilhas antigas (.xlsx ou .csv) contendo pessoas, chamadas e escalas da igreja com pipeline ETL de limpeza de dados.
            </p>
            <div className="pt-2">
              <a
                href="#etl"
                onClick={(e) => {
                  e.preventDefault();
                  const etlBtn = document.querySelector('[data-tab-id="etl"]') as HTMLButtonElement;
                  if (etlBtn) etlBtn.click();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <span>Acessar Importador ETL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Audit Trail & Governance Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">Trilha de Auditoria (Audit Trail)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Rastreabilidade e governança de alterações pedagógicas e cadastrais</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Consulte o histórico de logins, cadastros de alunos, alterações cadastrais, diários de classe, lançamentos de presença/notas, consentimentos LGPD e backups.
            </p>
            <ProtectedContent 
              permission="VIEW_AUDIT_LOGS" 
              fallback={
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  Apenas usuários com perfil Administrador / Encarregado podem inspecionar a trilha de auditoria.
                </p>
              }
            >
              {onOpenAuditLogs && (
                <button
                  type="button"
                  onClick={onOpenAuditLogs}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <History className="w-4 h-4" />
                  <span>Abrir Trilha de Auditoria</span>
                </button>
              )}
            </ProtectedContent>
          </div>

          {/* Desktop Executable (.EXE) Information Card */}
          <div className="bg-linear-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 border border-indigo-500/30 shadow-md space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400 border border-blue-400/30">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Aplicativo Desktop Windows (.EXE)</h4>
                <p className="text-xs text-slate-400">Execute nativamente no computador sem depender de navegador</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              O projeto já está 100% pré-configurado com <strong>Electron</strong> e suporte offline.
              Basta baixar o projeto (Export ZIP) e dar duplo clique no arquivo:
            </p>
            <div className="p-3 bg-black/40 rounded-xl border border-white/10 font-mono text-xs text-blue-300 flex items-center justify-between">
              <span>GERAR_EXECUTAVEL_AUTOMATICO.bat</span>
              <span className="text-[10px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-md font-sans font-semibold">1-Clique</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Ele compila e gera automaticamente o <strong>Melodia CCB Setup.exe</strong> (instalador) e o <strong>Melodia CCB.exe</strong> (portátil) na pasta <code className="text-white">dist_electron/</code>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
