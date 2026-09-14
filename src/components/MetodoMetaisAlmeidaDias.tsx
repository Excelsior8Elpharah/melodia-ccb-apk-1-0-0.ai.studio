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
  Volume2,
  Table
} from 'lucide-react';
import { 
  FUNDAMENTOS_METAIS_ALMEIDA_DIAS, 
  ESTRUTURA_PEDAGOGICA_METAIS_ALMEIDA_DIAS, 
  TABELA_30_FASES_ALMEIDA_DIAS, 
  EXERCICIOS_METAIS_ALMEIDA_DIAS 
} from '../data/metodoMetaisAlmeidaDias';
import { ExercícioMetaisAlmeidaDias, MaterialCatalogo, SecaoPedagogicaMetaisAlmeidaDias, FaseTabelaAlmeidaDias } from '../types';
import MusicalWatermark from './MusicalWatermark';

interface MetodoMetaisAlmeidaDiasProps {
  onAddCatalogItem?: (item: MaterialCatalogo) => void;
  toast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function MetodoMetaisAlmeidaDias({ onAddCatalogItem, toast }: MetodoMetaisAlmeidaDiasProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModulo, setSelectedModulo] = useState<string>('Todos');
  const [selectedNivel, setSelectedNivel] = useState<string>('Todos');
  const [selectedInstrumento, setSelectedInstrumento] = useState<string>('Todos');
  const [selectedExercise, setSelectedExercise] = useState<ExercícioMetaisAlmeidaDias | null>(null);
  const [activeTab, setActiveTab] = useState<'exercicios' | 'fases' | 'modulos' | 'fundamentos' | 'gerador'>('exercicios');
  const [filterFase, setFilterFase] = useState<number | null>(null);

  // Generator state
  const [genInstrumento, setGenInstrumento] = useState<'Tuba' | 'Eufônio / Bombardino' | 'Trombone'>('Trombone');
  const [genNivel, setGenNivel] = useState<'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado'>('Básico');
  const [genFoco, setGenFoco] = useState<string>('Flexibilidade Labial (Lip Slurs) & Coluna de Ar');
  const [genMinutos, setGenMinutos] = useState<number>(45);

