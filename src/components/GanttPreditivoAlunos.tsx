/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Component: GanttPreditivoAlunos
 * Análise Preditiva com Gráfico de Gantt para Previsão de Níveis e Trajetória
 * até a Formação do Músico Completo para a Orquestra CCB.
 */

import React, { useState, useMemo } from 'react';
import { Pessoa, Turma, Aula, DiarioRegistro } from '../types';
import { usePrivacy } from '../context/PrivacyContext';
import { maskName } from '../utils/masking';
import { 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Award, 
  Sparkles, 
  Sliders, 
  Search, 
  UserCheck, 
  Music, 
  GraduationCap, 
  ChevronRight, 
  RotateCcw,
  Zap,
  Target,
  ArrowRight,
  Info,
  ShieldAlert,
  Flame,
  User,
  Users,
  Layers,
  ChevronDown
} from 'lucide-react';

interface GanttPreditivoAlunosProps {
  pessoas: Pessoa[];
  turmas: Turma[];
  aulas: Aula[];
  diarios: DiarioRegistro[];
  selectedFaseFilter?: number | 'todas';
  selectedInstrumentoFilter?: string;
  selectedStatusFilter?: string;
}

// Definição dos 4 Níveis Pedagógicos até Músico Completo
export interface NivelInfo {
  fase: number;
  titulo: string;
  subtitulo: string;
  mesesPadrao: number; // Benchmark em meses para um aluno regular (frequência 80%, nota 7.5)
  objetivos: string[];
  metodoReferencia: string;
  cor: string;
  corBg: string;
  corBorda: string;
}

export const NIVEIS_ORQUESTRA: NivelInfo[] = [
  {
    fase: 1,
    titulo: 'Fase 1: Fundamentos & Iniciação',
    subtitulo: 'Teoria, Solfejo & Postura Básica',
    mesesPadrao: 6,
    objetivos: [
      'Divisão métrica com P. Bona (Ex. 1 a 23)',
      'Postura correta, empunhadura do arco ou embocadura',
      'Leitura de notas e figuras fundamentais'
    ],
    metodoReferencia: 'P. Bona Parte 1 & Métodos Iniciais',
    cor: '#0ea5e9', // Sky blue
    corBg: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
    corBorda: 'border-sky-500'
  },
  {
    fase: 2,
    titulo: 'Fase 2: Técnica & Métodos do Instrumento',
    subtitulo: 'Mecanismo, Síncopas & Posições',
    mesesPadrao: 7,
    objetivos: [
      'Bona Ex. 42 a 66 (Síncopas, Contratempos e Ponto de Aumento)',
      'Escalas do instrumento e primeiros arpejos',
      'Trocas de posições e registros intermediários'
    ],
    metodoReferencia: 'Schmoll, Giampieri, Almeida Dias ou equivalente',
    cor: '#8b5cf6', // Violet
    corBg: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
    corBorda: 'border-violet-500'
  },
  {
    fase: 3,
    titulo: 'Fase 3: Repertório Sacro & Ensaios Locais',
    subtitulo: 'Hinos de Jovens & Prática de Naipe',
    mesesPadrao: 7,
    objetivos: [
      'Hinário de Jovens e Menores a 4 vozes com afinação',
      'Compassos compostos e tercinas (Bona Ex. 75 a 90)',
      'Participação ativa nos ensaios locais preparatórios'
    ],
    metodoReferencia: 'Hinário CCB (Jovens e Menores) & Bona Parte 2',
    cor: '#f59e0b', // Amber
    corBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    corBorda: 'border-amber-500'
  },
  {
    fase: 4,
    titulo: 'Fase 4: Hinos Oficiais & Oficialização Plena',
    subtitulo: 'Músico Completo da Orquestra',
    mesesPadrao: 6,
    objetivos: [
      'Hinário Completo (Hinos 1 a 480 e Coros) em tutti',
      'Domínio das dinâmicas, afinação refinada e tempo de regência',
      'Aptidão no Teste Oficial perante a banca examinadora'
    ],
    metodoReferencia: 'Hinário Oficial CCB & Prova Prática',
    cor: '#10b981', // Emerald
    corBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    corBorda: 'border-emerald-500'
  }
];

