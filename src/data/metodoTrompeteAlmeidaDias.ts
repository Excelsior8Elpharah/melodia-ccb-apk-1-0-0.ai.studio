import { 
  ExercícioTrompeteAlmeidaDias, 
  SecaoPedagogicaTrompeteAlmeidaDias, 
  FundamentoTrompeteAlmeidaDias,
  FaseTabelaTrompeteAlmeidaDias,
  OrnamentoTrompeteAlmeidaDias
} from '../types';

export const FUNDAMENTOS_TROMPETE_ALMEIDA: FundamentoTrompeteAlmeidaDias[] = [
  {
    categoria: 'História & Comparativo de Instrumentos',
    subtitulo: 'Trompete, Cornet, Pocket Trumpet, Flugelhorn, Saxhorn & Melofone',
    conteudo: 'Diferenciação acústica, morfológica e aplicabilidade dos instrumentos de bocal para registros agudos e médios.',
    pontosChave: [
      'Trompete: Tubo cilíndrico de paredes paralelas, timbre brilhante, incisivo e dominador. Afinações em Si♭, Dó, Mi♭, Ré e Fá (Píccolo). Escrito na clave de Sol.',
      'Cornet (Cornetim/Corneta de pistões): Tubo cônico de paredes não paralelas, tubo mais largo, bocal mais fundo com taça encaixada suavemente na garganta. Timbre suave, aveludado e redondo.',
      'Pocket Trumpet (Trompete de bolso): Mesma afinação e comprimento de tubo do trompete comum em Si♭, com voltas oblongas supercompactas.',
      'Flugelhorn (Flügelhorn): Pertence à família das trompas cônicas. Campana maior e mais aberta, timbre aveludado, encorpado e extremamente doce.',
      'Saxhorn & Melofone: Instrumentos cônicos de sopro para preenchimento harmônico intermédio em bandas de música e orquestras de metais.'
    ],
    orientacaoProfessor: 'Explicar ao aluno a diferença de resistência do ar entre instrumentos cilíndricos (trompete) e cônicos (cornet/flugelhorn). No Cornet/Flugel, a projeção exige foco de ar mais homogêneo.'
  },
  {
    categoria: 'Bocal & Escolha Racional',
    subtitulo: 'Anatomia do Bocal: Borda, Taça, Garganta & Back-bore',
    conteudo: 'A escolha do bocal deve ser racional considerando o instrumento, a sonoridade almejada e a constituição física dos lábios do estudante.',
    pontosChave: [
      'Borda / Anel: Borda larga traz conforto; borda fina traz precisão de ataques e flexibilidade.',
      'Taça: Taça funda gera som escuro e encorpado com mais harmônicos graves; taça rasa produz som brilhante e estridente para registros agudos.',
      'Garganta: Orifício de passagem do ar para o back-bore, influenciando diretamente a afinação e a resistência soprada.',
      'Back-bore (Cone de saída): Graduação do cone em relação à taça que determina a estabilidade e uniformidade da afinação.',
      'Modelos Recomendados para Iniciantes: Bach 7C, Weril 7C, Yamaha 10 1/2 ou Yamaha 11C4.'
    ],
    orientacaoProfessor: 'Não permitir que o aluno iniciante use bocais excessivamente rasos (como 3D ou 14A4a) em busca de facilidade nos agudos, pois isso destrói a sonoridade no registro grave e médio.'
  },
  {
    categoria: 'Embocadura & Tensão Muscular',
    subtitulo: 'Posicionamento e Formação dos Músculos Faciais',
    conteudo: 'A tensão para fazer os lábios vibrarem deve partir exclusivamente do trabalho dos músculos da embocadura (comissuras labiais), jamais da pressão do bocal contra a boca.',
    pontosChave: [
      'Posicionamento: Bocal posicionado no centro da boca, apoiado aproximadamente 2/3 no lábio superior e 1/3 no lábio inferior.',
      'Controle do Ar: Não inflar bochechas sob hipótese alguma ao emitir o som.',
      'Respiração na Embocadura: Abertura discreta das extremidades laterais dos lábios para inspirar sem mover o bocal de sua posição fixa central.',
      'Vibração Livre: Manter os lábios relaxados no centro com sustentação firme nos cantos (comissuras).'
    ],
    orientacaoProfessor: 'Monitorar a marca circular vermelha nos lábios após o estudo. Marcas profundas indicam excesso de força da mão direita puxando o instrumento contra a boca.'
  },
  {
    categoria: 'Postura, Sustentação & Manutenção',
    subtitulo: 'Posição do Busto, Dedos, Ângulo de Inclinação e Limpeza',
    conteudo: 'O busto reto assegura a estética visual e a expansão livre da caixa torácica e diafragma.',
    pontosChave: [
      'Postura e Busto: Busto reto desde o primeiro dia. Não inclinar a cabeça nem dobrar o pescoço.',
      'Mão Esquerda e Direita: Mão esquerda suporta todo o peso do instrumento; mão direita fica livre para acionar os pistões com a ponta dos dedos curvados.',
      'Ângulo de Execução: Inclinação do instrumento em cerca de 45º para baixo.',
      'Conservação: Lavar periodicamente com detergente neutro e água morna. Lubrificar válvulas (pistões) com óleo próprio e bombas com graxa sintética.'
    ],
    orientacaoProfessor: 'Garantir que os dedos da mão direita acionem os pistões verticalmente, evitando desgaste lateral nas camisas dos pistos.'
  }
];

export const ORNAMENTOS_TROMPETE_ALMEIDA: OrnamentoTrompeteAlmeidaDias[] = [
  {
    nome: 'Appoggiatura (Breve, Longa, Simples e Dupla)',
    tipo: 'Appoggiatura',
    execucao: 'Nota ou grupo de notas que antecedem a nota real, a 1 tom ou semitom de distância.',
    regraValor: 'Sua duração é subtraída do valor da nota real seguinte.',
    exemplo: 'Pág. 40, Ex. 1 e Pág. 41',
    orientacaoAutor: 'Executar com clareza e precisão, mantendo a afinação exata da nota ornamental antes da nota principal.'
  },
  {
    nome: 'Trinado (tr)',
    tipo: 'Trinado',
    execucao: 'Repetição rápida e alternada de duas notas vizinhas (a nota escrita e a nota superior imediata).',
    regraValor: 'O tempo total do trinado é o da própria nota real escrita. Quanto mais lento o andamento, mais cheio de oscilações.',
    exemplo: 'Pág. 40 e Pág. 41 Ex. 2',
    orientacaoAutor: 'Manter a velocidade da batida dos pistões de forma constante e sem tensionar o pulso ou a embocadura.'
  },
  {
    nome: 'Mordente (Simples, Duplo, Superior e Inferior)',
    tipo: 'Mordente',
    execucao: 'Representado por duas notas em semicolcheias: a primeira igual à nota real e a segunda um tom ou semitom acima ou abaixo.',
    regraValor: 'Tira uma pequena fração do início da nota real, deixando o restante do valor para a nota principal.',
    exemplo: 'Pág. 40 e Pág. 41 Ex. 3',
    orientacaoAutor: 'Executar a digitação de forma seca e ágil, garantindo clareza sem atrasar a métrica do compasso.'
  },
  {
    nome: 'Grupeto (3 ou 4 notas)',
    tipo: 'Grupeto',
    execucao: 'Agrupamento de 3 ou 4 notas dispostas em graus conjuntos em torno da nota principal.',
    regraValor: 'Ocupa uma fração do valor da nota real. Acidentes indicados acima ou abaixo da sinuosa alteram as notas auxiliares.',
    exemplo: 'Pág. 40 e Pág. 41 Ex. 4',
    orientacaoAutor: 'Flutuar suavemente entre a nota superior, nota real e nota inferior com controle diafragmático firme.'
  }
];

