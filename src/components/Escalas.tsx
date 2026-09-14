/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Escala, Pessoa } from '../types';
import { validateEventSchedule } from '../utils/officialCalendar';
import OfficialCalendarBanner from './OfficialCalendarBanner';
import { 
  Calendar, 
  Plus, 
  Edit3, 
  Trash2, 
  Printer, 
  Check, 
  User, 
  MapPin, 
  Clock, 
  CheckCircle, 
  FileText,
  AlertCircle,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

interface EscalasProps {
  escalas: Escala[];
  pessoas: Pessoa[];
  onSave: (escala: Escala) => void;
  onDelete: (id: string) => void;
  toast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  key?: string;
}

export default function Escalas({ escalas, pessoas, onSave, onDelete, toast }: EscalasProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEscala, setSelectedEscala] = useState<Escala | null>(null);

  // Print Mode State
  const [printTargetEscala, setPrintTargetEscala] = useState<Escala | null>(null);

  // Form State
  const [formEvento, setFormEvento] = useState('');
  const [formData, setFormData] = useState('');
  const [formRegenteId, setFormRegenteId] = useState('');
  const [formMusicosIds, setFormMusicosIds] = useState<string[]>([]);
  const [formStatus, setFormStatus] = useState<'Confirmado' | 'Rascunho' | 'Realizado'>('Rascunho');
  const [formObservacoes, setFormObservacoes] = useState('');

  // Dropdown lists
  const regentes = pessoas.filter(p => p.tipo === 'Professor');
  const musicosDisponiveis = pessoas.filter(p => p.tipo === 'Musico' && p.status === 'Ativo');

  // Open form
  const openFormModal = (escala: Escala | null = null) => {
    const defaultRegenteId = regentes[0]?.id || '';
    if (escala) {
      setSelectedEscala(escala);
      setFormEvento(escala.evento);
      setFormData(escala.data);
      setFormRegenteId(escala.regenteId);
      setFormMusicosIds(escala.musicosIds || []);
      setFormStatus(escala.status);
      setFormObservacoes(escala.observacoes || '');
    } else {
      setSelectedEscala(null);
      setFormEvento('');
      setFormData(() => {
        // Default to Saturday 19:30 or nearest date
        const d = new Date();
        d.setDate(d.getDate() + (6 - d.getDay())); // nearest Saturday
        d.setHours(19, 30, 0, 0);
        return d.toISOString().slice(0, 16);
      });
      setFormRegenteId(defaultRegenteId);
      setFormMusicosIds([]);
      setFormStatus('Rascunho');
      setFormObservacoes('');
    }
    setIsModalOpen(true);
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEvento.trim()) {
      toast('Informe o nome do culto ou ensaio.', 'error');
      return;
    }
    if (!formData) {
      toast('Informe a data e hora do evento.', 'error');
      return;
    }
    if (!formRegenteId) {
      toast('Selecione um regente.', 'error');
      return;
    }

    const updatedEscala: Escala = {
      id: selectedEscala ? selectedEscala.id : 'esc_' + Date.now().toString(),
      evento: formEvento.trim(),
      data: formData,
      regenteId: formRegenteId,
      musicosIds: formMusicosIds,
      status: formStatus,
      observacoes: formObservacoes.trim()
    };

    onSave(updatedEscala);
    setIsModalOpen(false);
    toast(selectedEscala ? 'Escala atualizada com sucesso!' : 'Nova escala criada com sucesso!', 'success');
  };

  // Toggle musician selection
  const toggleMusicianSelection = (id: string) => {
    if (formMusicosIds.includes(id)) {
      setFormMusicosIds(prev => prev.filter(mid => mid !== id));
    } else {
      setFormMusicosIds(prev => [...prev, id]);
    }
  };

  // Print trigger helper
  const handlePrint = (escala: Escala) => {
    setPrintTargetEscala(escala);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="space-y-6" id="escalas-tab-container">
      {/* Official Congregation & Orchestra Calendar Banner */}
      <OfficialCalendarBanner compact={false} />

      {/* Header Panel */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Escalas de Cultos & Convocações</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">Organize os músicos, designe regentes e publique as programações oficiais.</p>
        </div>

        <button 
          onClick={() => {
            if (regentes.length === 0) {
              toast('Você precisa ter pelo menos um professor cadastrado para reger os cultos.', 'error');
              return;
            }
            openFormModal(null);
          }}
          className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Escala</span>
        </button>
      </div>

      {/* Grid of lists */}
      {escalas.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-1">Nenhuma escala cadastrada</h4>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Escalone músicos para os próximos cultos e cultive o equilíbrio acústico e participativo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="escalas-grid">
          {escalas
            .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
            .map(escala => {
              const regente = pessoas.find(p => p.id === escala.regenteId);
              
              const statusStyles = {
                Confirmado: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900',
                Rascunho: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900',
                Realizado: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
              };

              return (
                <div 
                  key={escala.id} 
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5 space-y-4">
                    {/* Header Info */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider ${statusStyles[escala.status]}`}>
                          {escala.status}
                        </span>
                        <h4 className="text-base font-bold text-slate-800 dark:text-white mt-2 leading-tight">
                          {escala.evento}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button 
                          onClick={() => openFormModal(escala)}
                          className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg cursor-pointer transition-all"
                          title="Editar Escala"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handlePrint(escala)}
                          className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg cursor-pointer transition-all"
                          title="Imprimir Escala"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Remover escala "${escala.evento}"?`)) {
                              onDelete(escala.id);
                              toast('Escala removida com sucesso.', 'success');
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-lg cursor-pointer transition-all"
                          title="Excluir Escala"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Meta info card */}
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Data e Horário</span>
                          <span className="font-bold">
                            {new Date(escala.data).toLocaleString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Regente / Maestro</span>
                          <span className="font-bold">🎻 {regente ? regente.nome : 'Sem regente definido'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Scaled Musicians initials lists */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Corpo Musical Escalado ({escala.musicosIds.length})
                      </span>
                      {escala.musicosIds.length === 0 ? (
                        <p className="text-xs text-rose-400 italic">⚠️ Nenhum músico escalado para este evento. Clique em editar para escalar.</p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {escala.musicosIds.map(musId => {
                            const musObj = pessoas.find(p => p.id === musId);
                            if (!musObj) return null;
                            return (
                              <span 
                                key={musId} 
                                className="text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/60 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 font-semibold inline-flex items-center gap-1 hover:border-blue-300 dark:hover:border-blue-900 transition-all"
                              >
                                <span>🎵</span>
                                <span>{musObj.nome.split(' ')[0]}</span>
                                <span className="text-[8px] text-slate-400 uppercase">({musObj.instrumento})</span>
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer announcements / remarks */}
                  {escala.observacoes && (
                    <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 italic">
                      📢 {escala.observacoes}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* PRINT BANNER HIDDEN ON DEFAULT SCREEN, VISIBLE ON PRINT */}
      {printTargetEscala && (
        <div className="hidden print:block fixed inset-0 bg-white p-8 text-black z-100 overflow-y-auto" id="escala-print-sheet">
          <div className="text-center space-y-2 border-b-2 border-black pb-4 mb-6">
            <h1 className="text-2xl font-black uppercase">Orquestra Manager</h1>
            <p className="text-sm font-bold tracking-widest uppercase">CONVOCAÇÃO MUSICAL OFICIAL</p>
          </div>

          <div className="space-y-4 mb-6 text-sm">
            <p className="text-lg font-bold uppercase">Evento: {printTargetEscala.evento}</p>
            <p><strong>Data/Hora:</strong> {new Date(printTargetEscala.data).toLocaleString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            <p><strong>Regente:</strong> {pessoas.find(p => p.id === printTargetEscala.regenteId)?.nome || 'Não definido'}</p>
            <p><strong>Status:</strong> {printTargetEscala.status}</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold border-b border-black pb-1">MÚSICOS CONVOCADOS</h3>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-black">
                  <th className="py-2">Nome</th>
                  <th className="py-2">Instrumento</th>
                  <th className="py-2 text-right">Presença</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {printTargetEscala.musicosIds.map(musId => {
                  const musObj = pessoas.find(p => p.id === musId);
                  if (!musObj) return null;
                  return (
                    <tr key={musId}>
                      <td className="py-2">{musObj.nome}</td>
                      <td className="py-2">{musObj.instrumento}</td>
                      <td className="py-2 text-right">[  ] Confirmado</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {printTargetEscala.observacoes && (
            <div className="mt-8 p-4 border border-black italic text-xs leading-relaxed">
              <strong>Observações / Avisos importantes:</strong><br />
              {printTargetEscala.observacoes}
            </div>
          )}

          <div className="mt-16 text-center text-xs text-gray-500 border-t pt-4">
            Gerado automaticamente por Orquestra Manager • {new Date().toLocaleDateString('pt-BR')}
          </div>
        </div>
      )}

      {/* NEW/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {selectedEscala ? 'Editar Escala' : 'Nova Escala / Convocação Musical'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Identificação do Evento *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Culto Oficial de Terça-feira" 
                  className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formEvento}
                  onChange={(e) => setFormEvento(e.target.value)}
                />
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-semibold">Atalhos do Calendário Oficial:</span>
                  <button
                    type="button"
                    onClick={() => setFormEvento('Culto Oficial (Adultos)')}
                    className="px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-md text-[10px] font-medium transition-colors cursor-pointer"
                  >
                    Culto Oficial
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormEvento('Culto de Jovens')}
                    className="px-2 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 rounded-md text-[10px] font-medium transition-colors cursor-pointer"
                  >
                    Culto de Jovens
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormEvento('Ensaio Geral da Orquestra')}
                    className="px-2 py-0.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 rounded-md text-[10px] font-medium transition-colors cursor-pointer"
                  >
                    Ensaio Geral
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Data e Horário *</label>
                  <input 
                    type="datetime-local" 
                    required
                    className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formData}
                    onChange={(e) => setFormData(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Status *</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                  >
                    <option value="Rascunho">Rascunho / Proposta</option>
                    <option value="Confirmado">Confirmado / Publicado</option>
                    <option value="Realizado">Realizado</option>
                  </select>
                </div>
              </div>

              {/* Schedule Validation Warning Banner */}
              {(() => {
                const check = validateEventSchedule(formData, formEvento);
                if (!check.hasConflict) return null;
                return (
                  <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${check.type === 'error' ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300' : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300'}`}>
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold">{check.title}</p>
                      <p>{check.reason}</p>
                      {check.suggestion && <p className="font-semibold text-[11px]">{check.suggestion}</p>}
                    </div>
                  </div>
                );
              })()}

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Regente / Maestro Principal *</label>
                <select
                  className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formRegenteId}
                  onChange={(e) => setFormRegenteId(e.target.value)}
                >
                  <option key="none-reg" value="" disabled>Selecione um Regente</option>
                  {regentes.map(reg => (
                    <option key={reg.id} value={reg.id}>{reg.nome} ({reg.instrumento})</option>
                  ))}
                </select>
              </div>

              {/* Escalar Músicos checklist inside Form */}
              <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Escale os Músicos Ativos ({formMusicosIds.length} selecionados)
                </label>
                
                {musicosDisponiveis.length === 0 ? (
                  <p className="text-xs text-amber-500 font-medium py-2">
                    Não há músicos ativos cadastrados. Cadastre músicos na aba 'Pessoas' primeiro!
                  </p>
                ) : (
                  <div className="max-h-[160px] overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl p-2 bg-slate-50 dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 space-y-1">
                    {musicosDisponiveis.map(mus => {
                      const isSelected = formMusicosIds.includes(mus.id);
                      return (
                        <div 
                          key={mus.id}
                          onClick={() => toggleMusicianSelection(mus.id)}
                          className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all select-none text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{mus.nome}</span>
                            <span className="text-[10px] text-slate-400">({mus.instrumento})</span>
                          </div>
                          <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Observações / Recomendações Musicais</label>
                <textarea 
                  rows={2}
                  placeholder="Ex: Hino oficial 10, prelúdio e posfúdio solene. Vestimenta: terno preto oficial." 
                  className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  value={formObservacoes}
                  onChange={(e) => setFormObservacoes(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Confirmar Escala
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