export default function GanttPreditivoAlunos({
  pessoas,
  turmas,
  aulas,
  diarios,
  selectedFaseFilter = 'todas',
  selectedInstrumentoFilter = 'todos',
  selectedStatusFilter = 'todos'
}: GanttPreditivoAlunosProps) {
  // Privacy Mode Context
  const { isPrivacyMode } = usePrivacy();

  // Navigation & Interactive Mode
  const [viewMode, setViewMode] = useState<'overview' | 'individual'>('overview');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  
  // Local Filter & Sort States
  const [filterPreditivo, setFilterPreditivo] = useState<'todos' | 'acelerado' | 'noprazo' | 'atrasado'>('todos');
  const [sortBy, setSortBy] = useState<'proximidade' | 'risco' | 'nome' | 'instrumento'>('proximidade');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Simulator ("What-if") Override States for Individual View
  const [simulatedFrequencia, setSimulatedFrequencia] = useState<number | null>(null);
  const [simulatedNota, setSimulatedNota] = useState<number | null>(null);

  // Reference Date for Current Time ("Hoje" - 2026-09)
  const baseDate = useMemo(() => new Date(2026, 8, 1), []); // Setember 2026

  // 1. Filtrar Alunos
  const allStudents = useMemo(() => {
    return pessoas.filter(p => p.tipo === 'Aluno');
  }, [pessoas]);

  // 2. Extrair Métricas e Gerar Análise Preditiva para Cada Aluno
  const studentPredictions = useMemo(() => {
    return allStudents.map(student => {
      // Classes do aluno
      const studentTurmas = turmas.filter(t => t.alunosIds.includes(student.id));
      const studentTurmaIds = studentTurmas.map(t => t.id);
      const studentAulas = aulas.filter(a => studentTurmaIds.includes(a.turmaId));

      // Contabilizar frequência real
      let totalLogged = 0;
      let totalPresent = 0;
      let evaluatedCount = 0;
      const gradesSum = { ritmo: 0, tecnica: 0, leitura: 0, expressao: 0, teoria: 0 };

      studentAulas.forEach(aula => {
        if (aula.presencas && student.id in aula.presencas) {
          totalLogged++;
          if (aula.presencas[student.id]) {
            totalPresent++;
            const evalData = aula.avaliacoes?.[student.id];
            if (evalData) {
              gradesSum.ritmo += evalData.ritmo || 0;
              gradesSum.tecnica += evalData.tecnica || 0;
              gradesSum.leitura += evalData.leitura || 0;
              gradesSum.expressao += evalData.expressao || 0;
              gradesSum.teoria += evalData.teoria || 0;
              evaluatedCount++;
            }
          }
        }
      });

      // Frequência percentual
      const realFrequencia = totalLogged > 0 
        ? Math.round((totalPresent / totalLogged) * 100) 
        : 80; // Padrão se sem aulas ainda

      // Médias dos 5 critérios
      const mediasCriterios = {
        ritmo: evaluatedCount > 0 ? Number((gradesSum.ritmo / evaluatedCount).toFixed(1)) : 7.5,
        tecnica: evaluatedCount > 0 ? Number((gradesSum.tecnica / evaluatedCount).toFixed(1)) : 7.5,
        leitura: evaluatedCount > 0 ? Number((gradesSum.leitura / evaluatedCount).toFixed(1)) : 7.5,
        expressao: evaluatedCount > 0 ? Number((gradesSum.expressao / evaluatedCount).toFixed(1)) : 7.5,
        teoria: evaluatedCount > 0 ? Number((gradesSum.teoria / evaluatedCount).toFixed(1)) : 7.5
      };

      const mediaGeralNotas = evaluatedCount > 0
        ? Number(((mediasCriterios.ritmo + mediasCriterios.tecnica + mediasCriterios.leitura + mediasCriterios.expressao + mediasCriterios.teoria) / 5).toFixed(1))
        : 7.5;

      // Fase atual do aluno (1 a 4)
      const currentFase = Math.min(Math.max(student.fase || 1, 1), 4);

      // Calcular Fator de Velocidade Preditiva (V)
      // Benchmark padrão: Presença 80% e Nota 7.5 = V = 1.0 (no prazo exato)
      // V > 1.15 = Acelerado / Adiantado
      // 0.90 <= V <= 1.15 = No Prazo
      // 0.75 <= V < 0.90 = Atenção
      // V < 0.75 = Atrasado / Distante dos Objetivos
      const freqFactor = Math.pow(Math.max(realFrequencia, 25) / 80, 0.65);
      const gradeFactor = Math.pow(Math.max(mediaGeralNotas, 4.0) / 7.5, 0.85);
      const velocity = Number((freqFactor * gradeFactor).toFixed(2));

      // Classificação Preditiva
      let statusPreditivo: 'acelerado' | 'noprazo' | 'atencao' | 'atrasado';
      let statusLabel: string;
      let statusColor: string;
      let statusBadgeBg: string;

      if (velocity >= 1.15) {
        statusPreditivo = 'acelerado';
        statusLabel = 'Acelerado (Muito Perto)';
        statusColor = 'text-emerald-600 dark:text-emerald-400';
        statusBadgeBg = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      } else if (velocity >= 0.90) {
        statusPreditivo = 'noprazo';
        statusLabel = 'No Prazo (No Cronograma)';
        statusColor = 'text-blue-600 dark:text-blue-400';
        statusBadgeBg = 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      } else if (velocity >= 0.75) {
        statusPreditivo = 'atencao';
        statusLabel = 'Atenção (Risco Leve)';
        statusColor = 'text-amber-600 dark:text-amber-400';
        statusBadgeBg = 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      } else {
        statusPreditivo = 'atrasado';
        statusLabel = 'Distante dos Objetivos (Crítico)';
        statusColor = 'text-rose-600 dark:text-rose-400';
        statusBadgeBg = 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      }

      // Progresso percentual no nível atual (estimado a partir do desempenho e frequência)
      // Se tiver nota alta e presença alta, está mais perto de concluir a fase atual
      const progressInCurrentFase = Math.min(
        Math.max(Math.round(((realFrequencia * 0.5) + (mediaGeralNotas * 10 * 0.5))), 15),
        95
      );

      // Calcular Linha do Tempo e Datas Preditivas para Cada um dos 4 Níveis
      // Base date: Setembro de 2026
      // Se o aluno está na Fase 2 hoje:
      // - Fase 1 foi concluída há cerca de 6 meses (Março/2026)
      // - Fase 2 começou há 2 meses e deve terminar em (MesesRestantes / velocity)
      // - Fases 3 e 4 são projetadas a partir daí

      let accumulatedMonthsFromBase = 0;
      const fasesTimeline = NIVEIS_ORQUESTRA.map(nivel => {
        const isCompleted = nivel.fase < currentFase;
        const isCurrent = nivel.fase === currentFase;
        const isFuture = nivel.fase > currentFase;

        // Duração prevista para este nível com base na velocidade
        const duracaoPrevistaMeses = isCompleted
          ? nivel.mesesPadrao
          : Math.max(Math.round(nivel.mesesPadrao / Math.max(velocity, 0.4)), 3);

        let startMonthOffset: number;
        let endMonthOffset: number;
        let progressPercent: number;

        if (isCompleted) {
          // Fase do passado
          progressPercent = 100;
          const monthsAgo = (currentFase - nivel.fase) * nivel.mesesPadrao;
          startMonthOffset = -monthsAgo;
          endMonthOffset = -monthsAgo + nivel.mesesPadrao;
        } else if (isCurrent) {
          // Fase atual
          progressPercent = progressInCurrentFase;
          const remainingFactor = (100 - progressInCurrentFase) / 100;
          const remainingMonths = Math.max(Math.round(duracaoPrevistaMeses * remainingFactor), 1);
          startMonthOffset = -(duracaoPrevistaMeses - remainingMonths);
          endMonthOffset = remainingMonths;
          accumulatedMonthsFromBase += remainingMonths;
        } else {
          // Fase futura
          progressPercent = 0;
          startMonthOffset = accumulatedMonthsFromBase;
          endMonthOffset = accumulatedMonthsFromBase + duracaoPrevistaMeses;
          accumulatedMonthsFromBase += duracaoPrevistaMeses;
        }

        // Converter offsets em datas reais aproximadas
        const startDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + startMonthOffset, 1);
        const endDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + endMonthOffset, 1);

        return {
          ...nivel,
          isCompleted,
          isCurrent,
          isFuture,
          duracaoPrevistaMeses,
          progressPercent,
          startMonthOffset,
          endMonthOffset,
          startDate,
          endDate,
          formattedPeriod: `${formatMonthYear(startDate)} → ${formatMonthYear(endDate)}`
        };
      });

      // Data Final de Formação como Músico Completo (Fim da Fase 4)
      const dataConclusaoMusicoCompleto = fasesTimeline[3].endDate;
      const mesesRestantesTotal = Math.max(accumulatedMonthsFromBase, 0);

      // Desvio em relação ao benchmark padrão (adiantado em X meses ou atrasado em X meses)
      const benchmarkRestante = (4 - currentFase + 1) * 6.5;
      const deltaMeses = Math.round(benchmarkRestante - mesesRestantesTotal);

      // Identificar Gargalos Preditivos Específicos
      const gargalos: string[] = [];
      if (realFrequencia < 75) {
        gargalos.push(`Baixa Frequência (${realFrequencia}%): risco de retenção por faltas`);
      }
      if (mediasCriterios.ritmo < 7.0) {
        gargalos.push(`Ritmo Abaixo da Meta (${mediasCriterios.ritmo}/10): atrasa avanço no Bona`);
      }
      if (mediasCriterios.leitura < 7.0) {
        gargalos.push(`Leitura de Claves & Partitura Lenta (${mediasCriterios.leitura}/10)`);
      }
      if (mediasCriterios.tecnica < 7.0) {
        gargalos.push(`Mecanismo / Embocadura em Desenvolvimento (${mediasCriterios.tecnica}/10)`);
      }

      return {
        student,
        currentFase,
        realFrequencia,
        totalLogged,
        totalPresent,
        mediasCriterios,
        mediaGeralNotas,
        velocity,
        statusPreditivo,
        statusLabel,
        statusColor,
        statusBadgeBg,
        progressInCurrentFase,
        fasesTimeline,
        dataConclusaoMusicoCompleto,
        mesesRestantesTotal,
        deltaMeses,
        gargalos
      };
    });
  }, [allStudents, turmas, aulas, baseDate]);

  // 3. Aluno Selecionado para Visão Focada
  const activeStudentPrediction = useMemo(() => {
    if (selectedStudentId) {
      const found = studentPredictions.find(sp => sp.student.id === selectedStudentId);
      if (found) return found;
    }
    return studentPredictions[0] || null;
  }, [studentPredictions, selectedStudentId]);

  // 4. Efeito Simulador What-If no Aluno Ativo
  const simulatedActivePrediction = useMemo(() => {
    if (!activeStudentPrediction) return null;
    
    // Se não há sobreposição ativa no simulador, retorna os dados reais
    if (simulatedFrequencia === null && simulatedNota === null) {
      return activeStudentPrediction;
    }

    const testFreq = simulatedFrequencia !== null ? simulatedFrequencia : activeStudentPrediction.realFrequencia;
    const testNota = simulatedNota !== null ? simulatedNota : activeStudentPrediction.mediaGeralNotas;

    // Recalcular velocidade com novos parâmetros
    const freqFactor = Math.pow(Math.max(testFreq, 25) / 80, 0.65);
    const gradeFactor = Math.pow(Math.max(testNota, 4.0) / 7.5, 0.85);
    const simulatedVelocity = Number((freqFactor * gradeFactor).toFixed(2));

    // Recalcular timeline
    let accMonths = 0;
    const currentFase = activeStudentPrediction.currentFase;

    const newFasesTimeline = NIVEIS_ORQUESTRA.map(nivel => {
      const isCompleted = nivel.fase < currentFase;
      const isCurrent = nivel.fase === currentFase;
      const isFuture = nivel.fase > currentFase;

      const duracaoPrevistaMeses = isCompleted
        ? nivel.mesesPadrao
        : Math.max(Math.round(nivel.mesesPadrao / Math.max(simulatedVelocity, 0.4)), 3);

      let startMonthOffset: number;
      let endMonthOffset: number;
      let progressPercent: number;

      if (isCompleted) {
        progressPercent = 100;
        const monthsAgo = (currentFase - nivel.fase) * nivel.mesesPadrao;
        startMonthOffset = -monthsAgo;
        endMonthOffset = -monthsAgo + nivel.mesesPadrao;
      } else if (isCurrent) {
        progressPercent = activeStudentPrediction.progressInCurrentFase;
        const remainingFactor = (100 - progressPercent) / 100;
        const remainingMonths = Math.max(Math.round(duracaoPrevistaMeses * remainingFactor), 1);
        startMonthOffset = -(duracaoPrevistaMeses - remainingMonths);
        endMonthOffset = remainingMonths;
        accMonths += remainingMonths;
      } else {
        progressPercent = 0;
        startMonthOffset = accMonths;
        endMonthOffset = accMonths + duracaoPrevistaMeses;
        accMonths += duracaoPrevistaMeses;
      }

      const startDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + startMonthOffset, 1);
      const endDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + endMonthOffset, 1);

      return {
        ...nivel,
        isCompleted,
        isCurrent,
        isFuture,
        duracaoPrevistaMeses,
        progressPercent,
        startMonthOffset,
        endMonthOffset,
        startDate,
        endDate,
        formattedPeriod: `${formatMonthYear(startDate)} → ${formatMonthYear(endDate)}`
      };
    });

    const newDataConclusao = newFasesTimeline[3].endDate;
    const diffOriginalMeses = Math.round(
      (activeStudentPrediction.dataConclusaoMusicoCompleto.getTime() - newDataConclusao.getTime()) / (1000 * 60 * 60 * 24 * 30.4)
    );

    return {
      ...activeStudentPrediction,
      realFrequencia: testFreq,
      mediaGeralNotas: testNota,
      velocity: simulatedVelocity,
      fasesTimeline: newFasesTimeline,
      dataConclusaoMusicoCompleto: newDataConclusao,
      mesesRestantesTotal: accMonths,
      diffOriginalMeses,
      isSimulated: true
    };
  }, [activeStudentPrediction, simulatedFrequencia, simulatedNota, baseDate]);

  // 5. Filtrar e Ordenar Alunos na Visão Geral
  const filteredPredictions = useMemo(() => {
    return studentPredictions.filter(p => {
      // Filtro de fase
      if (selectedFaseFilter !== 'todas' && p.currentFase !== selectedFaseFilter) return false;
      // Filtro de instrumento
      if (selectedInstrumentoFilter !== 'todos' && p.student.instrumento !== selectedInstrumentoFilter) return false;
      // Filtro de status
      if (selectedStatusFilter !== 'todos' && p.student.status !== selectedStatusFilter) return false;
      // Filtro de status preditivo
      if (filterPreditivo === 'acelerado' && p.statusPreditivo !== 'acelerado') return false;
      if (filterPreditivo === 'noprazo' && p.statusPreditivo !== 'noprazo') return false;
      if (filterPreditivo === 'atrasado' && (p.statusPreditivo !== 'atencao' && p.statusPreditivo !== 'atrasado')) return false;
      // Busca por nome
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchNome = p.student.nome.toLowerCase().includes(query);
        const matchInst = (p.student.instrumento || '').toLowerCase().includes(query);
        if (!matchNome && !matchInst) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'proximidade') {
        // Mais próximos de virar músico completo (fase maior primeiro, depois menor tempo restante)
        if (b.currentFase !== a.currentFase) return b.currentFase - a.currentFase;
        return a.mesesRestantesTotal - b.mesesRestantesTotal;
      } else if (sortBy === 'risco') {
        // Maior risco / velocidade mais lenta primeiro
        return a.velocity - b.velocity;
      } else if (sortBy === 'instrumento') {
        return (a.student.instrumento || '').localeCompare(b.student.instrumento || '');
      } else {
        return a.student.nome.localeCompare(b.student.nome);
      }
    });
  }, [studentPredictions, selectedFaseFilter, selectedInstrumentoFilter, selectedStatusFilter, filterPreditivo, searchQuery, sortBy]);

  // KPIs Preditivos Globais
  const totalAlunos = studentPredictions.length;
  const aceleradosCount = studentPredictions.filter(p => p.statusPreditivo === 'acelerado').length;
  const noPrazoCount = studentPredictions.filter(p => p.statusPreditivo === 'noprazo').length;
  const emRiscoCount = studentPredictions.filter(p => p.statusPreditivo === 'atencao' || p.statusPreditivo === 'atrasado').length;
  const mediaVelocidadeGeral = totalAlunos > 0
    ? Number((studentPredictions.reduce((acc, p) => acc + p.velocity, 0) / totalAlunos).toFixed(2))
    : 1.0;

  // Régua de Tempo para o Gantt (24 colunas de trimestres / semestres: de Jan/25 a Dez/28)
  // O ponto zero ("Hoje") é o Mês 0 (Setembro de 2026)
  // Janela total do Gantt: de -18 meses (Março/2025) até +30 meses (Março/2029) = 48 meses total
  const GANTT_MIN_MONTH = -18; // Março/2025
  const GANTT_MAX_MONTH = 30;  // Março/2029
  const GANTT_TOTAL_MONTHS = GANTT_MAX_MONTH - GANTT_MIN_MONTH; // 48 meses

  // Converte um offset em meses para porcentagem no eixo X do Gantt
  const getGanttPosition = (monthOffset: number) => {
    const clamped = Math.min(Math.max(monthOffset, GANTT_MIN_MONTH), GANTT_MAX_MONTH);
    return ((clamped - GANTT_MIN_MONTH) / GANTT_TOTAL_MONTHS) * 100;
  };

  // Marcadores de ano / semestres no eixo do tempo
  const timeMarkers = [
    { offset: -18, label: '2025-S1' },
    { offset: -12, label: '2025-S2' },
    { offset: -6, label: '2026-S1' },
    { offset: 0, label: 'HOJE (2026-S2)', isToday: true },
    { offset: 6, label: '2027-S1' },
    { offset: 12, label: '2027-S2' },
    { offset: 18, label: '2028-S1' },
    { offset: 24, label: '2028-S2' },
    { offset: 30, label: '2029+' },
  ];

  return (
    <div className="space-y-6 animate-fade" id="gantt-preditivo-container">
      {/* -------------------------------------------------------------
          HERO BANNER COM PROPÓSITO PREDITIVO
          ------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider border border-blue-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Inteligência Preditiva da Orquestra
              </span>
              <span className="text-xs text-slate-300 font-medium">Linha do Tempo de Formação</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Gráfico de Gantt Preditivo & Trajetória até Músico Completo</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Algoritmo de projeção temporal que cruza <strong>frequência semanal</strong> e <strong>notas nos 5 critérios pedagógicos</strong> para prever com precisão matemática a data de conclusão de cada fase e o momento em que cada aluno estará apto a oficializar na orquestra.
            </p>
          </div>

          {/* Toggle Modo de Visualização */}
          <div className="flex items-center bg-slate-800/90 p-1.5 rounded-xl border border-slate-700/80 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'overview'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Gantt Orquestra Toda ({totalAlunos})</span>
            </button>
            <button
              onClick={() => {
                setViewMode('individual');
                if (!selectedStudentId && studentPredictions[0]) {
                  setSelectedStudentId(studentPredictions[0].student.id);
                }
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'individual'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Raio-X & Simulador Individual</span>
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          KPIS PREDITIVOS GERAIS
          ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5" id="gantt-kpis">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Alunos em Formação</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800 dark:text-white">{totalAlunos}</span>
            <span className="text-[11px] text-slate-400 font-medium">aprendizes</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Monitoramento de 4 níveis
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-emerald-500" />
              <span>Acelerados</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">&gt;1.15x</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{aceleradosCount}</span>
            <span className="text-[11px] text-emerald-600/80 font-medium">
              ({totalAlunos > 0 ? Math.round((aceleradosCount / totalAlunos) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Conclusão antes do prazo
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span>No Cronograma</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold">1.0x</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{noPrazoCount}</span>
            <span className="text-[11px] text-blue-600/80 font-medium">
              ({totalAlunos > 0 ? Math.round((noPrazoCount / totalAlunos) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Dentro da meta prevista
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-rose-200 dark:border-rose-900/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              <span>Distantes da Meta</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold">&lt;0.90x</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{emRiscoCount}</span>
            <span className="text-[11px] text-rose-600/80 font-medium">
              ({totalAlunos > 0 ? Math.round((emRiscoCount / totalAlunos) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Atraso ou faltas críticas
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Velocidade Média</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800 dark:text-white">{mediaVelocidadeGeral}x</span>
            <span className={`text-[11px] font-bold ${mediaVelocidadeGeral >= 1.0 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {mediaVelocidadeGeral >= 1.0 ? 'Ritmo positivo' : 'Ritmo desacelerado'}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            vs. tempo padrão (26 meses)
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          LEGENDA DOS 4 NÍVEIS PEDAGÓGICOS DA ORQUESTRA
          ------------------------------------------------------------- */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-blue-500" />
            Matriz dos 4 Níveis até se Tornar Músico Completo
          </span>
          <span className="text-[11px] text-slate-400">Benchmark médio total: ~26 meses de estudos dedicados</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {NIVEIS_ORQUESTRA.map(nivel => (
            <div 
              key={nivel.fase}
              className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${nivel.corBg}`}>
                  Fase {nivel.fase} &bull; {nivel.mesesPadrao} meses
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Nível {nivel.fase}/4</span>
              </div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                {nivel.titulo.split(':')[1] || nivel.titulo}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {nivel.subtitulo} &bull; {nivel.metodoReferencia}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------------
          VISÃO 1: GANTT COMPLETO DA ORQUESTRA (MULTI-ALUNOS)
          ------------------------------------------------------------- */}
      {viewMode === 'overview' && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
          {/* Barra de Filtros e Ordenação do Gantt */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/80">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Status Preditivo:</span>
              <button
                onClick={() => setFilterPreditivo('todos')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterPreditivo === 'todos'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Todos ({totalAlunos})
              </button>
              <button
                onClick={() => setFilterPreditivo('acelerado')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterPreditivo === 'acelerado'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                }`}
              >
                🟢 Acelerados ({aceleradosCount})
              </button>
              <button
                onClick={() => setFilterPreditivo('noprazo')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterPreditivo === 'noprazo'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
                }`}
              >
                🔵 No Prazo ({noPrazoCount})
              </button>
              <button
                onClick={() => setFilterPreditivo('atrasado')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterPreditivo === 'atrasado'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                }`}
              >
                🔴 Distantes / Risco ({emRiscoCount})
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Campo de Busca Rápida */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar aluno ou instrumento..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-blue-500 w-48 sm:w-56"
                />
              </div>

              {/* Seletor de Ordenação */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium"
              >
                <option value="proximidade">⭐ Mais Próximos de Músico Completo</option>
                <option value="risco">⚠️ Maior Distância / Risco de Atraso</option>
                <option value="nome">👤 Nome do Aluno</option>
                <option value="instrumento">🎺 Instrumento</option>
              </select>
            </div>
          </div>

          {/* Gráfico de Gantt Interativo Multi-Aluno */}
          <div className="space-y-4">
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[980px] space-y-3">
                {/* Cabeçalho da Linha do Tempo (Régua Temporal) */}
                <div className="grid grid-cols-12 gap-2 text-xs font-black uppercase text-slate-400 dark:text-slate-500 pb-2 border-b border-slate-200 dark:border-slate-700">
                  <div className="col-span-4 pl-2">Aluno / Instrumento / Velocidade</div>
                  <div className="col-span-8 relative">
                    <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      {timeMarkers.map(m => (
                        <span 
                          key={m.offset} 
                          className={m.isToday ? 'text-rose-500 font-extrabold underline decoration-2' : ''}
                        >
                          {m.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Linha Vertical Indicadora de "Hoje" */}
                {filteredPredictions.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                    Nenhum aluno encontrado para os filtros selecionados.
                  </div>
                ) : (
                  filteredPredictions.map(pred => {
                    const todayPosPercent = getGanttPosition(0);

                    return (
                      <div 
                        key={pred.student.id}
                        className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all border border-slate-100 dark:border-slate-800/80 group"
                      >
                        {/* Coluna 1: Informações do Aluno */}
                        <div className="col-span-4 pr-2 flex items-center justify-between">
                          <div className="space-y-0.5 truncate">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                                {maskName(pred.student.nome, isPrivacyMode)}
                              </span>
                              <span className={`text-[9px] font-black px-1.5 py-0.2 rounded border ${pred.statusBadgeBg}`}>
                                Fase {pred.currentFase}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span>{pred.student.instrumento || 'Instrumento'}</span>
                              <span>&bull;</span>
                              <span className="font-semibold text-slate-600 dark:text-slate-300">
                                Freq: {pred.realFrequencia}%
                              </span>
                              <span>&bull;</span>
                              <span className="font-semibold text-slate-600 dark:text-slate-300">
                                Média: {pred.mediaGeralNotas}
                              </span>
                              <span>&bull;</span>
                              <span className={`font-bold ${pred.statusColor}`}>
                                {pred.velocity}x
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedStudentId(pred.student.id);
                              setViewMode('individual');
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                            title="Abrir Simulador e Raio-X Detalhado"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Coluna 2: Régua de Barras do Gantt com os 4 Níveis */}
                        <div className="col-span-8 relative h-10 flex items-center">
                          {/* Trilho de Fundo */}
                          <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-700/40 rounded-full relative overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                            {/* Marcador Vertical de Hoje */}
                            <div 
                              className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-20 shadow-xs" 
                              style={{ left: `${todayPosPercent}%` }}
                              title="Hoje (Setembro/2026)"
                            />

                            {/* Barras de Cada Fase no Gantt */}
                            {pred.fasesTimeline.map(ft => {
                              const leftPercent = getGanttPosition(ft.startMonthOffset);
                              const rightPercent = getGanttPosition(ft.endMonthOffset);
                              const widthPercent = Math.max(rightPercent - leftPercent, 2);

                              let bgClass = '';
                              if (ft.isCompleted) {
                                bgClass = 'bg-emerald-500/80 dark:bg-emerald-600/90 text-white';
                              } else if (ft.isCurrent) {
                                bgClass = 'bg-blue-600 dark:bg-blue-500 text-white';
                              } else {
                                // Fase futura preditiva
                                if (pred.statusPreditivo === 'acelerado') {
                                  bgClass = 'bg-emerald-400/40 dark:bg-emerald-500/30 border border-dashed border-emerald-400';
                                } else if (pred.statusPreditivo === 'noprazo') {
                                  bgClass = 'bg-blue-400/40 dark:bg-blue-500/30 border border-dashed border-blue-400';
                                } else if (pred.statusPreditivo === 'atencao') {
                                  bgClass = 'bg-amber-400/40 dark:bg-amber-500/30 border border-dashed border-amber-400';
                                } else {
                                  bgClass = 'bg-rose-400/40 dark:bg-rose-500/30 border border-dashed border-rose-400';
                                }
                              }

                              return (
                                <div
                                  key={ft.fase}
                                  className={`absolute top-0 bottom-0 flex items-center justify-center transition-all ${bgClass}`}
                                  style={{
                                    left: `${leftPercent}%`,
                                    width: `${widthPercent}%`
                                  }}
                                  title={`Fase ${ft.fase} (${ft.formattedPeriod}) - ${ft.duracaoPrevistaMeses} meses. ${ft.isCompleted ? 'Concluída' : ft.isCurrent ? `Em Andamento (${ft.progressPercent}%)` : 'Previsão Preditiva'}`}
                                >
                                  {ft.isCompleted && (
                                    <CheckCircle2 className="w-2.5 h-2.5 text-white/90 shrink-0" />
                                  )}
                                  {ft.isCurrent && (
                                    <span className="text-[8px] font-black uppercase tracking-tighter px-1 text-white truncate">
                                      F{ft.fase} &bull; {ft.progressPercent}%
                                    </span>
                                  )}
                                  {ft.isFuture && widthPercent > 4 && (
                                    <span className="text-[8px] font-bold text-slate-600 dark:text-slate-300 truncate">
                                      F{ft.fase}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Marcador Final de Chegada / Músico Completo */}
                          <div 
                            className="absolute -top-1 z-30 flex flex-col items-center pointer-events-none"
                            style={{ 
                              left: `${Math.min(getGanttPosition(pred.fasesTimeline[3].endMonthOffset), 98)}%`,
                              transform: 'translateX(-50%)'
                            }}
                          >
                            <div className="p-1 rounded-full bg-amber-500 text-white shadow-md border border-white dark:border-slate-800">
                              <Award className="w-3 h-3" />
                            </div>
                            <span className="text-[8px] font-extrabold bg-slate-900/90 text-white px-1 rounded mt-0.5 whitespace-nowrap shadow-xs">
                              {formatMonthYear(pred.dataConclusaoMusicoCompleto)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Legenda do Gráfico de Gantt */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/80 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span>Nível Concluído</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-blue-600" />
                  <span>Nível Atual em Andamento</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-blue-300/40 border border-dashed border-blue-400" />
                  <span>Projeção Preditiva Futura</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-0.5 h-3 bg-rose-500" />
                  <span>Data Atual (Hoje)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Meta: Músico Completo da Orquestra</span>
                </div>
              </div>

              <div className="text-slate-400 text-[10px]">
                Clique no ícone de ajustes <Sliders className="w-3 h-3 inline mx-1 text-slate-400" /> para simular cenários what-if por aluno.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          VISÃO 2: RAIO-X & SIMULADOR PREDITIVO INDIVIDUAL
          ------------------------------------------------------------- */}
      {viewMode === 'individual' && activeStudentPrediction && (
        <div className="space-y-6">
          {/* Seletor de Aluno Ativo */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Aluno em Análise Focada
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {maskName(activeStudentPrediction.student.nome, isPrivacyMode)}
                </h3>
              </div>
            </div>

            {/* Dropdown de Seleção de Aluno */}
            <div className="flex items-center gap-2">
              <select
                value={activeStudentPrediction.student.id}
                onChange={(e) => {
                  setSelectedStudentId(e.target.value);
                  setSimulatedFrequencia(null);
                  setSimulatedNota(null);
                }}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold focus:ring-2 focus:ring-blue-500"
              >
                {studentPredictions.map(p => (
                  <option key={p.student.id} value={p.student.id}>
                    {maskName(p.student.nome, isPrivacyMode)} &bull; {p.student.instrumento} (Fase {p.currentFase})
                  </option>
                ))}
              </select>

              {(simulatedFrequencia !== null || simulatedNota !== null) && (
                <button
                  onClick={() => {
                    setSimulatedFrequencia(null);
                    setSimulatedNota(null);
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Restaurar dados reais"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
                  <span>Resetar Simulação</span>
                </button>
              )}
            </div>
          </div>

          {/* Cards de Diagnóstico do Aluno Ativo */}
          {simulatedActivePrediction && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Velocidade e Trajetória */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Diagnóstico de Velocidade</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${simulatedActivePrediction.statusBadgeBg}`}>
                    {simulatedActivePrediction.statusLabel}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {simulatedActivePrediction.velocity}x
                  </span>
                  <span className="text-xs text-slate-400">do ritmo padrão</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {simulatedActivePrediction.velocity >= 1.15
                    ? 'Aluno acelerado. O aprendizado flui com agilidade acima da média devido à excelente assiduidade e retenção.'
                    : simulatedActivePrediction.velocity >= 0.90
                    ? 'Aluno no prazo previsto. Mantém ritmo equilibrado e cumpre as metas do cronograma da orquestra.'
                    : simulatedActivePrediction.velocity >= 0.75
                    ? 'Atenção. O aluno apresenta pequenas instabilidades de presença ou notas que podem adiar a data da oficialização.'
                    : 'Crítico. Aluno distante dos objetivos do nível. Requer intervenção imediata dos instrutores para evitar desmotivação.'}
                </p>
              </div>

              {/* Card 2: Previsão de Formação como Músico Completo */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Previsão Oficialização</span>
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {formatMonthYear(simulatedActivePrediction.dataConclusaoMusicoCompleto)}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Tempo restante estimado:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {simulatedActivePrediction.mesesRestantesTotal} meses (~{(simulatedActivePrediction.mesesRestantesTotal / 12).toFixed(1)} anos)
                    </strong>
                  </div>
                  {simulatedActivePrediction.diffOriginalMeses !== undefined && simulatedActivePrediction.diffOriginalMeses !== 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Impacto da simulação:</span>
                      <span>
                        {simulatedActivePrediction.diffOriginalMeses > 0
                          ? `Antecipado em ${simulatedActivePrediction.diffOriginalMeses} meses`
                          : `Adiado em ${Math.abs(simulatedActivePrediction.diffOriginalMeses)} meses`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 3: Nível Atual & Distância do Próximo Nível */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Fase Atual</span>
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                    Fase {simulatedActivePrediction.currentFase} de 4
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Progresso na Fase {simulatedActivePrediction.currentFase}:</span>
                    <span>{simulatedActivePrediction.progressInCurrentFase}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${simulatedActivePrediction.progressInCurrentFase}%` }}
                    />
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {simulatedActivePrediction.progressInCurrentFase >= 80
                    ? 'Pronto para exame de transição para o próximo nível!'
                    : `Faltam cerca de ${100 - simulatedActivePrediction.progressInCurrentFase}% para concluir os requisitos da fase.`}
                </div>
              </div>
            </div>
          )}

          {/* Gráfico de Gantt do Aluno Detalhado */}
          {simulatedActivePrediction && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/80 gap-2">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>Cronograma de Gantt Individual pelos 4 Níveis da Orquestra</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Evolução estimada desde o ingresso até a formatura como Músico Completo.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  Data Base: Setembro/2026 (Hoje)
                </span>
              </div>

              {/* Linhas de Gantt Detalhadas para as 4 Fases */}
              <div className="space-y-4">
                {simulatedActivePrediction.fasesTimeline.map(ft => (
                  <div 
                    key={ft.fase}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/30 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-white"
                          style={{ backgroundColor: ft.cor }}
                        >
                          {ft.fase}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{ft.titulo}</span>
                            {ft.isCompleted && (
                              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Concluído
                              </span>
                            )}
                            {ft.isCurrent && (
                              <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center gap-1 animate-pulse">
                                Em Andamento ({ft.progressPercent}%)
                              </span>
                            )}
                            {ft.isFuture && (
                              <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                                Projeção Futura
                              </span>
                            )}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {ft.subtitulo} &bull; Duração prevista: <strong>{ft.duracaoPrevistaMeses} meses</strong> ({ft.formattedPeriod})
                          </span>
                        </div>
                      </div>

                      <div className="text-right text-xs">
                        <span className="text-slate-400 text-[10px]">Método:</span>
                        <div className="font-semibold text-slate-700 dark:text-slate-200 text-xs">
                          {ft.metodoReferencia}
                        </div>
                      </div>
                    </div>

                    {/* Barra de Progresso / Gantt do Nível */}
                    <div className="space-y-1">
                      <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${ft.progressPercent}%`,
                            backgroundColor: ft.cor
                          }}
                        />
                      </div>
                    </div>

                    {/* Objetivos Pedagógicos do Nível */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      {ft.objetivos.map((obj, i) => (
                        <div 
                          key={i} 
                          className="text-[11px] p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 flex items-start gap-1.5"
                        >
                          <span className="text-blue-500 font-bold shrink-0">&bull;</span>
                          <span>{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SIMULADOR WHAT-IF INTERATIVO & RECOMENDAÇÕES */}
          {simulatedActivePrediction && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Painel do Simulador */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-amber-600 dark:text-amber-400">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Simulador Preditivo "What-If"
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Altere a frequência e média de notas para prever o impacto na data de formação.
                    </p>
                  </div>
                </div>

                {/* Slider de Frequência */}
                <div className="space-y-2 p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Frequência Semanal Simulada:</span>
                    <span className="font-black text-blue-600 dark:text-blue-400 text-sm">
                      {simulatedActivePrediction.realFrequencia}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    step="5"
                    value={simulatedActivePrediction.realFrequencia}
                    onChange={(e) => setSimulatedFrequencia(parseInt(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>30% (Crítico)</span>
                    <span>70% (Mínimo)</span>
                    <span>85% (Ideal)</span>
                    <span>100% (Perfeito)</span>
                  </div>
                </div>

                {/* Slider de Média de Notas */}
                <div className="space-y-2 p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Média Pedagógica Simulada (5 Critérios):</span>
                    <span className="font-black text-blue-600 dark:text-blue-400 text-sm">
                      {simulatedActivePrediction.mediaGeralNotas} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4.0"
                    max="10.0"
                    step="0.2"
                    value={simulatedActivePrediction.mediaGeralNotas}
                    onChange={(e) => setSimulatedNota(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>4.0 (Insuficiente)</span>
                    <span>7.0 (Mínimo Aprovativo)</span>
                    <span>8.5 (Bom)</span>
                    <span>10.0 (Excelente)</span>
                  </div>
                </div>

                {/* Resultado da Simulação */}
                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 text-xs space-y-1.5">
                  <div className="font-black text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-blue-600" />
                    <span>Resultado do Cenário Simulado</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Com essa assiduidade e rendimento, a nova velocidade preditiva será de{' '}
                    <strong>{simulatedActivePrediction.velocity}x</strong> e o aluno concluirá a Fase 4 em{' '}
                    <strong className="text-blue-700 dark:text-blue-300">
                      {formatMonthYear(simulatedActivePrediction.dataConclusaoMusicoCompleto)}
                    </strong>.
                  </p>
                </div>
              </div>

              {/* Diagnóstico Preditivo de Gargalos & Recomendações */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                        Diagnóstico Preditivo & Recomendações
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        O que fazer para aproximar o aluno do objetivo de Músico Completo.
                      </p>
                    </div>
                  </div>

                  {/* Gargalos Atuais */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Pontos de Atenção Detectados:
                    </span>
                    {simulatedActivePrediction.gargalos.length === 0 ? (
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Nenhum gargalo crítico. O aluno está com ritmo exemplar e apto para seguir adiantado!</span>
                      </div>
                    ) : (
                      simulatedActivePrediction.gargalos.map((gargalo, idx) => (
                        <div 
                          key={idx}
                          className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{gargalo}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Plano de Ação Recomendado */}
                  <div className="mt-4 space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Plano de Ação Sugerido:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span>Manter frequência acima de 85% para não estender o prazo da fase atual.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span>Dedicar 20 minutos diários em solfejo rítmico no método P. Bona.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span>Incentivar participação como ouvinte nos ensaios locais antes da transição de nível.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Instrumento: <strong>{simulatedActivePrediction.student.instrumento}</strong></span>
                  <button
                    onClick={() => setViewMode('overview')}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
                  >
                    Voltar para Visão Orquestra Toda &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Formatar Data para "Mês/Ano" em Português
function formatMonthYear(date: Date): string {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${months[date.getMonth()]}/${date.getFullYear()}`;
}
