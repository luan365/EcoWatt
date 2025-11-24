import React, { useState, useCallback } from 'react';
import type { Appliance } from '../types';
import { getEnergySavingTips } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

interface AITipsProps {
  appliances: Appliance[];
  tariff: number;
}

const AITips: React.FC<AITipsProps> = ({ appliances, tariff }) => {
  const apiKey = import.meta.env.VITE_API_KEY || '';
  const [tips, setTips] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateTips = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    setTips('');
    try {
      const generatedTips = await getEnergySavingTips(appliances, tariff, apiKey);
      setTips(generatedTips);
    } catch (e) {
      setError("Ocorreu um erro ao buscar as dicas. Tente novamente.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [appliances, tariff, isLoading, apiKey]);

  const hasAppliances = appliances.length > 0;

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg h-full flex flex-col">
      <div className="flex items-center mb-2">
        <SparklesIcon className="w-6 h-6 text-amber-400 mr-3" />
        <h2 className="text-xl font-bold text-white">Dicas de Economia</h2>
      </div>
      <p className="text-slate-400 mb-4 text-sm">
        Receba dicas personalizadas da IA para reduzir sua conta de luz.
      </p>

      <button
        onClick={handleGenerateTips}
        disabled={isLoading || !hasAppliances}
        className="w-full bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-4"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Gerando...
          </>
        ) : (
          "Gerar Dicas com IA"
        )}
      </button>

      <div className="flex-grow flex flex-col min-h-0">
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        
        {tips ? (
          <div className="bg-slate-700/50 p-4 rounded-lg overflow-y-auto flex-grow">
            <div className="text-slate-300 text-sm space-y-1">
              {tips.split('\n').map((line, idx) => {
                // Substitui **texto** por <strong>texto</strong>
                const htmlLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                return (
                  <div key={idx} style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: htmlLine }} />
                );
              })}
            </div>
          </div>
        ) : !isLoading && (
           <div className="flex-grow flex items-center justify-center text-slate-500">
                <p>Suas dicas aparecerão aqui.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AITips;