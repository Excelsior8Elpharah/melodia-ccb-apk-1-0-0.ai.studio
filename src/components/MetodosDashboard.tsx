import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Music, 
  Wind, 
  FileText, 
  Sparkles, 
  ChevronRight, 
  GraduationCap, 
  Layers, 
  Compass, 
  Award,
  ArrowRight,
  ArrowLeft,
  Filter
} from 'lucide-react';

import { MaterialCatalogo } from '../types';
import MetodoBona from './MetodoBona';
import MetodoSchmoll from './MetodoSchmoll';
import MetodoSaxofone from './MetodoSaxofone';
import MetodoFlautaPares from './MetodoFlautaPares';
import MetodoViolaVolmer from './MetodoViolaVolmer';
import MetodoMetaisAlmeidaDias from './MetodoMetaisAlmeidaDias';
import MetodoTrompeteAlmeidaDias from './MetodoTrompeteAlmeidaDias';
import MetodoClarineteGiampieri from './MetodoClarineteGiampieri';
import MusicalWatermark from './MusicalWatermark';

interface MetodoItem {
  id: string;
  titulo: string;
  autor: string;
  instrumento: string;
  familia: 'Teoria' | 'Cordas' | 'Madeiras' | 'Metais';
  subtitulo: string;
  descricao: string;
  modulosCount: string;
  licaoCount: string;
  faseOrquestra: string;
  corGradiente: string;
  badgeBg: string;
  badgeTexto: string;
  icone: React.ReactNode;
  tags: string[];
}

interface MetodosDashboardProps {
  onAddCatalogItem?: (item: MaterialCatalogo) => Promise<void> | void;
  toast?: (message: string, type: 'success' | 'error' | 'info') => void;
  onSelectMetodo?: (methodId: string) => void;
}

