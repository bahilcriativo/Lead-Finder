import React, { useState } from 'react';
import { Search, Globe, Instagram, Facebook, Linkedin, Video, MapPin, Hash } from 'lucide-react';
import { SearchParams } from '../lib/types';
import { motion } from 'motion/react';

interface Props {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<Props> = ({ onSearch, isLoading }) => {
  const [params, setParams] = useState<SearchParams>({
    token: '',
    type: 'google',
    audience: '',
    region: '',
    ddi: '+55',
    source: 'Instagram',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(params);
  };

  return (
    <div id="search-form-container" className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto border border-gray-100">
      <div id="form-header" className="flex items-center gap-3 mb-6">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Globe className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">BR Finder Abroad</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div id="token-field">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Token de acesso:</label>
            <a 
              href="https://serper.dev" 
              target="_blank" 
              rel="noreferrer" 
              className="text-xs text-blue-600 hover:underline"
            >
              Obter token grátis
            </a>
          </div>
          <input
            type="password"
            placeholder="Cole sua API Key do Serper.dev aqui"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            value={params.token}
            onChange={(e) => setParams({ ...params, token: e.target.value })}
          />
          <p className="text-[10px] text-gray-400 mt-1">Sua chave é usada apenas para esta busca.</p>
        </div>

        <div id="search-type-field" className="bg-gray-50 p-3 rounded-lg flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="type"
              checked={params.type === 'google'}
              onChange={() => setParams({ ...params, type: 'google' })}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Pesquisar no Google</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="type"
              checked={params.type === 'maps'}
              onChange={() => setParams({ ...params, type: 'maps' })}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Google Maps</span>
          </label>
        </div>

        <div id="audience-field">
          <label className="block text-sm font-medium text-gray-700 mb-1">Público:</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              required
              placeholder="Ex: Pizzaria, Advogado, Dentista"
              className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={params.audience}
              onChange={(e) => setParams({ ...params, audience: e.target.value })}
            />
          </div>
        </div>

        <div id="region-field">
          <label className="block text-sm font-medium text-gray-700 mb-1">Região (País/Cidade):</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              required
              placeholder="Ex: Orlando, Miami, Portugal"
              className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={params.region}
              onChange={(e) => setParams({ ...params, region: e.target.value })}
            />
          </div>
        </div>

        <div id="ddi-field">
          <label className="block text-sm font-medium text-gray-700 mb-1">DDI do país:</label>
          <select
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={params.ddi}
            onChange={(e) => setParams({ ...params, ddi: e.target.value })}
          >
            <option value="+55">Brasil (+55)</option>
            <option value="+1">Estados Unidos (+1)</option>
            <option value="+44">Reino Unido (+44)</option>
            <option value="+351">Portugal (+351)</option>
            <option value="+86">China (+86)</option>
          </select>
        </div>

        <div id="source-field">
          <label className="block text-sm font-medium text-gray-700 mb-1">Origem:</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'Instagram', icon: Instagram, color: 'text-pink-600' },
              { id: 'Facebook', icon: Facebook, color: 'text-blue-700' },
              { id: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
              { id: 'YouTube', icon: Video, color: 'text-red-600' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setParams({ ...params, source: item.id })}
                className={`flex items-center gap-2 p-2 rounded-lg border transition-all text-sm ${
                  params.source === item.id 
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
                {item.id}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-950 transition-colors shadow-md flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Pesquisar
            </>
          )}
        </button>
      </form>
    </div>
  );
};