export const SECOES_PEDAGOGICAS_TROMPETE: SecaoPedagogicaTrompeteAlmeidaDias[] = [
  {
    moduloNumero: 1,
    titulo: 'Escala Cromática e Tabela de Harmônicos',
    paginas: 'Págs. 7 a 10',
    descricao: 'Apresentação da extensão cromática para Trompete, Cornet e Flugelhorn, posições de pistos e série harmônica em cada uma das 7 combinações.',
    objetivos: [
      'Domínio da mecânica dos 3 pistões e suas 7 posições fundamentais.',
      'Sincronização entre coluna de ar, vírgula de respiração e ataque da nota.',
      'Controle metronômico progressivo em valores gradativamente menores.'
    ],
    fundamentosTecnicos: ['Digitação de pistos 1-2-3', 'Vírgulas de respiração pré-calculadas', 'Controle do metrônomo e marcação do pé sem exageros'],
    conceitosMusicais: ['Escala Cromática', 'Tabela de Harmônicos', 'Metrônomo Interno'],
    orientacoesAutor: [
      'A vírgula sobre a pauta indica a respiração exata. Obter tempo para a respiração na nota precedente para evitar atrasos no ataque seguinte.',
      'Marcar o tempo com o pé suavemente e sincronizar com o metrônomo.',
      'Reduzir as figuras de valor e aumentar a velocidade conforme a assimilação.'
    ],
    dificuldadesRecorrentes: ['Hesitação nas digitações da 6ª posição (1-3) e 7ª posição (1-2-3)', 'Puxar o som com a garganta em vez de usar impulso diafragmático.']
  },
  {
    moduloNumero: 2,
    titulo: 'Exercícios Rítmicos e das Sete Posições',
    paginas: 'Págs. 11 a 14',
    descricao: 'Treinamento de precisão de divisão rítmica praticado obrigatoriamente nas 7 posições de pistões, servindo simultaneamente como estudo de Notas Longas.',
    objetivos: [
      'Precisão matemática na leitura de figuras rítmicas (colcheias, semicolcheias, tercinas, pontilhados).',
      'Esvaziamento muscular do diafragma de baixo para cima como um fole.',
      'Desenvolvimento da resistência labial e sustentação do sopro constante.'
    ],
    fundamentosTecnicos: ['Esvaziamento diafragmático estilo fole', 'Ataque preciso em notas curtas', 'Execução de todas as lições rítmicas repetidas nas 7 posições'],
    conceitosMusicais: ['Notas Longas', 'Divisão Rítmica', 'Independência Rítmica'],
    orientacoesAutor: [
      'O Exercício 1 deve ser praticado como notas longas com sustentação diafragmática total.',
      'As notas mais curtas são essenciais para a definição exata dos agrupamentos rítmicos.',
      'O aluno deve saber LER cada célula rítmica, e não apenas decorar ouvindo o professor.'
    ],
    dificuldadesRecorrentes: ['Perda de sustentação de ar nas semicolcheias rápidas', 'Variação indesejada de afinação na 7ª posição de pistos.']
  },
  {
    moduloNumero: 3,
    titulo: 'Escalas e Arpejos em Todas as Tonalidades',
    paginas: 'Págs. 15 a 27',
    descricao: 'Estudo sistemático das 12 escalas maiores com suas relativas menores melódicas e arpejos correspondentes, aplicando variações de articulação.',
    objetivos: [
      'Mapeamento tonal completo do instrumento até 6 sustenidos e 6 bemóis.',
      'Flexibilidade de articulação (staccato, legato, tenuto, similes).',
      'Expansão progressiva dos limites de registro grave e agudo.'
    ],
    fundamentosTecnicos: ['Transição de armaduras de clave', 'Diferenciação de articulações', 'Igualdade de timbre no grave e agudo'],
    conceitosMusicais: ['12 Escalas Maiores', 'Escalas Menores Melódicas', 'Arpejos Tônicos'],
    orientacoesAutor: [
      'Sempre iniciar a prática diária com um roteiro de escalas e arpejos como aquecimento e expansor de limites.',
      'A indicação "simile" recomenda repetir o padrão de articulação até o término da lição.'
    ],
    dificuldadesRecorrentes: ['Falhas na afinação do Sol# / Láb no registro agudo', 'Mudança na pressão do bocal durante passagens rpidas de arpejos.']
  },
  {
    moduloNumero: 4,
    titulo: 'Intervalos com Síncopas e Contratempos',
    paginas: 'Págs. 28 a 34',
    descricao: 'Desenvolvimento do ouvido intervalar, precisão de saltos (de 3ªs a Oitavas) e acentuação estilística de síncopas ("efeito toque de sino").',
    objetivos: [
      'Emissão precisa sem falhas em saltos de intervalos distantes.',
      'Execução de síncopas com acento inicial incisivo e afilamento gracioso do som.',
      'Segurança rítmica em entradas de contratempo.'
    ],
    fundamentosTecnicos: ['Uso do diafragma para impulsionar saltos', 'Acentuação seca com descompressão', 'Ajuste auditivo da afinação intervalar'],
    conceitosMusicais: ['Intervalos de 3ª a Oitava', 'Síncopa Toque de Sino', 'Contratempo'],
    orientacoesAutor: [
      'Evitar acento secundário ou inchação da nota sincopada. O som deve cair naturalmente como a badalada de um sino.',
      'Treinar o ouvido para distinguir a afinação relativa entre notas sucessivas de graus diferentes.'
    ],
    dificuldadesRecorrentes: ['Tensionar a garganta em saltos de 6ªs e 7ªs', 'Inchar o meio das notas sincopadas.']
  },
  {
    moduloNumero: 5,
    titulo: 'Flexibilidade (Lip Slurs / Flexibilidade Labial)',
    paginas: 'Págs. 35 a 39',
    descricao: 'Exercícios de ligadura de harmônicos executados sem o auxílio da língua, controlando a passagem de notas exclusivamente pelo músculo facial e velocidade do ar.',
    objetivos: [
      'Fortalecimento muscular dos lábios e comissuras faciais.',
      'Maturidade e maleabilidade na troca de registros.',
      'Eliminação do vício de usar a língua para empurrar notas agudas.'
    ],
    fundamentosTecnicos: ['Flexão labial sem golpe de língua', 'Pressão mínima do bocal', 'Velocidade da coluna de ar'],
    conceitosMusicais: ['Lip Slurs', 'Conexão de Harmônicos', 'Maleabilidade Sonora'],
    orientacoesAutor: [
      'A língua só é responsável pelo ataque da primeiríssima nota. As demais notas são ligadas exclusivamente por flexibilidade labial.',
      'Praticar com calma até o exercício soar completamente limpo e isento de ruídos intermediários.'
    ],
    dificuldadesRecorrentes: ['Usar força braçal para pressionar o bocal contra os lábios em vez de aumentar a velocidade do ar', 'Som cortado entre harmônicos.']
  },
  {
    moduloNumero: 6,
    titulo: 'Ornamentos (Appoggiaturas, Trinados, Mordentes & Grupetos)',
    paginas: 'Págs. 40 a 41',
    descricao: 'Definição teórico-prática e exercícios específicos para a ornamentação clássica e refinamento expressivo no trompete.',
    objetivos: [
      'Execução elegante e matemática de notas ornamentais.',
      'Agilidade e independência de digitação de pistos.',
      'Incorporação de colorido melódico no repertório.'
    ],
    fundamentosTecnicos: ['Digitação seca e precisa de pistos', 'Métrica de subtração do valor real', 'Controle da dinâmica ornamental'],
    conceitosMusicais: ['Appoggiatura', 'Trinado', 'Mordente', 'Grupeto'],
    orientacoesAutor: [
      'Ornamentos são notas que dão colorido à melodia. A duração ornamental deve ser subtraída da nota real com perfeita exatidão.',
      'Manter a calma e evitar acelerar o andamento geral da peça ao executar um ornamento.'
    ],
    dificuldadesRecorrentes: ['Atrasar o tempo do compasso por causa do ornamento', 'Trinado arrastado ou fora do ritmo.']
  },
  {
    moduloNumero: 7,
    titulo: 'Estudos Melódicos, Duetos e Trios Harmonizados',
    paginas: 'Págs. 42 a 60',
    descricao: 'Repertório nobre com estudos solo e peças em conjunto em 2 e 3 partes (com linhas escritas em Si♭ e Dó para transposição e integração orquestral).',
    objetivos: [
      'Aplicação de toda a técnica acumulada com expressividade e interpretação.',
      'Desenvolvimento do equilíbrio sonoro e percepção do som do companheiro em duetos e trios.',
      'Domínio da transposição de linhas em Si♭ e Dó.'
    ],
    fundamentosTecnicos: ['Escala dinâmica total de pp a ff', 'Transposição Si♭ / Dó', 'Inversão de vozes pedagógica em aula'],
    conceitosMusicais: ['Interpretação Expressiva', 'Estudos Harmonizados', 'Música de Câmera'],
    orientacoesAutor: [
      'Empregar com segurança a escala total de dinâmica, do pianíssimo ao fortíssimo.',
      'O professor deve inverter a execução das vozes nos duetos para o aluno praticar tanto a melodia quanto o acompanhamento.',
      'Obedeça a linha escrita para a afinação do seu instrumento (Si♭ ou Dó).'
    ],
    dificuldadesRecorrentes: ['Tocar o acompanhamento mais forte que a melodia principal', 'Falhas de afinação ao cruzar vozes no registro médio.']
  }
];

