/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Component: Analises (Advanced Analytics Panel)
 * Adds Top Absentee Analysis, Materials Analysis, and Lesson Content Trends.
 */

import React, { useState } from 'react';
import { Pessoa, Turma, Aula, DiarioRegistro } from '../types';
import { 
  TrendingUp, 
  Users, 
  AlertCircle, 
  Calendar, 
  CheckSquare, 
  BookOpen, 
  FileSpreadsheet, 
  Flame, 
  FileText,
  SlidersHorizontal,
  FolderMinus,
  Sparkles,
  Filter,
  RotateCcw,
  Search,
  X,
  Layers,
  UserCheck,
  Music,
  GraduationCap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell,
  ScatterChart,
  Scatter,
  Legend,
  ZAxis
} from 'recharts';
import GanttPreditivoAlunos from './GanttPreditivoAlunos';

interface AnalisesProps {
  pessoas: Pessoa[];
  turmas: Turma[];
  aulas: Aula[];
  diarios: DiarioRegistro[];
}

export default function Analises({ pessoas, turmas, aulas, diarios }: AnalisesProps) {
  const [activeSubTab, setActiveSubTab] = useState<'gantt' | 'frequencia' | 'materiais' | 'gargalos' | 'correlacao'>('gantt');

  // Filter States
  const [selectedFase, setSelectedFase] = useState<number | 'todas'>('todas');
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>('todas');
  const [selectedInstrumento, setSelectedInstrumento] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Count active filters
  const activeFilterCount = (selectedFase !== 'todas' ? 1 : 0) +
    (selectedTurmaId !== 'todas' ? 1 : 0) +
    (selectedInstrumento !== 'todos' ? 1 : 0) +
    (selectedStatus !== 'todos' ? 1 : 0) +
    (searchTerm.trim() !== '' ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedFase('todas');
    setSelectedTurmaId('todas');
    setSelectedInstrumento('todos');
    setSelectedStatus('todos');
    setSearchTerm('');
  };

  // Unique instruments list
  const availableInstruments = Array.from(
    new Set(pessoas.map(p => p.instrumento).filter(Boolean))
  ).sort();

  // Filter students
  const allStudents = pessoas.filter(p => p.tipo === 'Aluno');

  const filteredStudents = allStudents.filter(student => {
    if (selectedFase !== 'todas' && student.fase !== selectedFase) {
      return false;
    }
    if (selectedStatus !== 'todos' && student.status !== selectedStatus) {
      return false;
    }
    if (selectedInstrumento !== 'todos' && student.instrumento !== selectedInstrumento) {
      return false;
    }
    if (selectedTurmaId !== 'todas') {
      const studentTurmas = turmas.filter(t => t.id === selectedTurmaId && t.alunosIds.includes(student.id));
      if (studentTurmas.length === 0) return false;
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const nameMatch = student.nome.toLowerCase().includes(term);
      const instMatch = (student.instrumento || '').toLowerCase().includes(term);
      if (!nameMatch && !instMatch) return false;
    }
    return true;
  });

  const filteredStudentIds = new Set(filteredStudents.map(s => s.id));

  // Filter lessons
  const filteredAulas = aulas.filter(aula => {
    if (selectedTurmaId !== 'todas' && aula.turmaId !== selectedTurmaId) {
      return false;
    }
    const turma = turmas.find(t => t.id === aula.turmaId);
    if (!turma) return false;

    // If student-specific filters are active, ensure class has at least one student matching
    if (selectedFase !== 'todas' || selectedInstrumento !== 'todos' || selectedStatus !== 'todos' || searchTerm.trim() !== '') {
      const hasMatchingStudent = turma.alunosIds.some(aid => filteredStudentIds.has(aid));
      if (!hasMatchingStudent) return false;
    }
    return true;
  });

  // Filter diaries
  const filteredDiarios = diarios.filter(diario => filteredStudentIds.has(diario.alunoId));

  // Helper: Normalize name capitalization
  const normalizeName = (name: string) => {
    if (!name) return '';
    const trimmed = name.trim();
    if (trimmed.length === 0) return '';
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  // -------------------------------------------------------------
  // CALCULATIONS FOR PASSO 1: FREQUENCY & ABSENTEES
  // -------------------------------------------------------------
  const students = filteredStudents;

  // Compute detailed attendance rate for each student
  const studentFrequencyData = students.map(student => {
    // Find class matches
    const studentTurmas = turmas.filter(t => t.alunosIds.includes(student.id));
    const studentTurmaIds = studentTurmas.map(t => t.id);

    // Lessons relevant to the student
    const relevantAulas = filteredAulas.filter(a => studentTurmaIds.includes(a.turmaId));

    let loggedLessons = 0;
    let presentLessons = 0;

    relevantAulas.forEach(aula => {
      if (aula.presencas && student.id in aula.presencas) {
        loggedLessons++;
        if (aula.presencas[student.id]) {
          presentLessons++;
        }
      }
    });

    const frequency = loggedLessons > 0 ? Math.round((presentLessons / loggedLessons) * 100) : 100; // Default to 100 if no lessons logged

    return {
      student,
      frequency,
      totalLessons: loggedLessons,
      presentCount: presentLessons,
      absentCount: loggedLessons - presentLessons
    };
  });

  // KPI calculations
  const totalStudentsWithLessons = studentFrequencyData.filter(s => s.totalLessons > 0).length;
  const generalAverageAttendance = totalStudentsWithLessons > 0
    ? Math.round(studentFrequencyData.filter(s => s.totalLessons > 0).reduce((acc, s) => acc + s.frequency, 0) / totalStudentsWithLessons)
    : 0;

  const lowAttendanceCount = studentFrequencyData.filter(s => s.totalLessons > 0 && s.frequency < 70).length;
  const highAttendanceCount = studentFrequencyData.filter(s => s.totalLessons > 0 && s.frequency >= 90).length;

  // Top 10 worst attendance records for Bar Chart
  const top10AbsenteeData = [...studentFrequencyData]
    .filter(s => s.totalLessons > 0)
    .sort((a, b) => a.frequency - b.frequency)
    .slice(0, 10)
    .map(s => ({
      name: s.student.nome.split(' ')[0] + ' ' + (s.student.nome.split(' ').slice(-1)[0] || ''),
      frequencia: s.frequency,
      originalName: s.student.nome,
      instrumento: s.student.instrumento,
      fase: s.student.fase
    }));

  // Frequency distribution (Histogram)
  const distributionData = [
    { name: '0 - 20%', count: 0 },
    { name: '21 - 40%', count: 0 },
    { name: '41 - 60%', count: 0 },
    { name: '61 - 80%', count: 0 },
    { name: '81 - 100%', count: 0 }
  ];

  studentFrequencyData.forEach(s => {
    if (s.totalLessons === 0) return;
    if (s.frequency <= 20) distributionData[0].count++;
    else if (s.frequency <= 40) distributionData[1].count++;
    else if (s.frequency <= 60) distributionData[2].count++;
    else if (s.frequency <= 80) distributionData[3].count++;
    else distributionData[4].count++;
  });

  // Table of low-attendance students (< 70%)
  const lowAttendanceList = studentFrequencyData
    .filter(s => s.totalLessons > 0 && s.frequency < 70)
    .sort((a, b) => a.frequency - b.frequency);


  // -------------------------------------------------------------
  // CALCULATIONS FOR PASSO 2: MATERIALS & CONTENTS
  // -------------------------------------------------------------
  const getTopMaterials = () => {
    const counts: Record<string, number> = {};

    // Standard materials to normalize on keywords
    const standardMaterials = [
      { regex: /metr[ôo]nomo/i, label: 'Metrônomo' },
      { regex: /playback|áudio|backing|faixa/i, label: 'Playback / Áudios' },
      { regex: /partitura|m[ée]todo|hino|caderno/i, label: 'Partituras / Métodos' },
      { regex: /grava[çc][ão]o|v[íi]deo/i, label: 'Gravações / Vídeos' },
      { regex: /escala|exerc[íi]cio/i, label: 'Exercícios de Escala' }
    ];

    const parseField = (materialField?: string) => {
      if (!materialField) return;
      
      // Try parsing standard general categorized lists
      let matched = false;
      standardMaterials.forEach(sm => {
        if (sm.regex.test(materialField)) {
          counts[sm.label] = (counts[sm.label] || 0) + 1;
          matched = true;
        }
      });

      // Split individual comma-separated entries
      const individualItems = materialField.split(/[,;+]/);
      individualItems.forEach(item => {
        const cleanItem = normalizeName(item);
        if (cleanItem && cleanItem.length > 2) {
          // Avoid duplicating standard general categories too closely
          const isStopword = ['E', 'De', 'O', 'Do', 'Da', 'Em', 'Com'].includes(cleanItem);
          if (!isStopword) {
            counts[cleanItem] = (counts[cleanItem] || 0) + 1;
          }
        }
      });
    };

    aulas.forEach(a => parseField(a.material));
    diarios.forEach(d => parseField(d.material));

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  const getTopContents = () => {
    const counts: Record<string, number> = {};

    // Smart content categorization keywords
    const contentCategories = [
      { regex: /escala|dedilhado|arpejo/i, label: 'Escalas e Arpejos' },
      { regex: /hino|repert[óo]rio|pe[çc]a/i, label: 'Hinos e Repertório' },
      { regex: /postura|arco|embocadura/i, label: 'Postura e Mecânica' },
      { regex: /respira|coluna/i, label: 'Sopro e Respiração' },
      { regex: /leitura|r[íi]tmica|partitura|solfejo/i, label: 'Leitura Rítmica' },
      { regex: /teoria|clave|tempo|compasso/i, label: 'Teoria e Ritmo' },
      { regex: /articula|ligadura|staccato/i, label: 'Articulação / Técnica' },
      { regex: /afina/i, label: 'Afinação de Ouvido' }
    ];

    const parseText = (text?: string) => {
      if (!text) return;
      let matched = false;

      contentCategories.forEach(cat => {
        if (kwMatches(text, cat.regex)) {
          counts[cat.label] = (counts[cat.label] || 0) + 1;
          matched = true;
        }
      });

      if (!matched) {
        // Fallback split
        const parts = text.split(/[,;]/);
        parts.forEach(part => {
          const cleanPart = normalizeName(part);
          if (cleanPart && cleanPart.length > 5 && cleanPart.length < 32) {
            counts[cleanPart] = (counts[cleanPart] || 0) + 1;
          }
        });
      }
    };

    function kwMatches(text: string, regex: RegExp): boolean {
      return regex.test(text);
    }

    aulas.forEach(a => parseText(a.conteudo));
    diarios.forEach(d => parseText(d.conteudo));

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  const topMaterials = getTopMaterials();
  const topContents = getTopContents();

  // -------------------------------------------------------------
  // CALCULATIONS FOR PASSO 3: BOTTLENECKS (GARGALOS POR FASE)
  // -------------------------------------------------------------
  const studentsByPhase = {
    1: [] as Pessoa[],
    2: [] as Pessoa[],
    3: [] as Pessoa[],
    4: [] as Pessoa[]
  };

  students.forEach(student => {
    const phase = student.fase || 1;
    if (phase >= 1 && phase <= 4) {
      studentsByPhase[phase as 1 | 2 | 3 | 4].push(student);
    }
  });

  const phaseCounts = [
    { phase: 1, name: 'Fase 1', fullName: 'Fase 1 - Fundamentos', count: studentsByPhase[1].length, description: 'Estudo de pauta, notas e figuras básicas de ritmo.' },
    { phase: 2, name: 'Fase 2', fullName: 'Fase 2 - Técnica', count: studentsByPhase[2].length, description: 'Postura, dedilhado e controle do instrumento musical.' },
    { phase: 3, name: 'Fase 3', fullName: 'Fase 3 - Hinos Jovens', count: studentsByPhase[3].length, description: 'Prática de hinos dinâmicos com ritmos diversos.' },
    { phase: 4, name: 'Fase 4', fullName: 'Fase 4 - Hinos Oficiais', count: studentsByPhase[4].length, description: 'Andamentos solenes, afinação e execução orquestral.' }
  ];

  let bottleneckPhase = phaseCounts[0];
  phaseCounts.forEach(pc => {
    if (pc.count > bottleneckPhase.count) {
      bottleneckPhase = pc;
    }
  });

  const phasePerformance = {
    1: { ritmo: 0, tecnica: 0, leitura: 0, expressao: 0, teoria: 0, count: 0 },
    2: { ritmo: 0, tecnica: 0, leitura: 0, expressao: 0, teoria: 0, count: 0 },
    3: { ritmo: 0, tecnica: 0, leitura: 0, expressao: 0, teoria: 0, count: 0 },
    4: { ritmo: 0, tecnica: 0, leitura: 0, expressao: 0, teoria: 0, count: 0 }
  };

  filteredAulas.forEach(aula => {
    if (aula.avaliacoes) {
      Object.entries(aula.avaliacoes).forEach(([alunoId, evalObj]) => {
        const student = students.find(s => s.id === alunoId);
        const phase = (student?.fase || 1) as 1 | 2 | 3 | 4;
        if (phase >= 1 && phase <= 4) {
          phasePerformance[phase].ritmo += evalObj.ritmo || 0;
          phasePerformance[phase].tecnica += evalObj.tecnica || 0;
          phasePerformance[phase].leitura += evalObj.leitura || 0;
          phasePerformance[phase].expressao += evalObj.expressao || 0;
          phasePerformance[phase].teoria += evalObj.teoria || 0;
          phasePerformance[phase].count++;
        }
      });
    }
  });

  const phaseStats = Object.entries(phasePerformance).map(([phaseStr, sumData]) => {
    const phase = parseInt(phaseStr) as 1 | 2 | 3 | 4;
    const count = sumData.count;
    return {
      phase,
      count,
      avgRitmo: count > 0 ? Number((sumData.ritmo / count).toFixed(1)) : 0,
      avgTecnica: count > 0 ? Number((sumData.tecnica / count).toFixed(1)) : 0,
      avgLeitura: count > 0 ? Number((sumData.leitura / count).toFixed(1)) : 0,
      avgExpressao: count > 0 ? Number((sumData.expressao / count).toFixed(1)) : 0,
      avgTeoria: count > 0 ? Number((sumData.teoria / count).toFixed(1)) : 0,
      avgGeral: count > 0 ? Number(((sumData.ritmo + sumData.tecnica + sumData.leitura + sumData.expressao + sumData.teoria) / (5 * count)).toFixed(1)) : 0
    };
  });

  const bottleneckStats = phaseStats.find(ps => ps.phase === bottleneckPhase.phase);

  const getBottleneckReason = () => {
    if (!bottleneckStats || bottleneckStats.count === 0) {
      return {
        competency: 'Leitura/Técnica',
        score: 6.0,
        explanation: 'indica a necessidade de reforço prático nas lições de métodos.'
      };
    }

    const comps = [
      { key: 'Ritmo / Tempo', score: bottleneckStats.avgRitmo, explanation: 'indica que os alunos têm dificuldades em andamento, pulsação estável e divisões rítmicas complexas.' },
      { key: 'Técnica do Instrumento', score: bottleneckStats.avgTecnica, explanation: 'revela limitações de postura, dedilhado, controle de arco/embocadura ou digitação mecânica.' },
      { key: 'Leitura Musical', score: bottleneckStats.avgLeitura, explanation: 'sinaliza lentidão na decodificação de notas na clave e leitura à primeira vista das partituras.' },
      { key: 'Expressão / Dinâmica', score: bottleneckStats.avgExpressao, explanation: 'mostra necessidade de trabalhar intensidade sonora (piano, forte, crescentes) e fraseados expressivos.' },
      { key: 'Teoria Musical', score: bottleneckStats.avgTeoria, explanation: 'aponta que os alunos necessitam de maior fixação de conceitos teóricos de armadura de clave e valores.' }
    ];

    comps.sort((a, b) => a.score - b.score);
    return {
      competency: comps[0].key,
      score: comps[0].score,
      explanation: comps[0].explanation
    };
  };

  const bottleneckReason = getBottleneckReason();

  const CustomBottleneckTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isBottleneck = data.phase === bottleneckPhase.phase;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-700 text-xs font-semibold shadow-xl max-w-[240px]">
          <p className="font-bold text-slate-200">{data.fullName}</p>
          <p className="text-[10px] text-slate-400 mt-1">{data.description}</p>
          <p className="mt-2.5 flex items-center gap-1.5 font-bold">
            <span className={`w-1.5 h-1.5 rounded-full ${isBottleneck ? 'bg-rose-500' : 'bg-indigo-400'}`} />
            <span>Alunos ativos: {payload[0].value}</span>
          </p>
          {isBottleneck && (
            <p className="text-[10px] text-rose-300 bg-rose-950/40 border border-rose-900/30 rounded-lg p-1.5 mt-2">
              🚨 Gargalo Crítico Concentrado
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom tooltips for Chart styling
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-700 text-xs font-semibold shadow-xl">
          <p className="font-bold text-slate-300">{payload[0].payload.originalName || payload[0].name}</p>
          <p className="mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Frequência: {payload[0].value}%</span>
          </p>
          {payload[0].payload.instrumento && (
            <p className="text-[10px] text-slate-400 mt-1">🎻 Instrumento: {payload[0].payload.instrumento}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomCountTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-700 text-xs font-semibold shadow-xl">
          <p className="font-bold text-slate-300">{payload[0].name}</p>
          <p className="mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Frequência de Uso: {payload[0].value} {payload[0].value === 1 ? 'vez' : 'vezes'}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // -------------------------------------------------------------
  // CALCULATIONS FOR PASSO 4 & 5: CORRELATION (ATTENDANCE & JOURNAL)
  // -------------------------------------------------------------
  function calculatePearsonCorrelation(x: number[], y: number[]) {
    const n = x.length;
    if (n === 0) return 0;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
    const sumY2 = y.reduce((sum, val) => sum + val * val, 0);

    const num = n * sumXY - sumX * sumY;
    const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    if (den === 0) return 0;
    return Number((num / den).toFixed(2));
  }

  // Map each student to their attendance rate and overall grade
  const correlationData = students.map(student => {
    // 1. Calculate attendance rate
    const studentTurmas = turmas.filter(t => t.alunosIds.includes(student.id));
    const studentTurmaIds = studentTurmas.map(t => t.id);
    const relevantAulas = filteredAulas.filter(a => studentTurmaIds.includes(a.turmaId));

    let loggedLessons = 0;
    let presentLessons = 0;
    let evaluatedLessons = 0;
    const gradesSum = { ritmo: 0, tecnica: 0, leitura: 0, expressao: 0, teoria: 0 };

    relevantAulas.forEach(aula => {
      if (aula.presencas && student.id in aula.presencas) {
        loggedLessons++;
        if (aula.presencas[student.id]) {
          presentLessons++;
          
          // Accumulate grades if evaluated
          const evalData = aula.avaliacoes?.[student.id];
          if (evalData) {
            gradesSum.ritmo += evalData.ritmo || 0;
            gradesSum.tecnica += evalData.tecnica || 0;
            gradesSum.leitura += evalData.leitura || 0;
            gradesSum.expressao += evalData.expressao || 0;
            gradesSum.teoria += evalData.teoria || 0;
            evaluatedLessons++;
          }
        }
      }
    });

    const frequency = loggedLessons > 0 ? Math.round((presentLessons / loggedLessons) * 100) : 100;
    
    const averages = {
      ritmo: evaluatedLessons > 0 ? Number((gradesSum.ritmo / evaluatedLessons).toFixed(1)) : 0,
      tecnica: evaluatedLessons > 0 ? Number((gradesSum.tecnica / evaluatedLessons).toFixed(1)) : 0,
      leitura: evaluatedLessons > 0 ? Number((gradesSum.leitura / evaluatedLessons).toFixed(1)) : 0,
      expressao: evaluatedLessons > 0 ? Number((gradesSum.expressao / evaluatedLessons).toFixed(1)) : 0,
      teoria: evaluatedLessons > 0 ? Number((gradesSum.teoria / evaluatedLessons).toFixed(1)) : 0
    };
    
    const overallAverage = evaluatedLessons > 0 
      ? Number(((averages.ritmo + averages.tecnica + averages.leitura + averages.expressao + averages.teoria) / 5).toFixed(1))
      : 0;

    // Categorized zone
    let zone: 'Sucesso' | 'Risco' | 'Pedagógico' | 'Independente' | 'Normal' = 'Normal';
    let color = '#94a3b8'; // Slate
    if (frequency >= 80 && overallAverage >= 7.0) {
      zone = 'Sucesso';
      color = '#10b981'; // Emerald
    } else if (frequency < 70 && overallAverage < 6.0) {
      zone = 'Risco';
      color = '#f43f5e'; // Rose
    } else if (frequency >= 80 && overallAverage < 6.0) {
      zone = 'Pedagógico';
      color = '#fbbf24'; // Amber
    } else if (frequency < 70 && overallAverage >= 7.0) {
      zone = 'Independente';
      color = '#8b5cf6'; // Violet
    } else {
      color = '#0284c7'; // Sky Blue
    }

    return {
      id: student.id,
      name: student.nome,
      shortName: student.nome.split(' ')[0] + ' ' + (student.nome.split(' ').slice(-1)[0] || ''),
      frequencia: frequency,
      nota: overallAverage,
      totalAulas: loggedLessons,
      totalEvaluations: evaluatedLessons,
      instrumento: student.instrumento || '-',
      fase: student.fase || 1,
      status: student.status || 'Aprendiz',
      zone,
      color
    };
  });

  const validScatterData = correlationData.filter(item => item.totalAulas > 0 && item.totalEvaluations > 0);

  const rValue = calculatePearsonCorrelation(
    validScatterData.map(d => d.frequencia),
    validScatterData.map(d => d.nota)
  );

  const getPearsonInterpretation = (r: number) => {
    if (r >= 0.7) {
      return {
        label: 'Forte Correlação Positiva',
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30',
        desc: 'A presença em sala de aula está intimamente ligada a notas mais altas. Alunos frequentes têm excelente desempenho.'
      };
    } else if (r >= 0.4) {
      return {
        label: 'Correlação Positiva Moderada',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30',
        desc: 'Existe uma tendência clara de que maior frequência impulsiona melhores notas, embora outros fatores influenciem.'
      };
    } else if (r > 0) {
      return {
        label: 'Correlação Positiva Fraca',
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30',
        desc: 'A presença tem impacto leve nas notas. Outros fatores (estudo extra, talento ou facilidade) têm papel relevante.'
      };
    } else if (r === 0) {
      return {
        label: 'Nenhuma Correlação Detectada',
        color: 'text-slate-600 dark:text-slate-400',
        bgColor: 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800/30',
        desc: 'Não há relação linear aparente entre a frequência das aulas e as médias obtidas.'
      };
    } else {
      return {
        label: 'Correlação Inversa (Atípica)',
        color: 'text-rose-600 dark:text-rose-400',
        bgColor: 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30',
        desc: 'Inversão estatística incomum: alunos com menos faltas estão pontuando menos. Investigue casos individuais.'
      };
    }
  };

  const interpretation = getPearsonInterpretation(rValue);

  // Group metrics
  const successCount = validScatterData.filter(d => d.zone === 'Sucesso').length;
  const riskCount = validScatterData.filter(d => d.zone === 'Risco').length;
  const pedagogicalCount = validScatterData.filter(d => d.zone === 'Pedagógico').length;
  const independentCount = validScatterData.filter(d => d.zone === 'Independente').length;

  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-700 text-xs font-semibold shadow-xl max-w-[240px]">
          <p className="font-bold text-slate-200">{data.name}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{data.instrumento} · Fase {data.fase}</p>
          <div className="border-t border-slate-800 my-2 pt-1.5 space-y-1">
            <p className="flex justify-between gap-4">
              <span className="text-slate-400 font-medium">Frequência:</span>
              <span className="font-bold text-blue-400">{data.frequencia}%</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-400 font-medium">Média Geral:</span>
              <span className="font-bold text-emerald-400">{data.nota} / 10</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-400 font-medium">Aulas Assistidas:</span>
              <span className="font-bold">{data.totalEvaluations}</span>
            </p>
          </div>
          <div className="text-[9px] font-extrabold uppercase tracking-wide mt-2 text-center py-1 rounded bg-slate-800/80" style={{ color: data.color }}>
            Zona: {data.zone === 'Sucesso' ? '🟢 Sucesso' : data.zone === 'Risco' ? '🔴 Risco de Evasão' : data.zone === 'Pedagógico' ? '🟡 Apoio Pedagógico' : data.zone === 'Independente' ? '🟣 Excelente Autônomo' : '🔵 Regular'}
          </div>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="space-y-6" id="analises-tab-container">
      {/* Tab Header Box */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5.5 h-5.5 text-blue-500" />
            <span>Painel de Análises Avançadas</span>
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">Mapeamento inteligente de frequência, tendências de materiais e gargalos de conteúdo.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap bg-slate-50 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80 gap-1">
          <button
            onClick={() => setActiveSubTab('gantt')}
            className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${activeSubTab === 'gantt' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-white/60 dark:hover:bg-slate-800'}`}
          >
            <Calendar className="w-4 h-4 text-amber-300" />
            <span>Gantt Preditivo (Níveis)</span>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${activeSubTab === 'gantt' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
              Novo
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab('frequencia')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeSubTab === 'frequencia' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Frequência & Faltosos</span>
          </button>
          <button
            onClick={() => setActiveSubTab('materiais')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeSubTab === 'materiais' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Materiais & Conteúdo</span>
          </button>
          <button
            onClick={() => setActiveSubTab('gargalos')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeSubTab === 'gargalos' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Gargalos por Fase</span>
          </button>
          <button
            onClick={() => setActiveSubTab('correlacao')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeSubTab === 'correlacao' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Correlação (Freq x Notas)</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          FILTER CONTROL BAR
          ------------------------------------------------------------- */}
      <div className="bg-white dark:bg-slate-800 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        {/* Top row: Header & summary info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
              <Filter className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>Filtros de Exibição das Análises</span>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500 text-white">
                    {activeFilterCount} {activeFilterCount === 1 ? 'ativo' : 'ativos'}
                  </span>
                )}
              </h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Filtre por fase, turma, instrumento, status ou nome para personalizar todas as análises abaixo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
              Exibindo <strong className="text-blue-600 dark:text-blue-400 font-extrabold">{filteredStudents.length}</strong> de {allStudents.length} alunos
            </span>

            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/30 px-3 py-1.5 rounded-xl border border-rose-200/60 dark:border-rose-900/40 transition-colors cursor-pointer"
                title="Limpar todos os filtros"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar Filtros</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Buttons Row for Phase */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Layers className="w-3 h-3 text-indigo-500" />
            <span>Filtrar por Fase:</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFase('todas')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFase === 'todas'
                  ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Todas as Fases
            </button>
            {[1, 2, 3, 4].map(fase => (
              <button
                key={fase}
                onClick={() => setSelectedFase(fase)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedFase === fase
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${selectedFase === fase ? 'bg-white' : 'bg-blue-500'}`} />
                <span>Fase {fase}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dropdowns & Search Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Turma Select */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Users className="w-3 h-3 text-blue-500" />
              <span>Turma / Grupo</span>
            </label>
            <select
              value={selectedTurmaId}
              onChange={(e) => setSelectedTurmaId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
            >
              <option value="todas">Todas as Turmas</option>
              {turmas.map(t => (
                <option key={t.id} value={t.id}>
                  {t.nome} ({t.instrumento || t.nivel})
                </option>
              ))}
            </select>
          </div>

          {/* Instrumento Select */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Music className="w-3 h-3 text-teal-500" />
              <span>Instrumento</span>
            </label>
            <select
              value={selectedInstrumento}
              onChange={(e) => setSelectedInstrumento(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/40 cursor-pointer"
            >
              <option value="todos">Todos os Instrumentos</option>
              {availableInstruments.map(inst => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-emerald-500" />
              <span>Status do Aluno</span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
            >
              <option value="todos">Todos os Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Em Observação">Em Observação</option>
              <option value="Afastado">Afastado</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Search className="w-3 h-3 text-amber-500" />
              <span>Buscar por Nome</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nome do aluno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl pl-8 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/40 placeholder:text-slate-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          SUB-TAB: FREQUENCY & TOP ABSENTEES
          ------------------------------------------------------------- */}
      {activeSubTab === 'frequencia' && (
        <div className="space-y-6 animate-fade">
          {/* KPI Dashboard Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="frequency-kpis">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs text-center flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Frequência Geral Média</span>
              <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{generalAverageAttendance}%</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs text-center flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Alunos Analisados</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{totalStudentsWithLessons}</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs text-center flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-rose-500 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Risco Faltas (&lt; 70%)</span>
              </span>
              <span className="text-2xl font-extrabold text-rose-500 mt-1">{lowAttendanceCount}</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs text-center flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-emerald-500 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Excelente (≥ 90%)</span>
              </span>
              <span className="text-2xl font-extrabold text-emerald-500 mt-1">{highAttendanceCount}</span>
            </div>
          </div>

          {/* Recharts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 10 Absentees Chart */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Top 10 Alunos com Menor Frequência</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Listagem de alunos necessitando de atenção ou reagendamento de aulas.</p>
              </div>

              {top10AbsenteeData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400 text-xs italic">
                  Sem dados suficientes de chamadas para gerar gráfico.
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={top10AbsenteeData}
                      layout="vertical"
                      margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={100} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="frequencia" radius={[0, 8, 8, 0]} barSize={12}>
                        {top10AbsenteeData.map((entry, index) => {
                          let color = '#10b981'; // green
                          if (entry.frequencia < 50) color = '#ef4444'; // red
                          else if (entry.frequencia < 75) color = '#f59e0b'; // amber
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Attendance Distribution Chart */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Distribuição Geral de Frequência</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Análise agregada de faixas percentuais de frequência dos alunos.</p>
              </div>

              {totalStudentsWithLessons === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400 text-xs italic">
                  Sem dados de aulas para classificar distribuição.
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={distributionData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} allowDecimals={false} />
                      <Tooltip content={<CustomCountTooltip />} />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={32}>
                        {distributionData.map((entry, index) => {
                          let color = '#60a5fa'; // default blue
                          if (index === 0 || index === 1) color = '#f87171'; // bad ranges
                          else if (index === 2) color = '#fbbf24'; // middle range
                          else color = '#34d399'; // great ranges
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Table Detail */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-rose-500" />
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Lista de Foco: Alunos com Baixa Frequência (&lt; 70%)</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Estes alunos correm o risco de perder as metas das fases por faltas recorrentes.</p>
              </div>
            </div>

            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-700/80">
                    <th className="py-3 px-5 text-[10px] uppercase font-extrabold text-slate-400 dark:text-slate-500">Nome do Aluno</th>
                    <th className="py-3 px-4 text-[10px] uppercase font-extrabold text-slate-400 dark:text-slate-500">Instrumento</th>
                    <th className="py-3 px-4 text-[10px] uppercase font-extrabold text-slate-400 dark:text-slate-500 text-center">Fase</th>
                    <th className="py-3 px-4 text-[10px] uppercase font-extrabold text-slate-400 dark:text-slate-500 text-center">Aulas Registradas</th>
                    <th className="py-3 px-4 text-[10px] uppercase font-extrabold text-slate-400 dark:text-slate-500 text-center">Aulas Presente</th>
                    <th className="py-3 px-5 text-[10px] uppercase font-extrabold text-slate-400 dark:text-slate-500 text-center">Frequência</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {lowAttendanceList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 italic">
                        🎉 Excelente! Nenhum aluno ativo com frequência abaixo de 70%!
                      </td>
                    </tr>
                  ) : (
                    lowAttendanceList.map(row => (
                      <tr key={row.student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                        <td className="py-2.5 px-5 text-xs font-bold text-slate-800 dark:text-slate-200">{row.student.nome}</td>
                        <td className="py-2.5 px-4 text-xs text-slate-500 dark:text-slate-400">{row.student.instrumento || '-'}</td>
                        <td className="py-2.5 px-4 text-xs text-center">
                          {row.student.fase ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              Fase {row.student.fase}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="py-2.5 px-4 text-xs text-center text-slate-500 dark:text-slate-400">{row.totalLessons}</td>
                        <td className="py-2.5 px-4 text-xs text-center text-emerald-600 dark:text-emerald-400 font-bold">{row.presentCount}</td>
                        <td className="py-2.5 px-5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${row.frequency < 50 ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-900'}`}>
                            {row.frequency}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          SUB-TAB: MATERIALS & CONTENTS (PASSO 2)
          ------------------------------------------------------------- */}
      {activeSubTab === 'materiais' && (
        <div className="space-y-6 animate-fade">
          {/* Quick Informational Sparkle Card */}
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 p-4 rounded-2xl border border-blue-200/50 dark:border-blue-900/40 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-extrabold text-blue-800 dark:text-blue-300 block">Diagnóstico de Materiais e Temas</span>
              <p className="text-blue-700/90 dark:text-blue-400 leading-relaxed">
                Essas estatísticas são calculadas varrendo dinamicamente as strings de <strong>Material Utilizado</strong> e de <strong>Conteúdo Lecionado</strong> nas aulas registradas e diários individuais de alunos. Isso ajuda a coordenar os métodos de ensino mais produtivos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Materials Chart */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Materiais de Estudo Mais Utilizados</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Mapeia quais materiais, métodos ou mídias são mais compartilhados nas lições.</p>
              </div>

              {topMaterials.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400 text-xs italic">
                  Nenhum material de estudo foi registrado nas aulas ou diários ainda.
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topMaterials}
                      margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} allowDecimals={false} />
                      <Tooltip content={<CustomCountTooltip />} />
                      <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={24}>
                        {topMaterials.map((entry, index) => {
                          const colors = ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#6366f1', '#06b6d4'];
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Top Content Categories Chart */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Foco dos Conteúdos Ensinados</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Demonstra quais os temas rítmicos, práticos e teóricos estão recebendo maior volume de atenção.</p>
              </div>

              {topContents.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400 text-xs italic">
                  Nenhum conteúdo lecionado foi categorizado nas lições ou diários ainda.
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topContents}
                      margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} allowDecimals={false} />
                      <Tooltip content={<CustomCountTooltip />} />
                      <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24}>
                        {topContents.map((entry, index) => {
                          const colors = ['#0d9488', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#4f46e5', '#f43f5e'];
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Quick insight section based on parsed content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-1.5 uppercase tracking-wider text-slate-400">
                <span>📚 Detalhamento dos Materiais</span>
              </h4>
              <div className="space-y-2">
                {topMaterials.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Nenhum registro de materiais.</p>
                ) : (
                  topMaterials.map((mat, i) => (
                    <div key={mat.name} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {i + 1}. {mat.name}
                      </span>
                      <span className="text-xs bg-blue-100 dark:bg-blue-950 font-bold px-2.5 py-1 rounded-lg text-blue-700 dark:text-blue-400">
                        {mat.count} usos
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-1.5 uppercase tracking-wider text-slate-400">
                <span>🎯 Detalhamento das Categorias de Foco</span>
              </h4>
              <div className="space-y-2">
                {topContents.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Nenhum registro de conteúdos.</p>
                ) : (
                  topContents.map((cont, i) => (
                    <div key={cont.name} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {i + 1}. {cont.name}
                      </span>
                      <span className="text-xs bg-teal-100 dark:bg-teal-950/40 font-bold px-2.5 py-1 rounded-lg text-teal-700 dark:text-teal-400">
                        {cont.count} lições
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          SUB-TAB: BOTTLENECKS (PASSO 3)
          ------------------------------------------------------------- */}
      {activeSubTab === 'gargalos' && (
        <div className="space-y-6 animate-fade">
          {/* Diagnostic Sparkle Header */}
          <div className="bg-rose-500/10 dark:from-rose-500/5 dark:to-pink-500/5 p-4.5 rounded-2xl border border-rose-200/50 dark:border-rose-950/40 flex items-start gap-3">
            <AlertCircle className="w-5.5 h-5.5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-extrabold text-rose-800 dark:text-rose-300 block">
                Detecção de Gargalo Ativa: {bottleneckPhase.fullName}
              </span>
              <p className="text-rose-700/95 dark:text-rose-300 leading-relaxed font-semibold">
                Esta fase concentra o maior volume de estudantes da escola/orquestra, com{' '}
                <strong>{bottleneckPhase.count} alunos ativos</strong> ({Math.round((bottleneckPhase.count / (students.length || 1)) * 100)}% do corpo discente).
                {bottleneckReason.score > 0 ? (
                  <span>
                    {' '}O indicador crítico de desempenho desta fase é <strong>{bottleneckReason.competency}</strong> com pontuação média de{' '}
                    <strong>{bottleneckReason.score}/10</strong>, o que {bottleneckReason.explanation}
                  </span>
                ) : (
                  ' Registre mais avaliações práticas nas aulas dessa fase para gerar análises detalhadas de competência musical.'
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Phase Concentration Bar Chart */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Distribuição de Alunos por Fase</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Mapeamento de densidade de alunos em cada etapa formativa (Gargalo destacado em vermelho).</p>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={phaseCounts} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} allowDecimals={false} />
                    <Tooltip content={<CustomBottleneckTooltip />} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
                      {phaseCounts.map((entry, index) => {
                        const isBottleneck = entry.phase === bottleneckPhase.phase;
                        return <Cell key={`cell-${index}`} fill={isBottleneck ? '#f43f5e' : '#3b82f6'} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Averages per Phase Chart */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Média Geral de Competências por Fase</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Média ponderada agregada das notas de Ritmo, Técnica, Leitura, Expressão e Teoria.</p>
              </div>

              {phaseStats.every(p => p.count === 0) ? (
                <div className="h-64 flex items-center justify-center text-slate-400 text-xs italic">
                  Sem dados de avaliações suficientes nas aulas para traçar médias gerais.
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={phaseStats} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="phase" tickFormatter={(v) => `Fase ${v}`} stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" domain={[0, 10]} fontSize={10} />
                      <Tooltip formatter={(value) => [`${value} / 10`, 'Média Geral']} labelFormatter={(label) => `Fase ${label}`} />
                      <Bar dataKey="avgGeral" radius={[8, 8, 0, 0]} barSize={40}>
                        {phaseStats.map((entry, index) => {
                          const isBottleneck = entry.phase === bottleneckPhase.phase;
                          return <Cell key={`cell-${index}`} fill={isBottleneck ? '#fbbf24' : '#10b981'} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Phase Diagnoses Lists & Recommendations */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
            <div className="p-4.5 border-b border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-indigo-500" />
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Quadro Diagnóstico de Retenção e Desempenho</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Métricas analíticas por phase e guias de intervenção sugeridos.</p>
              </div>
            </div>

            <div className="p-4.5 space-y-4">
              {phaseCounts.map(pc => {
                const stats = phaseStats.find(ps => ps.phase === pc.phase);
                const isBottleneck = pc.phase === bottleneckPhase.phase;
                const percentage = Math.round((pc.count / (students.length || 1)) * 100);

                let avgScore = stats?.avgGeral || 0;
                let badgeColor = 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
                let indicatorText = 'Sem avaliações';

                if (stats && stats.count > 0) {
                  if (avgScore >= 7.0) {
                    badgeColor = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400';
                    indicatorText = 'Excelente Progresso';
                  } else if (avgScore >= 5.0) {
                    badgeColor = 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400';
                    indicatorText = 'Em Evolução';
                  } else {
                    badgeColor = 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400';
                    indicatorText = 'Reforço Urgente';
                  }
                }

                // Recommendations mapping
                const recommendations: Record<number, string> = {
                  1: 'Fortalecer exercícios de leitura à primeira vista no caderno e solfejo falado dos valores musicais.',
                  2: 'Focar na postura corporal estável e mecânica manual repetitiva, usando rigorosamente metrônomo abaixo de 60 BPM.',
                  3: 'Enfatizar dinâmicas de respiração e sincronia rítmica coletiva para hinos com divisões de tempo complexas.',
                  4: 'Trabalhar afinação fina de conjunto, dinâmicas expressivas de orquestração solene e transições suaves.'
                };

                return (
                  <div 
                    key={pc.phase} 
                    className={`p-4 rounded-xl border transition-all ${isBottleneck ? 'bg-rose-50/40 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/40' : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800/80'}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                            {pc.fullName}
                          </span>
                          {isBottleneck && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-500 text-white animate-pulse">
                              GARGALO ATUAL
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">{pc.description}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">{pc.count} alunos</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">{percentage}% do total</span>
                        </div>

                        <div className={`px-2.5 py-1.5 rounded-lg text-center shrink-0 min-w-[100px] ${badgeColor}`}>
                          <span className="block text-xs font-extrabold">
                            {avgScore > 0 ? `${avgScore} / 10` : '-'}
                          </span>
                          <span className="text-[8px] uppercase font-bold tracking-wider">{indicatorText}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3.5 space-y-1.5">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full ${isBottleneck ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                          style={{ width: `${avgScore > 0 ? avgScore * 10 : 0}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400/90 leading-relaxed">
                        💡 <strong>Intervenção Recomendada:</strong> {recommendations[pc.phase]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          SUB-TAB: CORRELATION (PASSO 4)
          ------------------------------------------------------------- */}
      {activeSubTab === 'correlacao' && (
        <div className="space-y-6 animate-fade">
          {/* Statistical Coefficient Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-5 rounded-2xl border flex flex-col justify-between col-span-1 md:col-span-2 ${interpretation.bgColor}`}>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
                  Cálculo de Correlação Linear (Pearson)
                </span>
                <div className="flex items-baseline gap-2.5">
                  <h4 className="text-xl font-black text-slate-800 dark:text-white">
                    Índice r = {rValue}
                  </h4>
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${interpretation.color}`}>
                    {interpretation.label}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold mt-2">
                  {interpretation.desc}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between gap-4 text-[11px] text-slate-400">
                <span>Total de Alunos com Notas e Presenças: <strong>{validScatterData.length}</strong></span>
                <span className="italic">Garante alta confiabilidade estatística</span>
              </div>
            </div>

            {/* Quadrant Breakdown Cards */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider mb-3">Distribuição por Zonas</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Zona de Sucesso
                    </span>
                    <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-extrabold px-2.5 py-0.5 rounded-md">{successCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      Risco de Evasão
                    </span>
                    <span className="bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-extrabold px-2.5 py-0.5 rounded-md">{riskCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      Apoio Pedagógico
                    </span>
                    <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-extrabold px-2.5 py-0.5 rounded-md">{pedagogicalCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                      Excelente Autônomo
                    </span>
                    <span className="bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 font-extrabold px-2.5 py-0.5 rounded-md">{independentCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scatter Chart - Attendance vs Grade */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs lg:col-span-2 space-y-3">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Dispersão: Frequência vs. Média Geral</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Mapeamento individual de cada estudante. Eixo X: Presença, Eixo Y: Média das Notas.</p>
              </div>

              {validScatterData.length === 0 ? (
                <div className="h-72 flex items-center justify-center text-slate-400 text-xs italic">
                  Gere avaliações nas aulas para desenhar o gráfico de correlação.
                </div>
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 5, left: -25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        type="number" 
                        dataKey="frequencia" 
                        name="Frequência" 
                        unit="%" 
                        domain={[0, 100]} 
                        fontSize={10} 
                        stroke="#94a3b8"
                      />
                      <YAxis 
                        type="number" 
                        dataKey="nota" 
                        name="Média Geral" 
                        domain={[0, 10]} 
                        fontSize={10} 
                        stroke="#94a3b8"
                        ticks={[0, 2, 4, 6, 8, 10]}
                      />
                      <ZAxis type="number" range={[120, 120]} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomScatterTooltip />} />
                      <Scatter name="Alunos" data={validScatterData}>
                        {validScatterData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Matrix Breakdown of outlier students */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Alunos em Foco Pedagógico</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Alunos frequentes que estão com notas baixas (Estudando, mas com dificuldades).</p>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {correlationData.filter(d => d.zone === 'Pedagógico').length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 italic">
                    Nenhum aluno nessa categoria. Ótimo!
                  </div>
                ) : (
                  correlationData
                    .filter(d => d.zone === 'Pedagógico')
                    .map(d => (
                      <div key={d.id} className="flex items-center justify-between p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl gap-3">
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block leading-tight">
                            {d.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{d.instrumento}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="block text-xs font-bold text-amber-600 dark:text-amber-400">Nota: {d.nota}</span>
                          <span className="block text-[10px] text-slate-400">Presença: {d.frequencia}%</span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>

          {/* Actionable Quadrants Interpretation & Recommendations */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
            <div className="p-4.5 border-b border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Estratégias de Intervenção Educacional baseada em Quadrantes</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Mapeamento dinâmico de comportamentos e planos de ação sugeridos.</p>
              </div>
            </div>

            <div className="p-4.5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-950/40 bg-rose-500/5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider">🔴 Risco de Evasão ({riskCount} alunos)</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  <strong>Diagnóstico:</strong> Alunos com baixa presença e notas baixas. Geralmente enfrentam desmotivação ou choque de horários.<br/>
                  <strong>Intervenção:</strong> Agendar contato pessoal imediato, oferecer reposição personalizada e entender se há barreiras de transporte ou tempo.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-950/40 bg-amber-500/5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider">🟡 Apoio Pedagógico ({pedagogicalCount} alunos)</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  <strong>Diagnóstico:</strong> Alunos muito frequentes que estão com rendimento abaixo do esperado. Eles têm dedicação, mas enfrentam dificuldades técnicas.<br/>
                  <strong>Intervenção:</strong> Fornecer métodos mais simples, sugerir troca ou ajuste no instrumento, e incentivar monitoria com alunos da Fase 4.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-violet-200 dark:border-violet-950/40 bg-violet-500/5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider">🟣 Excelente Autônomo ({independentCount} alunos)</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  <strong>Diagnóstico:</strong> Alunos com notas altas mas baixa presença. Podem ser alunos muito talentosos que consideram o ritmo das aulas lento.<br/>
                  <strong>Intervenção:</strong> Desafiá-los com repertórios avançados, sugerir aceleração de fase e integrá-los diretamente nos ensaios oficiais mais cedo.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-950/40 bg-emerald-500/5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider">🟢 Zona de Sucesso ({successCount} alunos)</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  <strong>Diagnóstico:</strong> Alunos ideais com alta presença e ótimas médias. Estão absorvendo plenamente as lições.<br/>
                  <strong>Intervenção:</strong> Reconhecê-los publicamente no grupo, convidá-los para assumir liderança de naipes e mantê-los como referências da classe.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          SUB-TAB: GANTT PREDITIVO DE NÍVEIS ATÉ MÚSICO COMPLETO
          ------------------------------------------------------------- */}
      {activeSubTab === 'gantt' && (
        <GanttPreditivoAlunos
          pessoas={pessoas}
          turmas={turmas}
          aulas={aulas}
          diarios={diarios}
          selectedFaseFilter={selectedFase}
          selectedInstrumentoFilter={selectedInstrumento}
          selectedStatusFilter={selectedStatus}
        />
      )}
    </div>
  );
}
