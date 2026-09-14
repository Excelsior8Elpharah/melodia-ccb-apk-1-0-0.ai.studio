import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Award, 
  Target, 
  HelpCircle, 
  Layers, 
  ChevronRight, 
  CheckCircle2, 
  Plus, 
  Copy, 
  FileText,
  Sparkles,
  Zap,
  Music,
  Wind,
  ShieldCheck,
  Check,
  Compass,
  Cpu,
  Clock,
  ArrowRight,
  Info,
  Sliders,
  Flame,
  Volume2,
  Hand
} from 'lucide-react';
import { 
  FUNDAMENTOS_VIOLA_VOLMER, 
  ESTRUTURA_PEDAGOGICA_VIOLA_VOLMER, 
  EXERCICIOS_VIOLA_VOLMER 
} from '../data/metodoViolaVolmer';
import { ExercícioViolaVolmer, MaterialCatalogo, UnidadePedagogicaViolaVolmer } from '../types';
import MusicalWatermark from './MusicalWatermark';

interface MetodoViolaVolmerProps {
  onAddCatalogItem?: (item: MaterialCatalogo) => void;
  toast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function MetodoViolaVolmer({ onAddCatalogItem, toast }: MetodoViolaVolmerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSecao, setSelectedSecao] = useState<string>('Todas');
  const [selectedNivel, setSelectedNivel] = useState<string>('Todos');
  const [selectedGriff, setSelectedGriff] = useState<string>('Todas');
  const [selectedExercise, setSelectedExercise] = useState<ExercícioViolaVolmer | null>(null);
  const [activeTab, setActiveTab] = useState<'exercicios' | 'unidades' | 'griffstellung' | 'fundamentos' | 'gerador'>('exercicios');

  // Generator state
  const [genNivel, setGenNivel] = useState<'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado'>('Básico');
  const [genFoco, setGenFoco] = useState<string>('1ª Griffstellung (Semitom 2º-3º dedos)');
  const [genMinutos, setGenMinutos] = useState<number>(45);

