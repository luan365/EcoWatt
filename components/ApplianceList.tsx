import React from 'react';
import type { Appliance } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { PlugIcon } from './icons/PlugIcon';

interface ApplianceListProps {
  appliances: Appliance[];
  onDelete: (id: string) => void;
  tariff: number;
}

const ApplianceList: React.FC<ApplianceListProps> = ({ appliances, onDelete, tariff }) => {
  const calculateMonthlyCost = (power: number, dailyUsage: number) => {
    const dailyKWh = (power * dailyUsage) / 1000;
    const monthlyKWh = dailyKWh * 30;
    return (monthlyKWh * tariff);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Seus Eletrodomésticos</h2>
      {appliances.length === 0 ? (
        <div className="text-center py-10 px-6 text-slate-400">
          <PlugIcon className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="mt-2 text-lg font-medium text-white">Nenhum eletrodoméstico adicionado</h3>
          <p className="mt-1 text-sm">Comece clicando em "Adicionar Aparelho".</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appliances.map((appliance) => (
            <div key={appliance.id} className="bg-slate-700/50 p-4 rounded-lg flex justify-between items-center transition-colors hover:bg-slate-700">
              <div>
                <p className="font-semibold text-white">{appliance.name}</p>
                <p className="text-sm text-slate-400">{appliance.power}W · {appliance.dailyUsage}h/dia</p>
              </div>
              <div className="flex items-center space-x-4">
                <p className="font-medium text-emerald-400">R$ {calculateMonthlyCost(appliance.power, appliance.dailyUsage).toFixed(2)}/mês</p>
                <button
                  onClick={() => onDelete(appliance.id)}
                  className="bg-blue-600/50 hover:bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  aria-label={`Remover ${appliance.name}`}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplianceList;
