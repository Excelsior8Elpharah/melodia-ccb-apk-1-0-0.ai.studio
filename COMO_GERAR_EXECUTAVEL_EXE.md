# Guia de Exportação para Windows: Aplicativo Executável (.EXE)
**Melodia CCB - CCB Jardim Maria Rosa (Taboão da Serra)**

O projeto já passou por **auditoria de QA**, validação estrita de tipos TypeScript (`tsc --noEmit`), compilação do Vite e testes de caminhos de arquivos relativos. Está 100% pronto para gerar o `.exe` para Windows.

---

### Método 1: Automático em 1 Clique (Mais Fácil)

1. No Google AI Studio, clique em **Settings / Export** > **Download ZIP**.
2. Descompacte a pasta no seu computador Windows (ex: `C:\MelodiaCCB`).
3. Dê **duplo clique** no arquivo:
   ```
   GERAR_EXECUTAVEL_AUTOMATICO.bat
   ```
4. O script fará tudo sozinho:
   - Verifica o Node.js;
   - Instala as dependências necessárias;
   - Compila a aplicação e monta o instalador do Windows;
   - Abre automaticamente a pasta `dist_electron\` contendo seus executáveis prontos!

---

### Método 2: Via Linha de Comando (CMD / PowerShell)

Se preferir fazer pelo terminal:
1. Abra o CMD ou PowerShell na pasta do projeto:
   ```cmd
   cd "C:\MelodiaCCB"
   ```
2. Instale as dependências:
   ```cmd
   npm install
   ```
3. Gere o executável:
   ```cmd
   npm run build:exe
   ```

---

### Arquivos Gerados na pasta `dist_electron\`:

1. **`Melodia CCB Setup 1.0.0.exe`**:
   - Instalador com assistente clássico do Windows.
   - Cria atalho na **Área de Trabalho** e no **Menu Iniciar**.
   - Permite escolher a pasta de instalação.
2. **`Melodia CCB 1.0.0.exe`**:
   - Versão **Portátil** (Portable).
   - Não requer instalação: você pode salvar no computador ou em um pendrive e dar duplo clique para abrir diretamente em qualquer computador.

---

### Recursos Nativos Ativados no Aplicativo Desktop:
- **Janela Nativa Segura**: Isolamento de contexto com Electron (`contextIsolation: true`).
- **Banco de Dados Offline**: Armazenamento em IndexedDB e LocalStorage com persistência contínua local.
- **Atalhos do Teclado**:
  - `Ctrl + P`: Imprime relatórios e boletins diretamente para a impressora ou salva em PDF.
  - `F11`: Alterna modo tela cheia.
  - `F12`: Alterna ferramentas de desenvolvedor / console para inspeção e testes (QA).
  - `Ctrl + R` / `F5`: Recarrega os dados.
- **Backup & Restauração**: Compatível com backups criptografados com AES-256 (`.melodia`) e planilhas Excel (`.xlsx`).

---

### Método 3: Instalação Instantânea sem Compilação (PWA)
Você também pode instalar o aplicativo direto pelo navegador sem compilar:
1. Abra o link do app no **Google Chrome** ou **Microsoft Edge**.
2. Na barra de endereços, clique no ícone **"Instalar aplicativo"** (ou no menu do navegador em *Salvar e Compartilhar > Instalar Melodia CCB*).
3. Um atalho nativo será adicionado à sua Área de Trabalho imediatamente!
