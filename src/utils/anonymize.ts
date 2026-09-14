import { LGPDStudentExtension } from '../types/lgpd';

export interface StudentData extends LGPDStudentExtension {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  dataNascimento: string;
  observacoes?: string;
  instrumento: string;
  // Outros campos pedagógicos são mantidos intactos...
  [key: string]: any;
}

/**
 * Anonimiza os dados de um aluno (Art. 18 LGPD) preservando o histórico de frequências para estatísticas.
 */
export const anonymizeStudentData = <T extends StudentData>(student: T): T => {
  const hashId = student.id ? student.id.slice(-4).toUpperCase() : '0000';
  
  return {
    ...student,
    nome: `Aluno Anonimizado #${hashId}`,
    telefone: '(00) 00000-0000',
    email: `anonimizado_${hashId.toLowerCase()}@lgpd.local`,
    dataNascimento: '1900-01-01',
    observacoes: '[DADOS DELETADOS CONFORME SOLICITAÇÃO LGPD]',
    isAnonimizado: true,
    dataAnonimizacao: new Date().toISOString(),
    lgpdConsent: student.lgpdConsent ? {
      ...student.lgpdConsent,
      consentimentoConcedido: false,
      autorizacaoUsoImagemEAudio: false,
      nomeResponsavelLegal: undefined,
      cpfResponsavel: undefined,
    } : {
      consentimentoConcedido: false,
      dataConsentimento: new Date().toISOString(),
      autorizacaoUsoImagemEAudio: false,
      versaoTermoAceito: '1.0-2026',
    },
  };
};
