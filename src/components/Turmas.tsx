/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Turma, Pessoa } from '../types';
import { INSTRUMENTOS_PREDEFINIDOS } from '../data/mockData';
import { validateTurmaHorario } from '../utils/officialCalendar';
import { useAuth } from '../context/AuthContext';
import OfficialCalendarBanner from './OfficialCalendarBanner';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Clock, 
  User, 
  GraduationCap, 
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  Check,
  AlertTriangle,
  Calendar
} from 'lucide-react';

interface TurmasProps {
  turmas: Turma[];
  pessoas: Pessoa[];
  onSave: (turma: Turma) => void;
  onDelete: (id: string) => void;
  toast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  key?: string;
}

export default function Turmas({ turmas, pessoas, onSave, onDelete, toast }: TurmasProps) {
  const { user } = useAuth();
  const isStudent = user?.role === 'CONSULTA' && !!user?.pessoaId;
  const isTeacher = user?.role === 'INSTRUTOR' && !!user?.pessoaId;

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'Todos' | 'Iniciante' | 'Intermediário' | 'Avançado'>('Todos');

  // Expanded student listing states
  const [expandedTurmaId, setExpandedTurmaId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);

  // Form State
  const [formNome, setFormNome] = useState('');
  const [formProfessorId, setFormProfessorId] = useState('');
  const [formInstrumento, setFormInstrumento] = useState('Violino');
  const [formNivel, setFormNivel] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Iniciante');
  const [formHorario, setFormHorario] = useState('');
  const [formAlunosIds, setFormAlunosIds] = useState<string[]>([]);

  // List of teachers and students for form dropdowns/selections
  const professores = pessoas.filter(p => p.tipo === 'Professor');
  const alunosDisponiveis = pessoas.filter(p => p.tipo === 'Aluno');

  // Open modal
  const openFormModal = (turma: Turma | null = null) => {
    const defaultProfessorId = professores[0]?.id || '';
    if (turma) {
      setSelectedTurma(turma);
      setFormNome(turma.nome);
      setFormProfessorId(turma.professorId);
      setFormInstrumento(turma.instrumento);
      setFormNivel(turma.nivel);
      setFormHorario(turma.horario);
      setFormAlunosIds(turma.alunosIds || []);
    } else {
      setSelectedTurma(null);
      setFormNome('');
      setFormProfessorId(defaultProfessorId);
      setFormInstrumento('Violino');
      setFormNivel('Iniciante');
      setFormHorario('');
      setFormAlunosIds([]);
    }
    setIsModalOpen(true);
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNome.trim()) {
      toast('Informe o nome da turma.', 'error');
      return;
    }
    if (!formProfessorId) {
      toast('Selecione um professor para esta turma.', 'error');
      return;
    }

    const updatedTurma: Turma = {
      id: selectedTurma ? selectedTurma.id : 'tur_' + Date.now().toString(),
      nome: formNome.trim(),
      professorId: formProfessorId,
      instrumento: formInstrumento,
      nivel: formNivel,
      horario: formHorario.trim(),
      alunosIds: formAlunosIds
    };

    onSave(updatedTurma);
    setIsModalOpen(false);
    toast(selectedTurma ? 'Turma atualizada com sucesso!' : 'Nova turma cadastrada com sucesso!', 'success');
  };

  // Toggle student enrollment
  const toggleStudentSelection = (alunoId: string) => {
    if (formAlunosIds.includes(alunoId)) {
      setFormAlunosIds(prev => prev.filter(id => id !== alunoId));
    } else {
      setFormAlunosIds(prev => [...prev, alunoId]);
    }
  };

  // Filter accessible turmas according to role isolation
  const accessibleTurmas = useMemo(() => {
    if (isStudent) {
      return turmas.filter(t => t.alunosIds.includes(user?.pessoaId!));
    }
    if (isTeacher) {
      return turmas.filter(t => t.professorId === user?.pessoaId);
    }
    return turmas;
  }, [turmas, isStudent, isTeacher, user?.pessoaId]);

  // Filtered list
  const filteredTurmas = accessibleTurmas.filter(t => {
    const matchesSearch = t.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.instrumento.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'Todos' || t.nivel === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6" id="turmas-tab-container">
      {/* Official Congregation & Orchestra Calendar Banner */}
      <OfficialCalendarBanner compact={false} />

      {/* Header filter actions */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2 max-w-md bg-slate-50 dark:bg-slate-900/50 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome da turma ou instrumento..." 
            className="bg-transparent text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/30 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase px-1">Nível:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              className="bg-transparent text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-none"
            >
              <option value="Todos">Todos os Níveis</option>
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>
          </div>

          {user?.role !== 'CONSULTA' && (
            <button 
              onClick={() => openFormModal(null)}
              className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Turma</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of classes */}
      {filteredTurmas.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-1">Nenhuma turma cadastrada</h4>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Cadastre aulas de instrumentos para acompanhar o progresso dos alunos e fazer chamadas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="turmas-grid">
          {filteredTurmas.map(turma => {
            const professor = pessoas.find(p => p.id === turma.professorId);
            const isExpanded = expandedTurmaId === turma.id;
            
            // Level badges
            const levelStyles = {
              Iniciante: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
              Intermediário: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-100 dark:border-blue-900/50',
              Avançado: 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border-purple-100 dark:border-purple-900/50'
            };

            return (
              <div 
                key={turma.id} 
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition-all"
              >
                {/* Header card info */}
                <div className="p-5 flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${levelStyles[turma.nivel]}`}>
                        {turma.nivel}
                      </span>
                      <h4 className="text-base font-bold text-slate-800 dark:text-white mt-2 leading-snug">
                        {turma.nome}
                      </h4>
                    </div>
                    {user?.role !== 'CONSULTA' && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button 
                          onClick={() => openFormModal(turma)}
                          className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg cursor-pointer"
                          title="Editar Turma"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Remover turma "${turma.nome}"? Isso não deletará os alunos.`)) {
                              onDelete(turma.id);
                              toast('Turma removida com sucesso.', 'success');
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-lg cursor-pointer"
                          title="Deletar Turma"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/40">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <span className="text-slate-400 text-[10px] block">Instrutor</span>
                        <span className="font-semibold">{professor ? professor.nome : 'Não atribuído'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <span className="text-slate-400 text-[10px] block">Horário da Aula</span>
                        <span className="font-semibold">{turma.horario || 'Não agendado'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <span className="text-slate-400 text-[10px] block">Instrumento</span>
                        <span className="font-semibold">🎻 {turma.instrumento}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student expandable listing toggle */}
                <div className="border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/10">
                  <button 
                    onClick={() => setExpandedTurmaId(isExpanded ? null : turma.id)}
                    className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer"
                  >
                    <span>👥 ALUNOS MATRICULADOS ({turma.alunosIds.length})</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-850 space-y-2 max-h-[180px] overflow-y-auto">
                      {turma.alunosIds.length === 0 ? (
                        <p className="text-xs text-slate-400 dark:text-slate-500 italic text-center py-2">
                          Nenhum aluno matriculado nesta turma ainda. Edite a turma para adicionar alunos.
                        </p>
                      ) : (
                        turma.alunosIds.map(alunoId => {
                          const alunoObj = pessoas.find(p => p.id === alunoId);
                          if (!alunoObj) return null;
                          return (
                            <div 
                              key={alunoId} 
                              className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800"
                            >
                              <div className="font-medium text-slate-700 dark:text-slate-300">
                                🎓 {alunoObj.nome}
                              </div>
                              <span className="text-[10px] text-slate-400">
                                {alunoObj.status}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NEW/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {selectedTurma ? 'Editar Turma' : 'Cadastrar Nova Turma de Ensino'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Nome da Turma / Classe *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Violino - Iniciante B" 
                  className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Instrumento da Aula *</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formInstrumento}
                    onChange={(e) => setFormInstrumento(e.target.value)}
                  >
                    {INSTRUMENTOS_PREDEFINIDOS.map(inst => (
                      <option key={inst.nome} value={inst.nome}>
                        {inst.nome}{'observacao' in inst && inst.observacao ? ` (${inst.observacao})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Nível Técnico *</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formNivel}
                    onChange={(e) => setFormNivel(e.target.value as any)}
                  >
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Professor Responsável *</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formProfessorId}
                    onChange={(e) => setFormProfessorId(e.target.value)}
                  >
                    <option key="none-prof" value="" disabled>Selecione o Professor</option>
                    {professores.map(prof => (
                      <option key={prof.id} value={prof.id}>{prof.nome} ({prof.instrumento})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Horário da Aula * (Aulas de Música: Sábados 11:00 às 14:00)
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Sábado - 11:00 às 12:30" 
                    className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formHorario}
                    onChange={(e) => setFormHorario(e.target.value)}
                  />
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400 font-semibold">Sugestões de janela oficial:</span>
                    <button
                      type="button"
                      onClick={() => setFormHorario('Sábado - 11:00 às 12:30')}
                      className="px-2 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 rounded-md text-[10px] font-medium transition-colors cursor-pointer"
                    >
                      Sábado - 11:00 às 12:30
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormHorario('Sábado - 12:30 às 14:00')}
                      className="px-2 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 rounded-md text-[10px] font-medium transition-colors cursor-pointer"
                    >
                      Sábado - 12:30 às 14:00
                    </button>
                  </div>
                </div>
              </div>

              {/* Schedule Validation Warning Banner */}
              {(() => {
                const check = validateTurmaHorario(formHorario);
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

              {/* Matricular Alunos checklist inside Form */}
              <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Matricular Alunos na Turma ({formAlunosIds.length} selecionados)
                </label>
                
                {alunosDisponiveis.length === 0 ? (
                  <p className="text-xs text-amber-500 font-medium py-2">
                    Não há alunos cadastrados. Cadastre alunos na aba 'Pessoas' primeiro!
                  </p>
                ) : (
                  <div className="max-h-[160px] overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl p-2 bg-slate-50 dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 space-y-1">
                    {alunosDisponiveis.map(aluno => {
                      const isSelected = formAlunosIds.includes(aluno.id);
                      return (
                        <div 
                          key={aluno.id}
                          onClick={() => toggleStudentSelection(aluno.id)}
                          className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all select-none text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{aluno.nome}</span>
                            <span className="text-[10px] text-slate-400">({aluno.instrumento})</span>
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
                  Salvar Turma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
