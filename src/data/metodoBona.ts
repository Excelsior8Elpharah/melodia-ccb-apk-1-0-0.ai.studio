/**
 * P. BONA - MÉTODO COMPLETO PARA DIVISÃO
 * Ilustrações Técnicas e Analíticas por Savino De Benedictis
 * Base de Conhecimento Indexada e Estruturada para a Orquestra
 */

import { ExercícioBona } from '../types';

export interface SecaoPedagogicaBona {
  titulo: string;
  parte: 1 | 2 | 3;
  paginas: string;
  descricao: string;
  objetivos: string[];
  competencias: string[];
  conceitosTeoricos: string[];
  dificuldadesTecnicas: string[];
}

export const ESTRUTURA_PEDAGOGICA_BONA: SecaoPedagogicaBona[] = [
  {
    titulo: 'Introdução Teórica & Métrica Musical',
    parte: 1,
    paginas: 'Páginas 2 a 6',
    descricao: 'Noções fundamentais da métrica musical, origens no Mensuralismo, leitura em 7 claves, intervalos, enharmonia, escalas maiores/menores e modo de solfejar e bater o compasso.',
    objetivos: [
      'Compreender os valores e figuras de notas e pausas.',
      'Identificar compassos simples (2/2, 2/4, 3/4, 4/4) e compostos (6/4, 6/8, 9/8, 12/8).',
      'Dominar as 7 claves da música (Sol, Soprano, Meio-Soprano, Contralto, Tenor, Barítono, Baixo).',
      'Reconhecer intervalos, sons enharmônicos, tonalidades maiores e menores relativas.'
    ],
    competencias: [
      'Leitura à primeira vista de pautas em clave de Sol.',
      'Acentuação métrica correta (tempos fortes e fracos).',
      'Marcação de compasso precisa com as mãos (Modo de bater).'
    ],
    conceitosTeoricos: [
      'Mensuralismo & Barras de Divisão',
      'Unidade de Tempo e Unidade de Compasso',
      'Claves e Correspondência de Âmbito',
      'Intervalos Conjuntos e Disjuntos (Saltos)',
      'Tonalidade, Armação de Clave (# e b)',
      'Escalas Menores Harmônica e Melódica'
    ],
    dificuldadesTecnicas: [
      'Controle da velocidade no solfejo Lento.',
      'Sincronização entre voz e batida de mão.',
      'Pronúncia contínua das vogais no solfejo (Ex: Do-o-o-o).'
    ]
  },
  {
    titulo: 'Primeira Parte: Ritmos Elementares em Compasso Quaternário Simples (4/4 ou C)',
    parte: 1,
    paginas: 'Páginas 7 a 18 (Exercícios 1 a 74)',
    descricao: 'Estudo progressivo em compasso 4/4 explorando graus conjuntos, saltos progressivos (3ª até 10ª e compostos), pausas intercaladas, contratempos (ritmo acéfalo), ponto simples/dobrado, ligaduras, síncopas e fusas.',
    objetivos: [
      'Fixar a leitura de notas na clave de Sol em ordem direta e retrógrada.',
      'Desenvolver afinação mental e precisão de distância nos saltos de intervalo.',
      'Executar ritmos téticos e acéfalos (contratempo) com estabilidade metronômica.',
      'Compreender o efeito do ponto de aumento (simples, dobrado, triplo) e da ligadura de valor.',
      'Dominar síncopas regulares e irregulares.'
    ],
    competencias: [
      'Divisão métrica em Semibreves, Mínimas, Semínimas, Colcheias, Semicolcheias e Fusas.',
      'Precisão na entrada após pausas (ritmo acéfalo).',
      'Sustentação do tempo forte e contratempo sem acelerar.'
    ],
    conceitosTeoricos: [
      'Graus Conjuntos vs Saltos',
      'Saltos de 3ª, 4ª, 5ª, 6ª, 7ª, 8ª, 9ª, 10ª e Intervalos Compostos',
      'Ritmo Tético e Ritmo Acéfalo (Contratempo)',
      'Ponto Simples, Ponto Dobrado, Ponto Triplo',
      'Ligadura de Valor',
      'Síncopa Regular e Irregular'
    ],
    dificuldadesTecnicas: [
      'Saltos de intervalos grandes (8ª a 10ª) sem hesitação.',
      'Contratempos rápidos com pausas de semínima e colcheia.',
      'Manutenção da pulsação nas síncopas sem inverter o tempo forte.'
    ]
  },
  {
    titulo: 'Segunda Parte: Diversas Espécies de Compassos Simples e Compostos',
    parte: 2,
    paginas: 'Páginas 19 a 34 (Exercícios 75 a 98)',
    descricao: 'Desenvolvimento rítmico avançado em compassos 2/2, 2/4, 3/4, 3/8, 6/8, 9/8, 12/8, introdução das tresquiálteras/tercinas, sestinas, variações de andamento e cadências de bravura (a piacere).',
    objetivos: [
      'Transitar fluentemente entre compassos binários, ternários e quaternários simples e compostos.',
      'Dividir tercinas e tresquiálteras com precisão (3 notas no valor de 2).',
      'Dividir sestinas / sesquiálteras (6 notas no valor de 4).',
      'Interpretar marcações de andamento (Largo, Maestoso, Andante, Allegretto, Adagio, Sostenuto).',
      'Executar cadências de bravura sem pulsação rígida (a piacere).'
    ],
    competencias: [
      'Subdivisão interna de tempos nos andamentos vagarosos (Adagio/Largo).',
      'Flexibilidade expressiva nas cadências.',
      'Mudança instantânea de métrica e agógica.'
    ],
    conceitosTeoricos: [
      'Tresquiálteras / Tercinas',
      'Sestinas / Sesquiálteras',
      'Compassos Compostos (6/8, 9/8, 12/8)',
      'Subdivisão de Unidade de Tempo em 3 partes',
      'Andamentos Agógicos (Largo, Andante, Allegro, Adagio)',
      'Cadências de Bravura e "A Piacere"'
    ],
    dificuldadesTecnicas: [
      'Manter 3 notas iguais no tempo (tercinas) sem virar colcheia pontuada.',
      'Rhythm de 6/8 lento vs 6/8 rápido.',
      'Cadência de bravura com agógica expressiva.'
    ]
  },
  {
    titulo: 'Terceira Parte: Recapitulação Geral, Ornamentos e Sinais de Repetição',
    parte: 3,
    paginas: 'Páginas 35 a 60 (Exercícios 99 a 118/Recapitulação Final)',
    descricao: 'Consolidação artística do solfejo. Estudo completo dos ornamentos (Apogiaturas, Mordentes, Grupetos, Trinados), sinais de abreviação, ritornelos, Da Capo, Dal Segno, modulações e síntese orquestral.',
    objetivos: [
      'Interpretar e executar todos os ornamentos tradicionais com clareza.',
      'Dominar a leitura de sinais de abreviação (Bis, Ritornelos, Dal Segno %, Coda 𝄌).',
      'Navegar por mudanças frequentes de tonalidade, fórmula de compasso e andamento numa mesma peça.',
      'Alcançar virtuosismo e facilidade na leitura à primeira vista em nível profissional.'
    ],
    competencias: [
      'Execução leve e graciosa dos ornamentos musicais.',
      'Domínio da estrutura formal da música (forma sonata, rondo, tema e variações).',
      'Prontidão para repertório orquestral complexo.'
    ],
    conceitosTeoricos: [
      'Apogiatura (curta e longa)',
      'Mordente e Grupeto',
      'Trinado e Nota Auxiliar Superior',
      'Sinais de Abreviação de Compasso e Desenho Rítmico',
      'Ritornelo, Bis, Dal Segno %, Coda 𝄌, D.C. al Fine',
      'Modulação e Tonalidades Distantes'
    ],
    dificuldadesTecnicas: [
      'Encaixar a apogiatura e o trinado na pulsação sem atrasar a nota principal.',
      'Acompanhar transposições e modulações rápidas com bemóis/sustenidos na armação.',
      'Manter o fluxo musical durante trocas bruscas de fórmula de compasso.'
    ]
  }
];

