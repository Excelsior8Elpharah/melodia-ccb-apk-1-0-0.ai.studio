/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Melodia CCB - Base de Dados Histórica Simulado (2024 - 2026)
 * Simula uma instituição em pleno funcionamento contínuo desde Janeiro de 2024.
 */

import { Pessoa, Turma, Aula, Escala, DiarioRegistro, MaterialCatalogo } from '../types';

export const INSTRUMENTOS_PREDEFINIDOS = [
  // Cordas e Teclado
  { nome: 'Violino', familia: 'Cordas e Teclado', naipe: 'Agudo' },
  { nome: 'Viola', familia: 'Cordas e Teclado', naipe: 'Médio' },
  { nome: 'Violoncelo', familia: 'Cordas e Teclado', naipe: 'Grave' },
  { nome: 'Órgão Eletrônico', familia: 'Cordas e Teclado', naipe: 'Médio', observacao: 'Tocado exclusivamente por mulheres' },
  
  // Madeiras
  { nome: 'Flauta Transversal', familia: 'Madeiras', naipe: 'Agudo' },
  { nome: 'Clarinete', familia: 'Madeiras', naipe: 'Médio' },
  { nome: 'Oboé', familia: 'Madeiras', naipe: 'Agudo' },
  { nome: 'Fagote', familia: 'Madeiras', naipe: 'Grave' },
  { nome: 'Clarone (Mib / Sib)', familia: 'Madeiras', naipe: 'Grave' },
  { nome: 'Saxofone Soprano', familia: 'Madeiras', naipe: 'Agudo' },
  { nome: 'Saxofone Alto', familia: 'Madeiras', naipe: 'Médio' },
  { nome: 'Saxofone Tenor', familia: 'Madeiras', naipe: 'Grave' },
  { nome: 'Saxofone Barítono / Baixo', familia: 'Madeiras', naipe: 'Grave' },

  // Metais
  { nome: 'Trompete', familia: 'Metais', naipe: 'Agudo' },
  { nome: 'Flugelhorn', familia: 'Metais', naipe: 'Agudo' },
  { nome: 'Trompa', familia: 'Metais', naipe: 'Médio' },
  { nome: 'Trombone', familia: 'Metais', naipe: 'Grave' },
  { nome: 'Eufônio (Bombardino)', familia: 'Metais', naipe: 'Grave' },
  { nome: 'Barítono', familia: 'Metais', naipe: 'Médio' },
  { nome: 'Tuba', familia: 'Metais', naipe: 'Grave' }
] as const;

// CATALOGO DE MATERIAIS E METODOS
export const MOCK_CATALOGO: MaterialCatalogo[] = [
  // Método P. BONA - Base Indexada
  { id: 'cat1', nome: 'BONA Ex. 1 a 5 – Escalas e Divisão Binária (Pág. 7)', instrumento: 'Geral', fase: 1, tipo: 'Teoria', metodo: 'P. BONA (Divisão)', descricao: 'Escalas de semibreves a semicolcheias em 4/4. Leitura e marcação de pulso.' },
  { id: 'cat2', nome: 'BONA Ex. 6 a 23 – Saltos de Intervalos de 3ª a 8ª (Págs. 7-9)', instrumento: 'Geral', fase: 1, tipo: 'Técnica', metodo: 'P. BONA (Divisão)', descricao: 'Estudo de audilização e afinação de intervalos disjuntos em Dó Maior.' },
  { id: 'cat3', nome: 'BONA Ex. 42 a 45 – Ritmo Acéfalo & Contratempos (Págs. 12-13)', instrumento: 'Geral', fase: 2, tipo: 'Teoria', metodo: 'P. BONA (Divisão)', descricao: 'Entradas precisas na parte fraca do tempo e alternância com ritmo tético.' },
  { id: 'cat3b', nome: 'BONA Ex. 53 a 60 – Ponto de Aumento & Ligadura de Valor (Págs. 14-15)', instrumento: 'Geral', fase: 2, tipo: 'Teoria', metodo: 'P. BONA (Divisão)', descricao: 'Divisão exata de ritmo pontuado simples/dobrado e notas sustentadas.' },
  { id: 'cat3c', nome: 'BONA Ex. 61 a 66 – Estudo da Síncopa Regular e Irregular (Págs. 16-17)', instrumento: 'Geral', fase: 2, tipo: 'Teoria', metodo: 'P. BONA (Divisão)', descricao: 'Deslocamento de acentos métricos e sustentação do tempo fraco para o forte.' },
  { id: 'cat3d', nome: 'BONA Ex. 75 & 76 – Tresquiálteras / Tercinas (Pág. 19)', instrumento: 'Geral', fase: 3, tipo: 'Teoria', metodo: 'P. BONA (Divisão)', descricao: 'Grupos ternários (3 notas em 1 tempo) em Dó Maior e Lá Menor.' },
  { id: 'cat3e', nome: 'BONA Ex. 85 a 90 – Compassos Compostos 6/8, 9/8, 12/8 (Págs. 24-26)', instrumento: 'Geral', fase: 3, tipo: 'Teoria', metodo: 'P. BONA (Divisão)', descricao: 'Subdivisão de unidade de tempo em 3 partes e andamentos compostos.' },

  // Violino - A. SCHMOLL & Galamian
  { id: 'sch1', nome: 'SCHMOLL Ex. 1 a 8 – Cordas Soltas, Postura & Sinais de Arcadas', instrumento: 'Violino', fase: 1, tipo: 'Técnica', metodo: 'A. Schmoll', descricao: 'Fundamentos de violino, pegada no arco e afinação por bicordes.' },
  { id: 'sch2', nome: 'SCHMOLL Ex. 9 a 24 – 1ª Posição, Dedilhado & Semitoniais', instrumento: 'Violino', fase: 1, tipo: 'Técnica', metodo: 'A. Schmoll', descricao: 'Desenvolvimento dos dedos 1, 2, 3 e 4 nas 4 cordas.' },
  { id: 'sch3', nome: 'SCHMOLL Ex. 38 a 43 – Staccato, Trêmolo e Variações de Arcada', instrumento: 'Violino', fase: 2, tipo: 'Técnica', metodo: 'A. Schmoll', descricao: 'Variantes de arcada no meio do arco e articulação de pulso.' },
  { id: 'sch4', nome: 'SCHMOLL Ex. 124 a 150 – 3ª Posição e Mudança de 1ª para 3ª Posição', instrumento: 'Violino', fase: 3, tipo: 'Técnica', metodo: 'A. Schmoll', descricao: 'Fixação da mão na 3ª posição e transições deslizantes.' },
  { id: 'sch5', nome: 'GALAMIAN – Escalas e Arpejos em 3 Oitavas', instrumento: 'Violino', fase: 4, tipo: 'Técnica', metodo: 'Galamian', descricao: 'Estudo avançado de afinação e trocas de posição rápidas.' },

  // Clarinete - Giampieri & Klosé
  { id: 'giamp1', nome: 'GIAMPIERI Pág. 2 Ex. 1 a 5 – Posição e Ataque de Língua', instrumento: 'Clarinete', fase: 1, tipo: 'Técnica', metodo: 'Giampieri (Clarinete)', descricao: 'Fundamentos de posição no registro Chalumeau.' },
  { id: 'giamp2', nome: 'GIAMPIERI Pág. 5 – Chave de Registro nº 12 & Passagem Lá-Si', instrumento: 'Clarinete', fase: 2, tipo: 'Técnica', metodo: 'Giampieri (Clarinete)', descricao: 'Quebra de registro e afinação do registro Clarim.' },
  { id: 'giamp3', nome: 'GIAMPIERI Págs. 40-44 – Scale Diatoniche e Arpeggi (24 Tonalidades)', instrumento: 'Clarinete', fase: 3, tipo: 'Técnica', metodo: 'Giampieri (Clarinete)', descricao: 'Compêndio de todas as escalas maiores e menores.' },

  // Metais - Almeida Dias & Arban
  { id: 'metais1', nome: 'ALMEIDA DIAS METAIS Ex. 1 a 5 – Tabela de Harmônicos & Posições', instrumento: 'Metais Graves (Tuba/Eufônio/Trombone)', fase: 1, tipo: 'Técnica', metodo: 'Almeida Dias (Metais Graves)', descricao: 'Execução das posições de vara e combinações de pistos.' },
  { id: 'metais2', nome: 'ALMEIDA DIAS METAIS Módulo 5 – Flexibilidade Labial (Lip Slurs)', instrumento: 'Metais Graves (Tuba/Eufônio/Trombone)', fase: 3, tipo: 'Técnica', metodo: 'Almeida Dias (Metais Graves)', descricao: 'Ligadura de harmônicos por controle de velocidade do ar.' },
  { id: 'trompete1', nome: 'ALMEIDA DIAS TROMPETE Módulo 3 – 12 Escalas e Arpejos', instrumento: 'Trompete / Cornet / Flugelhorn', fase: 2, tipo: 'Técnica', metodo: 'Almeida Dias (Trompete)', descricao: 'Escalas maiores e relativas menores com variações de articulação.' },

  // Repertório Oficial
  { id: 'cat10', nome: 'Hino 245 – Resgatado fomos por Seu Amor', instrumento: 'Geral', fase: 3, tipo: 'Repertório', metodo: 'Hino Oficial', descricao: 'Estudo de vozes, dinâmicas p e f, e afinação em naipe.' },
  { id: 'cat11', nome: 'Hino 320 – Que prazer é andar com Cristo', instrumento: 'Geral', fase: 3, tipo: 'Repertório', metodo: 'Hino Oficial', descricao: 'Interpretação e equilíbrio de timbres na orquestra.' },
  { id: 'cat12', nome: 'Hino 01 – Cristo meu Mestre', instrumento: 'Geral', fase: 4, tipo: 'Repertório', metodo: 'Hino Oficial', descricao: 'Repertório solene de abertura para cultos e concertos.' }
];

export const DEFAULT_CHURCH_LOCALITY = {
  nomeIgreja: 'Congregação Cristã no Brasil - Jardim Maria Rosa',
  comumCongregacao: 'Jardim Maria Rosa - Taboão da Serra - SP',
  bairro: 'Jardim Maria Rosa',
  cidade: 'Taboão da Serra',
  uf: 'SP',
  logradouroResumido: 'Jardim Maria Rosa, Taboão da Serra'
};

// HISTÓRICO DE PESSOAS (PROFESSORES, MÚSICOS E ALUNOS COM TRAJETÓRIAS ÚNICAS)
const BASE_PESSOAS: Pessoa[] = [
  // PROFESSORES (Diferentes níveis de experiência de 6 a 32 anos)
  {
    id: 'p1',
    nome: 'Maestro Alexandre Silva',
    tipo: 'Professor',
    instrumento: 'Violino',
    status: 'Ativo',
    telefone: '(11) 98765-4321',
    email: 'alexandre.silva@melodiaccb.org',
    dataNascimento: '1972-04-12',
    observacoes: 'Regente titular e coordenador geral de cordas. 32 anos de experiência musical. Admitido em Jan/2024.'
  },
  {
    id: 'p2',
    nome: 'Prof. Bernardo Cavalcante',
    tipo: 'Professor',
    instrumento: 'Clarinete',
    status: 'Ativo',
    telefone: '(11) 97654-3210',
    email: 'bernardo.cavalcante@melodiaccb.org',
    dataNascimento: '1984-11-22',
    observacoes: 'Especialista em Madeiras e clarinetista spalla. 21 anos de carreira. Admitido em Jan/2024.'
  },
  {
    id: 'p3',
    nome: 'Prof. Carlos Eduardo Souza',
    tipo: 'Professor',
    instrumento: 'Trompete',
    status: 'Ativo',
    telefone: '(11) 96543-2109',
    email: 'carlos.souza@melodiaccb.org',
    dataNascimento: '1980-08-30',
    observacoes: 'Coordenador do naipe de metais. 18 anos de docência musical. Admitido em Jan/2024.'
  },
  {
    id: 'p4',
    nome: 'Prof. Sérgio Mendonça',
    tipo: 'Professor',
    instrumento: 'Flauta Transversal',
    status: 'Ativo',
    telefone: '(11) 95432-8877',
    email: 'sergio.mendonca@melodiaccb.org',
    dataNascimento: '1990-03-15',
    observacoes: 'Professor de Flauta e Teoria Musical. 12 anos de experiência. Admitido em Jul/2024.'
  },
  {
    id: 'p5',
    nome: 'Prof. Marcos Aurélio Prado',
    tipo: 'Professor',
    instrumento: 'Trombone',
    status: 'Ativo',
    telefone: '(11) 94321-7766',
    email: 'marcos.prado@melodiaccb.org',
    dataNascimento: '1976-09-08',
    observacoes: 'Especialista em metais graves (Trombone, Tuba e Euphonium). 26 anos de atuação. Admitido em Jan/2025.'
  },
  {
    id: 'p6',
    nome: 'Profª Helena Viana',
    tipo: 'Professor',
    instrumento: 'Órgão Eletrônico',
    status: 'Ativo',
    telefone: '(11) 93210-6655',
    email: 'helena.viana@melodiaccb.org',
    dataNascimento: '1996-05-18',
    observacoes: 'Instrutora de Órgão e Teclados. 6 anos de experiência pedagógica. Admitida em Jan/2026.'
  },

  // MÚSICOS OFICIAIS ATIVOS DA ORQUESTRA (20 MÚSICOS ATIVOS)
  // 6 Violinos (Homens)
  {
    id: 'm1',
    nome: 'Daniel Meireles',
    tipo: 'Musico',
    instrumento: 'Violino',
    status: 'Ativo',
    telefone: '(11) 95432-1098',
    email: 'daniel.violino@gmail.com',
    dataNascimento: '1995-02-14',
    observacoes: 'Spalla da Orquestra e 1º Violino.'
  },
  {
    id: 'm2',
    nome: 'Marcos Vinicius',
    tipo: 'Musico',
    instrumento: 'Violino',
    status: 'Ativo',
    telefone: '(11) 95432-2211',
    email: 'marcos.v.violino@gmail.com',
    dataNascimento: '1996-08-10',
    observacoes: '1º Violino solista.'
  },
  {
    id: 'm3',
    nome: 'Alan Barbosa',
    tipo: 'Musico',
    instrumento: 'Violino',
    status: 'Ativo',
    telefone: '(11) 95432-3322',
    email: 'alan.violino@gmail.com',
    dataNascimento: '1998-11-05',
    observacoes: '2º Violino principal.'
  },
  {
    id: 'm4',
    nome: 'Pedro Henrique Souza',
    tipo: 'Musico',
    instrumento: 'Violino',
    status: 'Ativo',
    telefone: '(11) 95432-4433',
    email: 'pedro.h.violino@gmail.com',
    dataNascimento: '1997-03-21',
    observacoes: '2º Violino tutti.'
  },
  {
    id: 'm5',
    nome: 'Camilo Vasconcelos',
    tipo: 'Musico',
    instrumento: 'Violino',
    status: 'Ativo',
    telefone: '(11) 95432-5544',
    email: 'camilo.v.violino@gmail.com',
    dataNascimento: '2000-01-15',
    observacoes: '2º Violino tutti.'
  },
  {
    id: 'm6',
    nome: 'Thiago Siqueira',
    tipo: 'Musico',
    instrumento: 'Violino',
    status: 'Ativo',
    telefone: '(11) 95432-6655',
    email: 'thiago.s.violino@gmail.com',
    dataNascimento: '1999-07-29',
    observacoes: '2º Violino tutti.'
  },

  // 2 Flautas (Homens)
  {
    id: 'm7',
    nome: 'Fernando Lima',
    tipo: 'Musico',
    instrumento: 'Flauta Transversal',
    status: 'Ativo',
    telefone: '(11) 93210-9876',
    email: 'fernando.flauta@gmail.com',
    dataNascimento: '1999-09-05',
    observacoes: '1ª Flauta solista da orquestra.'
  },
  {
    id: 'm8',
    nome: 'Gabriel Nogueira',
    tipo: 'Musico',
    instrumento: 'Flauta Transversal',
    status: 'Ativo',
    telefone: '(11) 93210-8877',
    email: 'gabriel.flauta@gmail.com',
    dataNascimento: '2001-04-18',
    observacoes: '2ª Flauta todos os cultos.'
  },

  // 2 Clarinetes (Homens)
  {
    id: 'm9',
    nome: 'Samuel Albuquerque',
    tipo: 'Musico',
    instrumento: 'Clarinete',
    status: 'Ativo',
    telefone: '(11) 97766-1122',
    email: 'samuel.clarinete@gmail.com',
    dataNascimento: '1994-06-12',
    observacoes: 'Clarinete spalla das madeiras.'
  },
  {
    id: 'm10',
    nome: 'Roberto Fonseca',
    tipo: 'Musico',
    instrumento: 'Clarinete',
    status: 'Ativo',
    telefone: '(11) 97766-2233',
    email: 'roberto.fonseca@gmail.com',
    dataNascimento: '1993-10-30',
    observacoes: '2º Clarinete tutti.'
  },

  // 3 Saxofones (Homens)
  {
    id: 'm11',
    nome: 'Gabriel Ramos',
    tipo: 'Musico',
    instrumento: 'Saxofone Alto',
    status: 'Ativo',
    telefone: '(11) 97877-6655',
    email: 'gabriel.saxalto@gmail.com',
    dataNascimento: '1996-11-11',
    observacoes: '1º Saxofone Alto spalla.'
  },
  {
    id: 'm12',
    nome: 'André Luiz Machado',
    tipo: 'Musico',
    instrumento: 'Saxofone Tenor',
    status: 'Ativo',
    telefone: '(11) 97877-7788',
    email: 'andre.saxtenor@gmail.com',
    dataNascimento: '1992-05-24',
    observacoes: 'Saxofone Tenor principal.'
  },
  {
    id: 'm13',
    nome: 'Lucas Bernardes',
    tipo: 'Musico',
    instrumento: 'Saxofone Soprano',
    status: 'Ativo',
    telefone: '(11) 97877-8899',
    email: 'lucas.saxsoprano@gmail.com',
    dataNascimento: '1995-12-08',
    observacoes: 'Saxofone Soprano regente auxiliar.'
  },

  // 1 Órgão Eletrônico (Mulher)
  {
    id: 'm14',
    nome: 'Isadora Rocha',
    tipo: 'Musico',
    instrumento: 'Órgão Eletrônico',
    status: 'Ativo',
    telefone: '(11) 90987-6543',
    email: 'isadora.orgao@gmail.com',
    dataNascimento: '1994-01-25',
    observacoes: 'Organista titular nos cultos de domingo e ensaios.'
  },

  // Metais e Sopro Completando os 20 Músicos Ativos (Homens)
  {
    id: 'm15',
    nome: 'Matheus Oliveira',
    tipo: 'Musico',
    instrumento: 'Trompete',
    status: 'Ativo',
    telefone: '(11) 91098-7654',
    email: 'matheus.trump@gmail.com',
    dataNascimento: '1997-06-30',
    observacoes: '1º Trompete spalla dos metais.'
  },
  {
    id: 'm16',
    nome: 'Lucas Paiva',
    tipo: 'Musico',
    instrumento: 'Trompete',
    status: 'Ativo',
    telefone: '(11) 91098-8877',
    email: 'lucas.p.trompete@gmail.com',
    dataNascimento: '1998-08-14',
    observacoes: '2º Trompete de suporte harmônico.'
  },
  {
    id: 'm17',
    nome: 'Eduardo Gouveia',
    tipo: 'Musico',
    instrumento: 'Eufônio (Bombardino)',
    status: 'Ativo',
    telefone: '(11) 94321-0987',
    email: 'edu.gouveia@yahoo.com.br',
    dataNascimento: '1992-07-19',
    observacoes: 'Eufônio solo e contra-canto da orquestra.'
  },
  {
    id: 'm18',
    nome: 'Gabriel Pires',
    tipo: 'Musico',
    instrumento: 'Trombone',
    status: 'Ativo',
    telefone: '(11) 92109-8765',
    email: 'gabriel.trombone@hotmail.com',
    dataNascimento: '1990-12-01',
    observacoes: '1º Trombone principal e arranjador.'
  },
  {
    id: 'm19',
    nome: 'Henrique Prado',
    tipo: 'Musico',
    instrumento: 'Trombone',
    status: 'Ativo',
    telefone: '(11) 92109-1122',
    email: 'henrique.trombone@gmail.com',
    dataNascimento: '1994-09-02',
    observacoes: '2º Trombone tenor.'
  },
  {
    id: 'm20',
    nome: 'Rodrigo Peixoto',
    tipo: 'Musico',
    instrumento: 'Tuba',
    status: 'Ativo',
    telefone: '(11) 92109-9900',
    email: 'rodrigo.tuba@gmail.com',
    dataNascimento: '1988-04-17',
    observacoes: 'Tuba Sib fundamentação harmônica e baixo orquestral.'
  },

  // TURMA DE ALUNOS 2024 (Iniciaram em 2024 e evoluíram ao longo dos anos)
  {
    id: 'a1',
    nome: 'Juliana Ribeiro',
    tipo: 'Aluno',
    instrumento: 'Órgão Eletrônico',
    status: 'Ativo',
    telefone: '(11) 99888-7766',
    email: 'juliana.rib@gmail.com',
    dataNascimento: '2008-06-15',
    fase: 4,
    observacoes: 'Matriculada em Jan/2024 (Iniciante no Órgão Eletrônico). Promovida a Intermediário em Nov/2024 e Avançado em Jan/2026. Excelente técnica de pedaleira e registração.',
    lgpdConsent: {
      consentimentoConcedido: true,
      dataConsentimento: '2024-01-20T14:30:00Z',
      nomeResponsavelLegal: 'Marise Santos Ribeiro',
      parentescoResponsavel: 'MAE',
      cpfResponsavel: '234.567.890-12',
      autorizacaoUsoImagemEAudio: true,
      versaoTermoAceito: '1.0-2026'
    }
  },
  {
    id: 'a2',
    nome: 'Lucas Monteiro',
    tipo: 'Aluno',
    instrumento: 'Violino',
    status: 'Ativo',
    telefone: '(11) 98877-6655',
    email: 'lucas.monte@hotmail.com',
    dataNascimento: '2007-01-20',
    fase: 3,
    observacoes: 'Matriculado em Fev/2024. Passou para a turma Intermediária em Mai/2025. Boa postura e evolução rítmica regular.',
    lgpdConsent: {
      consentimentoConcedido: true,
      dataConsentimento: '2024-02-10T10:15:00Z',
      nomeResponsavelLegal: 'Carlos Alberto Monteiro',
      parentescoResponsavel: 'PAI',
      cpfResponsavel: '345.678.901-23',
      autorizacaoUsoImagemEAudio: true,
      versaoTermoAceito: '1.0-2026'
    }
  },
  {
    id: 'a3',
    nome: 'Mário Costa',
    tipo: 'Aluno',
    instrumento: 'Clarinete',
    status: 'Ativo',
    telefone: '(11) 97766-5544',
    email: 'mario.costa@gmail.com',
    dataNascimento: '2010-10-31',
    fase: 3,
    observacoes: 'Matriculado em Jan/2024. Excelente controle de coluna de ar. Passou do registro Chalumeau para Clarim em Abr/2025.'
  },
  {
    id: 'a4',
    nome: 'Nicolas Santos',
    tipo: 'Aluno',
    instrumento: 'Trompete',
    status: 'Ativo',
    telefone: '(11) 96655-4433',
    email: 'nicolas.santos@gmail.com',
    dataNascimento: '2009-08-08',
    fase: 3,
    observacoes: 'Matriculado em Mar/2024. Desenvolveu boa flexibilidade labial ao longo de 2025, ritmo no cronograma.'
  },
  {
    id: 'a5',
    nome: 'Otávio Melo',
    tipo: 'Aluno',
    instrumento: 'Tuba',
    status: 'Em Observação',
    telefone: '(11) 95544-3322',
    email: 'otavio.tuba@gmail.com',
    dataNascimento: '2006-03-12',
    fase: 2,
    observacoes: 'Matriculado em Mai/2024. Bom som no registro grave, mas apresenta sérias dificuldades no método Bona (divisão de tempo e teoria musical).'
  },
  {
    id: 'a6',
    nome: 'Camilla Duarte',
    tipo: 'Aluno',
    instrumento: 'Órgão Eletrônico',
    status: 'Ativo',
    telefone: '(11) 94433-2211',
    email: 'camilla.duarte@gmail.com',
    dataNascimento: '2005-04-18',
    fase: 3,
    observacoes: 'Matriculada em Jan/2024. Concluiu estudos de pedaleira e registro médio no final de 2025. Assídua e dedicada.'
  },
  {
    id: 'a7',
    nome: 'Thiago Neves',
    tipo: 'Aluno',
    instrumento: 'Flauta Transversal',
    status: 'Em Observação',
    telefone: '(11) 93322-1100',
    email: 'thiago.flauta@gmail.com',
    dataNascimento: '2008-12-05',
    fase: 3,
    observacoes: 'Matriculado em Ago/2024. Teve queda acentuada de frequência no último semestre por motivos de trabalho/escola; em risco de atraso na oficialização.'
  },

  // TURMA DE ALUNOS 2025 (Ingressaram em 2025)
  {
    id: 'a8',
    nome: 'Bruno Castro',
    tipo: 'Aluno',
    instrumento: 'Trombone',
    status: 'Ativo',
    telefone: '(11) 92211-0099',
    email: 'bruno.castro@gmail.com',
    dataNascimento: '2007-09-14',
    fase: 2,
    observacoes: 'Ingressou em Jan/2025. Boa afinação e precisão de vara nas 7 posições.'
  },
  {
    id: 'a9',
    nome: 'Lauro Martins',
    tipo: 'Aluno',
    instrumento: 'Saxofone Alto',
    status: 'Ativo',
    telefone: '(11) 91100-9988',
    email: 'lauro.sax@gmail.com',
    dataNascimento: '2009-02-28',
    fase: 2,
    observacoes: 'Ingressou em Mar/2025 na turma de Saxofone Alto. Boa embocadura mas trava na leitura à primeira vista (toca de ouvido).'
  },
  {
    id: 'a10',
    nome: 'Vinicius Xavier',
    tipo: 'Aluno',
    instrumento: 'Violino',
    status: 'Em Observação',
    telefone: '(11) 90099-8877',
    email: 'vini.xavier@gmail.com',
    dataNascimento: '2011-07-07',
    fase: 2,
    observacoes: 'Ingressou em Mai/2025. Faltas recorrentes aos sábados prejudicando a fixação dos golpes de arco do método Schmoll.'
  },
  {
    id: 'a11',
    nome: 'Armando Fonseca',
    tipo: 'Aluno',
    instrumento: 'Clarinete',
    status: 'Ativo',
    telefone: '(11) 98988-7766',
    email: 'armando.fonseca@gmail.com',
    dataNascimento: '2010-04-03',
    fase: 2,
    observacoes: 'Ingressou em Jul/2025. Bom senso rítmico, mas enfrenta gargalo técnico de quebra de boquilha e afinação nas notas agudas.'
  },
  {
    id: 'a12',
    nome: 'Gabriel Ramos Jr.',
    tipo: 'Aluno',
    instrumento: 'Saxofone Tenor',
    status: 'Ativo',
    telefone: '(11) 97877-6655',
    email: 'gabriel.ramos.jr@gmail.com',
    dataNascimento: '2006-11-11',
    fase: 2,
    observacoes: 'Ingressou em Out/2025. Domínio intermediário das escalas do método Almeida Dias Sax.'
  },
  {
    id: 'a13',
    nome: 'Felipe Barreto',
    tipo: 'Aluno',
    instrumento: 'Violino',
    status: 'Ativo',
    telefone: '(11) 96766-5544',
    email: 'felipe.barreto@gmail.com',
    dataNascimento: '2004-08-20',
    fase: 4,
    observacoes: 'Ingressou em Fev/2025 com bagagem prévia. Rendimento e assiduidade exemplares (98%), pronto para exame de oficialização.'
  },

  // TURMA DE ALUNOS 2026 (Ingressos recentes em 2026 e perfis variados)
  {
    id: 'a14',
    nome: 'Caio Lucca',
    tipo: 'Aluno',
    instrumento: 'Violino',
    status: 'Ativo',
    telefone: '(11) 95655-4433',
    email: 'caio.lucca@gmail.com',
    dataNascimento: '2012-03-01',
    fase: 1,
    observacoes: 'Ingressou em Jan/2026. Muito assíduo (92%), mas ritmo de aprendizado mais lento; necessita de paciência na postura da mão esquerda.'
  },
  {
    id: 'a15',
    nome: 'Laerte Viana',
    tipo: 'Aluno',
    instrumento: 'Trompete',
    status: 'Em Observação',
    telefone: '(11) 94544-3322',
    email: 'laerte.viana@gmail.com',
    dataNascimento: '2011-09-19',
    fase: 1,
    observacoes: 'Ingressou em Fev/2026. Frequência baixa (52%) e pouca prática em casa; ainda não fixou digitação básica dos pistos.'
  },
  {
    id: 'a16',
    nome: 'Enzo Gabriel',
    tipo: 'Aluno',
    instrumento: 'Eufônio (Bombardino)',
    status: 'Em Observação',
    telefone: '(11) 93433-2211',
    email: 'enzo.gabriel@gmail.com',
    dataNascimento: '2010-06-25',
    fase: 1,
    observacoes: 'Ingressou em Mar/2026. Faltas crônicas (presença 44%) e notas críticas; risco de cancelamento de matrícula por descontinuidade.'
  },
  {
    id: 'a17',
    nome: 'Sophia Rodrigues',
    tipo: 'Aluno',
    instrumento: 'Órgão Eletrônico',
    status: 'Ativo',
    telefone: '(11) 92322-1100',
    email: 'sophia.rodrigues@gmail.com',
    dataNascimento: '2013-01-10',
    fase: 1,
    observacoes: 'Ingressou em Mai/2026. Excelente aproveitamento inicial no órgão e solfejo; muito disciplinada.'
  },
  {
    id: 'a18',
    nome: 'Igor Ferreira',
    tipo: 'Aluno',
    instrumento: 'Clarinete',
    status: 'Afastado',
    telefone: '(11) 90987-6543',
    email: 'igor.ferreira@outlook.com',
    dataNascimento: '1987-03-11',
    fase: 2,
    observacoes: 'Afastado temporariamente em Jun/2025 por razões médicas (cirurgia ortopédica); retorno previsto para o próximo ano letivo.'
  },
  {
    id: 'a19',
    nome: 'Samuel Paiva',
    tipo: 'Aluno',
    instrumento: 'Trombone',
    status: 'Em Observação',
    telefone: '(11) 91234-5678',
    email: 'samuel.paiva@gmail.com',
    dataNascimento: '2008-05-14',
    fase: 2,
    observacoes: 'Ingressou em Jul/2025. Excelente som no trombone, mas sofre bloqueio rítmico no método Bona (notas 4.5 em ritmo), travando seu avanço.'
  },
  {
    id: 'a20',
    nome: 'Davi Albuquerque',
    tipo: 'Aluno',
    instrumento: 'Clarinete',
    status: 'Ativo',
    telefone: '(11) 98765-4321',
    email: 'davi.albuquerque@gmail.com',
    dataNascimento: '2011-04-12',
    fase: 1,
    observacoes: 'Ingressou em Jan/2026. Progresso acelerado nas escalas e embocadura com ótima assiduidade (94%).'
  },
  {
    id: 'a21',
    nome: 'Raquel Antunes',
    tipo: 'Aluno',
    instrumento: 'Órgão Eletrônico',
    status: 'Ativo',
    telefone: '(11) 97654-3210',
    email: 'raquel.antunes@gmail.com',
    dataNascimento: '2009-11-23',
    fase: 1,
    observacoes: 'Ingressou em Fev/2026. Rendimento regular na iniciação ao teclado, iniciando exercícios de pedaleira.'
  },
  {
    id: 'a22',
    nome: 'Samuel Prado',
    tipo: 'Aluno',
    instrumento: 'Trompete',
    status: 'Ativo',
    telefone: '(11) 96543-2109',
    email: 'samuel.prado.trump@gmail.com',
    dataNascimento: '2005-02-17',
    fase: 4,
    observacoes: 'Matriculado em Jan/2024. Aluno avançado nos hinos a 4 vozes e método Almeida Dias; alta performance (92% pres., nota 9.1).'
  },
  {
    id: 'a23',
    nome: 'Beatriz Menezes',
    tipo: 'Aluno',
    instrumento: 'Violino',
    status: 'Ativo',
    telefone: '(11) 95432-1098',
    email: 'beatriz.violino@gmail.com',
    dataNascimento: '2008-09-03',
    fase: 2,
    observacoes: 'Ingressou em Ago/2025. Boa postura de arco e sonoridade limpa no método Schmoll.'
  },
  {
    id: 'a24',
    nome: 'Daniel Kuntz',
    tipo: 'Aluno',
    instrumento: 'Tuba',
    status: 'Em Observação',
    telefone: '(11) 94321-0987',
    email: 'daniel.kuntz.tuba@gmail.com',
    dataNascimento: '2007-12-19',
    fase: 1,
    observacoes: 'Ingressou em Jan/2026. Presença oscilante (62%) e fadiga prematura na sustentação de ar da tuba Sib.'
  }
];

