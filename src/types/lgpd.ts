export interface ConsentRecord {
  consentimentoConcedido: boolean;
  dataConsentimento: string; // ISO String (ex: 2026-09-03T10:00:00Z)
  nomeResponsavelLegal?: string;
  parentescoResponsavel?: 'PAI' | 'MAE' | 'RESPONSAVEL_LEGAL' | 'PROPRIO_ALUNO_MAIOR';
  cpfResponsavel?: string;
  autorizacaoUsoImagemEAudio: boolean;
  versaoTermoAceito: string; // ex: "1.0-2026"
}

export interface LGPDStudentExtension {
  lgpdConsent?: ConsentRecord;
  isAnonimizado?: boolean;
  dataAnonimizacao?: string;
}
