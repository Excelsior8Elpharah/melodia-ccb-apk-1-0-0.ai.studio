/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Pessoa, Turma, Aula, Escala, DiarioRegistro, MaterialCatalogo, CustomUserAccount } from '../types';
import { MOCK_PESSOAS, MOCK_TURMAS, MOCK_AULAS, MOCK_ESCALAS, MOCK_DIARIO, MOCK_CATALOGO } from './mockData';

const KEYS = {
  PESSOAS: 'om_pessoas',
  TURMAS: 'om_turmas',
  AULAS: 'om_aulas',
  ESCALAS: 'om_escalas',
  THEME: 'om_theme',
  DIARIO: 'om_diario',
  CATALOGO: 'om_catalogo',
  CUSTOM_USERS: 'om_custom_users',
};

// IndexedDB Config
const IDB_NAME = 'OrquestraManagerIDB';
const IDB_VERSION = 1;

let idbPromise: Promise<IDBDatabase> | null = null;

function getIDB(): Promise<IDBDatabase> {
  if (idbPromise) return idbPromise;
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject('IndexedDB not supported');
  }

  idbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_NAME, IDB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains('pessoas')) {
        const store = db.createObjectStore('pessoas', { keyPath: 'id' });
        store.createIndex('by_tipo', 'tipo', { unique: false });
        store.createIndex('by_status', 'status', { unique: false });
        store.createIndex('by_instrumento', 'instrumento', { unique: false });
      }

      if (!db.objectStoreNames.contains('turmas')) {
        db.createObjectStore('turmas', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('aulas')) {
        const store = db.createObjectStore('aulas', { keyPath: 'id' });
        store.createIndex('by_turmaId', 'turmaId', { unique: false });
        store.createIndex('by_data', 'data', { unique: false });
      }

      if (!db.objectStoreNames.contains('escalas')) {
        db.createObjectStore('escalas', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('diarios')) {
        const store = db.createObjectStore('diarios', { keyPath: 'id' });
        store.createIndex('by_pessoaId', 'pessoaId', { unique: false });
      }

      if (!db.objectStoreNames.contains('catalogo')) {
        db.createObjectStore('catalogo', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return idbPromise;
}

// Sync to IndexedDB in background
async function syncStoreToIDB(storeName: string, items: any[]) {
  try {
    const idb = await getIDB();
    const tx = idb.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.clear();
    items.forEach(item => store.put(item));
  } catch (e) {
    // Fallback gracefully
  }
}

// In-memory fallback dictionary if localStorage or IndexedDB is restricted
const memoryStore: Record<string, string> = {};

// General fallback safe getter
function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key) || memoryStore[key];
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.warn('Error reading localStorage key, falling back to memoryStore:', key, e);
    const data = memoryStore[key];
    return data ? JSON.parse(data) : defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    const jsonStr = JSON.stringify(value);
    memoryStore[key] = jsonStr;
    localStorage.setItem(key, jsonStr);
  } catch (e) {
    console.warn('Error writing localStorage key, writing to memoryStore:', key, e);
  }
}

// Data Migration Check to ensure 2024-2026 historical data is seeded with Jardim Maria Rosa locality
const DATA_VERSION_KEY = 'melodia_data_version';
const CURRENT_DATA_VERSION = '2024_2026_historical_v11_jd_maria_rosa_taboao';

