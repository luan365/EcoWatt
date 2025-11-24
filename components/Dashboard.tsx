import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import type { Appliance } from '../types';
import { WalletIcon } from './icons/WalletIcon';
import { BoltIcon } from './icons/BoltIcon';
import { PlugIcon } from './icons/PlugIcon';
import { LeafIcon } from './icons/LeafIcon';

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

      {/* Savings Potential */}
      {appliances.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/10 border border-emerald-700/50 p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <LeafIcon className="w-6 h-6 text-emerald-400 mr-3" />
              <h3 className="text-lg font-bold text-white">Economia Potencial (20%)</h3>
            </div>
            <p className="text-3xl font-bold text-emerald-400 mb-2">
              R$ {(estimatedMonthlyCost * 0.2).toFixed(2)}/mês
            </p>
            <p className="text-sm text-emerald-300">
              Implementando as dicas de economia da IA
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-700/50 p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <BoltIcon className="w-6 h-6 text-blue-400 mr-3" />
              <h3 className="text-lg font-bold text-white">Economia Anual (20%)</h3>
            </div>
            <p className="text-3xl font-bold text-blue-400 mb-2">
              R$ {(estimatedMonthlyCost * 0.2 * 12).toFixed(2)}/ano
            </p>
            <p className="text-sm text-blue-300">
              Equivalente a {((totalDailyKWh * 0.2 * 365) / 1000).toFixed(0)} MWh economizados
            </p>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      {appliances.length > 0 && (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Dicas Rápidas de Economia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TipCard
              title="Maior Consumidor"
              content={chartData[0] ? `${chartData[0].name} (${chartData[0].value.toFixed(2)} kWh/dia)` : 'N/A'}
              color="emerald"
            />
            <TipCard
              title="Manutenção Regular"
              content="Limpe filtros e serpentinas regularmente para manter a eficiência máxima do equipamento"
              color="sky"
            />
            <TipCard
              title="Monitoramento"
              content="Acompanhe o consumo diário para identificar picos e ajustar seus hábitos"
              color="violet"
            />
            <TipCard
              title="Investimento"
              content="Considere trocar aparelhos antigos por modelos mais eficientes com selo PROCEL"
              color="pink"
            />
          </div>
        </div>
      )}
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

interface TipCardProps {
  title: string;
  content: string;
  color: 'emerald' | 'blue' | 'amber' | 'sky' | 'violet' | 'pink';
}

const TipCard: React.FC<TipCardProps> = ({ title, content, color }) => {
  const colorStyles = {
    emerald: 'bg-emerald-900/20 border-emerald-700/50 text-emerald-300',
    blue: 'bg-blue-900/20 border-blue-700/50 text-blue-300',
    amber: 'bg-amber-900/20 border-amber-700/50 text-amber-300',
    sky: 'bg-sky-900/20 border-sky-700/50 text-sky-300',
    violet: 'bg-violet-900/20 border-violet-700/50 text-violet-300',
    pink: 'bg-pink-900/20 border-pink-700/50 text-pink-300',
  };

  return (
    <div className={`${colorStyles[color]} border p-4 rounded-lg`}>
      <p className="font-semibold text-white mb-1">{title}</p>
      <p className="text-sm">{content}</p>
    </div>
  );
};

export default Dashboard;
