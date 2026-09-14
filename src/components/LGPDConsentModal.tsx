import React, { useState, useEffect } from 'react';
import { ConsentRecord } from '../types/lgpd';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface LGPDConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  isMinor: boolean; // aluno < 18 anos
  currentConsent?: ConsentRecord;
  onSaveConsent: (consent: ConsentRecord) => void;
}

export const LGPDConsentModal: React.FC<LGPDConsentModalProps> = ({
  isOpen,
  onClose,
  studentName,
  isMinor,
  currentConsent,
  onSaveConsent,
}) => {
  const [nomeResponsavel, setNomeResponsavel] = useState(currentConsent?.nomeResponsavelLegal || '');
  const [cpfResponsavel, setCpfResponsavel] = useState(currentConsent?.cpfResponsavel || '');
  const [parentesco, setParentesco] = useState<ConsentRecord['parentescoResponsavel']>(
    currentConsent?.parentescoResponsavel || (isMinor ? 'PAI' : 'PROPRIO_ALUNO_MAIOR')
  );
  const [usoImagem, setUsoImagem] = useState(currentConsent?.autorizacaoUsoImagemEAudio ?? true);
  const [aceitouTermos, setAceitouTermos] = useState(currentConsent?.consentimentoConcedido ?? false);

  useEffect(() => {
    if (isOpen) {
      setNomeResponsavel(currentConsent?.nomeResponsavelLegal || '');
      setCpfResponsavel(currentConsent?.cpfResponsavel || '');
      setParentesco(currentConsent?.parentescoResponsavel || (isMinor ? 'PAI' : 'PROPRIO_ALUNO_MAIOR'));
      setUsoImagem(currentConsent?.autorizacaoUsoImagemEAudio ?? true);
      setAceitouTermos(currentConsent?.consentimentoConcedido ?? false);
    }
  }, [isOpen, currentConsent, isMinor]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aceitouTermos) return;

    onSaveConsent({
      consentimentoConcedido: true,
      dataConsentimento: new Date().toISOString(),
      nomeResponsavelLegal: isMinor ? nomeResponsavel.trim() : undefined,
      cpfResponsavel: isMinor && cpfResponsavel.trim() ? cpfResponsavel.trim() : undefined,
      parentescoResponsavel: parentesco,
      autorizacaoUsoImagemEAudio: usoImagem,
      versaoTermoAceito: '1.0-2026',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Cabeçalho */}
        <div className="bg-emerald-700 p-5 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-600/80 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <h3 className="font-bold text-base">Termo de Consentimento LGPD</h3>
              <p className="text-xs text-emerald-100">Artigo 14 da Lei 13.709/2018 (Dados de Menores)</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 hover:bg-emerald-600 rounded-lg transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5 text-emerald-100" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
            <strong>Aluno:</strong> {studentName} {isMinor && <span className="text-amber-700 dark:text-amber-400 font-bold ml-1">(Menor de Idade)</span>}
            <br />
            Os dados cadastrais e o histórico pedagógico são coletados exclusivamente para a organização das aulas, ensaios e alocação nos naipes da orquestra.
          </div>

          {/* Dados do Responsável (se for menor) */}
          {isMinor && (
            <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                Dados do Responsável Legal
              </h4>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nome do Pai, Mãe ou Tutor Legal: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required={isMinor}
                  value={nomeResponsavel}
                  onChange={e => setNomeResponsavel(e.target.value)}
                  placeholder="Nome completo do responsável"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Grau de Parentesco / Vínculo:
                  </label>
                  <select
                    value={parentesco}
                    onChange={e => setParentesco(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="PAI">Pai</option>
                    <option value="MAE">Mãe</option>
                    <option value="RESPONSAVEL_LEGAL">Responsável Legal (Tutor/Guardião)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    CPF do Responsável (Opcional):
                  </label>
                  <input
                    type="text"
                    value={cpfResponsavel}
                    onChange={e => setCpfResponsavel(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Checkboxes de Autorização */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start space-x-3 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={aceitouTermos}
                onChange={e => setAceitouTermos(e.target.checked)}
                className="mt-0.5 rounded-sm text-emerald-600 focus:ring-emerald-500 h-4 w-4 shrink-0"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300">
                <strong>Autorização de Coleta Pedagógica (Obrigatória):</strong> Autorizo expressamente o registro de dados pessoais e o acompanhamento do histórico rítmico, teórico e de frequência para fins de ensino musical no Melodia CCB.
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={usoImagem}
                onChange={e => setUsoImagem(e.target.checked)}
                className="mt-0.5 rounded-sm text-emerald-600 focus:ring-emerald-500 h-4 w-4 shrink-0"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                <strong>Uso de Imagem/Som em Apresentações (Opcional):</strong> Autorizo a inclusão em fotos ou vídeos de ensaios e apresentações institucionais da orquestra.
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!aceitouTermos || (isMinor && !nomeResponsavel.trim())}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Registrar Consentimento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