function checkAndMigrateData() {
  if (typeof window === 'undefined') return;
  try {
    const currentVer = localStorage.getItem(DATA_VERSION_KEY);
    if (currentVer !== CURRENT_DATA_VERSION) {
      localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
      const updatedPessoas = MOCK_PESSOAS.map(p => ({
        ...p,
        comumCongregacao: p.comumCongregacao || 'Jardim Maria Rosa - Taboão da Serra - SP',
        bairro: p.bairro || 'Jardim Maria Rosa',
        cidade: p.cidade || 'Taboão da Serra',
        uf: p.uf || 'SP'
      }));
      setLocalItem(KEYS.PESSOAS, updatedPessoas);
      setLocalItem(KEYS.TURMAS, MOCK_TURMAS);
      setLocalItem(KEYS.AULAS, MOCK_AULAS);
      setLocalItem(KEYS.ESCALAS, MOCK_ESCALAS);
      setLocalItem(KEYS.DIARIO, MOCK_DIARIO);
      setLocalItem(KEYS.CATALOGO, MOCK_CATALOGO);
      syncStoreToIDB('pessoas', updatedPessoas);
      syncStoreToIDB('turmas', MOCK_TURMAS);
      syncStoreToIDB('aulas', MOCK_AULAS);
      syncStoreToIDB('escalas', MOCK_ESCALAS);
      syncStoreToIDB('diarios', MOCK_DIARIO);
      syncStoreToIDB('catalogo', MOCK_CATALOGO);
    }
  } catch (e) {
    console.error('Migration error:', e);
  }
}

checkAndMigrateData();

// Performance Metrics Cache
const metricsCache = new Map<string, any>();

