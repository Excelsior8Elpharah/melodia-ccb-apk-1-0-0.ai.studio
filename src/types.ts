/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConsentRecord, LGPDStudentExtension } from './types/lgpd';
export type { ConsentRecord, LGPDStudentExtension };

export interface Pessoa extends LGPDStudentExtension {
  id: string;
  nome: string;
  tipo: 'Musico' | 'Aluno' | 'Professor';
  instrumento: string;
  status: 'Ativo' | 'Afastado' | 'Em Observação';
  telefone: string;
  email: string;
  dataNascimento: string;
  observacoes?: string;
  // Legacy / Phase fields for complete user database alignment and compatibility
  fase?: number; // 1 | 2 | 3 | 4
  contato?: string; // Fallback or legacy contact
  professorId?: string; // For assignment compatibility in school
  // Church / Locality affiliation
  comumCongregacao?: string; // e.g. 'Jardim Maria Rosa - Taboão da Serra - SP'
  bairro?: string; // e.g. 'Jardim Maria Rosa'
  cidade?: string; // e.g. 'Taboão da Serra'
  uf?: string; // e.g. 'SP'
}

export interface Turma {
  id: string;
  nome: string;
  professorId: string; // References Pessoa.id
  instrumento: string;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  horario: string;
  alunosIds: string[]; // References array of Pessoa.id
}

export interface AvaliacaoAluno {
  ritmo: number;     // 0 to 10
  tecnica: number;   // 0 to 10
  leitura: number;   // 0 to 10
  expressao: number; // 0 to 10
  teoria: number;    // 0 to 10
  observacao?: string;
}

export interface Aula {
  id: string;
  turmaId: string; // References Turma.id
  data: string; // YYYY-MM-DD
  conteudo: string;
  material?: string; // Material utilizado (e.g., partitura, metrônomo, playback)
  presencas: Record<string, boolean>; // map of alunoId -> present (true) / absent (false)
  avaliacoes?: Record<string, AvaliacaoAluno>; // map of alunoId -> criteria grades and observation
}

export interface Escala {
  id: string;
  evento: string; // e.g., "Culto de Domingo", "Ensaio de Sábado"
  data: string; // YYYY-MM-DDTHH:MM
  regenteId: string; // References Pessoa.id
  musicosIds: string[]; // References Pessoa.id[]
  status: 'Confirmado' | 'Rascunho' | 'Realizado';
  observacoes?: string;
}

export interface InstrumentoSek {
  nome: string;
  familia: 'Cordas' | 'Madeiras' | 'Metais' | 'Percussão' | 'Outros';
  naipe: 'Agudo' | 'Médio' | 'Grave';
}

export interface DiarioRegistro {
  id: string;
  alunoId: string; // References Pessoa.id
  data: string; // YYYY-MM-DD
  conteudo: string;
  material?: string; // Material Utilizado (e.g., partitura, metrônomo, playback)
  objetivo?: string; // Objetivo da Aula
  desempenho: string;
  tarefaCasa: string;
  duracaoMinutos: number;
}

export interface MaterialCatalogo {
  id: string;
  nome: string;
  instrumento: string; // 'Geral' | 'Violino' | 'Trompete' | etc.
  fase: number; // 1 | 2 | 3 | 4
  tipo: 'Teoria' | 'Técnica' | 'Repertório';
  metodo?: string; // Optional method (BONA, Galamian, Arban, Hanon, Klosé, Suzuki, etc.)
  descricao?: string;
}

export interface ExercícioBona {
  numero: number;
  parte: 1 | 2 | 3;
  pagina: number;
  titulo: string;
  tonalidade: string;
  compasso: string;
  andamento: string;
  nivel: 'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado';
  faseOrquestra: 1 | 2 | 3 | 4;
  conceitos: string[];
  dificuldades: string[];
  prerequisitos: string[];
  descricao: string;
}

