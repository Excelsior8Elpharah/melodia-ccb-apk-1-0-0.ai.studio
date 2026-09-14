/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Pessoa, Aula, Turma, DiarioRegistro } from '../types';
import MusicalWatermark from './MusicalWatermark';
import { INSTRUMENTOS_PREDEFINIDOS } from '../data/mockData';
import { usePrivacy } from '../context/PrivacyContext';
import { maskName, maskPhone, maskEmail, maskText } from '../utils/masking';
import { LGPDConsentModal } from './LGPDConsentModal';
import { LGPDStatusBadge } from './LGPDStatusBadge';
import { DeleteStudentDialog } from './DeleteStudentDialog';
import { ConsentRecord } from '../types/lgpd';
import { useAuth } from '../context/AuthContext';
import { logAuditEvent } from '../utils/auditLogger';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Eye,
  User,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Award,
  BookOpen,
  Clock,
  ShieldCheck,
  UserX
} from 'lucide-react';

interface PessoasProps {
  pessoas: Pessoa[];
  aulas: Aula[];
  turmas: Turma[];
  diarios?: DiarioRegistro[];
  onSave: (pessoa: Pessoa) => void;
  onDelete: (id: string) => void;
  onSaveDiario?: (diario: DiarioRegistro) => void;
  onDeleteDiario?: (id: string) => void;
  toast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  key?: string;
}

