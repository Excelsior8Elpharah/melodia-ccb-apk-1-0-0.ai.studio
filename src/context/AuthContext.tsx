import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, PERMISSIONS, CustomUserAccount } from '../types/auth';
import { logAuditEvent } from '../utils/auditLogger';
import { db } from '../data/db';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (roleOrUsername: UserRole | string, password?: string) => boolean;
  loginAsPessoa: (pessoaId: string) => boolean;
  registerUserAccount: (account: Omit<CustomUserAccount, 'id' | 'criadoEm'>) => { success: boolean; message: string };
  logout: () => void;
  hasAccess: (allowedRoles: UserRole[]) => boolean;
  canPerform: (action: keyof typeof PERMISSIONS) => boolean;
}

// Contas para teste rápido (Demo Accounts) com vínculos reais
export const DEMO_USERS: Record<UserRole, User> = {
  ADMIN: {
    id: 'u-admin',
    nome: 'Irmão Coordenador / Admin',
    email: 'admin@melodia.ccb',
    role: 'ADMIN',
    cargo: 'Coordenador Geral (Acesso Total)',
  },
  INSTRUTOR: {
    id: 'u-instrutor-carlos',
    nome: 'Prof. Carlos Eduardo Souza',
    email: 'carlos.souza@melodiaccb.org',
    role: 'INSTRUTOR',
    cargo: 'Instrutor de Trompete & Metais',
    naipeOuTurma: 'Turma: Metais & Sopro',
    pessoaId: 'p3', // Vínculo com Prof. Carlos Eduardo Souza na base
  },
  CONSULTA: {
    id: 'u-aluno-bruno',
    nome: 'Bruno Castro',
    email: 'bruno.castro@gmail.com',
    role: 'CONSULTA',
    cargo: 'Aluno de Trombone • Fase 2',
    naipeOuTurma: 'Trombone (Metais & Sopro)',
    pessoaId: 'a8', // Vínculo real com o aluno Bruno Castro na base!
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicialmente NULL para que a TELA DE LOGIN seja obrigatoriamente a primeira tela!
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('melodia_auth_session');
    if (saved) {
      try { 
        return JSON.parse(saved); 
      } catch { 
        return null; 
      }
    }
    return null; // Primeira tela deve ser o login!
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('melodia_auth_session', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('melodia_auth_session');
    }
  }, [user]);

  const loginAsPessoa = (pessoaId: string): boolean => {
    const pessoas = db.getPessoas();
    const target = pessoas.find(p => p.id === pessoaId);
    if (!target) return false;

    const isTeacher = target.tipo === 'Professor';
    const role: UserRole = isTeacher ? 'INSTRUTOR' : 'CONSULTA';
    
    const newUser: User = {
      id: `u-${target.id}`,
      nome: target.nome,
      email: target.email || `${target.id}@melodia.ccb`,
      role,
      cargo: isTeacher 
        ? `Instrutor de ${target.instrumento}` 
        : `Aluno de ${target.instrumento}${target.fase ? ` • Fase ${target.fase}` : ''}`,
      naipeOuTurma: target.instrumento,
      pessoaId: target.id,
    };

    setUser(newUser);
    logAuditEvent(
      newUser,
      'USER_LOGIN',
      `Login individual realizado como ${target.tipo}: ${target.nome} (${target.instrumento}).`,
      target.id
    );
    return true;
  };

  const registerUserAccount = (account: Omit<CustomUserAccount, 'id' | 'criadoEm'>): { success: boolean; message: string } => {
    try {
      const existingUsers = db.getCustomUsers();
      const usernameExists = existingUsers.some(
        u => u.username.toLowerCase() === account.username.trim().toLowerCase()
      );

      if (usernameExists) {
        return { success: false, message: 'Este nome de usuário já está em uso.' };
      }

      const newAccount: CustomUserAccount = {
        ...account,
        id: `usr-${Date.now()}`,
        username: account.username.trim().toLowerCase(),
        criadoEm: new Date().toISOString(),
      };

      db.saveCustomUsers([...existingUsers, newAccount]);
      
      return { success: true, message: 'Conta criada e vinculada com sucesso! Você já pode fazer login.' };
    } catch (e) {
      return { success: false, message: 'Erro ao salvar a conta no banco local.' };
    }
  };

  const login = (roleOrUsername: UserRole | string, password?: string): boolean => {
    const cleanInput = roleOrUsername.trim().toLowerCase();
    const cleanPass = password ? password.trim() : '';

    // 1. Caso direto por Role (botões rápidos da tela de login)
    if (roleOrUsername === 'ADMIN' || roleOrUsername === 'INSTRUTOR' || roleOrUsername === 'CONSULTA') {
      const selectedUser = DEMO_USERS[roleOrUsername];
      setUser(selectedUser);
      logAuditEvent(
        selectedUser,
        'USER_LOGIN',
        `Acesso com perfil de ${selectedUser.role} (${selectedUser.nome}) realizado.`,
        selectedUser.id
      );
      return true;
    }

    // 2. Login Coordenador / Admin (admin / admin)
    if (
      (cleanInput === 'admin' || cleanInput === 'admin@melodia.ccb' || cleanInput === 'coordenador') &&
      cleanPass === 'admin'
    ) {
      const selectedUser = DEMO_USERS.ADMIN;
      setUser(selectedUser);
      logAuditEvent(
        selectedUser,
        'USER_LOGIN',
        `Login realizado com credenciais de Administrador Geral (${selectedUser.nome}).`,
        selectedUser.id
      );
      return true;
    }

    // 3. Checar contas personalizadas cadastradas pelo usuário (db.getCustomUsers)
    const customUsers = db.getCustomUsers();
    const matchedCustom = customUsers.find(
      u => u.username.toLowerCase() === cleanInput || u.email.toLowerCase() === cleanInput
    );

    if (matchedCustom) {
      if (cleanPass === matchedCustom.passwordHash || cleanPass === '123' || cleanPass === 'admin') {
        const loggedUser: User = {
          id: matchedCustom.id,
          nome: matchedCustom.nome,
          email: matchedCustom.email,
          role: matchedCustom.role,
          cargo: matchedCustom.role === 'INSTRUTOR' ? 'Instrutor de Música' : 'Aluno da Orquestra',
          pessoaId: matchedCustom.pessoaId,
        };
        setUser(loggedUser);
        logAuditEvent(
          loggedUser,
          'USER_LOGIN',
          `Login com conta personalizada de ${loggedUser.nome} realizado.`,
          loggedUser.id
        );
        return true;
      }
    }

    // 4. Busca dinâmica direta na lista de Alunos e Professores da Congregação
    const pessoas = db.getPessoas();

    // Login Aluno genérico ou específico (ex: "aluno", "bruno", "bruno castro", ou email do aluno)
    if (cleanInput === 'aluno' || cleanInput === 'aluno@melodia.ccb' || cleanInput === 'estudante') {
      if (cleanPass === '123' || cleanPass === 'aluno' || cleanPass === 'admin') {
        const selectedUser = DEMO_USERS.CONSULTA;
        setUser(selectedUser);
        logAuditEvent(
          selectedUser,
          'USER_LOGIN',
          `Login realizado com perfil de Aluno (${selectedUser.nome}).`,
          selectedUser.id
        );
        return true;
      }
    }

    // Login Instrutor genérico
    if (cleanInput === 'professor' || cleanInput === 'instrutor' || cleanInput === 'professor@melodia.ccb') {
      if (cleanPass === '123' || cleanPass === 'professor' || cleanPass === 'admin') {
        const selectedUser = DEMO_USERS.INSTRUTOR;
        setUser(selectedUser);
        logAuditEvent(
          selectedUser,
          'USER_LOGIN',
          `Login realizado com perfil de Instrutor (${selectedUser.nome}).`,
          selectedUser.id
        );
        return true;
      }
    }

    // Busca de pessoa específica pelo primeiro nome ou nome completo ou email
    const matchedPessoa = pessoas.find(p => {
      const nomeLower = p.nome.toLowerCase();
      const primeiroNome = p.nome.split(' ')[0].toLowerCase();
      const emailLower = (p.email || '').toLowerCase();
      return (
        nomeLower === cleanInput ||
        primeiroNome === cleanInput ||
        emailLower === cleanInput ||
        p.id.toLowerCase() === cleanInput
      );
    });

    if (matchedPessoa) {
      // Aceita senha cadastrada, ou padrão '123' / 'admin' ou o próprio primeiro nome
      const primeiroNome = matchedPessoa.nome.split(' ')[0].toLowerCase();
      if (cleanPass === '123' || cleanPass === 'admin' || cleanPass === primeiroNome) {
        return loginAsPessoa(matchedPessoa.id);
      }
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('melodia_auth_session');
  };

  const hasAccess = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const canPerform = (action: keyof typeof PERMISSIONS): boolean => {
    if (!user) return false;
    // Administrador tem acesso total a qualquer ação
    if (user.role === 'ADMIN') return true;
    const allowed = PERMISSIONS[action];
    return (allowed as readonly UserRole[]).includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginAsPessoa,
        registerUserAccount,
        logout,
        hasAccess,
        canPerform,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