export interface ExercícioSchmoll {
  numero: number;
  pagina: number;
  secao: string;
  titulo: string;
  posicao: '1ª Posição' | '2ª Posição' | '3ª Posição' | '4ª Posição' | '5ª Posição' | '6ª Posição' | 'União de Posições' | 'Anatomia / Postura';
  tecnicaArco?: string;
  tecnicaMaoEsquerda?: string;
  tonalidade: string;
  compasso: string;
  andamento: string;
  nivel: 'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado';
  faseOrquestra: 1 | 2 | 3 | 4;
  conceitos: string[];
  dificuldades: string[];
  prerequisitos: string[];
  compositor?: string;
  descricao: string;
}

export interface EscalaHinoViolino {
  tonalidade: string;
  armadura: string;
  paginaMetodo: number;
  hinosAssociados: string[];
  observacaoTecnica: string;
}

export interface FundamentoViolino {
  categoria: string;
  titulo: string;
  conteudo: string;
  orientacaoProfessor: string;
  pontosChave: string[];
}

export interface ExercícioSaxofone {
  numero: number;
  modulo: 'Escala Cromática' | 'Exercícios Progressivos e de Mecanismo' | 'Escalas e Arpejos' | 'Intervalos' | 'Estudos Melódicos e Harmonizados';
  pagina: number;
  fase: number;
  faseOrquestra: 1 | 2 | 3 | 4;
  titulo: string;
  tonalidade: string;
  compasso: string;
  andamento: string;
  nivel: 'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado';
  conceitos: string[];
  dificuldades: string[];
  prerequisitos: string[];
  tecnicaPrincipal: string;
  habilidadeDesenvolvida: string;
  tempoEstimadoMinutos: number;
  sugestaoContinuidade: string;
  descricao: string;
}

export interface SecaoPedagogicaSaxofone {
  moduloNumero: number;
  titulo: string;
  paginas: string;
  descricao: string;
  objetivos: string[];
  fundamentosTecnicos: string[];
  conceitosMusicais: string[];
  orientacoesAutor: string[];
  dificuldadesRecorrentes: string[];
}

export interface FaseTabelaAlmeidaDias {
  fase: number;
  cromatid: string;
  mecanismo: string;
  escalasArpejos: string;
  intervalos: string;
  estudosMelodicos: string;
  faseOrquestra: 1 | 2 | 3 | 4;
  nivelEstimado: 'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado';
}

export interface ExercícioFlautaPares {
  numero: number;
  secao: 'Fundamentos e Notas Longas' | 'Exercícios Preliminares & Cromáticos' | 'Registro Agudo e Métrica' | 'Síncopas & Escalas Diatônicas' | 'Ligados & Regulates' | 'Articulações & Golpes de Língua' | 'Sons Filados & Arpejos' | 'Adornos & Contratempos' | 'Estudos de Óperas Célebres';
  pagina: number;
  paginaPdf: number;
  faseOrquestra: 1 | 2 | 3 | 4;
  titulo: string;
  tonalidade: string;
  compasso: string;
  andamento: string;
  nivel: 'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado';
  conceitos: string[];
  dificuldades: string[];
  prerequisitos: string[];
  tecnicaPrincipal: string;
  habilidadeDesenvolvida: string;
  tempoEstimadoMinutos: number;
  sugestaoContinuidade: string;
  compositor?: string;
  descricao: string;
}

export interface SecaoPedagogicaFlautaPares {
  capituloNumero: number;
  titulo: string;
  paginas: string;
  descricao: string;
  objetivos: string[];
  fundamentosTecnicos: string[];
  conceitosMusicais: string[];
  orientacoesAutor: string[];
  dificuldadesRecorrentes: string[];
}

