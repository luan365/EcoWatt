
import React, { useState } from 'react';
import { getEnergySavingTips } from '../services/geminiService';
import type { Appliance } from '../types';

interface AITipsProps {
  appliances: Appliance[];
  tariff: number;
}

export const AITips: React.FC<AITipsProps> = ({ appliances, tariff }) => {
  const [tips, setTips] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetTips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getEnergySavingTips(appliances, tariff);
      setTips(result);
    } catch (err) {
      setError('Falha ao buscar as dicas. Por favor, tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTips = (text: string) => {
    return text.split('\n').map((line, index) => {
        if (line.startsWith('* ') || line.startsWith('- ')) {
            return (
                <li key={index} className="flex items-start space-x-3">
                    <span className="text-emerald-500 mt-1">&#10003;</span>
                    <span>{line.substring(2)}</span>
                </li>
            );
        }
        return line ? <p key={index}>{line}</p> : null;
    });
};

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Dicas de Economia com IA</h3>
        <button
          onClick={handleGetTips}
          disabled={isLoading || appliances.length === 0}
          className="flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {isLoading ? (
            <i className="fas fa-spinner fa-spin mr-2"></i>
          ) : (
            <i className="fas fa-lightbulb mr-2"></i>
          )}
          {isLoading ? 'Gerando...' : 'Obter Dicas'}
        </button>
      </div>
      
      {error && <p className="text-red-500 text-center">{error}</p>}

      {tips && (
        <div className="prose prose-sm dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
          <ul className="space-y-2 list-none p-0">
            {renderTips(tips)}
          </ul>
        </div>
      )}
      {!tips && !isLoading && (
        <p className="text-center py-8 text-slate-500 dark:text-slate-400">Clique no botão para obter dicas personalizadas com base em seus eletrodomésticos.</p>
      )}
    </div>
  );
};