export const TABELA_30_FASES_TROMPETE: FaseTabelaTrompeteAlmeidaDias[] = [
  { fase: 1, cromatid: 'Pág. 7 / 14', mecanismo: 'Pág. 10 (1)(2)', escalasArpejos: 'Pág. 14 (1)(2)', intervalos: 'Pág. 27 Ex. 1', flexibilidade: '-', estudosMelodicos: 'Pág. 41 (1)(2)', faseOrquestra: 1, nivelEstimado: 'Iniciante' },
  { fase: 2, cromatid: 'Pág. 8 Ex. 1', mecanismo: 'Pág. 10 (1)(2)', escalasArpejos: 'Pág. 14 (3)(4)', intervalos: 'Pág. 27 Ex. 2', flexibilidade: 'Pág. 34 Ex. 1', estudosMelodicos: 'Pág. 41 (1)(2)', faseOrquestra: 1, nivelEstimado: 'Iniciante' },
  { fase: 3, cromatid: 'Pág. 8 Ex. 1', mecanismo: 'Pág. 10 (3)', escalasArpejos: 'Pág. 15 (5)(6)(7)', intervalos: 'Pág. 27 Ex. 3', flexibilidade: 'Pág. 34 Ex. 1', estudosMelodicos: 'Pág. 42 (3)', faseOrquestra: 1, nivelEstimado: 'Iniciante' },
  { fase: 4, cromatid: 'Pág. 8 Ex. 1', mecanismo: 'Pág. 10 (4)', escalasArpejos: 'Pág. 16 (8)(9)(10)', intervalos: 'Pág. 28 (4)(5)', flexibilidade: 'Pág. 34 Ex. 1', estudosMelodicos: 'Pág. 42 (4)', faseOrquestra: 1, nivelEstimado: 'Iniciante' },
  { fase: 5, cromatid: 'Pág. 8 Ex. 2', mecanismo: 'Pág. 10 (5)', escalasArpejos: 'Pág. 17 (11)(12)(13)', intervalos: 'Pág. 28 (6)', flexibilidade: 'Pág. 34 Ex. 2', estudosMelodicos: 'Pág. 43 (5)', faseOrquestra: 2, nivelEstimado: 'Básico' },
  { fase: 6, cromatid: 'Pág. 8 Ex. 2', mecanismo: 'Pág. 10 (6)', escalasArpejos: 'Pág. 17 (14)(15)(16)', intervalos: 'Pág. 29 (7)', flexibilidade: 'Pág. 34 Ex. 2', estudosMelodicos: 'Pág. 43 (6)', faseOrquestra: 2, nivelEstimado: 'Básico' },
  { fase: 7, cromatid: 'Pág. 8 Ex. 2', mecanismo: 'Pág. 10 (7)', escalasArpejos: 'Pág. 18 (17)(18)', intervalos: 'Pág. 29 (8)', flexibilidade: 'Pág. 34 Ex. 2', estudosMelodicos: 'Pág. 44 (7)', faseOrquestra: 2, nivelEstimado: 'Básico' },
  { fase: 8, cromatid: 'Pág. 8 Ex. 2', mecanismo: 'Pág. 10 (8)', escalasArpejos: 'Pág. 19 (19)', intervalos: 'Pág. 29 (8)', flexibilidade: 'Pág. 35 Ex. 3', estudosMelodicos: 'Pág. 44 (7)', faseOrquestra: 2, nivelEstimado: 'Básico' },
  { fase: 9, cromatid: 'Pág. 8 Ex. 2', mecanismo: 'Pág. 10 (8)', escalasArpejos: 'Pág. 19 (20)', intervalos: 'Pág. 29 (9)', flexibilidade: 'Pág. 35 Ex. 3', estudosMelodicos: 'Pág. 44 (8)', faseOrquestra: 2, nivelEstimado: 'Básico' },
  { fase: 10, cromatid: 'Pág. 8 Ex. 2', mecanismo: 'Pág. 11 (9)', escalasArpejos: 'Pág. 19 (21)', intervalos: 'Pág. 29 (9)', flexibilidade: 'Pág. 35 Ex. 3', estudosMelodicos: 'Pág. 44 (8)', faseOrquestra: 2, nivelEstimado: 'Básico' },
  { fase: 11, cromatid: 'Pág. 8 Ex. 2', mecanismo: 'Pág. 11 (9)', escalasArpejos: 'Pág. 19 (22)', intervalos: 'Pág. 29 (9)', flexibilidade: 'Pág. 35 Ex. 3', estudosMelodicos: 'Pág. 45 (9)', faseOrquestra: 2, nivelEstimado: 'Básico' },
  { fase: 12, cromatid: 'Pág. 8 Ex. 3', mecanismo: 'Pág. 11 (10)', escalasArpejos: 'Pág. 20 (23)', intervalos: 'Pág. 30 (10)', flexibilidade: 'Pág. 35 Ex. 4', estudosMelodicos: 'Pág. 45 (9)', faseOrquestra: 2, nivelEstimado: 'Básico' },
  { fase: 13, cromatid: 'Pág. 8 Ex. 3', mecanismo: 'Pág. 11 (10)', escalasArpejos: 'Pág. 20 (24)', intervalos: 'Pág. 30 (10)', flexibilidade: 'Pág. 35 Ex. 4', estudosMelodicos: 'Pág. 46 (11)', faseOrquestra: 3, nivelEstimado: 'Intermediário' },
  { fase: 14, cromatid: 'Pág. 8 Ex. 3', mecanismo: 'Pág. 11 (11)', escalasArpejos: 'Pág. 20 (25)(26)', intervalos: 'Pág. 30 (10)', flexibilidade: 'Pág. 35 Ex. 4', estudosMelodicos: 'Pág. 46 (11)', faseOrquestra: 3, nivelEstimado: 'Intermediário' },
  { fase: 15, cromatid: 'Pág. 8 Ex. 3', mecanismo: 'Pág. 11 (11)', escalasArpejos: 'Pág. 21 (27)', intervalos: 'Pág. 30 (11)', flexibilidade: 'Pág. 35 Ex. 4', estudosMelodicos: 'Pág. 45 (10)', faseOrquestra: 3, nivelEstimado: 'Intermediário' },
  { fase: 16, cromatid: 'Pág. 8 Ex. 3', mecanismo: 'Pág. 11 (12)', escalasArpejos: 'Pág. 21 (28)', intervalos: 'Pág. 30 (11)', flexibilidade: 'Pág. 35 Ex. 4', estudosMelodicos: 'Pág. 45 (10)', faseOrquestra: 3, nivelEstimado: 'Intermediário' },
  { fase: 17, cromatid: 'Pág. 8 Ex. 3', mecanismo: 'Pág. 11 (12)', escalasArpejos: 'Pág. 21 (29)(30)', intervalos: 'Pág. 30 (12)', flexibilidade: 'Pág. 35 Ex. 4', estudosMelodicos: 'Pág. 46 (12)', faseOrquestra: 3, nivelEstimado: 'Intermediário' },
  { fase: 18, cromatid: 'Pág. 8 Ex. 4', mecanismo: 'Pág. 11 (13)', escalasArpejos: 'Pág. 22 (31)', intervalos: 'Pág. 30 (12)', flexibilidade: 'Pág. 35 Ex. 4', estudosMelodicos: 'Pág. 46 (12)', faseOrquestra: 3, nivelEstimado: 'Intermediário' },
  { fase: 19, cromatid: 'Pág. 8 Ex. 4', mecanismo: 'Pág. 11 (13)', escalasArpejos: 'Pág. 22 (32)', intervalos: 'Pág. 31 (13)', flexibilidade: 'Pág. 36 Ex. 5', estudosMelodicos: 'Pág. 47 (13)', faseOrquestra: 3, nivelEstimado: 'Intermediário' },
  { fase: 20, cromatid: 'Pág. 8 Ex. 4', mecanismo: 'Pág. 12 (14)', escalasArpejos: 'Pág. 22 (33)(34)', intervalos: 'Pág. 31 (13)', flexibilidade: 'Pág. 36 Ex. 5', estudosMelodicos: 'Pág. 47 (13)', faseOrquestra: 3, nivelEstimado: 'Intermediário' },
  { fase: 21, cromatid: 'Pág. 8 Ex. 4', mecanismo: 'Pág. 12 (14)', escalasArpejos: 'Pág. 23 (35)', intervalos: 'Pág. 31 (14)', flexibilidade: 'Pág. 36 Ex. 5', estudosMelodicos: 'Pág. 47 (14)', faseOrquestra: 4, nivelEstimado: 'Avançado' },
  { fase: 22, cromatid: 'Pág. 8 Ex. 4', mecanismo: 'Pág. 12 (15)', escalasArpejos: 'Pág. 23 (36)', intervalos: 'Pág. 31 (14)', flexibilidade: 'Pág. 36 Ex. 5', estudosMelodicos: 'Pág. 47 (14)', faseOrquestra: 4, nivelEstimado: 'Avançado' },
  { fase: 23, cromatid: 'Pág. 8 Ex. 4', mecanismo: 'Pág. 12 (15)', escalasArpejos: 'Pág. 23 (37)(38)', intervalos: 'Pág. 31 (15)', flexibilidade: 'Pág. 36 Ex. 5', estudosMelodicos: 'Pág. 48 (15)', faseOrquestra: 4, nivelEstimado: 'Avançado' },
  { fase: 24, cromatid: 'Pág. 8 Ex. 5', mecanismo: 'Pág. 12 (16)', escalasArpejos: 'Pág. 24 (39)', intervalos: 'Pág. 31 (15)', flexibilidade: 'Pág. 36 Ex. 5', estudosMelodicos: 'Pág. 48 (15)', faseOrquestra: 4, nivelEstimado: 'Avançado' },
  { fase: 25, cromatid: 'Pág. 8 Ex. 5', mecanismo: 'Pág. 12 (16)', escalasArpejos: 'Pág. 24 (40)', intervalos: 'Pág. 32 (16)', flexibilidade: 'Pág. 37 Ex. 6', estudosMelodicos: 'Pág. 48 (16)', faseOrquestra: 4, nivelEstimado: 'Avançado' },
  { fase: 26, cromatid: 'Pág. 8 Ex. 5', mecanismo: 'Pág. 12 (17)', escalasArpejos: 'Pág. 24 (41)(42)', intervalos: 'Pág. 32 (16)', flexibilidade: 'Pág. 37 Ex. 6', estudosMelodicos: 'Pág. 48 (16)', faseOrquestra: 4, nivelEstimado: 'Avançado' },
  { fase: 27, cromatid: 'Pág. 8 Ex. 5', mecanismo: 'Pág. 12 (17)', escalasArpejos: 'Pág. 25 (43)', intervalos: 'Pág. 32 (17)', flexibilidade: 'Pág. 37 Ex. 6', estudosMelodicos: 'Pág. 49 (17)', faseOrquestra: 4, nivelEstimado: 'Avançado' },
  { fase: 28, cromatid: 'Pág. 8 Ex. 5', mecanismo: 'Pág. 12 (18)', escalasArpejos: 'Pág. 25 (44)', intervalos: 'Pág. 32 (17)', flexibilidade: 'Pág. 37 Ex. 6', estudosMelodicos: 'Pág. 50 (18)', faseOrquestra: 4, nivelEstimado: 'Avançado' },
  { fase: 29, cromatid: 'Pág. 8 Ex. 5', mecanismo: 'Pág. 12 (18)', escalasArpejos: 'Pág. 25 (45)', intervalos: 'Pág. 32 (18)', flexibilidade: 'Pág. 37 Ex. 6', estudosMelodicos: 'Pág. 51 (19)', faseOrquestra: 4, nivelEstimado: 'Avançado' },
  { fase: 30, cromatid: 'Pág. 8 Ex. 5', mecanismo: 'Pág. 12 (18)', escalasArpejos: 'Pág. 25 (46)', intervalos: 'Pág. 32 (18)', flexibilidade: 'Pág. 37 Ex. 6', estudosMelodicos: 'Pág. 52 (20)', faseOrquestra: 4, nivelEstimado: 'Avançado' }
];

