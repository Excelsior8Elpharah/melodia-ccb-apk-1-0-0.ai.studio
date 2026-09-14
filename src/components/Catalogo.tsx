/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MaterialCatalogo } from '../types';
import { INSTRUMENTOS_PREDEFINIDOS } from '../data/mockData';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  BookOpen, 
  FileText, 
  Award, 
  Music, 
  X, 
  Check, 
  Layers,
  Sparkles
} from 'lucide-react';

interface CatalogoProps {
  catalogo: MaterialCatalogo[];
  onSave: (material: MaterialCatalogo) => void;
  onDelete: (id: string) => void;
  toast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  key?: string;
}

export default function Catalogo({
  catalogo,
  onSave,
  onDelete,
  toast
}: CatalogoProps) {
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInstrumento, setFilterInstrumento] = useState<string>('Todos');
  const [filterFase, setFilterFase] = useState<string>('Todas');
  const [filterTipo, setFilterTipo] = useState<string>('Todos');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MaterialCatalogo | null>(null);

  // Form State
  const [nome, setNome] = useState('');
  const [instrumento, setInstrumento] = useState('Geral');
  const [fase, setFase] = useState<number>(1);
  const [tipo, setTipo] = useState<'Teoria' | 'Técnica' | 'Repertório'>('Teoria');
  const [metodo, setMetodo] = useState('');
  const [descricao, setDescricao] = useState('');

  const resetForm = () => {
    setNome('');
    setInstrumento('Geral');
    setFase(1);
    setTipo('Teoria');
    setMetodo('');
    setDescricao('');
    setEditingItem(null);
  };

  const handleOpenNewModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (item: MaterialCatalogo) => {
    setEditingItem(item);
    setNome(item.nome);
    setInstrumento(item.instrumento || 'Geral');
    setFase(item.fase || 1);
    setTipo(item.tipo || 'Teoria');
    setMetodo(item.metodo || '');
    setDescricao(item.descricao || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast('Por favor, informe o nome do material.', 'error');
      return;
    }

    const newItem: MaterialCatalogo = {
      id: editingItem ? editingItem.id : 'cat_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      nome: nome.trim(),
      instrumento,
      fase: Number(fase),
      tipo,
      metodo: metodo.trim() || undefined,
      descricao: descricao.trim() || undefined,
    };

    onSave(newItem);
    toast(editingItem ? 'Material atualizado com sucesso!' : 'Material adicionado ao catálogo!', 'success');
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string, nomeMaterial: string) => {
    if (window.confirm(`Deseja remover "${nomeMaterial}" do catálogo permanentemente?`)) {
      onDelete(id);
      toast(`Material "${nomeMaterial}" removido!`, 'info');
    }
  };

  // Filter Logic
  const filteredList = catalogo.filter(item => {
    // Search
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      item.nome.toLowerCase().includes(searchLower) ||
      (item.metodo && item.metodo.toLowerCase().includes(searchLower)) ||
      (item.descricao && item.descricao.toLowerCase().includes(searchLower));

    // Instrument Filter
    const matchesInstrumento = 
      filterInstrumento === 'Todos' || 
      item.instrumento === filterInstrumento ||
      (filterInstrumento === 'Geral' && item.instrumento === 'Geral');

    // Phase Filter
    const matchesFase = 
      filterFase === 'Todas' || 
      item.fase === Number(filterFase);

    // Type Filter
    const matchesTipo = 
      filterTipo === 'Todos' || 
      item.tipo === filterTipo;

    return matchesSearch && matchesInstrumento && matchesFase && matchesTipo;
  });

  // KPI Calculations
  const totalMateriais = catalogo.length;
  const totalTeoria = catalogo.filter(c => c.tipo === 'Teoria').length;
  const totalTecnica = catalogo.filter(c => c.tipo === 'Técnica').length;
  const totalRepertorio = catalogo.filter(c => c.tipo === 'Repertório').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* KPI METRICS HEADER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total do Catálogo</span>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{totalMateriais}</div>
          <span className="text-[11px] text-slate-400">Itens cadastrados</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Teoria & Solfejo</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{totalTeoria}</div>
          <span className="text-[11px] text-slate-400">Ex: BONA, Solfejos</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Técnica & Métodos</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{totalTecnica}</div>
          <span className="text-[11px] text-slate-400">Ex: Galamian, Arban, Suzuki</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Repertório / Hinos</span>
            <Music className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{totalRepertorio}</div>
          <span className="text-[11px] text-slate-400">Hinos Jovens & Oficiais</span>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar material, método ou descrição..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Instrument Filter */}
          <select 
            value={filterInstrumento}
            onChange={(e) => setFilterInstrumento(e.target.value)}
            className="py-2 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option key="all-inst" value="Todos">Todos os Instrumentos</option>
            <option key="geral-inst" value="Geral">Geral (Teoria/Repertório)</option>
            {INSTRUMENTOS_PREDEFINIDOS.map(inst => (
              <option key={inst.nome} value={inst.nome}>
                {inst.nome}{'observacao' in inst && inst.observacao ? ` (${inst.observacao})` : ''}
              </option>
            ))}
          </select>

          {/* Phase Filter */}
          <select 
            value={filterFase}
            onChange={(e) => setFilterFase(e.target.value)}
            className="py-2 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todas">Todas as Fases</option>
            <option value="1">Fase 1 (Fundamentos)</option>
            <option value="2">Fase 2 (Técnica)</option>
            <option value="3">Fase 3 (Hinos Jovens)</option>
            <option value="4">Fase 4 (Hinos Oficiais)</option>
          </select>

          {/* Type Filter */}
          <select 
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="py-2 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todos">Todos os Tipos</option>
            <option value="Teoria">Teoria (BONA)</option>
            <option value="Técnica">Técnica (Método)</option>
            <option value="Repertório">Repertório (Hinos)</option>
          </select>

          {/* Add Button */}
          <button 
            onClick={handleOpenNewModal}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Material</span>
          </button>
        </div>
      </div>

      {/* CATALOG DATA TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Nome do Material</th>
                <th className="py-3.5 px-4">Instrumento</th>
                <th className="py-3.5 px-4">Fase</th>
                <th className="py-3.5 px-4">Tipo</th>
                <th className="py-3.5 px-4">Método / Referência</th>
                <th className="py-3.5 px-4">Descrição</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                    Nenhum material encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredList.map(item => {
                  // Type badge styling
                  let tipoBadge = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50';
                  if (item.tipo === 'Técnica') {
                    tipoBadge = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
                  } else if (item.tipo === 'Repertório') {
                    tipoBadge = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
                  }

                  // Phase badge styling
                  let faseBadge = 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
                  if (item.fase === 2) {
                    faseBadge = 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 border-teal-200 dark:border-teal-800/50';
                  } else if (item.fase === 3) {
                    faseBadge = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
                  } else if (item.fase === 4) {
                    faseBadge = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/50';
                  }

                  return (
                    <tr 
                      key={item.id} 
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors duration-150"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-100">
                        {item.nome}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${item.instrumento === 'Geral' ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                          {item.instrumento}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${faseBadge}`}>
                          Fase {item.fase}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${tipoBadge}`}>
                          {item.tipo}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-300">
                        {item.metodo || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 max-w-xs truncate" title={item.descricao}>
                        {item.descricao || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-all cursor-pointer"
                            title="Editar Material"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id, item.nome)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-all cursor-pointer"
                            title="Excluir Material"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-extrabold text-slate-800 dark:text-white text-base">
                  {editingItem ? 'Editar Material' : 'Novo Material de Aula'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Nome */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nome do Material <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: BONA – Leitura Rítmica nº 1 ao 10"
                  required
                  className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Instrumento & Fase */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Instrumento
                  </label>
                  <select 
                    value={instrumento}
                    onChange={(e) => setInstrumento(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option key="geral-opt" value="Geral">Geral (Teoria/Repertório)</option>
                    {INSTRUMENTOS_PREDEFINIDOS.map(inst => (
                      <option key={inst.nome} value={inst.nome}>
                        {inst.nome}{'observacao' in inst && inst.observacao ? ` (${inst.observacao})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fase
                  </label>
                  <select 
                    value={fase}
                    onChange={(e) => setFase(Number(e.target.value))}
                    className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>1 - Fundamentos</option>
                    <option value={2}>2 - Técnica & Métodos</option>
                    <option value={3}>3 - Hinos Jovens</option>
                    <option value={4}>4 - Hinos Oficiais</option>
                  </select>
                </div>
              </div>

              {/* Tipo & Método */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Material
                  </label>
                  <select 
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as any)}
                    className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Teoria">Teoria (BONA)</option>
                    <option value="Técnica">Técnica (Método)</option>
                    <option value="Repertório">Repertório (Hinos)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Método / Autor <span className="text-slate-400 font-normal">(Opcional)</span>
                  </label>
                  <input 
                    type="text" 
                    value={metodo}
                    onChange={(e) => setMetodo(e.target.value)}
                    placeholder="Ex: BONA, Galamian, Arban, Hanon"
                    className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Descrição / Conteúdo Programático
                </label>
                <textarea 
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Detalhamento do conteúdo, exercícios específicos ou instruções de estudo..."
                  className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingItem ? 'Salvar Alterações' : 'Adicionar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
