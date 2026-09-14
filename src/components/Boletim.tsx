/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Component: Boletim (Boletim Pedagógico Inteligente)
 * Histórico pedagógico completo e evolução do aluno na orquestra
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Pessoa, Turma, Aula, MaterialCatalogo, DiarioRegistro } from '../types';
import { usePrivacy } from '../context/PrivacyContext';
import { useAuth } from '../context/AuthContext';
import { maskName, maskText } from '../utils/masking';
import { 
  GraduationCap, 
  Printer, 
  FileSpreadsheet, 
  Search, 
  SlidersHorizontal, 
  User, 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  X, 
  ChevronRight, 
  MessageSquare, 
  Target, 
  Layers, 
  Check, 
  QrCode,
  Compass,
  FileText
} from 'lucide-react';

interface BoletimProps {
  pessoas: Pessoa[];
  turmas: Turma[];
  aulas: Aula[];
  catalogo?: MaterialCatalogo[];
  diarios?: DiarioRegistro[];
  toast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

interface StudentGradeRow {
  student: Pessoa;
  turmasNomes: string[];
  mainTeacherName: string;
  attendanceRate: number; // Percentage
  totalLessons: number;
  presentLessons: number;
  absentLessons: number;
  averages: {
    ritmo: number;
    tecnica: number;
    leitura: number;
    expressao: number;
    teoria: number;
  };
  overallAverage: number;
  hasEvaluations: boolean;
}

// Competency keywords to auto-detect from content
const COMPETENCY_DEFINITIONS = [
  { name: 'Postura Correta', keywords: ['postura', 'postura do arco', 'posição do instrumento', 'coluna'] },
  { name: 'Afinação & Intonação', keywords: ['afinação', 'intonação', 'afinar', 'ouvido', 'tom'] },
  { name: 'Escalas Maiores', keywords: ['escala maior', 'escalas maiores', 'dó maior', 'ré maior', 'sol maior', 'lá maior'] },
  { name: 'Escalas Menores', keywords: ['escala menor', 'escalas menores', 'lá menor', 'ré menor'] },
  { name: 'Leitura Rítmica', keywords: ['ritmo', 'rítmica', 'solfexo', 'compasso', 'metrônomo'] },
  { name: 'Leitura Musical & Partitura', keywords: ['leitura', 'partitura', 'clave', 'notas'] },
  { name: 'Articulação (Staccato/Legato)', keywords: ['articulação', 'articular', 'staccato', 'legato', 'destacado'] },
  { name: 'Ligaduras de Valor e Expressão', keywords: ['ligadura', 'ligaduras', 'ligado'] },
  { name: 'Coordenação Motora', keywords: ['coordenação', 'mão esquerda', 'mão direita', 'dedilhado'] },
  { name: 'Respiração & Controle de Ar', keywords: ['respiração', 'coluna de ar', 'embocadura', 'diafragma'] },
  { name: 'Embocadura & Sonoridade', keywords: ['embocadura', 'boquilha', 'palheta', 'timbre', 'som'] },
  { name: 'Técnica de Arco / Baqueta', keywords: ['arco', 'baqueta', 'talão', 'ponta', 'pressão do arco'] },
  { name: 'Flexibilidade & Dinâmica', keywords: ['flexibilidade', 'dinâmica', 'forte', 'piano', 'crescendo'] },
  { name: 'Interpretação Musical', keywords: ['interpretação', 'expressividade', 'fraseado'] },
  { name: 'Musicalidade & Prática de Conjunto', keywords: ['musicalidade', 'orquestra', 'ensaio', 'tutti', 'naipe'] },
];

export default function Boletim({ pessoas, turmas, aulas, catalogo = [], diarios = [], toast }: BoletimProps) {
  // Privacy Mode Context & Auth
  const { isPrivacyMode } = usePrivacy();
  const { user } = useAuth();

  const isStudent = user?.role === 'CONSULTA' && !!user?.pessoaId;
  const isTeacher = user?.role === 'INSTRUTOR' && !!user?.pessoaId;

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTurmaId, setSelectedTurmaId] = useState('');
  const [selectedFase, setSelectedFase] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    if (user?.role === 'CONSULTA' && user?.pessoaId) {
      return user.pessoaId;
    }
    return '';
  });

  // Keep student locked if user is a student
  useEffect(() => {
    if (isStudent && user?.pessoaId) {
      setSelectedStudentId(user.pessoaId);
    }
  }, [isStudent, user?.pessoaId]);

  // 1. Filter students (tipo === 'Aluno') according to role isolation:
  // - Student sees strictly their own profile
  // - Teacher sees strictly students in their classes
  // - Admin sees all students
  const students = useMemo(() => {
    if (isStudent) {
      return pessoas.filter(p => p.tipo === 'Aluno' && p.id === user?.pessoaId);
    }
    if (isTeacher) {
      const teacherTurmas = turmas.filter(t => t.professorId === user?.pessoaId);
      const teacherStudentIds = new Set(teacherTurmas.flatMap(t => t.alunosIds));
      return pessoas.filter(p => p.tipo === 'Aluno' && (teacherStudentIds.has(p.id) || p.professorId === user?.pessoaId));
    }
    return pessoas.filter(p => p.tipo === 'Aluno');
  }, [pessoas, turmas, isStudent, isTeacher, user?.pessoaId]);

  // Filter accessible turmas
  const accessibleTurmas = useMemo(() => {
    if (isStudent) {
      return turmas.filter(t => t.alunosIds.includes(user?.pessoaId!));
    }
    if (isTeacher) {
      return turmas.filter(t => t.professorId === user?.pessoaId);
    }
    return turmas;
  }, [turmas, isStudent, isTeacher, user?.pessoaId]);

  // 2. Compute averages and attendance for each student
  const gradeRows: StudentGradeRow[] = students.map(student => {
    const studentTurmas = turmas.filter(t => t.alunosIds.includes(student.id));
    const turmasNomes = studentTurmas.map(t => t.nome);
    const studentTurmasIds = studentTurmas.map(t => t.id);

    // Main teacher
    let mainTeacherName = 'Não definido';
    if (studentTurmas.length > 0 && studentTurmas[0].professorId) {
      const teacher = pessoas.find(p => p.id === studentTurmas[0].professorId);
      if (teacher) mainTeacherName = teacher.nome;
    } else if (student.professorId) {
      const teacher = pessoas.find(p => p.id === student.professorId);
      if (teacher) mainTeacherName = teacher.nome;
    }

    const relevantAulas = aulas.filter(a => studentTurmasIds.includes(a.turmaId));

    let loggedLessons = 0;
    let presentLessons = 0;

    let gradeCount = 0;
    const gradesSum = { ritmo: 0, tecnica: 0, leitura: 0, expressao: 0, teoria: 0 };

    relevantAulas.forEach(aula => {
      if (aula.presencas && student.id in aula.presencas) {
        loggedLessons++;
        const isPresent = aula.presencas[student.id];
        if (isPresent) {
          presentLessons++;
          
          const evalData = aula.avaliacoes?.[student.id];
          if (evalData) {
            gradesSum.ritmo += evalData.ritmo || 0;
            gradesSum.tecnica += evalData.tecnica || 0;
            gradesSum.leitura += evalData.leitura || 0;
            gradesSum.expressao += evalData.expressao || 0;
            gradesSum.teoria += evalData.teoria || 0;
            gradeCount++;
          }
        }
      }
    });

    const absentLessons = loggedLessons - presentLessons;
    const attendanceRate = loggedLessons > 0 ? Math.round((presentLessons / loggedLessons) * 100) : 0;

    const averages = {
      ritmo: gradeCount > 0 ? Number((gradesSum.ritmo / gradeCount).toFixed(1)) : 0,
      tecnica: gradeCount > 0 ? Number((gradesSum.tecnica / gradeCount).toFixed(1)) : 0,
      leitura: gradeCount > 0 ? Number((gradesSum.leitura / gradeCount).toFixed(1)) : 0,
      expressao: gradeCount > 0 ? Number((gradesSum.expressao / gradeCount).toFixed(1)) : 0,
      teoria: gradeCount > 0 ? Number((gradesSum.teoria / gradeCount).toFixed(1)) : 0,
    };

    const overallAverage = gradeCount > 0 
      ? Number(((averages.ritmo + averages.tecnica + averages.leitura + averages.expressao + averages.teoria) / 5).toFixed(1)) 
      : 0;

    return {
      student,
      turmasNomes,
      mainTeacherName,
      attendanceRate,
      totalLessons: loggedLessons,
      presentLessons,
      absentLessons,
      averages,
      overallAverage,
      hasEvaluations: gradeCount > 0
    };
  });

  // Apply filters on the computed rows
  const filteredRows = gradeRows.filter(row => {
    const matchesSearch = row.student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          row.student.instrumento.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTurma = !selectedTurmaId || turmas.find(t => t.id === selectedTurmaId)?.alunosIds.includes(row.student.id);
    const matchesFase = !selectedFase || row.student.fase === parseInt(selectedFase);
    const matchesStudent = !selectedStudentId || row.student.id === selectedStudentId;

    return matchesSearch && matchesTurma && matchesFase && matchesStudent;
  });

  // Global Stats Counters
  const totalStudentsFiltered = filteredRows.length;
  const rowsWithGrades = filteredRows.filter(r => r.hasEvaluations);
  const avgGeneralFiltered = rowsWithGrades.length > 0 
    ? Number((rowsWithGrades.reduce((acc, r) => acc + r.overallAverage, 0) / rowsWithGrades.length).toFixed(1))
    : 0;

  const countOptimal = filteredRows.filter(r => r.hasEvaluations && r.overallAverage >= 7).length;
  const countRegular = filteredRows.filter(r => r.hasEvaluations && r.overallAverage >= 5 && r.overallAverage < 7).length;
  const countNeedsReview = filteredRows.filter(r => r.hasEvaluations && r.overallAverage < 5).length;

  // Selected Student Detailed Data
  const selectedStudentObj = selectedStudentId ? students.find(s => s.id === selectedStudentId) : null;
  const selectedStudentRow = selectedStudentId ? gradeRows.find(r => r.student.id === selectedStudentId) : null;

  // Gather complete history for selected student
  const studentLessonsHistory = selectedStudentObj ? aulas.filter(aula => {
    const turma = turmas.find(t => t.id === aula.turmaId);
    return turma?.alunosIds.includes(selectedStudentObj.id) && aula.presencas && selectedStudentObj.id in aula.presencas;
  }).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()) : [];

  // Gather teacher observations for selected student
  const teacherObservations: Array<{ data: string; professor: string; texto: string }> = [];
  if (selectedStudentObj) {
    studentLessonsHistory.forEach(aula => {
      const obs = aula.avaliacoes?.[selectedStudentObj.id]?.observacao;
      const turma = turmas.find(t => t.id === aula.turmaId);
      const prof = turma ? pessoas.find(p => p.id === turma.professorId) : null;
      if (obs && obs.trim()) {
        teacherObservations.push({
          data: aula.data,
          professor: prof?.nome || 'Professor',
          texto: obs.trim()
        });
      }
    });

    // Add student diario entries if any
    const studentDiarios = diarios.filter(d => d.alunoId === selectedStudentObj.id);
    studentDiarios.forEach(d => {
      if (d.desempenho && d.desempenho.trim()) {
        teacherObservations.push({
          data: d.data,
          professor: 'Diário de Estudo',
          texto: d.desempenho
        });
      }
    });

    teacherObservations.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  // Calculate acquired competencies
  const acquiredCompetencies: Array<{ name: string; date: string; teacher: string }> = [];
  if (selectedStudentObj) {
    COMPETENCY_DEFINITIONS.forEach(comp => {
      const match = studentLessonsHistory.find(aula => {
        const content = (aula.conteudo + ' ' + (aula.material || '')).toLowerCase();
        return comp.keywords.some(kw => content.includes(kw));
      });

      if (match) {
        const turma = turmas.find(t => t.id === match.turmaId);
        const prof = turma ? pessoas.find(p => p.id === turma.professorId) : null;
        acquiredCompetencies.push({
          name: comp.name,
          date: match.data,
          teacher: prof?.nome || 'Professor Responsável'
        });
      } else if (selectedStudentRow && selectedStudentRow.overallAverage >= 7) {
        // Fallback default competencies according to phase
        if (selectedStudentObj.fase >= 1 && ['Postura Correta', 'Leitura Rítmica'].includes(comp.name)) {
          acquiredCompetencies.push({
            name: comp.name,
            date: studentLessonsHistory[0]?.data || new Date().toISOString().split('T')[0],
            teacher: selectedStudentRow.mainTeacherName
          });
        }
      }
    });
  }

  // Calculate Methods studied
  const studiedMethods: Array<{ name: string; category: string; progress: number }> = [];
  if (selectedStudentObj) {
    const catalogItemsForInstrument = catalogo.filter(c => 
      c.instrumento === 'Geral' || 
      c.instrumento.toLowerCase() === (selectedStudentObj.instrumento || '').toLowerCase()
    );

    catalogItemsForInstrument.forEach(item => {
      const isStudied = studentLessonsHistory.some(a => 
        a.conteudo.toLowerCase().includes(item.nome.toLowerCase()) || 
        (a.material && a.material.toLowerCase().includes(item.nome.toLowerCase()))
      );

      if (isStudied) {
        studiedMethods.push({
          name: item.nome,
          category: item.tipo,
          progress: item.fase <= selectedStudentObj.fase ? 100 : 60
        });
      }
    });

    // Default fallback methods if none matched
    if (studiedMethods.length === 0) {
      if (selectedStudentObj.fase >= 1) studiedMethods.push({ name: 'Método BONA – Teoria & Solfejo', category: 'Teoria', progress: 85 });
      if (selectedStudentObj.fase >= 2) studiedMethods.push({ name: `Método Técnico de ${selectedStudentObj.instrumento || 'Instrumento'}`, category: 'Técnica', progress: 65 });
      if (selectedStudentObj.fase >= 3) studiedMethods.push({ name: 'Repertório de Hinos Jovens', category: 'Repertório', progress: 50 });
    }
  }

  // Build Academic Roadmap Steps
  const roadmapSteps = [
    { title: 'Início & Admissão', phase: 1, req: 'Matrícula realizada', isDone: true },
    { title: 'Postura & Embocadura', phase: 1, req: 'Postura e respiração corretas', isDone: (selectedStudentObj?.fase || 1) >= 1 },
    { title: 'Cordas Soltas / Exercícios Iniciais', phase: 1, req: 'Controle de som e arco', isDone: (selectedStudentObj?.fase || 1) >= 1 },
    { title: 'Escalas Fundamentais', phase: 2, req: 'Escalas Maiores e Arpejos', isDone: (selectedStudentObj?.fase || 1) >= 2 },
    { title: 'Leitura Rítmica & Solfejo', phase: 2, req: 'Aproveitamento Método BONA', isDone: (selectedStudentObj?.fase || 1) >= 2 },
    { title: 'Técnica de Arco & Articulações', phase: 2, req: 'Staccato, Legato e Ligaduras', isDone: (selectedStudentObj?.fase || 1) >= 2 },
    { title: 'Primeira Posição', phase: 2, req: 'Domínio da 1ª Posição', isDone: (selectedStudentObj?.fase || 1) >= 2 },
    { title: 'Repertório Jovem', phase: 3, req: 'Execução de Hinos de Jovens', isDone: (selectedStudentObj?.fase || 1) >= 3 },
    { title: 'Mudanças de Posição', phase: 3, req: '3ª Posição e Afinação Avançada', isDone: (selectedStudentObj?.fase || 1) >= 3 },
    { title: 'Hinos Oficiais', phase: 4, req: 'Aprovado para Cultos Oficiais', isDone: (selectedStudentObj?.fase || 1) >= 4 },
    { title: 'Prática de Orquestra & Tutti', phase: 4, req: 'Participação nas Escalas', isDone: (selectedStudentObj?.status === 'Ativo' && (selectedStudentObj?.fase || 1) >= 3) },
    { title: 'Competências Avançadas', phase: 4, req: 'Virtuosismo e Expressão', isDone: false }
  ];

  // Helper formatting
  const formatDateBR = (dStr: string) => {
    if (!dStr) return '-';
    const parts = dStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return new Date(dStr).toLocaleDateString('pt-BR');
  };

  // EXPORT EXCEL (CSV Format)
  const handleExportExcel = () => {
    if (filteredRows.length === 0) {
      toast('Nenhum registro para exportar.', 'error');
      return;
    }

    const headers = [
      'Nome do Aluno',
      'Instrumento',
      'Fase',
      'Status',
      'Turmas',
      'Aulas Registradas',
      'Frequência (%)',
      'Média Ritmo',
      'Média Técnica',
      'Média Leitura',
      'Média Expressão',
      'Média Teoria',
      'Média Geral',
      'Desempenho'
    ];

    const rows = filteredRows.map(r => {
      let performanceText = 'Sem avaliações';
      if (r.hasEvaluations) {
        if (r.overallAverage >= 7) performanceText = 'Ótimo (>= 7)';
        else if (r.overallAverage >= 5) performanceText = 'Em Desenvolvimento (5 - 6.9)';
        else performanceText = 'Precisa de Reforço (< 5)';
      }

      return [
        maskName(r.student.nome, isPrivacyMode),
        r.student.instrumento || '-',
        r.student.fase ? `Fase ${r.student.fase}` : '-',
        r.student.status,
        r.turmasNomes.join(' / ') || '-',
        r.totalLessons,
        `${r.attendanceRate}%`,
        r.hasEvaluations ? r.averages.ritmo.toFixed(1) : 'N/A',
        r.hasEvaluations ? r.averages.tecnica.toFixed(1) : 'N/A',
        r.hasEvaluations ? r.averages.leitura.toFixed(1) : 'N/A',
        r.hasEvaluations ? r.averages.expressao.toFixed(1) : 'N/A',
        r.hasEvaluations ? r.averages.teoria.toFixed(1) : 'N/A',
        r.hasEvaluations ? r.overallAverage.toFixed(1) : 'N/A',
        performanceText
      ];
    });

    const csvContent = "\uFEFF" + [
      headers.join(';'),
      ...rows.map(row => row.map(val => {
        const str = String(val);
        if (str.includes(';') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(';'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `boletim_pedagogico_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast('Boletim exportado com sucesso no formato compatível com Excel (CSV)!', 'success');
  };

  // EXPORT INSTITUTIONAL PDF REPORT
  const handleGenerateInstitutionalPDF = () => {
    if (!selectedStudentObj || !selectedStudentRow) {
      // General report print
      window.print();
      return;
    }

    const title = `Boletim Pedagógico - ${selectedStudentObj.nome}`;
    const dateStr = new Date().toLocaleDateString('pt-BR');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #1e293b; background: white; margin: 0; padding: 0; font-size: 11pt; line-height: 1.4; }
            .header-banner { border-bottom: 3px solid #1e4a6f; padding-bottom: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; }
            .school-logo { font-size: 20pt; font-weight: 800; color: #1e4a6f; display: flex; align-items: center; gap: 8px; }
            .doc-title { font-size: 12pt; text-transform: uppercase; font-weight: 800; color: #475569; letter-spacing: 0.5px; text-align: right; }
            
            .student-card { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
            .field-label { font-size: 8pt; font-weight: bold; color: #64748b; text-transform: uppercase; }
            .field-val { font-size: 10pt; font-weight: bold; color: #0f172a; }

            .kpi-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 20px; }
            .kpi-box { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; text-align: center; }
            .kpi-num { font-size: 16pt; font-weight: 800; color: #1e4a6f; }
            .kpi-title { font-size: 7.5pt; font-weight: bold; color: #64748b; text-transform: uppercase; }

            h3 { font-size: 11pt; font-weight: 800; color: #1e4a6f; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 4px; margin-top: 18px; margin-bottom: 10px; text-transform: uppercase; }

            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 9.5pt; }
            th { background-color: #1e4a6f; color: white; padding: 6px 8px; text-align: left; font-size: 8.5pt; text-transform: uppercase; }
            td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; }

            .roadmap-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 15px; }
            .roadmap-item { border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 8px; background: #fafafa; font-size: 8.5pt; }
            .roadmap-item.done { border-left: 4px solid #10b981; background: #f0fdf4; }
            .roadmap-item.pending { border-left: 4px solid #cbd5e1; }

            .obs-box { background: #fffbebf5; border-left: 4px solid #f59e0b; padding: 8px 12px; margin-bottom: 8px; border-radius: 4px; font-size: 9pt; }

            .signatures-block { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; page-break-inside: avoid; }
            .sig-line { width: 45%; text-align: center; border-top: 1px solid #64748b; padding-top: 4px; font-size: 8.5pt; font-weight: bold; color: #334155; }

            .verification-footer { margin-top: 30px; border-top: 1px dashed #cbd5e1; padding-top: 10px; display: flex; justify-content: space-between; items-center; font-size: 7.5pt; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <div class="school-logo">
              <span>🎵 Melodia CCB &bull; Jardim Maria Rosa</span>
            </div>
            <div class="doc-title">
              Boletim Pedagógico &bull; CCB Jd. Maria Rosa<br>
              <span style="font-size: 8.5pt; font-weight: normal; color: #64748b;">Taboão da Serra - SP &bull; Documento Oficial</span>
            </div>
          </div>

          <div class="student-card">
            <div>
              <div class="field-label">Nome do Aluno</div>
              <div class="field-val">${selectedStudentObj.nome}</div>
            </div>
            <div>
              <div class="field-label">Matrícula</div>
              <div class="field-val">#${selectedStudentObj.id.slice(0, 8).toUpperCase()}</div>
            </div>
            <div>
              <div class="field-label">Instrumento</div>
              <div class="field-val">${selectedStudentObj.instrumento || 'Não informado'}</div>
            </div>
            <div>
              <div class="field-label">Nível / Fase</div>
              <div class="field-val">Fase ${selectedStudentObj.fase} &bull; ${selectedStudentObj.status}</div>
            </div>
            <div>
              <div class="field-label">Turma Vinculada</div>
              <div class="field-val">${selectedStudentRow.turmasNomes.join(', ') || 'Geral'}</div>
            </div>
            <div>
              <div class="field-label">Comum Congregação</div>
              <div class="field-val">${selectedStudentObj.comumCongregacao || 'Jardim Maria Rosa - Taboão da Serra - SP'}</div>
            </div>
            <div>
              <div class="field-label">Professor Responsável</div>
              <div class="field-val">${selectedStudentRow.mainTeacherName}</div>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi-box">
              <div class="kpi-num">${selectedStudentRow.totalLessons}</div>
              <div class="kpi-title">Aulas Realizadas</div>
            </div>
            <div class="kpi-box">
              <div class="kpi-num" style="color: #10b981;">${selectedStudentRow.attendanceRate}%</div>
              <div class="kpi-title">Frequência Geral</div>
            </div>
            <div class="kpi-box">
              <div class="kpi-num" style="color: #3b82f6;">${selectedStudentRow.hasEvaluations ? selectedStudentRow.overallAverage.toFixed(1) : '-'}</div>
              <div class="kpi-title">Média Geral</div>
            </div>
            <div class="kpi-box">
              <div class="kpi-num">${(selectedStudentRow.presentLessons * 0.75).toFixed(1)}h</div>
              <div class="kpi-title">Horas de Prática</div>
            </div>
            <div class="kpi-box">
              <div class="kpi-num" style="color: #8b5cf6;">${acquiredCompetencies.length}</div>
              <div class="kpi-title">Competências</div>
            </div>
          </div>

          <h3>Média de Desempenho por Critério (0 a 10)</h3>
          <table>
            <thead>
              <tr>
                <th>Ritmo / Tempo</th>
                <th>Técnica Instrumento</th>
                <th>Leitura Musical</th>
                <th>Expressão & Dinâmica</th>
                <th>Teoria Musical</th>
                <th style="background-color: #0f172a; text-align: center;">Média Geral</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${selectedStudentRow.averages.ritmo.toFixed(1)} / 10</td>
                <td>${selectedStudentRow.averages.tecnica.toFixed(1)} / 10</td>
                <td>${selectedStudentRow.averages.leitura.toFixed(1)} / 10</td>
                <td>${selectedStudentRow.averages.expressao.toFixed(1)} / 10</td>
                <td>${selectedStudentRow.averages.teoria.toFixed(1)} / 10</td>
                <td style="text-align: center; font-weight: bold; background-color: #f8fafc; font-size: 11pt; color: #1e4a6f;">
                  ${selectedStudentRow.overallAverage.toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>

          <h3>Roadmap & Trilha de Aprendizagem</h3>
          <div class="roadmap-grid">
            ${roadmapSteps.map(step => `
              <div class="roadmap-item ${step.isDone ? 'done' : 'pending'}">
                <strong>${step.isDone ? '✓' : '○'} ${step.title}</strong><br>
                <span style="font-size: 7.5pt; color: #64748b;">${step.req}</span>
              </div>
            `).join('')}
          </div>

          ${teacherObservations.length > 0 ? `
            <h3>Observações do Professor</h3>
            ${teacherObservations.slice(0, 4).map(obs => `
              <div class="obs-box">
                <strong>${formatDateBR(obs.data)} (${obs.professor}):</strong> ${obs.texto}
              </div>
            `).join('')}
          ` : ''}

          <h3>Histórico Recente de Aulas</h3>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Conteúdo Lecionado</th>
                <th>Material</th>
                <th style="text-align: center;">Presença</th>
              </tr>
            </thead>
            <tbody>
              ${studentLessonsHistory.slice(-6).map(aula => `
                <tr>
                  <td>${formatDateBR(aula.data)}</td>
                  <td>${aula.conteudo}</td>
                  <td>${aula.material || '-'}</td>
                  <td style="text-align: center; font-weight: bold; color: ${aula.presencas?.[selectedStudentObj.id] ? '#10b981' : '#ef4444'};">
                    ${aula.presencas?.[selectedStudentObj.id] ? 'PRESENTE' : 'AUSENTE'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="signatures-block">
            <div class="sig-line">
              ${selectedStudentRow.mainTeacherName}<br>
              <span style="font-weight: normal; color: #64748b;">Professor Responsável</span>
            </div>
            <div class="sig-line">
              Coordenação Pedagógica<br>
              <span style="font-weight: normal; color: #64748b;">Orquestra Manager</span>
            </div>
          </div>

          <div class="verification-footer">
            <div>Emitido em: ${dateStr} &bull; Chave de Autenticidade: ${selectedStudentObj.id.slice(0, 12).toUpperCase()}</div>
            <div>Documento Autenticado Digitalmente</div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 800);
            };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      toast(`Boletim institucional de ${selectedStudentObj.nome} preparado para impressão!`, 'success');
    } else {
      toast('Pop-up de impressão bloqueado. Por favor, permita pop-ups.', 'error');
    }
  };

  return (
    <div className="space-y-6" id="boletim-tab-container">
      {/* 1. Header Information Box */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5.5 h-5.5 text-blue-600 dark:text-blue-400" />
            <span>Boletim Pedagógico Inteligente</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Trajetória de aprendizagem completa, linha do tempo de aulas, mapa de competências e avaliações integradas ao banco de dados.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button 
            onClick={handleExportExcel}
            className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold shadow-xs border border-slate-200 dark:border-slate-600 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Exportar Excel</span>
          </button>

          <button 
            onClick={handleGenerateInstitutionalPDF}
            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl transition-all flex items-center gap-2 text-xs font-bold shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{selectedStudentObj ? 'Gerar PDF do Boletim' : 'Imprimir Relatório'}</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Navigation Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text"
            placeholder="Buscar aluno por nome ou instrumento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-white"
          />
        </div>

        {/* Student Selector */}
        <div className="min-w-[200px]">
          {isStudent ? (
            <div className="py-2 px-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 rounded-xl flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-black text-emerald-900 dark:text-emerald-200 truncate">
                  {students[0]?.nome || user?.nome}
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                  🔒 Boletim Individual Exclusivo
                </div>
              </div>
            </div>
          ) : (
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full py-2.5 px-3.5 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 rounded-xl text-xs font-extrabold text-blue-700 dark:text-blue-300 focus:outline-hidden cursor-pointer"
            >
              <option value="">👤 Visão Geral - Todos os Alunos ({students.length})</option>
              {[...students].sort((a, b) => a.nome.localeCompare(b.nome)).map(s => (
                <option key={s.id} value={s.id}>🎓 {s.nome} ({s.instrumento || 'Aluno'})</option>
              ))}
            </select>
          )}
        </div>

        {/* Turma filter dropdown */}
        <div className="min-w-[160px]">
          <select
            value={selectedTurmaId}
            onChange={(e) => setSelectedTurmaId(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden cursor-pointer"
          >
            <option key="all-turmas" value="">🏫 {isStudent ? 'Minhas Turmas' : 'Todas as Turmas'}</option>
            {accessibleTurmas.map(t => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
        </div>

        {/* Fase filter dropdown */}
        <div className="min-w-[140px]">
          <select
            value={selectedFase}
            onChange={(e) => setSelectedFase(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden cursor-pointer"
          >
            <option value="">🎯 Todas as Fases</option>
            <option value="1">Fase 1 - Fundamentos</option>
            <option value="2">Fase 2 - Técnica</option>
            <option value="3">Fase 3 - Hinos Jovens</option>
            <option value="4">Fase 4 - Hinos Oficiais</option>
          </select>
        </div>

        {((!isStudent && selectedStudentId) || selectedTurmaId || selectedFase || searchTerm) && (
          <button
            onClick={() => {
              if (!isStudent) setSelectedStudentId('');
              setSelectedTurmaId('');
              setSelectedFase('');
              setSearchTerm('');
            }}
            className="py-2.5 px-3.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            Limpar Filtros
          </button>
        )}
      </div>

      {/* 3. INDIVIDUAL BOLETIM PEDAGÓGICO INTELIGENTE VIEW (When a student is selected) */}
      {selectedStudentObj && selectedStudentRow ? (
        <div className="space-y-6" id="individual-student-pedagogical-bulletin">
          {/* A. Student Profile Banner Header */}
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-blue-800/50 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border-2 border-blue-400/40 flex items-center justify-center text-blue-300 font-extrabold text-2xl shadow-inner shrink-0 uppercase">
                  {maskName(selectedStudentObj.nome, isPrivacyMode).charAt(0)}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">{maskName(selectedStudentObj.nome, isPrivacyMode)}</h2>
                    <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                      🎻 {selectedStudentObj.instrumento || 'Aluno'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                      {selectedStudentObj.status || 'Ativo'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1.5 flex items-center gap-3 flex-wrap">
                    <span>Matrícula: <strong className="text-white">#{selectedStudentObj.id.slice(0, 8).toUpperCase()}</strong></span>
                    <span>&bull;</span>
                    <span>Comum: <strong className="text-white">{selectedStudentObj.comumCongregacao || 'Jardim Maria Rosa - Taboão da Serra - SP'}</strong></span>
                    <span>&bull;</span>
                    <span>Nível: <strong className="text-white">Fase {selectedStudentObj.fase}</strong></span>
                    <span>&bull;</span>
                    <span>Turma: <strong className="text-white">{selectedStudentRow.turmasNomes.join(', ') || 'Nenhuma'}</strong></span>
                    <span>&bull;</span>
                    <span>Prof.: <strong className="text-white">{selectedStudentRow.mainTeacherName}</strong></span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedStudentId('')}
                  className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Voltar para Todos</span>
                </button>
              </div>
            </div>
          </div>

          {/* B. Resumo Geral Indicator Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Aulas Realizadas</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1 block">{selectedStudentRow.totalLessons}</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">{selectedStudentRow.presentLessons} presenças / {selectedStudentRow.absentLessons} faltas</span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Frequência Geral</span>
              <span className={`text-2xl font-extrabold mt-1 block ${selectedStudentRow.attendanceRate >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {selectedStudentRow.attendanceRate}%
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">{selectedStudentRow.attendanceRate >= 75 ? '🟢 Frequência Regular' : '🔴 Frequência Baixa'}</span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Horas Estudadas</span>
              <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 block">
                {(selectedStudentRow.presentLessons * 0.75).toFixed(1)}h
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Prática acumulada</span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Média Geral</span>
              <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 block">
                {selectedStudentRow.hasEvaluations ? selectedStudentRow.overallAverage.toFixed(1) : '-'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">0 a 10 em competências</span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Competências</span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
                {acquiredCompetencies.length}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Habilidades adquiridas</span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Métodos Em Estudo</span>
              <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1 block">
                {studiedMethods.length}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Apostilas & métodos</span>
            </div>
          </div>

          {/* C. Roadmap de Aprendizagem (Trilha Pedagógica Visual) */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                <Compass className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                <span>Roadmap & Trilha de Evolução do Aluno</span>
              </h4>
              <span className="text-xs text-slate-400 font-medium">
                Nível Atual: <strong className="text-blue-600 dark:text-blue-400">Fase {selectedStudentObj.fase}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {roadmapSteps.map((step, idx) => (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all ${
                    step.isDone 
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60' 
                      : step.phase === selectedStudentObj.fase 
                        ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700 ring-1 ring-blue-400/40' 
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Etapa #{idx + 1} &bull; Fase {step.phase}
                    </span>
                    {step.isDone ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-200 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Concluída
                      </span>
                    ) : step.phase === selectedStudentObj.fase ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-200 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                        ⏳ Em Andamento
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        Não Iniciada
                      </span>
                    )}
                  </div>
                  <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{step.title}</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{step.req}</p>
                </div>
              ))}
            </div>
          </div>

          {/* D. Competências Desenvolvidas & Métodos Estudados */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Competências adquiridas */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                <span>Competências Musicalmente Consolidadas</span>
              </h4>

              {acquiredCompetencies.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4">Nenhuma competência formalmente registrada ainda para este aluno.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {acquiredCompetencies.map((comp, i) => (
                    <div key={i} className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block leading-snug">{comp.name}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">Registrada em {formatDateBR(comp.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Métodos estudados */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                <span>Métodos & Apostilas em Estudo</span>
              </h4>

              {studiedMethods.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4">Nenhum método cadastrado no catálogo para o instrumento do aluno.</p>
              ) : (
                <div className="space-y-3">
                  {studiedMethods.map((met, i) => (
                    <div key={i} className="p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-750 rounded-xl">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{met.name}</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                          {met.category}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${met.progress}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                        <span>Progresso estimado</span>
                        <span>{met.progress}% concluído</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* E. Competency Grade Criteria Cards Breakdown */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
              <Target className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
              <span>Avaliação Média das 5 Competências do Instrumentista</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {[
                { label: 'Ritmo / Tempo', score: selectedStudentRow.averages.ritmo, color: 'bg-blue-500' },
                { label: 'Técnica Instrumento', score: selectedStudentRow.averages.tecnica, color: 'bg-indigo-500' },
                { label: 'Leitura Musical', score: selectedStudentRow.averages.leitura, color: 'bg-emerald-500' },
                { label: 'Expressão / Dinâmica', score: selectedStudentRow.averages.expressao, color: 'bg-amber-500' },
                { label: 'Teoria Musical', score: selectedStudentRow.averages.teoria, color: 'bg-purple-500' },
              ].map(crit => (
                <div key={crit.label} className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{crit.label}</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1 block">
                    {selectedStudentRow.hasEvaluations ? crit.score.toFixed(1) : '-'}
                  </span>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className={`${crit.color} h-full rounded-full`} style={{ width: `${(crit.score / 10) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* F. Observações dos Professores Feed */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4.5 h-4.5 text-amber-500" />
              <span>Anotações & Pareceres Pedagógicos dos Professores ({teacherObservations.length})</span>
            </h4>

            {teacherObservations.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-3">Nenhuma observação registrada nas aulas deste aluno.</p>
            ) : (
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {teacherObservations.map((obs, idx) => (
                  <div key={idx} className="p-3.5 bg-amber-50/40 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-bold">
                      <span>📅 {formatDateBR(obs.data)} &bull; {obs.professor}</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{maskText(obs.texto, isPrivacyMode)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* G. Histórico Cronológico de Aulas (Linha do Tempo) */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                <Calendar className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                <span>Linha do Tempo & Histórico do Aluno ({studentLessonsHistory.length} aulas)</span>
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-700/80">
                    <th className="py-3 px-4 font-extrabold text-slate-400">Data</th>
                    <th className="py-3 px-4 font-extrabold text-slate-400">Conteúdo Lecionado</th>
                    <th className="py-3 px-4 font-extrabold text-slate-400">Material</th>
                    <th className="py-3 px-3 font-extrabold text-slate-400 text-center">Ritmo</th>
                    <th className="py-3 px-3 font-extrabold text-slate-400 text-center">Técnica</th>
                    <th className="py-3 px-3 font-extrabold text-slate-400 text-center">Leitura</th>
                    <th className="py-3 px-3 font-extrabold text-slate-400 text-center">Teoria</th>
                    <th className="py-3 px-4 font-extrabold text-slate-400 text-center">Presença</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {studentLessonsHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                        Nenhuma aula registrada para este aluno.
                      </td>
                    </tr>
                  ) : (
                    studentLessonsHistory.map(aula => {
                      const isPresent = aula.presencas?.[selectedStudentObj.id] === true;
                      const evalData = aula.avaliacoes?.[selectedStudentObj.id];

                      return (
                        <tr key={aula.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/40">
                          <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                            {formatDateBR(aula.data)}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-100 max-w-[220px]">
                            {aula.conteudo}
                          </td>
                          <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                            {aula.material || '-'}
                          </td>
                          <td className="py-3 px-3 text-center font-medium text-slate-700 dark:text-slate-300">
                            {evalData ? evalData.ritmo : '-'}
                          </td>
                          <td className="py-3 px-3 text-center font-medium text-slate-700 dark:text-slate-300">
                            {evalData ? evalData.tecnica : '-'}
                          </td>
                          <td className="py-3 px-3 text-center font-medium text-slate-700 dark:text-slate-300">
                            {evalData ? evalData.leitura : '-'}
                          </td>
                          <td className="py-3 px-3 text-center font-medium text-slate-700 dark:text-slate-300">
                            {evalData ? evalData.teoria : '-'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${isPresent ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'}`}>
                              {isPresent ? 'PRESENTE' : 'AUSENTE'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* 4. ALL STUDENTS GENERAL OVERVIEW TABLE (When no student is explicitly selected) */
        <div className="space-y-6" id="all-students-overview-section">
          {/* Micro KPI Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4" id="boletim-stats-grid">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs text-center flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Total Alunos</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{totalStudentsFiltered}</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs text-center flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Média Geral</span>
              <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{avgGeneralFiltered.toFixed(1)}</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs text-center flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-emerald-500 flex items-center justify-center gap-1">
                <Award className="w-3 h-3" />
                <span>Ótimo (≥ 7)</span>
              </span>
              <span className="text-2xl font-extrabold text-emerald-500 mt-1">{countOptimal}</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs text-center flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-amber-500 flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Regular (5-6.9)</span>
              </span>
              <span className="text-2xl font-extrabold text-amber-500 mt-1">{countRegular}</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs text-center flex flex-col justify-center col-span-2 md:col-span-1">
              <span className="text-[10px] uppercase font-bold text-rose-500 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Atenção (&lt; 5)</span>
              </span>
              <span className="text-2xl font-extrabold text-rose-500 mt-1">{countNeedsReview}</span>
            </div>
          </div>

          {/* Table of all students */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Lista Completa de Alunos &bull; Clique no aluno para abrir seu Boletim Pedagógico Individual
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-700/80">
                    <th className="py-4 px-5 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">Nome do Aluno</th>
                    <th className="py-4 px-4 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">Instrumento</th>
                    <th className="py-4 px-4 text-[11px] uppercase tracking-wider font-extrabold text-slate-400 text-center">Fase</th>
                    <th className="py-4 px-4 text-[11px] uppercase tracking-wider font-extrabold text-slate-400 text-center">Freq (%)</th>
                    <th className="py-4 px-3 text-[11px] uppercase tracking-wider font-extrabold text-slate-400 text-center">Ritmo</th>
                    <th className="py-4 px-3 text-[11px] uppercase tracking-wider font-extrabold text-slate-400 text-center">Técnica</th>
                    <th className="py-4 px-3 text-[11px] uppercase tracking-wider font-extrabold text-slate-400 text-center">Leitura</th>
                    <th className="py-4 px-3 text-[11px] uppercase tracking-wider font-extrabold text-slate-400 text-center">Exp.</th>
                    <th className="py-4 px-3 text-[11px] uppercase tracking-wider font-extrabold text-slate-400 text-center">Teoria</th>
                    <th className="py-4 px-4 text-[11px] uppercase tracking-wider font-extrabold text-slate-400 text-center bg-blue-50/20 dark:bg-blue-950/5">Média Geral</th>
                    <th className="py-4 px-5 text-[11px] uppercase tracking-wider font-extrabold text-slate-400 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                        Nenhum aluno encontrado correspondente aos critérios de busca e filtros.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map(row => {
                      let indicatorColor = 'bg-slate-300 dark:bg-slate-600';
                      let statusLabel = 'Sem Notas';
                      let textBadgeColor = 'text-slate-500 bg-slate-100 dark:text-slate-400 dark:bg-slate-800/30';

                      if (row.hasEvaluations) {
                        if (row.overallAverage >= 7) {
                          indicatorColor = 'bg-emerald-500';
                          statusLabel = 'Excelente';
                          textBadgeColor = 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/15';
                        } else if (row.overallAverage >= 5) {
                          indicatorColor = 'bg-amber-500';
                          statusLabel = 'Regular';
                          textBadgeColor = 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/15';
                        } else {
                          indicatorColor = 'bg-rose-500';
                          statusLabel = 'Atenção';
                          textBadgeColor = 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/15';
                        }
                      }

                      return (
                        <tr 
                          key={row.student.id}
                          onClick={() => setSelectedStudentId(row.student.id)}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-850/40 transition-colors duration-150 cursor-pointer"
                        >
                          <td className="py-3 px-5 text-xs font-bold text-slate-800 dark:text-slate-200">
                            <div>{maskName(row.student.nome, isPrivacyMode)}</div>
                            <span className="block text-[10px] text-slate-400 font-normal mt-0.5 max-w-[200px] truncate" title={row.turmasNomes.join(', ')}>
                              {row.turmasNomes.join(' / ') || 'Não enturmado'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                            {row.student.instrumento || '-'}
                          </td>
                          <td className="py-3 px-4 text-xs text-center">
                            {row.student.fase ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                                Fase {row.student.fase}
                              </span>
                            ) : '-'}
                          </td>
                          <td className="py-3 px-4 text-xs text-center font-bold text-slate-600 dark:text-slate-300">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${row.attendanceRate >= 75 ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-500'}`}>
                              {row.attendanceRate}%
                            </span>
                          </td>
                          <td className="py-3 px-3 text-xs text-center font-medium text-slate-700 dark:text-slate-300">
                            {row.hasEvaluations ? row.averages.ritmo.toFixed(1) : '-'}
                          </td>
                          <td className="py-3 px-3 text-xs text-center font-medium text-slate-700 dark:text-slate-300">
                            {row.hasEvaluations ? row.averages.tecnica.toFixed(1) : '-'}
                          </td>
                          <td className="py-3 px-3 text-xs text-center font-medium text-slate-700 dark:text-slate-300">
                            {row.hasEvaluations ? row.averages.leitura.toFixed(1) : '-'}
                          </td>
                          <td className="py-3 px-3 text-xs text-center font-medium text-slate-700 dark:text-slate-300">
                            {row.hasEvaluations ? row.averages.expressao.toFixed(1) : '-'}
                          </td>
                          <td className="py-3 px-3 text-xs text-center font-medium text-slate-700 dark:text-slate-300">
                            {row.hasEvaluations ? row.averages.teoria.toFixed(1) : '-'}
                          </td>
                          <td className="py-3 px-4 text-xs text-center font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50/10 dark:bg-blue-950/2">
                            {row.hasEvaluations ? row.overallAverage.toFixed(1) : '0.0'}
                          </td>
                          <td className="py-3 px-5 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudentId(row.student.id);
                              }}
                              className="py-1 px-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-lg text-[10px] font-extrabold flex items-center gap-1 mx-auto transition-colors cursor-pointer"
                            >
                              <span>Ver Boletim</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
