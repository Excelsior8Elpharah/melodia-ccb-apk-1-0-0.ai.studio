/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Clock, ShieldCheck, AlertTriangle, BookOpen, Music, Users, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { CALENDARIO_OFICIAL_REGRAS } from '../utils/officialCalendar';

interface OfficialCalendarBannerProps {
  compact?: boolean;
}

export default function OfficialCalendarBanner({ compact = false }: OfficialCalendarBannerProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-2xl p-4 md:p-5 text-white shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-500/30 shrink-0">
            <Calendar className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm md:text-base text-white tracking-tight">
                Calendário Oficial da Orquestra & Congregação • Jardim Maria Rosa (Taboão da Serra)
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Horários Integrados
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Programação recorrente e cultos oficiais • CCB Jardim Maria Rosa, Taboão da Serra - SP
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>{isExpanded ? 'Ocultar Detalhes' : 'Ver Calendário Completo'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Grid Summary Always Visible or Expanded */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Cultos Oficiais */}
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Cultos Oficiais (Adultos)</span>
            </div>
            <div className="text-xs text-slate-200 space-y-1 pl-1">
              <div className="flex items-center justify-between">
                <span>Terça-feira:</span>
                <span className="font-mono text-amber-300 font-semibold">19:00 - 21:00</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sexta-feira:</span>
                <span className="font-mono text-amber-300 font-semibold">19:00 - 21:00</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Domingo:</span>
                <span className="font-mono text-amber-300 font-semibold">14:00 - 16:00</span>
              </div>
            </div>
          </div>

          {/* 2. Culto de Jovens */}
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
              <Users className="w-4 h-4 shrink-0" />
              <span>Culto de Jovens</span>
            </div>
            <div className="text-xs text-slate-200 space-y-1 pl-1">
              <div className="flex items-center justify-between">
                <span>Domingo:</span>
                <span className="font-mono text-cyan-300 font-semibold">09:00 - 11:00</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Bloqueado para evitar conflito com aulas.
            </p>
          </div>

          {/* 3. Aulas de Música */}
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Aulas de Música</span>
            </div>
            <div className="text-xs text-slate-200 space-y-1 pl-1">
              <div className="flex items-center justify-between">
                <span>Sábado:</span>
                <span className="font-mono text-emerald-300 font-bold">11:00 - 14:00</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-300">
              Todas as turmas pedagógicas são organizadas neste horário.
            </p>
          </div>

          {/* 4. Ensaio da Orquestra */}
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60 space-y-1.5">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs">
              <Music className="w-4 h-4 shrink-0" />
              <span>Ensaio Geral da Orquestra</span>
            </div>
            <div className="text-xs text-slate-200 space-y-1 pl-1">
              <div className="flex items-center justify-between">
                <span>1º Sábado do mês:</span>
                <span className="font-mono text-purple-300 font-semibold">19:00 - 21:00</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-300">
              Destaque especial e presença orquestral completa.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
