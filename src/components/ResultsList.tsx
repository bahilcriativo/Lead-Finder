import React from 'react';
import { ExternalLink, MapPin, Phone, Star, Download } from 'lucide-react';
import { SearchResult, MapsResult } from '../lib/types';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';

interface Props {
  results: any[];
  type: 'google' | 'maps';
}

export const ResultsList: React.FC<Props> = ({ results, type }) => {
  if (results.length === 0) return null;

  const exportToCSV = () => {
    try {
      let csvContent = "";
      let headers = [];
      let rows = [];

      if (type === 'google') {
        headers = ['Titulo', 'Link', 'Snippet'];
        rows = results.map((r: SearchResult) => [
          `"${(r.title || '').replace(/"/g, '""')}"`,
          `"${r.link || ''}"`,
          `"${(r.snippet || '').replace(/"/g, '""')}"`
        ]);
      } else {
        headers = ['Nome', 'Endereco', 'Telefone', 'Rating', 'Link'];
        rows = results.map((r: MapsResult) => [
          `"${(r.title || '').replace(/"/g, '""')}"`,
          `"${(r.address || '').replace(/"/g, '""')}"`,
          `"${r.phoneNumber || ''}"`,
          `"${r.rating || ''}"`,
          `"${r.link || ''}"`
        ]);
      }

      csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `busca_leads_${type}_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Arquivo CSV gerado com sucesso!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Erro ao exportar os dados.');
    }
  };

  return (
    <div id="results-container" className="w-full max-w-4xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">Resultados da Busca</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {results.length} encontrados
          </span>
        </div>
        
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      <div className="grid gap-4">
        {type === 'google' ? (
          results.map((result: SearchResult, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={index}
              id={`result-${index}`}
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="text-xs font-medium text-blue-600 mb-1 block">
                    {new URL(result.link).hostname}
                  </span>
                  <a 
                    href={result.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 flex items-center gap-2"
                  >
                    {result.title}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed italic">
                    "{result.snippet}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          results.map((result: MapsResult, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={index}
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    {result.address}
                  </div>
                  {result.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">{result.rating}</span>
                    </div>
                  )}
                </div>
                {result.phoneNumber && (
                  <div className="flex flex-col items-end">
                    <a 
                      href={`tel:${result.phoneNumber}`}
                      className="flex items-center gap-2 text-blue-600 font-medium hover:underline text-sm"
                    >
                      <Phone className="w-4 h-4" />
                      {result.phoneNumber}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
