# 🎼 Melodia CCB

**Sistema de Gestão da Orquestra — Gestão, Ensino, Frequência, Escalas e Acervo Musical**

O **Melodia CCB** é uma aplicação desenvolvida para auxiliar na gestão de orquestras, alunos, músicos, professores, turmas, aulas, frequência, avaliações, escalas e acervo pedagógico.

O projeto busca transformar processos que tradicionalmente dependem de planilhas e controles manuais em uma plataforma centralizada, organizada e preparada para evolução tecnológica.

---

## 📌 Visão geral

O Melodia CCB foi pensado para atender diferentes necessidades da administração de uma orquestra:

* 👥 Cadastro e gerenciamento de alunos e músicos
* 🎻 Organização por naipes e instrumentos
* 🏫 Gerenciamento de turmas
* 📚 Controle de métodos e materiais pedagógicos
* 📝 Registro de aulas
* ✅ Controle de presença
* 📊 Acompanhamento de desempenho
* 🎼 Organização de escalas
* 📅 Controle de cultos e ensaios
* 📥 Importação de dados legados
* 🔄 Pipeline ETL para tratamento de dados
* 📤 Exportação de dados para Excel
* 💾 Backup dos dados
* 📑 Geração de relatórios
* 🤖 Recursos preparados para integração com IA
* 🖥️ Execução como aplicação desktop através do Electron

---

## 🚀 Tecnologias

O projeto utiliza uma arquitetura baseada em tecnologias modernas do ecossistema JavaScript/TypeScript.

### Front-end

* **React**
* **TypeScript**
* **Vite**
* **HTML5**
* **CSS**
* Componentização para organização da interface

### Desktop

* **Electron**
* **electron-builder**

O Electron permite transformar a aplicação web em um aplicativo desktop distribuível, incluindo geração de executáveis para Windows.

### Dados e planilhas

* **SheetJS / XLSX**
* Importação de arquivos `.xlsx`, `.xls` e `.csv`
* Exportação de planilhas `.xlsx`
* Conversão de dados entre planilhas e estruturas utilizadas pelo sistema
* Processamento e limpeza de dados através de ETL

### Apresentações e documentos

* **PptxGenJS**
* Recursos para geração de apresentações e materiais estruturados.

### Inteligência Artificial

O projeto possui integração/estrutura preparada para utilização de recursos de IA, incluindo tecnologias do ecossistema Google.

---

# 🏗️ Arquitetura do projeto

Uma visão simplificada da estrutura:

```text
melodia-ccb/
│
├── electron/
│   ├── main
│   ├── preload
│   └── configurações desktop
│
├── src/
│   ├── components/
│   │   ├── Config.tsx
│   │   ├── ImportadorLegadoETL.tsx
│   │   └── ...
│   │
│   ├── utils/
│   │   ├── legacyExcelGenerator.ts
│   │   └── ...
│   │
│   ├── pages/
│   ├── services/
│   ├── types/
│   └── ...
│
├── public/
│
├── dist/
│
├── package.json
├── vite.config.*
├── tsconfig.json
└── README.md
```

> A estrutura pode evoluir conforme novas funcionalidades e módulos forem incorporados ao sistema.

---

# 🎻 Principais módulos

## 👥 Gestão de pessoas

Centralização das informações relacionadas a:

* Alunos
* Músicos
* Professores
* Instrumentistas
* Naipes
* Turmas

A estrutura permite organizar os integrantes da orquestra de maneira mais eficiente.

---

## 📚 Métodos e acervo pedagógico

O sistema foi projetado para organizar materiais utilizados no processo de aprendizagem musical.

Entre os recursos previstos/implementados estão:

* Métodos
* Exercícios
* Materiais de estudo
* Catálogo pedagógico
* Organização por instrumento
* Organização por naipe
* Histórico de utilização

A ideia é acompanhar a evolução do aluno desde os exercícios iniciais até os conteúdos musicais utilizados posteriormente.

---

# 🏫 Gestão de aulas

O módulo de aulas permite estruturar informações como:

* Turma
* Professor
* Aluno
* Data
* Conteúdo trabalhado
* Frequência
* Avaliação
* Observações

Isso possibilita construir um histórico pedagógico do aluno ao longo de sua formação.

---

# ✅ Controle de frequência

O sistema permite registrar e acompanhar a presença dos alunos.

O objetivo é facilitar:

* Registro de presença
* Histórico de frequência
* Identificação de faltas
* Acompanhamento individual
* Relatórios administrativos

---

# 🎼 Gestão de escalas

O Melodia CCB também possui estrutura voltada para organização das escalas da orquestra.

Podem ser organizados dados relacionados a:

* Cultos
* Ensaios
* Músicos
* Instrumentos
* Naipes
* Datas
* Participação

---

# 📥 Importação de dados legados

Um dos recursos importantes do projeto é o **Importador Legado ETL**.

A aplicação pode trabalhar com arquivos:

```text
.xlsx
.xls
.csv
```

O fluxo foi desenvolvido para transformar dados antigos em informações estruturadas para utilização no sistema.

