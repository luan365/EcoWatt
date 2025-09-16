
import React, { useState } from 'react';
import type { Appliance } from '../types';

interface AddApplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (appliance: Omit<Appliance, 'id'>) => void;
}

const AddApplianceModal: React.FC<AddApplianceModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [power, setPower] = useState('');
  const [dailyUsage, setDailyUsage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const powerNum = parseFloat(power);
    const usageNum = parseFloat(dailyUsage);

    if (!name.trim() || isNaN(powerNum) || isNaN(usageNum) || powerNum <= 0 || usageNum < 0 || usageNum > 24) {
      setError('Por favor, preencha todos os campos com valores válidos. O uso deve ser entre 0 e 24 horas.');
      return;
    }
    
    onAdd({ name, power: powerNum, dailyUsage: usageNum });
    setName('');
    setPower('');
    setDailyUsage('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Adicionar Novo Eletrodoméstico</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300">&times;</button>
        </div>
        {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Nome do Eletrodoméstico</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Geladeira"
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="power" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Potência (Watts)</label>
            <input
              id="power"
              type="number"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              placeholder="ex: 150"
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="dailyUsage" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Uso Médio Diário (Horas)</label>
            <input
              id="dailyUsage"
              type="number"
              step="0.5"
              value={dailyUsage}
              onChange={(e) => setDailyUsage(e.target.value)}
              placeholder="ex: 8"
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-slate-800 dark:text-white"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition">Adicionar Eletrodoméstico</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddApplianceModal;