/**
 * A. SCHMOLL - MÉTODO PARA VIOLINO
 * Base de Conhecimento Indexada e Estruturada para a Orquestra
 * Cobrindo as Páginas 1 a 81 (Lições 1 a 214)
 */

import { ExercícioSchmoll, EscalaHinoViolino, FundamentoViolino } from '../types';

export const ESCALAS_HINOS_VIOLINO: EscalaHinoViolino[] = [
  {
    tonalidade: 'Sol Maior',
    armadura: '1 Sustenido (Fá#)',
    paginaMetodo: 71,
    hinosAssociados: ['03', '09', '16', '17', '18', '23', '24', '25', '36', '66', '70', '437', '446', '454', '466'],
    observacaoTecnica: 'Escala em 2 oitavas iniciando na Corda Sol (4ª corda solta). Atentar para a posição do 2º dedo colado no 1º (Sol-Lá-Si-Dó natural).'
  },
  {
    tonalidade: 'Ré Maior',
    armadura: '2 Sustenidos (Fá#, Dó#)',
    paginaMetodo: 73,
    hinosAssociados: ['31', '58', '136', '143', '146', '234', '250', '262', '263', '286', '316', '436', '441', '444', '470'],
    observacaoTecnica: 'Inicia na Corda Ré solta (3ª corda). Mão na 1ª Posição padrão com 2º dedo separado nas cordas Ré e Lá (Fá# e Dó#).'
  },
  {
    tonalidade: 'Dó Maior',
    armadura: 'Nenhum acidente (Bequadro)',
    paginaMetodo: 75,
    hinosAssociados: ['06', '28', '33', '45', '52', '55', '71', '76', '431', '434', '457', '459', '461', '471', '472'],
    observacaoTecnica: 'Escala natural. Todos os 2ºs dedos colados no 1º dedo (Fá natural na corda Ré, Dó natural na corda Lá, Sol natural na corda Mi).'
  },
  {
    tonalidade: 'Fá Maior',
    armadura: '1 Bemol (Sib)',
    paginaMetodo: 77,
    hinosAssociados: ['39', '49', '59', '60', '64', '104', '125', '133', '140', '142', '197', '440', '453', '460', '468'],
    observacaoTecnica: 'Exige o 1º dedo recuado (meia posição/semitom) na corda Lá para a nota Sib, e 1º dedo recuado na corda Mi para o Fá natural.'
  },
  {
    tonalidade: 'Si b Maior',
    armadura: '2 Bemóis (Sib, Mib)',
    paginaMetodo: 79,
    hinosAssociados: ['08', '10', '20', '433', '439', '443', '445', '448', '451', '465', '474', '476', '477', '479', '480'],
    observacaoTecnica: '1º dedo recuado nas cordas Lá (Sib) e Ré (Mib). Cuidado especial com a afinação do 4º dedo esticado ou corda solta.'
  },
  {
    tonalidade: 'Mi b Maior',
    armadura: '3 Bemóis (Sib, Mib, Láb)',
    paginaMetodo: 81,
    hinosAssociados: ['01', '02', '34', '43', '435', '438', '447', '456', '458', '462', '464', '467', '473', '475', '478'],
    observacaoTecnica: '1º dedo recuado no Sol (Láb na corda Sol) e Ré (Mib na corda Ré). Posição de dedos recuados para afinação puríssima.'
  },
  {
    tonalidade: 'Lá b Maior',
    armadura: '4 Bemóis (Sib, Mib, Láb, Réb)',
    paginaMetodo: 83,
    hinosAssociados: ['13', '19', '32', '62', '95', '373', '377', '423', '432', '442', '449', '450', '452', '463', '469'],
    observacaoTecnica: 'Todos os dedos em posição baixa/recuada nas 4 cordas. Exige atenção ao relaxamento do polegar e pulso reto.'
  },
  {
    tonalidade: 'Ré b Maior',
    armadura: '5 Bemóis (Sib, Mib, Láb, Réb, Solb)',
    paginaMetodo: 85,
    hinosAssociados: ['57', '65', '69', '91', '118', '145', '194', '216', '238', '340', '361', '381', '387', '425', '455'],
    observacaoTecnica: 'Tonalidade avançada no violino orquestral. Dedos recuados em todas as cordas, mantendo o cotovelo ajustado sob o violino.'
  }
];

export const FUNDAMENTOS_VIOLINO_CCB: FundamentoViolino[] = [
  {
    categoria: '1. O Violino & Nomenclatura',
    titulo: 'Estrutura Externa e Interna do Violino',
    conteudo: 'O violino é o menor e mais agudo instrumento da família das cordas friccionadas. É composto por: Voluta, Cravelhas, Pestana, Espelho, Caixa das Cravelhas, Braço, Costelas, Tampo Superior, Tampo Inferior (Fundo), Bicos, Filete, Efes (f), Cavalete, Estandarte, Rabicho, Botão, CapotÁcio, Microafinadores e Queixeira. Internamente possui a Alma (cilindro de madeira que transmite as vibrações do tampo superior ao inferior) e a Barra Harmônica.',
    orientacaoProfessor: 'Explicar ao aluno a importância da alma: se a alma cair ou estiver fora de posição, o violino não deve ser tensionado nem tocado sob risco de rachar o tampo. A revisão periódica deve ser feita por um luthier profissional.',
    pontosChave: [
      'Violino afinado nas cordas: Mi4 (1ª), Lá3 (2ª), Ré3 (3ª) e Sol2 (4ª).',
      'Breu: resina vegetal aplicada nas crinas para gerar atrito ideal.',
      'A alma fica ligeiramente atrás do pé direito do cavalete.'
    ]
  },
  {
    categoria: '1. O Violino & Nomenclatura',
    titulo: 'O Arco e suas Partes',
    conteudo: 'O arco é feito de madeira (Pau-Brasil ou Pernambuco) com crinas de cavalo tensionadas entre a Ponta e o Talão. O ajuste da tensão é feito pelo Parafuso localizado no talão. Extensão aproximada de 75 cm no modelo 4/4.',
    orientacaoProfessor: 'Afrouxar as crinas do arco sempre ao terminar de tocar para preservar a curvatura natural da vara. Nunca aplicar breu em excesso para não criar poeira acumulada na madeira.',
    pontosChave: [
      'Divisão do arco: Talão (T), Meio (M) e Ponta (P).',
      'Subdivisões: Metade Inferior (M.I.) e Metade Superior (M.S.).',
      'Arco sempre paralelo ao cavalete durante a execução.'
    ]
  },
  {
    categoria: '2. Acessórios e Cuidados',
    titulo: 'Acessórios Obrigatórios e Limpeza',
    conteudo: 'Os acessórios fundamentais incluem: Espaleira (ajustável para apoiar no tronco esquerdo sem elevar o ombro), Queixeira anatômica confortável (Spohr), Breu de boa qualidade, Diapasão metálico de forquilha (440 Hz na nota Lá 3) ou afinador digital confiável, e Flanela seca para limpeza.',
    orientacaoProfessor: 'Instruir a limpeza diária após o estudo com flanela seca no tampo, espelho e cordas. Proibido usar álcool ou solventes no verniz do violino!',
    pontosChave: [
      'Ajustar espaleira sem forçar a clavícula.',
      'Diapasão 440Hz encostado na caixa de ressonância ou osso temporal para amplificação.',
      'Troca de cordas recomendada no mínimo 2 vezes ao ano.'
    ]
  },
  {
    categoria: '3. Postura Corporal & Posição',
    titulo: 'Postura do Corpo e Acomodação do Violino',
    conteudo: 'Em pé: corpo ereto, pés ligeiramente afastados na largura dos ombros, peso distribuído equilibradamente. Sentado: sentar na ponta do banco, mantendo a coluna ereta. O violino repousa sobre a clavícula esquerda e peito, apoiado de leve pelo queixo na queixeira. A voluta deve ficar na altura do nariz e o cotovelo esquerdo apontado para o chão.',
    orientacaoProfessor: 'Observar rigorosamente se o aluno não está elevando ou tensionando o ombro esquerdo. O violino deve se manter sustentado sem a necessidade de segurar forte com a mão esquerda.',
    pontosChave: [
      'Voluta na altura do nariz.',
      'Cotovelo esquerdo levemente voltado para dentro (apontado para o chão).',
      'Evitar posições incorretas como voluta apontando para o chão ou cotovelo encostado na parede/corpo.'
    ]
  },
  {
    categoria: '3. Postura Corporal & Posição',
    titulo: 'Empunhadura do Arco (Mão Direita) & Exercícios "Bico de Pato / Collé" e "Parabrisa"',
    conteudo: 'O braço direito deve ficar solto e relaxado. Segurar o arco com o polegar curvado tocando na junção da vara com o talão. O indicador apoia na 1ª e 2ª falanges, médio e anular abraçam a vara e o dedo mínimo (mindinho) fica arredondado sobre a vara. Exercício "Bico de Pato / Collé": flexão suave das falanges para desenvolver elasticidade. Exercício "Parabrisa": movimentar o arco vertical e lateralmente mantendo os dedos flexionados.',
    orientacaoProfessor: 'Praticar os exercícios de flexibilidade dos dedos longe do violino (com um lápis ou com o próprio arco) antes de tocar nas cordas soltas.',
    pontosChave: [
      'Polegar e mínimo sempre flexionados e arredondados.',
      'Pulso flexível ao mudar de arcada (puxar/empurrar).',
      'Exercício do parabrisa fortalece o controle de peso no talão e na ponta.'
    ]
  },
  {
    categoria: '3. Postura Corporal & Posição',
    titulo: 'Postura da Mão Esquerda no Braço do Violino',
    conteudo: 'O polegar esquerdo apoia suavemente na lateral do braço, pouco acima da 1ª falange, sem apertar. O punho esquerdo deve permanecer reto (em linha reta com o antebraço). As posturas INCORRETAS clássicas a serem EVITADAS rigorosamente são: "Mão de Garçom" (punho dobrado para trás encostando na caixa) e "Mão Bico de Pato" (punho dobrado excessivamente para frente).',
    orientacaoProfessor: 'Verificar a folga entre a palma da mão e o braço do violino: deve haver espaço suficiente para passar um lápis por baixo do braço.',
    pontosChave: [
      'Punho estritamente reto.',
      'Proibido "mão de garçom" ou "mão bico de pato".',
      'Dedos caem como pequenos martelos sobre a corda, usando as pontas digits.'
    ]
  }
];

