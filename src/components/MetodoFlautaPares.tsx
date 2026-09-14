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
  Volume2
} from 'lucide-react';
import { 
  FUNDAMENTOS_FLAUTA_PARES, 
  ESTRUTURA_PEDAGOGICA_FLAUTA_PARES, 
  EXERCICIOS_FLAUTA_PARES,
  FundamentoFlautaPares
} from '../data/metodoFlautaPares';
import { ExercícioFlautaPares, MaterialCatalogo, SecaoPedagogicaFlautaPares } from '../types';

interface MetodoFlautaParesProps {
  onAddCatalogItem?: (item: MaterialCatalogo) => void;
  toast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function MetodoFlautaPares({ onAddCatalogItem, toast }: MetodoFlautaParesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSecao, setSelectedSecao] = useState<string>('Todas');
  const [selectedNivel, setSelectedNivel] = useState<string>('Todos');
  const [selectedExercise, setSelectedExercise] = useState<ExercícioFlautaPares | null>(null);
  const [activeTab, setActiveTab] = useState<'exercicios' | 'capitulos' | 'fundamentos' | 'gerador' | 'operas'>('exercicios');

  // Generator state
  const [genNivel, setGenNivel] = useState<'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado'>('Básico');
  const [genFoco, setGenFoco] = useState<string>('Embocadura & Emissão de Som de Sino');
  const [genMinutos, setGenMinutos] = useState<number>(45);

