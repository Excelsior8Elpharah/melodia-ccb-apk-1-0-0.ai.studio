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
  Info
} from 'lucide-react';
import { 
  FUNDAMENTOS_SAXOFONE_ALMEIDA_DIAS, 
  ESTRUTURA_PEDAGOGICA_SAXOFONE, 
  TABELA_FASES_ALMEIDA_DIAS, 
  EXERCICIOS_SAXOFONE 
} from '../data/metodoSaxofone';
import { ExercícioSaxofone, MaterialCatalogo, FaseTabelaAlmeidaDias } from '../types';
import MusicalWatermark from './MusicalWatermark';

interface MetodoSaxofoneProps {
  onAddCatalogItem?: (item: MaterialCatalogo) => void;
  toast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function MetodoSaxofone({ onAddCatalogItem, toast }: MetodoSaxofoneProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModulo, setSelectedModulo] = useState<string>('Todos');
  const [selectedNivel, setSelectedNivel] = useState<string>('Todos');
  const [selectedFase, setSelectedFase] = useState<number>(0); // 0 = Todas
  const [selectedExercise, setSelectedExercise] = useState<ExercícioSaxofone | null>(null);
  const [activeTab, setActiveTab] = useState<'exercicios' | 'fases' | 'fundamentos' | 'gerador' | 'modulos'>('exercicios');

  // Generator State
  const [genNivel, setGenNivel] = useState<'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado'>('Básico');
  const [genFoco, setGenFoco] = useState<string>('Embocadura & Emissão');
  const [genInstrumento, setGenInstrumento] = useState<string>('Sax Alto (Mib)');

  // Selected Phase details for Tabela Fases
  const [activePhaseDetail, setActivePhaseDetail] = useState<FaseTabelaAlmeidaDias | null>(TABELA_FASES_ALMEIDA_DIAS[0]);