export const MOCK_PESSOAS: Pessoa[] = BASE_PESSOAS.map((pessoa: Pessoa): Pessoa => ({
  ...pessoa,
  comumCongregacao: pessoa.comumCongregacao || DEFAULT_CHURCH_LOCALITY.comumCongregacao,
  bairro: pessoa.bairro || DEFAULT_CHURCH_LOCALITY.bairro,
  cidade: pessoa.cidade || DEFAULT_CHURCH_LOCALITY.cidade,
  uf: pessoa.uf || DEFAULT_CHURCH_LOCALITY.uf
}));

// TURMAS HISTÓRICAS (2024 - 2026) - TODAS NO SÁBADO (11:00 ÀS 14:00)
export const MOCK_TURMAS: Turma[] = [
  {
    id: 't1',
    nome: 'Iniciação ao Violino I',
    professorId: 'p1',
    instrumento: 'Violino',
    nivel: 'Iniciante',
    horario: 'Sábado - 11:00 às 12:00',
    alunosIds: ['a10', 'a14', 'a23']
  },
  {
    id: 't2',
    nome: 'Violino Intermediário & Avançado',
    professorId: 'p1',
    instrumento: 'Violino',
    nivel: 'Intermediário',
    horario: 'Sábado - 12:00 às 13:00',
    alunosIds: ['a2', 'a13']
  },
  {
    id: 't3',
    nome: 'Clarinete & Madeiras',
    professorId: 'p2',
    instrumento: 'Clarinete',
    nivel: 'Intermediário',
    horario: 'Sábado - 11:00 às 12:30',
    alunosIds: ['a3', 'a11', 'a18', 'a20']
  },
  {
    id: 't4',
    nome: 'Metais & Sopro (Trompete e Trombone)',
    professorId: 'p3',
    instrumento: 'Trompete',
    nivel: 'Intermediário',
    horario: 'Sábado - 12:30 às 14:00',
    alunosIds: ['a4', 'a8', 'a15', 'a19', 'a22']
  },
  {
    id: 't5',
    nome: 'Metais Graves (Eufônio e Tuba)',
    professorId: 'p5',
    instrumento: 'Tuba',
    nivel: 'Intermediário',
    horario: 'Sábado - 11:30 às 12:30',
    alunosIds: ['a5', 'a16', 'a24']
  },
  {
    id: 't6',
    nome: 'Flauta Transversal & Solfejo',
    professorId: 'p4',
    instrumento: 'Flauta Transversal',
    nivel: 'Intermediário',
    horario: 'Sábado - 12:30 às 13:30',
    alunosIds: ['a7']
  },
  {
    id: 't7',
    nome: 'Órgão Eletrônico e Teclados',
    professorId: 'p6',
    instrumento: 'Órgão Eletrônico',
    nivel: 'Iniciante',
    horario: 'Sábado - 11:00 às 12:30',
    alunosIds: ['a1', 'a6', 'a17', 'a21']
  },
  {
    id: 't8',
    nome: 'Prática de Orquestra e Repertório de Culto',
    professorId: 'p1',
    instrumento: 'Geral',
    nivel: 'Avançado',
    horario: 'Sábado - 12:30 às 14:00',
    alunosIds: ['a1', 'a2', 'a3', 'a4', 'a6', 'a8', 'a12', 'a13', 'a22']
  }
];

