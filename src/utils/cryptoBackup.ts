/**
 * Utilitários para Criptografia de Backups usando Web Crypto API nativa (AES-GCM 256-bit + PBKDF2)
 */

export interface EncryptedEnvelope {
  version: string;
  timestamp: string;
  algorithm: 'AES-GCM-256';
  salt: string; // Base64
  iv: string;   // Base64
  ciphertext: string; // Base64
}

// Converte ArrayBuffer para string Base64 e vice-versa
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.byteLength; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
};

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Deriva uma chave AES-GCM a partir da senha do usuário usando PBKDF2
const deriveKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000, // Alto custo computacional contra força bruta
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

/**
 * Criptografa qualquer objeto/dados do app em um envelope com senha.
 */
export const encryptBackup = async (data: object, password: string): Promise<EncryptedEnvelope> => {
  const enc = new TextEncoder();
  const jsonString = JSON.stringify(data);
  const dataBuffer = enc.encode(jsonString);

  // Gera Salt de 16 bytes e IV de 12 bytes aleatórios e seguros
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(password, salt);

  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataBuffer
  );

  return {
    version: '1.0-AES256',
    timestamp: new Date().toISOString(),
    algorithm: 'AES-GCM-256',
    salt: arrayBufferToBase64(salt.buffer),
    iv: arrayBufferToBase64(iv.buffer),
    ciphertext: arrayBufferToBase64(ciphertextBuffer),
  };
};

/**
 * Descriptografa o arquivo de backup solicitando a mesma senha definida na exportação.
 */
export const decryptBackup = async (envelope: EncryptedEnvelope, password: string): Promise<any> => {
  try {
    const salt = new Uint8Array(base64ToArrayBuffer(envelope.salt));
    const iv = new Uint8Array(base64ToArrayBuffer(envelope.iv));
    const ciphertext = base64ToArrayBuffer(envelope.ciphertext);

    const key = await deriveKey(password, salt);

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    const jsonString = dec.decode(decryptedBuffer);
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error('Senha incorreta ou arquivo de backup corrompido.');
  }
};
