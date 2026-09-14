/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Calendar, 
  Music, 
  ClipboardList, 
  Settings, 
  Sun, 
  Moon, 
  Download, 
  Upload, 
  Plus,
  Compass,
  AlertCircle,
  Menu,
  X,
  FileText,
  TrendingUp,
  BookOpen,
  Wind,
  FileSpreadsheet,
  Lock,
  ShieldCheck,
  History
} from 'lucide-react';

import { Pessoa, Turma, Aula, Escala, DiarioRegistro, MaterialCatalogo } from './types';
import { db } from './data/db';
import logoImg from './assets/images/melodia_ccb_logo_1785206131652.jpg';

// Auth & RBAC imports
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserBadge } from './components/UserBadge';
import { ProtectedContent } from './components/ProtectedRoute';
import { logAuditEvent } from './utils/auditLogger';

// Privacy & PII Masking imports
import { PrivacyProvider } from './context/PrivacyContext';
import { PrivacyToggle } from './components/PrivacyToggle';

// Component imports
import Dashboard from './components/Dashboard';
import Pessoas from './components/Pessoas';
import Turmas from './components/Turmas';
import Aulas from './components/Aulas';
import Orquestra from './components/Orquestra';
import Escalas from './components/Escalas';
import Config from './components/Config';
import Boletim from './components/Boletim';
import Analises from './components/Analises';
import Catalogo from './components/Catalogo';
import MetodosDashboard from './components/MetodosDashboard';
import ImportadorLegadoETL from './components/ImportadorLegadoETL';
import { EncryptedBackupModal } from './components/EncryptedBackupModal';
import { AuditLogViewerModal } from './components/AuditLogViewerModal';
import LoginScreen from './components/LoginScreen';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