  // Filter exercises
  const filteredExercises = EXERCICIOS_FLAUTA_PARES.filter(ex => {
    if (selectedSecao !== 'Todas' && ex.secao !== selectedSecao) return false;
    if (selectedNivel !== 'Todos' && ex.nivel !== selectedNivel) return false;

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

  // Operatic pieces only
  const operaExercises = EXERCICIOS_FLAUTA_PARES.filter(ex => ex.secao === 'Estudos de Óperas Célebres');

  // Add to catalog handler
  const handleAddToCatalog = (ex: ExercícioFlautaPares) => {
    if (!onAddCatalogItem) return;
    const newItem: MaterialCatalogo = {
      id: 'flauta-pares-' + ex.numero + '-' + Date.now().toString(36),
      nome: `Flauta Transversal (G. Parès) Ex. ${ex.numero} – ${ex.titulo}`,
      instrumento: 'Flauta Transversal',
      fase: ex.faseOrquestra,
      tipo: ex.secao === 'Estudos de Óperas Célebres' ? 'Repertório' : 'Técnica',
      metodo: 'G. Parès (Flauta)',
      descricao: `Página ${ex.pagina} (PDF ${ex.paginaPdf}, ${ex.compasso}, ${ex.tonalidade}). ${ex.tecnicaPrincipal}. ${ex.descricao}`
    };
    onAddCatalogItem(newItem);
    toast(`✅ Flauta Parès Ex. ${ex.numero} adicionado ao Catálogo de Materiais!`, 'success');
  };

  // Copy lesson plan
  const handleCopyLessonText = (ex: ExercícioFlautaPares) => {
    const text = `📖 MÉTODO ELEMENTAL PARA FLAUTA (Gabriel Parès)\n` +
      `📌 ${ex.secao} - Ex. ${ex.numero} (Pág. ${ex.pagina} / PDF ${ex.paginaPdf})\n` +
      `🎯 Título: ${ex.titulo} ${ex.compositor ? `(${ex.compositor})` : ''}\n` +
      `🎶 Métrica & Tom: ${ex.compasso} em ${ex.tonalidade} (${ex.andamento})\n` +
      `💡 Técnica Principal: ${ex.tecnicaPrincipal}\n` +
      `⚠️ Desafios Técnicos: ${ex.dificuldades.join(', ')}\n` +
      `📝 Recomendações de Parès: ${ex.descricao}`;
    
    navigator.clipboard.writeText(text);
    toast(`📋 Roteiro do Ex. ${ex.numero} copiado para a área de transferência!`, 'info');
  };

  // Copy chapter plan
  const handleCopyChapterPlan = (cap: SecaoPedagogicaFlautaPares) => {
    const text = `🎯 PLANO DE ESTUDO - CAPÍTULO ${cap.capituloNumero} (Método Parès de Flauta)\n` +
      `📌 Título: ${cap.titulo} (${cap.paginas})\n` +
      `─────────────────────────────────────────\n` +
      `🎯 Objetivos:\n${cap.objetivos.map(o => ` • ${o}`).join('\n')}\n\n` +
      `⚙️ Fundamentos Técnicos:\n${cap.fundamentosTecnicos.map(f => ` • ${f}`).join('\n')}\n\n` +
      `💡 Orientações do Autor:\n${cap.orientacoesAutor.map(a => ` • ${a}`).join('\n')}`;
    
    navigator.clipboard.writeText(text);
    toast(`📋 Plano do Capítulo ${cap.capituloNumero} copiado com sucesso!`, 'success');
  };

  return (
    <div className="space-y-6" id="metodo-flauta-pares-container">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-cyan-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-cyan-800/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-cyan-500/20 text-cyan-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-cyan-400/30 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5" /> Método Oficial Indexado
              </span>
              <span className="bg-teal-400/20 text-teal-200 text-xs font-bold px-2.5 py-0.5 rounded-full border border-teal-300/30">
                Gabriel Parès (Ricordi)
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                Sistema Boehm
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-cyan-100 flex items-center gap-2">
              <span>🎶</span> Método Elemental para Flauta – G. Parès
            </h1>
            <p className="text-cyan-200/80 text-sm max-w-2xl">
              Base didática completa para Flauta Transversal: da formação de embocadura, sílaba "tu" e notas longas até os Sons Filados (pp &lt; ff &gt; pp), articulação "du" e solos de Óperas Célebres.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-cyan-950/60 p-3 rounded-xl border border-cyan-700/40 shrink-0">
            <div className="text-center px-3 border-r border-cyan-800">
              <span className="block text-2xl font-black text-cyan-400">6</span>
              <span className="text-[10px] uppercase tracking-wider text-cyan-300 font-bold">Capítulos</span>
            </div>
            <div className="text-center px-3 border-r border-cyan-800">
              <span className="block text-2xl font-black text-cyan-400">76</span>
              <span className="text-[10px] uppercase tracking-wider text-cyan-300 font-bold">Estudos</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-2xl font-black text-cyan-400">3 Oct</span>
              <span className="text-[10px] uppercase tracking-wider text-cyan-300 font-bold">Tessitura</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-cyan-800/60">
          <button
            onClick={() => setActiveTab('exercicios')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'exercicios' 
                ? 'bg-cyan-400 text-slate-950 shadow-sm' 
                : 'bg-cyan-950/50 text-cyan-200 hover:bg-cyan-900/60'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Exercícios Indexados</span>
          </button>

          <button
            onClick={() => setActiveTab('capitulos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'capitulos' 
                ? 'bg-cyan-400 text-slate-950 shadow-sm' 
                : 'bg-cyan-950/50 text-cyan-200 hover:bg-cyan-900/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>6 Capítulos Pedagógicos</span>
          </button>

          <button
            onClick={() => setActiveTab('fundamentos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'fundamentos' 
                ? 'bg-cyan-400 text-slate-950 shadow-sm' 
                : 'bg-cyan-950/50 text-cyan-200 hover:bg-cyan-900/60'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>Fundamentos Técnicos da Flauta</span>
          </button>

          <button
            onClick={() => setActiveTab('operas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'operas' 
                ? 'bg-cyan-400 text-slate-950 shadow-sm' 
                : 'bg-cyan-950/50 text-cyan-200 hover:bg-cyan-900/60'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Óperas Célebres (Solos)</span>
          </button>

          <button
            onClick={() => setActiveTab('gerador')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'gerador' 
                ? 'bg-cyan-400 text-slate-950 shadow-sm' 
                : 'bg-cyan-950/50 text-cyan-200 hover:bg-cyan-900/60'
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
                  placeholder="Buscar por número, tom, técnica (ex: 'som de sino', 'sílaba tu', 'sons filados', 'staccato', 'Gounod')..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:text-white"
                />
              </div>

              {/* Section Filter */}
              <select
                value={selectedSecao}
                onChange={(e) => setSelectedSecao(e.target.value)}
                className="px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:text-white font-medium cursor-pointer"
              >
                <option value="Todas">Todas as Seções do Método</option>
                <option value="Fundamentos e Notas Longas">Fundamentos e Notas Longas</option>
                <option value="Exercícios Preliminares & Cromáticos">Preliminares & Cromáticos</option>
                <option value="Registro Agudo e Métrica">Registro Agudo & Métrica (6/8)</option>
                <option value="Síncopas & Escalas Diatônicas">Síncopas, Escalas & Staccato</option>
                <option value="Ligados & Regulates">Segunda Parte: Del Ligado & Reguladores</option>
                <option value="Articulações & Golpes de Língua">Articulações (Picado-Ligado "du")</option>
                <option value="Sons Filados & Arpejos">Sons Filados (pp &lt; ff &gt; pp) & Arpejos</option>
                <option value="Adornos & Contratempos">Contratempos & Notas de Adorno</option>
                <option value="Estudos de Óperas Célebres">Estudos de Óperas Célebres</option>
              </select>

              {/* Nivel Filter */}
              <select
                value={selectedNivel}
                onChange={(e) => setSelectedNivel(e.target.value)}
                className="px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:text-white font-medium cursor-pointer"
              >
                <option value="Todos">Todos os Níveis</option>
                <option value="Iniciante">Iniciante</option>
                <option value="Básico">Básico</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>Mostrando <strong>{filteredExercises.length}</strong> exercícios do Método Parès de Flauta</span>
              {(selectedSecao !== 'Todas' || selectedNivel !== 'Todos' || searchTerm !== '') && (
                <button
                  onClick={() => {
                    setSelectedSecao('Todas');
                    setSelectedNivel('Todos');
                    setSearchTerm('');
                  }}
                  className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold cursor-pointer"
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
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 p-5 rounded-2xl shadow-sm transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block">
                        Pág. {ex.pagina} (PDF {ex.paginaPdf}) • {ex.secao}
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
                      <span className="bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 text-xs font-bold px-2 py-0.5 rounded-lg border border-cyan-200 dark:border-cyan-800">
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
                      <span className="font-bold text-cyan-700 dark:text-cyan-300 truncate block">{ex.tecnicaPrincipal}</span>
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
                    className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
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
                      className="px-2.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer shadow-sm transition-all"
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

      {/* TAB 2: CAPÍTULOS PEDAGÓGICOS */}
      {activeTab === 'capitulos' && (
        <div className="space-y-6">
          <div className="space-y-6">
            {ESTRUTURA_PEDAGOGICA_FLAUTA_PARES.map((cap) => (
              <div 
                key={cap.capituloNumero}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 block">
                      {cap.paginas}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {cap.titulo}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyChapterPlan(cap)}
                      className="px-3 py-1.5 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-700 dark:text-cyan-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all border border-cyan-300/40"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Plano do Capítulo</span>
                    </button>
                    <span className="bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 text-xs font-bold px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-800">
                      Capítulo {cap.capituloNumero} de 6
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {cap.descricao}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-cyan-500" /> Objetivos de Aprendizagem:
                    </span>
                    <ul className="space-y-1">
                      {cap.objetivos.map((obj, i) => (
                        <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                          <span className="text-cyan-500 font-bold">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-cyan-500" /> Fundamentos Técnicos Trabalhados:
                    </span>
                    <ul className="space-y-1">
                      {cap.fundamentosTecnicos.map((ft, i) => (
                        <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                          <span className="text-cyan-500 font-bold">•</span>
                          <span>{ft}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-cyan-50/60 dark:bg-cyan-950/30 p-3 rounded-xl border border-cyan-200/60 dark:border-cyan-900/40 text-xs text-cyan-900 dark:text-cyan-200">
                    <strong>💡 Regras do Autor (Gabriel Parès):</strong>
                    <ul className="mt-1 space-y-0.5">
                      {cap.orientacoesAutor.map((ori, i) => (
                        <li key={i}>• {ori}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-rose-50/60 dark:bg-rose-950/30 p-3 rounded-xl border border-rose-200/60 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200">
                    <strong>⚠️ Dificuldades Técnicas Recorrentes:</strong>
                    <ul className="mt-1 space-y-0.5">
                      {cap.dificuldadesRecorrentes.map((dif, i) => (
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

      {/* TAB 3: FUNDAMENTOS TÉCNICOS */}
      {activeTab === 'fundamentos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FUNDAMENTOS_FLAUTA_PARES.map((f, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-cyan-500/10 text-cyan-600 rounded-xl">
                      <Wind className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 block">
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
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-cyan-50 dark:bg-cyan-950/40 p-3 rounded-xl border border-cyan-200 dark:border-cyan-800/60 text-xs text-cyan-900 dark:text-cyan-200 mt-4">
                  <strong>💡 Orientação para o Professor:</strong> {f.orientacaoProfessor}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ÓPERAS CÉLEBRES (SOLOS) */}
      {activeTab === 'operas' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-[10px] uppercase font-black text-amber-600 dark:text-amber-400 block">
                Galeria Solo de Virtuosidade Lyrical
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                <Music className="w-5 h-5 text-amber-500" />
                <span>Estudos Sacados de Óperas Célebres (Gabriel Parès)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Trechos de gala e solos operísticos transcritos pelo autor para desenvolvimento do bel canto, cantabile e sensibilidade artística em concertos e provas orquestrais.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {operaExercises.map((op) => (
                <div 
                  key={op.numero}
                  className="bg-gradient-to-br from-amber-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 block">
                          Pág. {op.pagina} (PDF {op.paginaPdf}) • {op.compositor}
                        </span>
                        <h3 className="font-black text-slate-900 dark:text-white text-base">
                          {op.titulo}
                        </h3>
                      </div>
                      <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-black px-2.5 py-0.5 rounded-lg border border-amber-300">
                        {op.andamento}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {op.descricao}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Tonalidade & Métrica</span>
                        <span className="font-extrabold text-slate-800 dark:text-white">{op.tonalidade} ({op.compasso})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Desafio Lírico</span>
                        <span className="font-extrabold text-amber-700 dark:text-amber-300 truncate block">{op.tecnicaPrincipal}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-amber-200/60 dark:border-slate-800">
                    <button
                      onClick={() => setSelectedExercise(op)}
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver Ficha Completa</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleAddToCatalog(op)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar ao Catálogo</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GERADOR DE PLANO DE AULA */}
      {activeTab === 'gerador' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-500" />
                <span>Gerador Automatizado de Roteiro de Aula para Flauta</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Configure os parâmetros do aluno de flauta para obter instantaneamente um plano de estudos estruturado baseado no Método Gabriel Parès.
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
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:text-white font-medium cursor-pointer"
                >
                  <option value="Iniciante">Iniciante (Notas Longas & Sílaba tu)</option>
                  <option value="Básico">Básico (Cromatismos & 6/8)</option>
                  <option value="Intermediário">Intermediário (Síncopas, Staccato & Del Ligado)</option>
                  <option value="Avançado">Avançado (Sons Filados pp-ff-pp & Óperas)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Dificuldade / Foco Técnico da Aula:
                </label>
                <select
                  value={genFoco}
                  onChange={(e) => setGenFoco(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:text-white font-medium cursor-pointer"
                >
                  <option value="Embocadura & Emissão de Som de Sino">Embocadura & Som de Sino (Pág. 13)</option>
                  <option value="Acesso ao Registro Agudo (Dó5 ao Fá5)">Acesso ao Registro Agudo (Pág. 17)</option>
                  <option value="Articulação Picado-Ligado ('du')">Articulação Picado-Ligado com 'du' (Pág. 36)</option>
                  <option value="Síncopas com Deslocamento Natural">Síncopas com Acento Natural (Pág. 21)</option>
                  <option value="Sons Filados (pp < ff > pp)">Sons Filados pp &lt; ff &gt; pp (Pág. 38)</option>
                  <option value="Interpretação de Solo Operístico">Interpretação Lírica de Óperas (Págs. 46-48)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tempo Disponível de Estudo (Minutos):
                </label>
                <select
                  value={genMinutos}
                  onChange={(e) => setGenMinutos(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:text-white font-medium cursor-pointer"
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
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block">
                    Roteiro Gerado pelo Método Gabriel Parès
                  </span>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                    Plano de Aula de Flauta: {genNivel} • {genMinutos} Minutos
                  </h3>
                </div>

                <button
                  onClick={() => {
                    const text = `🎶 ROTEIRO DE AULA DE FLAUTA TRANSVERSAL (Método Gabriel Parès)\n` +
                      `🎓 Nível: ${genNivel} | Duração: ${genMinutos} min\n` +
                      `🎯 Foco da Aula: ${genFoco}\n` +
                      `─────────────────────────────────────────\n` +
                      `1️⃣ Aquecimento (10 min): Exercícios 1-3 (Pág. 13) - Som de sino com ataque em "tu" e apoio abdominal.\n` +
                      `2️⃣ Estudo Técnico de Foco (15 min): ${genFoco} (Exercícios da Seção Correspondente Parès).\n` +
                      `3️⃣ Escalas e Articulações (10 min): Escalas em colcheias (Págs. 23-27) com variação "tu" e "du".\n` +
                      `4️⃣ Aplicação Melódica/Lírica (10 min): Trecho de Ópera Célebre ou Estudo em 6/8.\n` +
                      `─────────────────────────────────────────\n` +
                      `💡 Recomendação do Autor: "Nunca passar de um exercício a outro sem saber perfeitamente o anterior."`;
                    navigator.clipboard.writeText(text);
                    toast('📋 Roteiro de Aula de Flauta copiado com sucesso!', 'success');
                  }}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copiar Roteiro de Aula</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-cyan-600 block mb-1">ETAPA 1 (10 MIN)</span>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-xs mb-1">Emissão & Som de Sino</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Exercícios 1, 2 e 3 (Pág. 13). Ataque firme em "tu" com diminuição em campana e apoio diafragmático.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-cyan-600 block mb-1">ETAPA 2 (15 MIN)</span>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-xs mb-1">Mecanismo de Foco</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Foco em: {genFoco}. Prática dirigida utilizando os exercícios das seções de Parès.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-cyan-600 block mb-1">ETAPA 3 (10 MIN)</span>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-xs mb-1">Escalas & Reguladores</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Escalas em colcheias (Págs. 23-27) com crescendo ao subir e diminuendo ao descender.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-cyan-600 block mb-1">ETAPA 4 (10 MIN)</span>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-xs mb-1">Aplicação Lyrical</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Estudo melódico em 6/8 ou trecho de Ópera Célebre (Gounod, Adam, Halévy ou Weber).
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
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block">
                  Pág. {selectedExercise.pagina} (PDF {selectedExercise.paginaPdf}) • {selectedExercise.secao}
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
                  <span className="font-extrabold text-cyan-600 dark:text-cyan-400">{selectedExercise.nivel}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs mb-1">Descrição & Aplicação:</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedExercise.descricao}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-cyan-50 dark:bg-cyan-950/30 p-3 rounded-xl border border-cyan-200/50 dark:border-cyan-800/40">
                  <span className="font-bold text-cyan-900 dark:text-cyan-200 block mb-1">🎯 Técnica Principal:</span>
                  <p className="text-cyan-800 dark:text-cyan-300">{selectedExercise.tecnicaPrincipal}</p>
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
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
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