// GERADOR HISTÓRICO DE AULAS (JANEIRO DE 2024 ATÉ JULHO DE 2026)
// Perfis pedagógicos realistas e heterogêneos para cada aluno (evitando dados lineares)
interface StudentProfileConfig {
  targetPresenca: number;
  scores: {
    ritmo: number;
    tecnica: number;
    leitura: number;
    expressao: number;
    teoria: number;
  };
  trend: number;
  startYear?: number;
  startMonth?: number;
  endYear?: number;
  endMonth?: number;
  observations: string[];
}

const STUDENT_PROFILES: Record<string, StudentProfileConfig> = {
  a1: { // Juliana Ribeiro - Destaque absoluto Órgão Fase 4
    targetPresenca: 0.96,
    scores: { ritmo: 9.8, tecnica: 9.6, leitura: 9.5, expressao: 9.9, teoria: 9.5 },
    trend: 0.1,
    observations: [
      'Execução primorosa na pedaleira e registração solene.',
      'Domínio completo das 4 vozes do hinário com fraseado perfeito.',
      'Excelente maturidade musical; pronta para o teste de oficialização.'
    ]
  },
  a2: { // Lucas Monteiro - Violino Fase 3 regular
    targetPresenca: 0.84,
    scores: { ritmo: 7.8, tecnica: 7.5, leitura: 7.3, expressao: 8.0, teoria: 7.4 },
    trend: 0.25,
    observations: [
      'Boa postura de mão esquerda e afinação estável na 3ª posição.',
      'Evolução no método Schmoll; arcada firme no talão e meio do arco.',
      'Executou o hino com afinação limpa e dinâmica adequada.'
    ]
  },
  a3: { // Mário Costa - Clarinete Fase 3 bom
    targetPresenca: 0.89,
    scores: { ritmo: 8.4, tecnica: 8.2, leitura: 8.0, expressao: 8.5, teoria: 8.0 },
    trend: 0.3,
    observations: [
      'Controle exemplar de coluna de ar e apoio no diafragma.',
      'Passagem da quebra de registro sem estalos no método Giampieri.',
      'Boa sonoridade em naipe e equilíbrio com os trompetes.'
    ]
  },
  a4: { // Nicolas Santos - Trompete Fase 3 regular
    targetPresenca: 0.81,
    scores: { ritmo: 7.6, tecnica: 7.4, leitura: 7.2, expressao: 7.8, teoria: 7.1 },
    trend: 0.2,
    observations: [
      'Boa flexibilidade labial e ataques limpos sem forçar o bocal.',
      'Respiração diafragmática mais profunda, melhorando o volume.',
      'Leitura regular no método Almeida Dias Trompete.'
    ]
  },
  a5: { // Otávio Melo - Tuba Fase 2 com dificuldade rítmica/teórica
    targetPresenca: 0.71,
    scores: { ritmo: 5.2, tecnica: 7.0, leitura: 5.8, expressao: 6.7, teoria: 4.7 },
    trend: 0.15,
    observations: [
      'Bom timbre no registro grave da tuba, mas continua tropeçando no Bona.',
      'Dificuldade com síncopas e contratempos; necessita metrônomo urgente.',
      'Apresentou dúvidas conceituais na prova teórica de compassos.'
    ]
  },
  a6: { // Camilla Duarte - Órgão Fase 3 dedicada
    targetPresenca: 0.91,
    scores: { ritmo: 8.7, tecnica: 8.5, leitura: 8.6, expressao: 8.8, teoria: 8.4 },
    trend: 0.3,
    observations: [
      'Excelente sincronia de pedais com a mão esquerda.',
      'Acompanhamento solene e bom uso do pedal de expressão.',
      'Muito dedicada aos estudos domiciliares de registração.'
    ]
  },
  a7: { // Thiago Neves - Flauta Fase 3 com queda de frequência
    targetPresenca: 0.57,
    scores: { ritmo: 6.3, tecnica: 6.1, leitura: 6.0, expressao: 6.7, teoria: 5.8 },
    trend: -0.2,
    observations: [
      'Queda de rendimento notável decorrente das ausências consecutivas.',
      'Demonstra potencial na sonoridade, mas falta continuidade pedagógica.',
      'Em risco de atraso na conclusão da fase 3 caso as faltas persistam.'
    ]
  },
  a8: { // Bruno Castro - Trombone Fase 2 bom
    targetPresenca: 0.87,
    scores: { ritmo: 8.0, tecnica: 7.8, leitura: 7.5, expressao: 8.2, teoria: 7.6 },
    trend: 0.3,
    startYear: 2025,
    startMonth: 1,
    observations: [
      'Precisão de vara nas 7 posições e afinação homogênea.',
      'Ataque de língua staccato bem executado no método de metais.',
      'Participou com firmeza no naipe de trombones.'
    ]
  },
  a9: { // Lauro Martins - Sax Alto Fase 2 com trava na leitura
    targetPresenca: 0.80,
    scores: { ritmo: 7.5, tecnica: 7.8, leitura: 5.2, expressao: 7.6, teoria: 5.5 },
    trend: 0.2,
    startYear: 2025,
    startMonth: 3,
    observations: [
      'Toca de ouvido com facilidade, mas empaca para ler partitura à primeira vista.',
      'Necessita exercitar solfejo obrigatório sem o instrumento.',
      'Embocadura e afinação no registro médio estão boas.'
    ]
  },
  a10: { // Vinicius Xavier - Violino Fase 2 faltoso
    targetPresenca: 0.63,
    scores: { ritmo: 6.0, tecnica: 6.3, leitura: 5.8, expressao: 6.2, teoria: 5.5 },
    trend: 0.1,
    startYear: 2025,
    startMonth: 5,
    observations: [
      'Chegou atrasado e sem a lição estudada adequadamente.',
      'Tem boa capacidade manual, mas o acúmulo de faltas trava seu avanço.',
      'Recomendado reforço no método Schmoll aos sábados.'
    ]
  },
  a11: { // Armando Fonseca - Clarinete Fase 2 com problema de técnica/boquilha
    targetPresenca: 0.84,
    scores: { ritmo: 8.0, tecnica: 5.1, leitura: 6.8, expressao: 6.5, teoria: 7.5 },
    trend: 0.2,
    startYear: 2025,
    startMonth: 7,
    observations: [
      'Tensão na mandíbula causando apitos e quebras no registro Clarim.',
      'Orientado a trocar a palheta por nº 2.5 e relaxar a embocadura.',
      'Bom ritmo e leitura regular, gargalo exclusivo de emissão técnica.'
    ]
  },
  a12: { // Gabriel Ramos Jr. - Sax Tenor Fase 2 intermediário
    targetPresenca: 0.82,
    scores: { ritmo: 7.4, tecnica: 7.2, leitura: 7.1, expressao: 7.5, teoria: 7.0 },
    trend: 0.25,
    startYear: 2025,
    startMonth: 10,
    observations: [
      'Afinação estável no sax tenor e boa pegada nas chaves laterais.',
      'Evolução regular nas escalas de Sib e Mib Maior.',
      'Acompanhamento seguro nos hinos de jovens.'
    ]
  },
  a13: { // Felipe Barreto - Violino Fase 4 super destaque
    targetPresenca: 0.98,
    scores: { ritmo: 9.7, tecnica: 9.8, leitura: 9.6, expressao: 9.9, teoria: 9.6 },
    trend: 0.1,
    startYear: 2025,
    startMonth: 2,
    observations: [
      'Desempenho virtuosístico nos métodos e total domínio do hinário.',
      'Afinação precisa nas posições agudas e golpe de arco Spiccato perfeito.',
      'Apto para oficialização imediata perante o ministério.'
    ]
  },
  a14: { // Caio Lucca - Violino Fase 1 esforçado e lento
    targetPresenca: 0.92,
    scores: { ritmo: 6.2, tecnica: 6.5, leitura: 6.0, expressao: 6.4, teoria: 6.1 },
    trend: 0.3,
    startYear: 2026,
    startMonth: 1,
    observations: [
      'Muito dedicado e nunca falta, porém assimila os movimentos lentamente.',
      'Postura do polegar esquerdo corrigida com exercícios lentos.',
      'Progresso gradual e consistente na corda Lá e Ré.'
    ]
  },
  a15: { // Laerte Viana - Trompete Fase 1 faltoso e notas baixas
    targetPresenca: 0.52,
    scores: { ritmo: 5.0, tecnica: 5.4, leitura: 4.8, expressao: 5.5, teoria: 4.6 },
    trend: 0.05,
    startYear: 2026,
    startMonth: 2,
    observations: [
      'Pouco estudo domiciliar demonstrado; esquece as digitações de pistos.',
      'Faltas recorrentes impedem a fixação dos exercícios básicos.',
      'Pais alertados sobre a necessidade de compromisso aos sábados.'
    ]
  },
  a16: { // Enzo Gabriel - Eufônio Fase 1 crítico em risco
    targetPresenca: 0.44,
    scores: { ritmo: 4.5, tecnica: 4.8, leitura: 4.2, expressao: 4.9, teoria: 4.3 },
    trend: -0.1,
    startYear: 2026,
    startMonth: 3,
    observations: [
      'Mais uma ausência consecutiva; perdeu a matéria de escalas fundamentais.',
      'Em situação de alerta crítico por abandono pedagógico.',
      'Desempenho muito abaixo do padrão mínimo exigido na iniciação.'
    ]
  },
  a17: { // Sophia Rodrigues - Órgão Fase 1 brilhante
    targetPresenca: 0.95,
    scores: { ritmo: 8.6, tecnica: 8.5, leitura: 8.4, expressao: 8.8, teoria: 8.3 },
    trend: 0.4,
    startYear: 2026,
    startMonth: 5,
    observations: [
      'Iniciante com notável facilidade motora e sensibilidade musical.',
      'Mãos relaxadas e boa postura nas teclas do órgão.',
      'Evolução acima da média da turma nos estudos iniciais.'
    ]
  },
  a18: { // Igor Ferreira - Clarinete Fase 2 afastado por saúde
    targetPresenca: 0.26,
    scores: { ritmo: 4.8, tecnica: 5.0, leitura: 4.6, expressao: 5.1, teoria: 4.5 },
    trend: -0.2,
    endYear: 2025,
    endMonth: 6,
    observations: [
      'Afastado formalmente por atestado médico (cirurgia ortopédica).',
      'Cadastro em modo de espera para retomada no próximo período letivo.'
    ]
  },
  a19: { // Samuel Paiva - Trombone Fase 2 com bloqueio no Bona
    targetPresenca: 0.78,
    scores: { ritmo: 4.6, tecnica: 7.8, leitura: 6.0, expressao: 7.2, teoria: 5.2 },
    trend: 0.15,
    startYear: 2025,
    startMonth: 7,
    observations: [
      'Ótimo som e precisão mecânica no trombone, mas trava no método Bona.',
      'Dificuldade grave com síncopas e leitura de pausas métricas.',
      'Necessita reforço exclusivo de solfejo para não atrasar a fase.'
    ]
  },
  a20: { // Davi Albuquerque - Clarinete Fase 1 rápido
    targetPresenca: 0.94,
    scores: { ritmo: 8.8, tecnica: 8.6, leitura: 8.5, expressao: 8.9, teoria: 8.4 },
    trend: 0.3,
    startYear: 2026,
    startMonth: 1,
    observations: [
      'Progresso veloz nas primeiras lições do método Giampieri.',
      'Embocadura firme e sonoridade limpa desde os primeiros exercícios.',
      'Assíduo e participativo nos ensaios de conjunto.'
    ]
  },
  a21: { // Raquel Antunes - Órgão Fase 1 média regular
    targetPresenca: 0.76,
    scores: { ritmo: 6.8, tecnica: 6.5, leitura: 6.4, expressao: 7.0, teoria: 6.6 },
    trend: 0.2,
    startYear: 2026,
    startMonth: 2,
    observations: [
      'Rendimento mediano na iniciação às teclas superiores.',
      'Treinando independência motora para iniciar a pedaleira.',
      'Boa dedicação aos hinos mais lentos.'
    ]
  },
  a22: { // Samuel Prado - Trompete Fase 4 avançado
    targetPresenca: 0.93,
    scores: { ritmo: 9.2, tecnica: 9.4, leitura: 9.0, expressao: 9.5, teoria: 9.1 },
    trend: 0.2,
    observations: [
      'Liderança nos trompetes e som brilhante nos hinos oficiais.',
      'Execução impecável no método Almeida Dias Módulo 5.',
      'Pronto para compor a orquestra oficial nos cultos dominicais.'
    ]
  },
  a23: { // Beatriz Menezes - Violino Fase 2 regular boa
    targetPresenca: 0.86,
    scores: { ritmo: 7.8, tecnica: 8.0, leitura: 7.6, expressao: 8.2, teoria: 7.5 },
    trend: 0.25,
    startYear: 2025,
    startMonth: 8,
    observations: [
      'Belo golpe de arco Martelé no meio do arco no método Schmoll.',
      'Afinação consistente na escala de Ré Maior.',
      'Boa atenção e disciplina nos ensaios de naipe de cordas.'
    ]
  },
  a24: { // Daniel Kuntz - Tuba Fase 1 fadigado e presença instável
    targetPresenca: 0.62,
    scores: { ritmo: 5.4, tecnica: 5.2, leitura: 5.0, expressao: 5.8, teoria: 4.8 },
    trend: 0.1,
    startYear: 2026,
    startMonth: 1,
    observations: [
      'Fadiga precoce na emissão de ar da tuba Sib e presença irregular.',
      'Necessita de exercícios diários de apoio diafragmático.',
      'Apresenta desânimo nos exercícios rítmicos mais longos.'
    ]
  }
};