  // Filter exercises
  const filteredExercises = EXERCICIOS_SAXOFONE.filter(ex => {
    if (selectedModulo !== 'Todos' && ex.modulo !== selectedModulo) return false;
    if (selectedNivel !== 'Todos' && ex.nivel !== selectedNivel) return false;
    if (selectedFase !== 0 && ex.fase !== selectedFase) return false;

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
      return matchNum || matchTitle || matchTon || matchComp || matchDesc || matchConc || matchDif || matchTec;
    }

    return true;
  });

  // Handle adding exercise to catalog
  const handleAddToCatalog = (ex: ExercícioSaxofone) => {
    if (!onAddCatalogItem) return;
    const newItem: MaterialCatalogo = {
      id: 'sax-' + ex.modulo.toLowerCase().replace(/\s+/g, '') + '-' + ex.numero + '-' + Date.now().toString(36),
      nome: `Saxofone (${ex.modulo}) Ex. ${ex.numero} – ${ex.titulo}`,
      instrumento: 'Saxofone',
      fase: ex.faseOrquestra,
      tipo: ex.modulo === 'Estudos Melódicos e Harmonizados' ? 'Repertório' : (ex.modulo === 'Escala Cromática' ? 'Teoria' : 'Técnica'),
      metodo: 'Almeida Dias (Saxofone)',
      descricao: `Página ${ex.pagina} (Fase ${ex.fase}, ${ex.compasso}, ${ex.tonalidade}). ${ex.tecnicaPrincipal}. ${ex.descricao}`
    };
    onAddCatalogItem(newItem);
    toast(`✅ Saxofone Ex. ${ex.numero} adicionado ao Catálogo de Materiais!`, 'success');
  };

  // Copy details for lesson plan
  const handleCopyLessonText = (ex: ExercícioSaxofone) => {
    const text = `📖 MÉTODO PRÁTICO PARA SAXOFONES (Almeida Dias)\n` +
      `📌 ${ex.modulo} - Ex. ${ex.numero} (Pág. ${ex.pagina})\n` +
      `🎯 Título: ${ex.titulo} | Fase ${ex.fase}\n` +
      `🎷 Métrica & Tom: ${ex.compasso} em ${ex.tonalidade} (${ex.andamento})\n` +
      `💡 Técnica Principal: ${ex.tecnicaPrincipal}\n` +
      `⚠️ Desafios Técnicos: ${ex.dificuldades.join(', ')}\n` +
      `📝 Recomendações: ${ex.descricao}`;
    
    navigator.clipboard.writeText(text);
    toast(`📋 Roteiro do Ex. ${ex.numero} copiado para a área de transferência!`, 'info');
  };

  // Copy Phase Study Plan
  const handleCopyPhasePlan = (fase: FaseTabelaAlmeidaDias) => {
    const text = `🎯 PLANO DE ESTUDO SIMULTÂNEO - FASE ${fase.fase} (Método de Saxofone Almeida Dias)\n` +
      `🎓 Nível Estimado: ${fase.nivelEstimado} | Fase Orquestra ${fase.faseOrquestra}\n` +
      `─────────────────────────────────────────\n` +
      `1️⃣ Módulo 1 (Cromática): ${fase.cromatid}\n` +
      `2️⃣ Módulo 2 (Mecanismo): ${fase.mecanismo}\n` +
      `3️⃣ Módulo 3 (Escalas e Arpejos): ${fase.escalasArpejos}\n` +
      `4️⃣ Módulo 4 (Intervalos e Síncopas): ${fase.intervalos}\n` +
      `5️⃣ Módulo 5 (Estudos Melódicos/Conjunto): ${fase.estudosMelodicos}\n` +
      `─────────────────────────────────────────\n` +
      `💡 Dica do Método: Praticar os 5 módulos simultaneamente na mesma sessão de estudo!`;
    
    navigator.clipboard.writeText(text);
    toast(`📋 Plano da Fase ${fase.fase} copiado com sucesso!`, 'success');
  };

  return (
    <div className="space-y-6 relative" id="metodo-saxofone-container">
      <MusicalWatermark instrumento="Saxofone" position="center-right" opacityClass="opacity-[0.035] dark:opacity-[0.05]" />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-amber-800/50 relative overflow-hidden">
        <MusicalWatermark instrumento="Saxofone" position="bottom-right" opacityClass="opacity-[0.12] text-amber-200" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                <Music className="w-3.5 h-3.5" /> Base de Conhecimento Indexada
              </span>
              <span className="bg-amber-400/20 text-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300/30">
                João Dias de Almeida
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                Tabela das 30 Fases Simultâneas
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-amber-100 flex items-center gap-2">
              <span>🎷</span> Método Prático para Saxofones
            </h1>
            <p className="text-amber-200/80 text-sm max-w-2xl">
              Soprano (Sib), Alto (Mib), Tenor (Sib) e Barítono (Mib). Indexação completa dos 5 Módulos pedagógicos, fundamentos de embocadura, boquilhas e quartetos em conjunto.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-amber-950/60 p-3 rounded-xl border border-amber-700/40 shrink-0">
            <div className="text-center px-3 border-r border-amber-800">
              <span className="block text-2xl font-black text-amber-400">5</span>
              <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">Módulos</span>
            </div>
            <div className="text-center px-3 border-r border-amber-800">
              <span className="block text-2xl font-black text-amber-400">30</span>
              <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">Fases Sync</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-2xl font-black text-amber-400">62</span>
              <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">Páginas</span>
            </div>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-amber-800/60">
          <button
            onClick={() => setActiveTab('exercicios')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'exercicios' 
                ? 'bg-amber-500 text-slate-950 shadow-sm' 
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
                ? 'bg-amber-500 text-slate-950 shadow-sm' 
                : 'bg-amber-950/50 text-amber-200 hover:bg-amber-900/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tabela de 30 Fases</span>
          </button>

          <button
            onClick={() => setActiveTab('fundamentos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'fundamentos' 
                ? 'bg-amber-500 text-slate-950 shadow-sm' 
                : 'bg-amber-950/50 text-amber-200 hover:bg-amber-900/60'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>Fundamentos & Saxofone</span>
          </button>

          <button
            onClick={() => setActiveTab('gerador')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'gerador' 
                ? 'bg-amber-500 text-slate-950 shadow-sm' 
                : 'bg-amber-950/50 text-amber-200 hover:bg-amber-900/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Gerador de Plano de Aula</span>
          </button>

          <button
            onClick={() => setActiveTab('modulos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'modulos' 
                ? 'bg-amber-500 text-slate-950 shadow-sm' 
                : 'bg-amber-950/50 text-amber-200 hover:bg-amber-900/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Visão dos 5 Módulos</span>
          </button>
        </div>
      </div>

      {/* TAB 1: EXERCÍCIOS INDEXADOS */}
      {activeTab === 'exercicios' && (
        <div className="space-y-6">
          {/* Filter Toolbar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por número, tom, técnica (ex: 'chave de oitava', 'síncopa', 'Beethoven', 'Dó Maior')..."
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
                <option value="Todos">Todos os Módulos (1 a 5)</option>
                <option value="Escala Cromática">Módulo 1: Escala Cromática</option>
                <option value="Exercícios Progressivos e de Mecanismo">Módulo 2: Mecanismo & Notas Longas</option>
                <option value="Escalas e Arpejos">Módulo 3: Escalas e Arpejos</option>
                <option value="Intervalos">Módulo 4: Intervalos & Síncopas</option>
                <option value="Estudos Melódicos e Harmonizados">Módulo 5: Melódicos & Quartetos</option>
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

              {/* Fase Filter */}
              <select
                value={selectedFase}
                onChange={(e) => setSelectedFase(Number(e.target.value))}
                className="px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-white font-medium cursor-pointer"
              >
                <option value={0}>Todas as 30 Fases</option>
                {Array.from({ length: 30 }, (_, i) => i + 1).map((f) => (
                  <option key={f} value={f}>Fase {f}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>Mostrando <strong>{filteredExercises.length}</strong> exercícios encontrados</span>
              {(selectedModulo !== 'Todos' || selectedNivel !== 'Todos' || selectedFase !== 0 || searchTerm !== '') && (
                <button
                  onClick={() => {
                    setSelectedModulo('Todos');
                    setSelectedNivel('Todos');
                    setSelectedFase(0);
                    setSearchTerm('');
                  }}
                  className="text-amber-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>

          {/* Exercise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExercises.map((ex) => (
              <div 
                key={`${ex.modulo}-${ex.numero}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 p-5 rounded-2xl shadow-sm transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                        {ex.modulo} • Pág. {ex.pagina}
                      </span>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight mt-0.5">
                        Ex. {ex.numero} – {ex.titulo}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800">
                        Fase {ex.fase}
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
                      <span className="text-[10px] text-slate-400 block font-semibold">Técnica Chave</span>
                      <span className="font-bold text-amber-700 dark:text-amber-300 truncate block">{ex.tecnicaPrincipal}</span>
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

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 gap-2">
                  <button
                    onClick={() => setSelectedExercise(ex)}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver Detalhes</span>
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
                      <span>Adicionar ao Catálogo</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TABELA DAS 30 FASES */}
      {activeTab === 'fases' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-500" />
                  <span>Tabela das 30 Fases Simultâneas (Almeida Dias)</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Matriz pedagógica original do método. Permite ao aluno estudar os 5 módulos simultaneamente a cada fase horizontal da tabela.
                </p>
              </div>

              {activePhaseDetail && (
                <button
                  onClick={() => handleCopyPhasePlan(activePhaseDetail)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition-all shrink-0"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copiar Plano da Fase {activePhaseDetail.fase}</span>
                </button>
              )}
            </div>

            {/* Selected Phase Detail Card */}
            {activePhaseDetail && (
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 rounded-xl border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-lg">
                      FASE SELECIONADA: {activePhaseDetail.fase}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Nível: {activePhaseDetail.nivelEstimado} • Fase Orquestra {activePhaseDetail.faseOrquestra}
                    </span>
                  </div>
                  <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
                    💡 Clique em qualquer linha da tabela abaixo para ver a fase
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">Módulo 1: Cromática</span>
                    <span className="font-extrabold text-slate-800 dark:text-white text-xs">{activePhaseDetail.cromatid}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">Módulo 2: Mecanismo</span>
                    <span className="font-extrabold text-slate-800 dark:text-white text-xs">{activePhaseDetail.mecanismo}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">Módulo 3: Escalas/Arpejos</span>
                    <span className="font-extrabold text-slate-800 dark:text-white text-xs">{activePhaseDetail.escalasArpejos}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">Módulo 4: Intervalos</span>
                    <span className="font-extrabold text-slate-800 dark:text-white text-xs">{activePhaseDetail.intervalos}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">Módulo 5: Melódicos</span>
                    <span className="font-extrabold text-slate-800 dark:text-white text-xs">{activePhaseDetail.estudosMelodicos}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-amber-950 text-amber-200 border-b border-amber-900">
                    <th className="p-3 font-extrabold text-center w-16">Fase</th>
                    <th className="p-3 font-extrabold">Mod. 1: Escala Cromática</th>
                    <th className="p-3 font-extrabold">Mod. 2: Mecanismo</th>
                    <th className="p-3 font-extrabold">Mod. 3: Escalas e Arpejos</th>
                    <th className="p-3 font-extrabold">Mod. 4: Intervalos</th>
                    <th className="p-3 font-extrabold">Mod. 5: Estudos Melódicos</th>
                    <th className="p-3 font-extrabold text-center">Nível</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {TABELA_FASES_ALMEIDA_DIAS.map((fase) => {
                    const isSelected = activePhaseDetail?.fase === fase.fase;
                    return (
                      <tr
                        key={fase.fase}
                        onClick={() => setActivePhaseDetail(fase)}
                        className={`cursor-pointer transition-colors hover:bg-amber-50/70 dark:hover:bg-amber-950/30 ${
                          isSelected ? 'bg-amber-100/80 dark:bg-amber-950/60 font-semibold' : ''
                        }`}
                      >
                        <td className="p-3 text-center font-black text-amber-700 dark:text-amber-400">
                          {fase.fase}
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{fase.cromatid}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{fase.mecanismo}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{fase.escalasArpejos}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{fase.intervalos}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{fase.estudosMelodicos}</td>
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FUNDAMENTOS TÉCNICOS & SAXOFONE */}
      {activeTab === 'fundamentos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FUNDAMENTOS_SAXOFONE_ALMEIDA_DIAS.map((f, index) => (
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

      {/* TAB 4: GERADOR DE PLANO DE AULA */}
      {activeTab === 'gerador' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Gerador de Plano de Aula & Recomendador Automatizado</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Selecione o nível e o foco técnico do aluno para montar instantaneamente um roteiro de aula baseado no Método Almeida Dias.
              </p>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Instrumento do Aluno:
                </label>
                <select
                  value={genInstrumento}
                  onChange={(e) => setGenInstrumento(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-white font-medium cursor-pointer"
                >
                  <option value="Sax Alto (Mib)">Sax Alto (Mib)</option>
                  <option value="Sax Tenor (Sib)">Sax Tenor (Sib)</option>
                  <option value="Sax Soprano (Sib)">Sax Soprano (Sib)</option>
                  <option value="Sax Barítono (Mib)">Sax Barítono (Mib)</option>
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
                  <option value="Iniciante">Iniciante (Fases 1 a 4)</option>
                  <option value="Básico">Básico (Fases 5 a 10)</option>
                  <option value="Intermediário">Intermediário (Fases 11 a 20)</option>
                  <option value="Avançado">Avançado (Fases 21 a 30)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Foco Técnico / Dificuldade Recorrente:
                </label>
                <select
                  value={genFoco}
                  onChange={(e) => setGenFoco(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-white font-medium cursor-pointer"
                >
                  <option value="Embocadura & Emissão">Embocadura & Emissão de Notas Longas</option>
                  <option value="Sons Agudos & Chave de Oitava">Sons Agudos & Chave de Oitava (nº 11)</option>
                  <option value="Escala Cromática & Bis">Escala Cromática & Agilidade de Chaves</option>
                  <option value="Saltos de Intervalos & Diafragma">Saltos de Intervalos & Diafragma</option>
                  <option value="Síncopas & Contratempos">Síncopas, Contratempos & Toque de Sino</option>
                  <option value="Prática de Conjunto & Clave de Fá">Prática de Quarteto & Leitura de Clave de Fá</option>
                </select>
              </div>
            </div>

            {/* Generated Output Preview Card */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                    Plano Personalizado Gerado
                  </span>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                    Roteiro de Aula: {genInstrumento} • Nível {genNivel}
                  </h3>
                </div>

                <button
                  onClick={() => {
                    const text = `🎷 ROTEIRO DE AULA RECOMENDADO (${genInstrumento} - Nível ${genNivel})\n` +
                      `🎯 Foco da Sessão: ${genFoco}\n` +
                      `─────────────────────────────────────────\n` +
                      `1. Aquecimento (10 min): Notas longas no Módulo 2 (Pág. 10) com diafragma como fole.\n` +
                      `2. Exercício Técnico (15 min): Módulo 1 (Escala Cromática, Pág. 8 Ex. ${genNivel === 'Iniciante' ? 1 : genNivel === 'Básico' ? 2 : 3}).\n` +
                      `3. Estudo Tonal (15 min): Módulo 3 (Escalas e Arpejos, Pág. 18-21).\n` +
                      `4. Aplicação Musical (20 min): Módulo 5 (Estudo Melódico / Conjunto).\n` +
                      `─────────────────────────────────────────\n` +
                      `💡 Recomendação Almeida Dias: Sempre verificar se o aluno está rascando ou mordendo a boquilha!`;
                    navigator.clipboard.writeText(text);
                    toast('📋 Plano de Aula copiado com sucesso!', 'success');
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
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-xs mb-1">Aquecimento & Som</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Notas longas no Módulo 2 (Pág. 10 Ex. 1). Treinar o sopro em retorno constante com apoio de diafragma.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-amber-600 block mb-1">ETAPA 2 (15 MIN)</span>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-xs mb-1">Mecanismo & Foco</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Foco em {genFoco}. Utilizar os exercícios do Módulo 1 (Cromática) ou Módulo 4 (Intervalos com síncopas).
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-amber-600 block mb-1">ETAPA 3 (15 MIN)</span>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-xs mb-1">Escalas & Arpejos</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Módulo 3: Praticar a escala diatônica do nível (Dó Maior, Fá Maior ou Mib Maior) com articulação "símile".
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-amber-600 block mb-1">ETAPA 4 (20 MIN)</span>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-xs mb-1">Estudo Melódico / Naipe</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Módulo 5: Executar um estudo melódico ou duo/quarteto (Lully, Beethoven ou Mozart) aplicando nuances dinâmicas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: VISÃO DOS 5 MÓDULOS */}
      {activeTab === 'modulos' && (
        <div className="space-y-6">
          <div className="space-y-6">
            {ESTRUTURA_PEDAGOGICA_SAXOFONE.map((m) => (
              <div 
                key={m.moduloNumero}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">
                      {m.paginas}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {m.titulo}
                    </h3>
                  </div>

                  <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                    Módulo {m.moduloNumero} de 5
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {m.descricao}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-amber-500" /> Objectives de Aprendizagem:
                    </span>
                    <ul className="space-y-1">
                      {m.objetivos.map((obj, i) => (
                        <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-amber-500" /> Fundamentos Técnicos Principais:
                    </span>
                    <ul className="space-y-1">
                      {m.fundamentosTecnicos.map((ft, i) => (
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
                    <strong>💡 Orientações do Autor (Almeida Dias):</strong>
                    <ul className="mt-1 space-y-0.5">
                      {m.orientacoesAutor.map((ori, i) => (
                        <li key={i}>• {ori}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-rose-50/60 dark:bg-rose-950/30 p-3 rounded-xl border border-rose-200/60 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200">
                    <strong>⚠️ Dificuldades Técnicas Recorrentes:</strong>
                    <ul className="mt-1 space-y-0.5">
                      {m.dificuldadesRecorrentes.map((dif, i) => (
                        <li key={i}>• {dif}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
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
                  {selectedExercise.modulo} • Pág. {selectedExercise.pagina} (Fase {selectedExercise.fase})
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  Ex. {selectedExercise.numero} – {selectedExercise.titulo}
                </h2>
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
                  <span className="font-extrabold text-amber-600 dark:text-amber-400">{selectedExercise.nivel}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs mb-1">Descrição & Aplicação:</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedExercise.descricao}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/50 dark:border-amber-800/40">
                  <span className="font-bold text-amber-900 dark:text-amber-200 block mb-1">🎯 Técnica Principal:</span>
                  <p className="text-amber-800 dark:text-amber-300">{selectedExercise.tecnicaPrincipal}</p>
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
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Texto</span>
              </button>

              <button
                onClick={() => {
                  handleAddToCatalog(selectedExercise);
                  setSelectedExercise(null);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar ao Catálogo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