export interface SecaoPedagogicaSchmoll {
  titulo: string;
  paginas: string;
  licoes: string;
  faseOrquestra: 1 | 2 | 3 | 4;
  nivel: 'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado';
  descricao: string;
  objetivos: string[];
  tecnicasChave: string[];
  orientacoesAutor: string[];
}

export const ESTRUTURA_PEDAGOGICA_SCHMOLL: SecaoPedagogicaSchmoll[] = [
  {
    titulo: 'I. Fundamentos, Anatômica & Cordas Soltas',
    paginas: 'Páginas 1 a 13',
    licoes: 'Lições 1 a 8',
    faseOrquestra: 1,
    nivel: 'Iniciante',
    descricao: 'Anatomia do violino (alma, barra harmônica, espelho), partes do arco, regulagem de breu, afinação (Lá, Ré, Sol, Mi), postura de ombro/cotovelo/mão e primeiros golpes de arco em cordas soltas com pausas e bicordes para afinação.',
    objetivos: [
      'Identificar todas as peças do violino e estrutura interna (alma e barra harmônica).',
      'Manter o violino apoiado de leve na clavícula sem forçar o ombro.',
      'Desenvolver a pegada relaxada no arco com polegar e dedos arredondados.',
      'Aprender a divisão do arco em 3 partes: Talão (T), Meio (M) e Ponta (P).'
    ],
    tecnicasChave: [
      'Puxar e empurrar o arco paralelo ao cavalete (entre cavalete e espelho)',
      'Controle de pressão do arco pelo polegar e indicador/mínimo',
      'Produção do som puro em cordas soltas Lá, Ré, Sol e Mi',
      'Sinais de Arcada (⊓ Talão, ∨ Ponta, Duplo Talão, Duplo Ponta)'
    ],
    orientacoesAutor: [
      'Estudar na frente do espelho para verificar se o arco permanece paralelo ao cavalete.',
      'A alma do violino transmite a vibração da tampa da frente para a tampa de trás.',
      'Afina-se primeiro a corda LÁ com o diapazão, depois LÁ e RÉ juntas, depois LÁ e MI, RÉ e SOL.'
    ]
  },
  {
    titulo: 'II. 1ª Posição, Marcas de Dedos & Métrica Gradual',
    paginas: 'Páginas 14 a 36',
    licoes: 'Lições 9 a 77',
    faseOrquestra: 1,
    nivel: 'Básico',
    descricao: 'Desenvolvimento do dedilhado na 1ª Posição através das cordas Lá, Ré, Sol e Mi. Estudo de semitons (dedos juntos), alternância de notas pontuadas, ligaduras, staccato inicial, mudanças de corda com ajuste de cotovelo e clássicos de Wagner, Brahms e Tchaikovsky.',
    objetivos: [
      'Posicionar os dedos 1, 2, 3 e 4 com o formato em martelo sobre as cordas.',
      'Distinguir espacialmente o tom do semitom (dedos afastados vs colados).',
      'Articular o movimento do cotovelo direito ao mudar de corda.',
      'Executar ligaduras suaves mantendo o arco em movimento contínuo.'
    ],
    tecnicasChave: [
      'Ajuste do cotovelo esquerdo no centro do corpo',
      'Manutenção do 1º e 2º dedos apoiados enquanto se toca com os outros',
      'Sinal de aproveitamento para baixo e quebra de sequência',
      'Ritmos de 3/4 e 4/4 com acentuação natural no tempo forte'
    ],
    orientacoesAutor: [
      'O 4º dedo na corda LÁ produz o mesmo som que a corda MI solta (verificar afinação).',
      'Ao tocar na corda SOL, o cotovelo esquerdo deve encostar no peito.',
      'Não soltar os dedos da corda até não sair o som da nota seguinte.'
    ]
  },
  {
    titulo: 'III. Grandes Peças do Repertório Clássico & Escalas',
    paginas: 'Páginas 37 a 47',
    licoes: 'Lições 78 a 113',
    faseOrquestra: 2,
    nivel: 'Intermediário',
    descricao: 'Domínio da 1ª Posição com obras consagradas de Handel, Bach, Paganini, Beethoven, Schubert e Boccherini. Estudo completo das escalas maiores até 5 acidentes, escalas em 2 oitavas e escala cromática.',
    objetivos: [
      'Tocar com expressividade, dinâmicas (f, mf, p, pp, sfz) e rigor rítmico.',
      'Decorar e tocar com afinação precisa as escalas de Dó, Sol, Ré, Lá, Mi, Fá, Sib, Mib, Láb e Réb.',
      'Dominar o dedilhado da Escala Cromática com deslizamento de semitons (1-1, 2-2, 3-3).',
      'Desenvolver agilidade na articulação de colcheias e semicolcheias.'
    ],
    tecnicasChave: [
      'Quebra de sequência rítmica (colcheia pontuada + semicolcheia)',
      'Minueto em Sol de Beethoven (ritmo gracioso e terço de arco)',
      'Marcha de Schubert com acentuação sfz no talão e ponta',
      'Dedilhado fixo para Escala Cromática sem desafinar'
    ],
    orientacoesAutor: [
      'TODO VIOLINISTA TEM POR OBRIGAÇÃO SABER TODAS ESSAS ESCALAS DE COR E SALTEADO.',
      'Antes de tocar qualquer lição, o aluno deve tocar primeiro a escala correspondente.',
      'A escala cromática deve ser estudada bastante até decorá-la e tocá-la bem afinada.'
    ]
  },
  {
    titulo: 'IV. Dez Pequenos Estudos Clássicos para Técnica do Arco',
    paginas: 'Páginas 48 a 57',
    licoes: 'Lições 114 a 123',
    faseOrquestra: 2,
    nivel: 'Intermediário',
    descricao: 'Os lendários 10 estudos clássicos focados exclusivamente nos golpes de arco essenciais para o violino orquestral: Gran Staccato, Martellato, Saltellato, Legato, Staccato Fracionado, Articulação de Ponta e Saltellato Ligero.',
    objetivos: [
      'Diferenciar e aplicar com controle muscular cada golpe de arco técnico.',
      'Controlar a velocidade e ponto de contato do arco (talão, meio, ponta).',
      'Executar o saltellato no meio do arco aproveitando a elasticidade da vara.',
      'Manter o 1º dedo apoiado na corda para estabilidade do dedilhado rápido.'
    ],
    tecnicasChave: [
      'Gran Staccato (na metade do arco, largo e destacado)',
      'Martellato (articulado firme na ponta e no talão)',
      'Saltellato (no meio do arco, marcando bem cada nota)',
      'Staccato Fracionado (divisões de 1/2, 1/4, 1/6 e 1/3 do arco)'
    ],
    orientacoesAutor: [
      'Estas 10 lições têm por finalidade ensinar o aluno como manejar o arco nos vários tipos de exercícios.',
      'Só depois de ter estudado MUITO BEM essas 10 lições, o aluno estudará em sequência as Posições.'
    ]
  },
  {
    titulo: 'V. Estudo das Posições (3ª, 5ª, 2ª, 4ª, 6ª) & Harmônicos',
    paginas: 'Páginas 58 a 81',
    licoes: 'Lições 124 a 214',
    faseOrquestra: 3,
    nivel: 'Avançado',
    descricao: 'Navegação avançada pelo espelho do violino. Sequência metodológica do autor: 3ª Posição (124-142), Mudança 1ª-3ª (143-150), 5ª Posição (151-162), Mudança 1ª-3ª-5ª (173-180), 2ª Posição (181-195), 4ª Posição (196-204), União das 5 Posições (205-206), 6ª Posição (207-214) e Harmônicos naturais.',
    objetivos: [
      'Fixar a mão esquerda com precisão na 3ª, 5ª, 2ª, 4ª e 6ª posições.',
      'Realizar mudanças de posição (portamento/glissando suave) usando o 1º dedo guia.',
      'Executar notas harmônicas com leve toque da polpa digital na corda.',
      'Conectar todo o espelho através da União das Cinco Posições.'
    ],
    tecnicasChave: [
      'Mudança de posição deslizante (escorregar o 1º dedo até a marca)',
      'Som flautado em notas harmônicas (pouca força, arco rápido)',
      'Uso do 4º dedo esticado nas posições agudas',
      'União das 5 posições em frases de amplo alcance orquestral'
    ],
    orientacoesAutor: [
      'A 3ª Posição é estudada antes da 2ª porque o 1º dedo na 3ª posição equivale ao 3º dedo da 1ª posição.',
      'Nos harmônicos, se o dedo for colocado com muita força sobre a corda, não se conseguirá produzir o som de flauta.',
      'Na mudança de dedo, o polegar deve acompanhar o deslocamento de maneira natural.'
    ]
  }
];

