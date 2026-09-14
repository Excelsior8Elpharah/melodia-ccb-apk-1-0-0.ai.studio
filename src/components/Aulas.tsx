/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Aula, Turma, Pessoa, AvaliacaoAluno, MaterialCatalogo } from '../types';
import { usePrivacy } from '../context/PrivacyContext';
import { useAuth } from '../context/AuthContext';
import { logAuditEvent } from '../utils/auditLogger';
import { maskName } from '../utils/masking';
import OfficialCalendarBanner from './OfficialCalendarBanner';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  BookOpen, 
  Percent, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  SlidersHorizontal,
  CheckSquare,
  Square,
  Users,
  GraduationCap,
  Sparkles,
  ArrowUpDown,
  Search
} from 'lucide-react';

interface AulasProps {
  aulas: Aula[];
  turmas: Turma[];
  pessoas: Pessoa[];
  catalogo?: MaterialCatalogo[];
  onSave: (aula: Aula) => void;
  onDelete: (id: string) => void;
  toast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  key?: string;
}

export default function Aulas({ aulas, turmas, pessoas, catalogo = [], onSave, onDelete, toast }: AulasProps) {
  const { user } = useAuth();
  // Privacy Mode Context
  const { isPrivacyMode } = usePrivacy();

  // Main View Filters State
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Performance Pagination
  const PAGE_SIZE = 10;
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAula, setSelectedAula] = useState<Aula | null>(null);

  // Form State
  const [formTurmaId, setFormTurmaId] = useState('');
  const [formData, setFormData] = useState(() => new Date().toISOString().split('T')[0]);
  const [formConteudo, setFormConteudo] = useState('');
  const [formMaterial, setFormMaterial] = useState('');
  const [formFocusedAluno, setFormFocusedAluno] = useState('all');
  const [formPresencas, setFormPresencas] = useState<Record<string, boolean>>({});
  const [formAvaliacoes, setFormAvaliacoes] = useState<Record<string, AvaliacaoAluno>>({});
  const [expandedStudentEvalId, setExpandedStudentEvalId] = useState<string | null>(null);

  // Catalog selection state in modal
  const [selectedCatalogoId, setSelectedCatalogoId] = useState<string>('');

  // Active selected turma object in form
  const activeFormTurma = turmas.find(t => t.id === formTurmaId);

  // Filter catalog items relevant to the selected class in form
  const classStudents = (activeFormTurma?.alunosIds || []).map(id => pessoas.find(p => p.id === id)).filter(Boolean);
  const studentInstruments = new Set(classStudents.map(s => s?.instrumento).filter(Boolean));

  const catalogOptions = catalogo.filter(item => {
    if (item.instrumento === 'Geral') return true;
    if (studentInstruments.has(item.instrumento)) return true;
    if (activeFormTurma?.nome.toLowerCase().includes(item.instrumento.toLowerCase())) return true;
    return false;
  });

  const handleSelectCatalogItem = (catalogoId: string) => {
    setSelectedCatalogoId(catalogoId);
    if (!catalogoId) return;
    const item = catalogo.find(c => c.id === catalogoId);
    if (item) {
      let content = item.nome;
      if (item.metodo) content += ` (${item.metodo})`;
      setFormConteudo(content);
      if (!formMaterial || formMaterial === '') {
        setFormMaterial(item.nome);
      }
    }
  };

  // Handle opening modal
  const openFormModal = (aula: Aula | null = null, defaultTurmaId: string = '') => {
    setSelectedCatalogoId('');
    if (aula) {
      setSelectedAula(aula);
      setFormTurmaId(aula.turmaId);
      setFormData(aula.data);
      setFormConteudo(aula.conteudo);
      setFormMaterial(aula.material || '');
      setFormPresencas(aula.presencas || {});
      setFormAvaliacoes(aula.avaliacoes || {});
      
      const presents = Object.entries(aula.presencas || {}).filter(([_, isPres]) => isPres);
      if (presents.length === 1) {
        setFormFocusedAluno(presents[0][0]);
      } else {
        setFormFocusedAluno('all');
      }

      const firstPresentId = Object.entries(aula.presencas || {}).find(([_, isPres]) => isPres)?.[0] || null;
      setExpandedStudentEvalId(firstPresentId);
    } else {
      setSelectedAula(null);
      // Pre-select current filter turma if set, otherwise first turma
      const targetTurmaId = defaultTurmaId || selectedTurmaId || turmas[0]?.id || '';
      setFormTurmaId(targetTurmaId);
      setFormData(new Date().toISOString().split('T')[0]);
      setFormConteudo('');
      setFormMaterial('');
      setFormFocusedAluno('all');
      
      // Seed default presences for the selected class (all present)
      const targetTurmaObj = turmas.find(t => t.id === targetTurmaId);
      const initialPresences: Record<string, boolean> = {};
      const initialEvaluations: Record<string, AvaliacaoAluno> = {};
      if (targetTurmaObj) {
        targetTurmaObj.alunosIds.forEach(id => {
          initialPresences[id] = true;
          initialEvaluations[id] = { ritmo: 8, tecnica: 8, leitura: 8, expressao: 8, teoria: 8, observacao: '' };
        });
      }
      setFormPresencas(initialPresences);
      setFormAvaliacoes(initialEvaluations);
      
      const firstPresentId = targetTurmaObj?.alunosIds[0] || null;
      setExpandedStudentEvalId(firstPresentId);
    }
    setIsModalOpen(true);
  };

  // When class changes in modal, reset the attendance list with the new class members
  const handleTurmaChange = (turmaId: string) => {
    setFormTurmaId(turmaId);
    setFormFocusedAluno('all');
    const targetTurma = turmas.find(t => t.id === turmaId);
    const initialPresences: Record<string, boolean> = {};
    const initialEvaluations: Record<string, AvaliacaoAluno> = {};
    if (targetTurma) {
      targetTurma.alunosIds.forEach(id => {
        initialPresences[id] = true;
        initialEvaluations[id] = { ritmo: 8, tecnica: 8, leitura: 8, expressao: 8, teoria: 8, observacao: '' };
      });
    }
    setFormPresencas(initialPresences);
    setFormAvaliacoes(initialEvaluations);
    
    const firstPresentId = targetTurma?.alunosIds[0] || null;
    setExpandedStudentEvalId(firstPresentId);
  };

  // Toggle present/absent in modal
  const toggleAttendance = (alunoId: string) => {
    const nextIsPresent = !formPresencas[alunoId];
    setFormPresencas(prev => ({
      ...prev,
      [alunoId]: nextIsPresent
    }));
    
    if (nextIsPresent && !formAvaliacoes[alunoId]) {
      setFormAvaliacoes(prev => ({
        ...prev,
        [alunoId]: { ritmo: 8, tecnica: 8, leitura: 8, expressao: 8, teoria: 8, observacao: '' }
      }));
    }
  };

  // Quick inline toggle directly on class card
  const handleQuickInlineToggleAttendance = (aula: Aula, alunoId: string) => {
    if (user?.role === 'CONSULTA') {
      toast('Perfil Aluno tem acesso apenas de leitura da frequência.', 'info');
      return;
    }

    const updatedPresencas = {
      ...(aula.presencas || {}),
      [alunoId]: !(aula.presencas || {})[alunoId]
    };

    const isNowPresent = updatedPresencas[alunoId];
    const updatedAvaliacoes = { ...(aula.avaliacoes || {}) };

    if (isNowPresent && !updatedAvaliacoes[alunoId]) {
      updatedAvaliacoes[alunoId] = { ritmo: 8, tecnica: 8, leitura: 8, expressao: 8, teoria: 8, observacao: '' };
    }

    const updatedAula: Aula = {
      ...aula,
      presencas: updatedPresencas,
      avaliacoes: updatedAvaliacoes
    };

    onSave(updatedAula);

    const targetAluno = pessoas.find(p => p.id === alunoId);
    const alunoNome = targetAluno ? targetAluno.nome : 'Aluno';
    logAuditEvent(
      user,
      'ATTENDANCE_LOGGED',
      `Presença rápida de ${alunoNome} alterada para ${isNowPresent ? 'Presente' : 'Falta'} (Aula de ${aula.data}).`,
      alunoId,
      [{ campo: 'Presença', valorAntigo: !isNowPresent ? 'Presente' : 'Falta', valorNovo: isNowPresent ? 'Presente' : 'Falta' }]
    );

    toast(`Presença de ${(targetAluno?.nome.split(' ')[0] || 'aluno')} atualizada!`, 'info');
  };

  const handleUpdateGrade = (alunoId: string, criteria: keyof Omit<AvaliacaoAluno, 'observacao'>, score: number) => {
    setFormAvaliacoes(prev => {
      const currentEval = prev[alunoId] || { ritmo: 8, tecnica: 8, leitura: 8, expressao: 8, teoria: 8, observacao: '' };
      return {
        ...prev,
        [alunoId]: {
          ...currentEval,
          [criteria]: score
        }
      };
    });
  };

  const handleUpdateObservation = (alunoId: string, obs: string) => {
    setFormAvaliacoes(prev => {
      const currentEval = prev[alunoId] || { ritmo: 8, tecnica: 8, leitura: 8, expressao: 8, teoria: 8, observacao: '' };
      return {
        ...prev,
        [alunoId]: {
          ...currentEval,
          observacao: obs
        }
      };
    });
  };

  // Submit modal form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTurmaId) {
      toast('Por favor, selecione uma turma.', 'error');
      return;
    }
    if (!formConteudo.trim()) {
      toast('Por favor, descreva o conteúdo ensinado nesta aula.', 'error');
      return;
    }

    const finalPresencas: Record<string, boolean> = {};
    const finalAvaliacoes: Record<string, AvaliacaoAluno> = {};

    if (activeFormTurma) {
      activeFormTurma.alunosIds.forEach(id => {
        if (formFocusedAluno === 'all') {
          finalPresencas[id] = formPresencas[id] ?? true;
          if (finalPresencas[id]) {
            finalAvaliacoes[id] = formAvaliacoes[id] || { ritmo: 8, tecnica: 8, leitura: 8, expressao: 8, teoria: 8, observacao: '' };
          }
        } else {
          if (id === formFocusedAluno) {
            finalPresencas[id] = formPresencas[id] ?? true;
            if (finalPresencas[id]) {
              finalAvaliacoes[id] = formAvaliacoes[id] || { ritmo: 8, tecnica: 8, leitura: 8, expressao: 8, teoria: 8, observacao: '' };
            }
          } else {
            finalPresencas[id] = false;
            finalAvaliacoes[id] = { ritmo: 0, tecnica: 0, leitura: 0, expressao: 0, teoria: 0, observacao: 'Falta registrada (avaliação focada em outro aluno)' };
          }
        }
      });
    }

    const updatedAula: Aula = {
      id: selectedAula ? selectedAula.id : 'aul_' + Date.now().toString(),
      turmaId: formTurmaId,
      data: formData,
      conteudo: formConteudo.trim(),
      material: formMaterial.trim(),
      presencas: finalPresencas,
      avaliacoes: finalAvaliacoes
    };

    onSave(updatedAula);

    const presentsCount = Object.values(finalPresencas).filter(Boolean).length;
    const totalCount = Object.keys(finalPresencas).length;
    logAuditEvent(
      user,
      selectedAula ? 'GRADE_UPDATED' : 'ATTENDANCE_LOGGED',
      `Diário de aula (${formData}) da turma ${activeFormTurma?.nome || formTurmaId} gravado (${presentsCount}/${totalCount} presentes e notas).`,
      updatedAula.id
    );

    setIsModalOpen(false);
    toast(selectedAula ? 'Diário de classe atualizado!' : 'Nova aula registrada com frequência!', 'success');
  };

  // Role-based Access Control: Filter accessible turmas based on role & pessoaId
  const accessibleTurmas = useMemo(() => {
    if (user?.role === 'CONSULTA' && user?.pessoaId) {
      // Aluno vê estritamente as turmas em que está matriculado
      return turmas.filter(t => t.alunosIds.includes(user.pessoaId!));
    }
    if (user?.role === 'INSTRUTOR' && user?.pessoaId) {
      // Instrutor vê estritamente as turmas sob sua docência
      return turmas.filter(t => t.professorId === user.pessoaId);
    }
    return turmas;
  }, [turmas, user]);

  const accessibleTurmaIds = useMemo(() => {
    return new Set(accessibleTurmas.map(t => t.id));
  }, [accessibleTurmas]);

  // Filtering & Sorting Lessons with Memoization
  const filteredAulas = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return aulas.filter(aula => {
      // Regra de Isolamento: Apenas aulas de turmas que o usuário tem permissão
      if (!accessibleTurmaIds.has(aula.turmaId)) {
        return false;
      }
      // Turma filter
      if (selectedTurmaId && aula.turmaId !== selectedTurmaId) {
        return false;
      }
      // Start Date filter
      if (startDate && aula.data < startDate) {
        return false;
      }
      // End Date filter
      if (endDate && aula.data > endDate) {
        return false;
      }
      // Search term filter
      if (term) {
        const matchesContent = aula.conteudo.toLowerCase().includes(term);
        const matchesMaterial = aula.material?.toLowerCase().includes(term);
        const turmaObj = turmas.find(t => t.id === aula.turmaId);
        const matchesTurma = turmaObj?.nome.toLowerCase().includes(term);
        if (!matchesContent && !matchesMaterial && !matchesTurma) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const timeA = new Date(a.data).getTime();
      const timeB = new Date(b.data).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [aulas, accessibleTurmaIds, selectedTurmaId, startDate, endDate, searchTerm, sortOrder, turmas]);

  // Paginated Slice
  const visibleAulas = useMemo(() => {
    return filteredAulas.slice(0, visibleCount);
  }, [filteredAulas, visibleCount]);

  // Helper to format dates
  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6" id="aulas-tab-container">
      {/* Official Congregation & Orchestra Calendar Banner */}
      <OfficialCalendarBanner compact={false} />

      {/* 1. Header and Primary Controls Panel */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Diário de Aula & Frequência</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Organizado por turma no formato de diário de classe. Registre conteúdos, acompanhe a chamada visual e avalie o desenvolvimento dos alunos.
          </p>
        </div>

        {user?.role !== 'CONSULTA' && (
          <button 
            onClick={() => {
              if (turmas.length === 0) {
                toast('Você precisa cadastrar uma turma antes de registrar aulas.', 'error');
                return;
              }
              openFormModal(null, selectedTurmaId);
            }}
            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl transition-all flex items-center gap-2 text-xs font-bold shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nova Aula</span>
          </button>
        )}
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 shrink-0 mr-1">
          <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Filtros do Diário:</span>
        </div>

        {/* Search input */}
        <div className="flex-1 min-w-[180px] relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por conteúdo/material..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="w-full py-2 pl-8 pr-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Turma Dropdown Filter */}
        <div className="flex-1 min-w-[180px]">
          <select
            value={selectedTurmaId}
            onChange={(e) => {
              setSelectedTurmaId(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">🏫 {user?.role === 'CONSULTA' ? 'Minhas Turmas' : 'Todas as Turmas'} ({accessibleTurmas.length})</option>
            {accessibleTurmas.map(t => (
              <option key={t.id} value={t.id}>
                🏫 {t.nome} ({t.alunosIds.length} alunos)
              </option>
            ))}
          </select>
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            title="Data Inicial"
            placeholder="De"
            className="py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-xs font-bold text-slate-400">até</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            title="Data Final"
            placeholder="Até"
            className="py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
          />
        </div>

        {/* Ordering Selector */}
        <div className="shrink-0">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
            className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="desc">📅 Mais recentes primeiro</option>
            <option value="asc">📅 Mais antigas primeiro</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(selectedTurmaId || startDate || endDate) && (
          <button
            onClick={() => {
              setSelectedTurmaId('');
              setStartDate('');
              setEndDate('');
            }}
            className="py-2 px-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            Limpar Filtros
          </button>
        )}
      </div>

      {/* Selected Turma Banner Summary (When a class is selected) */}
      {selectedTurmaId && (() => {
        const activeTurmaObj = turmas.find(t => t.id === selectedTurmaId);
        if (!activeTurmaObj) return null;
        const activeProf = pessoas.find(p => p.id === activeTurmaObj.professorId);
        const classAulas = aulas.filter(a => a.turmaId === selectedTurmaId);

        return (
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-blue-800/50 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 font-bold text-lg shrink-0">
                🏫
              </div>
              <div>
                <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>{activeTurmaObj.nome}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                    {activeTurmaObj.alunosIds.length} Alunos
                  </span>
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Professor: <strong className="text-white">{activeProf?.nome || 'Não definido'}</strong> &bull; Horário: {activeTurmaObj.horario || 'A definir'} &bull; Aulas registradas: <strong className="text-white">{classAulas.length}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => openFormModal(null, selectedTurmaId)}
              className="py-2 px-3.5 bg-blue-500 hover:bg-blue-400 text-slate-950 font-extrabold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Registrar Aula nesta Turma</span>
            </button>
          </div>
        );
      })()}

      {/* 3. Cards Container for Lessons (Diário de Classe) */}
      {filteredAulas.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-1">Nenhum diário de aula encontrado</h4>
          <p className="text-sm text-slate-400 dark:text-slate-500 max-w-md mx-auto">
            {selectedTurmaId 
              ? 'Nenhuma aula registrada para a turma selecionada com estes filtros.' 
              : 'Comece a registrar as aulas e a chamada dos alunos para calcular as médias de presença e rendimento.'}
          </p>
          <div className="mt-4 flex justify-center gap-3">
            {(selectedTurmaId || startDate || endDate) && (
              <button
                onClick={() => {
                  setSelectedTurmaId('');
                  setStartDate('');
                  setEndDate('');
                }}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
              >
                Limpar Filtros
              </button>
            )}
            <button 
              onClick={() => openFormModal(null, selectedTurmaId)}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
            >
              + Nova Aula
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-5" id="aulas-cards-grid">
            {visibleAulas.map(aula => {
              const turma = turmas.find(t => t.id === aula.turmaId);
              const professor = turma ? pessoas.find(p => p.id === turma.professorId) : null;
            
            // Student list registered in this class
            const turmaAlunosIds = turma?.alunosIds || Object.keys(aula.presencas || {});
            const totalAlunos = turmaAlunosIds.length;
            const presentesCount = turmaAlunosIds.filter(id => (aula.presencas || {})[id] === true).length;
            const ausentesCount = totalAlunos - presentesCount;
            const rate = totalAlunos > 0 ? Math.round((presentesCount / totalAlunos) * 100) : 0;

            let rateBadgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
            if (rate < 50) {
              rateBadgeColor = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/60';
            } else if (rate < 80) {
              rateBadgeColor = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
            }

            return (
              <div 
                key={aula.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all overflow-hidden"
              >
                {/* Card Top Banner Header */}
                <div className="bg-slate-50/80 dark:bg-slate-850/60 p-4 border-b border-slate-200/80 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-3 py-1 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-2xs flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDateBR(aula.data)}</span>
                    </span>

                    <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-extrabold text-xs rounded-xl flex items-center gap-1.5">
                      <span>🏫</span>
                      <span>{turma ? turma.nome : 'Turma Removida'}</span>
                    </span>

                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                      <span>👨‍🏫</span>
                      <span>{professor ? professor.nome : 'Prof. Não Definido'}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border flex items-center gap-1 ${rateBadgeColor}`}>
                      <span>{rate >= 75 ? '🟢' : rate >= 50 ? '🟡' : '🔴'}</span>
                      <span>{rate}% Presença ({presentesCount}/{totalAlunos})</span>
                    </span>
                  </div>
                </div>

                {/* Card Main Body */}
                <div className="p-5 space-y-4">
                  {/* Content Taught */}
                  <div className="bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 p-3.5 rounded-xl">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Conteúdo da Aula:</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                      {aula.conteudo || 'Sem conteúdo cadastrado.'}
                    </p>
                    {aula.material && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-1.5 pt-1.5 border-t border-blue-100/60 dark:border-blue-900/30">
                        📦 <span className="font-bold">Material de Apoio:</span> {aula.material}
                      </p>
                    )}
                  </div>

                  {/* Chamada Visual (Roll Call Section with Checkboxes) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>
                          {user?.role === 'CONSULTA' && user?.pessoaId
                            ? 'Minha Presença & Avaliação Individual'
                            : `Lista de Chamada (${presentesCount} Presentes • ${ausentesCount} Faltas)`}
                        </span>
                      </span>
                      <span className="text-[10px] text-slate-400 italic">
                        {user?.role === 'CONSULTA'
                          ? 'Acesso individual do aluno (somente seus dados)'
                          : 'Clique no checkbox para alterar presença diretamente'}
                      </span>
                    </div>

                    {(() => {
                      const displayedAlunosIds = (user?.role === 'CONSULTA' && user?.pessoaId)
                        ? turmaAlunosIds.filter(id => id === user.pessoaId)
                        : turmaAlunosIds;

                      if (displayedAlunosIds.length === 0) {
                        return (
                          <p className="text-xs text-slate-400 italic py-2">
                            {user?.role === 'CONSULTA'
                              ? 'Você não estava matriculado nesta chamada.'
                              : 'Nenhum aluno cadastrado nesta turma.'}
                          </p>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                          {displayedAlunosIds.map(alunoId => {
                            const alunoObj = pessoas.find(p => p.id === alunoId);
                            if (!alunoObj) return null;

                            const isPresent = (aula.presencas || {})[alunoId] === true;
                            const studentEval = (aula.avaliacoes || {})[alunoId];

                            let avgScore = null;
                            if (studentEval && isPresent) {
                              const scores = [studentEval.ritmo, studentEval.tecnica, studentEval.leitura, studentEval.expressao, studentEval.teoria].filter(s => typeof s === 'number' && s > 0);
                              if (scores.length > 0) {
                                avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
                              }
                            }

                            return (
                              <div
                                key={alunoId}
                                onClick={() => {
                                  if (user?.role !== 'CONSULTA') {
                                    handleQuickInlineToggleAttendance(aula, alunoId);
                                  }
                                }}
                                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                                  user?.role !== 'CONSULTA' ? 'cursor-pointer' : 'cursor-default'
                                } ${
                                  isPresent 
                                    ? 'bg-emerald-50/50 hover:bg-emerald-100/60 border-emerald-200/80 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 dark:border-emerald-800/50' 
                                    : 'bg-rose-50/40 hover:bg-rose-100/50 border-rose-200/70 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 dark:border-rose-800/40'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <button
                                    type="button"
                                    disabled={user?.role === 'CONSULTA'}
                                    className={`focus:outline-none shrink-0 ${user?.role !== 'CONSULTA' ? 'cursor-pointer' : 'cursor-default'}`}
                                  >
                                    {isPresent ? (
                                      <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                                    ) : (
                                      <Square className="w-4 h-4 text-rose-400 dark:text-rose-500" />
                                    )}
                                  </button>

                                  <div className="min-w-0">
                                    <span className={`text-xs font-extrabold block truncate ${
                                      isPresent 
                                        ? 'text-slate-800 dark:text-slate-100' 
                                        : 'text-rose-700 dark:text-rose-400 line-through opacity-80'
                                    }`}>
                                      {maskName(alunoObj.nome, isPrivacyMode)}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block truncate">
                                      {alunoObj.instrumento || 'Aluno'}
                                    </span>
                                  </div>
                                </div>

                                <div className="shrink-0 flex items-center gap-1">
                                  {avgScore && isPresent && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                                      ★ {avgScore}
                                    </span>
                                  )}
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    isPresent ? 'bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200' : 'bg-rose-200/60 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200'
                                  }`}>
                                    {isPresent ? 'Presente' : 'Falta'}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Card Footer Action Bar */}
                <div className="px-5 py-3 bg-slate-50/60 dark:bg-slate-850/40 border-t border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    Diário ID: <code className="font-mono text-[10px]">{aula.id}</code>
                  </span>

                  {user?.role !== 'CONSULTA' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openFormModal(aula)}
                        className="py-1.5 px-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Editar Diário & Notas</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Excluir esta aula do dia ${formatDateBR(aula.data)}? Os registros de frequência serão removidos.`)) {
                            onDelete(aula.id);
                            toast('Aula removida com sucesso.', 'info');
                          }
                        }}
                        className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      Modo Aluno (Somente Leitura)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Pagination Button */}
        {visibleCount < filteredAulas.length && (
          <div className="pt-2 text-center">
            <button
              onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
              className="py-2.5 px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              ⚡ Carregar mais 10 aulas ({filteredAulas.length - visibleCount} restantes)
            </button>
          </div>
        )}
      </div>
      )}

      {/* 4. NEW/EDIT LESSON FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>{selectedAula ? 'Editar Diário de Aula' : 'Lançar Novo Diário de Aula'}</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Selecione a Turma *</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    value={formTurmaId}
                    onChange={(e) => handleTurmaChange(e.target.value)}
                    disabled={!!selectedAula}
                  >
                    {turmas.map(t => (
                      <option key={t.id} value={t.id}>🏫 {t.nome} ({t.alunosIds.length} alunos)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Data da Aula *</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    value={formData}
                    onChange={(e) => setFormData(e.target.value)}
                  />
                </div>
              </div>

              {/* Material do Catálogo Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Material do Catálogo</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold normal-case">Preenchimento automático</span>
                </label>
                <select
                  className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  value={selectedCatalogoId}
                  onChange={(e) => handleSelectCatalogItem(e.target.value)}
                >
                  <option key="no-cat" value="">-- Selecione um material do catálogo (opcional) --</option>
                  {catalogOptions.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.tipo === 'Teoria' ? '📘' : item.tipo === 'Técnica' ? '🎯' : '📖'} [{item.tipo}] {item.nome} {item.instrumento !== 'Geral' ? `(${item.instrumento})` : '(Geral)'} - Fase {item.fase}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Conteúdo Lecionado *</label>
                <textarea 
                  rows={2}
                  required
                  placeholder="Ex: Exercícios de articulação e andamento nos compassos compostos. Leitura conjunta da partitura do hino oficial." 
                  className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 resize-none"
                  value={formConteudo}
                  onChange={(e) => setFormConteudo(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Material Utilizado</label>
                  <input
                    type="text"
                    placeholder="Ex: Partitura, metrônomo, playback"
                    className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    value={formMaterial}
                    onChange={(e) => setFormMaterial(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Focar em Aluno (Avaliação Individual)</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    value={formFocusedAluno}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormFocusedAluno(val);
                      if (val !== 'all') {
                        setExpandedStudentEvalId(val);
                      }
                    }}
                  >
                    <option key="all-students" value="all">👥 Todos os Alunos</option>
                    {activeFormTurma?.alunosIds.map(id => {
                      const student = pessoas.find(p => p.id === id);
                      return <option key={id} value={id}>👤 {student?.nome || id}</option>;
                    })}
                  </select>
                </div>
              </div>

              {formFocusedAluno !== 'all' ? (
                // Focused Single Student Evaluation Card
                <div className="border-t border-slate-100 dark:border-slate-700 pt-4 space-y-4">
                  {(() => {
                    const studentObj = pessoas.find(p => p.id === formFocusedAluno);
                    if (!studentObj) return null;
                    const isPresent = formPresencas[formFocusedAluno] ?? true;
                    const evalObj = formAvaliacoes[formFocusedAluno] || { ritmo: 8, tecnica: 8, leitura: 8, expressao: 8, teoria: 8, observacao: '' };

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3.5 rounded-xl border bg-blue-50/20 border-blue-100 dark:bg-blue-950/10 dark:border-blue-900/40">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-bold text-sm flex items-center justify-center uppercase">
                              {studentObj.nome.substring(0, 1)}
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 block leading-tight">
                                {studentObj.nome}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                🎻 {studentObj.instrumento}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleAttendance(formFocusedAluno)}
                            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${isPresent ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                          >
                            {isPresent ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>PRESENTE</span>
                              </>
                            ) : (
                              <>
                                <X className="w-3.5 h-3.5 stroke-[3]" />
                                <span>AUSENTE</span>
                              </>
                            )}
                          </button>
                        </div>

                        {isPresent && (
                          <div className="bg-slate-50/50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4">
                            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Avaliação de Competências (0 a 10)
                            </h4>
                            {([
                              { key: 'ritmo', label: 'Ritmo / Tempo' },
                              { key: 'tecnica', label: 'Técnica Instrumento' },
                              { key: 'leitura', label: 'Leitura Musical' },
                              { key: 'expressao', label: 'Expressão / Dinâmica' },
                              { key: 'teoria', label: 'Teoria Musical' }
                            ] as const).map(criteria => {
                              const currentScore = evalObj[criteria.key] || 8;

                              return (
                                <div key={criteria.key} className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                      {criteria.label}
                                    </span>
                                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md">
                                      {currentScore} / 10
                                    </span>
                                  </div>

                                  <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                                    {Array.from({ length: 10 }, (_, i) => i + 1).map(val => {
                                      const isSelected = currentScore === val;
                                      return (
                                        <button
                                          key={val}
                                          type="button"
                                          onClick={() => handleUpdateGrade(formFocusedAluno, criteria.key, val)}
                                          className={`w-7.5 h-7.5 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                                            isSelected 
                                              ? 'bg-blue-600 text-white shadow-xs dark:bg-blue-500' 
                                              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/60'
                                          }`}
                                        >
                                          {val}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}

                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                Anotação / Observação sobre o Aluno
                              </label>
                              <input
                                type="text"
                                placeholder="Ex: Excelente afinação, mas atenção ao ritmo no compasso 8."
                                value={evalObj.observacao || ''}
                                onChange={(e) => handleUpdateObservation(formFocusedAluno, e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900/35 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                // All-Students Attendance Checklist
                <>
                  <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                      Lista de Chamada (Marcar Presentes)
                    </label>

                    {!activeFormTurma || activeFormTurma.alunosIds.length === 0 ? (
                      <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2 text-center">
                        Não há alunos matriculados nesta turma.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                        {activeFormTurma.alunosIds.map(alunoId => {
                          const studentObj = pessoas.find(p => p.id === alunoId);
                          if (!studentObj) return null;
                          
                          const isPresent = formPresencas[alunoId] ?? true;

                          return (
                            <div 
                              key={alunoId}
                              onClick={() => toggleAttendance(alunoId)}
                              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${isPresent ? 'bg-emerald-50/40 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/40' : 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800'}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs uppercase ${isPresent ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                                  {studentObj.nome.substring(0, 1)}
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block leading-tight">
                                    {studentObj.nome}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {studentObj.instrumento || 'Sem instrumento'}
                                  </span>
                                </div>
                              </div>

                              <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${isPresent ? 'bg-emerald-500 text-white shadow-2xs' : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                {isPresent ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    <span>PRESENTE</span>
                                  </>
                                ) : (
                                  <>
                                    <X className="w-3.5 h-3.5 stroke-[3]" />
                                    <span>AUSENTE</span>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Accordion for individual student evaluations */}
                  <div className="border-t border-slate-100 dark:border-slate-700 pt-4" id="individual-evaluations-section">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                      Avaliações dos Alunos Presentes
                    </label>

                    {Object.entries(formPresencas).filter(([_, isPres]) => isPres).length === 0 ? (
                      <p className="text-xs text-slate-400 dark:text-slate-500 italic py-3 text-center bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                        Nenhum aluno marcado como presente nesta aula.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {Object.entries(formPresencas)
                          .filter(([_, isPres]) => isPres)
                          .map(([alunoId]) => {
                            const studentObj = pessoas.find(p => p.id === alunoId);
                            if (!studentObj) return null;

                            const isExpanded = expandedStudentEvalId === alunoId;
                            const evalObj = formAvaliacoes[alunoId] || { ritmo: 8, tecnica: 8, leitura: 8, expressao: 8, teoria: 8, observacao: '' };

                            return (
                              <div 
                                key={alunoId}
                                className="bg-slate-50/50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
                              >
                                <button
                                  type="button"
                                  onClick={() => setExpandedStudentEvalId(isExpanded ? null : alunoId)}
                                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/55 transition-all cursor-pointer"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center uppercase">
                                      {studentObj.nome.substring(0, 1)}
                                    </div>
                                    <div className="min-w-0">
                                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block truncate">
                                        {studentObj.nome}
                                      </span>
                                      <span className="text-[10px] text-slate-400 block">
                                        🎻 {studentObj.instrumento}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                      Média: {((evalObj.ritmo + evalObj.tecnica + evalObj.leitura + evalObj.expressao + evalObj.teoria) / 5).toFixed(1)}
                                    </span>
                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                  </div>
                                </button>

                                {isExpanded && (
                                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
                                    {([
                                      { key: 'ritmo', label: 'Ritmo / Tempo' },
                                      { key: 'tecnica', label: 'Técnica Instrumento' },
                                      { key: 'leitura', label: 'Leitura Musical' },
                                      { key: 'expressao', label: 'Expressão / Dinâmica' },
                                      { key: 'teoria', label: 'Teoria Musical' }
                                    ] as const).map(criteria => {
                                      const currentScore = evalObj[criteria.key] || 8;

                                      return (
                                        <div key={criteria.key} className="space-y-1.5">
                                          <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                              {criteria.label}
                                            </span>
                                            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md">
                                              {currentScore} / 10
                                            </span>
                                          </div>

                                          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                                            {Array.from({ length: 10 }, (_, i) => i + 1).map(val => {
                                              const isSelected = currentScore === val;
                                              return (
                                                <button
                                                  key={val}
                                                  type="button"
                                                  onClick={() => handleUpdateGrade(alunoId, criteria.key, val)}
                                                  className={`w-7.5 h-7.5 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                                                    isSelected 
                                                      ? 'bg-blue-600 text-white shadow-2xs dark:bg-blue-500' 
                                                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/60'
                                                  }`}
                                                >
                                                  {val}
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      );
                                    })}

                                    <div className="space-y-1.5">
                                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Observação do Aluno
                                      </label>
                                      <input
                                        type="text"
                                        placeholder="Ex: Teve excelente postura, mas tropeçou no compasso 12."
                                        value={evalObj.observacao || ''}
                                        onChange={(e) => handleUpdateObservation(alunoId, e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900/35 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Salvar Diário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
