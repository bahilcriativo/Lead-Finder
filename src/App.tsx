/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SearchForm } from './components/SearchForm.tsx';
import { ResultsList } from './components/ResultsList.tsx';
import { SearchParams } from './lib/types.ts';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { useEffect } from 'react';

export default function App() {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState<'google' | 'maps'>('google');

  useEffect(() => {
    // Initial health check - non blocking
    axios.get('/api/health')
      .then(res => console.log('Server is alive:', res.data))
      .catch(err => {
        console.warn('Server health check failed (might be expected in some envs):', err.message);
        // We don't toast error here because it might be a temporary hiccup or false positive
      });
  }, []);

  const handleSearch = async (params: SearchParams) => {
    console.log('Search triggered:', params);
    setIsLoading(true);
    setSearchType(params.type);
    
    try {
      const response = await axios.post('/api/search', params);
      console.log('Search successful:', response.data);
      
      let data: any[] = [];
      if (params.type === 'google') {
        data = response.data.organic || [];
      } else {
        data = response.data.places || [];
      }

      setResults(data);
      
      if (data.length === 0) {
        toast('Nenhum resultado encontrado. Tente ajustar os termos de busca.', {
          icon: 'ℹ️',
        });
      } else {
        toast.success(`Encontrados ${data.length} contatos!`);
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error || 'Erro ao conectar ao servidor.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-gray-50 py-10 px-4 md:px-0">
      <Toaster position="top-right" />
      
      <main className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Lead Finder Pro
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Localize brasileiros e empreendimentos com foco em contato via WhatsApp no exterior. 
            A mecânica utiliza filtros de DDI e perfis sociais.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <div className="w-full lg:sticky lg:top-10">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>
          
          <div className="w-full">
            {results.length > 0 ? (
              <ResultsList results={results} type={searchType} />
            ) : (
              !isLoading && (
                <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">🔍</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Nenhuma busca realizada</h3>
                  <p className="text-gray-500 text-center mt-1">Preencha os dados ao lado para começar a minerar contatos.</p>
                </div>
              )
            )}
            
            {isLoading && (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-20 text-center text-gray-400 text-sm">
        <p>&copy; 2026 Lead Finder Pro - Tecnologia avançada de busca.</p>
      </footer>
    </div>
  );
}