// Função pseudo-randômica determinística com seed para garantir dados consistentes e reprodutíveis
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateHistoricalAulas(): Aula[] {
  const aulas: Aula[] = [];
  let idCount = 1;

  // Lista de conteúdos progressivos por turma
  const conteudosPorTurma: Record<string, { conteudo: string; material: string }[]> = {
    t1: [
      { conteudo: 'Apresentação do Violino, postura de ombro e pegada no arco.', material: 'A. SCHMOLL Ex. 1 a 4' },
      { conteudo: 'Exercícios de cordas soltas com arcadas inteiras e metrônomo 60 bpm.', material: 'A. SCHMOLL Ex. 5 a 8' },
      { conteudo: 'Primeiras notas com 1º e 2º dedos na corda Lá e Ré.', material: 'A. SCHMOLL Ex. 9 a 12' },
      { conteudo: 'Estudo de semitons e afinação do 3º dedo.', material: 'A. SCHMOLL Ex. 15 a 18' },
      { conteudo: 'Leitura de notas na clave de Sol e divisão binária 4/4.', material: 'P. BONA Ex. 1 a 5' },
      { conteudo: 'Escala de Sol Maior em 1 oitava com arcadas ligadas de 2 em 2.', material: 'A. SCHMOLL Ex. 20 a 24' },
      { conteudo: 'Articulação de staccato e pequenas frases melódicas.', material: 'A. SCHMOLL Ex. 38 a 40' },
      { conteudo: 'Revisão geral de postura, afinação e avaliação de progresso semestral.', material: 'Ficha de Avaliação Prática' }
    ],
    t2: [
      { conteudo: 'Transição para a 3ª posição com 1º dedo guia e exercícios deslizantes.', material: 'A. SCHMOLL Ex. 124 a 130' },
      { conteudo: 'Estudo da síncopa regular e irregular em compassos simples.', material: 'P. BONA Ex. 61 a 66' },
      { conteudo: 'Escala de Ré Maior em 2 oitavas com mudanças de posição 1ª - 3ª.', material: 'Galamian Escalas Pág. 12' },
      { conteudo: 'Golpe de arco Martelé e Spiccato no meio do arco.', material: 'A. SCHMOLL Ex. 114 a 118' },
      { conteudo: 'Hino 245 - Leitura à primeira vista e afinação em naipe com dinâmica f e p.', material: 'Hino Oficial CCB 245' },
      { conteudo: 'Tercinas e compassos compostos 6/8 no método Bona.', material: 'P. BONA Ex. 75 a 80' },
      { conteudo: 'Hino 320 - Equilíbrio de timbres e articulação em grupo.', material: 'Hino Oficial CCB 320' },
      { conteudo: 'Preparação para o Recital Semestral e exames de nivelamento.', material: 'Repertório de Concerto' }
    ],
    t3: [
      { conteudo: 'Emissão sonora no registro Chalumeau e embocadura na boquilha.', material: 'GIAMPIERI Pág. 2 Ex. 1 a 5' },
      { conteudo: 'Uso da Chave de Registro nº 12 e passagem da quebra de registro Lá-Si.', material: 'GIAMPIERI Pág. 5 Ex. 8' },
      { conteudo: 'Escalas diatônicas nas tonalidades de Fá Maior e Do Maior.', material: 'GIAMPIERI Págs. 40-42' },
      { conteudo: 'Estudo do Hino 101 - Afinação do registro médio e apoio do diafragma.', material: 'Hino Oficial CCB 101' },
      { conteudo: 'Ataque de língua staccato leggerissimo e saltos de oitava.', material: 'GIAMPIERI Págs. 6-10' },
      { conteudo: 'Hino 245 - Interpretação de naipe com os trompetes.', material: 'Hino Oficial CCB 245' }
    ],
    t4: [
      { conteudo: 'Respiração diafragmática e sustentação de som nas 7 posições.', material: 'ALMEIDA DIAS METAIS Ex. 1 a 5' },
      { conteudo: 'Escala de Sib Maior em 1 oitava com embocadura relaxada.', material: 'ALMEIDA DIAS TROMPETE Módulo 3' },
      { conteudo: 'Flexibilidade labial (Lip Slurs) sem uso da língua.', material: 'ALMEIDA DIAS Módulo 5' },
      { conteudo: 'Síncopas no estilo toque de sino e entradas em contratempo.', material: 'ALMEIDA DIAS Módulo 4' },
      { conteudo: 'Hino 01 - Abertura solene em conjunto de metais.', material: 'Hino Oficial CCB 01' }
    ],
    t5: [
      { conteudo: 'Postura, digitação de pistos e emissão de coluna de ar nos metais graves.', material: 'ALMEIDA DIAS METAIS Ex. 1 a 5' },
      { conteudo: 'Escalas de Sib e Mib Maior com afinação no registro grave.', material: 'Exercícios Fundamentais Tuba/Eufônio' },
      { conteudo: 'Hino 245 - Execução da voz do Baixo e contracanto em conjunto.', material: 'Hino Oficial CCB 245 (Baixo)' }
    ],
    t6: [
      { conteudo: 'Solfejo de notas na clave de Sol e Fá na 4ª linha.', material: 'P. BONA Ex. 1 a 10' },
      { conteudo: 'Valores das figuras de som e pausas com metrônomo.', material: 'Teoria Musical Elementar' },
      { conteudo: 'Compassos compostos 6/8, 9/8 e 12/8.', material: 'P. BONA Ex. 85 a 90' }
    ],
    t7: [
      { conteudo: 'Postura de mãos no teclado superior e inferior.', material: 'Método para Órgão Vol. 1' },
      { conteudo: 'Independência de mãos e notas sustentadas na pedaleira.', material: 'Estudo de Pedaleira 1-5' },
      { conteudo: 'Hino 320 - Registração e acompanhamento.', material: 'Hino Oficial CCB 320' }
    ],
    t8: [
      { conteudo: 'Ensaio Geral da Orquestra - Equilíbrio de Naipes (Cordas, Madeiras e Metais).', material: 'Partitura Geral de Orquestra' },
      { conteudo: 'Estudo de Dinâmicas e Agógica (Crescendo, Diminuendo, Rallentando).', material: 'Hinos Selecionados' },
      { conteudo: 'Preparação para apresentação oficial e recitais da instituição.', material: 'Repertório Orquestral' }
    ]
  };

  // Anos de simulação: 2024, 2025, 2026
  const startYear = 2024;
  const endYear = 2026;

  for (let year = startYear; year <= endYear; year++) {
    const maxMonth = (year === 2026) ? 7 : 12;

    for (let month = 1; month <= maxMonth; month++) {
      // 2 aulas por mês para cada turma para simular continuidade bi-semanal rica
      const days = [10, 24];

      Object.keys(conteudosPorTurma).forEach(turmaId => {
        const turma = MOCK_TURMAS.find(t => t.id === turmaId);
        if (!turma) return;

        const conteudos = conteudosPorTurma[turmaId];

        days.forEach((day, idx) => {
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const cIndex = (year * 12 + month + idx) % conteudos.length;
          const selectedContent = conteudos[cIndex];

          const presencas: Record<string, boolean> = {};
          const avaliacoes: Record<string, any> = {};

          turma.alunosIds.forEach((alunoId, aIdx) => {
            const profile = STUDENT_PROFILES[alunoId] || {
              targetPresenca: 0.8,
              scores: { ritmo: 7.0, tecnica: 7.0, leitura: 7.0, expressao: 7.0, teoria: 7.0 },
              trend: 0.2,
              observations: ['Estudo regular com bom aproveitamento.']
            };

            // Verificar se o aluno já havia ingressado nessa data
            if (profile.startYear && (year < profile.startYear || (year === profile.startYear && month < (profile.startMonth || 1)))) {
              return; // Ainda não matriculado
            }

            // Verificar se aluno foi afastado
            let effectivePresenca = profile.targetPresenca;
            if (profile.endYear && (year > profile.endYear || (year === profile.endYear && month > (profile.endMonth || 12)))) {
              effectivePresenca = 0.05; // Afastado / quase 0 presença
            }

            // Semente única determinística
            const seed = (year * 10000) + (month * 100) + day + (aIdx * 17) + (turmaId.charCodeAt(1) * 31);
            const roll = seededRandom(seed);
            const isPresent = roll < effectivePresenca;
            presencas[alunoId] = isPresent;

            if (isPresent) {
              const yearsDiff = Math.max(0, year - (profile.startYear || 2024));
              const trendBonus = yearsDiff * profile.trend;

              // Calcular cada nota com sua variabilidade individual real
              const calcGrade = (base: number, critOffset: number) => {
                const jitter = (seededRandom(seed + critOffset * 13) - 0.5) * 1.4;
                const score = base + trendBonus + jitter;
                return Math.min(10, Math.max(1, Number(score.toFixed(1))));
              };

              const ritmo = calcGrade(profile.scores.ritmo, 1);
              const tecnica = calcGrade(profile.scores.tecnica, 2);
              const leitura = calcGrade(profile.scores.leitura, 3);
              const expressao = calcGrade(profile.scores.expressao, 4);
              const teoria = calcGrade(profile.scores.teoria, 5);

              const obsIdx = Math.floor(seededRandom(seed + 999) * profile.observations.length);
              const obsText = profile.observations[obsIdx] || `Evolução técnica em ${selectedContent.material}.`;

              avaliacoes[alunoId] = {
                ritmo,
                tecnica,
                leitura,
                expressao,
                teoria,
                observacao: obsText
              };
            }
          });

          aulas.push({
            id: `au_hist_${idCount++}`,
            turmaId,
            data: dateStr,
            conteudo: selectedContent.conteudo,
            material: selectedContent.material,
            presencas,
            avaliacoes
          });
        });
      });
    }
  }

  // Ordenar aulas por data decrescente
  return aulas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}