export default function MetodosDashboard({ onAddCatalogItem, toast, onSelectMetodo }: MetodosDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamilia, setSelectedFamilia] = useState<string>('Todas');
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);

  const metodos: MetodoItem[] = [
    {
      id: 'bona',
      titulo: 'Método Completo de Solfejo e Teoria',
      autor: 'Paschoal Bona',
      instrumento: 'Teoria & Solfejo / Todos os Instrumentos',
      familia: 'Teoria',
      subtitulo: 'A Divisão Musical e Solfejo Tradicional',
      descricao: 'Base fundamental para todos os aprendizes de orquestra. Abrange desde a leitura das primeiras figuras rítmicas até ligaduras, síncopas, quiálteras, contratempos e solfejo falado.',
      modulosCount: '148 Lições',
      licaoCount: '148 Exercícios',
      faseOrquestra: 'Fase 1 e 2',
      corGradiente: 'from-blue-600 via-indigo-600 to-slate-800',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
      badgeTexto: 'Teoria Base',
      icone: <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      tags: ['Clave de Sol', 'Leitura Rítmica', 'Síncopas', 'Solfejo Falado']
    },
    {
      id: 'schmoll',
      titulo: 'Método Progressivo para Violino',
      autor: 'A. Schmoll (Padronização CCB)',
      instrumento: 'Violino',
      familia: 'Cordas',
      subtitulo: 'Iniciação, 5 Módulos e Posições (1ª à 6ª)',
      descricao: 'Indexação pedagógica completa para violino orquestral. Inclui fundamentos de postura, 10 estudos de articulação do arco, união de posições, e tabela oficial de escalas e hinos da CCB.',
      modulosCount: '5 Módulos',
      licaoCount: '214 Lições',
      faseOrquestra: 'Fase 1 à 4',
      corGradiente: 'from-amber-700 via-amber-800 to-amber-950',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      badgeTexto: 'Cordas Friccionadas',
      icone: <Music className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      tags: ['1ª a 6ª Posição', 'Técnica de Arco', 'Escalas CCB', 'Dueto']
    },
    {
      id: 'viola',
      titulo: 'Método para Viola de Arco',
      autor: 'Berta Volmer (Vol. 1)',
      instrumento: 'Viola de Arco',
      familia: 'Cordas',
      subtitulo: 'Leitura na Clave de Dó na 3ª Linha',
      descricao: 'Método especializado para violistas orquestrais. Foco no domínio da Clave de Dó, sonoridade aveludada do registro grave, condução de arco e preparação para repertório de hinos.',
      modulosCount: '12 Seções',
      licaoCount: '130+ Exercícios',
      faseOrquestra: 'Fase 1 à 4',
      corGradiente: 'from-purple-700 via-purple-800 to-slate-900',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
      badgeTexto: 'Clave de Dó',
      icone: <Music className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      tags: ['Clave de Dó', '1ª Posição', 'Troca de Cordas', 'Sonoridade']
    },
    {
      id: 'saxofone',
      titulo: 'Método Padronizado para Saxofones',
      autor: 'Almeida Dias (CCB)',
      instrumento: 'Saxofone (Soprano, Alto, Tenor, Barítono)',
      familia: 'Madeiras',
      subtitulo: 'Técnica de Palheta, Transposição e Afinação',
      descricao: 'Desenvolvimento completo de mecanismo para a família dos saxofones. Exercícios de embocadura, transposição prática para mib e sib, afinação e correlação com hinos orquestrais.',
      modulosCount: '4 Fases',
      licaoCount: '120+ Estudos',
      faseOrquestra: 'Fase 1 à 4',
      corGradiente: 'from-orange-600 via-amber-700 to-stone-900',
      badgeBg: 'bg-orange-100 text-orange-800 border-orange-200',
      badgeTexto: 'Palheta Simples',
      icone: <Wind className="w-6 h-6 text-orange-600 dark:text-orange-400" />,
      tags: ['Soprano/Alto/Tenor', 'Transposição', 'Embocadura', 'Registro Agudo']
    },
    {
      id: 'flauta',
      titulo: 'Método para Flauta Transversal',
      autor: 'G. Parès / Almeida Dias',
      instrumento: 'Flauta Transversal',
      familia: 'Madeiras',
      subtitulo: 'Embocadura, Articulação e Agilidade',
      descricao: 'Guia completo para flautistas da orquestra. Exercícios de sonoridade em notas longas, afinação das oitavas, tabela de digitação e articulações simples e duplas.',
      modulosCount: '5 Módulos',
      licaoCount: '110+ Estudos',
      faseOrquestra: 'Fase 1 à 4',
      corGradiente: 'from-emerald-600 via-teal-700 to-slate-900',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      badgeTexto: 'Sopro de Madeira',
      icone: <Wind className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      tags: ['Notas Longas', 'Oitavas', 'Mecanismo', 'Tabela de Digitação']
    },
    {
      id: 'clarinete-giampieri',
      titulo: 'Método Progressivo para Clarinete',
      autor: 'Alamiro Giampieri (Sistema Böhm)',
      instrumento: 'Clarinete (Bb / La)',
      familia: 'Madeiras',
      subtitulo: 'Registros Chalumeau, Clarim e Altíssimo',
      descricao: 'Método consagrado para clarinete em sistema Böhm. Domínio da passagem de registro (do grave para o agudo), articulações, escalas com acidentes e aplicação direta nos hinos.',
      modulosCount: '6 Módulos',
      licaoCount: '140+ Exercícios',
      faseOrquestra: 'Fase 1 à 4',
      corGradiente: 'from-cyan-700 via-blue-800 to-slate-950',
      badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      badgeTexto: 'Sistema Böhm',
      icone: <Wind className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />,
      tags: ['Chalumeau', 'Passagem de Registro', 'Clarim', 'Hinos CCB']
    },
    {
      id: 'trompete-almeida',
      titulo: 'Método para Trompete, Cornet e Flugelhorn',
      autor: 'Almeida Dias (CCB)',
      instrumento: 'Trompete, Cornet e Flugelhorn (Bb)',
      familia: 'Metais',
      subtitulo: 'Flexibilidade, Articulação e Afinação em Sib',
      descricao: 'Orientado especialmente para pistos e afinação de metais agudos. Exercícios diários de aquecimento, notas pedal, flexibilidade de lábios e projeção sonora para a orquestra.',
      modulosCount: '4 Fases',
      licaoCount: '130+ Estudos',
      faseOrquestra: 'Fase 1 à 4',
      corGradiente: 'from-amber-600 via-orange-700 to-amber-950',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
      badgeTexto: 'Metais Agudos',
      icone: <Wind className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      tags: ['Flexibilidade de Lábios', 'Pistos', 'Ataque de Nota', 'Registro Grave ao Agudo']
    },
    {
      id: 'metais-almeida',
      titulo: 'Método para Metais Graves',
      autor: 'Almeida Dias (CCB)',
      instrumento: 'Tuba, Eufônio (Bombardino) e Trombone',
      familia: 'Metais',
      subtitulo: 'Tessitura Grave na Clave de Fá',
      descricao: 'Método essencial para o naipe de sustentação harmônica e baixo da orquestra. Exercícios de coluna de ar, afinação de válvulas/pistos e vara na Clave de Fá.',
      modulosCount: '4 Fases',
      licaoCount: '125+ Estudos',
      faseOrquestra: 'Fase 1 à 4',
      corGradiente: 'from-yellow-700 via-amber-800 to-neutral-900',
      badgeBg: 'bg-yellow-100 text-yellow-900 border-yellow-200',
      badgeTexto: 'Naipe de Baixo',
      icone: <Wind className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />,
      tags: ['Clave de Fá', 'Coluna de Ar', 'Base Harmônica', 'Tuba & Eufônio']
    }
  ];

  const familias = ['Todas', 'Teoria', 'Cordas', 'Madeiras', 'Metais'];

  const filteredMetodos = useMemo(() => {
    return metodos.filter(m => {
      const matchesSearch = 
        searchTerm === '' ||
        m.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.instrumento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFamilia = selectedFamilia === 'Todas' || m.familia === selectedFamilia;

      return matchesSearch && matchesFamilia;
    });
  }, [searchTerm, selectedFamilia]);

  const handleCardClick = (methodId: string) => {
    if (onSelectMetodo) {
      onSelectMetodo(methodId);
    }
    setSelectedMethodId(methodId);
  };

  if (selectedMethodId) {
    const renderActiveMethod = () => {
      switch (selectedMethodId) {
        case 'bona':
          return <MetodoBona onAddCatalogItem={onAddCatalogItem} toast={toast} />;
        case 'schmoll':
          return <MetodoSchmoll onAddCatalogItem={onAddCatalogItem} toast={toast} />;
        case 'saxofone':
          return <MetodoSaxofone onAddCatalogItem={onAddCatalogItem} toast={toast} />;
        case 'flauta':
          return <MetodoFlautaPares onAddCatalogItem={onAddCatalogItem} toast={toast} />;
        case 'viola':
          return <MetodoViolaVolmer onAddCatalogItem={onAddCatalogItem} toast={toast} />;
        case 'metais-almeida':
          return <MetodoMetaisAlmeidaDias onAddCatalogItem={onAddCatalogItem} toast={toast} />;
        case 'trompete-almeida':
          return <MetodoTrompeteAlmeidaDias onAddCatalogItem={onAddCatalogItem} toast={toast} />;
        case 'clarinete-giampieri':
          return <MetodoClarineteGiampieri onAddCatalogItem={onAddCatalogItem} toast={toast} />;
        default:
          return null;
      }
    };

    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedMethodId(null)}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm border border-slate-200 dark:border-slate-700 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Central de Métodos</span>
        </button>

        {renderActiveMethod()}
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <MusicalWatermark type="pauta" position="center-right" opacityClass="opacity-[0.03] dark:opacity-[0.05]" />

      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <MusicalWatermark type="dupla" position="bottom-right" opacityClass="opacity-[0.08] text-white" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-3 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Biblioteca Pedagógica da Orquestra</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Métodos e Didática Musical
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Acesse a base de conhecimento oficial de cada instrumento e teoria musical. Cada método conta com índice detalhado de lições, orientações para professores, correlação com hinos da CCB e planos de aula prontos.
          </p>

          {/* Metrics counter */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
              <span className="text-slate-400 font-medium block">Total de Métodos</span>
              <span className="text-xl font-bold text-white">{metodos.length} Métodos</span>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
              <span className="text-slate-400 font-medium block">Lições Mapeadas</span>
              <span className="text-xl font-bold text-white">1.000+ Exercícios</span>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
              <span className="text-slate-400 font-medium block">Naipes Atendidos</span>
              <span className="text-xl font-bold text-white">Todos os Naipes</span>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
              <span className="text-slate-400 font-medium block">Correlação Orquestra</span>
              <span className="text-xl font-bold text-white">Fases 1 a 4 CCB</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH AND FAMILY FILTERS BAR */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por método, instrumento, autor ou técnica (ex: Schmoll, Bona, Clave de Dó, Posição)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Family Pill Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 sm:pt-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1 hidden md:block" />
          {familias.map(fam => (
            <button
              key={fam}
              onClick={() => setSelectedFamilia(fam)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedFamilia === fam
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
              }`}
            >
              {fam === 'Todas' ? '🎼 Todos os Naipes' : fam}
            </button>
          ))}
        </div>
      </div>

      {/* METHOD CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredMetodos.map(m => (
          <div
            key={m.id}
            onClick={() => handleCardClick(m.id)}
            className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            {/* Top Colored Banner Header */}
            <div className={`bg-gradient-to-r ${m.corGradiente} p-5 text-white relative overflow-hidden`}>
              <MusicalWatermark instrumento={m.instrumento} position="bottom-right" opacityClass="opacity-[0.12] text-white" />
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div>
                  <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider block mb-1">
                    {m.autor}
                  </span>
                  <h3 className="text-xl font-bold leading-tight group-hover:underline">
                    {m.titulo}
                  </h3>
                </div>
                <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-white shrink-0 border border-white/20">
                  {m.icone}
                </div>
              </div>

              <p className="text-xs text-white/80 mt-2 font-medium">
                📍 {m.instrumento}
              </p>
            </div>

            {/* Card Content Body */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold border ${m.badgeBg}`}>
                    {m.badgeTexto}
                  </span>
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    {m.modulosCount} • {m.licaoCount}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {m.descricao}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {m.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium rounded-md border border-slate-200/60 dark:border-slate-700/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {m.faseOrquestra}
                </span>
                <span className="inline-flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Acessar Método</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMetodos.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">Nenhum método encontrado</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Não encontramos nenhum método correspondente ao filtro de pesquisa "{searchTerm}". Tente selecionar outra categoria de naipe ou limpar a busca.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedFamilia('Todas');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
}
