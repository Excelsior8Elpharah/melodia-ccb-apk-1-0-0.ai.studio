export type UserRole = 'ADMIN' | 'INSTRUTOR' | 'CONSULTA';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  cargo: string;
  avatarUrl?: string;
  naipeOuTurma?: string;
  pessoaId?: string; // Vínculo com a Pessoa (Aluno ou Professor cadastrado na CCB)
}

export interface CustomUserAccount {
  id: string;
  username: string; // Ex: 'bruno', 'bruno.castro@gmail.com', ou CPF
  passwordHash: string;
  pessoaId: string; // Vínculo obrigatório com Pessoa.id
  role: UserRole;
  nome: string;
  email: string;
  criadoEm: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Mapeamento de permissões granulares por funcionalidade
export const PERMISSIONS = {
  MANAGE_USERS: ['ADMIN'],
  VIEW_AUDIT_LOGS: ['ADMIN'],
  EDIT_STUDENT_DATA: ['ADMIN', 'INSTRUTOR'],
  GRADE_STUDENTS: ['ADMIN', 'INSTRUTOR'],
  EXPORT_BACKUP: ['ADMIN'],
  VIEW_FULL_GANTT: ['ADMIN', 'INSTRUTOR'],
  VIEW_PERSONAL_BULLETIN: ['ADMIN', 'INSTRUTOR', 'CONSULTA'],
  VIEW_SENSITIVE_CONTACTS: ['ADMIN', 'INSTRUTOR'],
} as const;