export const EXERCICIOS_BONA: ExercícioBona[] = [
  // PARTE 1 - Páginas 7 a 18
  {
    numero: 1,
    parte: 1,
    pagina: 7,
    titulo: 'Escalas de Semibreves em Graus Conjuntos',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Iniciante',
    faseOrquestra: 1,
    conceitos: ['Graus Conjuntos', 'Semibreve', 'Clave de Sol', 'Acentuação Métrica'],
    dificuldades: ['Manutenção do tom por 4 tempos completos', 'Sustentação da pulsação lenta'],
    prerequisitos: ['Conhecimento das notas na Clave de Sol'],
    descricao: 'Apresentação das notas naturais em ordem ascendente e descendente em valores de 4 tempos.'
  },
  {
    numero: 2,
    parte: 1,
    pagina: 7,
    titulo: 'Escala em Mínimas',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Iniciante',
    faseOrquestra: 1,
    conceitos: ['Mínimas', 'Graus Conjuntos', 'Divisão em 2 tempos'],
    dificuldades: ['Marcação uniforme dos tempos 1-2 e 3-4'],
    prerequisitos: ['Exercício 1'],
    descricao: 'Transição da semibreve para mínimas, mantendo o movimento escalar contínuo.'
  },
  {
    numero: 3,
    parte: 1,
    pagina: 7,
    titulo: 'Escala em Semínimas',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Iniciante',
    faseOrquestra: 1,
    conceitos: ['Semínimas', 'Unidade de Tempo', 'Pulsar de 1 tempo'],
    dificuldades: ['Pronúncia clara de cada nota no tempo certo'],
    prerequisitos: ['Exercício 2'],
    descricao: 'Divisão da pulsação básica onde cada semínima equivale a 1 tempo do compasso 4/4.'
  },
  {
    numero: 4,
    parte: 1,
    pagina: 7,
    titulo: 'Escala em Colcheias',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Iniciante',
    faseOrquestra: 1,
    conceitos: ['Colcheias', 'Subdivisão Binária', '2 notas por tempo'],
    dificuldades: ['Agrupamento e clareza na subdivisão do tempo'],
    prerequisitos: ['Exercício 3'],
    descricao: 'Primeira introdução à subdivisão direta da semínima em duas colcheias iguais.'
  },
  {
    numero: 5,
    parte: 1,
    pagina: 7,
    titulo: 'Escala em Semicolcheias',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Básico',
    faseOrquestra: 1,
    conceitos: ['Semicolcheias', 'Subdivisão Quaternária', '4 notas por tempo'],
    dificuldades: ['Velocidade de articulação verbal / solfejo e ritmo constante'],
    prerequisitos: ['Exercício 4'],
    descricao: 'Subdivisão quaternária com 4 semicolcheias para cada batida de semínima.'
  },
  {
    numero: 6,
    parte: 1,
    pagina: 7,
    titulo: 'Saltos de Terça (Mínimas e Semínimas)',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Básico',
    faseOrquestra: 1,
    conceitos: ['Saltos de Terça', 'Intervalos Disjuntos', 'Visão em Linha e Espaço'],
    dificuldades: ['Visualização do intervalo de terça sem ler nota por nota'],
    prerequisitos: ['Exercícios 1-3'],
    descricao: 'Início do treino sistemático de saltos intervalares progressivos.'
  },
  {
    numero: 7,
    parte: 1,
    pagina: 7,
    titulo: 'Saltos de Terça em Semínimas',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Básico',
    faseOrquestra: 1,
    conceitos: ['Saltos de Terça', 'Movimento Ascendente e Descendente'],
    dificuldades: ['Precisão de afinação e pulsação em fluxo rápido de terças'],
    prerequisitos: ['Exercício 6'],
    descricao: 'Variação rítmica acelerada do estudo de terças.'
  },
  {
    numero: 8,
    parte: 1,
    pagina: 7,
    titulo: 'Saltos de Terça em Colcheias',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Básico',
    faseOrquestra: 1,
    conceitos: ['Saltos de Terça', 'Colcheias em Parelha'],
    dificuldades: ['Agilidade de leitura em saltos contínuos'],
    prerequisitos: ['Exercício 7'],
    descricao: 'Combinação da subdivisão em colcheias com o padrão de intervalos de terça.'
  },
  {
    numero: 9,
    parte: 1,
    pagina: 8,
    titulo: 'Saltos de Quarta (Mínimas)',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Básico',
    faseOrquestra: 1,
    conceitos: ['Saltos de Quarta', 'Intervalos Justos'],
    dificuldades: ['Audilização do salto de 4ª (Dó-Fá, Ré-Sol)'],
    prerequisitos: ['Exercícios 6-8'],
    descricao: 'Estudo do intervalo de quarta justa com notas sustentadas em mínimas.'
  },
  {
    numero: 12,
    parte: 1,
    pagina: 8,
    titulo: 'Saltos de Quinta',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Básico',
    faseOrquestra: 1,
    conceitos: ['Saltos de Quinta', 'Intervalo de Quinta Justa'],
    dificuldades: ['Percepção harmônica do salto de 5ª'],
    prerequisitos: ['Exercício 9'],
    descricao: 'Estudo dos saltos de quinta ascendentes e descendentes.'
  },
  {
    numero: 15,
    parte: 1,
    pagina: 9,
    titulo: 'Saltos de Sexta',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Básico',
    faseOrquestra: 1,
    conceitos: ['Saltos de Sexta', 'Sexta Maior e Menor'],
    dificuldades: ['Salto amplo além da oitava central imediata'],
    prerequisitos: ['Exercício 12'],
    descricao: 'Treino de leitura e afinação de intervalos de sexta.'
  },
  {
    numero: 18,
    parte: 1,
    pagina: 9,
    titulo: 'Saltos de Sétima',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Intermediário',
    faseOrquestra: 2,
    conceitos: ['Saltos de Sétima', 'Sétima Maior e Menor'],
    dificuldades: ['Intervalo dissonante que requer audilização firme'],
    prerequisitos: ['Exercício 15'],
    descricao: 'Estudo do salto desafiador de 7ª.'
  },
  {
    numero: 21,
    parte: 1,
    pagina: 9,
    titulo: 'Saltos de Oitava',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Intermediário',
    faseOrquestra: 2,
    conceitos: ['Saltos de Oitava', 'Oitava Justa', 'Mudança de Registro'],
    dificuldades: ['Salto de registro na pauta'],
    prerequisitos: ['Exercício 18'],
    descricao: 'Consolidação da leitura de saltos de oitava exata.'
  },
  {
    numero: 24,
    parte: 1,
    pagina: 10,
    titulo: 'Sucessão dos Saltos Mistas',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Intermediário',
    faseOrquestra: 2,
    conceitos: ['Saltos Variados', 'Terças a Oitavas Combinadas'],
    dificuldades: ['Alternância imprevisível de amplitude de salto'],
    prerequisitos: ['Exercícios 6-23'],
    descricao: 'Exercício de síntese combinando todos os saltos aprendidos de 3ª a 8ª.'
  },
  {
    numero: 27,
    parte: 1,
    pagina: 10,
    titulo: 'Com Saltos de Nona',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Intermediário',
    faseOrquestra: 2,
    conceitos: ['Saltos de Nona', 'Intervalo Composto'],
    dificuldades: ['Ultrapassar os limites de uma oitava na pauta'],
    prerequisitos: ['Exercício 24'],
    descricao: 'Primeira introdução a um intervalo composto (além da oitava).'
  },
  {
    numero: 30,
    parte: 1,
    pagina: 10,
    titulo: 'Intervalos de Décima',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Intermediário',
    faseOrquestra: 2,
    conceitos: ['Intervalo de Décima', 'Terça Composta'],
    dificuldades: ['Amplitude máxima de leitura rápida'],
    prerequisitos: ['Exercício 27'],
    descricao: 'Estudo do salto de 10ª (Oitava + Terça).'
  },
  {
    numero: 38,
    parte: 1,
    pagina: 11,
    titulo: 'Solfejos com Recapitulação e Pausas Intercaladas',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Básico',
    faseOrquestra: 1,
    conceitos: ['Pausas de Semibreve e Mínima', 'Precisão na Contagem do Silêncio'],
    dificuldades: ['Manter a pulsação durante tempos de pausa sem acelerar'],
    prerequisitos: ['Exercícios 1-5'],
    descricao: 'Desenvolvimento do controle do silêncio e contagem interna de pausas.'
  },
  {
    numero: 42,
    parte: 1,
    pagina: 12,
    titulo: 'Ritmo Acéfalo (Em Contratempo)',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Básico',
    faseOrquestra: 2,
    conceitos: ['Contratempo', 'Ritmo Acéfalo', 'Pausa na Parte Forte do Tempo'],
    dificuldades: ['Entrada precisa na parte fraca do tempo após a pausa'],
    prerequisitos: ['Exercício 38'],
    descricao: 'Lição fundamental para dominar o contratempo em colcheias e semínimas.'
  },
  {
    numero: 44,
    parte: 1,
    pagina: 12,
    titulo: 'Ritmo Tético e Exemplo Misto',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Básico',
    faseOrquestra: 2,
    conceitos: ['Ritmo Tético', 'Ritmo Misto', 'Contrastes de Acentuação'],
    dificuldades: ['Alternar entre entradas téticas no tempo forte e contratempos'],
    prerequisitos: ['Exercício 42'],
    descricao: 'Aplicações práticas misturando frases iniciadas no tempo forte e no tempo fraco.'
  },
  {
    numero: 53,
    parte: 1,
    pagina: 14,
    titulo: 'Estudo do Ponto Simples',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Básico',
    faseOrquestra: 2,
    conceitos: ['Ponto de Aumento Simples', 'Semínima Pontuada', 'Mínima Pontuada'],
    dificuldades: ['Calculo do tempo estendido (+50% da figura)'],
    prerequisitos: ['Exercícios 3 e 4'],
    descricao: 'Iniciação ao ritmo pontuado e sua resolução na nota seguinte.'
  },
  {
    numero: 57,
    parte: 1,
    pagina: 14,
    titulo: 'Estudo do Ponto Dobrado',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Intermediário',
    faseOrquestra: 2,
    conceitos: ['Ponto Dobrado', 'Aumento de 75% da Figura'],
    dificuldades: ['Precisão micro-rítmica da nota curta final'],
    prerequisitos: ['Exercício 53'],
    descricao: 'Divisão exata com ponto duplo e notas de valor muito reduzido após o ponto.'
  },
  {
    numero: 59,
    parte: 1,
    pagina: 15,
    titulo: 'A Ligadura de Valor',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Básico',
    faseOrquestra: 2,
    conceitos: ['Ligadura de Valor', 'União de Notas do Mesmo Tom'],
    dificuldades: ['Não rearticular a segunda nota ligada'],
    prerequisitos: ['Exercício 53'],
    descricao: 'Sustentação contínua do som através da barra de compasso ou entre tempos.'
  },
  {
    numero: 61,
    parte: 1,
    pagina: 16,
    titulo: 'Da Síncopa Regular e Irregular',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Intermediário',
    faseOrquestra: 2,
    conceitos: ['Síncopa Regular', 'Síncopa Irregular', 'Deslocamento de Acento'],
    dificuldades: ['Acentuar a parte fraca prolongada para o tempo forte'],
    prerequisitos: ['Exercício 59'],
    descricao: 'Estudo aprofundado do efeito sincopado em várias configurações rítmicas.'
  },
  {
    numero: 74,
    parte: 1,
    pagina: 18,
    titulo: 'Escalas em Fusas (Fim da I Parte)',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Lento',
    nivel: 'Intermediário',
    faseOrquestra: 2,
    conceitos: ['Fusas', 'Subdivisão de 8 notas por tempo', 'Síntese da 1ª Parte'],
    dificuldades: ['Velocidade extrema de solfejo verbal'],
    prerequisitos: ['Exercícios 1-73'],
    descricao: 'Grande lição de encerramento da Primeira Parte com passagens em fusas.'
  },

  // PARTE 2 - Páginas 19 a 34
  {
    numero: 75,
    parte: 2,
    pagina: 19,
    titulo: 'Introdução aos Compassos Simples e Tresquiálteras (Tercinas)',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Largo',
    nivel: 'Intermediário',
    faseOrquestra: 3,
    conceitos: ['Tresquiálteras', 'Tercinas', '3 notas em 1 tempo'],
    dificuldades: ['Manter as 3 notas rigorosamente iguais sem mancar'],
    prerequisitos: ['Conclusão da Parte 1'],
    descricao: 'Primeiro estudo da Segunda Parte introduzindo grupos ternários em compasso simples.'
  },
  {
    numero: 76,
    parte: 2,
    pagina: 19,
    titulo: 'Tresquiálteras em Tom Menor',
    tonalidade: 'Lá Menor',
    compasso: '4/4',
    andamento: 'Maestoso',
    nivel: 'Intermediário',
    faseOrquestra: 3,
    conceitos: ['Tercinas em Tom Menor', 'Escala Menor', 'Expressividade Maestosa'],
    dificuldades: ['Alteração do 7º grau (Sol#) dentro do padrão de tercinas'],
    prerequisitos: ['Exercício 75'],
    descricao: 'Combinação de terças, saltos e tercinas na tonalidade de Lá menor.'
  },
  {
    numero: 77,
    parte: 2,
    pagina: 20,
    titulo: 'Compasso Binário Simples (2/2 ou Cut Time)',
    tonalidade: 'Sol Maior',
    compasso: '2/2',
    andamento: 'Andante',
    nivel: 'Intermediário',
    faseOrquestra: 3,
    conceitos: ['Compasso 2/2', 'Mínima como Unidade de Tempo', '2 tempos por compasso'],
    dificuldades: ['Mudar a referência mental da pulsação para a Mínima'],
    prerequisitos: ['Exercício 75'],
    descricao: 'Modo de bater compasso em 2 tempos (Andante em Sol Maior).'
  },
  {
    numero: 79,
    parte: 2,
    pagina: 21,
    titulo: 'Compasso 2/4 (Binário Simples)',
    tonalidade: 'Fá Maior',
    compasso: '2/4',
    andamento: 'Andantino',
    nivel: 'Intermediário',
    faseOrquestra: 3,
    conceitos: ['Compasso 2/4', 'Semínima como UT', 'Sinal Si Bemol na Armação'],
    dificuldades: ['Agilidade e leveza no 2/4'],
    prerequisitos: ['Exercício 77'],
    descricao: 'Estudo fluente em Fá maior no compasso de dois quartos.'
  },
  {
    numero: 81,
    parte: 2,
    pagina: 22,
    titulo: 'Compasso Ternário Simples (3/4)',
    tonalidade: 'Lá Menor',
    compasso: '3/4',
    andamento: 'Allegro Moderato Assai',
    nivel: 'Intermediário',
    faseOrquestra: 3,
    conceitos: ['Compasso 3/4', 'Marcação Ternária em V (1-2-3)', 'Ritmo de Valsa/Minueto'],
    dificuldades: ['Mover a mão em triangulação de 3 tempos'],
    prerequisitos: ['Exercício 79'],
    descricao: 'Estudo em 3/4 com andamento vivo e acentuação no primeiro tempo.'
  },
  {
    numero: 85,
    parte: 2,
    pagina: 24,
    titulo: 'Compasso Composto 6/8 (Binário Composto)',
    tonalidade: 'Lá Maior',
    compasso: '6/8',
    andamento: 'Adagio',
    nivel: 'Avançado',
    faseOrquestra: 3,
    conceitos: ['Compasso 6/8', 'Semínima Pontuada como UT', 'Subdivisão de 6 Colcheias'],
    dificuldades: ['Contar em 2 tempos compostos ou subdividir em 6 em andamento Adagio'],
    prerequisitos: ['Exercícios 75 e 81'],
    descricao: 'Entrada oficial nos compassos compostos com indicação metodológica de Savino De Benedictis.'
  },
  {
    numero: 87,
    parte: 2,
    pagina: 25,
    titulo: 'Compasso Composto 9/8 (Ternário Composto)',
    tonalidade: 'Dó Maior',
    compasso: '9/8',
    andamento: 'Moderato Assai',
    nivel: 'Avançado',
    faseOrquestra: 3,
    conceitos: ['Compasso 9/8', '3 Tempos Compostos', '9 Colcheias por Compasso'],
    dificuldades: ['Equilíbrio dos 3 pulsos principais com 3 colcheias cada'],
    prerequisitos: ['Exercício 85'],
    descricao: 'Estudo gracioso do compasso 9/8.'
  },
  {
    numero: 89,
    parte: 2,
    pagina: 26,
    titulo: 'Compasso Composto 12/8 (Quaternário Composto)',
    tonalidade: 'Mi Bemol Maior',
    compasso: '12/8',
    andamento: 'Sostenuto',
    nivel: 'Avançado',
    faseOrquestra: 3,
    conceitos: ['Compasso 12/8', '3 Bemóis na Armação (Si b, Mi b, Lá b)', 'Sostenuto Expressivo'],
    dificuldades: ['Fluxo contínuo de 12 colcheias com dinâmicas amplas'],
    prerequisitos: ['Exercícios 85-87'],
    descricao: 'Domínio do compasso quaternário composto na tonalidade de Mi bemol maior.'
  },
  {
    numero: 93,
    parte: 2,
    pagina: 29,
    titulo: 'Variações e Cadência de Bravura (A Piacere)',
    tonalidade: 'Ré Maior',
    compasso: '2/4',
    andamento: 'Allegretto / A Piacere',
    nivel: 'Avançado',
    faseOrquestra: 4,
    conceitos: ['Cadência de Bravura', 'A Piacere', 'Rubato / Liberdade Agógica'],
    dificuldades: ['Interpretação virtuosística sem perdas na clareza das notas'],
    prerequisitos: ['Exercícios 85-92'],
    descricao: 'Exercício lírico com seção suspensa em cadência solo de virtuosismo.'
  },
  {
    numero: 95,
    parte: 2,
    pagina: 31,
    titulo: 'Estudo das Sestinas / Sesquiálteras',
    tonalidade: 'Si Bemol Maior',
    compasso: '3/4',
    andamento: 'Moderato Assai',
    nivel: 'Avançado',
    faseOrquestra: 4,
    conceitos: ['Sestina', '6 notas no lugar de 4', 'Duplicação de Tercina'],
    dificuldades: ['Uniformidade rápida das 6 notas agrupadas'],
    prerequisitos: ['Exercício 75'],
    descricao: 'Treino exaustivo de sestinas em leitura fluida.'
  },

  // PARTE 3 - Páginas 35 a 60
  {
    numero: 99,
    parte: 3,
    pagina: 35,
    titulo: 'Estudo dos Ornamentos Musicais (Apogiaturas, Mordentes, Grupetos e Trinados)',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Allegro Moderato',
    nivel: 'Avançado',
    faseOrquestra: 4,
    conceitos: ['Apogiatura', 'Mordente', 'Grupeto', 'Trinado'],
    dificuldades: ['Executar os ornamentos com rapidez e graça sem comprometer o tempo principal'],
    prerequisitos: ['Conclusão das Partes 1 e 2'],
    descricao: 'Início da Terceira Parte com guia sistemático de execução de ornamentos clássicos.'
  },
  {
    numero: 103,
    parte: 3,
    pagina: 39,
    titulo: 'Apogiaturas Rápidas em Compasso 12/8',
    tonalidade: 'Lá Bemol Maior',
    compasso: '12/8',
    andamento: 'Maestoso',
    nivel: 'Avançado',
    faseOrquestra: 4,
    conceitos: ['4 Bemóis na Armação', 'Apogiaturas Curtas', 'Textura Orquestral'],
    dificuldades: ['Leitura em tonalidade de Lá b Maior com ornamentação densa'],
    prerequisitos: ['Exercício 99 e 89'],
    descricao: 'Grande lição técnica e artística em tom com quatro bemóis.'
  },
  {
    numero: 108,
    parte: 3,
    pagina: 44,
    titulo: 'Subdivisão em Andamentos Vagarosos (Adagio em Si Maior)',
    tonalidade: 'Si Maior',
    compasso: '4/4',
    andamento: 'Adagio',
    nivel: 'Avançado',
    faseOrquestra: 4,
    conceitos: ['5 Sustenidos na Armação', 'Subdivisão de 8/8 em Adagio', 'Andamento Vagaroso'],
    dificuldades: ['Manter o controle em andamento extremamente lento com muitas alterações'],
    prerequisitos: ['Exercício 99'],
    descricao: 'Sustentação dramática e controle rítmico microscópico em Si Maior (5 sustenidos).'
  },
  {
    numero: 109,
    parte: 3,
    pagina: 45,
    titulo: 'Trinados e Notas Auxiliares Superiores',
    tonalidade: 'Lá Bemol Maior',
    compasso: '6/8',
    andamento: 'Andantino Grazioso',
    nivel: 'Avançado',
    faseOrquestra: 4,
    conceitos: ['Trinado Longo', 'Nota Auxiliar Superior', 'Resolução de Trinado'],
    dificuldades: ['Manutenção da oscilação do trinado em ritmo estrito'],
    prerequisitos: ['Exercício 99'],
    descricao: 'Estudo lírico focado no desenvolvimento da técnica de trinado contínuo.'
  },
  {
    numero: 115,
    parte: 3,
    pagina: 51,
    titulo: 'Estudo sobre Arpejos do Acorde',
    tonalidade: 'Dó Maior',
    compasso: '2/4',
    andamento: 'Allegro con Brio',
    nivel: 'Avançado',
    faseOrquestra: 4,
    conceitos: ['Arpejos', 'Inversões de Acordes', 'Brilho e Articulação'],
    dificuldades: ['Leitura rápida de saltos em arpejo ao longo de toda a extensão'],
    prerequisitos: ['Exercício 99'],
    descricao: 'Estudo brilhante e enérgico focado na arpejação rápida do acorde fundamental e suas inversões.'
  },
  {
    numero: 117,
    parte: 3,
    pagina: 53,
    titulo: 'Sinais de Abreviações, Repetições e Coda',
    tonalidade: 'Dó Maior',
    compasso: '2/4',
    andamento: 'Allegro Mosso',
    nivel: 'Avançado',
    faseOrquestra: 4,
    conceitos: ['Dal Segno %', 'Coda 𝄌', 'Repetição de Desenhos Rítmicos', 'Abreviações'],
    dificuldades: ['Orientação formal rápida com saltos de seção no papel'],
    prerequisitos: ['Exercícios 99-116'],
    descricao: 'Treino prático de navegação em partitura com símbolos formais de repetição.'
  },
  {
    numero: 118,
    parte: 3,
    pagina: 54,
    titulo: 'Repetição de Compassos Inteiros e Desenhos Misto (Recapitulação)',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Allegro Spiritoso',
    nivel: 'Avançado',
    faseOrquestra: 4,
    conceitos: ['Repetição de Compasso //', 'Espírito e Vivacidade', 'Síntese de Técnica'],
    dificuldades: ['Manter o rigor do tempo durante abreviações consecutivas'],
    prerequisitos: ['Exercício 117'],
    descricao: 'Lição final da Terceira Parte integrando todos os sinais analíticos e técnicos do método.'
  }
];

