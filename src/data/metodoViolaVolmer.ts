import { ExercícioViolaVolmer, UnidadePedagogicaViolaVolmer, FundamentoViolaVolmer } from '../types';

export const FUNDAMENTOS_VIOLA_VOLMER: FundamentoViolaVolmer[] = [
  {
    categoria: 'Notação & Clave de Dó na 3ª Linha',
    subtitulo: 'Von der Notenschrift (Alto Clef / C-Schlüssel)',
    conteudo: 'A viola utiliza prioritariamente a Clave de Dó na 3ª linha (C-Schlüssel ou Alto Clef), onde a linha central representa a nota Dó3 (Eingestrichenes C). Quando a tessitura ultrapassa o limite do pentagrama no registro agudo, utiliza-se temporariamente a Clave de Sol (G-Schlüssel na 2ª linha).',
    pontosChave: [
      'Clave de Dó na 3ª linha: Dó3 exato no centro do pentagrama',
      'Extensão natural no pentagrama: Dó2 (C-Saite abaixo do pentagrama) até Sol4 (G-Saite acima)',
      'Mudança fluida para Clave de Sol em posições superiores',
      'Leitura de acidentes sustentados (# / -is) e bemóis (b / -es)'
    ],
    orientacaoProfessor: 'Exigir leitura imediata sem memorizar notas por conversão do violino. O aluno de viola deve visualizar diretamente o Dó central na 3ª linha.'
  },
  {
    categoria: 'Anatomia, Afinação & Tamanho da Viola',
    subtitulo: 'Von der Bratsche (C - G - D - A em Quintas Justas)',
    conteudo: 'A viola é a "irmã maior" do violino (Armgeige). Suas 4 cordas são afinadas em Quintas Justas: C2 (Dó2 - corda mais grave), G2 (Sol2), D3 (Ré3) e A3 (Lá3 - corda mais aguda). A sonoridade ideal da viola requer corpo ressonante profundo (Große Bratsche / "Großen Ton").',
    pontosChave: [
      'Cordas da Viola: C (Dó2), G (Sol2), D (Ré3), A (Lá3)',
      'Intervalo entre cordas: Quintas Justas puras',
      'Afinação pelo diapasão no Lá3 (440Hz), ajustando as quintas por duplas ouvidas',
      'Uso correto das cravilhas com apoio do polegar e indicador'
    ],
    orientacaoProfessor: 'Garantir que a viola esteja ajustada ao tamanho físico do aluno para evitar tensão no braço esquerdo na corda Dó (C-Saite).'
  },
  {
    categoria: 'Postura e Pêndulo do Ombro (Schultergelenk)',
    subtitulo: 'Die Haltung der Bratsche und des Bogens',
    conteudo: 'Linha reta entre mão esquerda e antebraço (Abb. 5-6). A rotação do braço esquerdo no ombro funciona como um pênudlo: ao tocar na corda Lá (A-Saite), o cotovelo desloca-se mais para a esquerda sob o instrumento; ao tocar na corda Dó (C-Saite), o cotovelo recua mantendo relaxamento.',
    pontosChave: [
      'Alinhamento reto sem dobrar o pulso esquerdo nem direito',
      'Pêndulo do cotovelo esquerdo sob o corpo da viola conforme a corda tocada',
      'Plano de condução do arco (Strichebene): horizontal no Dó (C), quase vertical no Lá (A)',
      'Polegar do arco levemente curvado tocando na borda do talão (Frosch) conforme Carl Flesch'
    ],
    orientacaoProfessor: 'Inspecionar visualmente o pulso esquerdo em todas as trocas de corda para impedir colapsos ou flexões excessivas.'
  },
  {
    categoria: 'As 5 Griffstellungen (Padrões de Dedilhado na 1ª Posição)',
    subtitulo: 'A Anatomia do Dedilhado da Mão Esquerda (Berta Volmer)',
    conteudo: 'Berta Volmer estrutura o aprendizado da 1ª posição em 5 padrões anatômicos de meio-tom (Griffstellungen/Griffarten): 1ª (Semitom entre 2º e 3º dedos), 2ª (Semitom entre 1º e 2º), 3ª (Semitom entre 3º e 4º), 4ª (Semitom entre corda solta e 1º) e 5ª (Semitom entre corda solta/1º E 3º/4º).',
    pontosChave: [
      '1ª Griffstellung: Semitom entre 2º e 3º dedos (ex: Fá-Sol-Lá-Si♭ / C-D-E-F-G)',
      '2ª Griffstellung: Semitom entre 1º e 2º dedos (ex: C-D♭-E♭-F-G)',
      '3ª Griffstellung: Semitom entre 3º e 4º dedos (ex: C-D-E-F♯-G / D-E-F♯-G♯-A)',
      '4ª Griffstellung: Semitom entre corda solta e 1º dedo (ex: C-D♭-E♭-F-G)',
      '5ª Griffstellung: Meio-tom duplo (ex: C-D♭-E♭-F♯-G)'
    ],
    orientacaoProfessor: 'Exercitar a fixação de cada Griffstellung individualmente antes de mesclar acidentes nas obras melódicas.'
  },
  {
    categoria: 'Die Halbe Lage (Meia Posição na Viola)',
    subtitulo: 'Técnica de Extensão e Troca Preventiva para Viola',
    conteudo: 'Devido ao grande espaço entre trastes na viola, a extensão do 4º dedo pode gerar tensão excessiva. Berta Volmer introduz a Halbe Lage (Meia Posição - Sattellage), deslocando a mão toda meio tom para trás (1º dedo no Ré♭/Lá♭/Mi♭/Si♭), eliminando esforços desnecessários.',
    pontosChave: [
      'Meia Posição (Sattellage): Mão deslocada meio tom para a pestana',
      'Uso do 1º dedo no Ré♭ na corda Dó, evitando esticar o 4º dedo',
      'Transição fluida entre 1ª Posição e Meia Posição',
      'Movimento em bloco da mão sem alterar a curvatura dos dedos'
    ],
    orientacaoProfessor: 'Essencial para trechos bemolizados (Des-Dur, As-Dur, c-moll) em orquestra e câmara.'
  },
  {
    categoria: 'Golpes de Arco (Martelé, Spiccato / WurfBogen & Triolen)',
    subtitulo: 'Técnicas Avançadas da Mão Direita',
    conteudo: 'Volmer aborda minuciosamente os golpes de arco fundamentais: Détaché com todo o arco (G.B.), Martelé (Der gehämmerte Strich - mordida inicial com pausa), Spiccato / WurfBogen (Arco jogado a 3cm de altura em movimento pendular) e ritmos pontilhados.',
    pontosChave: [
      'Martelé (Gehämmerter Strich): Ataque seco, parada limpa na corda sem pressão excessiva',
      'Spiccato (Geworfener Bogenstrich): Lançamento do arco a 3cm na corda, impulso no ponto de equilíbrio',
      'Ritmos Pontilhados: Condução rápida de 3/4 de arco nas notas pontilhadas',
      'Apêndice Técnico de Arco (Bogentechnischer Anhang): 84 variações de arco sobre o mesmo exercício'
    ],
    orientacaoProfessor: 'Usar o Apêndice de Arco (Ex. 147) diariamente como aquecimento orquestral para viola.'
  }
];

