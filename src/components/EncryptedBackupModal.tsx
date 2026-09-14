import React, { useState } from 'react';
import { encryptBackup, decryptBackup } from '../utils/cryptoBackup';
import { ShieldCheck, Download, Upload, Lock, Key, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logAuditEvent } from '../utils/auditLogger';

interface EncryptedBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  getAppData: () => object; // Retorna o estado atual completo do app/banco local
  onRestoreData: (restoredData: object) => void;
}

export const EncryptedBackupModal: React.FC<EncryptedBackupModalProps> = ({
  isOpen,
  onClose,
  getAppData,
  onRestoreData,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'EXPORT' | 'IMPORT'>('EXPORT');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);

  if (!isOpen) return null;

  // Handler de Exportação Criptografada
  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setStatusMessage({ type: 'error', text: 'A senha de proteção deve conter no mínimo 6 caracteres.' });
      return;
    }
    if (password !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'As senhas informadas não coincidem.' });
      return;
    }

    try {
      setIsProcessing(true);
      setStatusMessage(null);

      const appData = getAppData();
      const encryptedEnvelope = await encryptBackup(appData, password);

      // Download do Arquivo .melodia
      const blob = new Blob([JSON.stringify(encryptedEnvelope, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `backup_melodia_ccb_protegido_${dateStr}.melodia`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatusMessage({ type: 'success', text: 'Backup criptografado gerado e baixado com sucesso!' });
      logAuditEvent(
        user,
        'BACKUP_EXPORTED',
        'Exportação de backup criptografado com senha master (AES-GCM-256 / .melodia).'
      );
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Erro ao gerar backup criptografado.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler de Importação e Descriptografia
  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile || !password) {
      setStatusMessage({ type: 'error', text: 'Selecione o arquivo .melodia e digite a senha.' });
      return;
    }

    try {
      setIsProcessing(true);
      setStatusMessage(null);

      const fileText = await importFile.text();
      const envelope = JSON.parse(fileText);

      if (!envelope.ciphertext || !envelope.salt || !envelope.iv) {
        throw new Error('Formato de arquivo inválido. Certifique-se de usar um arquivo .melodia de backup.');
      }

      const decryptedData = await decryptBackup(envelope, password);
      onRestoreData(decryptedData);

      logAuditEvent(
        user,
        'BACKUP_RESTORED',
        'Restauração completa da base de dados realizada a partir de arquivo criptografado .melodia.'
      );

      setStatusMessage({ type: 'success', text: 'Dados restaurados e validados com sucesso no sistema!' });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Senha incorreta ou erro ao ler o arquivo.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-50 duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Cabeçalho */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/30 rounded-xl border border-blue-500/30">
              <Lock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Central de Backup Criptografado</h3>
              <p className="text-[11px] text-slate-400">Proteção AES-GCM 256-bit contra vazamentos</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Abas Exportar / Importar */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => { setActiveTab('EXPORT'); setStatusMessage(null); }}
            className={`flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center space-x-2 border-b-2 cursor-pointer ${
              activeTab === 'EXPORT'
                ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-850 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Gerar Backup Protegido</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('IMPORT'); setStatusMessage(null); }}
            className={`flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center space-x-2 border-b-2 cursor-pointer ${
              activeTab === 'IMPORT'
                ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-850 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Restauração com Senha</span>
          </button>
        </div>

        {/* Mensagem de Feedback */}
        {statusMessage && (
          <div className={`m-4 p-3 rounded-xl border text-xs flex items-start space-x-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Formulário EXPORTAR */}
        {activeTab === 'EXPORT' && (
          <form onSubmit={handleExport} className="p-5 space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-xl text-[11px] text-blue-900 dark:text-blue-200 leading-relaxed flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
              <span>
                O arquivo exportado será cifrado com a sua senha master. Ele não poderá ser lido por blocos de notas convencionais sem a senha correta.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Defina uma Senha Master para o Backup:
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full text-xs p-2.5 pl-8 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <Key className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Confirme a Senha:
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha master"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isProcessing ? 'Criptografando...' : 'Exportar (.melodia)'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Formulário IMPORTAR */}
        {activeTab === 'IMPORT' && (
          <form onSubmit={handleImport} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Selecione o Arquivo de Backup Criptografado (.melodia):
              </label>
              <input
                type="file"
                accept=".melodia,.json"
                required
                onChange={e => setImportFile(e.target.files?.[0] || null)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 file:mr-3 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-700 dark:file:bg-blue-900/60 dark:file:text-blue-300 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Senha Master de Descriptografia:
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Informe a senha definida na exportação"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{isProcessing ? 'Descriptografando...' : 'Restaurar Sistema'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
