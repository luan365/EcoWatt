import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import type { Appliance } from '../types';
import { WalletIcon } from './icons/WalletIcon';
import { BoltIcon } from './icons/BoltIcon';
import { PlugIcon } from './icons/PlugIcon';

interface DashboardProps {
  appliances: Appliance[];
  tariff: number;
}

const COLORS = ['#059669', '#0d9488', '#0891b2', '#0284c7', '#2563eb', '#4f46e5', '#7c3aed'];

const Dashboard: React.FC<DashboardProps> = ({ appliances, tariff }) => {
  const totalDailyKWh = appliances.reduce((sum, app) => sum + (app.power * app.dailyUsage) / 1000, 0);
  const estimatedMonthlyCost = totalDailyKWh * 30 * tariff;

  const chartData = appliances.map((app) => ({
    name: app.name,
    value: (app.power * app.dailyUsage) / 1000,
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<WalletIcon className="w-8 h-8 text-emerald-400" />}
          title="Custo Mensal Estimado"
          value={`R$ ${estimatedMonthlyCost.toFixed(2)}`}
        />
        <StatCard
          icon={<BoltIcon className="w-8 h-8 text-amber-400" />}
          title="Consumo Diário Total"
          value={`${totalDailyKWh.toFixed(2)} kWh`}
        />
        <StatCard
          icon={<PlugIcon className="w-8 h-8 text-sky-400" />}
          title="Aparelhos Cadastrados"
          value={appliances.length.toString()}
        />
      </div>

      {/* Consumption Breakdown Chart */}
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Detalhamento do Consumo</h2>
        {appliances.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#334155',
                  borderColor: '#475569',
                  borderRadius: '0.5rem',
                }}
                formatter={(value: number) => [`${value.toFixed(2)} kWh`, 'Consumo Diário']}
              />
              <Legend iconSize={12} wrapperStyle={{ fontSize: '0.875rem' }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
           <div className="h-[300px] flex flex-col items-center justify-center text-slate-400">
             <BoltIcon className="w-16 h-16 text-slate-600 mb-4" />
            <p>Adicione um aparelho para ver o detalhamento do consumo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => (
  <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex items-center space-x-4">
    <div className="bg-slate-700/50 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

export default Dashboard;