export const CATALOGO_EXERCICIOS_TROMPETE: ExercícioTrompeteAlmeidaDias[] = [
  // Módulo 1: Escala Cromática e Harmônicos
  {
    numero: 1,
    modulo: 'Escala Cromática & Harmônicos',
    pagina: 9,
    fase: 1,
    faseOrquestra: 1,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    afinacaoTom: 'Si b',
    titulo: 'Escala Cromática Completa & Tabela de Harmônicos nas 7 Posições',
    tonalidade: 'Cromática',
    compasso: '4/4',
    andamento: '♩ = 60',
    nivel: 'Iniciante',
    conceitos: ['Escala Cromática', '7 Posições de Pistões', 'Vírgula de Respiração'],
    dificuldades: ['Ajuste da afinação nas posições 6 (1-3) e 7 (1-2-3)', 'Emissão sem falhas nos semitons'],
    prerequisitos: ['Embocadura sem pressão excessiva', 'Sustentação diafragmática básica'],
    tecnicaPrincipal: 'Combinação de pistões de 0 a 1-2-3 e controle do fluxo de ar',
    habilidadeDesenvolvida: 'Mapeamento cromático da extensão do instrumento e agilidade nos pistos',
    tempoEstimadoMinutos: 15,
    sugestaoContinuidade: 'Exercícios sobre Escala Cromática 1 a 5 (Pág. 10)',
    descricao: 'Tabela de harmônicos e mapa cromático demonstrando as 7 posições de pistões (1ª sem pistos, 2ª=pisto 2, 3ª=pisto 1, 4ª=pistos 1+2, 5ª=pistos 2+3, 6ª=pistos 1+3, 7ª=pistos 1+2+3).'
  },
  {
    numero: 2,
    modulo: 'Escala Cromática & Harmônicos',
    pagina: 10,
    fase: 2,
    faseOrquestra: 1,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    afinacaoTom: 'Si b',
    titulo: 'Exercício sobre Escala Cromática Nº 1 (Semínimas & Respiração Exata)',
    tonalidade: 'Cromática',
    compasso: '4/4',
    andamento: '♩ = 60 (Símile)',
    nivel: 'Iniciante',
    conceitos: ['Legato Cromático', 'Vírgula de Respiração Exata', 'Sincronia do Pé com Metrônomo'],
    dificuldades: ['Respirar no tempo da nota anterior sem atrasar o ataque seguinte'],
    prerequisitos: ['Módulo 1 - Tabela de Harmônicos'],
    tecnicaPrincipal: 'Articulação macia com vírgula de respiração pré-marcada',
    habilidadeDesenvolvida: 'Controle do tempo de respiração e fluência nas posições de pistos',
    tempoEstimadoMinutos: 10,
    sugestaoContinuidade: 'Exercício Cromático Nº 2 (Semicolcheias graduais)',
    descricao: 'Estudo cromático em semínimas e mínimas ligadas, com marcação estrita de vírgulas de respiração para condicionar a reserva de ar sem afetar o andamento.'
  },
  {
    numero: 3,
    modulo: 'Escala Cromática & Harmônicos',
    pagina: 10,
    fase: 5,
    faseOrquestra: 2,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    afinacaoTom: 'Si b',
    titulo: 'Exercício sobre Escala Cromática Nº 4 (Tercinas Cromáticas)',
    tonalidade: 'Cromática',
    compasso: '4/4',
    andamento: '♩ = 72',
    nivel: 'Básico',
    conceitos: ['Tercinas', 'Agilidade nos Pistões', 'Clareza de Emissão'],
    dificuldades: ['Ritmo ternário homogêneo sem acentuar o último elemento do grupo'],
    prerequisitos: ['Exercícios Cromáticos 1, 2 e 3'],
    tecnicaPrincipal: 'Movimento contínuo dos dedos com apoio diafragmático constante',
    habilidadeDesenvolvida: 'Sincronismo fino entre batida do pisto e ataque de ar em ritmo ternário',
    tempoEstimadoMinutos: 12,
    sugestaoContinuidade: 'Exercício Cromático Nº 5 (Semicolcheias e fusa rápida)',
    descricao: 'Aceleração gradual do padrão cromático subdividido em tercinas, exigindo articulação precisa da língua e agilidade rápida dos pistões.'
  },

  // Módulo 2: Exercícios Rítmicos e das Seis/Sete Posições
  {
    numero: 4,
    modulo: 'Exercícios Rítmicos e das Posições',
    pagina: 11,
    fase: 1,
    faseOrquestra: 1,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    afinacaoTom: 'Todas',
    titulo: 'Exercício Rítmico Nº 1 - Sustentação de Notas Longas e Fole Diafragmático',
    tonalidade: 'Série Harmônica de Cada Posição',
    compasso: '4/4',
    andamento: '♩ = 72',
    nivel: 'Iniciante',
    conceitos: ['Notas Longas', 'Fole Diafragmático', 'Esvaziamento Muscular de Baixo para Cima'],
    dificuldades: ['Manter a nota sem oscilação de afinação nem afinar para baixo no final da expiração'],
    prerequisitos: ['Postura e Embocadura corretas'],
    tecnicaPrincipal: 'Sopro em retorno constante usando a capacidade total de ar',
    habilidadeDesenvolvida: 'Estabilização do som, timbre encorpado e fortalecimento da embocadura',
    tempoEstimadoMinutos: 15,
    sugestaoContinuidade: 'Estudo nas 7 Posições com células rítmicas de colcheias',
    descricao: 'Sustentação de som límpido nas 7 posições de pistões usando o reservatório total do fôlego, agindo o diafragma como um fole muscular esvaziando de baixo para cima.'
  },
  {
    numero: 5,
    modulo: 'Exercícios Rítmicos e das Posições',
    pagina: 12,
    fase: 4,
    faseOrquestra: 1,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    afinacaoTom: 'Todas',
    titulo: 'Exercício Rítmico Nº 4 - Divisão com Semicolcheias e Notas Curtas',
    tonalidade: 'Série Harmônica nas 7 Posições',
    compasso: '4/4',
    andamento: '♩ = 72',
    nivel: 'Iniciante',
    conceitos: ['Divisão de Semicolcheia', 'Notas Curtas e Precisas', 'Repetição em 7 Posições'],
    dificuldades: ['Manter clareza e separação nas semicolcheias sem encurtar a semínima final'],
    prerequisitos: ['Exercícios Rítmicos 1, 2 e 3'],
    tecnicaPrincipal: 'Ataque seco de ponta de língua com apoio de ar constante',
    habilidadeDesenvolvida: 'Leitura e precisão de células rítmicas rápidas em todas as posições',
    tempoEstimadoMinutos: 12,
    sugestaoContinuidade: 'Exercícios Rítmicos 5 a 9 (Sincopas e Tercinas em 7 Posições)',
    descricao: 'Treinamento de agrupamentos de semicolcheias que devem ser executados rigorosamente nas 7 combinações de pistões do instrumento.'
  },

  // Módulo 3: Escalas e Arpejos
  {
    numero: 6,
    modulo: 'Escalas e Arpejos',
    pagina: 16,
    fase: 1,
    faseOrquestra: 1,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    afinacaoTom: 'Si b',
    titulo: 'Escala e Arpejo em Dó Maior e Lá menor Melódica (Variações de Articulação)',
    tonalidade: 'Dó Maior / Lá menor',
    compasso: '4/4',
    andamento: '♩ = 60',
    nivel: 'Iniciante',
    conceitos: ['Escala Maior', 'Relativa Menor Melódica', 'Variação de Articulação Simile'],
    dificuldades: ['Articular de forma idêntica em toda a extensão subindo e descendo'],
    prerequisitos: ['Módulo 1 e Módulo 2'],
    tecnicaPrincipal: 'Passagem fluida de oitava com variação de staccato e legato',
    habilidadeDesenvolvida: 'Memorização da clave natural (sem acidentes) e arpejos tônicos',
    tempoEstimadoMinutos: 15,
    sugestaoContinuidade: 'Escala em Fá Maior e Ré menor (Pág. 17)',
    descricao: 'Estudo da escala de Dó Maior e Lá menor melódica com variações de ligaduras de duas em duas e notas destacadas com indicação de continuidade "simile".'
  },
  {
    numero: 7,
    modulo: 'Escalas e Arpejos',
    pagina: 19,
    fase: 5,
    faseOrquestra: 2,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    afinacaoTom: 'Si b',
    titulo: 'Escala e Arpejo em Si♭ Maior e Sol menor Melódica (Lições 11 a 14)',
    tonalidade: 'Si♭ Maior / Sol menor',
    compasso: '4/4 e 3/4',
    andamento: '♩ = 72',
    nivel: 'Básico',
    conceitos: ['Armadura com 2 Bemóis (Si♭, Mi♭)', 'Escala Menor Melódica', 'Pontilhado Rítmico'],
    dificuldades: ['Ajuste da afinação do Mi♭ (2ª posição) no registro grave e médio'],
    prerequisitos: ['Escalas de Dó, Fá e Sol Maior'],
    tecnicaPrincipal: 'Controle de afinação do Mi♭ e transição de arpejos',
    habilidadeDesenvolvida: 'Domínio da tonalidade natural do trompete em Si♭ com agilidade',
    tempoEstimadoMinutos: 15,
    sugestaoContinuidade: 'Escala em Ré Maior e Si menor (Pág. 20)',
    descricao: 'Tonalidade fundamental do trompete em Si♭ (som real Lá♭), exercitando a escala maior, relativa menor melódica e arpejos com articulações combinadas.'
  },
  {
    numero: 8,
    modulo: 'Escalas e Arpejos',
    pagina: 21,
    fase: 19,
    faseOrquestra: 3,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    afinacaoTom: 'Si b',
    titulo: 'Escala e Arpejo em Mi♭ Maior em Tercinas (Lições 19 a 22)',
    tonalidade: 'Mi♭ Maior / Dó menor',
    compasso: '4/4',
    andamento: '♩ = 80',
    nivel: 'Intermediário',
    conceitos: ['3 Bemóis (Si♭, Mi♭, Lá♭)', 'Tercinas de Arpejos', 'Expansão ao Agudo'],
    dificuldades: ['Ataque limpo do Lá♭ agudo e manutenção do impulso do ar'],
    prerequisitos: ['Escalas até 2 bemóis'],
    tecnicaPrincipal: 'Articulação em tercinas com salto de arpejo rápido',
    habilidadeDesenvolvida: 'Fluência em tonalidades com bemóis e extensão até o Sol/Lá agudo',
    tempoEstimadoMinutos: 18,
    sugestaoContinuidade: 'Escala em Lá Maior e Fá# menor (Pág. 22)',
    descricao: 'Aprofundamento técnico na tonalidade de Mi♭ Maior usando agrupamentos de tercinas para desenvolver a velocidade dos pistões e o arpejo ascendente.'
  },

  // Módulo 4: Intervalos com Síncopas e Contratempos
  {
    numero: 9,
    modulo: 'Intervalos',
    pagina: 29,
    fase: 1,
    faseOrquestra: 1,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    afinacaoTom: 'Si b',
    titulo: 'Intervalos de Terça Nº 1, 2 e 3 (Ajuste Intervalar e Conexão de Ar)',
    tonalidade: 'Dó Maior / Sol Maior',
    compasso: '4/4',
    andamento: '♩ = 60',
    nivel: 'Iniciante',
    conceitos: ['Intervalo de Terça', 'Ajuste Auditivo', 'Impulso Diafragmático'],
    dificuldades: ['Emissão limpa na mudança de nota sem "pipocar" ou falhar o som intermediário'],
    prerequisitos: ['Escala Cromática e Rítmica básica'],
    tecnicaPrincipal: 'Flexão muscular labial suave mantendo a coluna de ar ligada',
    habilidadeDesenvolvida: 'Percepção da distância de 3ªs e precisão de embocadura',
    tempoEstimadoMinutos: 12,
    sugestaoContinuidade: 'Intervalos de Quarta (Pág. 30)',
    descricao: 'Exercícios focados no intervalo de terça maior e menor, desenvolvendo a sustentação do diafragma nos saltos e a precisão da afinação relativa.'
  },
  {
    numero: 10,
    modulo: 'Intervalos',
    pagina: 31,
    fase: 13,
    faseOrquestra: 3,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    afinacaoTom: 'Si b',
    titulo: 'Intervalos de Quinta com Síncopas "Toque de Sino" (Nº 7, 8 e 9)',
    tonalidade: 'Dó Maior / Sol Maior',
    compasso: '4/4 e 3/4',
    andamento: '♩ = 72',
    nivel: 'Intermediário',
    conceitos: ['Intervalo de Quinta', 'Síncopa Toque de Sino', 'Afilamento do Som'],
    dificuldades: ['Acentuar o início da nota sincopada sem inchar o meio ou empurrar com a garganta'],
    prerequisitos: ['Intervalos de Terça e Quarta'],
    tecnicaPrincipal: 'Ataque incisivo seguido de leve descompressão do ar ("estilo sino")',
    habilidadeDesenvolvida: 'Controle dinâmico da síncopa e afinação de saltos de 5ª justa',
    tempoEstimadoMinutos: 15,
    sugestaoContinuidade: 'Intervalos de Sexta e Sétima (Págs. 32-33)',
    descricao: 'Combinação de saltos de quinta com ritmos sincopados. O autor instrui acentuar a nota no ataque e deixar o som afilar suavemente como a badalada de um sino.'
  },

  // Módulo 5: Flexibilidade (Lip Slurs)
  {
    modulo: 'Flexibilidade',
    numero: 11,
    pagina: 36,
    fase: 2,
    faseOrquestra: 1,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    afinacaoTom: 'Todas',
    titulo: 'Exercício Misto de Flexibilidade Nº 1 e 2 (Ligadura de Harmônicos sem Língua)',
    tonalidade: 'Série Harmônica Aberta',
    compasso: '4/4',
    andamento: '♩ = 80',
    nivel: 'Iniciante',
    conceitos: ['Lip Slurs', 'Ligadura de Harmônicos', 'Ausência de Golpe de Língua'],
    dificuldades: ['Mudança de nota apenas com lábio e ar, sem usar a língua após o 1º ataque'],
    prerequisitos: ['Fortalecimento básico de embocadura'],
    tecnicaPrincipal: 'Alteração da velocidade da coluna de ar e flexão dos músculos faciais',
    habilidadeDesenvolvida: 'Maleabilidade de lábios, agilidade em ligaduras e eliminação de ruídos',
    tempoEstimadoMinutos: 15,
    sugestaoContinuidade: 'Flexibilidade em Semicolcheias e Tercinas (Nº 3 e 4, Pág. 37)',
    descricao: 'Primeiros estudos de flexibilidade labial cobrindo os harmônicos fundamentais de cada posição. A língua só articula a primeira nota do compasso.'
  },
  {
    modulo: 'Flexibilidade',
    numero: 12,
    pagina: 38,
    fase: 19,
    faseOrquestra: 3,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    afinacaoTom: 'Todas',
    titulo: 'Exercício Misto de Flexibilidade Nº 5 em Piano (pp a p)',
    tonalidade: 'Série Harmônica nas 7 Posições',
    compasso: '4/4',
    andamento: '♩ = 80',
    nivel: 'Intermediário',
    conceitos: ['Flexibilidade em Pianíssimo', 'Controle do Fluxo de Ar Rápido', 'Resistência Labial'],
    dificuldades: ['Manter as ligaduras de harmônicos limpas tocando em volume baixo (piano)'],
    prerequisitos: ['Flexibilidade Nº 1 a 4'],
    tecnicaPrincipal: 'Sustentação muscular máxima com passagem mínima de ar em alta velocidade',
    habilidadeDesenvolvida: 'Domínio extremo do pianíssimo e refinamento do controle labial',
    tempoEstimadoMinutos: 15,
    sugestaoContinuidade: 'Flexibilidade Nº 6 em Tercinas Rápida (Pág. 39)',
    descricao: 'Estudo avançado de flexibilidade executado na dinâmica piano (p). Desenvolve o fortalecimento dos músculos faciais sem recorrer ao volume estridente.'
  },

  // Módulo 6: Ornamentos
  {
    modulo: 'Ornamentos',
    numero: 13,
    pagina: 41,
    fase: 15,
    faseOrquestra: 3,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    afinacaoTom: 'Si b',
    titulo: 'Exercícios de Ornamentos: Appoggiaturas, Trinados, Mordentes & Grupetos',
    tonalidade: 'Dó Maior / Sol Maior',
    compasso: 'Vários (3/4, 4/4)',
    andamento: 'Moderato',
    nivel: 'Intermediário',
    conceitos: ['Appoggiatura Breve', 'Trinado Mantido', 'Mordente Seco', 'Grupeto de 4 Notas'],
    dificuldades: ['Não atrasar a métrica do compasso ao inserir a nota ornamental'],
    prerequisitos: ['Módulos de Escalas e Intervalos concluídos'],
    tecnicaPrincipal: 'Digitação ultra-rápida e precisa dos pistões com impulso diafragmático firme',
    habilidadeDesenvolvida: 'Ornamentação erudita clássica e refinamento de fraseado',
    tempoEstimadoMinutos: 20,
    sugestaoContinuidade: 'Aplicação de ornamentos nos Estudos Melódicos (Págs. 42-60)',
    descricao: 'Lições práticas dedicadas a cada figura de ornamentação. O estudante aprende a subtrair o valor exato da nota real mantendo a expressão melódica.'
  },

  // Módulo 7: Estudos Melódicos e Harmonizados
  {
    modulo: 'Estudos Melódicos e Harmonizados',
    numero: 14,
    pagina: 43,
    fase: 1,
    faseOrquestra: 1,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    afinacaoTom: 'Si b e Dó',
    titulo: 'Estudo Melódico Nº 1 em Dó Maior e Nº 2 em Lá menor (Legato e Expressão)',
    tonalidade: 'Dó Maior / Lá menor',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Iniciante',
    conceitos: ['Legato Melódico', 'Fraseado Musical', 'Acentuação Dinâmica'],
    dificuldades: ['Manter a continuidade do som legato entre notas com digitações distantes'],
    prerequisitos: ['Módulos 1, 2 e 3 em nível inicial'],
    tecnicaPrincipal: 'Passagem de ar ininterrupta com frases cantadas',
    habilidadeDesenvolvida: 'Musicalidade, sonoridade expressiva e interpretação de linhas cantábiles',
    tempoEstimadoMinutos: 15,
    sugestaoContinuidade: 'Estudo em Conjunto Nº 3 (Dueto em Dó e Si♭)',
    descricao: 'Primeiros estudos solo focados em canto legato e fraseado. Prepara o aluno para a condução melódica na orquestra.'
  },
  {
    modulo: 'Estudos Melódicos e Harmonizados',
    numero: 15,
    pagina: 44,
    fase: 3,
    faseOrquestra: 1,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    afinacaoTom: 'Si b e Dó',
    titulo: 'Estudo em Conjunto Nº 3 - Dueto Harmonizado com Transposição Si♭/Dó',
    tonalidade: 'Fá Maior / Dó Maior (Real)',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Iniciante',
    conceitos: ['Dueto Harmonizado', 'Linhas em Dó e Si♭', 'Equilíbrio Melodia / Acompanhamento'],
    dificuldades: ['Manter a voz de acompanhamento em dinâmica inferior à voz principal'],
    prerequisitos: ['Leitura segura e afinação estável'],
    tecnicaPrincipal: 'Ajuste de afinação harmônica e escuta do parceiro de dueto',
    habilidadeDesenvolvida: 'Percepção polifônica, afinação em conjunto e flexibilidade de transposição',
    tempoEstimadoMinutos: 20,
    sugestaoContinuidade: 'Estudo em Conjunto Nº 4 (Andante, Pág. 45)',
    descricao: 'Peça a duas vozes com partitura separada para instrumentos em Si♭ e em Dó. O professor deve inverter as partes com o aluno durante a aula.'
  },
  {
    modulo: 'Estudos Melódicos e Harmonizados',
    numero: 16,
    pagina: 46,
    fase: 11,
    faseOrquestra: 2,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    afinacaoTom: 'Si b',
    titulo: 'Estudo Melódico Nº 5 (Voxman) e Nº 6 (Karl Rinderspacher em Mi menor)',
    compositor: 'Voxman / Karl Rinderspacher',
    tonalidade: 'Sol Maior / Mi menor',
    compasso: '3/4',
    andamento: 'Allegro / Andante',
    nivel: 'Básico',
    conceitos: ['Contraste de Andamentos', 'Expressão Romântica', 'Crescendo e Rallentando'],
    dificuldades: ['Interpretação dos matizes de dinâmica e desaceleração final (rall.)'],
    prerequisitos: ['Escalas de Sol Maior e Mi menor'],
    tecnicaPrincipal: 'Variabilidade de velocidade de sopro e expressão melódica',
    habilidadeDesenvolvida: 'Controle do tempo rubato e musicalidade refinada em peças de autores clássicos',
    tempoEstimadoMinutos: 20,
    sugestaoContinuidade: 'Estudo Melódico Nº 7 em Sol menor (G. Bizet - Carmen, Pág. 47)',
    descricao: 'Estudos nobres da literatura internacional de metais. O Estudo Nº 5 de Voxman trabalha agilidade em 3/4 e o Nº 6 de Rinderspacher exige profundidade em Mi menor.'
  },
  {
    modulo: 'Estudos Melódicos e Harmonizados',
    numero: 17,
    pagina: 47,
    fase: 13,
    faseOrquestra: 3,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    compositor: 'Georges Bizet',
    afinacaoTom: 'Si b',
    titulo: 'Estudo Melódico Nº 7 em Sol menor (Tema Marcial de Carmen - G. Bizet)',
    tonalidade: 'Sol menor',
    compasso: '2/4',
    andamento: 'Marcial',
    nivel: 'Intermediário',
    conceitos: ['Estilo Marcial', 'Articulação Staccato Seca', 'Fine e D.C. al Fine'],
    dificuldades: ['Manter o caráter marcial sem endurecer a embocadura'],
    prerequisitos: ['Escala e Arpejo de Sol menor'],
    tecnicaPrincipal: 'Ataques incisivos de ponta de língua com apoio do ar sustentado',
    habilidadeDesenvolvida: 'Interpretação de repertório operístico adaptado para metais',
    tempoEstimadoMinutos: 20,
    sugestaoContinuidade: 'Estudo em Conjunto Nº 8 (Tema Tradicional Grazioso, Pág. 48)',
    descricao: 'Apresentação do famoso tema da ópera Carmen de Bizet, exigindo ritmo marcial firme, articulação limpa e contraste de dinâmicas entre f e mp.'
  },
  {
    modulo: 'Estudos Melódicos e Harmonizados',
    numero: 18,
    pagina: 51,
    fase: 29,
    faseOrquestra: 4,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    compositor: 'Ludwig van Beethoven',
    afinacaoTom: 'Si b e Dó',
    titulo: 'Estudo em Conjunto Nº 11 em Trio Harmonizado (L. v. Beethoven - Tempo Comodo)',
    tonalidade: 'Fá Maior / Si♭ Maior',
    compasso: '3/4',
    andamento: 'Tempo Comodo',
    nivel: 'Avançado',
    conceitos: ['Trio de Metais', 'Harmonização Clássica', '1ª e 2ª Casas de Repetição'],
    dificuldades: ['Afinação de triplas vozes e homogeneidade no timbre entre os instrumentos'],
    prerequisitos: ['Duetos e estudos harmonizados anteriores'],
    tecnicaPrincipal: 'Fusão de timbres e articulação conjunta perfeita',
    habilidadeDesenvolvida: 'Liderança em naipes de trompetes e escuta polifônica avançada',
    tempoEstimadoMinutos: 25,
    sugestaoContinuidade: 'Estudo em Conjunto Nº 12 - Lago do Cisne (Tchaikovsky, Pág. 52)',
    descricao: 'Trio harmonizado extraído da obra de Beethoven, projetado para prática em grupo de trompetes, cornets ou flugelhorns, com partituras adaptadas para afinação em Dó e Si♭.'
  },
  {
    modulo: 'Estudos Melódicos e Harmonizados',
    numero: 19,
    pagina: 52,
    fase: 30,
    faseOrquestra: 4,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    compositor: 'P. I. Tchaikovsky',
    afinacaoTom: 'Si b e Dó',
    titulo: 'Estudo em Conjunto Nº 12 - Tema do Lago do Cisne (P. I. Tchaikovsky)',
    tonalidade: 'Lá menor / Ré menor',
    compasso: '4/4',
    andamento: 'Andante Cantabile',
    nivel: 'Avançado',
    conceitos: ['Repertório Sinfônico', 'Grandioso Crescendo', 'Legato Cantábile'],
    dificuldades: ['Manter a qualidade lírica do tema durante picos de intensidade expressiva'],
    prerequisitos: ['Estudo em Trio de Beethoven'],
    tecnicaPrincipal: 'Expressão dramática sinfônica com projeção sonora nobre',
    habilidadeDesenvolvida: 'Prontidão orquestral para execução de solos e tuttis sinfônicos',
    tempoEstimadoMinutos: 25,
    sugestaoContinuidade: 'Estudos Avançados de Marco Bordogni e Vladislav Blazhevich (Págs. 56-60)',
    descricao: 'Arranjo sinfônico do célebre tema de Tchaikovsky (Lago do Cisne) para naipe de metais, exigindo grande profundidade emocional, afinação irrepreensível e dinâmica expansiva.'
  },
  {
    modulo: 'Estudos Melódicos e Harmonizados',
    numero: 20,
    pagina: 56,
    fase: 30,
    faseOrquestra: 4,
    instrumentoAplicavel: 'Comum (Trompete, Cornet, Flugelhorn)',
    compositor: 'Marco Bordogni / Vladislav Blazhevich',
    afinacaoTom: 'Si b',
    titulo: 'Estudo Melódico Nº 16 em Sol♭ Maior (Bordogni) & Nº 20 em Ré menor (Blazhevich)',
    tonalidade: 'Sol♭ Maior / Ré menor',
    compasso: '3/4 e 4/4',
    andamento: 'Andante cantabile / Con moto',
    nivel: 'Avançado',
    conceitos: ['Bel Canto no Trompete', 'Tonalidades Distantes (6 Bemóis)', 'Cromatismo Virtuoso'],
    dificuldades: ['Leitura fluida em Sol♭ Maior e modulações expressivas sem perder o pulso'],
    prerequisitos: ['Domínio de todas as 30 fases do Método'],
    tecnicaPrincipal: 'Bel canto em metais, agilidade cromática e controle do rubato',
    habilidadeDesenvolvida: 'Virtuosismo, musicalidade de nível conservatório e preparo acadêmico',
    tempoEstimadoMinutos: 30,
    sugestaoContinuidade: 'Métodos Complementares: Arban, Clarke, Bordogni 43 Bel Canto e Blazhevich 70 Etudes',
    descricao: 'Clímax do Método Almeida Dias. Reúne o lirismo do Bel Canto de Marco Bordogni com a complexidade cromática dos estudos de Vladislav Blazhevich, preparando o instrumentista para avaliações de alto nível.'
  }
];

export const BIBLIOGRAFIA_TROMPETE = [
  { autor: 'Herbert L. Clarke', obra: 'Technical Studies for the Cornet / Trumpet', aplicacao: 'Agilidade mecânica, escalas rápidas e expansão de registros.' },
  { autor: 'Marco Bordogni', obra: '43 Bel Canto Vocalises (adaptado para Trompete)', aplicacao: 'Desagravamento de sonoridade, fraseado e legato vocal.' },
  { autor: 'Vladislav Blazhevich', obra: '70 Etudes for Trumpet', aplicacao: 'Cromatismos complexos, ritmo moderno e leitura em claves variadas.' },
  { autor: 'Wm. Gower & H. Voxman', obra: 'Advanced Method for Cornet or Trumpet (Vol. 1 & 2)', aplicacao: 'Desenvolvimento técnico completo de duo e repertório.' },
  { autor: 'Jean-Baptiste Arban', obra: 'Complete Conservatory Method for Trumpet (C. Fischer)', aplicacao: 'A bíblia dos metais: articulação dupla/tripla, ornamentos e variações.' }
];