export const MOCK_AULAS: Aula[] = generateHistoricalAulas();

// REGISTROS DO DIÁRIO DE PRÁTICA HISTÓRICO (2024 - 2026)
export const MOCK_DIARIO: DiarioRegistro[] = [
  // Juliana Ribeiro (a1) - Trajetória exemplar no Órgão Eletrônico de 2024 a 2026
  {
    id: 'dr1',
    alunoId: 'a1',
    data: '2026-07-20',
    conteudo: 'Método KOHLER – Exercícios de Independência das Mãos e Pedaleira',
    desempenho: 'Execução muito fluida, ritmo preciso e coordenação excelente dos pedais de baixo.',
    tarefaCasa: 'Praticar o Hino 245 no Órgão com metrônomo em 80 bpm.',
    duracaoMinutos: 60
  },
  {
    id: 'dr2',
    alunoId: 'a1',
    data: '2026-07-12',
    conteudo: 'Estudo do Hino 245 com registração e pedaleira',
    desempenho: 'Conseguiu interpretar as nuances com grande expressividade e bom uso do pedal de expressão.',
    tarefaCasa: 'Revisar a voz do Soprano e Contralto no teclado superior e Baixo na pedaleira.',
    duracaoMinutos: 45
  },
  {
    id: 'dr3',
    alunoId: 'a1',
    data: '2025-11-15',
    conteudo: 'SCHMOLL Órgão – Exercício 84 – Transição de teclados',
    desempenho: 'Aprendeu a alternar entre teclado superior e inferior mantendo o legato.',
    tarefaCasa: 'Praticar com contagem do compasso quaternário.',
    duracaoMinutos: 50
  },
  {
    id: 'dr4',
    alunoId: 'a1',
    data: '2024-05-10',
    conteudo: 'Postura nas teclas e exercícios iniciais de 5 dedos',
    desempenho: 'Primeiros passos no órgão. Apresentou boa postura de mãos e pés.',
    tarefaCasa: 'Manter os pulsos relaxados e dedos curvados.',
    duracaoMinutos: 30
  },

  // Lucas Monteiro (a2)
  {
    id: 'dr5',
    alunoId: 'a2',
    data: '2026-07-18',
    conteudo: 'SCHMOLL Ex. 38 – Golpe de Arco Martelé',
    desempenho: 'Excelente ataque de som, articulando bem no meio do arco.',
    tarefaCasa: 'Estudar staccato na ponta do arco.',
    duracaoMinutos: 40
  },
  {
    id: 'dr6',
    alunoId: 'a2',
    data: '2025-06-22',
    conteudo: 'P. BONA Ex. 42 – Ritmo Acéfalo & Contratempos',
    desempenho: 'Superou a hesitação no tempo forte e marcou o pulso corretamente.',
    tarefaCasa: 'Solfejar batendo palma no tempo forte.',
    duracaoMinutos: 35
  },

  // Mariana Costa (a3)
  {
    id: 'dr7',
    alunoId: 'a3',
    data: '2026-07-19',
    conteudo: 'GIAMPIERI Págs. 40-42 – Escala de Fá Maior e Arpejos',
    desempenho: 'Dedilhado limpo e sincronizado no registro Clarim.',
    tarefaCasa: 'Praticar a passagem de registro sem quebrar o som.',
    duracaoMinutos: 50
  },
  {
    id: 'dr8',
    alunoId: 'a3',
    data: '2024-09-08',
    conteudo: 'Exercícios de coluna de ar e embocadura',
    desempenho: 'Firmou a embocadura e obteve sonoridade sem ruídos.',
    tarefaCasa: 'Sustentar notas longas de 12 segundos.',
    duracaoMinutos: 30
  }
];