export interface ExercícioViolaVolmer {
  numero: number;
  secao: 'Fundamentos & Cordas Soltas' | 'Primeira Griffstellung (1ª Posição de Dedilhado)' | 'Segunda Griffstellung & Synkopen' | 'Terceira Griffstellung & Tonalidades Sustenizadas' | 'Quarta e Quinta Griffstellungen & Cromatismos' | 'Golpes de Arco (Martelé, Spiccato & Triolen)' | 'Die Halbe Lage (Meia Posição)' | 'Die Moll-Tonleitern (Escalas Menores & Dinâmicas)' | 'Bogentechnischer Anhang (Apêndice de Golpes de Arco)';
  pagina: number;
  faseOrquestra: 1 | 2 | 3 | 4;
  titulo: string;
  tonalidade: string;
  compasso: string;
  andamento: string;
  griffstellung?: string;
  nivel: 'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado';
  conceitos: string[];
  dificuldades: string[];
  prerequisitos: string[];
  tecnicaPrincipal: string;
  habilidadeDesenvolvida: string;
  tempoEstimadoMinutos: number;
  sugestaoContinuidade: string;
  compositor?: string;
  descricao: string;
}

export interface UnidadePedagogicaViolaVolmer {
  unidadeNumero: number;
  titulo: string;
  paginas: string;
  descricao: string;
  objetivos: string[];
  fundamentosTecnicos: string[];
  conceitosMusicais: string[];
  orientacoesAutor: string[];
  dificuldadesRecorrentes: string[];
}

export interface FundamentoViolaVolmer {
  categoria: string;
  subtitulo: string;
  conteudo: string;
  pontosChave: string[];
  orientacaoProfessor: string;
}

export interface ExercícioMetaisAlmeidaDias {
  numero: number;
  modulo: 'Escala Cromática & Harmônicos' | 'Exercícios Rítmicos e das Posições' | 'Escalas e Arpejos' | 'Intervalos' | 'Flexibilidade' | 'Estudos Melódicos e Harmonizados';
  pagina: number;
  fase: number; // 1 to 30
  faseOrquestra: 1 | 2 | 3 | 4;
  instrumentoAplicavel: 'Comum (Tuba, Eufônio, Trombone)' | 'Tuba' | 'Eufônio / Bombardino' | 'Trombone';
  afinacaoTom?: 'Dó' | 'Si b' | 'Mi b' | 'Todas';
  titulo: string;
  tonalidade: string;
  compasso: string;
  andamento: string;
  nivel: 'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado';
  conceitos: string[];
  dificuldades: string[];
  prerequisitos: string[];
  tecnicaPrincipal: string;
  habilidadeDesenvolvida: string;
  tempoEstimadoMinutos: number;
  sugestaoContinuidade: string;
  compositor?: string;
  descricao: string;
}

export interface SecaoPedagogicaMetaisAlmeidaDias {
  moduloNumero: number;
  titulo: string;
  paginas: string;
  descricao: string;
  objetivos: string[];
  fundamentosTecnicos: string[];
  conceitosMusicais: string[];
  orientacoesAutor: string[];
  dificuldadesRecorrentes: string[];
}

export interface FundamentoMetaisAlmeidaDias {
  categoria: string;
  subtitulo: string;
  conteudo: string;
  pontosChave: string[];
  orientacaoProfessor: string;
}

export interface ExercícioTrompeteAlmeidaDias {
  numero: number;
  modulo: 'Escala Cromática & Harmônicos' | 'Exercícios Rítmicos e das Posições' | 'Escalas e Arpejos' | 'Intervalos' | 'Flexibilidade' | 'Ornamentos' | 'Estudos Melódicos e Harmonizados';
  pagina: number;
  fase: number; // 1 to 30
  faseOrquestra: 1 | 2 | 3 | 4;
  instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)' | 'Trompete' | 'Cornet' | 'Flugelhorn' | 'Pocket / Saxhorn / Melofone';
  afinacaoTom?: 'Si b' | 'Dó' | 'Mi b' | 'Fá' | 'Si b e Dó' | 'Todas';
  titulo: string;
  tonalidade: string;
  compasso: string;
  andamento: string;
  nivel: 'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado';
  conceitos: string[];
  dificuldades: string[];
  prerequisitos: string[];
  tecnicaPrincipal: string;
  habilidadeDesenvolvida: string;
  tempoEstimadoMinutos: number;
  sugestaoContinuidade: string;
  compositor?: string;
  descricao: string;
}

