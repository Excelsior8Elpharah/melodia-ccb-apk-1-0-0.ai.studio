import { AuditLogEntry, AuditActionType } from '../types/audit';
import { User } from '../types/auth';

const AUDIT_STORAGE_KEY = 'melodia_audit_logs_v1';
const MAX_LOG_ENTRIES = 500; // Limite de retenção local

export const getAuditLogs = (): AuditLogEntry[] => {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const logAuditEvent = (
  currentUser: User | null,
  action: AuditActionType,
  detalhes: string,
  targetId?: string,
  mudancas?: AuditLogEntry['mudancas']
): void => {
  if (!currentUser) return;

  const newEntry: AuditLogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    userId: currentUser.id,
    userName: currentUser.nome,
    userRole: currentUser.role,
    action,
    detalhes,
    targetId,
    mudancas,
  };

  const logs = getAuditLogs();
  const updatedLogs = [newEntry, ...logs].slice(0, MAX_LOG_ENTRIES);

  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs));
  } catch (err) {
    console.error('Erro ao gravar log de auditoria:', err);
  }
};

export const clearAuditLogs = (): void => {
  localStorage.removeItem(AUDIT_STORAGE_KEY);
};