### Pipeline

```text
Arquivo legado
      ↓
Importação
      ↓
Extração
      ↓
Tratamento / limpeza
      ↓
Padronização
      ↓
Validação
      ↓
Mapeamento
      ↓
Dados estruturados
      ↓
Sistema
```

Esse processo permite reduzir o trabalho manual necessário para migrar informações existentes em planilhas.

---

# 📊 Excel

O projeto possui recursos de importação e exportação utilizando **XLSX/SheetJS**.

Entre os recursos estão:

### Importação

* Pessoas
* Chamadas
* Escalas
* Dados históricos
* Informações legadas

### Exportação

O sistema possui funções para geração de planilhas com múltiplas abas, incluindo informações como:

* Músicos e alunos
* Aulas
* Frequência
* Escalas
* Turmas
* Catálogo pedagógico

Exemplo conceitual:

```text
Acervo_Completo
│
├── 1. Músicos e Alunos
├── 2. Aulas e Frequência
├── 3. Escalas de Cultos
├── 4. Turmas por Naipe
└── 5. Catálogo Pedagógico
```

---

# 🛡️ Segurança

A segurança das dependências é tratada como parte do desenvolvimento do projeto.

Durante a preparação da versão desktop, foram realizadas análises através do:

```bash
npm audit
```

O projeto também passou por atualização das dependências relacionadas ao Electron e ao processo de empacotamento.

### Boas práticas

Recomenda-se executar periodicamente:

```bash
npm audit
```

e:

```bash
npm outdated
```

Antes de atualizar dependências importantes, deve-se testar:

```bash
npm run build
```

e, posteriormente, o processo completo de empacotamento.

> Vulnerabilidades reportadas por dependências indiretas devem ser analisadas individualmente. Nem toda vulnerabilidade deve ser resolvida simplesmente utilizando `npm audit fix --force`, especialmente em aplicações Electron, pois essa opção pode introduzir alterações incompatíveis.

---

# 🖥️ Aplicação Desktop

O projeto utiliza Electron para transformar a aplicação em um programa desktop.

Fluxo conceitual:

```text
React + TypeScript
        ↓
       Vite
        ↓
   Build Web
        ↓
     Electron
        ↓
 electron-builder
        ↓
  Aplicação Windows
```

O objetivo é disponibilizar o sistema como uma aplicação executável, reduzindo a necessidade de executar manualmente um servidor de desenvolvimento.

---

# 🔧 Instalação

## Pré-requisitos

Recomenda-se possuir instalado:

* Node.js
* npm
* Git

Verifique as versões:

```bash
node --version
npm --version
git --version
```

---

## 📦 Instalar dependências

Clone o projeto:

```bash
git clone https://github.com/SEU-USUARIO/melodia-ccb.git
```

Entre no diretório:

```bash
cd melodia-ccb
```

Instale as dependências:

```bash
npm install
```

---

# ▶️ Desenvolvimento

Para iniciar o projeto em modo de desenvolvimento:

```bash
npm run dev
```

O Vite disponibilizará a aplicação no endereço indicado pelo terminal.

---

# 🏗️ Build

Para gerar a versão de produção:

```bash
npm run build
```

O resultado será disponibilizado normalmente em:

```text
dist/
```

---

# 📦 Build do aplicativo Electron

O empacotamento do aplicativo depende da configuração do `electron-builder`.

Exemplo:

```bash
npx electron-builder
```

Ou, caso exista um script configurado no `package.json`:

```bash
npm run dist
```

A saída será disponibilizada no diretório configurado pelo projeto, normalmente:

```text
release/
```

ou:

```text
dist/
```

---

# 🧪 Testes e validação

Antes de gerar uma versão distribuível, recomenda-se executar:

```bash
npm install
npm run build
npm audit
```

Depois:

```bash
npx electron-builder
```

E testar o aplicativo gerado em uma instalação limpa do Windows.

---

# 🔐 Modelo de segurança para Electron

Aplicações Electron devem evitar expor diretamente APIs privilegiadas ao renderer.

A arquitetura recomendada utiliza:

```text
Renderer
   │
   │ IPC controlado
   ↓
Preload
   │
   │ API limitada
   ↓
Main Process
```

Boas práticas incluem:

* `contextIsolation: true`
* evitar `nodeIntegration: true`
* utilizar `preload`
* expor somente APIs necessárias através de `contextBridge`
* validar dados recebidos via IPC
* evitar executar código arbitrário
* validar caminhos de arquivos
* evitar operações privilegiadas diretamente no renderer

---

# 📁 Dados e arquivos

O sistema trabalha com diferentes tipos de dados e arquivos, especialmente:

```text
CSV
XLS
XLSX
JSON
```

Arquivos importados devem ser considerados **entrada não confiável**.

Por isso, processos de importação devem realizar:

1. Validação do arquivo
2. Validação do formato
3. Limitação de tamanho
4. Tratamento de erros
5. Sanitização dos dados
6. Validação dos campos
7. Processamento seguro

---

# 📊 Performance

