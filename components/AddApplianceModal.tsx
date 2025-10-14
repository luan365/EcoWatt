import React, { useState } from 'react';
import type { Appliance } from '../types';
import { PlugIcon } from './icons/PlugIcon';

interface AddApplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppliance: (appliance: Omit<Appliance, 'id'>) => void;
}

const AddApplianceModal: React.FC<AddApplianceModalProps> = ({ isOpen, onClose, onAddAppliance }) => {
  const [name, setName] = useState('');
  const [power, setPower] = useState('');
  const [dailyUsage, setDailyUsage] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const powerNum = parseInt(power, 10);
    const dailyUsageNum = parseFloat(dailyUsage.replace(',', '.'));

    if (name && !isNaN(powerNum) && powerNum > 0 && !isNaN(dailyUsageNum) && dailyUsageNum > 0 && dailyUsageNum <= 24) {
      onAddAppliance({
        name,
        power: powerNum,
        dailyUsage: dailyUsageNum,
      });
      setName('');
      setPower('');
      setDailyUsage('');
      onClose();
    } else {
      alert("Por favor, preencha todos os campos com valores válidos.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl p-8 shadow-2xl w-full max-w-md border border-slate-700" onClick={e => e.stopPropagation()}>
        <div className="flex items-center mb-6">
          <PlugIcon className="w-8 h-8 text-emerald-500 mr-4" />
          <h2 className="text-2xl font-bold text-white">Adicionar Aparelho</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-slate-300 text-sm font-bold mb-2">Nome do Aparelho</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Geladeira Frost-Free"
              className="appearance-none border border-slate-600 rounded w-full py-2 px-3 bg-slate-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label htmlFor="power" className="block text-slate-300 text-sm font-bold mb-2">Potência (em Watts)</label>
            <input
              id="power"
              type="number"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              placeholder="Ex: 200"
              className="appearance-none border border-slate-600 rounded w-full py-2 px-3 bg-slate-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
              min="1"
            />
          </div>
          <div>
            <label htmlFor="dailyUsage" className="block text-slate-300 text-sm font-bold mb-2">Uso Diário (em horas)</label>
            <input
              id="dailyUsage"
              type="text"
              value={dailyUsage}
              onChange={(e) => setDailyUsage(e.target.value)}
              placeholder="Ex: 8,5"
              className="appearance-none border border-slate-600 rounded w-full py-2 px-3 bg-slate-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
              pattern="[0-9]+([,.][0-9]+)?"
            />
             <p className="text-xs text-slate-500 mt-1">Use vírgula ou ponto para decimais. Máximo 24 horas.</p>
          </div>
          <div className="flex items-center justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg mr-2 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddApplianceModal;