export const EXERCICIOS_SCHMOLL: ExercícioSchmoll[] = [
  // SEÇÃO I: FUNDAMENTOS & CORDAS SOLTAS (Págs 1 - 13)
  {
    numero: 1,
    pagina: 9,
    secao: 'Fundamentos & Cordas Soltas',
    titulo: 'Estudo em Cordas Soltas Lá e Ré com Pausas',
    posicao: '1ª Posição',
    tecnicaArco: 'Talão (T), Ponta (P) e Meio (M) com notas sustentadas',
    tecnicaMaoEsquerda: 'Postura neutra sem apertar dedos',
    tonalidade: 'Lá / Ré Soltas',
    compasso: '4/4',
    andamento: 'Lento (4 tempos por nota)',
    nivel: 'Iniciante',
    faseOrquestra: 1,
    conceitos: ['Cordas Soltas', 'Unidade de Compasso (Semibreve)', 'Pausas de 3 tempos'],
    dificuldades: ['Manejo da velocidade do arco', 'Manter o arco paralelo ao cavalete'],
    prerequisitos: ['Postura do violino e pegada no arco (Pág. 6-7)'],
    descricao: 'Primeira lição prática do método. Tocar o 1º tempo no talão ou ponta e contar 3 tempos de pausa para preparar o retorno do arco.'
  },
  {
    numero: 3,
    pagina: 11,
    secao: 'Fundamentos & Mão Esquerda',
    titulo: 'Nota Semibreve na Corda Lá (4 Tempos)',
    posicao: '1ª Posição',
    tecnicaArco: 'Arco Todo (4 tempos contínuos)',
    tecnicaMaoEsquerda: 'Preparo dos 4 dedos (1, 2, 3, 4) nas marcas',
    tonalidade: 'Lá Maior (Corda Solta)',
    compasso: '4/4',
    andamento: 'Lento e Sustentado',
    nivel: 'Iniciante',
    faseOrquestra: 1,
    conceitos: ['Divisão de 4 Tempos', 'Pausas de Semibreve', 'Pressão do Polegar no Arco'],
    dificuldades: ['Manter a força do som uniforme do talão à ponta'],
    prerequisitos: ['Lição 1'],
    descricao: 'Na descida do arco, apoiar de leve os dedos anular e mínimo da mão direita; na ponta, usar mais força no pulso.'
  },
  {
    numero: 6,
    pagina: 13,
    secao: 'Sinais de Arcadas',
    titulo: 'Exercício com Arcadas em Semínimas e Mínimas',
    posicao: '1ª Posição',
    tecnicaArco: 'Meio arco para semínimas, arco todo para mínimas',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Iniciante',
    faseOrquestra: 1,
    conceitos: ['Sinais de Arcada (⊓ e ∨)', 'Proporção de Distribuição do Arco'],
    dificuldades: ['Calcular a metade do arco para semínima e total para mínima'],
    prerequisitos: ['Lições 1-5'],
    descricao: 'Treino de controle de extensão do arco dependendo da figura rítmica.'
  },
  {
    numero: 8,
    pagina: 13,
    secao: 'Sinais de Arcadas & Afinação',
    titulo: 'Estudo de Bicordes para Afinação (Mi-Lá, Lá-Ré, Ré-Sol)',
    posicao: '1ª Posição',
    tecnicaArco: 'Dupla corda com pressão igual sobre as duas cordas',
    tecnicaMaoEsquerda: 'Nenhuma (Cordas Soltas)',
    tonalidade: 'Bicordes Perfeitos',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Iniciante',
    faseOrquestra: 1,
    conceitos: ['Afinação em Quintas Justas', 'Som Duplo / Bicordes', 'Ouvido Harmônico'],
    dificuldades: ['Equilibrar o peso do arco entre duas cordas simultâneas'],
    prerequisitos: ['Lição 1'],
    descricao: 'Gravado do ouvido para afinação rápida por quintas. Tocar forte e com som límpido.'
  },

  // SEÇÃO II: DEDILHADO NA 1ª POSIÇÃO (Págs 14 - 36)
  {
    numero: 9,
    pagina: 14,
    secao: 'Colocação dos Dedos - Corda Lá',
    titulo: 'Colocação do 1º Dedo (Nota SI) na Corda LÁ',
    posicao: '1ª Posição',
    tecnicaArco: 'Arcadas separadas no talão e meio',
    tecnicaMaoEsquerda: '1º dedo na 1ª marca da corda Lá',
    tonalidade: 'Lá Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Iniciante',
    faseOrquestra: 1,
    conceitos: ['Primeira Posição', 'Nota SI', 'Alternância Corda Solta e 1º Dedo'],
    dificuldades: ['Afinação exata do tom de SI em relação à corda LÁ solta'],
    prerequisitos: ['Marcas de fita no espelho (Pág. 10)'],
    descricao: 'Apertar a corda com a ponta da primeira falange. Cada repetição deve ser tocada 10 vezes.'
  },
  {
    numero: 11,
    pagina: 15,
    secao: 'Colocação dos Dedos - Corda Lá',
    titulo: 'Colocação do 2º Dedo (DÓ# / DÓ Natural - Semitom)',
    posicao: '1ª Posição',
    tecnicaArco: 'Arcadas suaves',
    tecnicaMaoEsquerda: '2º dedo junto ao 1º dedo (semitom 1/2 tom)',
    tonalidade: 'Lá Maior / Menor',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Básico',
    faseOrquestra: 1,
    conceitos: ['Semitom (1/2 tom)', 'Dedos Colados (1º e 2º)', 'Linha Pontilhada de Retenção'],
    dificuldades: ['Manter o 1º dedo firme na corda enquanto o 2º dedo atua'],
    prerequisitos: ['Lição 9'],
    descricao: 'Regra fundamental do violino: Quando existe o pontilhado, deixar o dedo na corda até o término da linha.'
  },
  {
    numero: 13,
    pagina: 16,
    secao: 'Colocação dos Dedos - Corda Lá',
    titulo: 'Colocação do 3º Dedo (Nota RÉ) na Corda LÁ',
    posicao: '1ª Posição',
    tecnicaArco: 'Meio e talão de arco',
    tecnicaMaoEsquerda: '3º dedo na 2ª marca da corda Lá',
    tonalidade: 'Lá Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Básico',
    faseOrquestra: 1,
    conceitos: ['Intervalo de Quarta', 'Nota RÉ', '3º Dedo na Corda Lá'],
    dificuldades: ['Afastar o 3º dedo do 2º preservando o tom inteiro'],
    prerequisitos: ['Lição 11'],
    descricao: 'Fixação do 3º dedo e checagem da afinação em oitava com a corda Ré solta.'
  },
  {
    numero: 19,
    pagina: 18,
    secao: 'Colocação dos Dedos - Corda Lá',
    titulo: 'Colocação do 4º Dedo (Nota MI) na Corda LÁ',
    posicao: '1ª Posição',
    tecnicaArco: 'Arco todo nas mínimas, meio arco nas semínimas',
    tecnicaMaoEsquerda: '4º dedo (mínimo) arredondado na corda Lá',
    tonalidade: 'Lá Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Básico',
    faseOrquestra: 1,
    conceitos: ['4º Dedo (Mínimo)', 'Uníssono com Corda Solta Mi', 'Fortalecimento do Mínimo'],
    dificuldades: ['O 4º dedo é naturalmente mais fraco; não deixar o pulso dobrar para dentro'],
    prerequisitos: ['Lição 13'],
    descricao: 'O 4º dedo na corda LÁ produz o mesmo som que a corda MI solta. Deve-se cantar e solfejar antes de tocar.'
  },
  {
    numero: 23,
    pagina: 19,
    secao: 'Exercícios na Corda Ré',
    titulo: 'Estudo do Dedilhado na Corda RÉ (Notas RÉ, MI, FÁ#, SOL, LÁ)',
    posicao: '1ª Posição',
    tecnicaArco: 'Ritmo 4/4 com dinâmica f, p, mf, p',
    tecnicaMaoEsquerda: 'Dedos 1, 2, 3 e 4 na corda Ré',
    tonalidade: 'Ré Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Básico',
    faseOrquestra: 1,
    conceitos: ['Corda Ré', 'Acentuação Dinâmica (f no 1º tempo, p no 2º tempo, mf no 3º)'],
    dificuldades: ['Elevação precisa do cotovelo direito para o nível da corda Ré'],
    prerequisitos: ['Lições 9-19'],
    descricao: 'Aplicação do dedilhado na corda Ré com dinâmicas expressivas de forte e piano.'
  },
  {
    numero: 25,
    pagina: 20,
    secao: 'Mudança de Corda',
    titulo: 'Exercícios de Mudança de Corda em Intervalos de Sexta',
    posicao: '1ª Posição',
    tecnicaArco: 'Passagem fluida do arco entre cordas vizinhas',
    tecnicaMaoEsquerda: 'Manter 2º dedo fixo enquanto muda de corda',
    tonalidade: 'Ré / Lá Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Básico',
    faseOrquestra: 1,
    conceitos: ['Mudança de Corda', 'Sexta Intervalar', 'Retenção de Dedos'],
    dificuldades: ['Evitar chiados e esbarrões em cordas adjacentes'],
    prerequisitos: ['Lição 23'],
    descricao: 'O 2º dedo deve ficar apertado na corda até o final da lição para estabilizar a mão.'
  },
  {
    numero: 27,
    pagina: 20,
    secao: 'Estudo de Ligaduras',
    titulo: 'Maneira de Executar Exercícios com Ligadura',
    posicao: '1ª Posição',
    tecnicaArco: 'Legato de 2 notas por arcada',
    tecnicaMaoEsquerda: 'Mudança de dedo rápida e limpa durante o arco contínuo',
    tonalidade: 'Ré Maior',
    compasso: '4/4',
    andamento: 'Andante',
    nivel: 'Básico',
    faseOrquestra: 1,
    conceitos: ['Ligadura de Valor e Expressão', '1ª Metade do Arco / 2ª Metade'],
    dificuldades: ['Mudar o dedo exatamente no meio do percurso do arco sem parar a vara'],
    prerequisitos: ['Lição 25'],
    descricao: 'Tocar a 1ª nota na 1ª metade do arco e a 2ª nota na 2ª metade sem interromper o som.'
  },
  {
    numero: 29,
    pagina: 21,
    secao: 'Exercícios na Corda Sol',
    titulo: 'Estudo Completo da Corda SOL (Notas SOL, LÁ, SI, DÓ, RÉ)',
    posicao: '1ª Posição',
    tecnicaArco: 'Arco firme com peso na corda grave',
    tecnicaMaoEsquerda: 'Cotovelo esquerdo encostado no peito',
    tonalidade: 'Sol Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Básico',
    faseOrquestra: 1,
    conceitos: ['Corda Sol (Grave)', 'Ajuste Anatômico do Cotovelo Esquerdo'],
    dificuldades: ['Projeção de som limpo na corda mais grossa sem arranhar'],
    prerequisitos: ['Lições 23-28'],
    descricao: 'Quando se toca na corda SOL, o cotovelo esquerdo deve estar encostado no peito e o cotovelo direito elevado.'
  },
  {
    numero: 35,
    pagina: 23,
    secao: 'Exercícios na Corda Mi',
    titulo: 'Estudo na Corda MI (Aguda) e Ligaduras de 2 e 4 Notas',
    posicao: '1ª Posição',
    tecnicaArco: 'Ligadura de 2 em 2 e 4 em 4 colcheias',
    tecnicaMaoEsquerda: '1º dedo perto da pestana para Fá natural/Fá#',
    tonalidade: 'Mi Menor / Maior',
    compasso: '4/4',
    andamento: 'Andante',
    nivel: 'Básico',
    faseOrquestra: 1,
    conceitos: ['Corda Mi', 'Postura do Mínimo', 'Ligaduras Agrupadas'],
    dificuldades: ['Som estridente na corda Mi se houver excesso de pressão'],
    prerequisitos: ['Lição 29'],
    descricao: 'Exploração da corda aguda Mi com variação de ligaduras em grupos de 2 e 4 notas.'
  },
  {
    numero: 38,
    pagina: 24,
    secao: 'Golpes de Arco - Staccato',
    titulo: 'Iniciação ao Staccato em Colcheias e Semínimas',
    posicao: '1ª Posição',
    tecnicaArco: 'Staccato articulado com pequenas pausas entre as notas',
    tecnicaMaoEsquerda: 'Dedos firmes no lugar exato',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Básico',
    faseOrquestra: 2,
    conceitos: ['Staccato', 'Ataque de Arco', 'Pausa Interna de Articulação'],
    dificuldades: ['Dividir o tempo com precisão mantendo a velocidade constante'],
    prerequisitos: ['Lições 35-37'],
    descricao: 'O staccato deve ser tocado na posição normal do arco, porém com velocidade. Entre cada nota tem uma pausa micro-rítmica.'
  },
  {
    numero: 41,
    pagina: 24,
    secao: 'Repertório Clássico Inicial',
    titulo: 'Peça "Leve e Com Ânimo" (R. Schumann - Op. 68)',
    posicao: '1ª Posição',
    tecnicaArco: 'Tocar no meio do arco com leveza',
    tecnicaMaoEsquerda: 'Agilidade de dedos em 2/4',
    tonalidade: 'Sol Maior',
    compasso: '2/4',
    andamento: 'Allegretto / Leve e com ânimo',
    nivel: 'Básico',
    faseOrquestra: 2,
    compositor: 'R. Schumann',
    conceitos: ['Melodia Cantabile', 'Tocando no Meio do Arco', 'Andamento Vivo'],
    dificuldades: ['Fraseado musical gracioso'],
    prerequisitos: ['Lição 38'],
    descricao: 'Primeira adaptação do repertório clássico germânico de Schumann no método Schmoll.'
  },
  {
    numero: 43,
    pagina: 25,
    secao: 'Técnica Diária de Arco',
    titulo: 'Estudo em Sol Maior com 7 Variantes de Arcada (Trêmolo, Staccato, Legato)',
    posicao: '1ª Posição',
    tecnicaArco: '7 Variações: Trêmolo, Staccato, Legato 2, Legato 4, Legato 3+1',
    tecnicaMaoEsquerda: 'Escala de Sol Maior com Fá#',
    tonalidade: 'Sol Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Básico',
    faseOrquestra: 2,
    conceitos: ['Variações de Arcada', 'Movimentação do Pulso Movel', 'Legato Assimétrico'],
    dificuldades: ['A nota desligada em 3+1 requer rapidez e leveza de arco'],
    prerequisitos: ['Lição 38'],
    descricao: 'Lição mestre de técnica diária. Tocar os 7 exemplos de arcada para transformar a flexibilidade do pulso direito.'
  },
  {
    numero: 44,
    pagina: 26,
    secao: 'Repertório de Ópera Clássica',
    titulo: 'Melodia de Ópera (R. Wagner)',
    posicao: '1ª Posição',
    tecnicaArco: 'Acentuação na ponta e menos arco na colcheia',
    tecnicaMaoEsquerda: 'Subir 1/2 tom para Dó# e retornar ao natural',
    tonalidade: 'Sol Maior / Menor',
    compasso: '3/4',
    andamento: 'Commodo',
    nivel: 'Básico',
    faseOrquestra: 2,
    compositor: 'R. Wagner',
    conceitos: ['Acentuação (>)', 'Contraste Dramático', 'Uso da Ponta do Arco'],
    dificuldades: ['Acidentes ocorrentes (Dó#) no meio da frase em 3/4'],
    prerequisitos: ['Lição 43'],
    descricao: 'Trecho expressivo do mestre Richard Wagner com marcas de acentuação forte na ponta.'
  },
  {
    numero: 47,
    pagina: 26,
    secao: 'Escalas e Tons Menores',
    titulo: 'Escala de Mi Menor e Estudo Lento',
    posicao: '1ª Posição',
    tecnicaArco: 'Arco todo ligado',
    tecnicaMaoEsquerda: 'Sensível Dó# e Ré#',
    tonalidade: 'Mi Menor',
    compasso: '3/4',
    andamento: 'Lento',
    nivel: 'Básico',
    faseOrquestra: 2,
    conceitos: ['Modo Menor', 'Escala Menor Melódica', 'Dal Segno ao Fim %'],
    dificuldades: ['Afinação da 7ª menor e 7ª maior melódica'],
    prerequisitos: ['Lição 44'],
    descricao: 'A escala menor é mais difícil que a maior. Requer atenção dobrada à colocação dos semitoniais.'
  },

  // SEÇÃO III: REPERTÓRIO CLÁSSICO & TABELA DE ESCALAS (Págs 37 - 47)
  {
    numero: 70,
    pagina: 33,
    secao: 'Repertório Clássico de Mestres',
    titulo: 'Suíte em 3/4 de J. S. Bach',
    posicao: '1ª Posição',
    tecnicaArco: 'Colcheias desligadas no talão e arco todo nas ligadas',
    tecnicaMaoEsquerda: 'Apertar o mesmo dedo em duas cordas paralelas',
    tonalidade: 'Sol Maior',
    compasso: '3/4',
    andamento: 'Allegretto',
    nivel: 'Intermediário',
    faseOrquestra: 2,
    compositor: 'J. S. Bach',
    conceitos: ['Contraponto Barrociano', 'Apogiatura Inicial', 'Troca de Seções (Ritornelo)'],
    dificuldades: ['Mudar do talão para o arco todo sem soltar o ritmo'],
    prerequisitos: ['Lição 68'],
    descricao: 'Obra prima de Bach adaptada para violino solo. Exige articular o mesmo dedo em duas cordas simultâneas.'
  },
  {
    numero: 72,
    pagina: 34,
    secao: 'Repertório Clássico & Tercinas',
    titulo: 'Animato com Tercinas (J. S. Bach)',
    posicao: '1ª Posição',
    tecnicaArco: 'Transição entre meio do arco, talão e ponta',
    tecnicaMaoEsquerda: 'Tercinas em velocidade (Lá, Si, Dó)',
    tonalidade: 'Sol Maior',
    compasso: '3/4',
    andamento: 'Animato',
    nivel: 'Intermediário',
    faseOrquestra: 3,
    compositor: 'J. S. Bach',
    conceitos: ['Tresquiálteras / Tercinas', 'Subdivisão Ternária', 'Mudança Dinâmica f para p'],
    dificuldades: ['Executar a tercina em 1 tempo de semínima sem alterar o andamento'],
    prerequisitos: ['Lição 71 (Preparação para Tercina)'],
    descricao: 'A lição 71 prepara o aluno para a 72. A tercina é formada por 3 notas no tempo de uma semínima.'
  },
  {
    numero: 73,
    pagina: 35,
    secao: 'Virtuosismo em 1ª Posição',
    titulo: 'Tema e Variações de C. M. v. Weber',
    posicao: '1ª Posição',
    tecnicaArco: 'Saltos de arco no meio, talão e ponta com ff',
    tecnicaMaoEsquerda: '4º dedo esticado e trilos curtos',
    tonalidade: 'Sol Maior',
    compasso: '2/4',
    andamento: 'Allegro',
    nivel: 'Intermediário',
    faseOrquestra: 3,
    compositor: 'C. M. v. Weber',
    conceitos: ['Mudança de Região do Arco', 'Fortíssimo (ff)', 'Secção Virtuosa'],
    dificuldades: ['Agilidade de salto de arco no meio do percurso'],
    prerequisitos: ['Lição 72'],
    descricao: 'Peça vibrante de Carl Maria von Weber testando todas as regiões de contato do arco.'
  },
  {
    numero: 78,
    pagina: 37,
    secao: 'Repertório Barrociano',
    titulo: 'Allegretto Espressivo (G. F. Handel)',
    posicao: '1ª Posição',
    tecnicaArco: 'Arco expressivo e cantabile no talão e ponta',
    tecnicaMaoEsquerda: 'Dedilhado marcado com 4º dedo estendido',
    tonalidade: 'Ré Maior',
    compasso: '4/4',
    andamento: 'Allegretto',
    nivel: 'Intermediário',
    faseOrquestra: 3,
    compositor: 'G. F. Handel',
    conceitos: ['Cantabile', 'Fraseado Nobre', 'Acentuação de Posição do Arco'],
    dificuldades: ['Manter a qualidade sonora nas nuances pianíssimo (pp) e fortíssimo (f)'],
    prerequisitos: ['Lição 75'],
    descricao: 'Peça elegante de Handel rica em marcações de dedilhado e controle do talão.'
  },
  {
    numero: 81,
    pagina: 39,
    secao: 'Repertório Virtuoso',
    titulo: 'Tema Mágico de N. Paganini',
    posicao: '1ª Posição',
    tecnicaArco: 'Quebra de sequência rítmica nas figuras pontuadas',
    tecnicaMaoEsquerda: 'Acidentes de passagem e fermata expressiva',
    tonalidade: 'Ré Maior',
    compasso: '2/4',
    andamento: 'Andante / Meno Mosso',
    nivel: 'Intermediário',
    faseOrquestra: 3,
    compositor: 'N. Paganini',
    conceitos: ['Quebra de Sequência', 'Fermata', 'A Tempo', 'Mudança Agógica'],
    dificuldades: ['Articulação rítmica do V-sinal de quebra de sequência'],
    prerequisitos: ['Lição 80'],
    descricao: 'Tema expressivo de Niccolò Paganini. Exige atentar às indicações de meio arco e pausa de fermata.'
  },
  {
    numero: 90,
    pagina: 42,
    secao: 'Estudos de Escalas',
    titulo: 'Escala de LÁ MAIOR (3 Sustenidos: Fá#, Dó#, Sol#)',
    posicao: '1ª Posição',
    tecnicaArco: 'Arco todo e ligaduras de 2 em 2',
    tecnicaMaoEsquerda: 'Posição de semitom entre 2º e 3º dedo',
    tonalidade: 'Lá Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Intermediário',
    faseOrquestra: 2,
    conceitos: ['Armação de Clave com 3 Sustenidos', 'Estrutura da Escala Maior'],
    dificuldades: ['Manter a afinação do Sol# sensível na corda Ré'],
    prerequisitos: ['Lição 89'],
    descricao: 'Estudo obrigatório da escala de Lá Maior. Deve ser tocada diariamente de cor e salteado.'
  },
  {
    numero: 99,
    pagina: 43,
    secao: 'Escala Cromática',
    titulo: 'A Escala Cromática Completa em 1ª Posição',
    posicao: '1ª Posição',
    tecnicaArco: 'Retomada de arco no talão',
    tecnicaMaoEsquerda: 'Deslizamento suave de semitons (1-1, 2-2, 3-3)',
    tonalidade: 'Cromática',
    compasso: '4/4',
    andamento: 'Lento e Controlado',
    nivel: 'Intermediário',
    faseOrquestra: 2,
    conceitos: ['Cromatismo', 'Deslizamento de Dedo (1-1, 2-2)', 'Sustenidos e Bemóis'],
    dificuldades: ['Eliminar o escorregamento exagerado mantendo o semitom exato'],
    prerequisitos: ['Escalas Maiores (Lições 90-98)'],
    descricao: 'Somente o 1º e 2º dedos passam de uma nota para a seguinte. A única exceção é na corda Mi para o Si bequadro.'
  },
  {
    numero: 111,
    pagina: 45,
    secao: 'Grandes Obras de Encerramento da 1ª Posição',
    titulo: 'Minueto de Boccherini (Moderato e Grazioso)',
    posicao: '1ª Posição',
    tecnicaArco: 'Trinados curtos (tr) e staccato gracioso',
    tecnicaMaoEsquerda: 'Ornamentação com trilos e dedilhado em Lá Maior',
    tonalidade: 'Lá Maior (Trio em Ré Maior)',
    compasso: '3/4',
    andamento: 'Moderato e Grazioso',
    nivel: 'Intermediário',
    faseOrquestra: 3,
    compositor: 'L. Boccherini',
    conceitos: ['Minueto Clássico', 'Trinado (tr)', 'Trio Intermediário', 'Forma Rondo/Minueto'],
    dificuldades: ['Execução leve do trinado no 1º tempo sem atrasar o ritmo da orquestra'],
    prerequisitos: ['Escala de Lá Maior (Lição 93) e Lições 1-110'],
    descricao: 'Marco pedagógico do método Schmoll! Encerra a primeira grande fase antes dos estudos de arco e posições.'
  },
  {
    numero: 112,
    pagina: 46,
    secao: 'Grandes Obras de Encerramento da 1ª Posição',
    titulo: 'Minueto em Sol de L. van Beethoven',
    posicao: '1ª Posição',
    tecnicaArco: 'Arco cantabile com grazia, talão e meio de arco',
    tecnicaMaoEsquerda: 'Subdivisão em semicolcheias com afinação refinada',
    tonalidade: 'Sol Maior (Trio em Dó Maior)',
    compasso: '3/4',
    andamento: 'Allegretto con Grazia',
    nivel: 'Intermediário',
    faseOrquestra: 3,
    compositor: 'L. van Beethoven',
    conceitos: ['Estilo Clássico Vienense', 'Contraste Più Mosso', 'D.C. al Fim'],
    dificuldades: ['Uniformidade do som no Trio com semicolcheias contínuas'],
    prerequisitos: ['Escala de Sol Maior (Lição 91)'],
    descricao: 'Umas das peças mais populares da literatura de violino. Antes de tocar, executar a Escala de Sol Maior.'
  },
  {
    numero: 113,
    pagina: 47,
    secao: 'Grandes Obras de Encerramento da 1ª Posição',
    titulo: 'Marcha de F. Schubert (Allegro Vivace com Trio)',
    posicao: '1ª Posição',
    tecnicaArco: 'Golpes sfz (Sforzando) e uso da ponta / talão alternados',
    tecnicaMaoEsquerda: 'Mudanças rápidas de corda em Fá e Láb Maior',
    tonalidade: 'Dó Maior / Fá Maior / Lá b Maior',
    compasso: '2/4',
    andamento: 'Allegro Vivace',
    nivel: 'Intermediário',
    faseOrquestra: 3,
    compositor: 'F. Schubert',
    conceitos: ['Sforzando (sfz)', 'Pianissimo (pp) a Fortissimo (ff)', 'Modulação para Láb Maior'],
    dificuldades: ['Ataques secos de sforzando na ponta sem quebrar a qualidade do som'],
    prerequisitos: ['Lição 112'],
    descricao: 'Peça militar e enérgica de Schubert com marcantes dinâmicas de sforzando e modulação no Trio.'
  },

  // SEÇÃO IV: OS 10 PEQUENOS ESTUDOS CLÁSSICOS DO ARCO (Págs 48 - 57)
  {
    numero: 114,
    pagina: 48,
    secao: '10 Estudos Clássicos de Arco',
    titulo: 'Estudo 1: Gran Staccato',
    posicao: '1ª Posição',
    tecnicaArco: 'Na metade do arco, largo e bem destacado (staccato firme)',
    tecnicaMaoEsquerda: 'Articulação de 4º dedo estendido',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Largo',
    nivel: 'Intermediário',
    faseOrquestra: 2,
    conceitos: ['Gran Staccato', 'Ataque de Mordida no Meio do Arco', 'Acentuação Métrica'],
    dificuldades: ['Manter cada nota rigorosamente solta e incisiva sem rigidez no cotovelo'],
    prerequisitos: ['Conclusão das Lições 1 a 113'],
    descricao: 'Primeiro dos 10 estudos clássicos. Tocado na metade do arco com o som bem destacado e enérgico.'
  },
  {
    numero: 115,
    pagina: 49,
    secao: '10 Estudos Clássicos de Arco',
    titulo: 'Estudo 2: Martellato em Lá Menor',
    posicao: '1ª Posição',
    tecnicaArco: 'Martellato na ponta e talão com todo o arco',
    tecnicaMaoEsquerda: 'Acidentes alterados (Dó# na 4ª linha, Dó natural nas outras)',
    tonalidade: 'Lá Menor',
    compasso: '2/4',
    andamento: 'Allegretto',
    nivel: 'Intermediário',
    faseOrquestra: 2,
    conceitos: ['Golpe Martellato', 'Nota Harmônica de Passagem (Pág. 59)', 'Acentuação de Ataque'],
    dificuldades: ['Alternância brusca entre a ponta e o talão mantendo a afinação'],
    prerequisitos: ['Lição 114'],
    descricao: 'Estudo de Martellato. Atenção: Só na 4ª linha aparece DÓ#, nas outras linhas o DÓ é natural e não há nenhum FÁ#.'
  },
  {
    numero: 117,
    pagina: 51,
    secao: '10 Estudos Clássicos de Arco',
    titulo: 'Estudo 4: Saltellato no Meio do Arco',
    posicao: '1ª Posição',
    tecnicaArco: 'Saltellato saltitante aproveitando o pulso e elasticidade do arco',
    tecnicaMaoEsquerda: 'Dedos firmes nas cordas Ré e Sol',
    tonalidade: 'Ré Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Intermediário',
    faseOrquestra: 2,
    conceitos: ['Saltellato', 'Elasticidade da Vara do Arco', 'Variação em Staccato'],
    dificuldades: ['Encontrar o ponto ideal do centro de gravidade do arco para o salto natural'],
    prerequisitos: ['Lição 116 e Escala de Ré Maior (Lição 92)'],
    descricao: 'Tocar no meio do arco marcando bem as notas. Na variação, tocar primeiro staccato e depois saltellato.'
  },
  {
    numero: 119,
    pagina: 53,
    secao: '10 Estudos Clássicos de Arco',
    titulo: 'Estudo 6: Staccato Fracionado em Fá Maior',
    posicao: '1ª Posição',
    tecnicaArco: 'Divisões de arco: 1/2, 1/4, 1/6 e 1/3 para semicolcheias e semínimas',
    tecnicaMaoEsquerda: '1º dedo na corda Mi para Fá natural',
    tonalidade: 'Fá Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Intermediário',
    faseOrquestra: 2,
    conceitos: ['Fracionamento Anatômico do Arco', 'Indicação Micro-Rítmica de Extensão'],
    dificuldades: ['Calcular mentalmente 1/6 do arco para cada semicolcheia'],
    prerequisitos: ['Lição 118 e Escala de Fá Maior (Lição 95)'],
    descricao: 'Estudo avançado de distribuição geométrica do arco. Seguir as 8 regras numéricas marcadas na partitura.'
  },
  {
    numero: 121,
    pagina: 55,
    secao: '10 Estudos Clássicos de Arco',
    titulo: 'Estudo 8: Staccato Prolongado em Sol Maior',
    posicao: '1ª Posição',
    tecnicaArco: '1/3 do arco prolongado para cada nota',
    tecnicaMaoEsquerda: 'Articulação de 4º dedo suspenso',
    tonalidade: 'Sol Maior',
    compasso: '4/4',
    andamento: 'Andante, con moto e largamente',
    nivel: 'Intermediário',
    faseOrquestra: 2,
    conceitos: ['Staccato Prolongado', 'Largamente Cantabile', 'Sustentação de Som'],
    dificuldades: ['Manter a ressonância ampla em andamento lento'],
    prerequisitos: ['Lição 120 e Escala de Sol Maior (Lição 91)'],
    descricao: 'Tocar bem prolongado utilizando exatamente 1/3 do arco para cada nota.'
  },

  // SEÇÃO V: ESTUDO COMPLETO DAS POSIÇÕES E HARMÔNICOS (Págs 58 - 81)
  {
    numero: 124,
    pagina: 58,
    secao: '3ª Posição',
    titulo: 'Iniciação à 3ª Posição na Corda SOL',
    posicao: '3ª Posição',
    tecnicaArco: 'Arco constante nas cordas graves',
    tecnicaMaoEsquerda: '1º dedo ocupa o lugar do 3º dedo da 1ª posição (Nota SI na corda Sol)',
    tonalidade: 'Dó Maior / Sol Maior',
    compasso: '4/4',
    andamento: 'Lento e Moderato',
    nivel: 'Avançado',
    faseOrquestra: 3,
    conceitos: ['Terceira Posição (3ª Pos)', 'Mudança de Referência de Nota Guia', 'Abertura de Falanges'],
    dificuldades: ['Ajustar a distância reduzida dos semitons na região mais alta do braço'],
    prerequisitos: ['Conclusão dos 10 Estudos de Arco (Lições 114-123)'],
    descricao: 'A partir da lição 124 até a 142, fixar a mão esquerda na 3ª Posição. Somente mudar os dedos.'
  },
  {
    numero: 135,
    pagina: 60,
    secao: 'Harmônicos Naturais',
    titulo: 'Sons Harmônicos Naturais (Flautados) nas 4 Cordas',
    posicao: '1ª Posição',
    tecnicaArco: 'Arco rápido e leve perto do espelho',
    tecnicaMaoEsquerda: 'Polpa digital tocando levemente sobre a corda sem apertar no espelho',
    tonalidade: 'Harmônicos Naturais de Sol, Ré, Lá, Mi',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Avançado',
    faseOrquestra: 3,
    conceitos: ['Harmônicos Naturais', 'Nós de Vibração da Corda', 'Som Flautado'],
    dificuldades: ['Se o dedo for apertado contra o espelho, o harmônico desaparece'],
    prerequisitos: ['Lição 134'],
    descricao: 'Harmônicos são sons suaves como os da flauta. Colocar levemente a polpa digital sobre a corda sem força.'
  },
  {
    numero: 143,
    pagina: 62,
    secao: 'Mudança de Posição (1ª para 3ª)',
    titulo: 'Mudança de Posição da 1ª para a 3ª Posição (Dedo Guia)',
    posicao: 'União de Posições',
    tecnicaArco: 'Arco contínuo durante a transição sem interromper o som',
    tecnicaMaoEsquerda: 'Escorregar o 1º dedo suavemente na corda até a 3ª posição',
    tonalidade: 'Ré Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Avançado',
    faseOrquestra: 3,
    conceitos: ['Shift / Portamento', '1º Dedo Guia', 'Deslocamento do Polegar'],
    dificuldades: ['Escorregar o dedo sem criar glissando exagerado e sem endurecer o pulso'],
    prerequisitos: ['Lições 124-142'],
    descricao: 'Escorregar o 1º dedo na corda o mais rápido possível e mantê-lo na 3ª posição. O polegar deve acompanhar.'
  },
  {
    numero: 151,
    pagina: 66,
    secao: '5ª Posição',
    titulo: 'Iniciação à 5ª Posição (Corda Sol, Ré, Lá e Mi)',
    posicao: '5ª Posição',
    tecnicaArco: 'Arco próximo ao cavalete para projeção aguda',
    tecnicaMaoEsquerda: '1º dedo na 5ª posição (lugar do 5º grau da 1ª pos)',
    tonalidade: 'Dó Maior / Fá Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Avançado',
    faseOrquestra: 4,
    conceitos: ['Quinta Posição (5ª Pos)', 'Espaço Reduzido entre Espelho e Cavalete'],
    dificuldades: ['Os dedos ficam muito próximos uns dos outros devido à escala mais curta'],
    prerequisitos: ['Mudança de 1ª para 3ª Posição (Lições 143-150)'],
    descricao: 'Na 5ª Posição, os dedos ficam mais perto do cavalete. Tomar cuidado para nenhuma nota sair desafinada.'
  },
  {
    numero: 181,
    pagina: 72,
    secao: '2ª Posição',
    titulo: 'Introdução à 2ª Posição (Estudada após a 3ª e 5ª)',
    posicao: '2ª Posição',
    tecnicaArco: 'Arco regular',
    tecnicaMaoEsquerda: '1º dedo no lugar do 2º dedo da 1ª posição',
    tonalidade: 'Sol / Ré Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Avançado',
    faseOrquestra: 4,
    conceitos: ['Segunda Posição (2ª Pos)', 'Posição Intermediária de Afinação'],
    dificuldades: ['Sensação de distância anatômica por estar entre a 1ª e 3ª posições'],
    prerequisitos: ['Conclusão da 3ª e 5ª posições (Lições 124-180)'],
    descricao: 'A 2ª posição é estudada depois da 3ª e 5ª por ser pedagogicamente mais exigente na percepção de afinação.'
  },
  {
    numero: 196,
    pagina: 76,
    secao: '4ª Posição',
    titulo: 'Iniciação à 4ª Posição nas Quatro Cordas',
    posicao: '4ª Posição',
    tecnicaArco: 'Arco equilibrado',
    tecnicaMaoEsquerda: '1º dedo no lugar do 4º dedo da 1ª posição',
    tonalidade: 'Ré Maior',
    compasso: '4/4',
    andamento: 'Andante sostenuto con moto',
    nivel: 'Avançado',
    faseOrquestra: 4,
    conceitos: ['Quarta Posição (4ª Pos)', 'Apoio do Calcanhar da Mão no Corpo do Violino'],
    dificuldades: ['A mão começa a encostar no corpo superior do violino'],
    prerequisitos: ['Lição 195'],
    descricao: 'Estudo da 4ª Posição com deslizamento suave do 1º dedo a partir da 1ª posição.'
  },
  {
    numero: 205,
    pagina: 80,
    secao: 'União das Cinco Posições',
    titulo: 'União das 5 Posições (1ª, 2ª, 3ª, 4ª e 5ª Posições Mistas)',
    posicao: 'União de Posições',
    tecnicaArco: 'Arco amplo e expressivo cantabile com harmônicos',
    tecnicaMaoEsquerda: 'Mudança contínua de posição ao longo de toda a extensão do espelho',
    tonalidade: 'Ré Maior / Sol Maior',
    compasso: '4/4',
    andamento: 'Moderato cantabile',
    nivel: 'Avançado',
    faseOrquestra: 4,
    conceitos: ['Domínio Total do Espelho', 'União das 5 Posições', 'Acrobacia Violinística Orquestral'],
    dificuldades: ['Transição fluida entre 1ª, 3ª, 2ª, 4ª e 5ª posições numa mesma frase musical'],
    prerequisitos: ['Lições 124 a 204'],
    descricao: 'Grande síntese da técnica de Schmoll! Une todas as 5 posições em frases de alta expressividade e virtuosismo.'
  },
  {
    numero: 207,
    pagina: 81,
    secao: '6ª Posição',
    titulo: 'Estudo da 6ª Posição nas Cordas Sol, Ré, Lá e Mi',
    posicao: '6ª Posição',
    tecnicaArco: 'Arco rápido na ponta com dinâmicas pianíssimo e forte',
    tecnicaMaoEsquerda: '4º dedo esticado na extensão máxima aguda',
    tonalidade: 'Fá Maior / Sib Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Avançado',
    faseOrquestra: 4,
    conceitos: ['Sexta Posição (6ª Pos)', 'Extensão Solíssimo de Violino Orquestral'],
    dificuldades: ['Espaço milimétrico entre as notas na região mais alta'],
    prerequisitos: ['Lições 205 e 206'],
    descricao: 'Conclusão suprema do método A. Schmoll. Estudo da 6ª posição com dedilhado de extensão aguda nas 4 cordas.'
  }
];

