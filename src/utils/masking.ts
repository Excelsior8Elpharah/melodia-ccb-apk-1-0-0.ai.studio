/**
 * Utilitários para mascaramento de dados pessoais (PII)
 */

// Mascara o sobrenome: "Juliana Silva Santos" -> "Juliana S. S."
export const maskName = (name: string, isPrivacyActive: boolean): string => {
  if (!isPrivacyActive || !name) return name;
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return name;
  
  const firstName = parts[0];
  const maskedRest = parts
    .slice(1)
    .map(p => (p.length > 2 ? `${p[0]}.` : p))
    .join(' ');

  return `${firstName} ${maskedRest}`;
};

// Mascara o telefone: "(11) 98765-4321" -> "(11) 987••-••21"
export const maskPhone = (phone: string, isPrivacyActive: boolean): string => {
  if (!isPrivacyActive || !phone) return phone;
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 8) return '••••-••••';

  const ddd = digitsOnly.length >= 10 ? `(${digitsOnly.slice(0, 2)}) ` : '';
  const body = digitsOnly.slice(ddd ? 2 : 0);
  const start = body.slice(0, 3);
  const end = body.slice(-2);

  return `${ddd}${start}••-••${end}`;
};

// Mascara o e-mail: "gabriel.silva@gmail.com" -> "g••••••@gmail.com"
export const maskEmail = (email: string, isPrivacyActive: boolean): string => {
  if (!isPrivacyActive || !email) return email;
  const [user, domain] = email.split('@');
  if (!domain) return '••••@••••.com';

  const initial = user[0] || 'u';
  return `${initial}••••••@${domain}`;
};

// Mascara texto livre/observações pedagógicas confidenciais
export const maskText = (text: string, isPrivacyActive: boolean): string => {
  if (!isPrivacyActive || !text) return text;
  return '🔒 [Conteúdo ocultado no Modo Apresentação/Projeção]';
};
