
import React from 'react';
import type { Appliance } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface ApplianceListProps {
  appliances: Appliance[];
  onDelete: (id: string) => void;
  tariff: number;
}

export const ApplianceList: React.FC<ApplianceListProps> = ({ appliances, onDelete, tariff }) => {

  const calculateMonthlyCost = (appliance: Appliance) => {
    const dailyKWh = (appliance.power * appliance.dailyUsage) / 1000;
    return dailyKWh * 30 * tariff;
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Seus Eletrodomésticos</h3>
      <div className="space-y-3">
        {appliances.length > 0 ? (
          appliances.map(appliance => (
            <div key={appliance.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">{appliance.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {appliance.power}W &middot; {appliance.dailyUsage}h/dia
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">R$ {calculateMonthlyCost(appliance).toFixed(2)}/mês</p>
                <button
                  onClick={() => onDelete(appliance.id)}
                  className="p-2 text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition"
                  aria-label={`Excluir ${appliance.name}`}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-8 text-slate-500 dark:text-slate-400">Nenhum eletrodoméstico adicionado ainda.</p>
        )}
      </div>
    </div>
  );
};
