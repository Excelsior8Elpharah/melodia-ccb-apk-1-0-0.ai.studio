import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  PlusCircle, 
  Copy, 
  Check, 
  Sparkles, 
  Music, 
  GraduationCap, 
  Info, 
  ChevronRight, 
  Layers, 
  Target, 
  Compass, 
  BookmarkPlus,
  ShieldCheck,
  Disc,
  Feather,
  ListMusic,
  Volume2,
  Hand,
  Sliders,
  HelpCircle,
  Clock
} from 'lucide-react';
import { 
  ESTRUTURA_PEDAGOGICA_SCHMOLL, 
  EXERCICIOS_SCHMOLL,
  ESCALAS_HINOS_VIOLINO,
  FUNDAMENTOS_VIOLINO_CCB
} from '../data/metodoSchmoll';
import { ExercícioSchmoll, MaterialCatalogo, EscalaHinoViolino, FundamentoViolino } from '../types';

interface MetodoSchmollProps {
  onAddCatalogItem?: (item: any) => void;
  toast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function MetodoSchmoll({ onAddCatalogItem, toast }: MetodoSchmollProps) {
  const [activeTab, setActiveTab] = useState<'exercicios' | 'trilha' | 'escalas' | 'golpes' | 'fundamentos'>('exercicios');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosicao, setSelectedPosicao] = useState<string>('Todas');
  const [selectedNivel, setSelectedNivel] = useState<string>('Todos');
  const [selectedFase, setSelectedFase] = useState<number>(0);
  const [exerciseModal, setExerciseModal] = useState<ExercícioSchmoll | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Escalas & Hinos tab state
  const [hinoSearchTerm, setHinoSearchTerm] = useState('');

  // Available Filter Options
  const posicoes = ['Todas', '1ª Posição', '2ª Posição', '3ª Posição', '4ª Posição', '5ª Posição', '6ª Posição', 'União de Posições', 'Anatomia / Postura'];
  const niveis = ['Todos', 'Iniciante', 'Básico', 'Intermediário', 'Avançado'];

  // Filter Logic
  const filteredExercicios = useMemo(() => {
    return EXERCICIOS_SCHMOLL.filter(ex => {
      const matchSearch = searchTerm === '' || 
        ex.numero.toString() === searchTerm.trim() ||
        ex.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.secao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.tonalidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ex.compositor && ex.compositor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        ex.conceitos.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchPosicao = selectedPosicao === 'Todas' || ex.posicao === selectedPosicao;
      const matchNivel = selectedNivel === 'Todos' || ex.nivel === selectedNivel;
      const matchFase = selectedFase === 0 || ex.faseOrquestra === selectedFase;

      return matchSearch && matchPosicao && matchNivel && matchFase;
    });
  }, [searchTerm, selectedPosicao, selectedNivel, selectedFase]);

  // Filter Logic for Escalas & Hinos
  const filteredEscalasHinos = useMemo(() => {
    if (!hinoSearchTerm.trim()) return ESCALAS_HINOS_VIOLINO;
    const term = hinoSearchTerm.toLowerCase().trim();
    return ESCALAS_HINOS_VIOLINO.filter(item => 
      item.tonalidade.toLowerCase().includes(term) ||
      item.armadura.toLowerCase().includes(term) ||
      item.hinosAssociados.some(hino => hino.includes(term))
    );
  }, [hinoSearchTerm]);