export const ESTRUTURA_PEDAGOGICA_VIOLA_VOLMER: UnidadePedagogicaViolaVolmer[] = [
  {
    unidadeNumero: 1,
    titulo: 'Unidade 1: Leitura, Afinação, Postura e Cordas Soltas',
    paginas: 'Págs. III-VIII e 1-2 (PDF 3-11)',
    descricao: 'Apresentação da Clave de Dó na 3ª Linha, anatomia da viola, afinação em Quintas, postura corporal e exercícios iniciais de condução de arco em cordas soltas com divisão de arco.',
    objetivos: [
      'Compreender a notação na Clave de Dó (Alto Clef) e equivalência na Clave de Sol',
      'Aprender o procedimento técnico de afinação das 4 cordas (C-G-D-A)',
      'Desenvolver o plano de condução de arco (Strichebene) e o movimento do ombro',
      'Executar batidas de arco inteiro (G.B.), metade superior (o.H.) e metade inferior (u.H.)'
    ],
    fundamentosTecnicos: [
      'Pêndulo do ombro (Schultergelenk Pendelbewegung)',
      'Divisão de arco: G.B. (Ganzer Bogen), u.H. (untere Bogenhälfte), o.H. (obere Bogenhälfte)',
      'Mudanças de corda sem ruídos nas transições'
    ],
    conceitosMusicais: [
      'Clave de Dó na 3ª linha',
      'Valores de semibreve, mínima, semínima e colcheia',
      'Fórmula de compasso 4/4 e 2/4'
    ],
    orientacoesAutor: [
      'Atenção estrita para manter a linha reta entre mão esquerda e antebraço.',
      'Executar o exercício de mudanças de corda em todas as cordas observando a altura do braço direito.'
    ],
    dificuldadesRecorrentes: [
      'Pulso esquerdo caído ou apoiado no corpo da viola',
      'Arco torto na corda C (Dó2) por falta de elevação do cotovelo direito'
    ]
  },
  {
    unidadeNumero: 2,
    titulo: 'Unidade 2: 1ª Griffstellung (1ª Posição de Dedilhado) & Duetos',
    paginas: 'Págs. 3-11 (PDF 12-20)',
    descricao: 'Abertura do dedilhado na mão esquerda. A 1ª Griffstellung fixa o semitom entre 2º e 3º dedos. Introdução de pizzicato, leitura de notas em todas as cordas, tríades e primeiros duetos com o professor.',
    objetivos: [
      'Fixar a colocação dos dedos na 1ª Griffstellung (Semitom entre 2º e 3º dedos)',
      'Dominar o ataque simultâneo de arco e dedos (gleichzeitiges Greifen und Streichen)',
      'Desenvolver percepação de terças e arpejos de tríades em Sol, Ré e Dó Maior',
      'Tocar duetos polifônicos barrocos (Petzold, de Fesch, Keller)'
    ],
    fundamentosTecnicos: [
      'Postura dos dedos em martelo sobre o espelho',
      'Pizzicato da mão direita com apoio no espelho',
      'Independência entre o 2º e 3º dedos'
    ],
    conceitosMusicais: [
      'Tonalidades de Sol Maior, Ré Maior e Dó Maior',
      'Conceito de Terça Maior e Terça Menor',
      'Forma Menuett e Gavotte'
    ],
    orientacoesAutor: [
      'As primeiras colocações de dedos devem ser feitas em pizzicato, deixando o arco de lado.',
      'Aprender a afinar as terças e tríades com rigor auditivo.'
    ],
    dificuldadesRecorrentes: [
      'Distanciamento incorreto entre 2º e 3º dedos gerando desafinação no semitom',
      'Tensão na mão esquerda ao segurar a viola'
    ]
  },
  {
    unidadeNumero: 3,
    titulo: 'Unidade 3: Cordas Duplas, 2ª Griffstellung, Síncopas e Ligados',
    paginas: 'Págs. 12-25 (PDF 21-34)',
    descricao: 'Toque de 2 cordas simultâneas (Gleichzeitiges Streichen von 2 Saiten), introdução da 2ª Griffstellung (semitom entre 1º e 2º dedos com notas bemolizadas e acidentes), síncopas e ligaduras desiguais.',
    objetivos: [
      'Tocar duas cordas simultaneamente mantendo pressão e velocidade de arco homogêneas',
      'Dominar a 2ª Griffstellung (semitom entre 1º e 2º dedos: B, Es, As, Des)',
      'Compreender o acento rítmico da síncopa',
      'Executar ligaduras de notas com valores iguais e desiguais (Bindungen)'
    ],
    fundamentosTecnicos: [
      'Ângulo intermediário do arco para friccionar 2 cordas',
      'Recuo do 1º dedo na 2ª Griffstellung',
      'Acento natural de arco na nota sincopada'
    ],
    conceitosMusicais: [
      'Tríades Menores (G-moll, D-moll, C-moll)',
      'Efeito rítmico da síncopa',
      'Compassos compostos e ternários (3/4)'
    ],
    orientacoesAutor: [
      'Nas síncopas, a acentuação desloca-se para a parte fraca do tempo.',
      'Sustentar o tom lírico nos corais e duetos de Breuer e Campagnoli.'
    ],
    dificuldadesRecorrentes: [
      'Ruído ao tocar 2 cordas por pressão excessiva do arco',
      'Dificuldade de afinar o 1º dedo recuado (B, Es, As)'
    ]
  },
  {
    unidadeNumero: 4,
    titulo: 'Unidade 4: Escalas em 2 Oitavas, Intervalos & 3ª Griffstellung',
    paginas: 'Págs. 26-32 (PDF 35-41)',
    descricao: 'Consolidação das escalas de Dó Maior em 2 oitavas, intervalo de 7ª da dominante, introdução da 3ª Griffstellung (semitom entre 3º e 4º dedos: D-Dur, A-Dur, E-Dur) e ritmos pontilhados.',
    objetivos: [
      'Mapear o pentagrama inteiro em Dó Maior através de 2 oitavas',
      'Estudar sistematicamente os intervalos (Terças, Quartas, Quintas, Sextas, Sétimas, Oitavas)',
      'Introduzir a 3ª Griffstellung com os sustenido (Cis, Fis, Gis, Dis)',
      'Executar o ritmo pontilhado com pausa e impulso no talão e ponta'
    ],
    fundamentosTecnicos: [
      'Articulação firme do 4º dedo livre sem inclinar a mão',
      'Acento preciso e parada de arco no ritmo pontilhado (punktierter Rhythmus)',
      'Cruzamento de cordas com a mão esquerda mantendo os dedos fixos (Finger liegen lassen)'
    ],
    conceitosMusicais: [
      'Acorde de 7ª da Dominante (Dominantseptimenakkord)',
      'Tonalidades sustenizadas: Ré Maior, Lá Maior, Mi Maior',
      'Análise intervalar completa'
    ],
    orientacoesAutor: [
      'Ao praticar o ritmo pontilhado, faça uma pequena pausa antes da nota curta mantendo o arco apoiado na corda.',
      'Manter os dedos colocados no espelho sempre que possível.'
    ],
    dificuldadesRecorrentes: [
      'Fraqueza sonora no 4º dedo na corda Dó e Ré',
      'Apressar as notas curtas nos ritmos pontilhados'
    ]
  },
  {
    unidadeNumero: 5,
    titulo: 'Unidade 5: 4ª e 5ª Griffstellungen, Tonalidades Bemolizadas e Triolen',
    paginas: 'Págs. 33-41 (PDF 42-50)',
    descricao: 'Aprofundamento na 4ª Griffstellung (semitom entre corda solta e 1º dedo) e 5ª Griffstellung (semitom duplo: corda solta/1º E 3º/4º). Estudos em Es-Dur, As-Dur, Des-Dur e introdução de trioletes.',
    objetivos: [
      'Dominar os acidentes bemolizados no registro grave e médio da viola',
      'Aplicar a 4ª e 5ª Griffstellungen em peças de concerto (Keller, Genzmer, Purcell)',
      'Executar trioletes (Triolen) com subdivisão rítmica de 3 notas por tempo em 2/4 e 3/4',
      'Praticar passagens de velocidade em colcheias e semicolcheias'
    ],
    fundamentosTecnicos: [
      'Flexibilidade dos dedos para deslocamentos cromáticos na 1ª posição',
      'Acento no primeiro tempo da triolete sem distorcer o pulso',
      'Equilíbrio do arco nas divisões em 1/3 (Frosch, Mitte, Spitze)'
    ],
    conceitosMusicais: [
      'Tonalidades de Mi♭ Maior, Lá♭ Maior, Dó♭ e Fá Maior',
      'Trioletes em compassos simples',
      'Forma Rondo e Vivace'
    ],
    orientacoesAutor: [
      'Manter os dedos apoiados no espelho na 5ª Griffstellung para garantir estabilidade da mão.',
      'Nas trioletes, acentuar levemente a primeira nota do grupo.'
    ],
    dificuldadesRecorrentes: [
      'Desafinação nos bemóis da corda Dó (Dó♭, Ré♭, Mi♭)',
      'Raciocínio lento na leitura de 3 e 4 bemóis na Clave de Dó'
    ]
  },
  {
    unidadeNumero: 6,
    titulo: 'Unidade 6: Golpes de Arco Virtuosos (Martelé & Spiccato / WurfBogen)',
    paginas: 'Págs. 42-59 (PDF 51-68)',
    descricao: 'Estudo aprofundado dos golpes de arco curtos e saltados: Der gehämmerte Strich (Martelé), Der geworfene Bogenstrich (Spiccato/WurfBogen) e estudos progressivos de Wohlfahrt, Campagnoli, Pleyel e Händel.',
    objetivos: [
      'Dominar o golpe de arco Martelé com acento seco e descanso na corda',
      'Desenvolver o Spiccato (WurfBogen) jogando o arco a 3cm de altura com impulso de pulso',
      'Aplicar Spiccato em trioletes e mudanças rápidas de cordas',
      'Executar a extensão do 4º dedo para alcançar notas agudas sem mudar de posição'
    ],
    fundamentosTecnicos: [
      'Ataque de Martelé com pré-pressão do polegar e indicador do arco',
      'Ponto de equilíbrio do arco para lançamento no Spiccato (WurfBogen)',
      'Extensão do 4º dedo (Strecken des 4. Fingers)'
    ],
    conceitosMusicais: [
      'Articulações de Martelé e Spiccato',
      'Estilo de Dança Siciliano (6/8)',
      'Tonalidade de Lá Maior e Si♭ Maior em 2 oitavas'
    ],
    orientacoesAutor: [
      'O Spiccato exige que o arco seja lançado de uma altura de cerca de 3cm sobre a corda, realizando um movimento pendular circular.',
      'Manter o 4º dedo estendido sem soltar os demais dedos da posição.'
    ],
    dificuldadesRecorrentes: [
      'Arco descontrolado ou quicando sem ritmo no Spiccato',
      'Tensão no polegar da mão direita durante o Martelé'
    ]
  },
  {
    unidadeNumero: 7,
    titulo: 'Unidade 7: Meia Posição, Escalas Menores e Apêndice de Arco (84 Variações)',
    paginas: 'Págs. 60-82 (PDF 69-91)',
    descricao: 'Apresentação da Die Halbe Lage (Meia Posição), escalas menores armônicas e melódicas (a-moll, d-moll, g-moll, c-moll, e-moll), nuances dinâmicas e o Apêndice de Técnica de Arco com 84 variações.',
    objetivos: [
      'Dominar a Meia Posição (Halbe Lage) para leitura fluida de tonalidades bemolizadas',
      'Diferenciar e aplicar as escalas menores Armônicas e Melódicas',
      'Compreender o intervalo de Segunda Aumentada e como contorná-lo',
      'Utilizar as dinâmicas de contraste Barrocas (Forte x Piano) e Românticas (Crescendo x Decrescendo)',
      'Praticar o Apêndice de Golpes de Arco (Bogentechnischer Anhang) com 84 variações'
    ],
    fundamentosTecnicos: [
      'Meia Posição (Sattellage) com o 1º dedo no Ré♭/Lá♭/Mi♭',
      'Segunda Aumentada (übermäßige Sekunde) nas escalas menores',
      'Variabilidade de velocidade e pressão do arco para dinamizar ff, f, p, pp, crescendo e decrescendo',
      'Execução do Apêndice com 84 combinações de arco (Détaché, Martelé, Legato, Staccato, Spiccato)'
    ],
    conceitosMusicais: [
      'Escalas Menores Armônicas e Melódicas',
      'Dinâmica Barroca de Terracota (Terrassendynamik) e Expressiva Romântica',
      'Formas Sarabande, Air, Canon e Impertinence'
    ],
    orientacoesAutor: [
      'A Meia Posição é extremamente importante para o violista evitar distensões desconfortáveis do 4º dedo.',
      'Praticar o Apêndice Técnico de Arco (Ex. 147) diariamente para desenvolver domínio total da mão direita.'
    ],
    dificuldadesRecorrentes: [
      'Desafinação na 7ª sensível elevada das escalas menores armônicas',
      'Perda de estabilidade na Meia Posição ao retornar para a 1ª posição'
    ]
  }
];

