/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Pessoa } from '../types';
import { INSTRUMENTOS_PREDEFINIDOS } from '../data/mockData';
import { 
  Heart, 
  ShieldAlert, 
  Sparkles, 
  Users, 
  HelpCircle,
  TrendingUp,
  Sliders,
  CheckCircle,
  Compass
} from 'lucide-react';

interface OrquestraProps {
  pessoas: Pessoa[];
}

export default function Orquestra({ pessoas }: OrquestraProps) {
  const [activeFamily, setActiveFamily] = useState<'Todos' | 'Cordas e Teclado' | 'Madeiras' | 'Metais'>('Todos');

  // Filter only active musicians & active advanced students who play
  const músicosAtivos = pessoas.filter(p => p.status === 'Ativo' && (p.tipo === 'Musico' || p.tipo === 'Professor'));
  const totalCorpoMusical = músicosAtivos.length;

  // Group by family
  const familyCounts = {
    'Cordas e Teclado': 0,
    Madeiras: 0,
    Metais: 0,
    Outros: 0
  };

  músicosAtivos.forEach(m => {
    const info = INSTRUMENTOS_PREDEFINIDOS.find(i => i.nome === m.instrumento);
    const fam = info ? info.familia : 'Outros';
    if (fam in familyCounts) {
      familyCounts[fam as keyof typeof familyCounts]++;
    } else {
      familyCounts.Outros++;
    }
  });

  // Balance Index: ideally Strings and Keyboards should be around 50% - 60% of an orchestra for balanced acoustics
  const cordasRatio = totalCorpoMusical > 0 ? (familyCounts['Cordas e Teclado'] / totalCorpoMusical) * 100 : 0;
  const soprosRatio = totalCorpoMusical > 0 ? ((familyCounts.Madeiras + familyCounts.Metais) / totalCorpoMusical) * 100 : 0;

  let balanceStatus = 'Equilibrado';
  let balanceDesc = 'A proporção acústica entre cordas/teclado e sopros está ideal.';
  let balanceColor = 'text-emerald-500 dark:text-emerald-400';
  let balanceBg = 'bg-emerald-500/10';

  if (totalCorpoMusical === 0) {
    balanceStatus = 'Sem Dados';
    balanceDesc = 'Cadastre músicos ativos para avaliar o balanço acústico.';
    balanceColor = 'text-slate-400';
    balanceBg = 'bg-slate-500/10';
  } else if (cordasRatio < 40) {
    balanceStatus = 'Sopros Dominantes';
    balanceDesc = 'O volume de sopros pode encobrir as cordas e teclado. Recomendado recrutar mais violinistas, organistas e violoncelistas.';
    balanceColor = 'text-amber-500 dark:text-amber-400';
    balanceBg = 'bg-amber-500/10';
  } else if (cordasRatio > 75) {
    balanceStatus = 'Cordas e Teclado Dominantes';
    balanceDesc = 'Seção de cordas e teclado muito densa. Espaço excelente para adicionar flautas, clarinetes e metais.';
    balanceColor = 'text-blue-500 dark:text-blue-400';
    balanceBg = 'bg-blue-500/10';
  }

  // Find critical instruments (Instruments with 0 active musicians)
  const instrumentsWithCount = INSTRUMENTOS_PREDEFINIDOS.map(inst => {
    const count = músicosAtivos.filter(m => m.instrumento === inst.nome).length;
    return { ...inst, count };
  });

  const criticalInstruments = instrumentsWithCount.filter(i => i.count === 0);

  // Filter instrument counts for specific family view
  const displayInstruments = instrumentsWithCount.filter(i => {
    if (activeFamily === 'Todos') return true;
    return i.familia === activeFamily;
  });

  return (
    <div className="space-y-6" id="orquestra-tab-container">
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Raio-X Acústico & Naipes Oficiais</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500">Mapeamento dinâmico dos 20 instrumentos oficiais ensinados na orquestra e seu equilíbrio sonoro.</p>
      </div>

      {/* Balance assessment row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Acoustic Balance Gauge */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-500" />
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">Equilíbrio Acústico</h4>
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className={`p-4 rounded-2xl ${balanceBg} flex items-center justify-center shrink-0`}>
              <span className={`text-xl font-bold ${balanceColor}`}>
                {Math.round(cordasRatio)}%
              </span>
            </div>
            <div>
              <span className={`text-sm font-bold block ${balanceColor}`}>{balanceStatus}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-bold mt-0.5">Fator Cordas / Sopros</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            {balanceDesc}
          </p>

          <div className="space-y-2 pt-1 text-xs font-semibold">
            <div className="flex justify-between text-slate-500">
              <span>Cordas e Teclado (Meta: 50-60%)</span>
              <span>{Math.round(cordasRatio)}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${cordasRatio}%` }} />
            </div>

            <div className="flex justify-between text-slate-500 pt-1">
              <span>Sopros (Madeiras e Metais)</span>
              <span>{Math.round(soprosRatio)}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${soprosRatio}%` }} />
            </div>
          </div>
        </div>

        {/* Orchestra Family Distribution */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 lg:col-span-2">
          <h4 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-500" />
            <span>Fator de Presença por Família de Instrumentos</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {[
              { name: 'Cordas e Teclado', icon: '🎻', count: familyCounts['Cordas e Teclado'], color: 'border-blue-200 bg-blue-50/20 text-blue-600 dark:border-blue-900/50 dark:text-blue-400' },
              { name: 'Madeiras', icon: '🎷', count: familyCounts.Madeiras, color: 'border-emerald-200 bg-emerald-50/20 text-emerald-600 dark:border-emerald-900/50 dark:text-emerald-400' },
              { name: 'Metais', icon: '🎺', count: familyCounts.Metais, color: 'border-amber-200 bg-amber-50/20 text-amber-600 dark:border-amber-900/50 dark:text-amber-400' },
            ].map(fam => {
              const perc = totalCorpoMusical > 0 ? Math.round((fam.count / totalCorpoMusical) * 100) : 0;
              return (
                <div key={fam.name} className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-2 ${fam.color}`}>
                  <span className="text-2xl">{fam.icon}</span>
                  <div>
                    <span className="text-sm font-bold block">{fam.name}</span>
                    <span className="text-[10px] opacity-75">{fam.count} ativos ({perc}%)</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50/40 dark:bg-blue-950/20 p-4 rounded-xl border border-dashed border-blue-200 dark:border-blue-800/80 flex items-start gap-3 text-xs text-blue-700 dark:text-blue-300">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Dica de Regência:</span>
              <span>O equilíbrio acústico otimiza a reverberação no templo. Mantenha os metais no fundo, madeiras no centro e cordas na frente.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical shortages recruitment alert */}
      {criticalInstruments.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="font-bold text-amber-800 dark:text-amber-300 block">⚠️ Naipes Desguarnecidos (Sem Músicos Cadastrados)</span>
            <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
              Não temos nenhum músico ativo cadastrado tocando: <span className="font-bold">{criticalInstruments.map(i => i.nome).join(', ')}</span>. 
              Foque em incentivar novos alunos a escolherem estes instrumentos oficiais para encorpar a orquestra.
            </p>
          </div>
        </div>
      )}

      {/* Instrument List Roster & Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-white text-base">Censo Oficial de Instrumentos (20 Oficiais)</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500">Relação de todos os instrumentos oficiais ensinados e o número de integrantes ativos.</p>
          </div>

          {/* Quick tab filters */}
          <div className="flex flex-wrap gap-1.5 bg-slate-50 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {['Todos', 'Cordas e Teclado', 'Madeiras', 'Metais'].map(fam => (
              <button
                key={fam}
                onClick={() => setActiveFamily(fam as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeFamily === fam ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}
              >
                {fam}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id="instrument-census-grid">
          {displayInstruments.map(inst => {
            // Find names of people playing this instrument
            const players = músicosAtivos.filter(m => m.instrumento === inst.nome).map(m => m.nome);

            return (
              <div 
                key={inst.nome} 
                className={`p-4 rounded-xl border transition-all ${inst.count > 0 ? 'bg-slate-50/50 border-slate-200 dark:bg-slate-900/20 dark:border-slate-700/60' : 'bg-slate-50/20 border-dashed border-slate-200 dark:bg-transparent dark:border-slate-800'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-slate-800 dark:text-white block">{inst.nome}</span>
                    {'observacao' in inst && inst.observacao && (
                      <span className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold block mt-0.5">
                        ♀️ {inst.observacao}
                      </span>
                    )}
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ml-2 ${inst.count > 0 ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-900/60 dark:text-slate-600'}`}>
                    {inst.count} {inst.count === 1 ? 'músico' : 'músicos'}
                  </span>
                </div>

                <div className="mt-3.5 space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Instrumentistas:</span>
                  {players.length === 0 ? (
                    <span className="text-xs text-rose-500/80 dark:text-rose-400/80 italic block">⚠️ Seção vazia</span>
                  ) : (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {players.map(pName => (
                        <span 
                          key={pName} 
                          className="text-[10px] bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/80 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300 font-medium"
                        >
                          {pName.split(' ')[0]} {pName.split(' ').slice(-1)[0]}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
