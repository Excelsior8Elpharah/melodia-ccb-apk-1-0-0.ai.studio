import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';
import { db } from '../data/db';
import { Shield, UserCheck, BookOpen, Lock, GraduationCap, Sparkles } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, loginAsPessoa, user } = useAuth();
  const [, setSelectedRole] = useState<UserRole>('ADMIN');

  const pessoas = useMemo(() => db.getPessoas(), []);
  const turmas = useMemo(() => db.getTurmas(), []);
  const professores = useMemo(() => pessoas.filter(p => p.tipo === 'Professor'), [pessoas]);
  const alunos = useMemo(() => pessoas.filter(p => p.tipo === 'Aluno'), [pessoas]);

  if (!isOpen) return null;

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    login(role);
    onClose();
  };

  const handleSelectSpecificPessoa = (pessoaId: string) => {
    if (!pessoaId) return;
    loginAsPessoa(pessoaId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 dark:border-gray-700 max-h-[90vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 p-6 text-white text-center relative shrink-0">
          <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-3 backdrop-blur-md">
            <Shield className="w-8 h-8 text-blue-200" />
          </div>
          <h2 className="text-xl font-bold">Melodia CCB - Controle de Acesso</h2>
          <p className="text-xs text-blue-100 mt-1">Selecione seu perfil de acesso operacional ou teste como usuário específico</p>
        </div>

        {/* Conteúdo com rolagem se necessário */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Perfis Gerais */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
              1. Perfis de Papel (Role-Based)
            </span>

            {/* Perfil ADMIN */}
            <button
              onClick={() => handleSelectRole('ADMIN')}
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer ${
                user?.role === 'ADMIN'
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 ring-2 ring-blue-500/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0 dark:bg-blue-900/50 dark:text-blue-300">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">Encarregado / Admin</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Acesso Total</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Gestão completa de alunos, notas, backups e configurações do sistema.</p>
              </div>
            </button>

            {/* Perfil INSTRUTOR */}
            <button
              onClick={() => handleSelectRole('INSTRUTOR')}
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer ${
                user?.role === 'INSTRUTOR' && !user?.pessoaId
                  ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/20 ring-2 ring-emerald-500/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0 dark:bg-emerald-900/50 dark:text-emerald-300">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">Instrutor da Orquestra</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Edição Limitada</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Lançamento de presenças, avaliações de métodos, hinos e acompanhamento do naipe.</p>
              </div>
            </button>

            {/* Perfil CONSULTA */}
            <button
              onClick={() => handleSelectRole('CONSULTA')}
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer ${
                user?.role === 'CONSULTA' && !user?.pessoaId
                  ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-900/20 ring-2 ring-purple-500/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="p-2 bg-purple-100 text-purple-700 rounded-lg shrink-0 dark:bg-purple-900/50 dark:text-purple-300">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">Aluno / Responsável</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Apenas Leitura</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Consulta individual de frequências, notas do boletim e projeção no Gantt sem alteração.</p>
              </div>
            </button>
          </div>

          {/* Seletor Rápido de Professores */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                2. Testar como Professor / Instrutor Específico
              </span>
              <span className="text-[10px] text-gray-400">Suas turmas e alunos</span>
            </div>
            <select
              defaultValue=""
              onChange={(e) => handleSelectSpecificPessoa(e.target.value)}
              className="w-full py-2.5 px-3 bg-gray-50 dark:bg-gray-700/60 border border-blue-200 dark:border-blue-900/50 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
            >
              <option value="">Selecione um professor para alternar instantaneamente...</option>
              {professores.map(p => {
                const pTurmas = turmas.filter(t => t.professorId === p.id);
                const tInfo = pTurmas.length > 0 ? `${pTurmas.length} ${pTurmas.length === 1 ? 'turma' : 'turmas'}` : 'sem turmas';
                const isCurrent = user?.pessoaId === p.id;
                return (
                  <option key={p.id} value={p.id}>
                    {isCurrent ? '✓ ' : ''}👨‍🏫 {p.nome} • {p.instrumento} ({tInfo})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Seletor Rápido de Alunos */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                3. Testar como Aluno Específico
              </span>
              <span className="text-[10px] text-gray-400">Isolamento individual</span>
            </div>
            <select
              defaultValue=""
              onChange={(e) => handleSelectSpecificPessoa(e.target.value)}
              className="w-full py-2.5 px-3 bg-gray-50 dark:bg-gray-700/60 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
            >
              <option value="">Selecione um aluno para alternar instantaneamente...</option>
              {alunos.map(a => {
                const isCurrent = user?.pessoaId === a.id;
                return (
                  <option key={a.id} value={a.id}>
                    {isCurrent ? '✓ ' : ''}🎓 {a.nome} ({a.instrumento} • Fase {a.fase || 1})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
          <span className="text-xs text-gray-500 flex items-center">
            <Lock className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Sessão Ativa Criptografada
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