export const EXERCICIOS_VIOLA_VOLMER: ExercícioViolaVolmer[] = [
  // SEÇÃO 1: FUNDAMENTOS & CORDAS SOLTAS (Págs. 1-2)
  {
    numero: 1,
    secao: 'Fundamentos & Cordas Soltas',
    pagina: 1,
    faseOrquestra: 1,
    titulo: 'Die ersten Bogenübungen auf leeren Saiten (Cordas Soltas C, G, D, A)',
    tonalidade: 'Cordas Soltas (C-G-D-A)',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Iniciante',
    conceitos: ['Cordas Soltas', 'Divisão de Arco', 'Arco Inteiro (G.B.)', 'Clave de Dó'],
    dificuldades: ['Manter trajetória reta do arco', 'Sonoridade sem arranhar nas cordas C e G'],
    prerequisitos: ['Postura correta da viola e empunhadura do arco'],
    tecnicaPrincipal: 'Condução reta de arco inteiro (G.B.) nas 4 cordas da viola',
    habilidadeDesenvolvida: 'Sonoridade encorpada e estável em cordas soltas',
    tempoEstimadoMinutos: 10,
    sugestaoContinuidade: 'Exercício 2 (Mudanças de metade de arco)',
    descricao: 'Primeiros exercícios de condução de arco inteiro (G.B.) nas quatro cordas da viola (Dó2, Sol2, Ré3, Lá3). Foco na emissão de som profundo e constante.'
  },
  {
    numero: 2,
    secao: 'Fundamentos & Cordas Soltas',
    pagina: 1,
    faseOrquestra: 1,
    titulo: 'Bogenhälfte Übungen (Metade Superior o.H. e Inferior u.H.)',
    tonalidade: 'Cordas Soltas',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Iniciante',
    conceitos: ['Metade de Arco', 'u.H. (untere Bogenhälfte)', 'o.H. (obere Bogenhälfte)'],
    dificuldades: ['Controle do peso do braço no talão (u.H.) sem esmagar a corda'],
    prerequisitos: ['Exercício 1'],
    tecnicaPrincipal: 'Divisão exata do arco em metades superior e inferior',
    habilidadeDesenvolvida: 'Controle de peso e velocidade em diferentes regiões do arco',
    tempoEstimadoMinutos: 10,
    sugestaoContinuidade: 'Exercício 3',
    descricao: 'Estudo do arco dividido nas regiões do talão (u.H.) e da ponta (o.H.). A autora orienta observar o relaxamento do cotovelo e ombro.'
  },
  {
    numero: 3,
    secao: 'Fundamentos & Cordas Soltas',
    pagina: 1,
    faseOrquestra: 1,
    titulo: 'Kombination von Bogenlängen (G.B. - u.H. - o.H.)',
    tonalidade: 'Cordas Soltas',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Iniciante',
    conceitos: ['Divisão de Arco Mista', 'Dinâmica Uniforme'],
    dificuldades: ['Transição suave entre arco inteiro e metades'],
    prerequisitos: ['Exercícios 1 e 2'],
    tecnicaPrincipal: 'Alternância rítmica entre G.B., u.H. e o.H.',
    habilidadeDesenvolvida: 'Flexibilidade de condução da mão direita',
    tempoEstimadoMinutos: 10,
    sugestaoContinuidade: 'Exercício 4 (Saitenwechsel)',
    descricao: 'Combinação de notas longas de arco inteiro com notas curtas na ponta e no talão em todas as cordas soltas.'
  },
  {
    numero: 4,
    secao: 'Fundamentos & Cordas Soltas',
    pagina: 1,
    faseOrquestra: 1,
    titulo: 'Übungen für den Saitenwechsel (Movimento do Ombro no Troca de Corda)',
    tonalidade: 'Cordas Soltas',
    compasso: '4/4',
    andamento: 'Andante',
    nivel: 'Iniciante',
    conceitos: ['Mudança de Corda', 'Pêndulo do Ombro (Schultergelenk)', 'Strichebene'],
    dificuldades: ['Mudança de plano de arco sem acidentes sonoros nas cordas vizinhas'],
    prerequisitos: ['Exercício 3'],
    tecnicaPrincipal: 'Movimento pendular do ombro direito para alternar entre C, G, D e A',
    habilidadeDesenvolvida: 'Fluidez no movimento de articulação do braço direito',
    tempoEstimadoMinutos: 15,
    sugestaoContinuidade: 'Exercício 5 e 7',
    descricao: 'Exercício fundamental de mudança de corda conduzido pela articulação do ombro (Schultergelenk). O braço atinge 4 níveis horizontais exatos.'
  },
  {
    numero: 7,
    secao: 'Fundamentos & Cordas Soltas',
    pagina: 2,
    faseOrquestra: 1,
    titulo: 'Norwegischer Tanz (Halling) – Dueto de Cordas Soltas',
    tonalidade: 'Ré Maior (Cordas Soltas com Acompanhamento)',
    compasso: '2/4',
    andamento: 'Allegretto',
    nivel: 'Iniciante',
    compositor: 'Folclore Norueguês (arr. Paul Breuer)',
    conceitos: ['Dueto Didático', 'Acompanhamento do Professor', 'Ritmo de Dança'],
    dificuldades: ['Manter o pulso constante enquanto o professor toca a melodia virtuosa'],
    prerequisitos: ['Exercícios 4 e 5'],
    tecnicaPrincipal: 'Acompanhamento rítmico em cordas soltas com rigor de tempo',
    habilidadeDesenvolvida: 'Prática de conjunto e percepção harmônica inicial',
    tempoEstimadoMinutos: 15,
    sugestaoContinuidade: 'Exercício 8 (Primeiro Dedilhado)',
    descricao: 'Dança Folclórica Norueguesa onde o aluno toca o acompanhamento em cordas soltas enquanto o professor solfa a melodia. Excelente incentivo de conjunto.'
  },

  // SEÇÃO 2: PRIMEIRA GRIFFSTELLUNG & PIZZICATO (Págs. 3-11)
  {
    numero: 8,
    secao: 'Primeira Griffstellung (1ª Posição de Dedilhado)',
    pagina: 3,
    faseOrquestra: 1,
    titulo: 'Das Aufsetzen der Finger in der 1. Griffstellung (a, b, c, d em Pizzicato)',
    tonalidade: 'G-Dur / D-Dur / C-Dur',
    compasso: '4/4',
    andamento: 'Lento',
    griffstellung: '1ª Griffstellung (Semitom entre 2º e 3º dedos)',
    nivel: 'Iniciante',
    conceitos: ['1ª Griffstellung', 'Pizzicato com Polegar no Espelho', 'Semitom 2º-3º dedos'],
    dificuldades: ['Colocação firme dos dedos em martelo', 'Manter o semitom entre 2º e 3º dedos ajustado'],
    prerequisitos: ['Unidade 1 concluída'],
    tecnicaPrincipal: 'Pizzicato da mão direita enquanto a mão esquerda coloca os dedos 1, 2, 3 e 4',
    habilidadeDesenvolvida: 'Fixação tátil dos intervalos da 1ª Griffstellung',
    tempoEstimadoMinutos: 15,
    sugestaoContinuidade: 'Exercício 9 e 10',
    descricao: 'Primeira colocação dos dedos da mão esquerda sem o arco (em pizzicato). A autora estabelece a 1ª Griffstellung: semitom entre o 2º e 3º dedos (C-D-E-F-G / G-A-H-C-D / D-E-Fis-G-A / A-H-Cis-D-E).'
  },
  {
    numero: 9,
    secao: 'Primeira Griffstellung (1ª Posição de Dedilhado)',
    pagina: 5,
    faseOrquestra: 1,
    titulo: 'Menuett & Alte italienische Tanzmelodie em Pizzicato',
    tonalidade: 'Dó Maior / Sol Maior',
    compasso: '3/4 e 4/4',
    andamento: 'Andante',
    nivel: 'Iniciante',
    compositor: 'Anônimo Século XVII',
    conceitos: ['Pizzicato Melódico', 'Dueto de Mão Esquerda', 'Compasso 3/4'],
    dificuldades: ['Pizzicato homogêneo em compasso ternário'],
    prerequisitos: ['Exercício 8'],
    tecnicaPrincipal: 'Pizzicato com dedilhado da 1ª Griffstellung',
    habilidadeDesenvolvida: 'Musicalidade e afinação tátil',
    tempoEstimadoMinutos: 15,
    sugestaoContinuidade: 'Exercício 10 (Greifen und Streichen)',
    descricao: 'Pequeno Menuet e Melodia Italiana Antiga executados em pizzicato pelo aluno acompanhado pelo professor. Consolida o dedilhado antes de usar o arco.'
  },
  {
    numero: 10,
    secao: 'Primeira Griffstellung (1ª Posição de Dedilhado)',
    pagina: 6,
    faseOrquestra: 1,
    titulo: 'Erste Übungen zum gleichzeitigen Greifen und Streichen (a, b, c, d)',
    tonalidade: 'Sol Maior / Ré Maior / Dó Maior',
    compasso: '4/4',
    andamento: 'Andante',
    griffstellung: '1ª Griffstellung',
    nivel: 'Iniciante',
    conceitos: ['Coordenação Arco e Dedos', 'Arco Inteiro e Metades', 'Síncrese Ambidestra'],
    dificuldades: ['Sincronizar a queda do dedo com o início do golpe de arco'],
    prerequisitos: ['Exercícios 8 e 9'],
    tecnicaPrincipal: 'Uso combinado do arco e dedilhado da 1ª Griffstellung',
    habilidadeDesenvolvida: 'Coordenação motora entre mão esquerda e direita',
    tempoEstimadoMinutos: 20,
    sugestaoContinuidade: 'Exercício 11 (Kleine Etüde)',
    descricao: 'Primeiros exercícios de tocar com arco e colocar os dedos simultaneamente. Abrange as quatro cordas com variações de divisão de arco (G.B., o.H., u.H.).'
  },
  {
    numero: 11,
    secao: 'Primeira Griffstellung (1ª Posição de Dedilhado)',
    pagina: 7,
    faseOrquestra: 1,
    titulo: 'Kleine Etüde (Estudo Progressivo em Sol Maior com Variações de Arco)',
    tonalidade: 'Sol Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Iniciante',
    conceitos: ['Estudo Progressivo', 'Variações de Arco', 'Leitura Melódica'],
    dificuldades: ['Troca de cordas mantendo a afinação do 3º e 4º dedos'],
    prerequisitos: ['Exercício 10'],
    tecnicaPrincipal: 'Execução melódica na 1ª Griffstellung com 3 variações de arco',
    habilidadeDesenvolvida: 'Fluidez de leitura e expressão melódica inicial',
    tempoEstimadoMinutos: 15,
    sugestaoContinuidade: 'Exercício 13 e 14',
    descricao: 'Pequeno estudo melódico em Sol Maior. Deve ser praticado com três articularções de arco: 1) o.H., 2) u.H., 3) G.B. e metades intercaladas.'
  },
  {
    numero: 14,
    secao: 'Primeira Griffstellung (1ª Posição de Dedilhado)',
    pagina: 8,
    faseOrquestra: 1,
    titulo: 'Dreiklang (Arpejos de Tríades em G-Dur, D-Dur e C-Dur)',
    tonalidade: 'Sol Maior / Ré Maior / Dó Maior',
    compasso: '4/4',
    andamento: 'Andante',
    nivel: 'Iniciante',
    conceitos: ['Tríades Maior', 'Arpejos', 'Oitava com Corda Solta'],
    dificuldades: ['Ajuste da terça maior e quinta justa sem apoio de notas intermediárias'],
    prerequisitos: ['Exercício 13'],
    tecnicaPrincipal: 'Arpejos de tríades fundamentais com dedilhado 0-2-0-3 / 0-2-0-3',
    habilidadeDesenvolvida: 'Afinamento de acordes e percepção harmônica',
    tempoEstimadoMinutos: 15,
    sugestaoContinuidade: 'Exercício 16 (Escalas)',
    descricao: 'Mapeamento das tríades maiores fundamentais da viola (Sol, Ré e Dó). A autora explica a estrutura da tríade formada por terça maior e quinta justa.'
  },
  {
    numero: 16,
    secao: 'Primeira Griffstellung (1ª Posição de Dedilhado)',
    pagina: 8,
    faseOrquestra: 1,
    titulo: 'Die G-Dur, C-Dur und D-Dur-Tonleiter (Escalas Diatônicas)',
    tonalidade: 'Sol Maior / Dó Maior / Ré Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Iniciante',
    conceitos: ['Escalas Diatônicas', '1ª Griffstellung', 'Afinação de Oitavas'],
    dificuldades: ['Manter a velocidade de arco igual em subida e descida da escala'],
    prerequisitos: ['Exercícios 14 e 15'],
    tecnicaPrincipal: 'Execução de escalas de 1 oitava na 1ª Griffstellung',
    habilidadeDesenvolvida: 'Domínio das escalas primárias da viola',
    tempoEstimadoMinutos: 15,
    sugestaoContinuidade: 'Exercício 18 (Gavotte de Petzold)',
    descricao: 'Escalas completas de Sol Maior, Dó Maior e Ré Maior na 1ª Griffstellung. Base essencial para o repertório do violista iniciante.'
  },
  {
    numero: 18,
    secao: 'Primeira Griffstellung (1ª Posição de Dedilhado)',
    pagina: 9,
    faseOrquestra: 1,
    titulo: 'Gavotte em Sol Maior (Dueto de Viola e Violino)',
    tonalidade: 'Sol Maior',
    compasso: '4/4',
    andamento: 'Allegretto',
    nivel: 'Iniciante',
    compositor: 'Christian Petzold (1677-1733)',
    conceitos: ['Repertório Barroco', 'Dueto de Viola e Violino', 'Anacruse de Gavotte'],
    dificuldades: ['Entrada na anacruse de 2 semínimas', 'Equilíbrio de volume com o violino'],
    prerequisitos: ['Exercício 16'],
    tecnicaPrincipal: 'Fraseado barroco elegante com anacruse e contraste de arco',
    habilidadeDesenvolvida: 'Sensibilidade estilística e afinação em duo',
    tempoEstimadoMinutos: 20,
    sugestaoContinuidade: 'Exercício 19 (Menuett de de Fesch)',
    descricao: 'Gavotte clássica do Caderno de Anna Magdalena Bach composta por Christian Petzold. Transcrita para viola solista acompanhada por violino ou professor.'
  },

  // SEÇÃO 3: SEGUNDA GRIFFSTELLUNG, CORDAS DUPLAS E SÍNCOPAS (Págs. 12-25)
  {
    numero: 21,
    secao: 'Segunda Griffstellung & Synkopen',
    pagina: 12,
    faseOrquestra: 2,
    titulo: 'Gleichzeitiges Streichen von 2 Saiten (Cordas Duplas Soltas)',
    tonalidade: 'C-G / G-D / D-A',
    compasso: '4/4',
    andamento: 'Lento e Sustentado',
    nivel: 'Básico',
    conceitos: ['Cordas Duplas', 'Bitonalidade', 'Bogen pressure'],
    dificuldades: ['Manter o arco tocando 2 cordas simultaneamente com peso idêntico'],
    prerequisitos: ['Unidade 2 concluída'],
    tecnicaPrincipal: 'Ajuste do ângulo de arco no plano intermediário para ressonar 2 cordas',
    habilidadeDesenvolvida: 'Sonoridade harmônica e estabilidade de braço direito',
    tempoEstimadoMinutos: 15,
    sugestaoContinuidade: 'Exercício 22 (2ª Griffstellung)',
    descricao: 'Exercício de cordas duplas soltas (Dó-Sol, Sol-Ré, Ré-Lá). Exige maior pressão de arco (Bogendruck) e controle rigoroso do plano de condução.'
  },
  {
    numero: 22,
    secao: 'Segunda Griffstellung & Synkopen',
    pagina: 12,
    faseOrquestra: 2,
    titulo: 'Übungen der 2. Griffart (Semitom entre 1º e 2º dedos: B, Es, As, Des)',
    tonalidade: 'Fá Maior / Si♭ Maior / Mi♭ Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    griffstellung: '2ª Griffstellung (Semitom entre 1º e 2º dedos)',
    nivel: 'Básico',
    conceitos: ['2ª Griffstellung', 'Notas Bemolizadas', 'Recuo do 1º Dedo'],
    dificuldades: ['Recuar o 1º dedo (B, Es, As, Des) sem arrastar o polegar ou a mão'],
    prerequisitos: ['Exercício 21'],
    tecnicaPrincipal: 'Recuo do 1º dedo criando o semitom com a corda solta ou 2º dedo',
    habilidadeDesenvolvida: 'Flexibilidade tátil para tonalidades com bemóis',
    tempoEstimadoMinutos: 20,
    sugestaoContinuidade: 'Exercício 23 e 24',
    descricao: 'Apresentação da 2ª Griffstellung. O semitom fica situado entre o 1º e 2º dedos. Estudo essencial para a leitura de tons bemolizados na viola.'
  },
  {
    numero: 24,
    secao: 'Segunda Griffstellung & Synkopen',
    pagina: 13,
    faseOrquestra: 2,
    titulo: 'Stück (Estudo de Concerto em Si♭ Maior)',
    tonalidade: 'Si♭ Maior',
    compasso: '4/4',
    andamento: 'Allegro moderato',
    nivel: 'Básico',
    compositor: 'Bartolomeo Campagnoli (1751-1827)',
    conceitos: ['Estudo de Concerto', '2ª Griffstellung', 'Articulação de Arco'],
    dificuldades: ['Fluidez nas passagens rápidas na corda Dó e Sol em Si♭ Maior'],
    prerequisitos: ['Exercício 22'],
    tecnicaPrincipal: 'Aplicação virtuosa da 2ª Griffstellung com acompanhamento do professor',
    habilidadeDesenvolvida: 'Agilidade de dedos e afinação precisa em bemóis',
    tempoEstimadoMinutos: 20,
    sugestaoContinuidade: 'Exercício 25 (Menuett de Purcell)',
    descricao: 'Peça do célebre pedagogo de viola Bartolomeo Campagnoli. Exige o uso preciso da 2ª Griffstellung e bom controle de dinâmica.'
  },
  {
    numero: 26,
    secao: 'Segunda Griffstellung & Synkopen',
    pagina: 14,
    faseOrquestra: 2,
    titulo: 'Choral "gemessen" (Coral Polifônico em Sol Menor)',
    tonalidade: 'Sol Menor',
    compasso: '4/4',
    andamento: 'Adagio e expressivo',
    nivel: 'Básico',
    compositor: 'Paul Breuer (1953)',
    conceitos: ['Coral Polifônico', 'Pizzicato Ressonante (kling. pizz.)', 'Expressividade Lyrical'],
    dificuldades: ['Sustentar notas longas expressivas no arco enquanto o acompanhamento faz pizzicato'],
    prerequisitos: ['Exercício 24 e 25'],
    tecnicaPrincipal: 'Controle de legato com muito som (mit viel Ton) e dinâmicas ff e pp',
    habilidadeDesenvolvida: 'Sustentação de som nobre e sonoridade melancólica de viola',
    tempoEstimadoMinutos: 20,
    sugestaoContinuidade: 'Exercício 27 e 29',
    descricao: 'Coral lírico composto especialmente para o método por Paul Breuer. Trabalha a sonoridade profunda do registro grave da viola com nuances de cresc. e decresc.'
  },
  {
    numero: 32,
    secao: 'Segunda Griffstellung & Synkopen',
    pagina: 16,
    faseOrquestra: 2,
    titulo: 'Synkopen (Síncopas Rítmicas em 4/4 e 3/4 com Ligaduras)',
    tonalidade: 'Dó Maior / Sol Maior',
    compasso: '4/4 e 3/4',
    andamento: 'Moderato',
    nivel: 'Básico',
    conceitos: ['Síncopas', 'Acentuação Rítmica', 'Ligaduras Deslocadas'],
    dificuldades: ['Acentuar a parte fraca do tempo sem desequilibrar a direção do arco'],
    prerequisitos: ['Exercícios 29 e 30'],
    tecnicaPrincipal: 'Acentuação em síncopas (Betonung auf dem schlechten Taktteil)',
    habilidadeDesenvolvida: 'Independência rítmica e precisão de tempo em orquestra',
    tempoEstimadoMinutos: 20,
    sugestaoContinuidade: 'Exercício 33 (Duett de Gastoldi)',
    descricao: 'Estudo minucioso sobre a síncopa. Berta Volmer ensina que quando duas notas da mesma altura são ligadas deslocando o acento para o tempo fraco, surge a síncopa.'
  },

  // SEÇÃO 4: ESCALAS EM 2 OITAVAS, INTERVALOS & 3ª GRIFFSTELLUNG (Págs. 26-32)
  {
    numero: 37,
    secao: 'Terceira Griffstellung & Tonalidades Sustenizadas',
    pagina: 19,
    faseOrquestra: 2,
    titulo: 'Die C-Dur Tonleiter durch 2 Oktaven (Escala de Dó Maior em 2 Oitavas)',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Intermediário',
    conceitos: ['Escala em 2 Oitavas', 'Tessitura Completa da 1ª Posição', '4º Dedo Livre'],
    dificuldades: ['Subida fluida do Dó2 ao Dó4 na corda Lá com o 4º dedo estendido'],
    prerequisitos: ['Unidade 3 concluída'],
    tecnicaPrincipal: 'Mapeamento de 2 oitavas completas em Dó Maior com variações de arco',
    habilidadeDesenvolvida: 'Visão global da 1ª posição da viola',
    tempoEstimadoMinutos: 20,
    sugestaoContinuidade: 'Exercício 38 e 40',
    descricao: 'Primeira escala de 2 oitavas completas do método, cobrindo da corda Dó solta (C2) até o Dó4 na corda Lá (A-Saite 3º dedo). Praticada em 3 formas de arco.'
  },
  {
    numero: 40,
    secao: 'Terceira Griffstellung & Tonalidades Sustenizadas',
    pagina: 21,
    faseOrquestra: 2,
    titulo: 'Intervalle (Terzen, Quarten, Quinten, Sexten, Septimen, Oktaven)',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Andante',
    nivel: 'Intermediário',
    conceitos: ['Estudo Intervalar', 'Terças, Quartas, Quintas', 'Sextas, Sétimas, Oitavas'],
    dificuldades: ['Ajuste da quinta diminuta e sexta menor no registro grave'],
    prerequisitos: ['Exercício 37'],
    tecnicaPrincipal: 'Mapeamento auditivo e tátil dos saltos intervalares na viola',
    habilidadeDesenvolvida: 'Afinação intervalar perfeita e flexibilidade de dedos',
    tempoEstimadoMinutos: 25,
    sugestaoContinuidade: 'Exercício 41 (Dominantseptimenakkord)',
    descricao: 'Estudo sistemático de todos os intervalos da escala de Dó Maior. A autora detalha as diferenças entre terças maiores/menores, quintas puras e sextas.'
  },
  {
    numero: 47,
    secao: 'Terceira Griffstellung & Tonalidades Sustenizadas',
    pagina: 26,
    faseOrquestra: 3,
    titulo: 'Die dritte Griffstellung (Semitom entre 3º e 4º dedos: D-Dur, A-Dur, E-Dur)',
    tonalidade: 'Ré Maior / Lá Maior / Mi Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    griffstellung: '3ª Griffstellung (Semitom entre 3º e 4º dedos)',
    nivel: 'Intermediário',
    conceitos: ['3ª Griffstellung', 'Acidentes Sustenido (Cis, Fis, Gis, Dis)', 'Abertura de Mão'],
    dificuldades: ['Manter o 1º e 2º dedos afastados enquanto o 3º e 4º ficam unidos no semitom'],
    prerequisitos: ['Exercício 40'],
    tecnicaPrincipal: 'Colocação dos dedos na 3ª Griffstellung com os sustenidos da armadura',
    habilidadeDesenvolvida: 'Tocabilidade fluida em tonalidades com sustenidos',
    tempoEstimadoMinutos: 20,
    sugestaoContinuidade: 'Exercício 48 e 52',
    descricao: 'Introdução da 3ª Griffstellung. O semitom situa-se entre o 3º e 4º dedos (Cis, Fis, Gis, Dis). Permite o estudo das escalas de Ré, Lá e Mi Maior.'
  },
  {
    numero: 52,
    secao: 'Terceira Griffstellung & Tonalidades Sustenizadas',
    pagina: 28,
    faseOrquestra: 3,
    titulo: 'Andante em Lá Maior (Dueto Expressivo de Harald Genzmer)',
    tonalidade: 'Lá Maior',
    compasso: '4/4',
    andamento: 'Andante con moto',
    nivel: 'Intermediário',
    compositor: 'Harald Genzmer (1953)',
    conceitos: ['Música Contemporânea Neoclássica', 'Dueto de Concerto', 'Nuances Cromaticas'],
    dificuldades: ['Afinação de cromaticismos e modulações expressivas'],
    prerequisitos: ['Exercícios 47 e 48'],
    tecnicaPrincipal: 'Execução melódica lírica na 3ª Griffstellung com dinâmicas sutis',
    habilidadeDesenvolvida: 'Expressão moderna e afinação em tonalidades límpidas',
    tempoEstimadoMinutos: 25,
    sugestaoContinuidade: 'Exercício 55 (Punktierter Rhythmus)',
    descricao: 'Obra neoclássica encomendada para o método a Harald Genzmer (aluno de Hindemith). Um dueto rico em contraponto e sensibilidade para viola.'
  },
  {
    numero: 55,
    secao: 'Terceira Griffstellung & Tonalidades Sustenizadas',
    pagina: 30,
    faseOrquestra: 3,
    titulo: 'Bogenübungen im punktierten Rhythmus (Ritmo Pontilhado com Pausa e Impulso)',
    tonalidade: 'Sol Maior / Ré Maior',
    compasso: '3/4 e 4/4',
    andamento: 'Allegro marziale',
    nivel: 'Intermediário',
    conceitos: ['Ritmo Pontilhado', 'Parada de Arco (Pause auf der Saite)', 'Acento no Talão'],
    dificuldades: ['Fazer a pausa na corda mantendo o arco firme antes de puxar a nota curta'],
    prerequisitos: ['Exercício 53'],
    tecnicaPrincipal: 'Condução rápida de 3/4 de arco na colcheia pontilhada e 1/4 na semicolcheia',
    habilidadeDesenvolvida: 'Ataque incisivo e controle rítmico marcial',
    tempoEstimadoMinutos: 20,
    sugestaoContinuidade: 'Exercício 56 e 58',
    descricao: 'Exercícios de ritmo pontilhado. Berta Volmer instrui: "Faça uma pequena pausa antes da nota de 16 avos. O arco deve permanecer firme sobre a corda durante a pausa!"'
  },

  // SEÇÃO 5: QUARTA E QUINTA GRIFFSTELLUNGEN & BEMÓIS (Págs. 33-41)
  {
    numero: 60,
    secao: 'Quarta e Quinta Griffstellungen & Cromatismos',
    pagina: 33,
    faseOrquestra: 3,
    titulo: 'Die vierte Griffstellung (Semitom entre Corda Solta e 1º Dedo: As, Es, B, Des)',
    tonalidade: 'Mi♭ Maior / Lá♭ Maior / Re♭ Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    griffstellung: '4ª Griffstellung (Semitom entre corda solta e 1º dedo)',
    nivel: 'Intermediário',
    conceitos: ['4ª Griffstellung', 'Meio-Tom na Corda Solta', 'Armadura Bemolizada'],
    dificuldades: ['Posicionar o 1º dedo logo após a pestana (As, Es, B, Des)'],
    prerequisitos: ['Unidade 4 concluída'],
    tecnicaPrincipal: 'Dedilhado de 4ª Griffstellung com recuo total do 1º dedo',
    habilidadeDesenvolvida: 'Leitura fluida de 3 e 4 bemóis na Clave de Dó',
    tempoEstimadoMinutos: 20,
    sugestaoContinuidade: 'Exercício 62 e 65',
    descricao: 'Introdução da 4ª Griffstellung. O semitom situa-se entre a corda solta e o 1º dedo (Lá♭ na corda Dó, Mi♭ na corda Sol, Si♭ na corda Ré, Ré♭ na corda Lá).'
  },
  {
    numero: 65,
    secao: 'Quarta e Quinta Griffstellungen & Cromatismos',
    pagina: 36,
    faseOrquestra: 3,
    titulo: 'Doppelklänge mit einer leeren Saite (Cordas Duplas com Corda Solta)',
    tonalidade: 'Mi♭ Maior',
    compasso: '4/4',
    andamento: 'Andante con moto',
    nivel: 'Intermediário',
    conceitos: ['Cordas Duplas com Corda Solta', 'Pedal de Corda Solta', 'Polyfonia Incial'],
    dificuldades: ['Manter a corda solta ressoando enquanto o dedo articula na corda adjacente'],
    prerequisitos: ['Exercício 60 e 64'],
    tecnicaPrincipal: 'Execução de cordas duplas com pedal de corda solta',
    habilidadeDesenvolvida: 'Ressonância harmônica e postura arqueada dos dedos',
    tempoEstimadoMinutos: 20,
    sugestaoContinuidade: 'Exercício 67 (Wohlfahrt)',
    descricao: 'Estudo de cordas duplas combinando dedos fixos com cordas soltas ressonantes em Mi♭ Maior. Exige afinação rigorosa e projeção sonora.'
  },
  {
    numero: 68,
    secao: 'Quarta e Quinta Griffstellungen & Cromatismos',
    pagina: 38,
    faseOrquestra: 3,
    titulo: 'Die fünfte Griffstellung (Semitom Duplo: Corda Solta/1º E 3º/4º)',
    tonalidade: 'Fá Maior / Si♭ Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    griffstellung: '5ª Griffstellung (Semitom duplo)',
    nivel: 'Intermediário',
    conceitos: ['5ª Griffstellung', 'Dedos Fixos no Espelho (Finger liegen lassen)', 'Fá Maior'],
    dificuldades: ['Manter simultaneamente o 1º dedo recuado e o 3º/4º colados'],
    prerequisitos: ['Exercício 67'],
    tecnicaPrincipal: 'Fixação tátil dos dois pontos de semitom na mão esquerda',
    habilidadeDesenvolvida: 'Estabilidade estrutural da mão em Fá Maior',
    tempoEstimadoMinutos: 20,
    sugestaoContinuidade: 'Exercício 69 e 71',
    descricao: 'Apresentação da 5ª Griffstellung. Combina dois pontos de semitom: entre a corda solta e o 1º dedo E entre o 3º e 4º dedos. A autora exige manter os dedos no espelho.'
  },
  {
    numero: 71,
    secao: 'Quarta e Quinta Griffstellungen & Cromatismos',
    pagina: 39,
    faseOrquestra: 3,
    titulo: 'Triolen – Dreizeitige Teilung von zweizeitigen Notenwerten',
    tonalidade: 'Fá Maior',
    compasso: '2/4 e 3/4',
    andamento: 'Allegro moderato',
    nivel: 'Intermediário',
    conceitos: ['Trioletes (Triolen)', 'Subdivisão Ternária', 'Acento no Primeiro Tempo'],
    dificuldades: ['Manter o pulso constante sem transformar a triolete em colcheia pontilhada'],
    prerequisitos: ['Exercício 68'],
    tecnicaPrincipal: 'Execução de trioletes com ligaduras de 3 notas por golpe de arco',
    habilidadeDesenvolvida: 'Fluidez rítmica e controle de divisão de arco',
    tempoEstimadoMinutos: 20,
    sugestaoContinuidade: 'Exercício 73 e 75',
    descricao: 'Estudo sistemático de trioletes. Volmer recomenda acentuar levemente a primeira nota de cada triolete para garantir a estabilidade do pulso.'
  },

  // SEÇÃO 6: GOLPES DE ARCO VIRTUSOS (MARTELÉ, SPICCATO & WURFBOGEN) (Págs. 42-59)
  {
    numero: 77,
    secao: 'Golpes de Arco (Martelé, Spiccato & Triolen)',
    pagina: 42,
    faseOrquestra: 3,
    titulo: 'Der gehämmerte Strich (Martelé – Golpes de Arco Martelados)',
    tonalidade: 'Fá Maior / Si♭ Maior',
    compasso: '4/4',
    andamento: 'Allegro decisivo',
    nivel: 'Intermediário',
    conceitos: ['Martelé (Gehämmerter Strich)', 'Pré-pressão de Arco', 'Ataque Seco'],
    dificuldades: ['Produzir o estalo limpo sem esmagar o som'],
    prerequisitos: ['Unidade 5 concluída'],
    tecnicaPrincipal: 'Martelé no talão e ponta com parada firme (Pause nach jeder Note)',
    habilidadeDesenvolvida: 'Projeção incisiva e acentuação técnica para orquestra',
    tempoEstimadoMinutos: 20,
    sugestaoContinuidade: 'Exercício 78 e 80',
    descricao: 'Iniciação ao Martelé (Der gehämmerte Strich). A autora ensina: "O arco permanece firme na corda durante a pausa e executa a nota com impulso rápido e enérgico."'
  },
  {
    numero: 80,
    secao: 'Golpes de Arco (Martelé, Spiccato & Triolen)',
    pagina: 44,
    faseOrquestra: 3,
    titulo: 'Etüde zur Wohlfahrt mit Stricharten (Estudo de Arco com 4 Variantes)',
    tonalidade: 'Si♭ Maior',
    compasso: '4/4',
    andamento: 'Allegro',
    nivel: 'Intermediário',
    compositor: 'Franz Wohlfahrt',
    conceitos: ['Estudo de Arco', 'Variações de Stricharten', 'Martelé e Détaché'],
    dificuldades: ['Coordenar a velocidade rápida da mão esquerda com as trocas de arco em Martelé'],
    prerequisitos: ['Exercício 77'],
    tecnicaPrincipal: 'Execução de estudo de Wohlfahrt em 4 combinações de arco (G.B., o.H. martelé, u.H.)',
    habilidadeDesenvolvida: 'Agilidade de arco e resistência muscular',
    tempoEstimadoMinutos: 25,
    sugestaoContinuidade: 'Exercício 82 e 84',
    descricao: 'Célebre estudo de Wohlfahrt adaptado para viola. Deve ser praticado com 4 modalidades de arco, destacando o Martelé na metade superior.'
  },
  {
    numero: 94,
    secao: 'Golpes de Arco (Martelé, Spiccato & Triolen)',
    pagina: 51,
    faseOrquestra: 4,
    titulo: 'Vorbereitende Übung zum geworfenen Bogenstrich (Spiccato Preparatório)',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Moderato',
    nivel: 'Avançado',
    conceitos: ['Spiccato (WurfBogen)', 'Movimento Circular de Pulso', 'Lançamento de Arco'],
    dificuldades: ['Lançar o arco a 3cm sem perder o ponto de contato ideal'],
    prerequisitos: ['Exercício 80'],
    tecnicaPrincipal: 'Preparação do Spiccato no terço inferior do arco com movimento pendular',
    habilidadeDesenvolvida: 'Elasticidade de pulso e controle de rebordo de crina',
    tempoEstimadoMinutos: 20,
    sugestaoContinuidade: 'Exercício 95 e 96',
    descricao: 'Preparação para o Spiccato (Der geworfene Bogenstrich). O arco toca brevemente a corda a 3cm de altura descrevendo um movimento circular de pêndulo.'
  },
  {
    numero: 96,
    secao: 'Golpes de Arco (Martelé, Spiccato & Triolen)',
    pagina: 52,
    faseOrquestra: 4,
    titulo: 'Kleine Etüde im WurfBogen (Estudo em Spiccato Continuado)',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Allegro con brio',
    nivel: 'Avançado',
    conceitos: ['Spiccato Continuado', 'Troca de Cordas em Spiccato', 'Ressonância'],
    dificuldades: ['Manter a altura do salto constante em passagens rápidas de semicolcheias'],
    prerequisitos: ['Exercícios 94 e 95'],
    tecnicaPrincipal: 'Execução contínua de Spiccato (WurfBogen) com trocas de corda',
    habilidadeDesenvolvida: 'Virtuosismo na mão direita e leveza de salto',
    tempoEstimadoMinutos: 25,
    sugestaoContinuidade: 'Exercício 98 e 100 (Musette de Bach)',
    descricao: 'Estudo em Spiccato continuado. Exige que a crina do arco salte de forma homogênea no ponto de equilíbrio (Mitte-Frosch).'
  },
  {
    numero: 100,
    secao: 'Golpes de Arco (Martelé, Spiccato & Triolen)',
    pagina: 54,
    faseOrquestra: 4,
    titulo: 'Musette em Dó Maior (Dueto Lyrico de J. S. Bach)',
    tonalidade: 'Dó Maior',
    compasso: '2/4',
    andamento: 'Allegretto scherzando',
    nivel: 'Avançado',
    compositor: 'Johann Sebastian Bach (1685-1750)',
    conceitos: ['Repertório Bachiano', 'Pedal de Baixo de Gaita de Fole', 'Staccato Ligeiro'],
    dificuldades: ['Diferenciar o pedal staccato do acompanhamento da melodia solista'],
    prerequisitos: ['Exercício 96 e 99'],
    tecnicaPrincipal: 'Contraponto barroco com pedal de corda solta e articulação refinada',
    habilidadeDesenvolvida: 'Polifonia e fraseado barroco de alto nível',
    tempoEstimadoMinutos: 25,
    sugestaoContinuidade: 'Exercício 103 e 108',
    descricao: 'Musette do Caderno de Anna Magdalena Bach. O aluno de viola interpreta o pedal característico de gaita de fole e a melodia em dueto virtuoso.'
  },

  // SEÇÃO 7: DIE HALBE LAGE, ESCALAS MENORES & APÊNDICE (Págs. 60-82)
  {
    numero: 113,
    secao: 'Die Halbe Lage (Meia Posição)',
    pagina: 60,
    faseOrquestra: 4,
    titulo: 'Übung in der halben Lage (Sattellage) & Nach einer Etüde von Alard',
    tonalidade: 'Fá Maior / Si♭ Menor / Mi♭ Maior',
    compasso: '4/4 e 3/4',
    andamento: 'Moderato',
    nivel: 'Avançado',
    compositor: 'Berta Volmer / Delphin Alard',
    conceitos: ['Halbe Lage (Meia Posição)', 'Sattellage', 'Substituição de Extensão'],
    dificuldades: ['Manter a afinação da mão deslocada meio tom para trás junto à pestana'],
    prerequisitos: ['Unidade 6 concluída'],
    tecnicaPrincipal: 'Uso da Meia Posição para evitar esticar o 4º dedo na viola',
    habilidadeDesenvolvida: 'Economia de movimento e facilidade em tonalidades muito bemolizadas',
    tempoEstimadoMinutos: 25,
    sugestaoContinuidade: 'Exercício 114 e 117',
    descricao: 'Apresentação da Die Halbe Lage (Meia Posição). Volmer destaca que na viola a extensão do 4º dedo é desconfortável; a Meia Posição resolve o problema deslocando a mão toda meio tom para trás.'
  },
  {
    numero: 117,
    secao: 'Die Halbe Lage (Meia Posição)',
    pagina: 62,
    faseOrquestra: 4,
    titulo: 'Der zweimalige Gebrauch desselben Fingers & Die chromatische Tonleiter',
    tonalidade: 'Escala Cromática',
    compasso: '4/4',
    andamento: 'Lento con precisione',
    nivel: 'Avançado',
    conceitos: ['Escala Cromática', 'Deslizamento de Dedo (Changement de doigt)', 'Meio-Tom Cromático'],
    dificuldades: ['Deslizar o mesmo dedo mantendo o semitom limpo sem portamento excessivo'],
    prerequisitos: ['Exercício 113'],
    tecnicaPrincipal: 'Uso duplo do mesmo dedo e deslizes cromáticos na 1ª posição',
    habilidadeDesenvolvida: 'Articulação cromática de alta precisão',
    tempoEstimadoMinutos: 25,
    sugestaoContinuidade: 'Exercício 119 e 120 (Escalas Menores)',
    descricao: 'Estudo do uso duplo do mesmo dedo para notas cromáticas adjacentes e execução da Escala Cromática completa em 2 oitavas na viola.'
  },
  {
    numero: 120,
    secao: 'Die Moll-Tonleitern (Escalas Menores & Dinâmicas)',
    pagina: 64,
    faseOrquestra: 4,
    titulo: 'Die a-moll-Tonleiter (harmonisch, melodisch, Dreiklang e Verminderter Septimen-Akkord)',
    tonalidade: 'Lá Menor',
    compasso: '4/4',
    andamento: 'Andante con espressività',
    nivel: 'Avançado',
    conceitos: ['Lá Menor Armônica e Melódica', 'Segunda Aumentada', 'Acorde de 7ª Diminuta'],
    dificuldades: ['Afinação da 7ª sensível (Sol♯) e o salto de Segunda Aumentada entre Fá e Sol♯'],
    prerequisitos: ['Exercícios 117 e 119'],
    tecnicaPrincipal: 'Execução de escala menor armônica e melódica com arpejos diminutos',
    habilidadeDesenvolvida: 'Sensibilidade modal e afinação dramática',
    tempoEstimadoMinutos: 25,
    sugestaoContinuidade: 'Exercício 123 (d-moll) e 130 (g-moll)',
    descricao: 'Estudo sistemático da escala de Lá Menor nas formas Armônica e Melódica, arpejo menor e acorde de 7ª diminuta. Início do módulo de modos menores do método.'
  },
  {
    numero: 142,
    secao: 'Die Moll-Tonleitern (Escalas Menores & Dinâmicas)',
    pagina: 77,
    faseOrquestra: 4,
    titulo: 'Die ersten dynamischen Übungen (Forte x Piano, Crescendo x Decrescendo)',
    tonalidade: 'Dó Maior',
    compasso: '4/4',
    andamento: 'Andante largo',
    nivel: 'Avançado',
    conceitos: ['Nuances Dinâmicas', 'Forte (f) e Piano (p)', 'Crescendo (<) e Decrescendo (>)'],
    dificuldades: ['Aumentar o peso e velocidade do arco em crescendo sem desafinar o som'],
    prerequisitos: ['Exercícios 135 a 140'],
    tecnicaPrincipal: 'Controle de dinâmica Barroca e Romântica através de pressão, velocidade e ponto de contato',
    habilidadeDesenvolvida: 'Sprezzatura e expressividade orquestral refinada',
    tempoEstimadoMinutos: 25,
    sugestaoContinuidade: 'Exercício 143 a 146',
    descricao: 'Exercícios dinâmicos formais. Volmer aborda: 1) Dinâmica de contraste Barroca (f e p), 2) Som crescente e decrescente Romântico (crescendo e decrescendo), 3) Acentuações fp e sfz.'
  },
  {
    numero: 147,
    secao: 'Bogentechnischer Anhang (Apêndice de Golpes de Arco)',
    pagina: 80,
    faseOrquestra: 4,
    titulo: 'Bogentechnischer Anhang (Apêndice Técnico com 84 Variações de Arco)',
    tonalidade: 'Dó Maior / Sol Maior / Ré Maior',
    compasso: '4/4, 3/4, 2/4',
    andamento: 'Vários Andamentos',
    nivel: 'Avançado',
    conceitos: ['Apêndice Técnico de Arco', '84 Variações de Stricharten', 'Virtuosismo de Mão Direita'],
    dificuldades: ['Manter a precisão e velocidade em todas as 84 variações'],
    prerequisitos: ['Método Berta Volmer Volume 1 completo'],
    tecnicaPrincipal: 'Aplicação sistemática de Détaché, Martelé, Legato, Staccato, Spiccato e ritmos mistos',
    habilidadeDesenvolvida: 'Domínio absoluto da mão direita para o violista orquestral',
    tempoEstimadoMinutos: 30,
    sugestaoContinuidade: 'Berta Volmer Volume 2 (ED 4614 - Mudanças de Posição)',
    descricao: 'O grande fecho pedagógico do Volume 1 de Berta Volmer. Um apêndice de técnica de arco contendo 84 variações de articularções (Détaché, Martelé, Legato, Staccato, Spiccato WurfBogen, Trioletes e Ritmos Mistos) a ser praticado diariamente.'
  }
];
