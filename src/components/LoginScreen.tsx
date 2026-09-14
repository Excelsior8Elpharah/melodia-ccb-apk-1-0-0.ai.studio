import React, { useState, useMemo } from 'react';
import { 
  Lock, 
  User as UserIcon, 
  KeyRound, 
  ShieldCheck, 
  Music, 
  CheckCircle2, 
  AlertCircle,
  Eye, 
  EyeOff,
  Sparkles,
  BookOpen,
  GraduationCap,
  HelpCircle,
  X,
  UserPlus,
  LogIn,
  Check,
  ChevronRight,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../data/db';
import { Pessoa } from '../types';
import { INSTRUMENTOS_PREDEFINIDOS } from '../data/mockData';
import logoImg from '../assets/images/melodia_ccb_logo_1785206131652.jpg';

export const LoginScreen: React.FC = () => {
  const { login, loginAsPessoa, registerUserAccount } = useAuth();

  // Active view: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('admin');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Role simulator state: 'coordenador' | 'professor' | 'aluno'
  const [selectedRolePreset, setSelectedRolePreset] = useState<'coordenador' | 'professor' | 'aluno'>('coordenador');
  const [selectedProfessorId, setSelectedProfessorId] = useState<string>('p1');
  const [selectedAlunoId, setSelectedAlunoId] = useState<string>('a8');

  // Info modal state
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // Registration form state
  const [regRole, setRegRole] = useState<'CONSULTA' | 'INSTRUTOR'>('CONSULTA');
  const [regMode, setRegMode] = useState<'existing' | 'new'>('existing');
  const [regExistingPessoaId, setRegExistingPessoaId] = useState<string>('a8');
  const [regNome, setRegNome] = useState<string>('');
  const [regInstrumento, setRegInstrumento] = useState<string>('Violino');
  const [regUsername, setRegUsername] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');

  // Load pessoas and turmas from db
  const pessoas = useMemo(() => db.getPessoas(), []);
  const turmas = useMemo(() => db.getTurmas(), []);
  const alunosList = useMemo(() => pessoas.filter(p => p.tipo === 'Aluno'), [pessoas]);
  const professoresList = useMemo(() => pessoas.filter(p => p.tipo === 'Professor'), [pessoas]);

  // Active simulated professor & aluno
  const activeProfessor = useMemo(() => {
    return professoresList.find(p => p.id === selectedProfessorId) || professoresList[0];
  }, [professoresList, selectedProfessorId]);

  const activeAluno = useMemo(() => {
    return alunosList.find(a => a.id === selectedAlunoId) || alunosList[0];
  }, [alunosList, selectedAlunoId]);

  // Helper to change role preset
  const handleSelectRolePreset = (preset: 'coordenador' | 'professor' | 'aluno') => {
    setSelectedRolePreset(preset);
    setError(null);
    if (preset === 'coordenador') {
      setUsername('admin');
      setPassword('admin');
    } else if (preset === 'professor') {
      const p = activeProfessor || professoresList[0];
      if (p) {
        setSelectedProfessorId(p.id);
        const userClean = p.nome.toLowerCase().replace(/\s+/g, '.').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        setUsername(userClean);
        setPassword('123');
      }
    } else if (preset === 'aluno') {
      const a = activeAluno || alunosList[0];
      if (a) {
        setSelectedAlunoId(a.id);
        const userClean = a.nome.toLowerCase().replace(/\s+/g, '.').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        setUsername(userClean);
        setPassword('123');
      }
    }
  };

  const handleSelectProfessor = (profId: string) => {
    setSelectedProfessorId(profId);
    setSelectedRolePreset('professor');
    const p = professoresList.find(prof => prof.id === profId);
    if (p) {
      const userClean = p.nome.toLowerCase().replace(/\s+/g, '.').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      setUsername(userClean);
      setPassword('123');
    }
  };

  const handleSelectAluno = (alunoId: string) => {
    setSelectedAlunoId(alunoId);
    setSelectedRolePreset('aluno');
    const a = alunosList.find(al => al.id === alunoId);
    if (a) {
      const userClean = a.nome.toLowerCase().replace(/\s+/g, '.').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      setUsername(userClean);
      setPassword('123');
    }
  };

  // Execute login (via form button or direct simulator button)
  const handleExecuteLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      if (selectedRolePreset === 'aluno' && selectedAlunoId) {
        const ok = loginAsPessoa(selectedAlunoId);
        if (!ok) {
          setError('Não foi possível autenticar como o aluno selecionado.');
          setLoading(false);
        }
        return;
      }

      if (selectedRolePreset === 'professor' && selectedProfessorId) {
        const ok = loginAsPessoa(selectedProfessorId);
        if (!ok) {
          setError('Não foi possível autenticar como o professor selecionado.');
          setLoading(false);
        }
        return;
      }

      const success = login(username, password);
      if (!success) {
        setError('Usuário ou senha inválidos. Verifique suas credenciais ou use "admin" / "admin".');
        setLoading(false);
      }
    }, 150);
  };

  // Handle registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanUsername = regUsername.trim().toLowerCase();
    const cleanPassword = regPassword.trim();

    if (!cleanUsername) {
      setError('Informe um nome de usuário.');
      return;
    }

    if (cleanPassword.length < 3) {
      setError('A senha deve ter no mínimo 3 caracteres.');
      return;
    }

    if (cleanPassword !== regConfirmPassword.trim()) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    let linkedPessoaId = '';
    let finalNome = '';
    let finalEmail = regEmail.trim();

    if (regMode === 'existing') {
      if (!regExistingPessoaId) {
        setError('Selecione a pessoa para vincular esta conta.');
        return;
      }
      const existing = pessoas.find(p => p.id === regExistingPessoaId);
      if (!existing) {
        setError('Registro da congregação não encontrado.');
        return;
      }
      linkedPessoaId = existing.id;
      finalNome = existing.nome;
      if (!finalEmail) finalEmail = existing.email || `${cleanUsername}@melodia.ccb`;
    } else {
      // Create new Pessoa in DB
      if (!regNome.trim()) {
        setError('Informe o nome completo.');
        return;
      }
      const newPessoaId = (regRole === 'CONSULTA' ? 'a_' : 'p_') + Date.now().toString();
      const newPessoa: Pessoa = {
        id: newPessoaId,
        nome: regNome.trim(),
        tipo: regRole === 'CONSULTA' ? 'Aluno' : 'Professor',
        instrumento: regInstrumento,
        status: 'Ativo',
        email: finalEmail || `${cleanUsername}@melodia.ccb`,
        telefone: '(11) 99999-0000',
        dataNascimento: '2000-01-01',
        fase: 1,
        observacoes: 'Cadastrado diretamente via tela de auto-registro do Melodia CCB.'
      };

      const currentPessoas = db.getPessoas();
      db.savePessoas([...currentPessoas, newPessoa]);
      linkedPessoaId = newPessoaId;
      finalNome = regNome.trim();
    }

    // Register user account in auth DB
    const res = registerUserAccount({
      username: cleanUsername,
      passwordHash: cleanPassword,
      nome: finalNome,
      email: finalEmail || `${cleanUsername}@melodia.ccb`,
      role: regRole,
      pessoaId: linkedPessoaId
    });

    if (!res.success) {
      setError(res.message);
      return;
    }

    setSuccessMsg('Conta criada com sucesso! Entrando no sistema...');
    setLoading(true);

    setTimeout(() => {
      login(cleanUsername, cleanPassword);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 bg-slate-950 relative overflow-hidden font-sans select-none">
      {/* Luzes de fundo ambiente */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Container Principal */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
          
          {/* Topo: Identidade Visual e Título */}
          <div className="text-center space-y-2.5">
            <div className="inline-flex relative">
              <img 
                src={logoImg} 
                alt="Melodia CCB Logo" 
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg border-2 border-amber-500/40 mx-auto"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1.5 rounded-xl shadow">
                <Music className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Melodia <span className="text-amber-400">CCB</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                CCB Jardim Maria Rosa • Taboão da Serra - SP
              </p>
              <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] font-medium text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Gestão com Isolamento de Dados por Perfil
              </div>
            </div>
          </div>

          {/* Abas Alternadoras: Entrar vs Criar Conta */}
          <div className="grid grid-cols-2 p-1 bg-slate-800/80 border border-slate-700/80 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Acessar / Login</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Novo Cadastro</span>
            </button>
          </div>

          {/* Mensagem de Sucesso */}
          {successMsg && (
            <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Mensagem de Erro */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ================= ABA 1: LOGIN PRINCIPAL ================= */}
          {activeTab === 'login' && (
            <>
              <form onSubmit={handleExecuteLogin} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Usuário de Acesso</span>
                    <span className="text-[10px] text-amber-400/80 font-normal">Padrão Coordenador: admin</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ex: admin, professor ou bruno"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Senha</span>
                    <span className="text-[10px] text-amber-400/80 font-normal">Padrão: admin ou 123</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  {loading ? 'Validando Acesso...' : (
                    selectedRolePreset === 'aluno'
                      ? `Acessar como Aluno: ${activeAluno ? activeAluno.nome.split(' ')[0] : 'Selecionado'}`
                      : selectedRolePreset === 'professor'
                      ? `Acessar como Professor: ${activeProfessor ? activeProfessor.nome.split(' ')[0] : 'Selecionado'}`
                      : 'Acessar o Sistema'
                  )}
                </button>
              </form>

              {/* Perfis de Demonstração Rápida */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    1. Escolha o perfil para simular o acesso:
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Coordenador / Admin */}
                  <button
                    type="button"
                    onClick={() => handleSelectRolePreset('coordenador')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedRolePreset === 'coordenador' 
                        ? 'bg-amber-500/20 border-amber-500/80 text-white shadow-md shadow-amber-500/10 ring-1 ring-amber-400/40' 
                        : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      {selectedRolePreset === 'coordenador' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <div className="text-[11px] font-bold text-amber-400 mt-1.5">Coordenador</div>
                    <div className="text-[9px] text-slate-400">Total</div>
                  </button>

                  {/* Professor / Instrutor */}
                  <button
                    type="button"
                    onClick={() => handleSelectRolePreset('professor')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedRolePreset === 'professor' 
                        ? 'bg-blue-500/20 border-blue-500/80 text-white shadow-md shadow-blue-500/10 ring-1 ring-blue-400/40' 
                        : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <GraduationCap className="w-4 h-4 text-blue-400" />
                      {selectedRolePreset === 'professor' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <div className="text-[11px] font-bold text-blue-400 mt-1.5">Professor</div>
                    <div className="text-[9px] text-slate-400">Suas Turmas</div>
                  </button>

                  {/* Aluno (Sem nome Bruno, puramente Aluno) */}
                  <button
                    type="button"
                    onClick={() => handleSelectRolePreset('aluno')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedRolePreset === 'aluno' 
                        ? 'bg-emerald-500/20 border-emerald-500/80 text-white shadow-md shadow-emerald-500/10 ring-1 ring-emerald-400/40' 
                        : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      {selectedRolePreset === 'aluno' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="text-[11px] font-bold text-emerald-400 mt-1.5">Aluno</div>
                    <div className="text-[9px] text-slate-400">Ficha Individual</div>
                  </button>
                </div>

                {/* 2. Painel Contextual de Seleção da Pessoa a Simular */}
                {selectedRolePreset === 'professor' && (
                  <div className="p-3 bg-blue-950/40 border border-blue-500/40 rounded-xl space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <label htmlFor="select-sim-professor" className="text-[11px] font-bold text-blue-300 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-blue-400" />
                        2. Selecione qual Professor deseja verificar:
                      </label>
                      <span className="text-[9px] text-blue-400/80 bg-blue-900/40 px-2 py-0.5 rounded-md font-medium border border-blue-700/50">
                        Docente & Turmas
                      </span>
                    </div>
                    <select
                      id="select-sim-professor"
                      value={selectedProfessorId}
                      onChange={(e) => handleSelectProfessor(e.target.value)}
                      className="w-full py-2.5 px-3 bg-slate-900/90 hover:bg-slate-900 border border-blue-500/50 rounded-xl text-xs text-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
                    >
                      {professoresList.map(p => {
                        const profTurmas = turmas.filter(t => t.professorId === p.id);
                        const turmasDesc = profTurmas.length > 0 
                          ? `${profTurmas.length} ${profTurmas.length === 1 ? 'turma' : 'turmas'}`
                          : 'Sem turmas cadastradas';
                        return (
                          <option key={p.id} value={p.id}>
                            👨‍🏫 {p.nome} • {p.instrumento} ({turmasDesc})
                          </option>
                        );
                      })}
                    </select>
                    
                    {activeProfessor && (
                      <div className="text-[11px] text-slate-300 bg-blue-900/20 p-2 rounded-lg border border-blue-500/20 flex flex-col gap-1">
                        <span className="text-blue-200">
                          Simulação de <strong>{activeProfessor.nome}</strong> ({activeProfessor.instrumento}).
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Você terá acesso exclusivo às turmas sob a responsabilidade deste professor e às chamadas de seus alunos.
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleExecuteLogin()}
                      disabled={loading}
                      className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {loading ? 'Acessando...' : `Acessar o Aplicativo como ${activeProfessor?.nome || 'Professor'}`}
                    </button>
                  </div>
                )}

                {selectedRolePreset === 'aluno' && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <label htmlFor="select-sim-aluno" className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        2. Selecione qual Aluno deseja verificar:
                      </label>
                      <span className="text-[9px] text-emerald-400/80 bg-emerald-900/40 px-2 py-0.5 rounded-md font-medium border border-emerald-700/50">
                        Isolamento de Dados
                      </span>
                    </div>
                    <select
                      id="select-sim-aluno"
                      value={selectedAlunoId}
                      onChange={(e) => handleSelectAluno(e.target.value)}
                      className="w-full py-2.5 px-3 bg-slate-900/90 hover:bg-slate-900 border border-emerald-500/50 rounded-xl text-xs text-emerald-100 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
                    >
                      {alunosList.map(a => (
                        <option key={a.id} value={a.id}>
                          🎓 {a.nome} • {a.instrumento} (Fase {a.fase || 1})
                        </option>
                      ))}
                    </select>

                    {activeAluno && (
                      <div className="text-[11px] text-slate-300 bg-emerald-900/20 p-2 rounded-lg border border-emerald-500/20 flex flex-col gap-1">
                        <span className="text-emerald-200">
                          Simulação de <strong>{activeAluno.nome}</strong> ({activeAluno.instrumento} • Fase {activeAluno.fase || 1}).
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Você terá visualização isolada das notas, presenças, hinos e projeções exclusivamente deste aluno.
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleExecuteLogin()}
                      disabled={loading}
                      className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {loading ? 'Acessando...' : `Acessar o Aplicativo como ${activeAluno?.nome || 'Aluno'}`}
                    </button>
                  </div>
                )}

                {selectedRolePreset === 'coordenador' && (
                  <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-2 text-xs text-amber-200/90 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 font-semibold text-amber-300">
                      <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Perfil Coordenador / Encarregado (Acesso Geral)</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Visão completa da orquestra: gerenciamento de todos os alunos, turmas, professores, presenças, relatórios e configurações.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleExecuteLogin()}
                      disabled={loading}
                      className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {loading ? 'Acessando...' : 'Acessar o Aplicativo como Coordenador'}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ================= ABA 2: NOVO CADASTRO ================= */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 animate-in fade-in duration-200">
              {/* Escolha do Papel: Aluno ou Professor */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  1. Qual é o seu papel na Orquestra?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('CONSULTA');
                      setRegExistingPessoaId(alunosList[0]?.id || '');
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      regRole === 'CONSULTA'
                        ? 'bg-emerald-500/20 border-emerald-500 text-white'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      {regRole === 'CONSULTA' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="text-xs font-bold text-emerald-400 mt-1">Sou Aluno</div>
                    <div className="text-[10px] text-slate-400">Ver minhas notas e turmas</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('INSTRUTOR');
                      setRegExistingPessoaId(professoresList[0]?.id || '');
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      regRole === 'INSTRUTOR'
                        ? 'bg-blue-500/20 border-blue-500 text-white'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <GraduationCap className="w-4 h-4 text-blue-400" />
                      {regRole === 'INSTRUTOR' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <div className="text-xs font-bold text-blue-400 mt-1">Sou Professor</div>
                    <div className="text-[10px] text-slate-400">Lançar notas das minhas turmas</div>
                  </button>
                </div>
              </div>

              {/* Modo: Vincular à Ficha ou Cadastrar Novo */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  2. Vínculo com a Ficha da Congregação:
                </label>
                <div className="flex items-center gap-4 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="regMode"
                      value="existing"
                      checked={regMode === 'existing'}
                      onChange={() => setRegMode('existing')}
                      className="accent-amber-500"
                    />
                    <span>Já sou cadastrado na lista</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="regMode"
                      value="new"
                      checked={regMode === 'new'}
                      onChange={() => setRegMode('new')}
                      className="accent-amber-500"
                    />
                    <span>Novo integrante</span>
                  </label>
                </div>
              </div>

              {/* Se existente: Select com Alunos ou Professores */}
              {regMode === 'existing' ? (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Selecione o seu nome na congregação:
                  </label>
                  <select
                    value={regExistingPessoaId}
                    onChange={(e) => setRegExistingPessoaId(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                  >
                    {(regRole === 'CONSULTA' ? alunosList : professoresList).map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nome} — {p.instrumento} {p.fase ? `(Fase ${p.fase})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                /* Se novo: Nome e Instrumento */
                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={regNome}
                      onChange={(e) => setRegNome(e.target.value)}
                      placeholder="Ex: João Pedro Silveira"
                      className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Instrumento
                    </label>
                    <select
                      value={regInstrumento}
                      onChange={(e) => setRegInstrumento(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                    >
                      {INSTRUMENTOS_PREDEFINIDOS.map(i => (
                        <option key={i.nome} value={i.nome}>{i.nome} ({i.familia})</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Usuário e Senha para Login */}
              <div className="space-y-2 pt-1 border-t border-slate-800/80">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Crie um Nome de Usuário (Login)
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="Ex: bruno.castro ou joao.pedro"
                    className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Senha
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Confirmar Senha
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <Database className="w-4 h-4" />
                {loading ? 'Cadastrando e Entrando...' : 'Criar Conta e Acessar Agora'}
              </button>
            </form>
          )}

          {/* Botão de Ajuda / Como funciona na prática */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={() => setIsHelpModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-amber-400/90 hover:text-amber-300 font-medium transition-colors cursor-pointer text-[11px]"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Como funciona o isolamento na prática?</span>
            </button>
            <span className="text-[10px] text-slate-500">
              Banco Persistente
            </span>
          </div>

        </div>
      </div>

      {/* MODAL EXPLICATIVO: COMO FUNCIONA NA PRÁTICA */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">
                  Isolamento de Dados & Perfis de Acesso
                </h3>
              </div>
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>1. Coordenador Geral (admin / admin)</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Possui controle e visão total: gerencia todos os integrantes, todas as turmas, lança e corrige notas de qualquer aluno, cria novas turmas e exporta relatórios e backups criptografados.
                </p>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
                <div className="flex items-center gap-2 font-bold text-blue-400">
                  <GraduationCap className="w-4 h-4" />
                  <span>2. Professor / Instrutor (Acesso Restrito às suas Turmas)</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Ao fazer login, o professor visualiza <strong>exclusivamente as turmas que leciona</strong> e os alunos matriculados nelas. Pode realizar chamada e avaliar notas apenas da sua classe.
                </p>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <BookOpen className="w-4 h-4" />
                  <span>3. Aluno (Exemplo: Bruno Castro - Trombone)</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  <strong>Isolamento Total:</strong> Ao entrar, o aluno é vinculado estritamente à sua ficha individual. No <strong>Boletim</strong>, ele vê apenas as suas próprias notas e evolução; nas <strong>Aulas</strong>, a chamada oculta outros alunos e mostra apenas a sua presença; nas <strong>Turmas</strong>, visualiza apenas o horário e o instrutor da turma onde estuda.
                </p>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
                <div className="flex items-center gap-2 font-bold text-purple-400">
                  <Database className="w-4 h-4" />
                  <span>4. Como e onde é salvo imediatamente?</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Toda conta criada e toda nota lançada é <strong>gravada instantaneamente no banco de dados local contínuo (IndexedDB e localStorage)</strong>. Mesmo se você recarregar a página ou fechar o navegador, a conta permanece salva e pronta para login.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(false)}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Entendido, Fechar Explicação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