  // Filter exercises
  const filteredExercises = EXERCICIOS_VIOLA_VOLMER.filter(ex => {
    if (selectedSecao !== 'Todas' && ex.secao !== selectedSecao) return false;
    if (selectedNivel !== 'Todos' && ex.nivel !== selectedNivel) return false;
    if (selectedGriff !== 'Todas' && ex.griffstellung !== selectedGriff) return false;

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchNum = ex.numero.toString() === q || `ex. ${ex.numero}`.includes(q) || `exercício ${ex.numero}`.includes(q);
      const matchTitle = ex.titulo.toLowerCase().includes(q);
      const matchTon = ex.tonalidade.toLowerCase().includes(q);
      const matchComp = ex.compasso.toLowerCase().includes(q);
      const matchDesc = ex.descricao.toLowerCase().includes(q);
      const matchConc = ex.conceitos.some(c => c.toLowerCase().includes(q));
      const matchDif = ex.dificuldades.some(d => d.toLowerCase().includes(q));
      const matchTec = ex.tecnicaPrincipal.toLowerCase().includes(q);
      const matchCompName = ex.compositor ? ex.compositor.toLowerCase().includes(q) : false;
      return matchNum || matchTitle || matchTon || matchComp || matchDesc || matchConc || matchDif || matchTec || matchCompName;
    }

    return true;
  });

  // Add to catalog handler
  const handleAddToCatalog = (ex: ExercícioViolaVolmer) => {
    if (!onAddCatalogItem) return;
    const newItem: MaterialCatalogo = {
      id: 'viola-volmer-' + ex.numero + '-' + Date.now().toString(36),
      nome: `Viola de Arco (Berta Volmer) Ex. ${ex.numero} – ${ex.titulo}`,
      instrumento: 'Viola de Arco',
      fase: ex.faseOrquestra,
      tipo: ex.secao.includes('Moll') || ex.compositor ? 'Repertório' : 'Técnica',
      metodo: 'Berta Volmer (Viola)',
      descricao: `Página ${ex.pagina} (${ex.compasso}, ${ex.tonalidade}). ${ex.tecnicaPrincipal}. ${ex.descricao}`
    };
    onAddCatalogItem(newItem);
    toast(`✅ Viola Volmer Ex. ${ex.numero} adicionado ao Catálogo de Materiais!`, 'success');
  };

  // Copy lesson text
  const handleCopyLessonText = (ex: ExercícioViolaVolmer) => {
    const text = `📖 MÉTODO BERTA VOLMER – BRATSCHENSCHULE BAND I (Viola de Arco)\n` +
      `📌 ${ex.secao} - Ex. ${ex.numero} (Pág. ${ex.pagina})\n` +
      `🎯 Título: ${ex.titulo} ${ex.compositor ? `(${ex.compositor})` : ''}\n` +
      `🎶 Métrica & Tom: ${ex.compasso} em ${ex.tonalidade} (${ex.andamento})\n` +
      `💡 Técnica Principal: ${ex.tecnicaPrincipal}\n` +
      `⚠️ Desafios Técnicos: ${ex.dificuldades.join(', ')}\n` +
      `📝 Instruções de Berta Volmer: ${ex.descricao}`;
    
    navigator.clipboard.writeText(text);
    toast(`📋 Roteiro do Ex. ${ex.numero} copiado para a área de transferência!`, 'info');
  };

  // Copy unit plan
  const handleCopyUnitPlan = (un: UnidadePedagogicaViolaVolmer) => {
    const text = `🎯 PLANO DE ESTUDO DE VIOLA - UNIDADE ${un.unidadeNumero} (Berta Volmer Band I)\n` +
      `📌 Título: ${un.titulo} (${un.paginas})\n` +
      `─────────────────────────────────────────\n` +
      `🎯 Objetivos de Aprendizagem:\n${un.objetivos.map(o => ` • ${o}`).join('\n')}\n\n` +
      `⚙️ Fundamentos Técnicos:\n${un.fundamentosTecnicos.map(f => ` • ${f}`).join('\n')}\n\n` +
      `💡 Orientações da Autora:\n${un.orientacoesAutor.map(a => ` • ${a}`).join('\n')}`;
    
    navigator.clipboard.writeText(text);
    toast(`📋 Plano da Unidade ${un.unidadeNumero} copiado com sucesso!`, 'success');
  };

  return (
    <div className="space-y-6 relative" id="metodo-viola-volmer-container">
      <MusicalWatermark type="do" position="center-right" opacityClass="opacity-[0.035] dark:opacity-[0.05]" />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-md border border-purple-800/50 relative overflow-hidden">
        <MusicalWatermark type="do" position="bottom-right" opacityClass="opacity-[0.12] text-purple-200" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-400/30 flex items-center gap-1">
                <Music className="w-3.5 h-3.5" /> Método Oficial de Viola
              </span>
              <span className="bg-indigo-400/20 text-indigo-200 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-300/30">
                Berta Volmer (Schott ED 4613)
              </span>
              <span className="bg-fuchsia-500/20 text-fuchsia-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-fuchsia-400/30">
                Clave de Dó (3ª Linha)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-purple-100 flex items-center gap-2">
              <span>🎻</span> Método Berta Volmer – Viola (Volume 1)
            </h1>
            <p className="text-purple-200/80 text-sm max-w-2xl">
              Estrutura didática completa para Viola de Arco: Clave de Dó na 3ª linha, afinação C-G-D-A, as 5 Griffstellungen, Meia Posição (Halbe Lage), Martelé, Spiccato (WurfBogen) e Apêndice de 84 Golpes de Arco.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-purple-950/60 p-3 rounded-xl border border-purple-700/40 shrink-0">
            <div className="text-center px-3 border-r border-purple-800">
              <span className="block text-2xl font-black text-purple-300">7</span>
              <span className="text-[10px] uppercase tracking-wider text-purple-200 font-bold">Unidades</span>
            </div>
            <div className="text-center px-3 border-r border-purple-800">
              <span className="block text-2xl font-black text-purple-300">147</span>
              <span className="text-[10px] uppercase tracking-wider text-purple-200 font-bold">Estudos</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-2xl font-black text-purple-300">84</span>
              <span className="text-[10px] uppercase tracking-wider text-purple-200 font-bold">Arcadas</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-purple-800/60">
          <button
            onClick={() => setActiveTab('exercicios')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'exercicios' 
                ? 'bg-purple-400 text-slate-950 shadow-sm' 
                : 'bg-purple-950/50 text-purple-200 hover:bg-purple-900/60'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Exercícios Indexados</span>
          </button>

          <button
            onClick={() => setActiveTab('unidades')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'unidades' 
                ? 'bg-purple-400 text-slate-950 shadow-sm' 
                : 'bg-purple-950/50 text-purple-200 hover:bg-purple-900/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>7 Unidades Pedagógicas</span>
          </button>

          <button
            onClick={() => setActiveTab('griffstellung')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'griffstellung' 
                ? 'bg-purple-400 text-slate-950 shadow-sm' 
                : 'bg-purple-950/50 text-purple-200 hover:bg-purple-900/60'
            }`}
          >
            <Hand className="w-4 h-4" />
            <span>5 Griffstellungen & Halbe Lage</span>
          </button>

          <button
            onClick={() => setActiveTab('fundamentos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'fundamentos' 
                ? 'bg-purple-400 text-slate-950 shadow-sm' 
                : 'bg-purple-950/50 text-purple-200 hover:bg-purple-900/60'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>Fundamentos da Viola de Arco</span>
          </button>

          <button
            onClick={() => setActiveTab('gerador')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'gerador' 
                ? 'bg-purple-400 text-slate-950 shadow-sm' 
                : 'bg-purple-950/50 text-purple-200 hover:bg-purple-900/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Gerador de Plano de Aula</span>
          </button>
        </div>
      </div>

      {/* TAB 1: EXERCÍCIOS INDEXADOS */}
      {activeTab === 'exercicios' && (
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por número, tom, técnica (ex: 'Martelé', 'Spiccato', 'WurfBogen', 'Halbe Lage', 'Campagnoli', 'Bach')..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:text-white"
                />
              </div>

              {/* Section Filter */}
              <select
                value={selectedSecao}
                onChange={(e) => setSelectedSecao(e.target.value)}
                className="px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:text-white font-medium cursor-pointer"
              >
                <option value="Todas">Todas as Seções do Método</option>
                <option value="Fundamentos & Cordas Soltas">Fundamentos & Cordas Soltas</option>
                <option value="Primeira Griffstellung (1ª Posição de Dedilhado)">1ª Griffstellung (Semitom 2º-3º)</option>
                <option value="Segunda Griffstellung & Synkopen">2ª Griffstellung, Cordas Duplas & Síncopas</option>
                <option value="Terceira Griffstellung & Tonalidades Sustenizadas">3ª Griffstellung & Tonalidades Sustenizadas</option>
                <option value="Quarta e Quinta Griffstellungen & Cromatismos">4ª e 5ª Griffstellungen & Bemóis</option>
                <option value="Golpes de Arco (Martelé, Spiccato & Triolen)">Golpes de Arco (Martelé, Spiccato, Triolen)</option>
                <option value="Die Halbe Lage (Meia Posição)">Die Halbe Lage (Meia Posição)</option>
                <option value="Die Moll-Tonleitern (Escalas Menores & Dinâmicas)">Escalas Menores & Dinâmicas</option>
                <option value="Bogentechnischer Anhang (Apêndice de Golpes de Arco)">Apêndice de Arco (84 Variações)</option>
              </select>

              {/* Nivel Filter */}
              <select
                value={selectedNivel}
                onChange={(e) => setSelectedNivel(e.target.value)}
                className="px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:text-white font-medium cursor-pointer"
              >
                <option value="Todos">Todos os Níveis</option>
                <option value="Iniciante">Iniciante</option>
                <option value="Básico">Básico</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>Mostrando <strong>{filteredExercises.length}</strong> exercícios do Método Volmer de Viola</span>
              {(selectedSecao !== 'Todas' || selectedNivel !== 'Todos' || searchTerm !== '') && (
                <button
                  onClick={() => {
                    setSelectedSecao('Todas');
                    setSelectedNivel('Todos');
                    setSearchTerm('');
                  }}
                  className="text-purple-600 dark:text-purple-400 hover:underline font-semibold cursor-pointer"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExercises.map((ex) => (
              <div 
                key={`${ex.secao}-${ex.numero}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 dark:hover:border-purple-500/50 p-5 rounded-2xl shadow-sm transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                        Pág. {ex.pagina} • {ex.secao}
                      </span>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight mt-0.5">
                        Ex. {ex.numero} – {ex.titulo}
                      </h3>
                      {ex.compositor && (
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
                          Compositor: {ex.compositor}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 text-xs font-bold px-2 py-0.5 rounded-lg border border-purple-200 dark:border-purple-800">
                        Fase {ex.faseOrquestra}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border ${
                        ex.nivel === 'Iniciante' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300' :
                        ex.nivel === 'Básico' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300' :
                        ex.nivel === 'Intermediário' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300' :
                        'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300'
                      }`}>
                        {ex.nivel}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {ex.descricao}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Tonalidade & Métrica</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{ex.tonalidade} ({ex.compasso})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Técnica Principal</span>
                      <span className="font-bold text-purple-700 dark:text-purple-300 truncate block">{ex.tecnicaPrincipal}</span>
                    </div>
                  </div>

                  {/* Concepts badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {ex.griffstellung && (
                      <span className="text-[10px] font-bold bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-800 dark:text-fuchsia-300 px-2 py-0.5 rounded-md border border-fuchsia-300 dark:border-fuchsia-800">
                        {ex.griffstellung}
                      </span>
                    )}
                    {ex.conceitos.map((c, i) => (
                      <span key={i} className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 gap-2">
                  <button
                    onClick={() => setSelectedExercise(ex)}
                    className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver Detalhes Pedagógicos</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLessonText(ex)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                      title="Copiar texto para roteiro de aula"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleAddToCatalog(ex)}
                      className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Catálogo</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: UNIDADES PEDAGÓGICAS */}
      {activeTab === 'unidades' && (
        <div className="space-y-6">
          {ESTRUTURA_PEDAGOGICA_VIOLA_VOLMER.map((un) => (
            <div 
              key={un.unidadeNumero}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 block">
                    {un.paginas}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {un.titulo}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyUnitPlan(un)}
                    className="px-3 py-1.5 bg-purple-600/10 hover:bg-purple-600/20 text-purple-700 dark:text-purple-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all border border-purple-300/40"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Plano da Unidade</span>
                  </button>
                  <span className="bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                    Unidade {un.unidadeNumero} de 7
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {un.descricao}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-purple-500" /> Objetivos de Aprendizagem:
                  </span>
                  <ul className="space-y-1">
                    {un.objetivos.map((obj, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                        <span className="text-purple-500 font-bold">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-purple-500" /> Fundamentos Técnicos Trabalhados:
                  </span>
                  <ul className="space-y-1">
                    {un.fundamentosTecnicos.map((ft, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                        <span className="text-purple-500 font-bold">•</span>
                        <span>{ft}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-50/60 dark:bg-purple-950/30 p-3 rounded-xl border border-purple-200/60 dark:border-purple-900/40 text-xs text-purple-900 dark:text-purple-200">
                  <strong>💡 Regras do Autor (Berta Volmer):</strong>
                  <ul className="mt-1 space-y-0.5">
                    {un.orientacoesAutor.map((ori, i) => (
                      <li key={i}>• {ori}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50/60 dark:bg-rose-950/30 p-3 rounded-xl border border-rose-200/60 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200">
                  <strong>⚠️ Dificuldades Técnicas Recorrentes:</strong>
                  <ul className="mt-1 space-y-0.5">
                    {un.dificuldadesRecorrentes.map((dif, i) => (
                      <li key={i}>• {dif}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: 5 GRIFFSTELLUNGEN & HALBE LAGE */}
      {activeTab === 'griffstellung' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-[10px] uppercase font-black text-purple-600 dark:text-purple-400 block">
                Arquitetura Anatômica da Mão Esquerda na Viola
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                <Hand className="w-5 h-5 text-purple-500" />
                <span>As 5 Griffstellungen & Die Halbe Lage (Berta Volmer)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Berta Volmer estrutura o aprendizado da 1ª posição da viola através da localização precisa do intervalo de meio-tom (Semitom) entre os dedos da mão esquerda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1ª Griffstellung */}
              <div className="bg-purple-50/50 dark:bg-purple-950/20 p-5 rounded-2xl border border-purple-200 dark:border-purple-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-purple-600 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                    1ª Griffstellung
                  </span>
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300">Pág. 3 (Ex. 8)</span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Semitom entre 2º e 3º Dedos
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  O padrão primário da viola. Os dedos 1 e 2 ficam separados por um tom, e os dedos 2 e 3 ficam unidos colados.
                </p>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-purple-100 dark:border-purple-900/40 text-xs font-mono text-purple-900 dark:text-purple-200">
                  Corda Dó: C - D - [E-F] - G<br />
                  Corda Sol: G - A - [H-C] - D<br />
                  Corda Ré: D - E - [Fis-G] - A
                </div>
              </div>

              {/* 2ª Griffstellung */}
              <div className="bg-blue-50/50 dark:bg-blue-950/20 p-5 rounded-2xl border border-blue-200 dark:border-blue-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                    2ª Griffstellung
                  </span>
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Pág. 12 (Ex. 22)</span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Semitom entre 1º e 2º Dedos
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Padrão bemolizado. O 1º e 2º dedos ficam colados no semitom. Fundamental para Fá Maior, Si♭ Maior e Mi♭ Maior.
                </p>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs font-mono text-blue-900 dark:text-blue-200">
                  Corda Dó: C - D - [Es-F] - G<br />
                  Corda Sol: G - A - [B-C] - D<br />
                  Corda Ré: D - E - [F-G] - A
                </div>
              </div>

              {/* 3ª Griffstellung */}
              <div className="bg-amber-50/50 dark:bg-amber-950/20 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-600 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                    3ª Griffstellung
                  </span>
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300">Pág. 26 (Ex. 47)</span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Semitom entre 3º e 4º Dedos
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Padrão sustenizado. Os dedos 1, 2 e 3 ficam afastados por tom e o 3º e 4º unidos. Para Ré, Lá e Mi Maior.
                </p>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-amber-100 dark:border-amber-900/40 text-xs font-mono text-amber-900 dark:text-amber-200">
                  Corda Dó: C - D - E - [Fis-G]<br />
                  Corda Sol: G - A - H - [Cis-D]<br />
                  Corda Ré: D - E - Fis - [Gis-A]
                </div>
              </div>

              {/* 4ª Griffstellung */}
              <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                    4ª Griffstellung
                  </span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Pág. 33 (Ex. 60)</span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Semitom entre Corda Solta e 1º Dedo
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Recuo máximo do 1º dedo. O semitom fica logo após a pestana (As, Es, B, Des).
                </p>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-xs font-mono text-emerald-900 dark:text-emerald-200">
                  Corda Dó: [C - Des] - Es - F - G<br />
                  Corda Sol: [G - As] - B - C - D<br />
                  Corda Ré: [D - Es] - F - G - A
                </div>
              </div>

              {/* 5ª Griffstellung */}
              <div className="bg-fuchsia-50/50 dark:bg-fuchsia-950/20 p-5 rounded-2xl border border-fuchsia-200 dark:border-fuchsia-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-fuchsia-600 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                    5ª Griffstellung
                  </span>
                  <span className="text-xs font-bold text-fuchsia-700 dark:text-fuchsia-300">Pág. 38 (Ex. 68)</span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Semitom Duplo (Corda Solta/1º E 3º/4º)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Combinação avançada. Exige a manutenção dos dois semitons em dedos apoiados no espelho.
                </p>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-fuchsia-100 dark:border-fuchsia-900/40 text-xs font-mono text-fuchsia-900 dark:text-fuchsia-200">
                  Corda Dó: [C - Des] - Es - [Fis - G]<br />
                  Corda Sol: [G - As] - B - [Cis - D]<br />
                  Corda Ré: [D - Es] - F - [Gis - A]
                </div>
              </div>

              {/* Die Halbe Lage */}
              <div className="bg-rose-50/50 dark:bg-rose-950/20 p-5 rounded-2xl border border-rose-200 dark:border-rose-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                    Die Halbe Lage
                  </span>
                  <span className="text-xs font-bold text-rose-700 dark:text-rose-300">Pág. 60 (Ex. 113)</span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Meia Posição (Sattellage)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Deslocamento de meio tom para trás junto à pestana. Evita distensões desconfortáveis do 4º dedo na viola.
                </p>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-rose-100 dark:border-rose-900/40 text-xs font-mono text-rose-900 dark:text-rose-200">
                  1º dedo toca no Des (Corda Dó)<br />
                  2º dedo toca no Es (Corda Dó)<br />
                  Elimina extensão dolorosa do 4º dedo
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FUNDAMENTOS DA VIOLA DE ARCO */}
      {activeTab === 'fundamentos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FUNDAMENTOS_VIOLA_VOLMER.map((f, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-purple-500/10 text-purple-600 rounded-xl">
                      <Music className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 block">
                        {f.subtitulo}
                      </span>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                        {f.categoria}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {f.conteudo}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 block">Pontos Chave do Autor:</span>
                    <ul className="space-y-1">
                      {f.pontosChave.map((pt, pidx) => (
                        <li key={pidx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-950/40 p-3 rounded-xl border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-200 mt-4">
                  <strong>💡 Orientação para o Professor:</strong> {f.orientacaoProfessor}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GERADOR DE PLANO DE AULA */}
      {activeTab === 'gerador' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span>Gerador Automatizado de Roteiro de Aula para Viola</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Configure os parâmetros do aluno de viola para obter instantaneamente um plano de estudos estruturado baseado no Método Berta Volmer (Volume 1).
              </p>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nível Atual do Aluno:
                </label>
                <select
                  value={genNivel}
                  onChange={(e) => setGenNivel(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:text-white font-medium cursor-pointer"
                >
                  <option value="Iniciante">Iniciante (Notação, Clave de Dó & Cordas Soltas)</option>
                  <option value="Básico">Básico (1ª & 2ª Griffstellung, Síncopas e Duetos)</option>
                  <option value="Intermediário">Intermediário (3ª Griffstellung, Ritmo Pontilhado & 4ª/5ª)</option>
                  <option value="Avançado">Avançado (Martelé, Spiccato WurfBogen, Halbe Lage & 84 Arcadas)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Dificuldade / Foco Técnico da Aula:
                </label>
                <select
                  value={genFoco}
                  onChange={(e) => setGenFoco(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:text-white font-medium cursor-pointer"
                >
                  <option value="1ª Griffstellung (Semitom 2º-3º dedos)">1ª Griffstellung (Pág. 3 - Ex. 8-10)</option>
                  <option value="2ª Griffstellung & Cordas Duplas">2ª Griffstellung & Cordas Duplas (Pág. 12 - Ex. 21-22)</option>
                  <option value="3ª Griffstellung & Tonalidades Sustenizadas">3ª Griffstellung em Ré/Lá/Mi (Pág. 26 - Ex. 47)</option>
                  <option value="Golpe de Arco Martelé (Gehämmerter Strich)">Golpe de Arco Martelé (Pág. 42 - Ex. 77-80)</option>
                  <option value="Spiccato / WurfBogen (Arco Jogado)">Spiccato / WurfBogen (Pág. 51 - Ex. 94-96)</option>
                  <option value="Meia Posição (Halbe Lage) & Escalas Menores">Meia Posição Sattellage (Pág. 60 - Ex. 113-120)</option>
                  <option value="Apêndice Técnico de Arco (84 Variações)">Apêndice Técnico de Arco (Pág. 80 - Ex. 147)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tempo Disponível de Estudo (Minutos):
                </label>
                <select
                  value={genMinutos}
                  onChange={(e) => setGenMinutos(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:text-white font-medium cursor-pointer"
                >
                  <option value={30}>30 Minutos (Sessão Rápida)</option>
                  <option value={45}>45 Minutos (Aula Padrão)</option>
                  <option value={60}>60 Minutos (Sessão Completa)</option>
                </select>
              </div>
            </div>

            {/* Generated Plan Output */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                    Roteiro Gerado pelo Método Berta Volmer
                  </span>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                    Plano de Aula de Viola: {genNivel} • {genMinutos} Minutos
                  </h3>
                </div>

                <button
                  onClick={() => {
                    const text = `🎻 ROTEIRO DE AULA DE VIOLA DE ARCO (Método Berta Volmer Band I)\n` +
                      `🎓 Nível: ${genNivel} | Duração: ${genMinutos} min\n` +
                      `🎯 Foco da Aula: ${genFoco}\n` +
                      `─────────────────────────────────────────\n` +
                      `1️⃣ Aquecimento (10 min): Condução de arco em cordas soltas C, G, D, A com divisão G.B., u.H. e o.H. (Ex. 1-4).\n` +
                      `2️⃣ Estudo Técnico de Foco (15 min): Prática de ${genFoco} com atenção rigorosa à afinação do semitom e postura do ombro (Schultergelenk).\n` +
                      `3️⃣ Escalas e Mudanças (10 min): Escala na Griffstellung trabalhada com acentuação rítmica.\n` +
                      `4️⃣ Prática de Dueto/Repertório (10 min): Estudo polifônico ou Dueto com professor (Petzold, Genzmer, Breuer ou Bach).\n` +
                      `─────────────────────────────────────────\n` +
                      `💡 Orientação da Autora: "Manter a linha reta entre mão esquerda e antebraço e executar o movimento pendular do ombro nas trocas de corda."`;
                    navigator.clipboard.writeText(text);
                    toast('📋 Roteiro de Aula de Viola copiado com sucesso!', 'success');
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copiar Roteiro de Aula</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-purple-600 block mb-1">ETAPA 1 (10 MIN)</span>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-xs mb-1">Cordas Soltas & Ombro</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Exercícios 1-4 (Págs. 1-2). Arco inteiro (G.B.) e metades (u.H. e o.H.) observando o pêndulo do cotovelo.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-purple-600 block mb-1">ETAPA 2 (15 MIN)</span>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-xs mb-1">Mecanismo de Mão Esquerda</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Foco em: {genFoco}. Exercícios das seções correspondentes do método Volmer.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-purple-600 block mb-1">ETAPA 3 (10 MIN)</span>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-xs mb-1">Escala & Arpejos</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Escala de 1 ou 2 oitavas na tonalidade do estudo, aplicando variações de arco e tríades.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-purple-600 block mb-1">ETAPA 4 (10 MIN)</span>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-xs mb-1">Prática em Dueto</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Execução do dueto do professor (Corelli, Händel, Breuer, Genzmer, Campagnoli ou Bach).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXERCISE DETAIL MODAL */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                  Pág. {selectedExercise.pagina} • {selectedExercise.secao}
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  Ex. {selectedExercise.numero} – {selectedExercise.titulo}
                </h2>
                {selectedExercise.compositor && (
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
                    Compositor: {selectedExercise.compositor}
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedExercise(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Tonalidade</span>
                  <span className="font-extrabold text-slate-800 dark:text-white">{selectedExercise.tonalidade}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Compasso</span>
                  <span className="font-extrabold text-slate-800 dark:text-white">{selectedExercise.compasso}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Andamento</span>
                  <span className="font-extrabold text-slate-800 dark:text-white">{selectedExercise.andamento}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Nível</span>
                  <span className="font-extrabold text-purple-600 dark:text-purple-400">{selectedExercise.nivel}</span>
                </div>
              </div>

              {selectedExercise.griffstellung && (
                <div className="bg-fuchsia-50 dark:bg-fuchsia-950/40 p-3 rounded-xl border border-fuchsia-200 dark:border-fuchsia-800/60 text-fuchsia-900 dark:text-fuchsia-200">
                  <strong>✋ Padrão de Dedilhado:</strong> {selectedExercise.griffstellung}
                </div>
              )}

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs mb-1">Descrição & Aplicação:</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedExercise.descricao}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-xl border border-purple-200/50 dark:border-purple-800/40">
                  <span className="font-bold text-purple-900 dark:text-purple-200 block mb-1">🎯 Técnica Principal:</span>
                  <p className="text-purple-800 dark:text-purple-300">{selectedExercise.tecnicaPrincipal}</p>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200/50 dark:border-emerald-800/40">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 block mb-1">🌱 Habilidade Desenvolvida:</span>
                  <p className="text-emerald-800 dark:text-emerald-300">{selectedExercise.habilidadeDesenvolvida}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs mb-1">⚠️ Desafios Técnicos Recorrentes:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedExercise.dificuldades.map((d, i) => (
                    <span key={i} className="bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-slate-600 dark:text-slate-300 text-xs">
                <strong>Sugestão de Continuidade:</strong> {selectedExercise.sugestaoContinuidade}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleCopyLessonText(selectedExercise)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Copiar Roteiro</span>
              </button>

              <button
                onClick={() => {
                  handleAddToCatalog(selectedExercise);
                  setSelectedExercise(null);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar ao Catálogo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
