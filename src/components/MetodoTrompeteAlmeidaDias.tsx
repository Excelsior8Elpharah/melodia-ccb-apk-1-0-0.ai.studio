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
  FUNDAMENTOS_TROMPETE_ALMEIDA, 
  SECOES_PEDAGOGICAS_TROMPETE, 
  TABELA_30_FASES_TROMPETE, 
  CATALOGO_EXERCICIOS_TROMPETE,
  ORNAMENTOS_TROMPETE_ALMEIDA,
  BIBLIOGRAFIA_TROMPETE
} from '../data/metodoTrompeteAlmeidaDias';
import { 
  ExercícioTrompeteAlmeidaDias, 
  MaterialCatalogo, 
  SecaoPedagogicaTrompeteAlmeidaDias, 
  FaseTabelaTrompeteAlmeidaDias,
  OrnamentoTrompeteAlmeidaDias
} from '../types';

interface MetodoTrompeteAlmeidaDiasProps {
  onAddCatalogItem?: (item: MaterialCatalogo) => void;
  toast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function MetodoTrompeteAlmeidaDias({ onAddCatalogItem, toast }: MetodoTrompeteAlmeidaDiasProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModulo, setSelectedModulo] = useState<string>('Todos');
  const [selectedNivel, setSelectedNivel] = useState<string>('Todos');
  const [selectedInstrumento, setSelectedInstrumento] = useState<string>('Todos');
  const [selectedExercise, setSelectedExercise] = useState<ExercícioTrompeteAlmeidaDias | null>(null);
  const [activeTab, setActiveTab] = useState<'exercicios' | 'fases' | 'modulos' | 'fundamentos' | 'ornamentos' | 'gerador'>('exercicios');
  const [filterFase, setFilterFase] = useState<number | null>(null);

  // Generator state
  const [genInstrumento, setGenInstrumento] = useState<'Comum (Trompete, Cornet, Flugelhorn)' | 'Trompete' | 'Cornet' | 'Flugelhorn' | 'Pocket / Saxhorn / Melofone'>('Trompete');
  const [genNivel, setGenNivel] = useState<'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado'>('Básico');
  const [genFoco, setGenFoco] = useState<string>('Flexibilidade Labial (Lip Slurs) & Coluna de Ar');
  const [genMinutos, setGenMinutos] = useState<number>(45);

