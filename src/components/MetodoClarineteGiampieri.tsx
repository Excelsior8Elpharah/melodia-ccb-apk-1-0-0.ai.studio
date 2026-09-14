import React, { useState, useMemo } from 'react';
import {
  Wind,
  Music,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Search,
  Plus,
  Filter,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Award,
  Sliders,
  HelpCircle,
  FileText,
  Bookmark,
  Share2
} from 'lucide-react';
import {
  FUNDAMENTOS_CLARINETE_GIAMPIERI,
  SECOES_PEDAGOGICAS_CLARINETE_GIAMPIERI,
  EXERCICIOS_CLARINETE_GIAMPIERI,
  ORNAMENTOS_CLARINETE_GIAMPIERI,
  TRANSPORTE_CLARINETE_GIAMPIERI
} from '../data/metodoClarineteGiampieri';
import {
  ExercicioClarineteGiampieri,
  SecaoPedagogicaClarineteGiampieri,
  FundamentoClarineteGiampieri,
  OrnamentoClarineteGiampieri,
  TransporteClarineteGiampieri
} from '../types';

interface Props {
  onAddCatalogItem?: (item: any) => void;
  toast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function MetodoClarineteGiampieri({ onAddCatalogItem, toast }: Props) {
  const [activeTab, setActiveTab] = useState<'fundamentos' | 'modulos' | 'exercicios' | 'ornamentos' | 'transporte' | 'plano'>('fundamentos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModulo, setSelectedModulo] = useState<string>('Todos');
  const [selectedNivel, setSelectedNivel] = useState<string>('Todos');
  const [selectedExercicio, setSelectedExercicio] = useState<ExercicioClarineteGiampieri | null>(null);
  
  // States for Lesson Plan Generator
  const [alunoNivel, setAlunoNivel] = useState<'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado'>('Básico');
  const [tempoMinutos, setTempoMinutos] = useState<number>(45);
  const [focoAulas, setFocoAulas] = useState<string>('Técnica de Mecanismo e Som');
  const [planGenerated, setPlanGenerated] = useState<boolean>(false);

  // Accordion toggle states
  const [openModuloIdx, setOpenModuloIdx] = useState<number | null>(0);

  // Filtered exercises
  const filteredExercicios = useMemo(() => {
    return EXERCICIOS_CLARINETE_GIAMPIERI.filter(ex => {
      const matchSearch = ex.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.conceitos.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
        ex.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.tecnicaPrincipal.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchModulo = selectedModulo === 'Todos' || ex.modulo === selectedModulo;
      const matchNivel = selectedNivel === 'Todos' || ex.nivel === selectedNivel;

      return matchSearch && matchModulo && matchNivel;
    });
  }, [searchTerm, selectedModulo, selectedNivel]);

  // Handle adding exercise to orchestra catalog
  const handleAddToCatalog = (ex: ExercicioClarineteGiampieri) => {
    if (onAddCatalogItem) {
      onAddCatalogItem({
        nome: `GIAMPIERI CLARINETE: ${ex.titulo}`,
        instrumento: 'Clarinete',
        fase: ex.faseOrquestra,
        tipo: ex.modulo.includes('Studi Progressivi') ? 'Repertório' : 'Técnica',
        metodo: 'Giampieri (Clarinete)',
        descricao: `${ex.descricao} (Pág. ${ex.pagina})`
      });
      if (toast) {
        toast(`Exercício Pág. ${ex.pagina} cadastrado no Catálogo da Orquestra!`, 'success');
      }
    }
  };

  // Lesson plan generator logic
  const generatedPlan = useMemo(() => {
    const list = EXERCICIOS_CLARINETE_GIAMPIERI.filter(ex => ex.nivel === alunoNivel);
    const selected = list.slice(0, 4);
    
    return {
      nivel: alunoNivel,
      tempoTotal: tempoMinutos,
      foco: focoAulas,
      aquecimento: '10 min – Sustained Tones (Pág. 23) + Exercício Diário da Passagem Lá-Si (Pág. 5)',
      mecanismo: selected[0] ? `${selected[0].titulo} (Pág. ${selected[0].pagina})` : 'Pág. 14 Ex. 1 – Semicolcheias de Mecanismo',
      estudoFlexibilidade: selected[1] ? `${selected[1].titulo} (Pág. ${selected[1].pagina})` : 'Pág. 6 Ex. 1 – Saltos de Terça e Quinta',
      repertorio: selected[2] ? `${selected[2].titulo} (Pág. ${selected[2].pagina})` : 'Pág. 45 Studio Progressivo Nº 1',
      orientacaoFinal: 'Exigir postura ereta, ângulo de 45°, cantos da boca firmes para a frente e apoio abdominal na vírgula de fiato.'
    };
  }, [alunoNivel, tempoMinutos, focoAulas]);

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-950 p-6 md:p-8 text-white shadow-xl border border-emerald-700/40">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold tracking-wider uppercase backdrop-blur-md border border-emerald-400/30">
              <Wind className="w-3.5 h-3.5 text-emerald-300" />
              <span>Base de Conhecimento Oficial da Orquestra</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white font-serif">
              Método Progressivo de Clarinete
            </h1>
            <p className="text-sm md:text-base text-emerald-100/90 font-light leading-relaxed">
              Alamiro Giampieri (Parte I – Ed. Ricordi) – Sistema Böhm. Guia completo indexado de fundamentos, mecânica de furos e chaves, 11 módulos pedagógicos, 32 estudos progressivos, tratado de ornamentos e transporte orquestral.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <div className="bg-emerald-950/60 backdrop-blur-md p-3.5 rounded-xl border border-emerald-500/30 text-center">
              <span className="text-xs text-emerald-300 font-medium block">Extensão Geral</span>
              <span className="text-lg font-bold text-white">Mi2 a Si6 (3 Oitavas)</span>
            </div>
            <div className="bg-emerald-950/60 backdrop-blur-md p-3.5 rounded-xl border border-emerald-500/30 text-center">
              <span className="text-xs text-emerald-300 font-medium block">Páginas Indexadas</span>
              <span className="text-lg font-bold text-white">96 Páginas</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="mt-8 flex flex-wrap gap-2 border-t border-emerald-700/50 pt-4">
          <button
            onClick={() => setActiveTab('fundamentos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
              activeTab === 'fundamentos'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/50 font-semibold'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Fundamentos do Clarinete</span>
          </button>

          <button
            onClick={() => setActiveTab('modulos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
              activeTab === 'modulos'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/50 font-semibold'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>11 Módulos Pedagógicos</span>
          </button>

          <button
            onClick={() => setActiveTab('exercicios')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
              activeTab === 'exercicios'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/50 font-semibold'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-800/50'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Catálogo de Exercícios</span>
          </button>

          <button
            onClick={() => setActiveTab('ornamentos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
              activeTab === 'ornamentos'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/50 font-semibold'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Abbellimenti (Ornamentos)</span>
          </button>

          <button
            onClick={() => setActiveTab('transporte')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
              activeTab === 'transporte'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/50 font-semibold'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-800/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Sistema de Transporte</span>
          </button>

          <button
            onClick={() => setActiveTab('plano')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
              activeTab === 'plano'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/50 font-semibold'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-800/50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Plano de Aula Inteligente</span>
          </button>
        </div>
      </div>

      {/* TAB 1: FUNDAMENTOS */}
      {activeTab === 'fundamentos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Fundamentos Básicos e Mecânica do Clarinete Böhm</span>
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {FUNDAMENTOS_CLARINETE_GIAMPIERI.length} Tópicos Estruturais
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FUNDAMENTOS_CLARINETE_GIAMPIERI.map((fund, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                      {fund.categoria}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {fund.subtitulo}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {fund.conteudo}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 block">
                      Pontos de Atenção Técnica:
                    </span>
                    <ul className="space-y-1">
                      {fund.pontosChave.map((pt, pIdx) => (
                        <li key={pIdx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Orientação ao Professor:
                  </span>
                  <p className="text-xs text-emerald-900/80 dark:text-emerald-200/80 italic">
                    "{fund.orientacaoProfessor}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MÓDULOS PEDAGÓGICOS */}
      {activeTab === 'modulos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>Estrutura Pedagógica em 11 Módulos (Págs. 2 a 96)</span>
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Seqüência Rigorosa do Autor
            </span>
          </div>

          <div className="space-y-4">
            {SECOES_PEDAGOGICAS_CLARINETE_GIAMPIERI.map((sec, idx) => {
              const isOpen = openModuloIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setOpenModuloIdx(isOpen ? null : idx)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0">
                        {sec.moduloNumero}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-gray-900 dark:text-white">
                            {sec.titulo}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-mono">
                            {sec.paginas}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                          {sec.descricao}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hidden sm:inline">
                        {isOpen ? 'Ocultar Detalhes' : 'Ver Módulo'}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 space-y-5">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {sec.descricao}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                          <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            Objetivos do Módulo
                          </h4>
                          <ul className="space-y-1">
                            {sec.objetivos.map((obj, oIdx) => (
                              <li key={oIdx} className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-1.5">
                                <span className="text-emerald-500 font-bold">•</span>
                                <span>{obj}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                          <h4 className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                            Dificuldades Recorrentes
                          </h4>
                          <ul className="space-y-1">
                            {sec.dificuldadesRecorrentes.map((dif, dIdx) => (
                              <li key={dIdx} className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-1.5">
                                <span className="text-amber-500 font-bold">•</span>
                                <span>{dif}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {sec.orientacoesAutor && sec.orientacoesAutor.length > 0 && (
                        <div className="bg-emerald-900/10 dark:bg-emerald-950/40 border border-emerald-300/40 dark:border-emerald-700/40 p-4 rounded-xl">
                          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 block mb-1">
                            Citações & Orientações do Autor (Alamiro Giampieri):
                          </span>
                          {sec.orientacoesAutor.map((ori, oIdx) => (
                            <p key={oIdx} className="text-xs text-emerald-900 dark:text-emerald-300 italic">
                              {ori}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CATÁLOGO DE EXERCÍCIOS */}
      {activeTab === 'exercicios' && (
        <div className="space-y-6">
          {/* SEARCH & FILTERS */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por título, página, conceito (ex: Passagem Lá-Si, Trillo, Staccato)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedModulo}
                    onChange={(e) => setSelectedModulo(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Todos">Todos os Módulos</option>
                    {SECOES_PEDAGOGICAS_CLARINETE_GIAMPIERI.map((s) => (
                      <option key={s.moduloNumero} value={s.titulo}>
                        {s.moduloNumero}. {s.titulo}
                      </option>
                    ))}
                  </select>
                </div>

                <select
                  value={selectedNivel}
                  onChange={(e) => setSelectedNivel(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Todos">Todos os Níveis</option>
                  <option value="Iniciante">Iniciante</option>
                  <option value="Básico">Básico</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
              <span>Exibindo {filteredExercicios.length} exercícios cadastrados</span>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedModulo('Todos');
                    setSelectedNivel('Todos');
                  }}
                  className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>

          {/* EXERCISES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercicios.map((ex) => (
              <div
                key={ex.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                      Pág. {ex.pagina}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ex.nivel === 'Iniciante'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                          : ex.nivel === 'Básico'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                          : ex.nivel === 'Intermediário'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
                      }`}
                    >
                      {ex.nivel}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                      {ex.titulo}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {ex.descricao}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{ex.tempoEstimadoMinutos} min sugeridos</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <Music className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Tonalidade: {ex.tonalidade} ({ex.compasso})</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {ex.conceitos.map((c, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[10px]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedExercicio(ex)}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Ficha Completa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleAddToCatalog(ex)}
                    className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800/60 transition-colors"
                    title="Adicionar ao Catálogo da Orquestra"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ORNAMENTOS (ABBELLIMENTI) */}
      {activeTab === 'ornamentos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>Tratado do Studio degli Abbellimenti (Págs. 66 a 92)</span>
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Ornamentação Erudita Giampieri
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ORNAMENTOS_CLARINETE_GIAMPIERI.map((orn, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold">
                    {orn.tipo}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">Regra Giampieri</span>
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {orn.nome}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {orn.execucao}
                </p>

                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-700/60 space-y-1">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 block">
                    Regra de Subtração de Valor:
                  </span>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-mono">
                    {orn.regraValor}
                  </p>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                  <strong>Exemplo do Método:</strong> {orn.exemplo}
                </div>
              </div>
            ))}
          </div>

          {/* QUADRO DE TRILLOS BANNER */}
          <div className="bg-gradient-to-r from-teal-900 to-emerald-950 p-6 rounded-2xl text-white space-y-3 border border-emerald-700/50">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>Quadro dei Trilli Minori e Maggiori (Págs. 90, 91 e 92)</span>
            </h3>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              O Giampieri traz o diagrama exato de todos os trillos maiores e menores nas 3 oitavas do clarinete. Uma cruz (x) sobre a chave ou orifício do diagrama sinaliza o dedo exato que deve articular a oscilação rápida do trinado.
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: SISTEMA DE TRANSPORTE */}
      {activeTab === 'transporte' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-600" />
              <span>Studio del Trasporto – Transposição Orquestral (Págs. 95 e 96)</span>
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Prática Clássica de Claves
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TRANSPORTE_CLARINETE_GIAMPIERI.map((tr, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                    Partitura: {tr.partituraAlvo}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">Tocando no Si♭</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {tr.claveUtilizada}
                  </h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                    {tr.intervaloTransporte}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-700/60 space-y-1">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                    Ajuste de Armadura de Clave:
                  </span>
                  <p className="text-xs font-mono text-emerald-700 dark:text-emerald-300">
                    {tr.ajusteArmadura}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
                    Regras Práticas de Leitura:
                  </span>
                  <ul className="space-y-1">
                    {tr.regrasPraticas.map((reg, rIdx) => (
                      <li key={rIdx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{reg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PLANO DE AULA INTELIGENTE */}
      {activeTab === 'plano' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Gerador Automático de Plano de Aula & Trilhas Inteligentes</span>
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Algoritmo de Montagem Giampieri
            </span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Nível do Aluno:
                </label>
                <select
                  value={alunoNivel}
                  onChange={(e: any) => setAlunoNivel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white"
                >
                  <option value="Iniciante">Iniciante (Chalumeau & Passagem Lá-Si)</option>
                  <option value="Básico">Básico (Saltos & Mecanismo)</option>
                  <option value="Intermediário">Intermediário (Cromatismo & Tonalidades)</option>
                  <option value="Avançado">Avançado (32 Studi Progressivi & Ornamentos)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Tempo Disponível da Aula:
                </label>
                <select
                  value={tempoMinutos}
                  onChange={(e: any) => setTempoMinutos(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white"
                >
                  <option value={30}>30 Minutos (Prática Direcionada)</option>
                  <option value={45}>45 Minutos (Aula Padrão)</option>
                  <option value={60}>60 Minutos (Treino Intensivo)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Foco Técnico Principal:
                </label>
                <select
                  value={focoAulas}
                  onChange={(e: any) => setFocoAulas(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white"
                >
                  <option value="Técnica de Mecanismo e Som">Técnica de Mecanismo & Som</option>
                  <option value="Fraseado e Expressão Cantabile">Fraseado & Expressão Cantabile</option>
                  <option value="Articulação e Staccato">Articulação & Staccato</option>
                  <option value="Ornamentos e Trillos">Ornamentos & Trillos</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                setPlanGenerated(true);
                if (toast) toast('Plano de aula Giampieri gerado com sucesso!', 'success');
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gerar Trilha Personalizada de Estudo</span>
            </button>
          </div>

          {/* RENDER PLAN RESULT */}
          {planGenerated && (
            <div className="bg-emerald-950 text-white rounded-2xl p-6 space-y-6 border border-emerald-700 shadow-xl">
              <div className="flex items-center justify-between border-b border-emerald-800 pb-4">
                <div>
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">
                    Plano de Aula Recomendado
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Trilha de Estudo – Nível {generatedPlan.nivel} ({generatedPlan.tempoTotal} min)
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold">
                  Giampieri System
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-900/60 p-4 rounded-xl border border-emerald-700/60 space-y-1">
                  <span className="text-xs text-emerald-300 font-bold block">1. Aquecimento & Emissão (10 min)</span>
                  <p className="text-sm text-white font-medium">{generatedPlan.aquecimento}</p>
                </div>

                <div className="bg-emerald-900/60 p-4 rounded-xl border border-emerald-700/60 space-y-1">
                  <span className="text-xs text-emerald-300 font-bold block">2. Exercício de Mecanismo (15 min)</span>
                  <p className="text-sm text-white font-medium">{generatedPlan.mecanismo}</p>
                </div>

                <div className="bg-emerald-900/60 p-4 rounded-xl border border-emerald-700/60 space-y-1">
                  <span className="text-xs text-emerald-300 font-bold block">3. Estudo Intervalar / Tonal (10 min)</span>
                  <p className="text-sm text-white font-medium">{generatedPlan.estudoFlexibilidade}</p>
                </div>

                <div className="bg-emerald-900/60 p-4 rounded-xl border border-emerald-700/60 space-y-1">
                  <span className="text-xs text-emerald-300 font-bold block">4. Estudo Progressivo de Concerto (10 min)</span>
                  <p className="text-sm text-white font-medium">{generatedPlan.repertorio}</p>
                </div>
              </div>

              <div className="bg-emerald-900/40 p-4 rounded-xl border border-emerald-800">
                <span className="text-xs font-bold text-emerald-300 block mb-1">
                  Critério de Conclusão & Recomendação Pedagógica:
                </span>
                <p className="text-xs text-emerald-100/90 leading-relaxed italic">
                  "{generatedPlan.orientacaoFinal}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EXERCISE DETAIL MODAL */}
      {selectedExercicio && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
              <div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                  Giampieri – Pág. {selectedExercicio.pagina}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  {selectedExercicio.titulo}
                </h3>
              </div>

              <button
                onClick={() => setSelectedExercicio(null)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Descrição Pedagógica
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedExercicio.descricao}
                </p>
              </div>

              {selectedExercicio.posicaoMecanicaChaves && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                    Mecanismo de Chaves e Digitação:
                  </span>
                  <p className="text-xs text-emerald-900 dark:text-emerald-200 font-mono">
                    {selectedExercicio.posicaoMecanicaChaves}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl">
                  <span className="text-gray-500 block">Técnica Principal:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{selectedExercicio.tecnicaPrincipal}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl">
                  <span className="text-gray-500 block">Habilidade Desenvolvida:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{selectedExercicio.habilidadeDesenvolvida}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Conceitos Abordados
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedExercicio.conceitos.map((c, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs text-gray-800 dark:text-gray-200">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedExercicio(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  handleAddToCatalog(selectedExercicio);
                  setSelectedExercicio(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar no Catálogo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