export interface SecaoPedagogicaTrompeteAlmeidaDias {
  moduloNumero: number;
  titulo: string;
  paginas: string;
  descricao: string;
  objetivos: string[];
  fundamentosTecnicos: string[];
  conceitosMusicais: string[];
  orientacoesAutor: string[];
  dificuldadesRecorrentes: string[];
}

export interface FundamentoTrompeteAlmeidaDias {
  categoria: string;
  subtitulo: string;
  conteudo: string;
  pontosChave: string[];
  orientacaoProfessor: string;
}

export interface FaseTabelaTrompeteAlmeidaDias {
  fase: number;
  cromatid: string;
  mecanismo: string;
  escalasArpejos: string;
  intervalos: string;
  flexibilidade: string;
  estudosMelodicos: string;
  faseOrquestra: 1 | 2 | 3 | 4;
  nivelEstimado: 'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado';
}

export interface OrnamentoTrompeteAlmeidaDias {
  nome: string;
  tipo: 'Appoggiatura' | 'Trinado' | 'Mordente' | 'Grupeto';
  execucao: string;
  regraValor: string;
  exemplo: string;
  orientacaoAutor: string;
}

// ----------------------------------------------------------------------
// MÉTODO PROGRESSIVO DE CLARINETE (GIAMPIERI) - SISTEMA BÖHM
// ----------------------------------------------------------------------

export interface ExercicioClarineteGiampieri {
  id: string;
  numero: number;
  modulo: 'Fundamentos & Posição de Dita' | 'Intervalos (Salti)' | 'Estudos Rítmicos & Mecanismo' | 'Extensão Aguda & Expressão' | 'Escala Cromática & Posições' | 'Posições Duplicadas & Arpejos' | 'Scale Diatoniche e Arpeggi (24 Tonalidades)' | 'Studi Progressivi' | 'Extensione Acuta & Scale 3 Oitavas' | 'Studio degli Abbellimenti (Ornamentos)' | 'Studio dello Staccato' | 'Studio del Trasporto (Transporte)';
  pagina: number;
  fase: number; // 1 to 30
  faseOrquestra: 1 | 2 | 3 | 4;
  instrumentoAplicavel: 'Clarinete em Si b' | 'Clarinete em Dó' | 'Clarinete em Lá' | 'Clarinete Alto / Baixo / Requinto';
  titulo: string;
  tonalidade: string;
  compasso: string;
  andamento: string;
  nivel: 'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado';
  conceitos: string[];
  dificuldades: string[];
  prerequisitos: string[];
  tecnicaPrincipal: string;
  habilidadeDesenvolvida: string;
  tempoEstimadoMinutos: number;
  sugestaoContinuidade: string;
  compositor?: string;
  descricao: string;
  posicaoMecanicaChaves?: string;
}

export interface SecaoPedagogicaClarineteGiampieri {
  moduloNumero: number;
  titulo: string;
  paginas: string;
  descricao: string;
  objetivos: string[];
  fundamentosTecnicos: string[];
  conceitosMusicais: string[];
  orientacoesAutor: string[];
  dificuldadesRecorrentes: string[];
}

export interface FundamentoClarineteGiampieri {
  categoria: string;
  subtitulo: string;
  conteudo: string;
  pontosChave: string[];
  orientacaoProfessor: string;
}

export interface OrnamentoClarineteGiampieri {
  nome: string;
  tipo: 'Appoggiatura' | 'Acciaccatura' | 'Mordente' | 'Gruppeto' | 'Trillo' | 'Semitrillo';
  execucao: string;
  regraValor: string;
  exemplo: string;
}

export interface TransporteClarineteGiampieri {
  clarineteOrigem: 'Clarinete em Si b';
  partituraAlvo: 'Clarinete em Dó' | 'Clarinete em Lá';
  intervaloTransporte: string;
  claveUtilizada: string;
  ajusteArmadura: string;
  regrasPraticas: string[];
}

export * from './types/auth';