export default function Pessoas({ 
  pessoas, 
  aulas, 
  turmas, 
  diarios = [], 
  onSave, 
  onDelete, 
  onSaveDiario, 
  onDeleteDiario, 
  toast 
}: PessoasProps) {
  const { user } = useAuth();
  // Privacy Mode Context
  const { isPrivacyMode } = usePrivacy();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'Todos' | 'Musico' | 'Aluno' | 'Professor'>('Todos');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Ativo' | 'Afastado' | 'Em Observação'>('Todos');

  // Performance Pagination
  const PAGE_SIZE = 15;
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPessoa, setSelectedPessoa] = useState<Pessoa | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'charts' | 'lessons' | 'diario'>('charts');

  // LGPD Consent & Anonymization State
  const [lgpdModalStudent, setLgpdModalStudent] = useState<Pessoa | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Pessoa | null>(null);

  const checkIsMinor = (birthDateString?: string): boolean => {
    if (!birthDateString) return true; // Segurança: assume menor se não informado
    const birth = new Date(birthDateString);
    if (isNaN(birth.getTime())) return true;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age < 18;
  };

  const handleSaveConsent = (consent: ConsentRecord) => {
    if (!lgpdModalStudent) return;
    const updated: Pessoa = {
      ...lgpdModalStudent,
      lgpdConsent: consent,
    };
    onSave(updated);
    if (selectedPessoa && selectedPessoa.id === updated.id) {
      setSelectedPessoa(updated);
    }
    logAuditEvent(
      user,
      'LGPD_CONSENT_REGISTERED',
      `Consentimento LGPD concedido para ${updated.nome} (Responsável: ${consent.nomeResponsavelLegal || 'Próprio'}).`,
      updated.id
    );
    toast('Termo de Consentimento LGPD registrado com sucesso!', 'success');
    setLgpdModalStudent(null);
  };

  const handleUpdateAnonymizedStudent = (updated: Pessoa) => {
    onSave(updated);
    if (selectedPessoa && selectedPessoa.id === updated.id) {
      setSelectedPessoa(updated);
    }
    logAuditEvent(
      user,
      'STUDENT_ANONYMIZED',
      `Dados pessoais do aluno anonimizados conforme Art. 18 da LGPD (ID: ${updated.id}).`,
      updated.id
    );
    toast('Dados do aluno anonimizados com sucesso conforme Artigo 18 da LGPD.', 'info');
    setDeletingStudent(null);
  };

  const handleHardDeleteStudent = (id: string) => {
    const student = pessoas.find(p => p.id === id);
    onDelete(id);
    logAuditEvent(
      user,
      'STUDENT_DELETED',
      `Exclusão permanente do registro: ${student ? student.nome : id}.`,
      id
    );
    toast('Registro excluído permanentemente.', 'success');
    setDeletingStudent(null);
    if (selectedPessoa && selectedPessoa.id === id) {
      setIsViewModalOpen(false);
    }
  };

  // Student Diary form states
  const [isDiarioFormOpen, setIsDiarioFormOpen] = useState(false);
  const [editingDiarioId, setEditingDiarioId] = useState<string | null>(null);
  const [diarioData, setDiarioData] = useState(new Date().toISOString().split('T')[0]);
  const [diarioDuracao, setDiarioDuracao] = useState<number>(45);
  const [diarioConteudo, setDiarioConteudo] = useState('');
  const [diarioDesempenho, setDiarioDesempenho] = useState('');
  const [diarioTarefaCasa, setDiarioTarefaCasa] = useState('');
  const [diarioMaterial, setDiarioMaterial] = useState('');
  const [diarioObjetivo, setDiarioObjetivo] = useState('');

  const resetDiarioForm = () => {
    setDiarioData(new Date().toISOString().split('T')[0]);
    setDiarioDuracao(45);
    setDiarioConteudo('');
    setDiarioDesempenho('');
    setDiarioTarefaCasa('');
    setDiarioMaterial('');
    setDiarioObjetivo('');
    setEditingDiarioId(null);
    setIsDiarioFormOpen(false);
  };

  const handleEditDiario = (entry: DiarioRegistro) => {
    setDiarioData(entry.data);
    setDiarioDuracao(entry.duracaoMinutos);
    setDiarioConteudo(entry.conteudo);
    setDiarioDesempenho(entry.desempenho);
    setDiarioTarefaCasa(entry.tarefaCasa);
    setDiarioMaterial(entry.material || '');
    setDiarioObjetivo(entry.objetivo || '');
    setEditingDiarioId(entry.id);
    setIsDiarioFormOpen(true);
  };

  const handleSaveDiarioForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPessoa) return;
    if (!diarioData || !diarioConteudo.trim()) {
      toast('Preencha a data e o conteúdo estudado.', 'error');
      return;
    }

    const newOrUpdated: DiarioRegistro = {
      id: editingDiarioId || 'dr_' + Math.random().toString(36).substring(2, 9),
      alunoId: selectedPessoa.id,
      data: diarioData,
      conteudo: diarioConteudo,
      material: diarioMaterial,
      objetivo: diarioObjetivo,
      desempenho: diarioDesempenho,
      tarefaCasa: diarioTarefaCasa,
      duracaoMinutos: Number(diarioDuracao) || 30
    };

    if (onSaveDiario) {
      onSaveDiario(newOrUpdated);
      toast(editingDiarioId ? 'Registro do diário atualizado!' : 'Novo registro adicionado ao diário!', 'success');
      resetDiarioForm();
    } else {
      toast('Operação de salvar diário não disponível.', 'error');
    }
  };

  const handleDeleteDiarioEntry = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este registro do diário?')) {
      if (onDeleteDiario) {
        onDeleteDiario(id);
        toast('Registro removido do diário.', 'success');
        if (editingDiarioId === id) resetDiarioForm();
      }
    }
  };

  // Form State
  const [formNome, setFormNome] = useState('');
  const [formTipo, setFormTipo] = useState<'Musico' | 'Aluno' | 'Professor'>('Musico');
  const [formInstrumento, setFormInstrumento] = useState('Violino');
  const [formStatus, setFormStatus] = useState<'Ativo' | 'Afastado' | 'Em Observação'>('Ativo');
  const [formTelefone, setFormTelefone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDataNascimento, setFormDataNascimento] = useState('');
  const [formObservacoes, setFormObservacoes] = useState('');
  const [formFase, setFormFase] = useState<number>(1);

  // Calculations for Selected Student Profile (Etapa 2)
  const studentClasses = selectedPessoa ? turmas.filter(t => t.alunosIds.includes(selectedPessoa.id)) : [];
  const studentClassIds = studentClasses.map(t => t.id);
  const studentLessons = selectedPessoa ? aulas.filter(a => studentClassIds.includes(a.turmaId)) : [];
  
  // Attendance metrics
  const totalLessons = studentLessons.length;
  const presencasCount = studentLessons.filter(a => a.presencas[selectedPessoa?.id || ''] === true).length;
  const faltasCount = studentLessons.filter(a => a.presencas[selectedPessoa?.id || ''] === false).length;
  const attendanceRate = totalLessons > 0 ? Math.round((presencasCount / totalLessons) * 100) : 0;

  // Student detailed evaluations
  const studentEvaluations = selectedPessoa ? studentLessons
    .filter(a => a.presencas[selectedPessoa.id] === true && a.avaliacoes?.[selectedPessoa.id])
    .map(a => ({
      lessonId: a.id,
      date: a.data,
      content: a.conteudo,
      eval: a.avaliacoes![selectedPessoa.id]
    })) : [];

  // Student individual practice journal entries
  const studentDiarioEntries = selectedPessoa 
    ? (diarios || []).filter(d => d.alunoId === selectedPessoa.id).sort((a,b) => b.data.localeCompare(a.data))
    : [];

  // Heatmap generation helper (last 24 weeks)
  const getHeatmapData = () => {
    const today = new Date();
    // Start of the week (Sunday) 23 weeks ago
    const startDate = new Date();
    startDate.setDate(today.getDate() - (23 * 7) - today.getDay());
    
    const days: { dateStr: string; dateObj: Date; duration: number; entriesCount: number }[] = [];
    const dateCursor = new Date(startDate);
    
    // We want 24 weeks exactly (from Sunday to Saturday)
    const totalDays = 24 * 7;
    for (let i = 0; i < totalDays; i++) {
      const dateStr = dateCursor.toISOString().split('T')[0];
      
      // Calculate total practice duration on this day
      const dayEntries = studentDiarioEntries.filter(e => e.data === dateStr);
      const totalDuration = dayEntries.reduce((sum, e) => sum + e.duracaoMinutos, 0);
      
      days.push({
        dateStr,
        dateObj: new Date(dateCursor),
        duration: totalDuration,
        entriesCount: dayEntries.length
      });
      
      dateCursor.setDate(dateCursor.getDate() + 1);
    }
    
    return { days, startDate };
  };

  const { days: heatmapDays } = getHeatmapData();
  const weeks: typeof heatmapDays[] = [];
  for (let i = 0; i < heatmapDays.length; i += 7) {
    weeks.push(heatmapDays.slice(i, i + 7));
  }

  const getMonthLabel = (week: typeof heatmapDays) => {
    if (week.length === 0) return '';
    const firstDay = week[0].dateObj;
    if (firstDay.getDate() <= 7) {
      return firstDay.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').substring(0, 3);
    }
    return '';
  };

  // Calculate Criteria Averages
  const getCriteriaAverages = () => {
    if (studentEvaluations.length === 0) {
      return { ritmo: 0, tecnica: 0, leitura: 0, expressao: 0, teoria: 0, average: 0 };
    }
    let sumRitmo = 0, sumTecnica = 0, sumLeitura = 0, sumExpressao = 0, sumTeoria = 0;
    studentEvaluations.forEach(item => {
      sumRitmo += item.eval.ritmo;
      sumTecnica += item.eval.tecnica;
      sumLeitura += item.eval.leitura;
      sumExpressao += item.eval.expressao;
      sumTeoria += item.eval.teoria;
    });
    const count = studentEvaluations.length;
    const ritmo = parseFloat((sumRitmo / count).toFixed(1));
    const tecnica = parseFloat((sumTecnica / count).toFixed(1));
    const leitura = parseFloat((sumLeitura / count).toFixed(1));
    const expressao = parseFloat((sumExpressao / count).toFixed(1));
    const teoria = parseFloat((sumTeoria / count).toFixed(1));
    const average = parseFloat(((ritmo + tecnica + leitura + expressao + teoria) / 5).toFixed(1));
    return { ritmo, tecnica, leitura, expressao, teoria, average };
  };

  const averages = getCriteriaAverages();

  // -------------------------------------------------------------
  // CALCULATIONS FOR PASSO 5: STUDY DURATION VS PERFORMANCE
  // -------------------------------------------------------------
  const durationVsPerformanceData = studentEvaluations.map(item => {
    const evalDate = new Date(item.date + 'T12:00:00');
    
    // Sum practice minutes in the 7 days prior to (and including) the evaluation date
    const relevantDiarios = studentDiarioEntries.filter(entry => {
      const entryDate = new Date(entry.data + 'T12:00:00');
      const diffTime = evalDate.getTime() - entryDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 7;
    });
    
    const totalPracticeDuration = relevantDiarios.reduce((sum, entry) => sum + entry.duracaoMinutos, 0);
    const averageGrade = (item.eval.ritmo + item.eval.tecnica + item.eval.leitura + item.eval.expressao + item.eval.teoria) / 5;
    
    return {
      date: item.date,
      duration: totalPracticeDuration,
      score: parseFloat(averageGrade.toFixed(1)),
      content: item.content
    };
  });

  const calculateLocalPearsonCorrelation = (data: { duration: number; score: number }[]) => {
    const n = data.length;
    if (n < 2) return 0;
    const x = data.map(d => d.duration);
    const y = data.map(d => d.score);
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
    const sumY2 = y.reduce((sum, val) => sum + val * val, 0);

    const num = n * sumXY - xSumY(x, y, n, sumX, sumY);
    function xSumY(x: number[], y: number[], n: number, sumX: number, sumY: number) {
      return sumX * sumY;
    }
    const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    if (den === 0) return 0;
    return parseFloat((num / den).toFixed(2));
  };

  const localR = calculateLocalPearsonCorrelation(durationVsPerformanceData);

  const getLocalPearsonInterpretation = (r: number, hasData: boolean) => {
    if (!hasData) {
      return {
        label: 'Aguardando Dados',
        color: 'text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10',
        desc: 'Adicione registros de prática no diário e avaliações de aula para analisar a eficácia dos estudos.'
      };
    }
    if (r >= 0.5) {
      return {
        label: 'Eficácia Alta',
        color: 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-950/10',
        desc: 'Seu estudo individual está diretamente ligado a melhores notas! Continue mantendo a rotina.'
      };
    } else if (r >= 0.25) {
      return {
        label: 'Eficácia Moderada',
        color: 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/10',
        desc: 'O tempo de estudo em casa está ajudando suas notas, mas explore focar mais na qualidade técnica.'
      };
    } else if (r > -0.2) {
      return {
        label: 'Independência Estável',
        color: 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10',
        desc: 'Desempenho estável. Adicione mais sessões de treino para analisar o impacto do estudo focado.'
      };
    } else {
      return {
        label: 'Eficácia em Ajuste',
        color: 'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-950/10',
        desc: 'Atenção: muito tempo estudando sem melhoria nas notas. Peça orientação ao professor para ajustar a técnica.'
      };
    }
  };

  const localInterpretation = getLocalPearsonInterpretation(localR, durationVsPerformanceData.length > 0 && studentDiarioEntries.length > 0);

  // Radar helpers
  const criteriaKeys = ['ritmo', 'tecnica', 'leitura', 'expressao', 'teoria'] as const;
  const criteriaLabels = ['Ritmo', 'Técnica', 'Leitura', 'Expressão', 'Teoria'];

  const centerX = 130;
  const centerY = 130;
  const maxRadius = 90;

  // Coordinate helper for a single index i at a given score (0-10)
  const getCoordinates = (index: number, score: number) => {
    const angle = (index * 2 * Math.PI / 5) - Math.PI / 2;
    const r = maxRadius * (score / 10);
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return { x, y };
  };

  // Outer labels coordinate helper (slightly larger radius for labels positioning)
  const getLabelCoordinates = (index: number) => {
    const angle = (index * 2 * Math.PI / 5) - Math.PI / 2;
    const r = maxRadius + 22; // offset for text labels
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return { x, y };
  };

  const getTextAnchor = (idx: number) => {
    if (idx === 0) return 'middle';
    if (idx === 1 || idx === 2) return 'start';
    return 'end'; // 3 and 4
  };

  const levels = [2, 4, 6, 8, 10];
  const dataPoints = criteriaKeys.map((key, idx) => {
    const score = averages[key] || 0;
    const { x, y } = getCoordinates(idx, score);
    return `${x},${y}`;
  }).join(' ');

  // Line Chart helpers
  const chartWidth = 320;
  const chartHeight = 140;
  const paddingLeft = 25;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 20;

  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  const getLineX = (index: number, count: number) => {
    if (count <= 1) return paddingLeft + plotWidth / 2;
    return paddingLeft + (index / (count - 1)) * plotWidth;
  };

  const getLineY = (score: number) => {
    return paddingTop + plotHeight - (score / 10) * plotHeight;
  };

  const gridLevels = [5, 7.5, 10];
  const chronologicalEvaluations = [...studentEvaluations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const pathPoints = chronologicalEvaluations.map((item, idx) => {
    const itemAverage = (item.eval.ritmo + item.eval.tecnica + item.eval.leitura + item.eval.expressao + item.eval.teoria) / 5;
    const x = getLineX(idx, chronologicalEvaluations.length);
    const y = getLineY(itemAverage);
    return `${x},${y}`;
  }).join(' ');

  // Handle opening modal for new or editing
  const openFormModal = (pessoa: Pessoa | null = null) => {
    if (pessoa) {
      setSelectedPessoa(pessoa);
      setFormNome(pessoa.nome);
      setFormTipo(pessoa.tipo);
      setFormInstrumento(pessoa.instrumento);
      setFormStatus(pessoa.status);
      setFormTelefone(pessoa.telefone || pessoa.contato || '');
      setFormEmail(pessoa.email || '');
      setFormDataNascimento(pessoa.dataNascimento || '');
      setFormObservacoes(pessoa.observacoes || '');
      setFormFase(pessoa.fase || 1);
    } else {
      setSelectedPessoa(null);
      setFormNome('');
      setFormTipo('Musico');
      setFormInstrumento('Violino');
      setFormStatus('Ativo');
      setFormTelefone('');
      setFormEmail('');
      setFormDataNascimento('');
      setFormObservacoes('');
      setFormFase(1);
    }
    setIsModalOpen(true);
  };

  const openViewModal = (pessoa: Pessoa) => {
    setSelectedPessoa(pessoa);
    setActiveProfileTab('charts');
    setIsViewModalOpen(true);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNome.trim()) {
      toast('Por favor, informe o nome completo.', 'error');
      return;
    }

    const updatedPessoa: Pessoa = {
      id: selectedPessoa ? selectedPessoa.id : 'pes_' + Date.now().toString(),
      nome: formNome.trim(),
      tipo: formTipo,
      instrumento: formInstrumento,
      status: formStatus,
      telefone: formTelefone.trim(),
      email: formEmail.trim(),
      dataNascimento: formDataNascimento,
      observacoes: formObservacoes.trim(),
      fase: formTipo === 'Aluno' ? formFase : undefined,
      comumCongregacao: selectedPessoa?.comumCongregacao || 'Jardim Maria Rosa - Taboão da Serra - SP',
      bairro: selectedPessoa?.bairro || 'Jardim Maria Rosa',
      cidade: selectedPessoa?.cidade || 'Taboão da Serra',
      uf: selectedPessoa?.uf || 'SP',
      lgpdConsent: selectedPessoa?.lgpdConsent,
      isAnonimizado: selectedPessoa?.isAnonimizado,
      dataAnonimizacao: selectedPessoa?.dataAnonimizacao,
    };

    onSave(updatedPessoa);

    if (!selectedPessoa) {
      logAuditEvent(
        user,
        'STUDENT_CREATED',
        `Novo cadastro criado: ${updatedPessoa.nome} (${updatedPessoa.tipo} - ${updatedPessoa.instrumento}).`,
        updatedPessoa.id
      );
    } else {
      const mudancas: { campo: string; valorAntigo: any; valorNovo: any }[] = [];
      if (selectedPessoa.nome !== updatedPessoa.nome) {
        mudancas.push({ campo: 'Nome', valorAntigo: selectedPessoa.nome, valorNovo: updatedPessoa.nome });
      }
      if (selectedPessoa.tipo !== updatedPessoa.tipo) {
        mudancas.push({ campo: 'Tipo/Função', valorAntigo: selectedPessoa.tipo, valorNovo: updatedPessoa.tipo });
      }
      if (selectedPessoa.instrumento !== updatedPessoa.instrumento) {
        mudancas.push({ campo: 'Instrumento', valorAntigo: selectedPessoa.instrumento, valorNovo: updatedPessoa.instrumento });
      }
      if (selectedPessoa.status !== updatedPessoa.status) {
        mudancas.push({ campo: 'Status', valorAntigo: selectedPessoa.status, valorNovo: updatedPessoa.status });
      }
      if (selectedPessoa.fase !== updatedPessoa.fase) {
        mudancas.push({ campo: 'Fase/Módulo', valorAntigo: selectedPessoa.fase, valorNovo: updatedPessoa.fase });
      }
      if (selectedPessoa.telefone !== updatedPessoa.telefone) {
        mudancas.push({ campo: 'Telefone', valorAntigo: selectedPessoa.telefone, valorNovo: updatedPessoa.telefone });
      }

      logAuditEvent(
        user,
        'STUDENT_UPDATED',
        `Cadastro de ${updatedPessoa.nome} atualizado.`,
        updatedPessoa.id,
        mudancas.length > 0 ? mudancas : undefined
      );
    }

    setIsModalOpen(false);
    toast(selectedPessoa ? 'Cadastro atualizado com sucesso!' : 'Membro cadastrado com sucesso!', 'success');
  };

  // CSV Exporter for Excel Compatibility
  const exportToCSV = () => {
    if (filteredPessoas.length === 0) {
      toast('Não há dados para exportar.', 'error');
      return;
    }

    // Prepare headers and lines
    const headers = ['Nome', 'Tipo/Cargo', 'Instrumento', 'Status', 'Status LGPD', 'Telefone', 'E-mail', 'Data de Nascimento', 'Observações'];
    const rows = filteredPessoas.map(p => [
      maskName(p.nome, isPrivacyMode),
      p.tipo,
      p.instrumento,
      p.status,
      p.tipo === 'Aluno' ? (p.isAnonimizado ? 'Anonimizado' : (p.lgpdConsent?.consentimentoConcedido ? 'Consentimento OK' : 'Pendente LGPD')) : 'N/A',
      maskPhone(p.telefone, isPrivacyMode),
      maskEmail(p.email, isPrivacyMode),
      p.dataNascimento ? new Date(p.dataNascimento).toLocaleDateString('pt-BR') : '',
      maskText(p.observacoes || '', isPrivacyMode)
    ]);

    // Use semicolon to ensure perfect opening in Portuguese Excel
    const csvContent = [headers, ...rows]
      .map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(';'))
      .join('\n');

    // Add BOM for UTF-8 compatibility
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orquestra_pessoas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Relatório exportado com sucesso!', 'success');
  };

  // Filter logic with Memoization
  const filteredPessoas = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return pessoas.filter(p => {
      const matchesSearch = !term || 
        p.nome.toLowerCase().includes(term) || 
        p.instrumento.toLowerCase().includes(term) ||
        (p.email && p.email.toLowerCase().includes(term));
      
      const matchesRole = roleFilter === 'Todos' || p.tipo === roleFilter;
      const matchesStatus = statusFilter === 'Todos' || p.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [pessoas, searchTerm, roleFilter, statusFilter]);

  // Paginated Slice
  const visiblePessoas = useMemo(() => {
    return filteredPessoas.slice(0, visibleCount);
  }, [filteredPessoas, visibleCount]);

  return (
    <div className="space-y-6 relative" id="pessoas-tab-container">
      <MusicalWatermark type="sol" position="bottom-right" opacityClass="opacity-[0.035] dark:opacity-[0.05]" />
      {/* Search and Filters panel */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2 max-w-md bg-slate-50 dark:bg-slate-900/50 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome, instrumento..." 
            className="bg-transparent text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/30 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase px-1">Cargo:</span>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as any);
                setVisibleCount(PAGE_SIZE);
              }}
              className="bg-transparent text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-none"
            >
              <option value="Todos">Todos</option>
              <option value="Musico">Músico</option>
              <option value="Aluno">Aluno</option>
              <option value="Professor">Professor</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/30 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase px-1">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setVisibleCount(PAGE_SIZE);
              }}
              className="bg-transparent text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-none"
            >
              <option value="Todos">Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Afastado">Afastado</option>
              <option value="Em Observação">Em Observação</option>
            </select>
          </div>

          {/* Export and Add actions */}
          <button 
            onClick={exportToCSV}
            className="p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Exportar Relatório Excel"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>

          <button 
            onClick={() => openFormModal(null)}
            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Pessoa</span>
          </button>
        </div>
      </div>

      {/* Grid or Table list of People */}
      {filteredPessoas.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <User className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-1">Nenhuma pessoa encontrada</h4>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Tente mudar os filtros de busca ou adicione um novo integrante à orquestra.
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE CARDS VIEW (md:hidden) */}
          <div className="block md:hidden space-y-4" id="pessoas-mobile-cards">
            {visiblePessoas.map(pessoa => {
              // Role Badge
              const roleStyles = {
                Musico: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50',
                Aluno: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
                Professor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/50'
              };

              // Status Badge Colors
              const statusBgColors = {
                Ativo: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50',
                'Em Observação': 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50',
                Afastado: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-850'
              };

              return (
                <div 
                  key={pessoa.id} 
                  className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4"
                >
                  {/* Header: Circle initials + Name & birthdate */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold uppercase shrink-0">
                      {maskName(pessoa.nome, isPrivacyMode).substring(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-slate-800 dark:text-white text-sm block truncate">
                        {maskName(pessoa.nome, isPrivacyMode)}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 block truncate">
                        🎂 {pessoa.dataNascimento ? new Date(pessoa.dataNascimento).toLocaleDateString('pt-BR') : 'Nascimento não informado'}
                      </span>
                    </div>
                  </div>

                  {/* Badges / Instrument / Role / Status */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${roleStyles[pessoa.tipo]}`}>
                      {pessoa.tipo}
                    </span>
                    {pessoa.tipo === 'Aluno' && pessoa.fase && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        pessoa.fase === 1 ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50' :
                        pessoa.fase === 2 ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50' :
                        pessoa.fase === 3 ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50' :
                        'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50'
                      }`}>
                        F{pessoa.fase} - {
                          pessoa.fase === 1 ? 'Fundamentos' :
                          pessoa.fase === 2 ? 'Técnica' :
                          pessoa.fase === 3 ? 'Hinos Jovens' : 'Hinos Oficiais'
                        }
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBgColors[pessoa.status]}`}>
                      {pessoa.status}
                    </span>
                    {pessoa.tipo === 'Aluno' && (
                      <LGPDStatusBadge 
                        consent={pessoa.lgpdConsent}
                        isAnonimizado={pessoa.isAnonimizado}
                        onOpenConsentModal={() => setLgpdModalStudent(pessoa)}
                      />
                    )}
                  </div>

                  {/* Instrument */}
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    🎻 Instrumento: <span className="font-bold">{pessoa.instrumento}</span>
                  </div>

                  {/* Contacts block */}
                  {(pessoa.telefone || pessoa.email) && (
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      {pessoa.telefone && (
                        <a href={`tel:${pessoa.telefone}`} className="flex items-center gap-1.5 hover:text-blue-600">
                          📞 <span className="underline">{maskPhone(pessoa.telefone, isPrivacyMode)}</span>
                        </a>
                      )}
                      {pessoa.email && (
                        <a href={`mailto:${pessoa.email}`} className="flex items-center gap-1.5 hover:text-blue-600 break-all">
                          ✉️ <span className="underline">{maskEmail(pessoa.email, isPrivacyMode)}</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Actions row */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                    <button 
                      onClick={() => openViewModal(pessoa)}
                      className="p-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex-1 flex items-center justify-center gap-1 text-[11px] font-bold"
                      title="Ver Ficha"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ficha</span>
                    </button>
                    <button 
                      onClick={() => openFormModal(pessoa)}
                      className="p-2 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl cursor-pointer transition-all flex-1 flex items-center justify-center gap-1 text-[11px] font-bold"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                    <button 
                      onClick={() => {
                        if (pessoa.tipo === 'Aluno') {
                          setDeletingStudent(pessoa);
                        } else {
                          if (confirm(`Deseja realmente remover ${pessoa.nome}?`)) {
                            onDelete(pessoa.id);
                            toast('Membro removido com sucesso.', 'success');
                          }
                        }
                      }}
                      className="p-2 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl cursor-pointer transition-all flex-1 flex items-center justify-center gap-1 text-[11px] font-bold"
                      title={pessoa.tipo === 'Aluno' ? "Opções de Exclusão / Anonimização LGPD" : "Excluir"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP TABLE VIEW (hidden md:block) */}
          <div className="hidden md:block bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden" id="pessoas-table-wrapper">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/10">
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Membro</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Função / Instrumento</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Status</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Contato</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {visiblePessoas.map(pessoa => {
                    // Role Badge
                    const roleStyles = {
                      Musico: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50',
                      Aluno: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
                      Professor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/50'
                    };

                    // Status Badge
                    const statusIcons = {
                      Ativo: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
                      'Em Observação': <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
                      Afastado: <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                    };

                    return (
                      <tr 
                        key={pessoa.id} 
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-750/10 transition-colors group"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold uppercase">
                              {maskName(pessoa.nome, isPrivacyMode).substring(0, 2)}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-800 dark:text-white text-sm block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {maskName(pessoa.nome, isPrivacyMode)}
                              </span>
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                {pessoa.dataNascimento ? `Nascimento: ${new Date(pessoa.dataNascimento).toLocaleDateString('pt-BR')}` : 'Membro'} &bull; 📍 {pessoa.bairro || 'Jd. Maria Rosa'}, {pessoa.cidade || 'Taboão da Serra'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border self-start ${roleStyles[pessoa.tipo]}`}>
                                {pessoa.tipo}
                              </span>
                              {pessoa.tipo === 'Aluno' && pessoa.fase && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  pessoa.fase === 1 ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50' :
                                  pessoa.fase === 2 ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50' :
                                  pessoa.fase === 3 ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50' :
                                  'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50'
                                }`}>
                                  F{pessoa.fase} - {
                                    pessoa.fase === 1 ? 'Fundamentos' :
                                    pessoa.fase === 2 ? 'Técnica' :
                                    pessoa.fase === 3 ? 'Hinos Jovens' : 'Hinos Oficiais'
                                  }
                                </span>
                              )}
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                              🎻 {pessoa.instrumento}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {statusIcons[pessoa.status]}
                              <span>{pessoa.status}</span>
                            </div>
                            {pessoa.tipo === 'Aluno' && (
                              <div>
                                <LGPDStatusBadge 
                                  consent={pessoa.lgpdConsent}
                                  isAnonimizado={pessoa.isAnonimizado}
                                  onOpenConsentModal={() => setLgpdModalStudent(pessoa)}
                                />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {pessoa.telefone && <p className="flex items-center gap-1">📞 {maskPhone(pessoa.telefone, isPrivacyMode)}</p>}
                            {pessoa.email && <p className="flex items-center gap-1">✉️ {maskEmail(pessoa.email, isPrivacyMode)}</p>}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => openViewModal(pessoa)}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-lg cursor-pointer transition-all"
                              title="Ver Ficha"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => openFormModal(pessoa)}
                              className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg cursor-pointer transition-all"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                if (pessoa.tipo === 'Aluno') {
                                  setDeletingStudent(pessoa);
                                } else {
                                  if (confirm(`Deseja realmente remover ${pessoa.nome}?`)) {
                                    onDelete(pessoa.id);
                                    toast('Membro removido com sucesso.', 'success');
                                  }
                                }
                              }}
                              className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-lg cursor-pointer transition-all"
                              title={pessoa.tipo === 'Aluno' ? "Opções de Exclusão / Anonimização LGPD" : "Excluir"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Load More Pagination Button */}
          {visibleCount < filteredPessoas.length && (
            <div className="pt-2 text-center">
              <button
                onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                className="py-2.5 px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                ⚡ Carregar mais 15 integrantes ({filteredPessoas.length - visibleCount} restantes)
              </button>
            </div>
          )}
        </>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {selectedPessoa ? 'Editar Cadastro' : 'Cadastrar Novo Integrante'}
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
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Nome Completo *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: João da Silva" 
                  className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Cargo / Papel *</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formTipo}
                    onChange={(e) => setFormTipo(e.target.value as any)}
                  >
                    <option value="Musico">Músico</option>
                    <option value="Aluno">Aluno</option>
                    <option value="Professor">Professor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Instrumento Principal *</label>
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
              </div>

              {formTipo === 'Aluno' && (
                <div className="bg-blue-50/30 dark:bg-slate-900/40 p-4 rounded-xl border border-blue-100/40 dark:border-slate-700 space-y-2 animate-in fade-in-50 duration-150">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Fase do Aprendizado *</label>
                  <select
                    className="w-full bg-white dark:bg-slate-800 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formFase}
                    onChange={(e) => setFormFase(Number(e.target.value))}
                  >
                    <option value={1}>Fase 1 - Fundamentos</option>
                    <option value={2}>Fase 2 - Técnica</option>
                    <option value={3}>Fase 3 - Hinos Jovens</option>
                    <option value={4}>Fase 4 - Hinos Oficiais</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Status *</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Afastado">Afastado</option>
                    <option value="Em Observação">Em Observação</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Telefone</label>
                  <input 
                    type="text" 
                    placeholder="Ex: (11) 99999-9999" 
                    className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formTelefone}
                    onChange={(e) => setFormTelefone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">E-mail</label>
                  <input 
                    type="email" 
                    placeholder="Ex: joao@gmail.com" 
                    className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Data de Nascimento</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formDataNascimento}
                    onChange={(e) => setFormDataNascimento(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Observações Adicionais</label>
                <textarea 
                  rows={3}
                  placeholder="Informações adicionais de progresso, afinação, restrições ou observações gerais..." 
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
                  Salvar Integrante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW FICHA MODAL */}
      {isViewModalOpen && selectedPessoa && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className={`bg-white dark:bg-slate-800 rounded-2xl w-full ${selectedPessoa.tipo === 'Aluno' ? 'max-w-4xl' : 'max-w-md'} shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200`}>
            
            {selectedPessoa.tipo !== 'Aluno' ? (
              // ORIGINAL COMPACT VIEW FOR NON-STUDENTS (Musico, Professor)
              <>
                <div className="p-6 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-500" />
                    <span>Ficha Individual do Membro</span>
                  </h3>
                  <button 
                    onClick={() => setIsViewModalOpen(false)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl font-bold uppercase shrink-0">
                      {selectedPessoa.nome.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white">{selectedPessoa.nome}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                          {selectedPessoa.tipo}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                          🎻 {selectedPessoa.instrumento}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Information Cards */}
                  <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700/40 space-y-3.5">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-[10px] shrink-0">
                        📍
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 block">Comum Congregação</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedPessoa.comumCongregacao || 'Jardim Maria Rosa - Taboão da Serra - SP'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 block">Celular</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedPessoa.telefone || 'Não informado'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 block">E-mail</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 break-all">{selectedPessoa.email || 'Não informado'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 block">Data de Nascimento</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {selectedPessoa.dataNascimento ? new Date(selectedPessoa.dataNascimento).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Não informada'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="p-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 shrink-0">
                        <span className="text-[9px] font-bold px-0.5">ST</span>
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 block">Status de Atividade</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedPessoa.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Remarks/Notes */}
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Histórico & Observações</h5>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/20 p-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 italic">
                      {selectedPessoa.observacoes || 'Nenhum comentário cadastrado para este integrante.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                    <button 
                      onClick={() => setIsViewModalOpen(false)}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                      Fechar Ficha
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // NEW HIGH-FIDELITY DETAILED STUDENT PROFILE DASHBOARD (Etapa 2)
              <>
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/10">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-500" />
                    <span>Perfil de Desempenho do Aluno</span>
                  </h3>
                  <button 
                    onClick={() => setIsViewModalOpen(false)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Main content grid */}
                <div className="max-h-[80vh] overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                    
                    {/* Left Column - Compact Info & Attendance */}
                    <div className="lg:col-span-4 space-y-6">
                      {/* Student Basic Card */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl font-black uppercase shadow-xs shrink-0">
                          {maskName(selectedPessoa.nome, isPrivacyMode).substring(0, 2)}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{maskName(selectedPessoa.nome, isPrivacyMode)}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                              {selectedPessoa.tipo}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                              🎻 {selectedPessoa.instrumento}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Student Attributes (Stage, Contact) */}
                      <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3.5">
                        {selectedPessoa.fase && (
                          <div className="flex items-center gap-3 text-xs">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-bold">FS</span>
                            </div>
                            <div>
                              <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Fase do Aprendizado</span>
                              <span className="font-bold text-slate-700 dark:text-slate-200">
                                Fase {selectedPessoa.fase} - {
                                  selectedPessoa.fase === 1 ? 'Fundamentos' :
                                  selectedPessoa.fase === 2 ? 'Técnica' :
                                  selectedPessoa.fase === 3 ? 'Hinos Jovens' : 'Hinos Oficiais'
                                }
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-xs">
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <span className="text-xs">📍</span>
                          </div>
                          <div>
                            <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Comum Congregação</span>
                            <span className="font-bold text-slate-700 dark:text-slate-200">
                              {selectedPessoa.comumCongregacao || 'Jardim Maria Rosa - Taboão da Serra - SP'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                          <div>
                            <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Celular</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">{maskPhone(selectedPessoa.telefone, isPrivacyMode) || 'Não informado'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                          <div>
                            <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase tracking-wider">E-mail</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-200 break-all">{maskEmail(selectedPessoa.email, isPrivacyMode) || 'Não informado'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                          <div>
                            <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Nascimento</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                              {selectedPessoa.dataNascimento ? new Date(selectedPessoa.dataNascimento).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Não informada'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <div className="p-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 shrink-0">
                            <span className="text-[9px] font-bold px-0.5">ST</span>
                          </div>
                          <div>
                            <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Status do Cadastro</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedPessoa.status}</span>
                          </div>
                        </div>
                      </div>

                      {/* Attendance Statistics Block */}
                      <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-4">
                        <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Presença Acumulada</h5>
                        
                        <div className="flex items-center gap-4">
                          {/* Big Circle Score Badge */}
                          <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center border font-bold ${
                            attendanceRate >= 80 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400' 
                              : attendanceRate >= 50 
                                ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-400' 
                                : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-400'
                          }`}>
                            <span className="text-xl font-black">{attendanceRate}%</span>
                            <span className="text-[8px] uppercase tracking-wider opacity-85">Frequência</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 flex-1 text-center">
                            <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200/50 dark:border-slate-700">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">{totalLessons}</span>
                              <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Aulas</span>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200/50 dark:border-slate-700">
                              <span className="text-xs font-bold text-emerald-600 block">{presencasCount}</span>
                              <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Pres.</span>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200/50 dark:border-slate-700">
                              <span className="text-xs font-bold text-rose-600 block">{faltasCount}</span>
                              <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Faltas</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Comments */}
                      <div className="space-y-1.5">
                        <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Anotações do Integrante</h5>
                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/20 p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 italic">
                          {selectedPessoa.observacoes || 'Nenhum comentário cadastrado para este integrante.'}
                        </p>
                      </div>

                      {/* LGPD & Privacidade (Art. 14 / Art. 18) */}
                      {selectedPessoa.tipo === 'Aluno' && (
                        <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              Privacidade & LGPD
                            </h5>
                            <LGPDStatusBadge 
                              consent={selectedPessoa.lgpdConsent}
                              isAnonimizado={selectedPessoa.isAnonimizado}
                              onOpenConsentModal={() => setLgpdModalStudent(selectedPessoa)}
                            />
                          </div>

                          {selectedPessoa.isAnonimizado ? (
                            <div className="p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs text-slate-600 dark:text-slate-400 space-y-1">
                              <p className="font-bold flex items-center gap-1 text-slate-700 dark:text-slate-300">
                                <UserX className="w-3.5 h-3.5 text-slate-500" />
                                Aluno Anonimizado (LGPD)
                              </p>
                              <p className="text-[11px] leading-relaxed">
                                Informações identificáveis foram removidas {selectedPessoa.dataAnonimizacao ? `em ${new Date(selectedPessoa.dataAnonimizacao).toLocaleDateString('pt-BR')}` : ''} conforme Artigo 18 da Lei 13.709/2018. Histórico estatístico preservado.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2 text-xs">
                              {selectedPessoa.lgpdConsent?.consentimentoConcedido ? (
                                <div className="p-2.5 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl space-y-1 text-emerald-900 dark:text-emerald-200">
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-bold">Termo v{selectedPessoa.lgpdConsent.versaoTermoAceito}</span>
                                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                                      {new Date(selectedPessoa.lgpdConsent.dataConsentimento).toLocaleDateString('pt-BR')}
                                    </span>
                                  </div>
                                  {selectedPessoa.lgpdConsent.nomeResponsavelLegal && (
                                    <p className="text-[11px]">
                                      <strong>Responsável:</strong> {selectedPessoa.lgpdConsent.nomeResponsavelLegal} ({selectedPessoa.lgpdConsent.parentescoResponsavel})
                                    </p>
                                  )}
                                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                                    {selectedPessoa.lgpdConsent.autorizacaoUsoImagemEAudio ? '✓ Imagem e áudio autorizados' : '✗ Sem autorização de imagem/som'}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => setLgpdModalStudent(selectedPessoa)}
                                    className="text-[11px] text-emerald-700 dark:text-emerald-300 underline font-semibold hover:text-emerald-900 pt-1 block cursor-pointer"
                                  >
                                    Atualizar Termo de Consentimento
                                  </button>
                                </div>
                              ) : (
                                <div className="p-2.5 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl space-y-1.5 text-amber-900 dark:text-amber-200">
                                  <p className="text-[11px] font-semibold leading-tight">
                                    Pendente de autorização formal do responsável legal (Art. 14 LGPD).
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => setLgpdModalStudent(selectedPessoa)}
                                    className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                                  >
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>Registrar Consentimento</span>
                                  </button>
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={() => setDeletingStudent(selectedPessoa)}
                                className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <UserX className="w-3.5 h-3.5 text-slate-500" />
                                <span>Opções de Exclusão / Anonimização LGPD</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right Column - Tabs and Performance Charts / Timeline */}
                    <div className="lg:col-span-8 flex flex-col space-y-6">
                      {/* Tab triggers */}
                      <div className="flex border-b border-slate-100 dark:border-slate-700/80">
                        <button
                          type="button"
                          onClick={() => setActiveProfileTab('charts')}
                          className={`py-2.5 px-4 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
                            activeProfileTab === 'charts'
                              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                              : 'border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-400'
                          }`}
                        >
                          Desempenho & Evolução
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveProfileTab('lessons')}
                          className={`py-2.5 px-4 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
                            activeProfileTab === 'lessons'
                              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                              : 'border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-400'
                          }`}
                        >
                          Histórico de Chamada ({totalLessons})
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveProfileTab('diario')}
                          className={`py-2.5 px-4 text-xs font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeProfileTab === 'diario'
                              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                              : 'border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-400'
                          }`}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>📖 Diário ({studentDiarioEntries.length})</span>
                        </button>
                      </div>

                      {/* Tab Panel contents */}
                      {activeProfileTab === 'charts' ? (
                        studentEvaluations.length === 0 ? (
                          <div className="bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center flex-1 flex flex-col items-center justify-center">
                            <Sparkles className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2 animate-pulse" />
                            <h5 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Nenhuma nota registrada</h5>
                            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm">
                              Este aluno ainda não possui notas ou avaliações cadastradas. Lançando aulas no diário de classe e avaliando este aluno gerará automaticamente seus gráficos de desempenho!
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-6 flex-1">
                            {/* Summary Header Metrics */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <div className="bg-slate-50 dark:bg-slate-900/35 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wide font-sans">Média Geral</span>
                                <span className="text-base font-black text-blue-600 dark:text-blue-400 block mt-1 font-mono">{averages.average} / 10</span>
                              </div>
                              <div className="bg-slate-50 dark:bg-slate-900/35 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wide font-sans">Leitura</span>
                                <span className="text-base font-black text-slate-700 dark:text-slate-200 block mt-1 font-mono">{averages.leitura} / 10</span>
                              </div>
                              <div className="bg-slate-50 dark:bg-slate-900/35 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wide font-sans">Ritmo</span>
                                <span className="text-base font-black text-slate-700 dark:text-slate-200 block mt-1 font-mono">{averages.ritmo} / 10</span>
                              </div>
                              <div className="bg-slate-50 dark:bg-slate-900/35 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wide font-sans">Técnica</span>
                                <span className="text-base font-black text-slate-700 dark:text-slate-200 block mt-1 font-mono">{averages.tecnica} / 10</span>
                              </div>
                            </div>

                            {/* Charts Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                              {/* Radar Chart Block */}
                              <div className="md:col-span-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center">
                                <h6 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3">Mapeamento de Critérios</h6>
                                
                                <div className="w-full max-w-[260px] flex items-center justify-center">
                                  {/* Inline SVG Radar Chart */}
                                  <svg viewBox="0 0 260 260" className="w-full h-auto">
                                    {/* Axis and Grid Lines */}
                                    {levels.map(lvl => {
                                      const points = criteriaKeys.map((_, idx) => {
                                        const { x, y } = getCoordinates(idx, lvl);
                                        return `${x},${y}`;
                                      }).join(' ');
                                      return (
                                        <polygon
                                          key={lvl}
                                          points={points}
                                          fill="none"
                                          stroke="#e2e8f0"
                                          className="dark:stroke-slate-700/60"
                                          strokeWidth="1"
                                        />
                                      );
                                    })}

                                    {criteriaKeys.map((_, idx) => {
                                      const outer = getCoordinates(idx, 10);
                                      return (
                                        <line
                                          key={idx}
                                          x1={centerX}
                                          y1={centerY}
                                          x2={outer.x}
                                          y2={outer.y}
                                          stroke="#e2e8f0"
                                          className="dark:stroke-slate-700/60"
                                          strokeWidth="1"
                                        />
                                      );
                                    })}

                                    {/* Active Area Polygon */}
                                    <polygon
                                      points={dataPoints}
                                      fill="rgba(59, 130, 246, 0.18)"
                                      stroke="#3b82f6"
                                      strokeWidth="2.5"
                                      strokeLinejoin="round"
                                    />

                                    {/* Vertex Dots */}
                                    {criteriaKeys.map((key, idx) => {
                                      const score = averages[key];
                                      const { x, y } = getCoordinates(idx, score);
                                      return (
                                        <circle
                                          key={idx}
                                          cx={x}
                                          cy={y}
                                          r="4.5"
                                          fill="#3b82f6"
                                          stroke="white"
                                          strokeWidth="1.5"
                                          className="dark:stroke-slate-800"
                                        />
                                      );
                                    })}

                                    {/* Axis labels */}
                                    {criteriaLabels.map((label, idx) => {
                                      const { x, y } = getLabelCoordinates(idx);
                                      const anchor = getTextAnchor(idx);
                                      const score = averages[criteriaKeys[idx]];
                                      return (
                                        <text
                                          key={idx}
                                          x={x}
                                          y={y + 4}
                                          textAnchor={anchor}
                                          className="text-[9px] font-extrabold fill-slate-500 dark:fill-slate-400 font-sans"
                                        >
                                          {label} ({score})
                                        </text>
                                      );
                                    })}
                                  </svg>
                                </div>
                              </div>

                              {/* Line Chart Block */}
                              <div className="md:col-span-7 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 flex flex-col justify-center">
                                <h6 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3">Evolução de Média (Histórico)</h6>
                                
                                <div className="w-full flex items-center justify-center">
                                  {/* Inline SVG Evolution Chart */}
                                  <svg viewBox="0 0 320 140" className="w-full h-auto">
                                    {/* Grid reference lines */}
                                    {gridLevels.map(lvl => {
                                      const y = getLineY(lvl);
                                      return (
                                        <g key={lvl} className="opacity-40">
                                          <line
                                            x1={paddingLeft}
                                            y1={y}
                                            x2={chartWidth - paddingRight}
                                            y2={y}
                                            stroke="#e2e8f0"
                                            className="dark:stroke-slate-700"
                                            strokeWidth="1"
                                            strokeDasharray="2,2"
                                          />
                                          <text
                                            x={paddingLeft - 5}
                                            y={y + 3}
                                            textAnchor="end"
                                            className="text-[8px] fill-slate-400 dark:fill-slate-500 font-mono font-bold"
                                          >
                                            {lvl}
                                          </text>
                                        </g>
                                      );
                                    })}

                                    {/* The progression path line */}
                                    {chronologicalEvaluations.length > 1 && (
                                      <polyline
                                        fill="none"
                                        stroke="#3b82f6"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points={pathPoints}
                                      />
                                    )}

                                    {/* Interactive Dot Handles */}
                                    {chronologicalEvaluations.map((item, idx) => {
                                      const itemAverage = (item.eval.ritmo + item.eval.tecnica + item.eval.leitura + item.eval.expressao + item.eval.teoria) / 5;
                                      const x = getLineX(idx, chronologicalEvaluations.length);
                                      const y = getLineY(itemAverage);
                                      
                                      const shortDate = new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');

                                      return (
                                        <g key={item.lessonId}>
                                          <circle
                                            cx={x}
                                            cy={y}
                                            r="4"
                                            fill="#3b82f6"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            className="dark:stroke-slate-800"
                                          />
                                          <text
                                            x={x}
                                            y={chartHeight - 4}
                                            textAnchor="middle"
                                            className="text-[8px] font-bold fill-slate-400 dark:fill-slate-500 font-sans"
                                          >
                                            {shortDate}
                                          </text>
                                          <text
                                            x={x}
                                            y={y - 7}
                                            textAnchor="middle"
                                            className="text-[8px] font-black fill-blue-600 dark:fill-blue-400 font-mono"
                                          >
                                            {itemAverage.toFixed(1)}
                                          </text>
                                        </g>
                                      );
                                    })}
                                  </svg>
                                </div>
                              </div>
                            </div>

                            {/* Scatter Plot - Practice Duration vs performance (Passo 5) */}
                            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 sm:p-5 space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
                                <div className="space-y-0.5">
                                  <h6 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-emerald-500" />
                                    <span>⏱️ Correlação: Duração de Estudo vs. Desempenho</span>
                                  </h6>
                                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                                    Comparação direta entre os minutos acumulados de estudo individual nos 7 dias antes da aula e as notas recebidas.
                                  </p>
                                </div>
                                <div className={`px-2.5 py-1 rounded-lg border text-[10px] sm:text-xs font-extrabold shrink-0 flex items-center gap-1.5 ${localInterpretation.color}`}>
                                  <span>{localInterpretation.label} (r = {localR})</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                {/* Scatter SVG */}
                                <div className="md:col-span-8 flex items-center justify-center">
                                  {durationVsPerformanceData.length === 0 ? (
                                    <div className="h-40 flex flex-col items-center justify-center text-slate-400 text-xs italic space-y-2 bg-slate-50 dark:bg-slate-900/10 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-8 w-full">
                                      <span>Nenhum dado de correlação disponível para este aluno.</span>
                                      <span className="text-[10px] opacity-80">Cadastre notas nas chamadas e sessões de estudo no Diário para cruzar os dados.</span>
                                    </div>
                                  ) : (
                                    <div className="w-full">
                                      {/* Responsive Inline SVG Scatter Plot */}
                                      <svg viewBox="0 0 320 150" className="w-full h-auto">
                                        {/* Grid background reference lines for Y (Scores) */}
                                        {[2, 4, 6, 8, 10].map(score => {
                                          const y = 110 - (score / 10) * 90;
                                          return (
                                            <g key={score} className="opacity-40">
                                              <line x1={40} y1={y} x2={300} y2={y} stroke="#e2e8f0" className="dark:stroke-slate-700" strokeWidth="1" strokeDasharray="2,2" />
                                              <text x={33} y={y + 3} textAnchor="end" className="text-[8px] fill-slate-400 dark:fill-slate-500 font-mono font-bold">{score}</text>
                                            </g>
                                          );
                                        })}
                                        {/* Grid background reference lines for X (Duration) */}
                                        {[0, 60, 120, 180, 240, 300].map(dur => {
                                          const x = 40 + (dur / 300) * 260;
                                          return (
                                            <g key={dur} className="opacity-40">
                                              <line x1={x} y1={20} x2={x} y2={110} stroke="#e2e8f0" className="dark:stroke-slate-700" strokeWidth="1" strokeDasharray="2,2" />
                                              <text x={x} y={122} textAnchor="middle" className="text-[8px] fill-slate-400 dark:fill-slate-500 font-mono font-bold">{dur}m</text>
                                            </g>
                                          );
                                        })}

                                        {/* X and Y Axis Lines */}
                                        <line x1={40} y1={110} x2={300} y2={110} stroke="#cbd5e1" className="dark:stroke-slate-600" strokeWidth="1.5" />
                                        <line x1={40} y1={20} x2={40} y2={110} stroke="#cbd5e1" className="dark:stroke-slate-600" strokeWidth="1.5" />

                                        {/* Axis Titles */}
                                        <text x={170} y={135} textAnchor="middle" className="text-[8px] font-black uppercase tracking-wider fill-slate-400 dark:fill-slate-500 font-sans">Minutos de Estudo / Semana</text>
                                        <text x={12} y={65} textAnchor="middle" transform="rotate(-90 12 65)" className="text-[8px] font-black uppercase tracking-wider fill-slate-400 dark:fill-slate-500 font-sans">Média da Aula</text>

                                        {/* Linear Regression Line */}
                                        {durationVsPerformanceData.length >= 2 && (() => {
                                          const n = durationVsPerformanceData.length;
                                          const xSum = durationVsPerformanceData.reduce((sum, d) => sum + d.duration, 0);
                                          const ySum = durationVsPerformanceData.reduce((sum, d) => sum + d.score, 0);
                                          const xySum = durationVsPerformanceData.reduce((sum, d) => sum + d.duration * d.score, 0);
                                          const x2Sum = durationVsPerformanceData.reduce((sum, d) => sum + d.duration * d.duration, 0);

                                          const denominator = (n * x2Sum - xSum * xSum);
                                          if (denominator === 0) return null;
                                          const slope = (n * xySum - xSum * ySum) / denominator;
                                          const intercept = (ySum - slope * xSum) / n;

                                          // Line from x = 0 to x = 300
                                          const x1Val = 0;
                                          const x2Val = 300;
                                          const y1Val = slope * x1Val + intercept;
                                          const y2Val = slope * x2Val + intercept;

                                          // Clamp Y within 0 and 10
                                          const clampedY1 = Math.max(0, Math.min(10, y1Val));
                                          const clampedY2 = Math.max(0, Math.min(10, y2Val));

                                          // Map to SVG coordinates
                                          const svgX1 = 40;
                                          const svgX2 = 300;
                                          const svgY1 = 110 - (clampedY1 / 10) * 90;
                                          const svgY2 = 110 - (clampedY2 / 10) * 90;

                                          return (
                                            <line 
                                              x1={svgX1} 
                                              y1={svgY1} 
                                              x2={svgX2} 
                                              y2={svgY2} 
                                              stroke="#f43f5e" 
                                              strokeWidth="2" 
                                              strokeDasharray="3,3" 
                                              className="opacity-90 animate-pulse" 
                                            />
                                          );
                                        })()}

                                        {/* Scatter dots */}
                                        {durationVsPerformanceData.map((pt, idx) => {
                                          const clampedDuration = Math.min(300, pt.duration);
                                          const x = 40 + (clampedDuration / 300) * 260;
                                          const y = 110 - (pt.score / 10) * 90;
                                          const shortDate = new Date(pt.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

                                          return (
                                            <g key={idx} className="group/dot">
                                              <circle 
                                                cx={x} 
                                                cy={y} 
                                                r="5" 
                                                fill="#3b82f6" 
                                                stroke="white" 
                                                strokeWidth="1.5" 
                                                className="cursor-pointer hover:fill-emerald-500 hover:scale-130 hover:stroke-blue-200 transition-all duration-150" 
                                              />
                                              {/* Interactivity Indicator Ring */}
                                              <circle 
                                                cx={x} 
                                                cy={y} 
                                                r="8" 
                                                fill="none" 
                                                stroke="#3b82f6" 
                                                strokeWidth="1" 
                                                className="opacity-0 group-hover/dot:opacity-40 group-hover/dot:scale-125 transition-all duration-150" 
                                              />
                                              <title>{`Aula ${shortDate}: estudou ${pt.duration} min -> Nota: ${pt.score}`}</title>
                                            </g>
                                          );
                                        })}
                                      </svg>
                                    </div>
                                  )}
                                </div>

                                {/* Textual breakdown and diagnostics */}
                                <div className="md:col-span-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                                  <h6 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Quadro Diagnóstico</h6>
                                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {localInterpretation.desc}
                                  </p>
                                  <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-2.5 space-y-2">
                                    <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                      <span>Aulas Avaliadas:</span>
                                      <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">{durationVsPerformanceData.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                      <span>Estudo Acumulado:</span>
                                      <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">
                                        {studentDiarioEntries.reduce((sum, e) => sum + e.duracaoMinutos, 0)} min
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                      <span>Média de Treino/Sem:</span>
                                      <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">
                                        {durationVsPerformanceData.length > 0 
                                          ? `${Math.round(durationVsPerformanceData.reduce((sum, d) => sum + d.duration, 0) / durationVsPerformanceData.length)} min`
                                          : '0 min'
                                        }
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      ) : activeProfileTab === 'lessons' ? (
                        /* Timeline tab list */
                        studentLessons.length === 0 ? (
                          <div className="bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center flex-1 flex flex-col items-center justify-center">
                            <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
                            <h5 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Nenhuma aula registrada</h5>
                            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm">
                              Nenhum diário de classe foi lançado para a turma deste aluno ainda. Adicione aulas no diário para visualizar a linha de presença!
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 flex-1">
                            {studentLessons
                              .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                              .map(aula => {
                                const isPresent = aula.presencas[selectedPessoa.id] === true;
                                const evalObj = aula.avaliacoes?.[selectedPessoa.id];
                                const lessonClassObj = turmas.find(t => t.id === aula.turmaId);

                                return (
                                  <div 
                                    key={aula.id}
                                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row gap-4 transition-all ${
                                      isPresent 
                                        ? 'bg-emerald-50/10 border-emerald-100/60 dark:bg-emerald-950/5 dark:border-emerald-950/30' 
                                        : 'bg-rose-50/10 border-rose-100/60 dark:bg-rose-950/5 dark:border-rose-950/30'
                                    }`}
                                  >
                                    {/* Left indicator details */}
                                    <div className="sm:w-32 shrink-0 space-y-1">
                                      <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 block uppercase">
                                        📅 {new Date(aula.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                      </span>
                                      <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 block truncate" title={lessonClassObj?.nome}>
                                        {lessonClassObj?.nome || 'Turma'}
                                      </span>
                                      <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-black mt-1 ${
                                        isPresent 
                                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' 
                                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                                      }`}>
                                        {isPresent ? '● PRESENTE' : '○ AUSENTE'}
                                      </span>
                                    </div>

                                    {/* Content Details */}
                                    <div className="flex-1 space-y-3">
                                      <div>
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block">Conteúdo da Aula</span>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                          {aula.conteudo}
                                        </p>
                                        {aula.material && (
                                          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                            <span>📚 <strong>Material:</strong> {aula.material}</span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Grades and observations */}
                                      {isPresent && evalObj && (
                                        <div className="bg-white/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 p-3 rounded-xl space-y-2.5">
                                          {/* Horizontal ratings pill layout */}
                                          <div className="flex flex-wrap gap-2">
                                            {([
                                              { k: 'ritmo', label: 'Ritmo' },
                                              { k: 'tecnica', label: 'Téc.' },
                                              { k: 'leitura', label: 'Leit.' },
                                              { k: 'expressao', label: 'Expr.' },
                                              { k: 'teoria', label: 'Teor.' }
                                            ] as const).map(item => {
                                              const score = evalObj[item.k] || 8;
                                              return (
                                                <span 
                                                  key={item.k}
                                                  className="text-[10px] px-2 py-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-bold"
                                                >
                                                  {item.label}: <strong className="text-blue-600 dark:text-blue-400 font-extrabold">{score}</strong>
                                                </span>
                                              );
                                            })}
                                          </div>

                                          {/* Comment */}
                                          {evalObj.observacao && (
                                            <div className="pt-1.5 border-t border-slate-100/60 dark:border-slate-800">
                                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Nota do Instrutor</span>
                                              <p className="text-[11px] italic text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                                "{maskText(evalObj.observacao, isPrivacyMode)}"
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        )
                      ) : (
                          /* STUDENT DIARY TAB - HIGH FIDELITY WITH HEATMAP */
                          <div className="space-y-6 flex-1 flex flex-col">
                            {/* Interactive Heatmap Segment */}
                            <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <h5 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-emerald-500" />
                                    <span>Frequência de Prática Individual (Últimos 6 meses)</span>
                                  </h5>
                                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                    Histórico visual de estudos autônomos e lições registradas
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    resetDiarioForm();
                                    setIsDiarioFormOpen(true);
                                  }}
                                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-[10px] font-extrabold rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Novo Registro</span>
                                </button>
                              </div>

                              <div className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl space-y-2">
                                <div className="flex gap-2 items-start pt-1">
                                  {/* Left Day Labels */}
                                  <div className="flex flex-col justify-between text-[8px] text-slate-400 dark:text-slate-500 font-bold h-[83px] pr-1 uppercase select-none pt-[12px]">
                                    <span>D</span>
                                    <span>T</span>
                                    <span>Q</span>
                                    <span>S</span>
                                  </div>

                                  <div className="flex-1 overflow-x-auto">
                                    {/* Month labels and heatmap grid */}
                                    <div className="flex gap-1 text-[8px] text-slate-400 dark:text-slate-500 font-extrabold uppercase mb-1.5 select-none">
                                      {weeks.map((week, wIdx) => {
                                        const label = getMonthLabel(week);
                                        return (
                                          <div key={wIdx} className="w-[11px] text-[7.5px] text-center shrink-0">
                                            {label || '\u00A0'}
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {/* Heatmap Grid */}
                                    <div className="flex gap-1 pb-1">
                                      {weeks.map((week, wIdx) => (
                                        <div key={wIdx} className="flex flex-col gap-1 shrink-0">
                                          {week.map((day) => {
                                            // Determine color level based on duration
                                            let levelColor = 'bg-slate-100 dark:bg-slate-900 border-slate-200/20';
                                            if (day.duration > 0) {
                                              if (day.duration < 30) {
                                                levelColor = 'bg-emerald-100 dark:bg-emerald-950/40 border-emerald-200/20 text-emerald-700';
                                              } else if (day.duration < 60) {
                                                levelColor = 'bg-emerald-300 dark:bg-emerald-800 border-emerald-400/20 text-emerald-900';
                                              } else {
                                                levelColor = 'bg-emerald-500 dark:bg-emerald-600 border-emerald-600/20 text-white';
                                              }
                                            }
                                            
                                            const formattedDate = day.dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
                                            const tooltip = day.duration > 0 
                                              ? `${formattedDate}: ⏱️ ${day.duration} min de estudo`
                                              : `${formattedDate}: Sem estudos registrados`;
                                              
                                            return (
                                              <div
                                                key={day.dateStr}
                                                title={tooltip}
                                                onClick={() => {
                                                  setDiarioData(day.dateStr);
                                                  setEditingDiarioId(null);
                                                  setIsDiarioFormOpen(true);
                                                }}
                                                className={`w-[11px] h-[11px] rounded-xs cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-offset-1 transition-all border ${levelColor}`}
                                              />
                                            );
                                          })}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium select-none border-t border-slate-50 dark:border-slate-700/50 pt-2">
                                  <span>Clique em um dia no heatmap para agendar ou registrar prática</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px]">Menos</span>
                                    <div className="w-2.5 h-2.5 rounded-xs bg-slate-100 dark:bg-slate-900 border border-slate-200/20" />
                                    <div className="w-2.5 h-2.5 rounded-xs bg-emerald-100 border border-emerald-200/20" />
                                    <div className="w-2.5 h-2.5 rounded-xs bg-emerald-300 border border-emerald-400/20" />
                                    <div className="w-2.5 h-2.5 rounded-xs bg-emerald-500 border border-emerald-600/20" />
                                    <span className="text-[9px]">Mais</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Practice Log Form */}
                            {isDiarioFormOpen && (
                              <form onSubmit={handleSaveDiarioForm} className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 space-y-4 animate-in fade-in slide-in-from-top-3 duration-150">
                                <h5 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                  <BookOpen className="w-4 h-4 text-blue-500" />
                                  <span>{editingDiarioId ? 'Editar Registro de Prática' : 'Adicionar Prática ao Diário'}</span>
                                </h5>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block mb-1">Data do Estudo</label>
                                    <input 
                                      type="date"
                                      value={diarioData}
                                      onChange={(e) => setDiarioData(e.target.value)}
                                      className="w-full text-xs font-semibold px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block mb-1">Duração (Minutos)</label>
                                    <div className="relative">
                                      <input 
                                        type="number"
                                        min="5"
                                        max="480"
                                        value={diarioDuracao}
                                        onChange={(e) => setDiarioDuracao(Number(e.target.value))}
                                        className="w-full text-xs font-semibold pl-3 pr-12 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                      />
                                      <span className="absolute right-3 top-2 text-[10px] text-slate-400 dark:text-slate-500 font-bold">MIN</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block mb-1">Conteúdo Estudado</label>
                                    <input 
                                      type="text"
                                      placeholder="Ex: Hino 322 (compassos 1-12), escalas maiores e notas longas..."
                                      value={diarioConteudo}
                                      onChange={(e) => setDiarioConteudo(e.target.value)}
                                      className="w-full text-xs font-semibold px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                      required
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block mb-1">Objetivo do Estudo / Aula</label>
                                      <input 
                                        type="text"
                                        placeholder="Ex: Melhorar articulação de semicolcheias..."
                                        value={diarioObjetivo}
                                        onChange={(e) => setDiarioObjetivo(e.target.value)}
                                        className="w-full text-xs font-semibold px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block mb-1">Material Utilizado</label>
                                      <input 
                                        type="text"
                                        placeholder="Ex: Método Suzuki Vol. 2, metrônomo..."
                                        value={diarioMaterial}
                                        onChange={(e) => setDiarioMaterial(e.target.value)}
                                        className="w-full text-xs font-semibold px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block mb-1">Análise de Desempenho / Anotações do Professor</label>
                                    <textarea 
                                      placeholder="Observações sobre afinação, postura, pontos fortes e o que precisa ser melhorado..."
                                      value={diarioDesempenho}
                                      onChange={(e) => setDiarioDesempenho(e.target.value)}
                                      className="w-full text-xs font-semibold px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[70px]"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block mb-1">Tarefa de Casa / Exercício Recomendado</label>
                                    <input 
                                      type="text"
                                      placeholder="Metas para o próximo ensaio ou aula..."
                                      value={diarioTarefaCasa}
                                      onChange={(e) => setDiarioTarefaCasa(e.target.value)}
                                      className="w-full text-xs font-semibold px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-1">
                                  <button
                                    type="button"
                                    onClick={resetDiarioForm}
                                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold rounded-lg transition-all cursor-pointer"
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                                  >
                                    {editingDiarioId ? 'Salvar Alterações' : 'Salvar Registro'}
                                  </button>
                                </div>
                              </form>
                            )}

                            {/* Practice Logs Entries List */}
                            <div className="flex-1 space-y-3 max-h-[300px] overflow-y-auto pr-1">
                              {studentDiarioEntries.length === 0 ? (
                                <div className="bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center flex flex-col items-center justify-center">
                                  <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-1.5" />
                                  <h6 className="font-bold text-slate-600 dark:text-slate-400 text-xs mb-0.5">Sem registros no diário</h6>
                                  <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-xs">
                                    Adicione práticas ou estudos para ver o diário preenchido e monitorar a evolução do aluno!
                                  </p>
                                </div>
                              ) : (
                                studentDiarioEntries.map(entry => (
                                  <div 
                                    key={entry.id}
                                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-800/30 space-y-2.5 transition-all hover:border-slate-200 dark:hover:border-slate-700/60"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                                          📅 {new Date(entry.data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-black bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                          ⏱️ {entry.duracaoMinutos} min
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => handleEditDiario(entry)}
                                          className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-lg text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-all cursor-pointer"
                                          title="Editar registro"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteDiarioEntry(entry.id)}
                                          className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-lg text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 transition-all cursor-pointer"
                                          title="Excluir registro"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1 border-t border-slate-50 dark:border-slate-800/40">
                                      <div className="md:col-span-4">
                                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Estudado</span>
                                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5 leading-relaxed">{entry.conteudo}</p>
                                      </div>
                                      <div className="md:col-span-4">
                                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Feedback / Desempenho</span>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed italic">
                                          {entry.desempenho ? `"${entry.desempenho}"` : 'Sem observações registradas.'}
                                        </p>
                                      </div>
                                      <div className="md:col-span-4">
                                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Tarefa Recomendada</span>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed font-medium text-blue-600/90 dark:text-blue-400/90">
                                          {entry.tarefaCasa || 'Nenhuma lição de casa específica recomendada.'}
                                        </p>
                                      </div>
                                    </div>

                                    {(entry.objetivo || entry.material) && (
                                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-100/80 dark:border-slate-800/60 mt-1">
                                        {entry.objetivo && (
                                          <span className="flex items-center gap-1">
                                            <span>🎯</span>
                                            <strong>Objetivo:</strong> {entry.objetivo}
                                          </span>
                                        )}
                                        {entry.material && (
                                          <span className="flex items-center gap-1">
                                            <span>📚</span>
                                            <strong>Material:</strong> {entry.material}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-700/60 flex justify-end bg-slate-50/50 dark:bg-slate-900/10">
                  <button 
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs animate-in duration-100"
                  >
                    Fechar Perfil
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* LGPD Consent Modal */}
      {lgpdModalStudent && (
        <LGPDConsentModal
          student={lgpdModalStudent}
          isMinor={checkIsMinor(lgpdModalStudent.dataNascimento)}
          existingConsent={lgpdModalStudent.lgpdConsent}
          onSave={handleSaveConsent}
          onClose={() => setLgpdModalStudent(null)}
        />
      )}

      {/* Delete / Anonymize Dialog */}
      {deletingStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in-50 duration-200">
          <DeleteStudentDialog
            student={deletingStudent}
            onAnonymize={handleUpdateAnonymizedStudent}
            onDelete={handleHardDeleteStudent}
            onCancel={() => setDeletingStudent(null)}
          />
        </div>
      )}
    </div>
  );
}