Durante o build do projeto podem aparecer avisos relacionados ao tamanho dos bundles JavaScript.

Exemplo:

```text
Some chunks are larger than 500 kB after minification.
```

Esse aviso não significa necessariamente que o build falhou.

Para aplicações maiores, podem ser aplicadas estratégias como:

* `dynamic import()`
* code splitting
* `manualChunks`
* carregamento sob demanda
* separação de módulos pesados

Isso pode reduzir o tempo inicial de carregamento da aplicação.

---

# 🗺️ Roadmap

O projeto pode evoluir em diferentes etapas.

### ✅ Base

* [x] Interface web
* [x] React
* [x] TypeScript
* [x] Vite
* [x] Integração com Electron
* [x] Exportação Excel
* [x] Importação Excel/CSV
* [x] Pipeline ETL
* [x] Gestão de pessoas
* [x] Gestão de aulas
* [x] Frequência
* [x] Escalas

### 🔄 Em evolução

* [ ] Melhorias no sistema de permissões
* [ ] Auditoria de alterações
* [ ] Melhorias de segurança do Electron
* [ ] Otimização do bundle
* [ ] Testes automatizados
* [ ] Testes de integração
* [ ] Testes de segurança
* [ ] Melhorias no sistema de backup

### 🚀 Futuro

* [ ] Dashboard administrativo avançado
* [ ] Indicadores pedagógicos
* [ ] Relatórios avançados
* [ ] Sincronização entre dispositivos
* [ ] Controle de usuários e permissões
* [ ] Sistema de notificações
* [ ] Integração mais profunda com IA
* [ ] Arquitetura preparada para múltiplas orquestras

---

# 🧪 Desenvolvimento orientado à segurança

O projeto deve ser continuamente avaliado contra problemas como:

* Vulnerabilidades de dependências
* Prototype Pollution
* ReDoS
* Path Traversal
* Manipulação insegura de arquivos
* IPC inseguro
* XSS
* CSRF, quando aplicável
* Exposição indevida de APIs
* Configurações inseguras do Electron
* Injeção de comandos
* Problemas de validação de entrada
* Vazamento de informações
* Problemas no processo de atualização da aplicação

Qualquer teste de segurança deve ser realizado somente em ambientes e sistemas autorizados.

---

# 🤖 IA e transformação digital

O Melodia CCB foi concebido não apenas como um sistema administrativo, mas como uma iniciativa de **transformação digital aplicada à gestão musical**.

A utilização de inteligência artificial pode futuramente auxiliar em áreas como:

* Análise de dados
* Relatórios automáticos
* Busca inteligente no acervo
* Assistência administrativa
* Classificação de informações
* Recomendações pedagógicas
* Processamento de dados históricos

A IA deve atuar como uma camada de apoio à gestão, mantendo os dados oficiais como fonte de verdade.

---

# 🎯 Objetivo do projeto

O objetivo principal do Melodia CCB é criar uma solução tecnológica capaz de centralizar informações que normalmente ficam distribuídas entre:

```text
Planilhas
   +
Documentos
   +
Anotações
   +
Registros de aulas
   +
Escalas
   +
Histórico dos alunos
```

transformando tudo em uma plataforma estruturada:

```text
              MELodia CCB
                   │
       ┌───────────┼───────────┐
       │           │           │
    Gestão      Ensino      Acervo
       │           │           │
    Pessoas      Aulas      Métodos
    Turmas      Presença    Materiais
    Escalas     Avaliação   Histórico
       │           │           │
       └───────────┼───────────┘
                   │
               Dados
                   │
             ETL / Excel
                   │
             Relatórios
                   │
                  IA
```

---

# 👨‍💻 Desenvolvimento

Projeto desenvolvido como iniciativa de aplicação prática de conhecimentos em:

* Tecnologia da Informação
* Engenharia de Software
* Desenvolvimento Web
* Desenvolvimento Desktop
* Banco de Dados
* Engenharia de Dados
* ETL
* Business Intelligence
* Inteligência Artificial
* Segurança de aplicações
* Transformação Digital

---

# 📄 Licença

Defina aqui a licença do projeto antes de disponibilizá-lo publicamente.

Exemplo:

```text
MIT License
```

Caso o projeto contenha materiais, dados ou conteúdos pertencentes a terceiros, verifique suas respectivas licenças antes de redistribuí-los.

---

# ⚠️ Status

**Em desenvolvimento ativo.**

O projeto está passando por evolução de arquitetura, segurança, empacotamento desktop, otimização e melhorias de funcionalidades.

Interfaces, APIs internas, estrutura de dados e funcionalidades podem sofrer alterações durante o desenvolvimento.

---

# ⭐ Contribuição

Contribuições podem ser organizadas através de:

1. Fork do projeto
2. Criação de uma branch
3. Implementação da alteração
4. Testes
5. Pull Request

Exemplo:

```bash
git checkout -b feature/nova-funcionalidade
```

Depois:

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade
```

---

## 🎼 Melodia CCB

**Tecnologia aplicada à gestão, educação musical e transformação digital.**