  // Filter exercises
  const filteredExercises = CATALOGO_EXERCICIOS_TROMPETE.filter(ex => {
    if (selectedModulo !== 'Todos' && ex.modulo !== selectedModulo) return false;
    if (selectedNivel !== 'Todos' && ex.nivel !== selectedNivel) return false;
    if (selectedInstrumento !== 'Todos' && ex.instrumentoAplicavel !== selectedInstrumento && ex.instrumentoAplicavel !== 'Comum (Trompete, Cornet, Flugelhorn)') return false;
    if (filterFase !== null && ex.fase !== filterFase) return false;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        ex.titulo.toLowerCase().includes(term) ||
        ex.descricao.toLowerCase().includes(term) ||
        ex.conceitos.some(c => c.toLowerCase().includes(term)) ||
        ex.tecnicaPrincipal.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const handleCadastrarCatalogo = (ex: ExercícioTrompeteAlmeidaDias) => {
    if (!onAddCatalogItem) return;
    const newItem: MaterialCatalogo = {
      id: `trompete-almeida-${ex.numero}-${Date.now()}`,
      nome: `ALMEIDA DIAS TROMPETE Ex. ${ex.numero} – ${ex.titulo} (Pág. ${ex.pagina})`,
      instrumento: 'Trompete / Cornet / Flugelhorn',
      fase: ex.faseOrquestra,
      tipo: ex.modulo === 'Estudos Melódicos e Harmonizados' ? 'Repertório' : 'Técnica',
      metodo: 'Almeida Dias (Trompete, Cornet, Flugelhorn)',
      descricao: `${ex.modulo} - Fase ${ex.fase}. ${ex.descricao} Objetivos: ${ex.habilidadeDesenvolvida}.`
    };
    onAddCatalogItem(newItem);
    toast(`Exercício "${ex.titulo}" cadastrado no Catálogo de Músicos com sucesso!`, 'success');
  };

  const handleCopyScript = (ex: ExercícioTrompeteAlmeidaDias) => {
    const text = `
🎺 PLANO DE ESTUDO GUIADO – MÉTODO PRÁTICO ALMEIDA DIAS (TROMPETE/CORNET)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 Exercício: ${ex.titulo} (Nº ${ex.numero})
📄 Página: ${ex.pagina} | Módulo: ${ex.modulo} | Fase Método: ${ex.fase}
🎯 Nível: ${ex.nivel} | Fase Orquestra Recomendada: ${ex.faseOrquestra}
🎵 Compasso: ${ex.compasso} | Andamento: ${ex.andamento} | Tonalidade: ${ex.tonalidade}

💡 TÉCNICA PRINCIPAL:
${ex.tecnicaPrincipal}

🎯 HABILIDADE DESENVOLVIDA:
${ex.habilidadeDesenvolvida}

⚠️ CUIDADOS & DIFICULDADES RECORRENTES:
${ex.dificuldades.map(d => `• ${d}`).join('\n')}

⏱️ TEMPO SUGERIDO: ${ex.tempoEstimadoMinutos} minutos/dia
🔄 CONTINUIDADE RECOMENDADA: ${ex.sugestaoContinuidade}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();

    navigator.clipboard.writeText(text);
    toast('Roteiro pedagógico copiado para a área de transferência!', 'info');
  };

  const generateLessonPlanScript = () => {
    const list = CATALOGO_EXERCICIOS_TROMPETE.filter(e => e.nivel === genNivel);
    const chosenEx = list.length > 0 ? list[0] : CATALOGO_EXERCICIOS_TROMPETE[0];

    return `
🎺 PLANO DE AULA PERSONALIZADO – MÉTODO ALMEIDA DIAS (METAIS AGUDOS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Instrumento: ${genInstrumento}
🎯 Nível do Aluno: ${genNivel} | Duração da Aula: ${genMinutos} minutos
🔥 Foco Pedagógico: ${genFoco}

⏱️ ROTINA DE PRÁTICA RECOMENDADA (${genMinutos} min):

1️⃣ EMISSÃO & AQUECIMENTO (10 min):
   • Notas longas com fole diafragmático nas 7 posições de pistões (Pág. 11 Ex. 1).
   • Vibração livre nos cantos dos lábios (2/3 superior, 1/3 inferior), zero pressão no bocal.

2️⃣ TÉCNICA PRINCIPAL DE PISTÕES & RITMO (15 min):
   • ${chosenEx.titulo} (Pág. ${chosenEx.pagina}, Módulo: ${chosenEx.modulo}).
   • Foco: ${chosenEx.tecnicaPrincipal}.
   • Marcação do tempo no pé em sincronia com o metrônomo.

3️⃣ FLEXIBILIDADE LABIAL & INTERVALOS (${Math.max(10, genMinutos - 30)} min):
   • Lip slurs sem o uso da língua (Pág. 36 Ex. 1 e 2).
   • Transição de ar rápida mantendo os cantos da boca firmes e bochechas desinfladas.

4️⃣ APLICAÇÃO EM ESTUDO MELÓDICO / DUETO (10 min):
   • Estudo Melódico de Almeida Dias com inversão de vozes entre aluno e professor.
   • Expressão dinâmica de pp a ff e escuta atenta da afinação do companheiro.

💡 ORIENTAÇÃO AO PROFESSOR:
   • Verificar se a mão esquerda suporta o peso total e se os dedos da mão direita acionam os pistos verticalmente.
   • Modelo de Bocal Recomendado: Bach 7C, Weril 7C ou Yamaha 11C4.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-yellow-900 rounded-2xl p-6 text-white shadow-xl border border-amber-700/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-300 via-amber-500 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-200 text-sm font-semibold tracking-wide uppercase mb-1">
              <Wind className="w-4 h-4" /> Base de Conhecimento Oficial Indexada
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Método Prático para Trompetes, Cornets e Flugelhorns
            </h1>
            <p className="text-amber-100/90 text-sm mt-1 max-w-2xl leading-relaxed">
              Autoria de <strong>Ronaldo Dias de Almeida (2ª Edição)</strong>. Abrange Trompete, Cornet, Pocket Trumpet, Flugelhorn, Saxhorn e Melofone, estruturado em <strong>6 Módulos e 30 Fases Simultâneas</strong> com ornamentos e estudos harmonizados.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-amber-950/60 backdrop-blur-md p-3 rounded-xl border border-amber-600/30 text-xs">
            <ShieldCheck className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-amber-200">Indexação Completa</div>
              <div className="text-amber-300/80">30 Fases • Tabela Simultânea • Ornamentos</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-amber-700/50">
          <button
            onClick={() => setActiveTab('exercicios')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'exercicios' 
                ? 'bg-amber-400 text-amber-950 shadow-md scale-[1.02]' 
                : 'bg-amber-950/40 text-amber-200 hover:bg-amber-900/60'
            }`}
          >
            <Search className="w-3.5 h-3.5" /> Exercícios Indexados ({CATALOGO_EXERCICIOS_TROMPETE.length})
          </button>
          <button
            onClick={() => setActiveTab('fases')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'fases' 
                ? 'bg-amber-400 text-amber-950 shadow-md scale-[1.02]' 
                : 'bg-amber-950/40 text-amber-200 hover:bg-amber-900/60'
            }`}
          >
            <Table className="w-3.5 h-3.5" /> Tabela das 30 Fases Simultâneas
          </button>
          <button
            onClick={() => setActiveTab('modulos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'modulos' 
                ? 'bg-amber-400 text-amber-950 shadow-md scale-[1.02]' 
                : 'bg-amber-950/40 text-amber-200 hover:bg-amber-900/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> 7 Módulos Pedagógicos
          </button>
          <button
            onClick={() => setActiveTab('fundamentos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'fundamentos' 
                ? 'bg-amber-400 text-amber-950 shadow-md scale-[1.02]' 
                : 'bg-amber-950/40 text-amber-200 hover:bg-amber-900/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Fundamentos, Bocais & Instrumentos
          </button>
          <button
            onClick={() => setActiveTab('ornamentos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ornamentos' 
                ? 'bg-amber-400 text-amber-950 shadow-md scale-[1.02]' 
                : 'bg-amber-950/40 text-amber-200 hover:bg-amber-900/60'
            }`}
          >
            <Music className="w-3.5 h-3.5" /> Ornamentos (Appoggiaturas, Trinados)
          </button>
          <button
            onClick={() => setActiveTab('gerador')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'gerador' 
                ? 'bg-amber-400 text-amber-950 shadow-md scale-[1.02]' 
                : 'bg-amber-950/40 text-amber-200 hover:bg-amber-900/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" /> Gerador de Plano de Aula
          </button>
        </div>
      </div>

      {/* TAB 1: EXERCÍCIOS INDEXADOS */}
      {activeTab === 'exercicios' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por título, técnica, pisto, página ou conceito..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedModulo}
                  onChange={(e) => setSelectedModulo(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="Todos">Todos os Módulos</option>
                  <option value="Escala Cromática & Harmônicos">1. Escala Cromática & Harmônicos</option>
                  <option value="Exercícios Rítmicos e das Posições">2. Exercícios Rítmicos e Posições</option>
                  <option value="Escalas e Arpejos">3. Escalas e Arpejos</option>
                  <option value="Intervalos">4. Intervalos & Síncopas</option>
                  <option value="Flexibilidade">5. Flexibilidade (Lip Slurs)</option>
                  <option value="Ornamentos">6. Ornamentos</option>
                  <option value="Estudos Melódicos e Harmonizados">7. Estudos Melódicos e Duetos</option>
                </select>

                <select
                  value={selectedNivel}
                  onChange={(e) => setSelectedNivel(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="Todos">Todos os Níveis</option>
                  <option value="Iniciante">Iniciante</option>
                  <option value="Básico">Básico</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>

                <select
                  value={selectedInstrumento}
                  onChange={(e) => setSelectedInstrumento(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="Todos">Todos os Instrumentos</option>
                  <option value="Trompete">Trompete</option>
                  <option value="Cornet">Cornet</option>
                  <option value="Flugelhorn">Flugelhorn</option>
                  <option value="Pocket / Saxhorn / Melofone">Pocket / Saxhorn / Melofone</option>
                </select>

                {filterFase !== null && (
                  <button
                    onClick={() => setFilterFase(null)}
                    className="px-2.5 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-amber-200"
                  >
                    Fase {filterFase} ✕
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span>Exibindo <strong>{filteredExercises.length}</strong> de {CATALOGO_EXERCICIOS_TROMPETE.length} exercícios indexados</span>
              <span>Suporte a afinações em Si♭ e Dó</span>
            </div>
          </div>

          {/* Exercise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((ex) => (
              <div 
                key={ex.numero}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all hover:border-amber-400 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800">
                      Pág. {ex.pagina} • Fase {ex.fase}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ex.nivel === 'Iniciante' ? 'bg-emerald-100 text-emerald-800' :
                      ex.nivel === 'Básico' ? 'bg-blue-100 text-blue-800' :
                      ex.nivel === 'Intermediário' ? 'bg-amber-100 text-amber-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {ex.nivel}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-amber-700 transition-colors line-clamp-2">
                    {ex.titulo}
                  </h3>

                  <p className="text-slate-600 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {ex.descricao}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                    <div><strong className="text-slate-700">Técnica:</strong> {ex.tecnicaPrincipal}</div>
                    <div><strong className="text-slate-700">Competência:</strong> {ex.habilidadeDesenvolvida}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedExercise(ex)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" /> Ver Detalhes
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyScript(ex)}
                      title="Copiar Roteiro da Lição"
                      className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {onAddCatalogItem && (
                      <button
                        onClick={() => handleCadastrarCatalogo(ex)}
                        title="Cadastrar no Catálogo de Músicos"
                        className="p-1.5 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TABELA DAS 30 FASES */}
      {activeTab === 'fases' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Table className="w-5 h-5 text-amber-600" /> Tabela de Estudo Simultâneo por Fases (Pág. 7 do Método)
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                O aluno estuda todas as colunas horizontais simultaneamente em cada fase. Os círculos representam o número das lições.
              </p>
            </div>
            <div className="text-xs bg-amber-50 text-amber-800 px-3 py-1.5 rounded-lg border border-amber-200 font-medium">
              30 Fases Progressivas Simultâneas
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-2.5">Fase</th>
                  <th className="p-2.5">Escala Cromática</th>
                  <th className="p-2.5">Ritmo & Posições</th>
                  <th className="p-2.5">Escalas & Arpejos</th>
                  <th className="p-2.5">Intervalos & Síncopas</th>
                  <th className="p-2.5">Flexibilidade</th>
                  <th className="p-2.5">Estudos Melódicos</th>
                  <th className="p-2.5">Orquestra</th>
                  <th className="p-2.5 text-right">Filtrar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {TABELA_30_FASES_TROMPETE.map((row) => (
                  <tr 
                    key={row.fase}
                    className={`hover:bg-amber-50/60 transition-colors ${filterFase === row.fase ? 'bg-amber-100/70 font-semibold' : ''}`}
                  >
                    <td className="p-2.5 font-bold text-amber-900">Fase {row.fase}</td>
                    <td className="p-2.5">{row.cromatid}</td>
                    <td className="p-2.5">{row.mecanismo}</td>
                    <td className="p-2.5">{row.escalasArpejos}</td>
                    <td className="p-2.5">{row.intervalos}</td>
                    <td className="p-2.5">{row.flexibilidade}</td>
                    <td className="p-2.5">{row.estudosMelodicos}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                        Fase {row.faseOrquestra}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => {
                          setFilterFase(row.fase);
                          setActiveTab('exercicios');
                          toast(`Filtrando exercícios da Fase ${row.fase}!`, 'info');
                        }}
                        className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        Ver Lições
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: 7 MÓDULOS PEDAGÓGICOS */}
      {activeTab === 'modulos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SECOES_PEDAGOGICAS_TROMPETE.map((sec) => (
            <div key={sec.moduloNumero} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-extrabold uppercase text-amber-700 tracking-wider">
                    Módulo {sec.moduloNumero} • {sec.paginas}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 mt-0.5">
                    {sec.titulo}
                  </h3>
                </div>
                <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                  <Layers className="w-5 h-5" />
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {sec.descricao}
              </p>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-600" /> Objetivos Pedagógicos:
                </h4>
                <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                  {sec.objetivos.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-600" /> Orientações do Autor (Almeida Dias):
                </h4>
                <ul className="text-xs text-slate-600 space-y-1 bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                  {sec.orientacoesAutor.map((ori, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{ori}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: FUNDAMENTOS & BOCAIS */}
      {activeTab === 'fundamentos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FUNDAMENTOS_TROMPETE_ALMEIDA.map((fund, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-700 tracking-wider">
                      {fund.categoria}
                    </span>
                    <h3 className="text-base font-bold text-slate-800">
                      {fund.subtitulo}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {fund.conteudo}
                </p>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-800">Pontos Chave de Aprendizado:</h4>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {fund.pontosChave.map((pt, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/60 text-xs text-amber-900 space-y-1">
                  <strong className="font-bold flex items-center gap-1 text-amber-800">
                    <Info className="w-3.5 h-3.5" /> Orientação para o Professor:
                  </strong>
                  <p>{fund.orientacaoProfessor}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Table of Bibliografia Complementar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-700" /> Bibliografia & Sugestões de Métodos Complementares (Pág. 61)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {BIBLIOGRAFIA_TROMPETE.map((bib, i) => (
                <div key={i} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900">{bib.autor}</div>
                  <div className="text-amber-800 font-semibold">{bib.obra}</div>
                  <div className="text-slate-500 pt-1 border-t border-slate-200">{bib.aplicacao}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ORNAMENTOS */}
      {activeTab === 'ornamentos' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-white p-6 rounded-2xl shadow-md border border-amber-800">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Music className="w-6 h-6 text-amber-400" /> Ornamentos na Literatura dos Metais (Págs. 40 e 41)
            </h2>
            <p className="text-amber-200 text-xs mt-1 max-w-3xl leading-relaxed">
              Ornamentos são notas ou grupos de notas que dão um colorido à melodia. A duração das notas ornamentais é subtraída do valor da nota real com absoluta precisão rítmica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ORNAMENTOS_TROMPETE_ALMEIDA.map((orn, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-800">
                    {orn.nome}
                  </h3>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold">
                    {orn.tipo}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div><strong className="text-slate-800">Como Executar:</strong> {orn.execucao}</div>
                  <div><strong className="text-slate-800">Regra de Valor:</strong> {orn.regraValor}</div>
                  <div><strong className="text-slate-800">Exemplo no Método:</strong> <span className="text-amber-800 font-medium">{orn.exemplo}</span></div>
                </div>

                <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <strong className="font-bold flex items-center gap-1 text-amber-800 mb-0.5">
                    <Sparkles className="w-3.5 h-3.5" /> Dica de Execução pelo Autor:
                  </strong>
                  <p>{orn.orientacaoAutor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: GERADOR DE PLANO DE AULA */}
      {activeTab === 'gerador' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" /> Gerador de Plano de Aula Automatizado
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Monte uma rotina de prática personalizada para alunos de Trompete, Cornet, Flugelhorn, Pocket ou Melofone com base na metodologia de Ronaldo Dias de Almeida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Instrumento do Aluno</label>
              <select
                value={genInstrumento}
                onChange={(e: any) => setGenInstrumento(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-500"
              >
                <option value="Comum (Trompete, Cornet, Flugelhorn)">Naipe Completo de Metais Agudos</option>
                <option value="Trompete">Trompete (Si♭ / Dó)</option>
                <option value="Cornet">Cornet (Cornetim)</option>
                <option value="Flugelhorn">Flugelhorn</option>
                <option value="Pocket / Saxhorn / Melofone">Pocket / Saxhorn / Melofone</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nível do Estudante</label>
              <select
                value={genNivel}
                onChange={(e: any) => setGenNivel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-500"
              >
                <option value="Iniciante">Iniciante (Primeiros Pistos)</option>
                <option value="Básico">Básico (Fases 5 a 12)</option>
                <option value="Intermediário">Intermediário (Fases 13 a 20)</option>
                <option value="Avançado">Avançado (Fases 21 a 30)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Tempo da Aula / Ensaio</label>
              <select
                value={genMinutos}
                onChange={(e) => setGenMinutos(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-500"
              >
                <option value={30}>30 minutos (Rápido)</option>
                <option value={45}>45 minutos (Padrão)</option>
                <option value={60}>60 minutos (Completo)</option>
                <option value={90}>90 minutos (Masterclass)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Foco Pedagógico Principal</label>
              <input
                type="text"
                value={genFoco}
                onChange={(e) => setGenFoco(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl relative font-mono text-xs space-y-3 leading-relaxed shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-sans">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Roteiro de Estudo Gerado
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateLessonPlanScript());
                  toast('Plano de aula copiado com sucesso!', 'success');
                }}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" /> Copiar Roteiro
              </button>
            </div>

            <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
              {generateLessonPlanScript()}
            </pre>
          </div>
        </div>
      )}

      {/* Modal Detailed View */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase text-amber-700 tracking-wider">
                  Exercício Nº {selectedExercise.numero} • Pág. {selectedExercise.pagina} (Fase {selectedExercise.fase})
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedExercise.titulo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-amber-50/50 p-3.5 rounded-xl border border-amber-100 text-xs">
              <div>
                <span className="text-slate-500 block">Módulo:</span>
                <strong className="text-slate-800">{selectedExercise.modulo}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Compasso / Andamento:</span>
                <strong className="text-slate-800">{selectedExercise.compasso} | {selectedExercise.andamento}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Tonalidade:</span>
                <strong className="text-slate-800">{selectedExercise.tonalidade}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Fase Orquestra:</span>
                <strong className="text-amber-800">Fase {selectedExercise.faseOrquestra}</strong>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Descrição & Objetivo:</h4>
                <p className="leading-relaxed">{selectedExercise.descricao}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Técnica Principal:</h4>
                <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700">{selectedExercise.tecnicaPrincipal}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Competência Desenvolvida:</h4>
                <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700">{selectedExercise.habilidadeDesenvolvida}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Cuidados & Dificuldades Recorrentes:</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  {selectedExercise.dificuldades.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500">
                <span>Tempo Sugerido: <strong>{selectedExercise.tempoEstimadoMinutos} min/dia</strong></span>
                <span>Próximo Passo: <strong>{selectedExercise.sugestaoContinuidade}</strong></span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => setSelectedExercise(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  handleCopyScript(selectedExercise);
                  setSelectedExercise(null);
                }}
                className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-4 h-4" /> Copiar Roteiro
              </button>
              {onAddCatalogItem && (
                <button
                  onClick={() => {
                    handleCadastrarCatalogo(selectedExercise);
                    setSelectedExercise(null);
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" /> Cadastrar no Catálogo
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