  // Filter exercises
  const filteredExercises = EXERCICIOS_METAIS_ALMEIDA_DIAS.filter(ex => {
    if (selectedModulo !== 'Todos' && ex.modulo !== selectedModulo) return false;
    if (selectedNivel !== 'Todos' && ex.nivel !== selectedNivel) return false;
    if (selectedInstrumento !== 'Todos' && ex.instrumentoAplicavel !== selectedInstrumento && !ex.instrumentoAplicavel.includes('Comum')) return false;
    if (filterFase !== null && ex.fase !== filterFase) return false;

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
  const handleAddToCatalog = (ex: ExercícioMetaisAlmeidaDias) => {
    if (!onAddCatalogItem) return;
    const newItem: MaterialCatalogo = {
      id: 'almeida-metais-' + ex.numero + '-' + Date.now().toString(36),
      nome: `Método Prático Almeida Dias (Tubas, Eufônios e Trombones) Ex. ${ex.numero} – ${ex.titulo}`,
      instrumento: ex.instrumentoAplicavel.includes('Trombone') ? 'Trombone' : ex.instrumentoAplicavel.includes('Tuba') ? 'Tuba' : ex.instrumentoAplicavel.includes('Eufônio') ? 'Eufônio' : 'Metais Graves (Tuba/Eufônio/Trombone)',
      fase: ex.faseOrquestra,
      tipo: ex.modulo.includes('Estudos Melódicos') || ex.compositor ? 'Repertório' : 'Técnica',
      metodo: 'Almeida Dias (Metais Graves)',
      descricao: `Página ${ex.pagina} (Fase ${ex.fase}, ${ex.compasso}, ${ex.tonalidade}). ${ex.tecnicaPrincipal}. ${ex.descricao}`
    };
    onAddCatalogItem(newItem);
    toast(`✅ Ex. ${ex.numero} (${ex.titulo}) adicionado ao Catálogo de Materiais!`, 'success');
  };

  // Copy lesson text
  const handleCopyLessonText = (ex: ExercícioMetaisAlmeidaDias) => {
    const text = `🎺 MÉTODO PRÁTICO ALMEIDA DIAS (Tubas, Eufônios e Trombones)\n` +
      `📌 ${ex.modulo} - Ex. ${ex.numero} (Pág. ${ex.pagina} | Fase ${ex.fase})\n` +
      `🎯 Título: ${ex.titulo} ${ex.compositor ? `(${ex.compositor})` : ''}\n` +
      `🎶 Métrica & Tom: ${ex.compasso} em ${ex.tonalidade} (${ex.andamento})\n` +
      `💡 Aplicação: ${ex.instrumentoAplicavel}\n` +
      `⚙️ Técnica Principal: ${ex.tecnicaPrincipal}\n` +
      `⚠️ Desafios Técnicos: ${ex.dificuldades.join(', ')}\n` +
      `📝 Instruções do Autor: ${ex.descricao}`;
    
    navigator.clipboard.writeText(text);
    toast(`📋 Roteiro do Ex. ${ex.numero} copiado com sucesso!`, 'info');
  };

  return (
    <div className="space-y-6 relative" id="metodo-metais-almeida-container">
      <MusicalWatermark type="fa" position="center-right" opacityClass="opacity-[0.035] dark:opacity-[0.05]" />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-yellow-950 text-white p-6 rounded-2xl shadow-md border border-amber-800/50 relative overflow-hidden">
        <MusicalWatermark type="fa" position="bottom-right" opacityClass="opacity-[0.12] text-amber-200" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5" /> Método Oficial de Metais Graves
              </span>
              <span className="bg-yellow-400/20 text-yellow-200 text-xs font-bold px-2.5 py-0.5 rounded-full border border-yellow-300/30">
                Ronaldo Dias de Almeida (3ª Edição)
              </span>
              <span className="bg-orange-500/20 text-orange-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-orange-400/30">
                Tubas, Eufônios & Trombones
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-amber-100 flex items-center gap-2">
              <span>🎺</span> Método Prático Almeida Dias – Metais Graves
            </h1>
            <p className="text-amber-200/80 text-sm max-w-2xl">
              Plano de ensino unificado para Tuba, Sousafone, Eufônio (Bombardino), Barítono e Trombone (instrumentos em Dó, Si♭ e Mi♭). Matriz pedagógica horizontal simultânea em 6 módulos e 30 fases progressivas.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-amber-950/60 p-3 rounded-xl border border-amber-700/40 shrink-0">
            <div className="text-center px-3 border-r border-amber-800">
              <span className="block text-2xl font-black text-amber-300">6</span>
              <span className="text-[10px] uppercase tracking-wider text-amber-200 font-bold">Módulos</span>
            </div>
            <div className="text-center px-3 border-r border-amber-800">
              <span className="block text-2xl font-black text-amber-300">30</span>
              <span className="text-[10px] uppercase tracking-wider text-amber-200 font-bold">Fases</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-2xl font-black text-amber-300">64</span>
              <span className="text-[10px] uppercase tracking-wider text-amber-200 font-bold">Páginas</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-amber-800/60">
          <button
            onClick={() => setActiveTab('exercicios')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'exercicios' 
                ? 'bg-amber-400 text-slate-950 shadow-sm' 
                : 'bg-amber-950/50 text-amber-200 hover:bg-amber-900/60'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Exercícios Indexados</span>
          </button>

          <button
            onClick={() => setActiveTab('fases')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'fases' 
                ? 'bg-amber-400 text-slate-950 shadow-sm' 
                : 'bg-amber-950/50 text-amber-200 hover:bg-amber-900/60'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Tabela das 30 Fases Simultâneas</span>
          </button>

          <button
            onClick={() => setActiveTab('modulos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'modulos' 
                ? 'bg-amber-400 text-slate-950 shadow-sm' 
                : 'bg-amber-950/50 text-amber-200 hover:bg-amber-900/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>6 Módulos Pedagógicos</span>
          </button>

          <button
            onClick={() => setActiveTab('fundamentos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'fundamentos' 
                ? 'bg-amber-400 text-slate-950 shadow-sm' 
                : 'bg-amber-950/50 text-amber-200 hover:bg-amber-900/60'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>Fundamentos & Bocais Recomendados</span>
          </button>

          <button
            onClick={() => setActiveTab('gerador')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'gerador' 
                ? 'bg-amber-400 text-slate-950 shadow-sm' 
                : 'bg-amber-950/50 text-amber-200 hover:bg-amber-900/60'
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
                  placeholder="Buscar por número, tom, técnica (ex: 'Lip Slurs', 'Bach 6 1/2 AL', 'Bordogni', 'Síncopa', 'Beethoven')..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-white"
                />
              </div>

              {/* Module Filter */}
              <select
                value={selectedModulo}
                onChange={(e) => setSelectedModulo(e.target.value)}
                className="px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-white font-medium cursor-pointer"
              >
                <option value="Todos">Todos os Módulos do Método</option>
                <option value="Escala Cromática & Harmônicos">1. Escala Cromática e Harmônicos</option>
                <option value="Exercícios Rítmicos e das Posições">2. Exercícios Rítmicos e Posições</option>
                <option value="Escalas e Arpejos">3. Escalas e Arpejos</option>
                <option value="Intervalos">4. Intervalos, Síncopas e Contratempos</option>
                <option value="Flexibilidade">5. Flexibilidade (Lip Slurs)</option>
                <option value="Estudos Melódicos e Harmonizados">6. Estudos Melódicos e Harmonizados</option>
              </select>

              {/* Instrument Filter */}
              <select
                value={selectedInstrumento}
                onChange={(e) => setSelectedInstrumento(e.target.value)}
                className="px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-white font-medium cursor-pointer"
              >
                <option value="Todos">Todos os Instrumentos</option>
                <option value="Comum (Tuba, Eufônio, Trombone)">Conteúdo Comum aos Três</option>
                <option value="Tuba">Especificidades Tuba / Souzafone</option>
                <option value="Eufônio / Bombardino">Especificidades Eufônio / Bombardino</option>
                <option value="Trombone">Especificidades Trombone (Vara)</option>
              </select>

              {/* Nivel Filter */}
              <select
                value={selectedNivel}
                onChange={(e) => setSelectedNivel(e.target.value)}
                className="px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-white font-medium cursor-pointer"
              >
                <option value="Todos">Todos os Níveis</option>
                <option value="Iniciante">Iniciante</option>
                <option value="Básico">Básico</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>
                Mostrando <strong>{filteredExercises.length}</strong> exercícios indexados do Método Almeida Dias
                {filterFase !== null && <span className="ml-2 font-bold text-amber-600">(Filtrado pela Fase {filterFase})</span>}
              </span>
              {(selectedModulo !== 'Todos' || selectedNivel !== 'Todos' || selectedInstrumento !== 'Todos' || filterFase !== null || searchTerm !== '') && (
                <button
                  onClick={() => {
                    setSelectedModulo('Todos');
                    setSelectedNivel('Todos');
                    setSelectedInstrumento('Todos');
                    setFilterFase(null);
                    setSearchTerm('');
                  }}
                  className="text-amber-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
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
                key={`${ex.modulo}-${ex.numero}-${ex.pagina}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 p-5 rounded-2xl shadow-sm transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                        Pág. {ex.pagina} • Fase {ex.fase} • {ex.modulo}
                      </span>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight mt-0.5">
                        Ex. {ex.numero} – {ex.titulo}
                      </h3>
                      {ex.compositor && (
                        <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 block">
                          Compositor: {ex.compositor}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800">
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
                      <span className="text-[10px] text-slate-400 block font-semibold">Aplicação Instrumento</span>
                      <span className="font-bold text-amber-700 dark:text-amber-300 truncate block">{ex.instrumentoAplicavel}</span>
                    </div>
                  </div>

                  {/* Concepts badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
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
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
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
                      className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer shadow-sm transition-all"
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

      {/* TAB 2: TABELA DAS 30 FASES SIMULTÂNEAS */}
      {activeTab === 'fases' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">
                  Página 08 do Método Oficial
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Table className="w-5 h-5 text-amber-500" />
                  <span>Matriz de Acompanhamento: 30 Fases Simultâneas</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  O autor estabelece que o aluno estude <strong>todos os 6 módulos simultaneamente</strong> em cada linha horizontal da tabela. Ao completar a linha, o professor assinala a conclusão da fase.
                </p>
              </div>

              {filterFase !== null && (
                <button
                  onClick={() => setFilterFase(null)}
                  className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-xl text-xs font-bold hover:bg-amber-200 cursor-pointer"
                >
                  Ver Todas as Fases
                </button>
              )}
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-amber-950 text-amber-100 font-bold border-b border-amber-800">
                    <th className="p-3 rounded-tl-xl text-center">Fase</th>
                    <th className="p-3">Módulo 1: Cromática</th>
                    <th className="p-3">Módulo 2: Rítmo e Posições</th>
                    <th className="p-3">Módulo 3: Escalas e Arpejos</th>
                    <th className="p-3">Módulo 4: Intervalos</th>
                    <th className="p-3">Módulo 6: Estudos Melódicos</th>
                    <th className="p-3 text-center">Nível</th>
                    <th className="p-3 text-center rounded-tr-xl">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {TABELA_30_FASES_ALMEIDA_DIAS.map((fase) => (
                    <tr 
                      key={fase.fase}
                      className={`hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all ${
                        filterFase === fase.fase ? 'bg-amber-100/70 dark:bg-amber-950/40 font-bold' : ''
                      }`}
                    >
                      <td className="p-3 text-center font-black text-amber-700 dark:text-amber-400 text-sm">
                        {fase.fase}
                      </td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{fase.cromatid}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{fase.mecanismo}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{fase.escalasArpejos}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{fase.intervalos}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{fase.estudosMelodicos}</td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          fase.nivelEstimado === 'Iniciante' ? 'bg-emerald-100 text-emerald-800' :
                          fase.nivelEstimado === 'Básico' ? 'bg-blue-100 text-blue-800' :
                          fase.nivelEstimado === 'Intermediário' ? 'bg-amber-100 text-amber-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {fase.nivelEstimado}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            setFilterFase(fase.fase);
                            setActiveTab('exercicios');
                            toast(`🔍 Filtrando exercícios da Fase ${fase.fase}`, 'info');
                          }}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          Ver Exercícios
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 6 MÓDULOS PEDAGÓGICOS */}
      {activeTab === 'modulos' && (
        <div className="space-y-6">
          {ESTRUTURA_PEDAGOGICA_METAIS_ALMEIDA_DIAS.map((mod) => (
            <div 
              key={mod.moduloNumero}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">
                    {mod.paginas}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {mod.titulo}
                  </h3>
                </div>

                <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                  Módulo {mod.moduloNumero} de 6
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {mod.descricao}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-amber-500" /> Objetivos de Aprendizagem:
                  </span>
                  <ul className="space-y-1">
                    {mod.objetivos.map((obj, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-amber-500" /> Fundamentos Técnicos Trabalhados:
                  </span>
                  <ul className="space-y-1">
                    {mod.fundamentosTecnicos.map((ft, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{ft}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50/60 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
                  <strong>💡 Regras do Autor (Ronaldo Dias de Almeida):</strong>
                  <ul className="mt-1 space-y-0.5">
                    {mod.orientacoesAutor.map((ori, i) => (
                      <li key={i}>• {ori}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50/60 dark:bg-rose-950/30 p-3 rounded-xl border border-rose-200/60 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200">
                  <strong>⚠️ Dificuldades Técnicas Recorrentes:</strong>
                  <ul className="mt-1 space-y-0.5">
                    {mod.dificuldadesRecorrentes.map((dif, i) => (
                      <li key={i}>• {dif}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: FUNDAMENTOS & BOCAIS RECOMENDADOS */}
      {activeTab === 'fundamentos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FUNDAMENTOS_METAIS_ALMEIDA_DIAS.map((f, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                      <Wind className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">
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
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 mt-4">
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
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Gerador Automatizado de Roteiro de Aula para Metais Graves</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Configure os parâmetros do aluno de Tuba, Eufônio ou Trombone para obter instantaneamente um plano de estudos estruturado baseado no Método Prático Almeida Dias.
              </p>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Instrumento do Aluno:
                </label>
                <select
                  value={genInstrumento}
                  onChange={(e) => setGenInstrumento(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-white font-medium cursor-pointer"
                >
                  <option value="Trombone">Trombone de Vara / Pistos</option>
                  <option value="Eufônio / Bombardino">Eufônio / Bombardino (3 ou 4 Pistos)</option>
                  <option value="Tuba">Tuba / Souzafone (Mib, Sib, Dó)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nível Atual do Aluno:
                </label>
                <select
                  value={genNivel}
                  onChange={(e) => setGenNivel(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-white font-medium cursor-pointer"
                >
                  <option value="Iniciante">Iniciante (Fases 1-4 | Emissão & 7 Posições)</option>
                  <option value="Básico">Básico (Fases 5-11 | Escalas com Bemóis & Síncopas)</option>
                  <option value="Intermediário">Intermediário (Fases 12-20 | Sextas/Sétimas & Duetos)</option>
                  <option value="Avançado">Avançado (Fases 21-30 | Oitavas, Bel Canto & Trios)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Foco Técnico da Sessão:
                </label>
                <select
                  value={genFoco}
                  onChange={(e) => setGenFoco(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-white font-medium cursor-pointer"
                >
                  <option value="Flexibilidade Labial (Lip Slurs) & Coluna de Ar">Flexibilidade Labial (Lip Slurs) & Coluna de Ar</option>
                  <option value="Notas Longas & Fole Diafragmático">Notas Longas & Fole Diafragmático</option>
                  <option value="Articulação Staccato e Velocidade de Língua">Articulação Staccato e Velocidade de Língua</option>
                  <option value="Escalas Tonais & Arpejos com Bemóis/Sustenidos">Escalas Tonais & Arpejos</option>
                  <option value="Intervalos com Síncopas estilo 'Sino'">Intervalos com Síncopas estilo 'Sino'</option>
                  <option value="Fraseado Melódico, Bel Canto e Expressão">Fraseado Melódico, Bel Canto e Expressão</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tempo Disponível (Minutos):
                </label>
                <select
                  value={genMinutos}
                  onChange={(e) => setGenMinutos(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-white font-medium cursor-pointer"
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
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                    Roteiro Gerado pelo Método Almeida Dias
                  </span>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                    Plano de Aula de {genInstrumento}: {genNivel} • {genMinutos} Minutos
                  </h3>
                </div>

                <button
                  onClick={() => {
                    const text = `🎺 ROTEIRO DE AULA DE METAIS GRAVES (Método Prático Almeida Dias)\n` +
                      `🎓 Instrumento: ${genInstrumento} | Nível: ${genNivel} | Duração: ${genMinutos} min\n` +
                      `🎯 Foco da Aula: ${genFoco}\n` +
                      `─────────────────────────────────────────\n` +
                      `1️⃣ Aquecimento (10 min): Notas Longas (Ex. 1 Pág. 14) sustentadas por 8 tempos com foco no fole diafragmático e esvaziamento muscular de baixo para cima.\n` +
                      `2️⃣ Estudo Técnico de Foco (15 min): Prática de ${genFoco} (Módulos 1, 2 e 5) com atenção à embocadura sem pressão do bocal.\n` +
                      `3️⃣ Escalas e Intervalos (10 min): Roteiro de Escala e Arpejo com síncopa estilo 'Sino' (Módulos 3 e 4).\n` +
                      `4️⃣ Prática de Conjunto/Repertório (10 min): Estudo Melódico ou Dueto/Trio harmonizado (Voxman, Bizet, Beethoven, Bordogni ou Blazhevich).\n` +
                      `─────────────────────────────────────────\n` +
                      `💡 Orientação do Autor: "A tensão necessária para a vibração deve vir dos músculos faciais, NUNCA da pressão do bocal contra os lábios."`;
                    navigator.clipboard.writeText(text);
                    toast('📋 Roteiro de Aula de Metais Graves copiado com sucesso!', 'success');
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copiar Roteiro de Aula</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-amber-600 block mb-1">ETAPA 1 (10 MIN)</span>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-xs mb-1">Notas Longas & Diafragma</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Ex. 1 (Pág. 14) nas 7 posições com apoio abdominal sem inflar as bochechas.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-amber-600 block mb-1">ETAPA 2 (15 MIN)</span>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-xs mb-1">Técnica Específica</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Foco em: {genFoco}. Exercícios correspondentes dos Módulos 1, 2 ou 5.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-amber-600 block mb-1">ETAPA 3 (10 MIN)</span>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-xs mb-1">Escala & Síncopas</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Escala tonal e arpejos do Módulo 3 + Síncopas estilo 'sino' do Módulo 4.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-amber-600 block mb-1">ETAPA 4 (10 MIN)</span>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-xs mb-1">Prática de Dueto/Trio</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Estudo harmonizado do Módulo 6 (Bianchini, Beethoven, Tchaikovsky, Bordogni ou Blazhevich).
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
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Pág. {selectedExercise.pagina} • Fase {selectedExercise.fase} • {selectedExercise.modulo}
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  Ex. {selectedExercise.numero} – {selectedExercise.titulo}
                </h2>
                {selectedExercise.compositor && (
                  <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 block">
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
                  <span className="text-[10px] text-slate-400 block font-semibold">Aplicação</span>
                  <span className="font-extrabold text-amber-600 dark:text-amber-400 truncate block">{selectedExercise.instrumentoAplicavel}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Instruções do Autor (Almeida Dias):</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200/50 dark:border-amber-900/40">
                  {selectedExercise.descricao}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Técnica Principal:</span>
                  <p className="text-slate-600 dark:text-slate-300">{selectedExercise.tecnicaPrincipal}</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Habilidade Desenvolvida:</span>
                  <p className="text-slate-600 dark:text-slate-300">{selectedExercise.habilidadeDesenvolvida}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Desafios Técnicos Recorrentes:</span>
                <ul className="space-y-1">
                  {selectedExercise.dificuldades.map((dif, idx) => (
                    <li key={idx} className="text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{dif}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">
                  Tempo estimado de estudo: <strong>{selectedExercise.tempoEstimadoMinutos} min</strong>
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleAddToCatalog(selectedExercise);
                      setSelectedExercise(null);
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar ao Catálogo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
