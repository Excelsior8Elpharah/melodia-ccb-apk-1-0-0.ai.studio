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
  Zap
} from 'lucide-react';
import { 
  ESTRUTURA_PEDAGOGICA_BONA, 
  EXERCICIOS_BONA, 
  SecaoPedagogicaBona 
} from '../data/metodoBona';
import { ExercícioBona, MaterialCatalogo } from '../types';
import MusicalWatermark from './MusicalWatermark';

interface MetodoBonaProps {
  onAddCatalogItem?: (item: MaterialCatalogo) => void;
  toast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function MetodoBona({ onAddCatalogItem, toast }: MetodoBonaProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParte, setSelectedParte] = useState<number>(0); // 0 = Todas
  const [selectedNivel, setSelectedNivel] = useState<string>('Todos');
  const [selectedFase, setSelectedFase] = useState<number>(0); // 0 = Todas
  const [selectedExercise, setSelectedExercise] = useState<ExercícioBona | null>(null);
  const [activeTab, setActiveTab] = useState<'exercicios' | 'estrutura' | 'guia'>('exercicios');

  // Filter exercises
  const filteredExercises = EXERCICIOS_BONA.filter(ex => {
    if (selectedParte !== 0 && ex.parte !== selectedParte) return false;
    if (selectedNivel !== 'Todos' && ex.nivel !== selectedNivel) return false;
    if (selectedFase !== 0 && ex.faseOrquestra !== selectedFase) return false;

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchNum = ex.numero.toString() === q || `ex. ${ex.numero}`.includes(q) || `exercício ${ex.numero}`.includes(q);
      const matchTitle = ex.titulo.toLowerCase().includes(q);
      const matchTon = ex.tonalidade.toLowerCase().includes(q);
      const matchComp = ex.compasso.toLowerCase().includes(q);
      const matchDesc = ex.descricao.toLowerCase().includes(q);
      const matchConc = ex.conceitos.some(c => c.toLowerCase().includes(q));
      const matchDif = ex.dificuldades.some(d => d.toLowerCase().includes(q));
      return matchNum || matchTitle || matchTon || matchComp || matchDesc || matchConc || matchDif;
    }

    return true;
  });

  // Handle adding exercise to catalog
  const handleAddToCatalog = (ex: ExercícioBona) => {
    if (!onAddCatalogItem) return;
    const newItem: MaterialCatalogo = {
      id: 'bona-' + ex.numero + '-' + Date.now().toString(36),
      nome: `Bona Ex. ${ex.numero} – ${ex.titulo}`,
      instrumento: 'Geral',
      fase: ex.faseOrquestra,
      tipo: ex.numero >= 99 ? 'Técnica' : 'Teoria',
      metodo: 'P. BONA (Divisão)',
      descricao: `Página ${ex.pagina} (${ex.compasso}, ${ex.tonalidade}). Conceitos: ${ex.conceitos.join(', ')}. ${ex.descricao}`
    };
    onAddCatalogItem(newItem);
    toast(`✅ Bona Ex. ${ex.numero} adicionado ao Catálogo de Materiais!`, 'success');
  };

  // Copy details for lesson plan
  const handleCopyLessonText = (ex: ExercícioBona) => {
    const text = `📖 P. BONA - EXERCÍCIO ${ex.numero} (Pág. ${ex.pagina})\n` +
      `📌 Título: ${ex.titulo}\n` +
      `🎵 Métrica & Tom: ${ex.compasso} em ${ex.tonalidade} (${ex.andamento})\n` +
      `🎯 Foco Pedagógico: ${ex.conceitos.join(', ')}\n` +
      `⚠️ Desafios Técnicos: ${ex.dificuldades.join(', ')}\n` +
      `📝 Recomendações: ${ex.descricao}`;
    
    navigator.clipboard.writeText(text);
    toast(`📋 Texto do Ex. ${ex.numero} copiado para a área de transferência!`, 'info');
  };

  return (
    <div className="space-y-6 relative" id="metodo-bona-container">
      <MusicalWatermark type="sol" position="center-right" opacityClass="opacity-[0.035] dark:opacity-[0.05]" />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800 relative overflow-hidden">
        <MusicalWatermark type="sol" position="bottom-right" opacityClass="opacity-[0.1] text-white" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-400/30 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Base de Conhecimento Indexada
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30">
                P. BONA (Edição Manon)
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">Método Completo para Divisão – P. Bona</h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Ilustrações técnicas e analíticas por Savino De Benedictis (Páginas 1 a 60).
              Indexação pedagógica de 118+ exercícios com objetivos de aprendizagem, métrica, tonalidades e dificuldades técnicas para planos de aula e acompanhamento de alunos.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto">
            <button
              onClick={() => setActiveTab('exercicios')}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'exercicios' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
            >
              <FileText className="w-4 h-4" /> Exercícios ({EXERCICIOS_BONA.length})
            </button>
            <button
              onClick={() => setActiveTab('estrutura')}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'estrutura' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
            >
              <Layers className="w-4 h-4" /> As 3 Partes
            </button>
            <button
              onClick={() => setActiveTab('guia')}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'guia' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> Guia de Progresso
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: EXERCÍCIOS INDEXADOS */}
      {activeTab === 'exercicios' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="🔍 Buscar exercício por número (ex: 42, 61), conceito (ex: síncopa, tercina, contratempo) ou tonalidade..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedParte}
                  onChange={(e) => setSelectedParte(Number(e.target.value))}
                >
                  <option value={0}>Todas as Partes</option>
                  <option value={1}>Parte I (Ex 1 - 74)</option>
                  <option value={2}>Parte II (Ex 75 - 98)</option>
                  <option value={3}>Parte III (Ex 99 - 118)</option>
                </select>

                <select
                  className="px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedNivel}
                  onChange={(e) => setSelectedNivel(e.target.value)}
                >
                  <option value="Todos">Todos os Níveis</option>
                  <option value="Iniciante">Iniciante</option>
                  <option value="Básico">Básico</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>

                <select
                  className="px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedFase}
                  onChange={(e) => setSelectedFase(Number(e.target.value))}
                >
                  <option value={0}>Todas as Fases da Orquestra</option>
                  <option value={1}>Fase 1 (Fundamentos)</option>
                  <option value={2}>Fase 2 (Técnica)</option>
                  <option value={3}>Fase 3 (Hinos Jovens)</option>
                  <option value={4}>Fase 4 (Hinos Oficiais)</option>
                </select>
              </div>
            </div>

            {/* Quick tag shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-semibold mr-1">Filtros Rápidos:</span>
              {[
                'Contratempo', 'Síncopa', 'Tercinas', 'Ponto Dobrado', 
                'Compassos Compostos', 'Ornamentos', '6/8', 'Saltos de Oitava'
              ].map(tag => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700/60 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/50 dark:hover:text-blue-300 text-slate-600 dark:text-slate-400 rounded-lg text-[11px] font-medium transition-colors"
                >
                  #{tag}
                </button>
              ))}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-2 py-1 text-[11px] text-red-500 hover:underline font-semibold ml-auto"
                >
                  Limpar Busca
                </button>
              )}
            </div>
          </div>

          {/* Exercise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map(ex => (
              <div
                key={ex.numero}
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-blue-300 dark:hover:border-blue-600 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                        {ex.numero}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                          Página {ex.pagina} • Parte {ex.parte}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                          {ex.titulo}
                        </h4>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      ex.nivel === 'Iniciante' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      ex.nivel === 'Básico' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                      ex.nivel === 'Intermediário' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    }`}>
                      Fase {ex.faseOrquestra} ({ex.nivel})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl mb-2">
                    <span className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                      ⏱️ {ex.compasso}
                    </span>
                    <span className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                      🎶 {ex.tonalidade}
                    </span>
                    <span className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg truncate">
                      🚶 {ex.andamento}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2">
                    {ex.descricao}
                  </p>

                  {/* Concept Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {ex.conceitos.map(c => (
                      <span key={c} className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 px-2 py-0.5 rounded-md font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedExercise(ex)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Ver Detalhes completos <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyLessonText(ex)}
                      title="Copiar texto para plano de aula"
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {onAddCatalogItem && (
                      <button
                        onClick={() => handleAddToCatalog(ex)}
                        title="Adicionar ao Catálogo da Escola"
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Catálogo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Nenhum exercício do Método Bona encontrado com esses filtros.</p>
              <p className="text-xs text-slate-400">Tente buscar por números (ex: 1, 42, 75, 99) ou limpar a caixa de pesquisa.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedParte(0); setSelectedNivel('Todos'); setSelectedFase(0); }}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Resetar Filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ESTRUTURA DAS 3 PARTES */}
      {activeTab === 'estrutura' && (
        <div className="space-y-6">
          {ESTRUTURA_PEDAGOGICA_BONA.map((secao) => (
            <div key={secao.titulo} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                    Parte {secao.parte} • {secao.paginas}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    {secao.titulo}
                  </h3>
                </div>
                <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full">
                  Método P. Bona
                </span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {secao.descricao}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Objetivos */}
                <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 space-y-2">
                  <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-blue-600" /> Objetivos de Aprendizagem
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {secao.objetivos.map(obj => (
                      <li key={obj} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Competências */}
                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/40 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600" /> Competências Desenvolvidas
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {secao.competencias.map(comp => (
                      <li key={comp} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Conceitos e Dificuldades */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    📚 Conceitos Teóricos Abordados
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {secao.conceitosTeoricos.map(c => (
                      <span key={c} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-lg font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    ⚠️ Dificuldades Técnicas Alvo
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {secao.dificuldadesTecnicas.map(d => (
                      <span key={d} className="text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-lg font-medium border border-amber-200/50 dark:border-amber-800/40">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: GUIA DE PROGRESSÃO DO ALUNO */}
      {activeTab === 'guia' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Trilha de Recomendação & Sequência Pedagógica por Fase
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Mapeamento de exercícios chave do Método Bona integrados às 4 Fases de Evolução do Musico/Aluno na Orquestra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fase 1 */}
            <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/20 dark:bg-blue-950/10 dark:border-blue-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider">FASE 1 – FUNDAMENTOS</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">Ex 1 a 20</span>
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Leitura na Clave de Sol & Saltos Iniciais</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Iniciação do solfejo falado e cantado. Foco no pulso firme em 4/4, transição de valores longos (semibreve/mínima) para curtos (semínimas e colcheias) e saltos de 3ª a 5ª.
              </p>
              <div className="text-xs space-y-1 font-semibold text-blue-900 dark:text-blue-300">
                <p>🎯 Exercícios Recomendados: Ex. 1, 3, 4, 6 (Terças), 9 (Quartas), 12 (Quintas)</p>
                <p>⏱️ Frequência Mínima Sugerida: 2 a 3 estudos por semana no diário.</p>
              </div>
            </div>

            {/* Fase 2 */}
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 dark:bg-emerald-950/10 dark:border-emerald-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">FASE 2 – TÉCNICA RÍTMICA</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Ex 21 a 74</span>
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Contratempos, Pontos de Aumento e Síncopas</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Domínio dos saltos amplos (6ª a 10ª), ritmo acéfalo (entradas no contratempo), ponto simples e dobrado, ligaduras e síncopas regulares e irregulares.
              </p>
              <div className="text-xs space-y-1 font-semibold text-emerald-900 dark:text-emerald-300">
                <p>🎯 Exercícios Recomendados: Ex. 21 (Oitavas), 42 (Contratempo), 53 (Ponto), 61 (Síncopa), 74 (Fusas)</p>
                <p>⏱️ Preparação necessária para entrada em grupos de ensaio de turmas.</p>
              </div>
            </div>

            {/* Fase 3 */}
            <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/20 dark:bg-amber-950/10 dark:border-amber-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">FASE 3 – REPERTÓRIO JOVEM & MÉTRICA DIVERSA</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Ex 75 a 98</span>
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Tresquiálteras, 6/8, 9/8, 12/8 e Cadências</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Navegação por compassos compostos, divisão de 3 notas por tempo (tercinas), sestinas e cadências a piacere. Indispensável para tocar nos ensaios e cultos jovens.
              </p>
              <div className="text-xs space-y-1 font-semibold text-amber-900 dark:text-amber-300">
                <p>🎯 Exercícios Recomendados: Ex. 75 (Tercinas), 77 (2/2), 81 (3/4), 85 (6/8), 89 (12/8), 93 (Cadência)</p>
              </div>
            </div>

            {/* Fase 4 */}
            <div className="p-5 rounded-2xl border border-purple-200 bg-purple-50/20 dark:bg-purple-950/10 dark:border-purple-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-700 dark:text-purple-400 uppercase tracking-wider">FASE 4 – HINOS OFICIAIS & VIRTUOSISMO</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">Ex 99 a 118</span>
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Ornamentos, Abreviações, Modulações e Prontidão Orquestral</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Trinados, apogiaturas, mordentes, grupetos, navegação rápida por sinais formais (Dal Segno, Coda) e mudanças repentinas de tonalidade e andamento.
              </p>
              <div className="text-xs space-y-1 font-semibold text-purple-900 dark:text-purple-300">
                <p>🎯 Exercícios Recomendados: Ex. 99 (Ornamentos), 108 (Adagio 5#), 109 (Trinados), 117 (Coda e Abreviações)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXERCISE DETAIL MODAL */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 max-w-xl w-full rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-blue-600 text-white font-black text-base rounded-2xl flex items-center justify-center shadow-md">
                  {selectedExercise.numero}
                </span>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Página {selectedExercise.pagina} • Parte {selectedExercise.parte}
                  </span>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    {selectedExercise.titulo}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedExercise(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl text-center text-xs font-semibold">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Métrica</span>
                <span className="text-slate-800 dark:text-white">{selectedExercise.compasso}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Tonalidade</span>
                <span className="text-slate-800 dark:text-white">{selectedExercise.tonalidade}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Andamento</span>
                <span className="text-slate-800 dark:text-white">{selectedExercise.andamento}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">📝 Descrição Pedagogica</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {selectedExercise.descricao}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">🎯 Conceitos Musicais</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedExercise.conceitos.map(c => (
                    <span key={c} className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2.5 py-1 rounded-lg font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">⚠️ Dificuldades Técnicas</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  {selectedExercise.dificuldades.map(d => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">🔑 Pré-requisitos</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedExercise.prerequisitos.map(p => (
                    <span key={p} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-2">
              <button
                onClick={() => handleCopyLessonText(selectedExercise)}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copiar para Plano
              </button>
              {onAddCatalogItem && (
                <button
                  onClick={() => {
                    handleAddToCatalog(selectedExercise);
                    setSelectedExercise(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar ao Catálogo
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