export const db = {
  getPessoas(): Pessoa[] {
    const list = getLocalItem<Pessoa[]>(KEYS.PESSOAS, MOCK_PESSOAS);
    return list.map(p => ({
      ...p,
      comumCongregacao: p.comumCongregacao || 'Jardim Maria Rosa - Taboão da Serra - SP',
      bairro: p.bairro || 'Jardim Maria Rosa',
      cidade: p.cidade || 'Taboão da Serra',
      uf: p.uf || 'SP'
    }));
  },
  savePessoas(pessoas: Pessoa[]) {
    setLocalItem(KEYS.PESSOAS, pessoas);
    syncStoreToIDB('pessoas', pessoas);
    metricsCache.clear(); // invalidate cached metrics
  },

  getTurmas(): Turma[] {
    return getLocalItem<Turma[]>(KEYS.TURMAS, MOCK_TURMAS);
  },
  saveTurmas(turmas: Turma[]) {
    setLocalItem(KEYS.TURMAS, turmas);
    syncStoreToIDB('turmas', turmas);
    metricsCache.clear();
  },

  getAulas(): Aula[] {
    return getLocalItem<Aula[]>(KEYS.AULAS, MOCK_AULAS);
  },
  saveAulas(aulas: Aula[]) {
    setLocalItem(KEYS.AULAS, aulas);
    syncStoreToIDB('aulas', aulas);
    metricsCache.clear();
  },

  getEscalas(): Escala[] {
    return getLocalItem<Escala[]>(KEYS.ESCALAS, MOCK_ESCALAS);
  },
  saveEscalas(escalas: Escala[]) {
    setLocalItem(KEYS.ESCALAS, escalas);
    syncStoreToIDB('escalas', escalas);
  },

  getDiarios(): DiarioRegistro[] {
    return getLocalItem<DiarioRegistro[]>(KEYS.DIARIO, MOCK_DIARIO);
  },
  saveDiarios(diarios: DiarioRegistro[]) {
    setLocalItem(KEYS.DIARIO, diarios);
    syncStoreToIDB('diarios', diarios);
  },

  getCatalogo(): MaterialCatalogo[] {
    return getLocalItem<MaterialCatalogo[]>(KEYS.CATALOGO, MOCK_CATALOGO);
  },
  saveCatalogo(catalogo: MaterialCatalogo[]) {
    setLocalItem(KEYS.CATALOGO, catalogo);
    syncStoreToIDB('catalogo', catalogo);
  },

  getTheme(): 'light' | 'dark' {
    try {
      const val = localStorage.getItem(KEYS.THEME) || memoryStore[KEYS.THEME];
      return val === 'dark' ? 'dark' : 'light';
    } catch (e) {
      return memoryStore[KEYS.THEME] === 'dark' ? 'dark' : 'light';
    }
  },
  saveTheme(theme: 'light' | 'dark') {
    try {
      memoryStore[KEYS.THEME] = theme;
      localStorage.setItem(KEYS.THEME, theme);
    } catch (e) {
      memoryStore[KEYS.THEME] = theme;
    }
  },

  getCustomUsers(): CustomUserAccount[] {
    return getLocalItem<CustomUserAccount[]>(KEYS.CUSTOM_USERS, []);
  },
  saveCustomUsers(users: CustomUserAccount[]) {
    setLocalItem(KEYS.CUSTOM_USERS, users);
  },

  seed() {
    setLocalItem(KEYS.PESSOAS, MOCK_PESSOAS);
    setLocalItem(KEYS.TURMAS, MOCK_TURMAS);
    setLocalItem(KEYS.AULAS, MOCK_AULAS);
    setLocalItem(KEYS.ESCALAS, MOCK_ESCALAS);
    setLocalItem(KEYS.DIARIO, MOCK_DIARIO);
    setLocalItem(KEYS.CATALOGO, MOCK_CATALOGO);
    
    syncStoreToIDB('pessoas', MOCK_PESSOAS);
    syncStoreToIDB('turmas', MOCK_TURMAS);
    syncStoreToIDB('aulas', MOCK_AULAS);
    syncStoreToIDB('escalas', MOCK_ESCALAS);
    syncStoreToIDB('diarios', MOCK_DIARIO);
    syncStoreToIDB('catalogo', MOCK_CATALOGO);
    metricsCache.clear();
  },

  clear() {
    setLocalItem(KEYS.PESSOAS, []);
    setLocalItem(KEYS.TURMAS, []);
    setLocalItem(KEYS.AULAS, []);
    setLocalItem(KEYS.ESCALAS, []);
    setLocalItem(KEYS.DIARIO, []);
    setLocalItem(KEYS.CATALOGO, []);

    syncStoreToIDB('pessoas', []);
    syncStoreToIDB('turmas', []);
    syncStoreToIDB('aulas', []);
    syncStoreToIDB('escalas', []);
    syncStoreToIDB('diarios', []);
    syncStoreToIDB('catalogo', []);
    metricsCache.clear();
  },

  // Archive old lessons (>1 year) for performance optimization
  archiveOldAulas(): { archivedCount: number; remainingCount: number } {
    const allAulas = this.getAulas();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const cutoffDate = oneYearAgo.toISOString().split('T')[0];

    const activeAulas = allAulas.filter(a => a.data >= cutoffDate);
    const archivedAulas = allAulas.filter(a => a.data < cutoffDate);

    if (archivedAulas.length > 0) {
      // Save archived backup
      const oldArchived = getLocalItem<Aula[]>('om_aulas_archived', []);
      setLocalItem('om_aulas_archived', [...oldArchived, ...archivedAulas]);
      this.saveAulas(activeAulas);
    }

    return {
      archivedCount: archivedAulas.length,
      remainingCount: activeAulas.length
    };
  },

  // Pre-calculated student performance map
  getPrecalculatedStudentMetrics(pessoas: Pessoa[], aulas: Aula[]) {
    const cacheKey = `student_metrics_${pessoas.length}_${aulas.length}`;
    if (metricsCache.has(cacheKey)) {
      return metricsCache.get(cacheKey);
    }

    const map = new Map<string, { totalAulas: number; presencas: number; freqPct: number; mediaGeral: number; totalAvaliacoes: number }>();

    pessoas.forEach(p => {
      let totalAulas = 0;
      let presencas = 0;
      let totalNotasSum = 0;
      let totalNotasCount = 0;

      aulas.forEach(aula => {
        if (aula.presencas && idInPresencas(p.id, aula.presencas)) {
          totalAulas++;
          if (aula.presencas[p.id]) {
            presencas++;
            const evalObj = aula.avaliacoes?.[p.id];
            if (evalObj) {
              const scores = [evalObj.ritmo, evalObj.tecnica, evalObj.leitura, evalObj.expressao, evalObj.teoria].filter(s => typeof s === 'number');
              if (scores.length > 0) {
                const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
                totalNotasSum += avg;
                totalNotasCount++;
              }
            }
          }
        }
      });

      const freqPct = totalAulas > 0 ? Math.round((presencas / totalAulas) * 100) : 0;
      const mediaGeral = totalNotasCount > 0 ? Number((totalNotasSum / totalNotasCount).toFixed(1)) : 0;

      map.set(p.id, {
        totalAulas,
        presencas,
        freqPct,
        mediaGeral,
        totalAvaliacoes: totalNotasCount
      });
    });

    metricsCache.set(cacheKey, map);
    return map;
  },

  getBackupData(): object {
    return {
      pessoas: this.getPessoas(),
      turmas: this.getTurmas(),
      aulas: this.getAulas(),
      escalas: this.getEscalas(),
      diarios: this.getDiarios(),
      catalogo: this.getCatalogo(),
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
  },

  backupJson(): string {
    return JSON.stringify(this.getBackupData(), null, 2);
  },

  restoreBackup(backupInput: string | object): boolean {
    try {
      const parsed = typeof backupInput === 'string' ? JSON.parse(backupInput) : backupInput;
      if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.pessoas)) {
          const mappedPessoas = parsed.pessoas.map((p: any) => {
            let tipo = p.tipo;
            if (!tipo) {
              if (p.status === 'Aprendiz' || p.status === 'Aluno') {
                tipo = 'Aluno';
              } else if (p.status === 'Membro' || p.status === 'Reserva') {
                tipo = 'Musico';
              } else {
                tipo = 'Musico';
              }
            }

            let status = p.status;
            if (status === 'Aprendiz' || status === 'Membro' || status === 'Reserva') {
              if (status === 'Reserva') {
                status = 'Em Observação';
              } else {
                status = 'Ativo';
              }
            } else if (!status || !['Ativo', 'Afastado', 'Em Observação'].includes(status)) {
              status = 'Ativo';
            }

            return {
              id: p.id || 'pes_' + Math.random().toString(36).substring(2, 9),
              nome: p.nome || '',
              tipo: tipo as 'Musico' | 'Aluno' | 'Professor',
              instrumento: p.instrumento || '',
              status: status as 'Ativo' | 'Afastado' | 'Em Observação',
              telefone: p.telefone || p.contato || '',
              email: p.email || '',
              dataNascimento: p.dataNascimento || '',
              observacoes: p.observacoes || '',
              fase: p.fase || undefined,
              professorId: p.professorId || undefined,
              comumCongregacao: p.comumCongregacao || undefined,
              bairro: p.bairro || undefined,
              cidade: p.cidade || undefined,
              uf: p.uf || undefined,
              lgpdConsent: p.lgpdConsent || undefined,
              isAnonimizado: p.isAnonimizado || undefined,
              dataAnonimizacao: p.dataAnonimizacao || undefined,
            };
          });
          this.savePessoas(mappedPessoas);
        } else {
          return false;
        }

        if (Array.isArray(parsed.turmas)) {
          this.saveTurmas(parsed.turmas);
        }
        if (Array.isArray(parsed.aulas)) {
          this.saveAulas(parsed.aulas);
        }
        if (Array.isArray(parsed.escalas)) {
          this.saveEscalas(parsed.escalas);
        }
        if (Array.isArray(parsed.diarios)) {
          this.saveDiarios(parsed.diarios);
        } else {
          this.saveDiarios([]);
        }
        if (Array.isArray(parsed.catalogo)) {
          this.saveCatalogo(parsed.catalogo);
        } else {
          this.saveCatalogo(MOCK_CATALOGO);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to parse backup data', e);
      return false;
    }
  }
};

function idInPresencas(id: string, presencas: Record<string, boolean>): boolean {
  return Object.prototype.hasOwnProperty.call(presencas, id);
}

