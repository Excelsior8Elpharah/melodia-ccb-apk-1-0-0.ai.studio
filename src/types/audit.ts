export type AuditActionType =
  | 'STUDENT_CREATED'
  | 'STUDENT_UPDATED'
  | 'STUDENT_DELETED'
  | 'STUDENT_ANONYMIZED'
  | 'ATTENDANCE_LOGGED'
  | 'GRADE_UPDATED'
  | 'LGPD_CONSENT_REGISTERED'
  | 'BACKUP_EXPORTED'
  | 'BACKUP_RESTORED'
  | 'USER_LOGIN';

export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO String
  userId: string;
  userName: string;
  userRole: string;
  action: AuditActionType;
  detalhes: string;
  targetId?: string; // ID do aluno ou entidade afetada
  mudancas?: {
    campo: string;
    valorAntigo: any;
    valorNovo: any;
  }[];
}