// ESCALAS DE CULTOS E EVENTOS INSTITUCIONAIS HISTÓRICOS (2024 - 2026)
export const MOCK_ESCALAS: Escala[] = [
  // 2026
  {
    id: 'e1',
    evento: 'Culto Oficial de Domingo (Adultos)',
    data: '2026-07-26T14:00',
    regenteId: 'p1',
    musicosIds: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12', 'm13', 'm14', 'm15', 'm16', 'm17', 'm18', 'm19', 'm20'],
    status: 'Realizado',
    observacoes: 'Culto Oficial das 14:00 às 16:00 com orquestra completa (20 músicos ativos).'
  },
  {
    id: 'e_jovens_1',
    evento: 'Culto de Jovens e Menores',
    data: '2026-07-26T09:00',
    regenteId: 'p1',
    musicosIds: ['m1', 'm3', 'm7', 'm9', 'm11', 'm14', 'm15', 'm18', 'a1', 'a2', 'a3'],
    status: 'Realizado',
    observacoes: 'Culto de Jovens e Menores das 09:00 às 11:00 com participação dos aprendizes.'
  },
  {
    id: 'e_ensaio_1',
    evento: 'Ensaio Geral da Orquestra',
    data: '2026-08-01T19:00',
    regenteId: 'p1',
    musicosIds: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12', 'm13', 'm14', 'm15', 'm16', 'm17', 'm18', 'm19', 'm20'],
    status: 'Confirmado',
    observacoes: 'Ensaio Geral Oficial no 1º Sábado do Mês (19:00 às 21:00). Presença obrigatória.'
  },
  {
    id: 'e_culto_terca',
    evento: 'Culto Oficial de Terça-feira',
    data: '2026-08-04T19:00',
    regenteId: 'p2',
    musicosIds: ['m1', 'm2', 'm7', 'm9', 'm11', 'm14', 'm15', 'm18'],
    status: 'Confirmado',
    observacoes: 'Culto Oficial das 19:00 às 21:00.'
  },
  {
    id: 'e_culto_sexta',
    evento: 'Culto Oficial de Sexta-feira',
    data: '2026-08-07T19:00',
    regenteId: 'p3',
    musicosIds: ['m3', 'm4', 'm8', 'm10', 'm12', 'm14', 'm17', 'm19'],
    status: 'Confirmado',
    observacoes: 'Culto Oficial das 19:00 às 21:00.'
  },
  {
    id: 'e2',
    evento: 'Apresentação Pedagógica de Inverno 2026',
    data: '2026-07-11T11:30',
    regenteId: 'p1',
    musicosIds: ['m1', 'm2', 'm3', 'm7', 'm9', 'm11', 'm14', 'm15', 'm18', 'a1', 'a2', 'a3', 'a4'],
    status: 'Realizado',
    observacoes: 'Apresentação integrada no horário das Aulas de Música no sábado (11:00 às 14:00).'
  },

  // 2025
  {
    id: 'e4',
    evento: 'Ensaio Geral e Concerto de Encerramento 2025',
    data: '2025-12-06T19:00',
    regenteId: 'p1',
    musicosIds: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12', 'm13', 'm14', 'm15', 'm16', 'm17', 'm18', 'm19', 'm20'],
    status: 'Realizado',
    observacoes: 'Ensaio Geral festivo e formatura dos alunos promovidos a Músicos no 1º Sábado de Dezembro.'
  },
  {
    id: 'e5',
    evento: 'Masterclass Regional de Metais e Madeiras',
    data: '2025-10-18T11:00',
    regenteId: 'p2',
    musicosIds: ['m7', 'm8', 'm9', 'm10', 'm11', 'm12', 'm13', 'm18', 'm19', 'm20'],
    status: 'Realizado',
    observacoes: 'Oficina técnica realizada no período de Aulas de Sábado (11:00 às 14:00).'
  },
  {
    id: 'e6',
    evento: 'Recital Semestral de Julho 2025',
    data: '2025-07-12T11:30',
    regenteId: 'p1',
    musicosIds: ['m1', 'm2', 'm3', 'm7', 'm9', 'm11', 'm14', 'm15', 'a1', 'a2', 'a3'],
    status: 'Realizado',
    observacoes: 'Apresentação no sábado dentro da janela pedagógica oficial.'
  }
];
