
import React, { useState } from 'react';
import type { Appliance } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AddApplianceModal } from './components/AddApplianceModal';
import { Dashboard } from './components/Dashboard';
import { ApplianceList } from './components/ApplianceList';
import { AITips } from './components/AITips';
import { PlusIcon } from './components/icons/PlusIcon';

const App: React.FC = () => {
  const [appliances, setAppliances] = useLocalStorage<Appliance[]>('appliances', []);
  const [tariff, setTariff] = useLocalStorage<number>('tariff', 0.75);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addAppliance = (appliance: Omit<Appliance, 'id'>) => {
    const newAppliance: Appliance = { ...appliance, id: new Date().toISOString() };
    setAppliances([...appliances, newAppliance]);
  };

  const deleteAppliance = (id: string) => {
    setAppliances(appliances.filter(a => a.id !== id));
  };
  
  const handleTariffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setTariff(value);
    } else if (e.target.value === '') {
        setTariff(0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <header className="bg-white dark:bg-slate-800/50 shadow-sm sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <i className="fas fa-leaf text-2xl text-emerald-500"></i>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Monitor EcoWatt</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Adicionar Aparelho</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <label htmlFor="tariff" className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                    Tarifa de Energia (R$/kWh)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-slate-500 dark:text-slate-400 sm:text-sm">R$</span>
                    </div>
                    <input
                        type="number"
                        name="tariff"
                        id="tariff"
                        step="0.01"
                        className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 pl-8 pr-4 py-2 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm text-slate-800 dark:text-white"
                        placeholder="0.75"
                        value={tariff}
                        onChange={handleTariffChange}
                    />
                </div>
            </div>

          <Dashboard appliances={appliances} tariff={tariff} />
          <ApplianceList appliances={appliances} onDelete={deleteAppliance} tariff={tariff}/>
          <AITips appliances={appliances} tariff={tariff} />

        </div>
      </main>

      <AddApplianceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addAppliance}
      />
    </div>
  );
};

export default App;