/**
 * Helper search and filter utility functions for Schmoll
 */
export function buscarExerciciosSchmoll(termo: string): ExercícioSchmoll[] {
  if (!termo || termo.trim() === '') return EXERCICIOS_SCHMOLL;
  const q = termo.toLowerCase().trim();
  return EXERCICIOS_SCHMOLL.filter(ex => 
    ex.numero.toString() === q ||
    ex.titulo.toLowerCase().includes(q) ||
    ex.secao.toLowerCase().includes(q) ||
    ex.posicao.toLowerCase().includes(q) ||
    ex.tonalidade.toLowerCase().includes(q) ||
    ex.compasso.toLowerCase().includes(q) ||
    (ex.compositor && ex.compositor.toLowerCase().includes(q)) ||
    ex.conceitos.some(c => c.toLowerCase().includes(q)) ||
    ex.dificuldades.some(d => d.toLowerCase().includes(q)) ||
    ex.descricao.toLowerCase().includes(q)
  );
}

export function filtrarSchmollPorPosicao(posicao: string): ExercícioSchmoll[] {
  if (!posicao || posicao === 'Todas') return EXERCICIOS_SCHMOLL;
  return EXERCICIOS_SCHMOLL.filter(ex => ex.posicao === posicao);
}

export function filtrarSchmollPorNivel(nivel: string): ExercícioSchmoll[] {
  if (!nivel || nivel === 'Todos') return EXERCICIOS_SCHMOLL;
  return EXERCICIOS_SCHMOLL.filter(ex => ex.nivel === nivel);
}

export function filtrarSchmollPorFase(fase: number): ExercícioSchmoll[] {
  if (!fase || fase === 0) return EXERCICIOS_SCHMOLL;
  return EXERCICIOS_SCHMOLL.filter(ex => ex.faseOrquestra === fase);
}
