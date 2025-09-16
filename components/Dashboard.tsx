
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Appliance } from '../types';

interface DashboardProps {
  appliances: Appliance[];
  tariff: number;
}

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#047857', '#065f46'];

const StatCard: React.FC<{ title: string; value: string; icon: string; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex items-center space-x-4">
        <div className={`rounded-full p-3 ${color}`}>
            <i className={`fas ${icon} text-2xl text-white`}></i>
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ appliances, tariff }) => {
  const { totalMonthlyCost, totalDailyKWh, pieData } = useMemo(() => {
    let totalDailyConsumptionWh = 0;
    const dataForPie = appliances.map(appliance => {
      const dailyConsumptionWh = appliance.power * appliance.dailyUsage;
      totalDailyConsumptionWh += dailyConsumptionWh;
      return {
        name: appliance.name,
        value: dailyConsumptionWh,
      };
    }).sort((a,b) => b.value - a.value);

    const totalDailyKWh = totalDailyConsumptionWh / 1000;
    const totalMonthlyCost = totalDailyKWh * 30 * tariff;
    
    return {
      totalMonthlyCost,
      totalDailyKWh,
      pieData: dataForPie,
    };
  }, [appliances, tariff]);

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Custo Mensal Estimado" value={`R$ ${totalMonthlyCost.toFixed(2)}`} icon="fa-wallet" color="bg-emerald-500" />
            <StatCard title="Consumo Diário Total" value={`${totalDailyKWh.toFixed(2)} kWh`} icon="fa-bolt" color="bg-amber-500" />
            <StatCard title="Aparelhos Cadastrados" value={appliances.length.toString()} icon="fa-plug" color="bg-sky-500" />
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Detalhamento do Consumo</h3>
            {appliances.length > 0 ? (
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `${(value / 1000).toFixed(2)} kWh/dia`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-slate-500 dark:text-slate-400">Adicione um eletrodoméstico para ver o detalhamento do consumo.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default Dashboard;