function MelodiaApp() {
  const { user, canPerform } = useAuth();

  // Database States
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [escalas, setEscalas] = useState<Escala[]>([]);
  const [diarios, setDiarios] = useState<DiarioRegistro[]>([]);
  const [catalogo, setCatalogo] = useState<MaterialCatalogo[]>([]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Global Toasts State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Bridge to trigger "New Form Modal" inside active child components
  const [triggerNewForm, setTriggerNewForm] = useState<number>(0);

  // Encrypted Backup Modal State
  const [isEncryptedBackupOpen, setIsEncryptedBackupOpen] = useState<boolean>(false);
  // Audit Trail Modal State
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState<boolean>(false);

  // Load Initial Database and Theme
  useEffect(() => {
    setPessoas(db.getPessoas());
    setTurmas(db.getTurmas());
    setAulas(db.getAulas());
    setEscalas(db.getEscalas());
    setDiarios(db.getDiarios());
    setCatalogo(db.getCatalogo());
    
    const initialTheme = db.getTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  // Sync DOM theme class whenever state changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Theme Applier
  const applyTheme = (t: 'light' | 'dark') => {
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    db.saveTheme(nextTheme);
    applyTheme(nextTheme);
    showToast(`Modo ${nextTheme === 'dark' ? 'escuro' : 'claro'} ativado.`, 'info');
  };

  // Toast Trigger Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Save Handlers (reactive to state updates)
  const handleSavePessoa = (pessoa: Pessoa) => {
    const updated = pessoas.some(p => p.id === pessoa.id)
      ? pessoas.map(p => p.id === pessoa.id ? pessoa : p)
      : [...pessoas, pessoa];
    setPessoas(updated);
    db.savePessoas(updated);
  };

  const handleDeletePessoa = (id: string) => {
    const updated = pessoas.filter(p => p.id !== id);
    setPessoas(updated);
    db.savePessoas(updated);

    // Clean up enrollment or reference to the deleted person
    const updatedTurmas = turmas.map(t => ({
      ...t,
      professorId: t.professorId === id ? '' : t.professorId,
      alunosIds: t.alunosIds.filter(aid => aid !== id)
    }));
    setTurmas(updatedTurmas);
    db.saveTurmas(updatedTurmas);

    const updatedEscalas = escalas.map(e => ({
      ...e,
      regenteId: e.regenteId === id ? '' : e.regenteId,
      musicosIds: e.musicosIds.filter(mid => mid !== id)
    }));
    setEscalas(updatedEscalas);
    db.saveEscalas(updatedEscalas);
  };

  const handleSaveTurma = (turma: Turma) => {
    const updated = turmas.some(t => t.id === turma.id)
      ? turmas.map(t => t.id === turma.id ? turma : t)
      : [...turmas, turma];
    setTurmas(updated);
    db.saveTurmas(updated);
  };

  const handleDeleteTurma = (id: string) => {
    const updated = turmas.filter(t => t.id !== id);
    setTurmas(updated);
    db.saveTurmas(updated);

    // Cascading delete for lessons associated with this class
    const updatedAulas = aulas.filter(a => a.turmaId !== id);
    setAulas(updatedAulas);
    db.saveAulas(updatedAulas);
  };

  const handleSaveAula = (aula: Aula) => {
    const updated = aulas.some(a => a.id === aula.id)
      ? aulas.map(a => a.id === aula.id ? aula : a)
      : [...aulas, aula];
    setAulas(updated);
    db.saveAulas(updated);
  };

  const handleDeleteAula = (id: string) => {
    const updated = aulas.filter(a => a.id !== id);
    setAulas(updated);
    db.saveAulas(updated);
  };

  const handleSaveEscala = (escala: Escala) => {
    const updated = escalas.some(e => e.id === escala.id)
      ? escalas.map(e => e.id === escala.id ? escala : e)
      : [...escalas, escala];
    setEscalas(updated);
    db.saveEscalas(updated);
  };

  const handleDeleteEscala = (id: string) => {
    const updated = escalas.filter(e => e.id !== id);
    setEscalas(updated);
    db.saveEscalas(updated);
  };

  const handleSaveDiario = (diario: DiarioRegistro) => {
    const updated = diarios.some(d => d.id === diario.id)
      ? diarios.map(d => d.id === diario.id ? diario : d)
      : [...diarios, diario];
    setDiarios(updated);
    db.saveDiarios(updated);
  };

  const handleDeleteDiario = (id: string) => {
    const updated = diarios.filter(d => d.id !== id);
    setDiarios(updated);
    db.saveDiarios(updated);
  };

  const handleSaveCatalogo = (material: MaterialCatalogo) => {
    const updated = catalogo.some(c => c.id === material.id)
      ? catalogo.map(c => c.id === material.id ? material : c)
      : [...catalogo, material];
    setCatalogo(updated);
    db.saveCatalogo(updated);
  };

  const handleDeleteCatalogo = (id: string) => {
    const updated = catalogo.filter(c => c.id !== id);
    setCatalogo(updated);
    db.saveCatalogo(updated);
  };

  const handleImportSuccess = (data: {
    novasPessoas: Pessoa[];
    novasAulas: Aula[];
    novasEscalas: Escala[];
  }) => {
    if (data.novasPessoas.length > 0) {
      const updatedPessoas = [...pessoas];
      data.novasPessoas.forEach(np => {
        const idx = updatedPessoas.findIndex(p => p.nome.toLowerCase() === np.nome.toLowerCase());
        if (idx >= 0) {
          updatedPessoas[idx] = { ...updatedPessoas[idx], ...np };
        } else {
          updatedPessoas.push(np);
        }
      });
      setPessoas(updatedPessoas);
      db.savePessoas(updatedPessoas);
    }

    if (data.novasAulas.length > 0) {
      const updatedAulas = [...aulas, ...data.novasAulas];
      setAulas(updatedAulas);
      db.saveAulas(updatedAulas);
    }

    if (data.novasEscalas.length > 0) {
      const updatedEscalas = [...escalas, ...data.novasEscalas];
      setEscalas(updatedEscalas);
      db.saveEscalas(updatedEscalas);
    }
  };

  // Database seed / clean operations
  const handleSeedDatabase = () => {
    db.seed();
    setPessoas(db.getPessoas());
    setTurmas(db.getTurmas());
    setAulas(db.getAulas());
    setEscalas(db.getEscalas());
    setDiarios(db.getDiarios());
    setCatalogo(db.getCatalogo());
    setActiveTab('dashboard');
  };

  const handleClearDatabase = () => {
    db.clear();
    setPessoas([]);
    setTurmas([]);
    setAulas([]);
    setEscalas([]);
    setDiarios([]);
    setCatalogo([]);
    setActiveTab('dashboard');
  };

  // Backup and restore trigger
  const handleDownloadBackup = () => {
    if (!canPerform('EXPORT_BACKUP')) {
      showToast('Apenas o Encarregado / Administrador tem permissão para exportar backup.', 'error');
      return;
    }
    const jsonStr = db.backupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orquestra_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logAuditEvent(user, 'BACKUP_EXPORTED', 'Exportação de backup no formato JSON desprotegido realizada.');
    showToast('Backup JSON exportado com sucesso!', 'success');
  };

  const handleRestoreBackup = (jsonStr: string): boolean => {
    if (!canPerform('EXPORT_BACKUP')) {
      showToast('Apenas o Encarregado / Administrador tem permissão para restaurar backup.', 'error');
      return false;
    }
    const success = db.restoreBackup(jsonStr);
    if (success) {
      setPessoas(db.getPessoas());
      setTurmas(db.getTurmas());
      setAulas(db.getAulas());
      setEscalas(db.getEscalas());
      setDiarios(db.getDiarios());
      setCatalogo(db.getCatalogo());
      setActiveTab('dashboard');
      logAuditEvent(user, 'BACKUP_RESTORED', 'Restauração de banco de dados a partir de arquivo JSON realizada.');
    }
    return success;
  };

  const handleRestoreDecryptedData = (restoredData: object) => {
    if (!canPerform('EXPORT_BACKUP')) {
      showToast('Apenas o Encarregado / Administrador tem permissão para restaurar backup.', 'error');
      return;
    }
    const success = db.restoreBackup(restoredData);
    if (success) {
      setPessoas(db.getPessoas());
      setTurmas(db.getTurmas());
      setAulas(db.getAulas());
      setEscalas(db.getEscalas());
      setDiarios(db.getDiarios());
      setCatalogo(db.getCatalogo());
      setActiveTab('dashboard');
      logAuditEvent(user, 'BACKUP_RESTORED', 'Restauração de banco de dados a partir de arquivo .melodia criptografado realizada.');
      showToast('Backup criptografado restaurado e sincronizado com sucesso!', 'success');
    } else {
      showToast('Falha ao restaurar dados do arquivo criptografado.', 'error');
    }
  };

  const hiddenFileInputRef = useRef<HTMLInputElement>(null);
  
  const handleRestoreClick = () => {
    if (!canPerform('EXPORT_BACKUP')) {
      showToast('Apenas o Encarregado / Administrador tem permissão para restaurar backup.', 'error');
      return;
    }
    hiddenFileInputRef.current?.click();
  };

  const handleSidebarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.melodia')) {
      setIsEncryptedBackupOpen(true);
      showToast('Arquivo .melodia criptografado detectado. Digite a senha na Central de Backup.', 'info');
      if (hiddenFileInputRef.current) hiddenFileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        try {
          const parsed = JSON.parse(result);
          if (parsed.algorithm === 'AES-GCM-256' || parsed.ciphertext) {
            setIsEncryptedBackupOpen(true);
            showToast('Backup criptografado com AES-256 detectado. Digite a senha master para restaurar.', 'info');
            return;
          }
        } catch {
          // ignore error and try regular restore
        }

        const success = handleRestoreBackup(result);
        if (success) {
          showToast('Banco de dados restaurado com sucesso!', 'success');
        } else {
          showToast('Falha ao restaurar backup. Arquivo inválido.', 'error');
        }
      }
    };
    reader.readAsText(file);
    if (hiddenFileInputRef.current) hiddenFileInputRef.current.value = '';
  };

  // Quick Global "+ Adicionar" actions based on active Tab
  const handleGlobalAdd = () => {
    if (['pessoas', 'turmas', 'aulas', 'escalas', 'catalogo'].includes(activeTab)) {
      setTriggerNewForm(prev => prev + 1);
    } else {
      // If on other tabs, navigate to people and open modal
      setActiveTab('pessoas');
      setTimeout(() => {
        setTriggerNewForm(prev => prev + 1);
      }, 100);
    }
  };

  // Rendering Active Component
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            pessoas={pessoas}
            turmas={turmas}
            aulas={aulas}
            escalas={escalas}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
      case 'pessoas':
        return (
          <Pessoas 
            pessoas={pessoas}
            aulas={aulas}
            turmas={turmas}
            diarios={diarios}
            onSave={handleSavePessoa}
            onDelete={handleDeletePessoa}
            onSaveDiario={handleSaveDiario}
            onDeleteDiario={handleDeleteDiario}
            toast={showToast}
            key={`pessoas-tab-${triggerNewForm}`} // Key ensures modal trigger works perfectly
          />
        );
      case 'turmas':
        return (
          <Turmas 
            turmas={turmas}
            pessoas={pessoas}
            onSave={handleSaveTurma}
            onDelete={handleDeleteTurma}
            toast={showToast}
            key={`turmas-tab-${triggerNewForm}`}
          />
        );
      case 'aulas':
        return (
          <Aulas 
            aulas={aulas}
            turmas={turmas}
            pessoas={pessoas}
            catalogo={catalogo}
            onSave={handleSaveAula}
            onDelete={handleDeleteAula}
            toast={showToast}
            key={`aulas-tab-${triggerNewForm}`}
          />
        );
      case 'catalogo':
        return (
          <Catalogo 
            catalogo={catalogo}
            onSave={handleSaveCatalogo}
            onDelete={handleDeleteCatalogo}
            toast={showToast}
            key={`catalogo-tab-${triggerNewForm}`}
          />
        );
      case 'metodos':
        return (
          <MetodosDashboard 
            onAddCatalogItem={handleSaveCatalogo}
            toast={showToast}
          />
        );
      case 'orquestra':


        return <Orquestra pessoas={pessoas} />;
      case 'escalas':
        return (
          <Escalas 
            escalas={escalas}
            pessoas={pessoas}
            onSave={handleSaveEscala}
            onDelete={handleDeleteEscala}
            toast={showToast}
            key={`escalas-tab-${triggerNewForm}`}
          />
        );
      case 'boletim':
        return (
          <Boletim 
            pessoas={pessoas}
            turmas={turmas}
            aulas={aulas}
            catalogo={catalogo}
            diarios={diarios}
            toast={showToast}
          />
        );
      case 'analises':
        return (
          <Analises 
            pessoas={pessoas}
            turmas={turmas}
            aulas={aulas}
            diarios={diarios}
          />
        );
      case 'etl':
        return (
          <ImportadorLegadoETL
            pessoas={pessoas}
            turmas={turmas}
            aulas={aulas}
            escalas={escalas}
            onImportSuccess={handleImportSuccess}
            toast={showToast}
          />
        );
      case 'config':
        return (
          <Config 
            counts={{
              pessoas: pessoas.length,
              turmas: turmas.length,
              aulas: aulas.length,
              escalas: escalas.length,
              catalogo: catalogo.length
            }}
            onSeed={handleSeedDatabase}
            onClear={handleClearDatabase}
            onBackup={handleDownloadBackup}
            onRestore={handleRestoreBackup}
            onOpenEncryptedBackup={() => setIsEncryptedBackupOpen(true)}
            onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
            toast={showToast}
          />
        );
      default:
        return null;
    }
  };

  // Auto-redirect if current tab is forbidden for the active role
  useEffect(() => {
    if (!user) return;
    if (user.role === 'CONSULTA' && ['config', 'pessoas', 'etl', 'analises'].includes(activeTab)) {
      setActiveTab('dashboard');
    } else if (user.role === 'INSTRUTOR' && ['config', 'etl'].includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [user, activeTab]);

  // Navigation Categories adaptadas por Perfil de Acesso (RBAC)
  const navGroups = useMemo(() => {
    if (!user) return [];
    const isConsulta = user.role === 'CONSULTA';

    return [
      {
        title: 'Gestão Acadêmica',
        items: [
          { id: 'dashboard', label: isConsulta ? 'Meu Painel' : 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          ...(!isConsulta ? [{ id: 'pessoas', label: 'Pessoas & Alunos', icon: <Users className="w-4 h-4" /> }] : []),
          { id: 'turmas', label: isConsulta ? 'Minhas Turmas' : 'Turmas & Fases', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'aulas', label: isConsulta ? 'Minhas Aulas' : 'Aulas & Registros', icon: <Calendar className="w-4 h-4" /> },
          { id: 'boletim', label: isConsulta ? 'Meu Boletim' : 'Boletim Pedagógico', icon: <FileText className={`w-4 h-4 ${isConsulta ? 'text-emerald-400' : ''}`} /> },
          ...(user.role === 'ADMIN' ? [{ id: 'etl', label: 'Importador Excel (ETL)', icon: <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> }] : []),
        ]
      },
      {
        title: 'Didática & Acervo',
        items: [
          { id: 'catalogo', label: 'Catálogo & Livros', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'metodos', label: 'Métodos Interativos', icon: <Compass className="w-4 h-4" /> },
        ]
      },
      {
        title: 'Orquestra & Ensaios',
        items: [
          { id: 'orquestra', label: 'Raio-X da Orquestra', icon: <Music className="w-4 h-4" /> },
          { id: 'escalas', label: 'Escalas & Cultos', icon: <ClipboardList className="w-4 h-4" /> },
          ...(!isConsulta ? [{ id: 'analises', label: 'Análises & Métricas', icon: <TrendingUp className="w-4 h-4" /> }] : []),
        ]
      },
      ...(user.role === 'ADMIN' ? [{
        title: 'Configurações',
        items: [
          { id: 'config', label: 'Preferências', icon: <Settings className="w-4 h-4" /> },
        ]
      }] : [])
    ];
  }, [user]);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Painel Geral de Controle';
      case 'pessoas': return 'Gestão de Alunos, Músicos e Professores';
      case 'turmas': return 'Turmas, Fases e Níveis Acadêmicos';
      case 'aulas': return 'Registro de Aulas e Frequência';
      case 'catalogo': return 'Acervo de Materiais Didáticos';
      case 'metodos': return 'Métodos & Módulos Interativos de Estudo';
      case 'orquestra': return 'Raio-X e Naipes da Orquestra';
      case 'escalas': return 'Escalas de Cultos e Ensaios';
      case 'boletim': return 'Boletim Pedagógico Inteligente';
      case 'etl': return 'Importador & Pipeline ETL de Planilhas Legadas (Excel)';
      case 'analises': return 'Análises e Indicadores Operacionais';
      case 'config': return 'Configurações e Banco de Dados';
      default: return 'Melodia CCB';
    }
  };

  const getShortTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'pessoas': return 'Pessoas & Alunos';
      case 'turmas': return 'Turmas & Fases';
      case 'aulas': return 'Aulas & Diário';
      case 'catalogo': return 'Catálogo Didático';
      case 'metodos': return 'Métodos';
      case 'orquestra': return 'Orquestra';
      case 'escalas': return 'Escalas';
      case 'boletim': return 'Boletim';
      case 'etl': return 'Importador Excel';
      case 'analises': return 'Análises';
      case 'config': return 'Preferências';
      default: return 'Melodia CCB';
    }
  };

  // Se o usuário ainda não realizou login, exibe obrigatoriamente a Tela Inicial de Login!
  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 overflow-hidden select-none print:bg-white print:text-black">
      
      {/* MOBILE SIDEBAR DRAWER OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden print:hidden" id="mobile-sidebar-container">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
          />
          
          {/* Sidebar content */}
          <aside className="relative w-72 max-w-xs bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 p-5 flex flex-col justify-between h-full shadow-2xl animate-in slide-in-from-left duration-200 overflow-y-auto">
            <div className="space-y-6">
              {/* Header with Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img 
                    src={logoImg} 
                    alt="Melodia CCB Logo" 
                    className="w-10 h-10 rounded-xl object-cover border border-blue-500/30 shadow-xs shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h1 className="font-black text-slate-900 dark:text-white leading-tight text-base tracking-tight">Melodia CCB</h1>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400 block">Jd. Maria Rosa • Taboão da Serra</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  aria-label="Fechar menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links Grouped */}
              <nav className="space-y-5" id="mobile-sidebar-navigation">
                {navGroups.map(group => (
                  <div key={group.title} className="space-y-1.5">
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-wider px-2 block">
                      {group.title}
                    </span>
                    {group.items.map(item => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          data-tab-id={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isActive 
                              ? 'bg-blue-600 text-white font-bold shadow-xs' 
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>

            {/* Sidebar Footer Controls */}
            <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
              {/* Privacy Mode Toggle on mobile */}
              <div className="flex justify-center">
                <PrivacyToggle />
              </div>

              {/* User profile switch on mobile */}
              <div>
                <UserBadge />
              </div>

              <button 
                onClick={() => {
                  handleToggleTheme();
                  setIsSidebarOpen(false);
                }}
                className="w-full py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-4 h-4 text-indigo-500" />
                    <span>Modo Escuro</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Modo Claro</span>
                  </>
                )}
              </button>

              <ProtectedContent permission="VIEW_AUDIT_LOGS">
                <button 
                  onClick={() => {
                    setIsAuditLogsOpen(true);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all mb-1.5"
                >
                  <History className="w-4 h-4 text-indigo-500" />
                  <span>Trilha de Auditoria</span>
                </button>
              </ProtectedContent>

              <ProtectedContent permission="EXPORT_BACKUP">
                <button 
                  onClick={() => {
                    setIsEncryptedBackupOpen(true);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full py-2 px-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs mb-1.5"
                >
                  <Lock className="w-4 h-4 text-blue-200" />
                  <span>Backup Criptografado (AES-256)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      handleDownloadBackup();
                      setIsSidebarOpen(false);
                    }}
                    className="py-2 px-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4 text-blue-500" />
                    <span>JSON</span>
                  </button>

                  <button 
                    onClick={() => {
                      handleRestoreClick();
                      setIsSidebarOpen(false);
                    }}
                    className="py-2 px-2 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Upload className="w-4 h-4 text-emerald-500" />
                    <span>Restaurar</span>
                  </button>
                </div>
              </ProtectedContent>
            </div>
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 p-4.5 flex flex-col justify-between shrink-0 overflow-y-auto print:hidden" id="main-sidebar">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 py-1">
            <img 
              src={logoImg} 
              alt="Melodia CCB Logo" 
              className="w-10 h-10 rounded-xl object-cover border border-blue-500/30 shadow-xs shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="font-black text-slate-900 dark:text-white leading-tight text-base tracking-tight">Melodia CCB</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">Jd. Maria Rosa • Taboão da Serra</span>
            </div>
          </div>

          {/* Navigation Links Grouped */}
          <nav className="space-y-5" id="sidebar-navigation">
            {navGroups.map(group => (
              <div key={group.title} className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider px-2 block mb-1">
                  {group.title}
                </span>
                {group.items.map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      data-tab-id={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-blue-600 text-white font-bold shadow-xs' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3.5 mt-4">
          <button 
            onClick={handleToggleTheme}
            className="w-full py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
                <span>Modo Escuro</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Modo Claro</span>
              </>
            )}
          </button>

          <ProtectedContent permission="VIEW_AUDIT_LOGS">
            <button 
              onClick={() => setIsAuditLogsOpen(true)}
              className="w-full py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all mb-1.5"
              title="Visualizar Trilha de Auditoria (Logs de Modificação)"
            >
              <History className="w-3.5 h-3.5 text-indigo-500" />
              <span>Trilha de Auditoria</span>
            </button>
          </ProtectedContent>

          <ProtectedContent permission="EXPORT_BACKUP">
            <button 
              onClick={() => setIsEncryptedBackupOpen(true)}
              className="w-full py-1.5 px-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs mb-1.5"
              title="Backup Criptografado com Senha Master (AES-256)"
            >
              <Lock className="w-3.5 h-3.5 text-blue-200" />
              <span>Backup AES-256 (.melodia)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handleDownloadBackup}
                className="py-1.5 px-2 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                title="Baixar Backup da Base em JSON"
              >
                <Download className="w-3.5 h-3.5 text-blue-500" />
                <span>JSON</span>
              </button>

              <button 
                onClick={handleRestoreClick}
                className="py-1.5 px-2 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                title="Restaurar Banco via Arquivo .melodia ou JSON"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-500" />
                <span>Restaurar</span>
              </button>
            </div>
          </ProtectedContent>

          <input 
            type="file" 
            ref={hiddenFileInputRef}
            onChange={handleSidebarFileChange}
            accept=".melodia,.json"
            className="hidden"
          />
        </div>
      </aside>

      {/* MAIN CONTENT FIELD */}
      <div className="flex-1 flex flex-col overflow-hidden print:overflow-visible bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        
        {/* Header toolbar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 backdrop-blur-md px-3 sm:px-5 md:px-6 flex items-center justify-between shrink-0 print:hidden z-10 gap-2" id="app-header-toolbar">
          {/* Left Title / Breadcrumb Area */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="h-9 w-9 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 md:hidden rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer shrink-0 transition-colors"
              aria-label="Abrir menu de navegação"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="min-w-0">
              {/* Desktop Breadcrumbs */}
              <div className="hidden md:flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-0.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
                  <img src={logoImg} alt="" className="w-3.5 h-3.5 rounded-sm object-cover" referrerPolicy="no-referrer" />
                  <span>Melodia CCB</span>
                </div>
                <span>/</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold capitalize">{activeTab}</span>
              </div>

              {/* Desktop Full Title */}
              <h2 className="hidden md:block text-base font-extrabold text-slate-800 dark:text-white leading-tight truncate" id="page-title-label">
                {getPageTitle()}
              </h2>

              {/* Mobile Short Title */}
              <h2 className="md:hidden text-sm font-black text-slate-800 dark:text-white leading-tight truncate max-w-[140px] xs:max-w-[200px]" id="page-title-mobile">
                {getShortTitle()}
              </h2>
            </div>
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Congregation Location Badge (Large screens only) */}
            <div className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-300 shadow-2xs whitespace-nowrap" title="Comum Congregação">
              <span className="text-xs">📍</span>
              <span>Jd. Maria Rosa, Taboão</span>
            </div>

            {/* Quick Count Badge (Large screens only) */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{pessoas.length} Integrantes</span>
            </div>

            {/* Privacy Projection Mode Toggle */}
            <PrivacyToggle />

            {/* Profile / RBAC User Badge */}
            <UserBadge />

            {/* Quick Theme Switch */}
            <button 
              onClick={handleToggleTheme}
              className="h-9 px-2.5 sm:px-3 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs shrink-0 whitespace-nowrap"
              title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
              aria-label="Alternar tema claro/escuro"
              type="button"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="hidden lg:inline">Escuro</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                  <span className="hidden lg:inline">Claro</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Dynamic Display Area */}
        <main className="flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-6 print:overflow-visible print:p-0" id="main-content-scroller">
          {renderContent()}
        </main>
      </div>

      {/* Encrypted Backup Modal (AES-256) */}
      <EncryptedBackupModal
        isOpen={isEncryptedBackupOpen}
        onClose={() => setIsEncryptedBackupOpen(false)}
        getAppData={() => db.getBackupData()}
        onRestoreData={handleRestoreDecryptedData}
      />

      {/* Audit Log Viewer Modal */}
      <AuditLogViewerModal
        isOpen={isAuditLogsOpen}
        onClose={() => setIsAuditLogsOpen(false)}
      />

      {/* TOAST SYSTEM CONTAINER */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2.5 z-100 max-w-sm print:hidden" id="toast-wrapper-panel">
        {toasts.map(toast => {
          let typeColor = 'border-blue-500 bg-white dark:bg-slate-900';
          if (toast.type === 'success') {
            typeColor = 'border-emerald-500 bg-white dark:bg-slate-900';
          } else if (toast.type === 'error') {
            typeColor = 'border-rose-500 bg-white dark:bg-slate-900';
          }

          return (
            <div 
              key={toast.id}
              className={`p-4 rounded-xl border-l-4 shadow-md flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300 animate-in slide-in-from-bottom-5 duration-300 ${typeColor}`}
            >
              <div className="flex-1">{toast.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PrivacyProvider>
        <MelodiaApp />
      </PrivacyProvider>
    </AuthProvider>
  );
}