  const handleCopyPlan = (ex: ExercícioSchmoll) => {
    const text = `=== PLANO DE AULA VIOLINO (MÉTODO CCB / A. SCHMOLL) ===
Lição Nº: ${ex.numero} (Página ${ex.pagina})
Título: ${ex.titulo}
Posição: ${ex.posicao} | Tonalidade: ${ex.tonalidade} | Compasso: ${ex.compasso}
Nível: ${ex.nivel} (Orquestra Fase ${ex.faseOrquestra})
Técnica de Arco: ${ex.tecnicaArco || 'Padrão'}
Conceitos: ${ex.conceitos.join(', ')}
Dificuldades Pedagógicas: ${ex.dificuldades.join('; ')}
Orientações: ${ex.descricao}
==================================================`;

    navigator.clipboard.writeText(text);
    setCopiedId(ex.numero);
    if (toast) toast(`Plano da Lição ${ex.numero} copiado com sucesso!`, 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCadastrarNoCatalogo = (ex: ExercícioSchmoll) => {
    if (!onAddCatalogItem) return;
    const tipoItem = ex.compositor ? 'Repertório' : 'Técnica';
    onAddCatalogItem({
      nome: `SCHMOLL Ex. ${ex.numero} – ${ex.titulo} (Pág. ${ex.pagina})`,
      instrumento: 'Violino',
      fase: ex.faseOrquestra,
      tipo: tipoItem,
      metodo: 'A. Schmoll / CCB Violino',
      descricao: `${ex.posicao} | Tonalidade: ${ex.tonalidade} | ${ex.descricao}`
    });
    if (toast) toast(`Lição ${ex.numero} cadastrada no Catálogo da Orquestra.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-200 via-amber-400 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-semibold mb-3 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Base de Conhecimento Oficial Indexada – Violino CCB</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-50 mb-2">
            Método para Violino – A. Schmoll (Padronização CCB)
          </h1>
          <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed">
            Indexação pedagógica integral dos 5 Módulos, Fundamentos da Anatômica do Violino, 10 Estudos de Arco, Posições (1ª a 6ª), Tabela Completa de Escalas & Hinos da CCB e Repertório Orquestral.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-amber-700/50 text-xs">
            <div className="bg-amber-900/40 rounded-lg p-2.5 border border-amber-700/40">
              <span className="text-amber-300 font-medium block">Módulos Ditáticos</span>
              <span className="text-lg font-bold text-white">1º ao 5º Módulo</span>
            </div>
            <div className="bg-amber-900/40 rounded-lg p-2.5 border border-amber-700/40">
              <span className="text-amber-300 font-medium block">Posições Mapeadas</span>
              <span className="text-lg font-bold text-white">1ª a 6ª Posição</span>
            </div>
            <div className="bg-amber-900/40 rounded-lg p-2.5 border border-amber-700/40">
              <span className="text-amber-300 font-medium block">Tabela de Hinos CCB</span>
              <span className="text-lg font-bold text-white">8 Tonalidades</span>
            </div>
            <div className="bg-amber-900/40 rounded-lg p-2.5 border border-amber-700/40">
              <span className="text-amber-300 font-medium block">Lições & Estudos</span>
              <span className="text-lg font-bold text-white">214 Exercícios</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('exercicios')}
          className={`flex items-center gap-2 px-5 py-3 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'exercicios'
              ? 'border-amber-700 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Lições Indexadas ({filteredExercicios.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('trilha')}
          className={`flex items-center gap-2 px-5 py-3 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'trilha'
              ? 'border-amber-700 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Trilha & 5 Módulos</span>
        </button>

        <button
          onClick={() => setActiveTab('escalas')}
          className={`flex items-center gap-2 px-5 py-3 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'escalas'
              ? 'border-amber-700 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <ListMusic className="w-4 h-4" />
          <span>Escalas & Hinos CCB</span>
        </button>

        <button
          onClick={() => setActiveTab('golpes')}
          className={`flex items-center gap-2 px-5 py-3 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'golpes'
              ? 'border-amber-700 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Feather className="w-4 h-4" />
          <span>10 Estudos de Arco</span>
        </button>

        <button
          onClick={() => setActiveTab('fundamentos')}
          className={`flex items-center gap-2 px-5 py-3 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'fundamentos'
              ? 'border-amber-700 text-amber-800 bg-amber-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Disc className="w-4 h-4" />
          <span>Fundamentos & Postura</span>
        </button>
      </div>

      {/* TAB 1: LIÇÕES INDEXADAS */}
      {activeTab === 'exercicios' && (
        <div className="space-y-6">
          {/* SEARCH & FILTERS BAR */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nº da lição (ex: 1, 38, 111, 124), técnica, compositor ou tema..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* Posicao Filter */}
              <select
                value={selectedPosicao}
                onChange={(e) => setSelectedPosicao(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {posicoes.map(p => (
                  <option key={p} value={p}>{p === 'Todas' ? '📍 Todas as Posições' : p}</option>
                ))}
              </select>

              {/* Nivel Filter */}
              <select
                value={selectedNivel}
                onChange={(e) => setSelectedNivel(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {niveis.map(n => (
                  <option key={n} value={n}>{n === 'Todos' ? '📊 Todos os Níveis' : n}</option>
                ))}
              </select>

              {/* Fase Orquestra Filter */}
              <select
                value={selectedFase}
                onChange={(e) => setSelectedFase(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value={0}>🎼 Todas as Fases Orquestra</option>
                <option value={1}>Fase 1 (Iniciação / Cordas Soltas)</option>
                <option value={2}>Fase 2 (1ª Posição / Escalas)</option>
                <option value={3}>Fase 3 (Golpes de Arco / 3ª Pos)</option>
                <option value={4}>Fase 4 (União de Posições / Avançado)</option>
              </select>
            </div>
          </div>

          {/* LIST OF EXERCISES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExercicios.map(ex => (
              <div 
                key={ex.numero}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-md">
                        Lição {ex.numero}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        Pág. {ex.pagina}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200">
                        {ex.posicao}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                      ex.faseOrquestra === 1 ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      ex.faseOrquestra === 2 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      ex.faseOrquestra === 3 ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      Fase {ex.faseOrquestra}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base mb-1">
                    {ex.titulo}
                  </h3>

                  <p className="text-xs text-gray-500 mb-3">
                    <span className="font-semibold text-gray-700">Tonalidade:</span> {ex.tonalidade} | <span className="font-semibold text-gray-700">Compasso:</span> {ex.compasso} | <span className="font-semibold text-gray-700">Andamento:</span> {ex.andamento}
                  </p>

                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                    {ex.descricao}
                  </p>

                  {/* Conceitos Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {ex.conceitos.map((c, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-amber-50 text-amber-900 text-[11px] rounded border border-amber-200/60">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-2">
                  <button
                    onClick={() => setExerciseModal(ex)}
                    className="flex-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-gray-200"
                  >
                    <Info className="w-3.5 h-3.5 text-gray-500" />
                    <span>Detalhes</span>
                  </button>

                  <button
                    onClick={() => handleCopyPlan(ex)}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-amber-200/60"
                    title="Copiar Plano de Aula"
                  >
                    {copiedId === ex.numero ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === ex.numero ? 'Copiado' : 'Plano'}</span>
                  </button>

                  {onAddCatalogItem && (
                    <button
                      onClick={() => handleCadastrarNoCatalogo(ex)}
                      className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      title="Cadastrar no Catálogo da Orquestra"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Catálogo</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredExercicios.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 p-8">
              <Search className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 text-base mb-1">Nenhuma lição encontrada</h3>
              <p className="text-sm text-gray-500">
                Tente ajustar os termos da pesquisa ou selecione outros filtros de posição e nível.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TRILHA PEDAGÓGICA & 5 MÓDULOS */}
      {activeTab === 'trilha' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 text-sm">
            <h3 className="font-bold text-amber-950 text-base mb-1 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-700" />
              Estrutura dos 5 Módulos do Método Padronizado de Violino (CCB)
            </h3>
            <p className="text-amber-800">
              A progressão técnica é rigorosamente estruturada pelo autor. Cada módulo desenvolve competências pré-requisito para as fases orquestrais.
            </p>
          </div>

          <div className="space-y-6">
            {ESTRUTURA_PEDAGOGICA_SCHMOLL.map((modulo, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                      {modulo.paginas} • {modulo.licoes}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-0.5">
                      {modulo.titulo}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-md">
                      {modulo.nivel}
                    </span>
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-md border border-gray-200">
                      Fase Orquestra {modulo.faseOrquestra}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {modulo.descricao}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200/60">
                    <h4 className="font-semibold text-xs text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-amber-700" />
                      Objetivos de Aprendizagem
                    </h4>
                    <ul className="space-y-1.5 text-xs text-gray-600">
                      {modulo.objetivos.map((obj, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200/60">
                    <h4 className="font-semibold text-xs text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-700" />
                      Técnicas-Chave
                    </h4>
                    <ul className="space-y-1.5 text-xs text-gray-600">
                      {modulo.tecnicasChave.map((tec, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{tec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50/60 p-3.5 rounded-lg border border-amber-200/60">
                    <h4 className="font-semibold text-xs text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                      Orientações do Autor
                    </h4>
                    <ul className="space-y-1.5 text-xs text-amber-900/90">
                      {modulo.orientacoesAutor.map((ori, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-700 font-bold">»</span>
                          <span>{ori}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ESCALAS & HINOS CCB (MÓDULO 5) */}
      {activeTab === 'escalas' && (
        <div className="space-y-6">
          <div className="bg-amber-900 text-white rounded-xl p-5 shadow-sm space-y-2">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <ListMusic className="w-5 h-5 text-amber-300" />
              Tabela Oficial de Escalas e Hinos Correlacionados (Módulo 5 – CCB)
            </h3>
            <p className="text-amber-100 text-sm leading-relaxed">
              Associação prática entre as 8 escalas principais do Módulo 5 e a lista exata de hinos do Hinário CCB para estudo orquestral e aplicação imediata nos cultos.
            </p>
          </div>

          {/* Search bar for Hymns */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Digite o número do hino (ex: 437, 31, 06, 471) ou nome da escala (Sol, Ré, Dó)..."
              value={hinoSearchTerm}
              onChange={(e) => setHinoSearchTerm(e.target.value)}
              className="w-full text-sm focus:outline-none"
            />
            {hinoSearchTerm && (
              <button 
                onClick={() => setHinoSearchTerm('')}
                className="text-xs text-gray-400 hover:text-gray-600 bg-gray-100 px-2 py-1 rounded"
              >
                Limpar
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEscalasHinos.map((escala, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <span className="text-xs font-bold text-amber-700">
                      Página {escala.paginaMetodo} do Método
                    </span>
                    <h4 className="text-lg font-bold text-gray-900">
                      Escala de {escala.tonalidade}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-md border border-amber-200/60">
                    {escala.armadura}
                  </span>
                </div>

                <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded border border-gray-200/60">
                  <span className="font-semibold text-gray-700">Orientação Técnica:</span> {escala.observacaoTecnica}
                </p>

                <div>
                  <h5 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                    <Music className="w-3.5 h-3.5 text-amber-700" />
                    Hinos para Prática ({escala.hinosAssociados.length} hinos):
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {escala.hinosAssociados.map((hino, hIdx) => {
                      const isMatch = hinoSearchTerm && hino.includes(hinoSearchTerm.trim());
                      return (
                        <span 
                          key={hIdx} 
                          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                            isMatch 
                              ? 'bg-amber-600 text-white font-bold ring-2 ring-amber-400' 
                              : 'bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100'
                          }`}
                        >
                          Hino {hino}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: 10 ESTUDOS DE ARCO */}
      {activeTab === 'golpes' && (
        <div className="space-y-6">
          <div className="bg-amber-900 text-white rounded-xl p-5 shadow-sm space-y-2">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Feather className="w-5 h-5 text-amber-300" />
              10 Estudos Clássicos para Técnica do Arco (A. Schmoll)
            </h3>
            <p className="text-amber-100 text-sm leading-relaxed">
              Os 10 estudos fundamentais de articulação e articulações de arco (Páginas 48 a 57). Devem ser dominados com precisão antes de iniciar o estudo das posições superiores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXERCICIOS_SCHMOLL.filter(ex => ex.numero >= 114 && ex.numero <= 123).map(ex => (
              <div key={ex.numero} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-md">
                      Lição {ex.numero}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Pág. {ex.pagina}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-xs font-semibold rounded border border-amber-200">
                    Estudo de Arco
                  </span>
                </div>

                <h4 className="font-bold text-gray-900 text-base">{ex.titulo}</h4>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {ex.descricao}
                </p>

                <div className="bg-amber-50/50 p-2.5 rounded border border-amber-200/50 text-xs space-y-1">
                  <p><span className="font-semibold text-amber-900">Técnica de Arco:</span> {ex.tecnicaArco}</p>
                  <p><span className="font-semibold text-amber-900">Tonalidade:</span> {ex.tonalidade} | <span className="font-semibold text-amber-900">Compasso:</span> {ex.compasso}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => handleCopyPlan(ex)}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 border border-amber-200"
                  >
                    {copiedId === ex.numero ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copiar Plano</span>
                  </button>

                  <button
                    onClick={() => setExerciseModal(ex)}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 border border-gray-200"
                  >
                    <Info className="w-3.5 h-3.5 text-gray-500" />
                    <span>Ver Detalhes</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: FUNDAMENTOS & ANATOMIA */}
      {activeTab === 'fundamentos' && (
        <div className="space-y-6">
          <div className="bg-amber-900 text-white rounded-xl p-5 shadow-sm space-y-2">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Disc className="w-5 h-5 text-amber-300" />
              Fundamentos, Postura Corporal e Anatomia do Violino
            </h3>
            <p className="text-amber-100 text-sm leading-relaxed">
              Guia oficial de montagem, cuidados, postura anatômica, técnica das mãos e exercícios de flexibilidade para iniciantes e instrutores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FUNDAMENTOS_VIOLINO_CCB.map((fund, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  {fund.categoria}
                </span>

                <h4 className="text-base font-bold text-gray-900">
                  {fund.titulo}
                </h4>

                <p className="text-xs text-gray-700 leading-relaxed">
                  {fund.conteudo}
                </p>

                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200/60 text-xs text-amber-900 space-y-1">
                  <p className="font-bold text-amber-950 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    Orientação ao Instrutor:
                  </p>
                  <p>{fund.orientacaoProfessor}</p>
                </div>

                <div className="pt-1">
                  <h5 className="text-xs font-bold text-gray-700 mb-1.5">Pontos-Chave:</h5>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {fund.pontosChave.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXERCISE DETAIL MODAL */}
      {exerciseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-xl border border-gray-100">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-md">
                    Lição Nº {exerciseModal.numero}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">Página {exerciseModal.pagina}</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200">
                    {exerciseModal.posicao}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{exerciseModal.titulo}</h3>
              </div>

              <button
                onClick={() => setExerciseModal(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-gray-50 p-3.5 rounded-xl border border-gray-200/60">
              <div>
                <span className="text-gray-500 block">Tonalidade</span>
                <span className="font-bold text-gray-800">{exerciseModal.tonalidade}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Compasso</span>
                <span className="font-bold text-gray-800">{exerciseModal.compasso}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Andamento</span>
                <span className="font-bold text-gray-800">{exerciseModal.andamento}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Nível</span>
                <span className="font-bold text-gray-800">{exerciseModal.nivel} (Fase {exerciseModal.faseOrquestra})</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-1">Descrição e Orientações Técnicas:</h4>
                <p className="text-gray-700 leading-relaxed bg-amber-50/50 p-3 rounded-lg border border-amber-200/40">
                  {exerciseModal.descricao}
                </p>
              </div>

              {exerciseModal.tecnicaArco && (
                <div>
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-1">Técnica de Arco Recomendada:</h4>
                  <p className="text-gray-700 bg-gray-50 p-2.5 rounded border border-gray-200">
                    {exerciseModal.tecnicaArco}
                  </p>
                </div>
              )}

              {exerciseModal.tecnicaMaoEsquerda && (
                <div>
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-1">Técnica da Mão Esquerda / Dedilhado:</h4>
                  <p className="text-gray-700 bg-gray-50 p-2.5 rounded border border-gray-200">
                    {exerciseModal.tecnicaMaoEsquerda}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-1.5">Conceitos Aprendidos:</h4>
                  <ul className="space-y-1">
                    {exerciseModal.conceitos.map((c, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-gray-600">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-1.5">Dificuldades Pedagógicas:</h4>
                  <ul className="space-y-1">
                    {exerciseModal.dificuldades.map((d, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-gray-600">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleCopyPlan(exerciseModal)}
                className="px-4 py-2 bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 border border-amber-200"
              >
                <Copy className="w-4 h-4" />
                <span>Copiar Plano em Texto</span>
              </button>

              {onAddCatalogItem && (
                <button
                  onClick={() => {
                    handleCadastrarNoCatalogo(exerciseModal);
                    setExerciseModal(null);
                  }}
                  className="px-4 py-2 bg-amber-700 text-white hover:bg-amber-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Cadastrar no Catálogo</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