/**
 * Helper search and filter utility functions
 */
export function buscarExerciciosBona(termo: string): ExercícioBona[] {
  if (!termo || termo.trim() === '') return EXERCICIOS_BONA;
  const q = termo.toLowerCase().trim();
  return EXERCICIOS_BONA.filter(ex => 
    ex.numero.toString() === q ||
    ex.titulo.toLowerCase().includes(q) ||
    ex.tonalidade.toLowerCase().includes(q) ||
    ex.compasso.toLowerCase().includes(q) ||
    ex.andamento.toLowerCase().includes(q) ||
    ex.nivel.toLowerCase().includes(q) ||
    ex.conceitos.some(c => c.toLowerCase().includes(q)) ||
    ex.dificuldades.some(d => d.toLowerCase().includes(q)) ||
    ex.descricao.toLowerCase().includes(q)
  );
}

export function filtrarBonaPorNivel(nivel: string): ExercícioBona[] {
  if (!nivel || nivel === 'Todos') return EXERCICIOS_BONA;
  return EXERCICIOS_BONA.filter(ex => ex.nivel === nivel);
}

export function filtrarBonaPorFase(fase: number): ExercícioBona[] {
  if (!fase || fase === 0) return EXERCICIOS_BONA;
  return EXERCICIOS_BONA.filter(ex => ex.faseOrquestra === fase);
}

export function filtrarBonaPorParte(parte: number): ExercícioBona[] {
  if (!parte || parte === 0) return EXERCICIOS_BONA;
  return EXERCICIOS_BONA.filter(ex => ex.parte === parte);
}
