// src/components/AITips.tsx
import React from 'react';
import type { Appliance } from '../types';

interface AITipsProps {
  appliances: Appliance[];
  tariff: number;
}

export const AITips: React.FC<AITipsProps> = ({ appliances, tariff }) => {
  if (appliances.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Dicas de Economia</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Adicione aparelhos para ver dicas de economia de energia.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Dicas de Economia</h2>
      <ul className="mt-2 list-disc list-inside text-slate-600 dark:text-slate-300">
        {appliances.map((appliance) => (
          <li key={appliance.id}>
            Lembre-se de desligar seu <strong>{appliance.name}</strong> quando não estiver usando.
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AITips;
