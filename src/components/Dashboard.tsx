/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Pessoa, Turma, Aula, Escala } from '../types';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  CheckSquare, 
  FileText, 
  Music, 
  ChevronRight,
  ShieldCheck,
  Award,
  Sparkles,
  BookOpen,
  Lock,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MusicalWatermark from './MusicalWatermark';
import OfficialCalendarBanner from './OfficialCalendarBanner';

interface DashboardProps {
  pessoas: Pessoa[];
  turmas: Turma[];
  aulas: Aula[];
  escalas: Escala[];
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ pessoas, turmas, aulas, escalas, onNavigate }: DashboardProps) {
  const { user } = useAuth();

  const [logNotes, setLogNotes] = useState<string>(() => {
    try {
      return localStorage.getItem('om_maestro_notes') || 
        '• Ensaio Geral de Sábado: focar nas passagens de transição do hino de abertura.\n• Novas inscrições para violino iniciante abrem no próximo mês.\n• Revisar escalas de metais antes do culto de domingo.';
    } catch (e) {
      return '• Ensaio Geral de Sábado: focar nas passagens de transição do hino de abertura.\n• Novas inscrições para violino iniciante abrem no próximo mês.\n• Revisar escalas de metais antes do culto de domingo.';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('om_maestro_notes', logNotes);
    } catch (e) {
      // Graceful fallback
    }
  }, [logNotes]);

  // Current Pessoa record if logged in with pessoaId
  const currentPessoa = useMemo(() => {
    if (!user?.pessoaId) return null;
    return pessoas.find(p => p.id === user.pessoaId) || null;
  }, [user, pessoas]);

  // -----------------------------------------------------------------
  // 1. DADOS ESPECÍFICOS PARA O ALUNO (ROLE: CONSULTA)
  // -----------------------------------------------------------------
  const studentTurmas = useMemo(() => {
    if (!user?.pessoaId) return [];
    return turmas.filter(t => t.alunosIds.includes(user.pessoaId!));
  }, [user, turmas]);

  const studentAulas = useMemo(() => {
    if (!user?.pessoaId) return [];
    return aulas.filter(a => a.presencas && user.pessoaId! in a.presencas);
  }, [user, aulas]);

  const studentPresencasCount = useMemo(() => {
    if (!user?.pessoaId) return 0;
    return studentAulas.filter(a => a.presencas?.[user.pessoaId!] === true).length;
  }, [user, studentAulas]);

  const studentFreqPct = useMemo(() => {
    if (studentAulas.length === 0) return 100;
    return Math.round((studentPresencasCount / studentAulas.length) * 100);
  }, [studentAulas, studentPresencasCount]);

  const studentMediaGeral = useMemo(() => {
    if (!user?.pessoaId) return '8.5';
    let sum = 0;
    let count = 0;
    studentAulas.forEach(a => {
      const ev = a.avaliacoes?.[user.pessoaId!];
      if (ev) {
        const scores = [ev.ritmo, ev.tecnica, ev.leitura, ev.expressao, ev.teoria].filter(s => typeof s === 'number' && s > 0);
        if (scores.length > 0) {
          sum += scores.reduce((x, y) => x + y, 0) / scores.length;
          count++;
        }
      }
    });
    return count > 0 ? (sum / count).toFixed(1) : '8.5';
  }, [user, studentAulas]);

  // -----------------------------------------------------------------
  // 2. DADOS ESPECÍFICOS PARA O INSTRUTOR (ROLE: INSTRUTOR)
  // -----------------------------------------------------------------
  const instructorTurmas = useMemo(() => {
    if (!user?.pessoaId) return [];
    return turmas.filter(t => t.professorId === user.pessoaId);
  }, [user, turmas]);

  const instructorStudentsCount = useMemo(() => {
    const studentSet = new Set<string>();
    instructorTurmas.forEach(t => t.alunosIds.forEach(id => studentSet.add(id)));
    return studentSet.size;
  }, [instructorTurmas]);

  // -----------------------------------------------------------------
  // 3. DADOS GERAIS (ADMIN / COORDENADOR)
  // -----------------------------------------------------------------
  const musicos = pessoas.filter(p => p.tipo === 'Musico');
  const alunos = pessoas.filter(p => p.tipo === 'Aluno');
  
  const ativosCount = pessoas.filter(p => p.status === 'Ativo').length;
  const observacaoCount = pessoas.filter(p => p.status === 'Em Observação').length;
  const afastadosCount = pessoas.filter(p => p.status === 'Afastado').length;

  // Next escala
  const upcomingEscalas = escalas
    .filter(e => new Date(e.data) >= new Date('2026-07-17'))
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  
  const proximaEscala = upcomingEscalas[0];

  // Global attendance
  let averageAttendance = 0;
  if (aulas.length > 0) {
    let totalPresent = 0;
    let totalPossible = 0;
    aulas.forEach(aula => {
      const presences = Object.values(aula.presencas);
      totalPresent += presences.filter(p => p === true).length;
      totalPossible += presences.length;
    });
    averageAttendance = totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 0;
  }

  // Instrument distribution
  const instrumentCounts: Record<string, number> = {};
  pessoas.forEach(p => {
    if (p.instrumento) {
      instrumentCounts[p.instrumento] = (instrumentCounts[p.instrumento] || 0) + 1;
    }
  });

  const sortedInstruments = Object.entries(instrumentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // =================================================================
  // RENDERIZAÇÃO ESPECÍFICA PARA O ALUNO (ISOLAMENTO DE DADOS)
  // =================================================================
  if (user?.role === 'CONSULTA') {
    const primaryTurma = studentTurmas[0];
    const instrutorTurma = primaryTurma ? pessoas.find(p => p.id === primaryTurma.professorId) : null;

    return (
      <div className="space-y-6 relative" id="dashboard-tab-container">
        <MusicalWatermark type="pauta" position="center-right" opacityClass="opacity-[0.03] dark:opacity-[0.05]" />

        {/* Banner do Aluno */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 md:p-8 border border-emerald-900/40 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portal do Aluno CCB • Jardim Maria Rosa</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Paz de Deus, <span className="text-emerald-400">{currentPessoa?.nome || user.nome}</span>!
              </h1>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Acompanhe o seu boletim de notas, métodos estudados e sua frequência nas aulas de{' '}
                <strong className="text-white">{currentPessoa?.instrumento || 'seu instrumento'}</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => onNavigate('boletim')}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Meu Boletim Pedagógico</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('aulas')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Minhas Aulas & Chamada</span>
              </button>
            </div>
          </div>
        </div>

        {/* Garantia de Isolamento de Dados */}
        <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-2xl flex items-center justify-between gap-4 text-xs text-emerald-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-emerald-300">Acesso Exclusivo & Isolado:</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Você visualiza apenas os seus dados, notas e faltas. Nenhum dado sobre outros alunos está acessível nesta conta.
              </p>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full font-bold text-emerald-300 shrink-0">
            Ficha: {currentPessoa?.id || user.pessoaId || 'Aluno'}
          </span>
        </div>

        {/* KPIs do Aluno */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Frequência Pessoal */}
          <div 
            onClick={() => onNavigate('aulas')}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Sua Frequência</span>
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                <CheckSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{studentFreqPct}%</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {studentPresencasCount} presenças em {studentAulas.length} chamadas
              </p>
            </div>
          </div>

          {/* Card 2: Média Geral */}
          <div 
            onClick={() => onNavigate('boletim')}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Média Pedagógica</span>
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{studentMediaGeral}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Avaliação de ritmo, leitura e técnica
              </p>
            </div>
          </div>

          {/* Card 3: Minha Turma */}
          <div 
            onClick={() => onNavigate('turmas')}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Sua Turma</span>
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-white truncate">
                {primaryTurma ? primaryTurma.nome : 'Turma em Alocação'}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">
                {primaryTurma?.horario || 'Sábados às 11:00'} • {instrutorTurma ? instrutorTurma.nome : 'Instrutor'}
              </p>
            </div>
          </div>

          {/* Card 4: Instrumento e Fase */}
          <div 
            onClick={() => onNavigate('boletim')}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Nível Didático</span>
              <div className="p-2.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                <Music className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Fase {currentPessoa?.fase || 2} • {currentPessoa?.instrumento || 'Trombone'}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Status: {currentPessoa?.status || 'Ativo'}
              </p>
            </div>
          </div>
        </div>

        {/* Grade de Atalhos e Estudo do Aluno */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => onNavigate('boletim')}
            className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-white">Consultar Meu Boletim</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visualize suas notas detalhadas de cada lição do método Bona, pareceres dos instrutores e evolução mensal.
            </p>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-2">
              Acessar Boletim <ChevronRight className="w-4 h-4" />
            </span>
          </div>

          <div 
            onClick={() => onNavigate('metodos')}
            className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl w-fit">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-white">Métodos & Solfejo Interativo</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pratique os exercícios do Método Bona, divisão musical, metrônomo integrado e audição dos intervalos.
            </p>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 pt-2">
              Abrir Métodos <ChevronRight className="w-4 h-4" />
            </span>
          </div>

          <div 
            onClick={() => onNavigate('turmas')}
            className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-amber-500/50 hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl w-fit">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-white">Minha Turma & Horários</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Consulte a sala, o horário de estudo aos sábados e os dados de contato do seu instrutor responsável.
            </p>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 pt-2">
              Ver Detalhes da Turma <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Calendário da Congregação */}
        <OfficialCalendarBanner compact={true} />
      </div>
    );
  }

  // =================================================================
  // RENDERIZAÇÃO PADRÃO (ADMIN / INSTRUTOR)
  // =================================================================
  return (
    <div className="space-y-6 relative" id="dashboard-tab-container">
      <MusicalWatermark type="pauta" position="center-right" opacityClass="opacity-[0.03] dark:opacity-[0.05]" />

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 md:p-8 border border-slate-800 shadow-sm">
        <MusicalWatermark type="dupla" position="bottom-right" opacityClass="opacity-[0.08] text-white" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <span>📍</span>
              <span>CCB Jardim Maria Rosa • Taboão da Serra - SP</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
              {user?.role === 'INSTRUTOR' 
                ? `Painel do Instrutor • ${user.nome}` 
                : 'Visão Geral Pedagógica & Orquestra • Jardim Maria Rosa'}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {user?.role === 'INSTRUTOR'
                ? `Gerencie as turmas sob sua docência (${instructorTurmas.length} turmas • ${instructorStudentsCount} alunos), registre chamadas e avalie o boletim dos seus alunos.`
                : 'Acompanhe frequências, desenvolvimento didático dos alunos de Taboão da Serra, escalas de cultos e estatísticas dos naipes em tempo real.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {user?.role === 'ADMIN' && (
              <button
                onClick={() => onNavigate('pessoas')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Gerenciar Integrantes</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('aulas')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{user?.role === 'INSTRUTOR' ? 'Lançar Chamada da Aula' : 'Registrar Aula'}</span>
            </button>
            <button
              onClick={() => onNavigate('boletim')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Boletim Pedagógico</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Congregation & Orchestra Calendar Banner */}
      <OfficialCalendarBanner compact={true} />

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-grid">
        {/* Card 1: Músicos / Turmas do Instrutor */}
        <div 
          onClick={() => onNavigate(user?.role === 'INSTRUTOR' ? 'turmas' : 'pessoas')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:shadow-md transition-all group"
          id="kpi-musicos"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              {user?.role === 'INSTRUTOR' ? 'Minhas Turmas' : 'Músicos Ativos'}
            </span>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
              <Music className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white">
              {user?.role === 'INSTRUTOR' ? instructorTurmas.length : musicos.filter(m => m.status === 'Ativo').length}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {user?.role === 'INSTRUTOR'
                ? `Total de ${instructorStudentsCount} alunos matriculados`
                : `Total de ${musicos.length} músicos cadastrados (${afastadosCount} afastados)`}
            </p>
          </div>
        </div>

        {/* Card 2: Alunos */}
        <div 
          onClick={() => onNavigate('turmas')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:shadow-md transition-all group"
          id="kpi-alunos"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              {user?.role === 'INSTRUTOR' ? 'Alunos Atendidos' : 'Escola de Música'}
            </span>
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white">
              {user?.role === 'INSTRUTOR' ? instructorStudentsCount : alunos.length}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {user?.role === 'INSTRUTOR' ? 'Nas suas turmas de estudo' : `Distribuídos em ${turmas.length} turmas instrumentais`}
            </p>
          </div>
        </div>

        {/* Card 3: Próxima Escala */}
        <div 
          onClick={() => onNavigate('escalas')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:shadow-md transition-all group"
          id="kpi-escalas"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Próximo Evento</span>
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate">
              {proximaEscala ? proximaEscala.evento : 'Nenhum agendado'}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {proximaEscala ? new Date(proximaEscala.data).toLocaleString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Sem escalas ativas'}
            </p>
          </div>
        </div>

        {/* Card 4: Frequência */}
        <div 
          onClick={() => onNavigate('aulas')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:shadow-md transition-all group"
          id="kpi-frequencia"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Presença nas Aulas</span>
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl group-hover:scale-110 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white">
              {aulas.length > 0 ? `${averageAttendance}%` : 'Sem dados'}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Calculada com base em {aulas.length} registros de chamadas
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Statistics & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-main-grid">
        
        {/* Left 2 Columns: Schedule & Instrument Distribution */}
        <div className="lg:col-span-2 space-y-6" id="dashboard-left-group">
          
          {/* Upcoming Schedules */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs" id="widget-escalas">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Escalas e Ensaios Próximos</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Cronograma de cultos e convocações musicais</p>
              </div>
              <button 
                onClick={() => onNavigate('escalas')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Ver todas <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingEscalas.length === 0 ? (
                <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-sm">
                  Nenhuma escala de culto ou ensaio agendada nos próximos dias.
                </div>
              ) : (
                upcomingEscalas.slice(0, 3).map(escala => {
                  const regente = pessoas.find(p => p.id === escala.regenteId);
                  const statusColors = {
                    Confirmado: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900',
                    Rascunho: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900',
                    Realizado: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
                  };

                  return (
                    <div 
                      key={escala.id} 
                      className="p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-750/30 transition-all flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800 dark:text-white">{escala.evento}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${statusColors[escala.status]}`}>
                            {escala.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                          <span>📅 {new Date(escala.data).toLocaleString('pt-BR', { weekday: 'short', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          <span>•</span>
                          <span>🎻 {regente ? regente.nome : 'Sem regente'}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg font-semibold">
                          {escala.musicosIds.length} Escalados
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Instrument counts bar list */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs" id="widget-instrumentos">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Instrumentos em Destaque</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Distribuição dos instrumentos mais tocados no corpo musical</p>
              </div>
              <button 
                onClick={() => onNavigate('orquestra')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Ver Raio-X <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {sortedInstruments.length === 0 ? (
              <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-sm">
                Nenhum músico cadastrado com instrumento ainda.
              </div>
            ) : (
              <div className="space-y-4">
                {sortedInstruments.map(([instName, count]) => {
                  const maxCount = Math.max(...Object.values(instrumentCounts));
                  const percentage = Math.round((count / maxCount) * 100);
                  
                  return (
                    <div key={instName} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700 dark:text-slate-300">{instName}</span>
                        <span className="text-slate-500 dark:text-slate-400">{count} {count === 1 ? 'membro' : 'membros'}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Column: Maestro notes and quick status distribution */}
        <div className="space-y-6" id="dashboard-right-group">
          
          {/* Maestro's Bulletin/Log Board */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col h-full min-h-[300px]" id="widget-bulletin">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">Quadro de Avisos do Maestro</h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Bloco de notas rápido para recados e diretrizes</p>
              </div>
            </div>
            
            <textarea
              className="flex-1 w-full bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none font-sans leading-relaxed"
              value={logNotes}
              onChange={(e) => setLogNotes(e.target.value)}
              placeholder="Digite notas rápidas, recados ou lembretes importantes aqui..."
            />
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-right italic">
              Salva automaticamente no navegador do usuário
            </div>
          </div>

          {/* Health index status */}
          <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Status da Orquestra</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {ativosCount} ativos • {observacaoCount} em observação • {afastadosCount} afastados
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
