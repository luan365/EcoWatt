import React, { useState, Suspense, useEffect } from 'react'; // <-- MUDANÇA (useEffect)
import type { Appliance } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { LeafIcon } from './components/icons/LeafIcon';
import { PlusIcon } from './components/icons/PlusIcon';
import { KeyIcon } from './components/icons/KeyIcon';

// Importação do Firebase
import { signInWithGoogle, signOutUser } from './services/auth.js'; // <-- MUDANÇA (signOutUser)
import { auth } from './firebaseConfig.js'; // <-- MUDANÇA (importar 'auth')
import type { User } from 'firebase/auth'; // <-- MUDANÇA (importar tipo 'User')

// Lazy imports
const AddApplianceModal = React.lazy(() => import('./components/AddApplianceModal'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const ApplianceList = React.lazy(() => import('./components/ApplianceList'));
const AITips = React.lazy(() => import('./components/AITips'));

const App: React.FC = () => {
  const [appliances, setAppliances] = useLocalStorage<Appliance[]>('appliances', []);
  const [tariff, setTariff] = useLocalStorage<number>('tariff', 0.75);
  const [apiKey, setApiKey] = useLocalStorage<string>('geminiApiKey', '');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- CONTROLE DE AUTENTICAÇÃO ---
  const [user, setUser] = useState<User | null>(null); // <-- MUDANÇA: Estado para o usuário

  // <-- MUDANÇA: "Ouvinte" de autenticação
  useEffect(() => {
    // Escuta em tempo real se o usuário está logado ou não
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Se logado, 'currentUser' é o objeto do usuário; se deslogado, é 'null'
    });

    // Limpa o "ouvinte" quando o componente é desmontado
    return () => unsubscribe();
  }, []); // Array vazio [], roda apenas uma vez

  // Função de Login (você já tinha)
  const handleLogin = async () => {
    const user = await signInWithGoogle();
    if (user) {
      alert(`Login bem-sucedido! Olá, ${user.displayName}`);
    } else {
      alert("Falha no login.");
    }
  };

  // <-- MUDANÇA: Função de Logout
  const handleLogout = async () => {
    await signOutUser();
    alert("Você foi desconectado.");
  };
  // --- FIM DO CONTROLE DE AUTENTICAÇÃO ---


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
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      {/* Header */}
      <header className="bg-slate-900/70 border-b border-slate-700/50 shadow-sm sticky top-0 z-20 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <LeafIcon className="text-2xl text-emerald-500 w-7 h-7" />
            <h1 className="text-2xl font-bold text-white">Monitor EcoWatt</h1>
          </div>

          {/* BOTÕES DO HEADER ATUALIZADOS */}
          <div className="flex items-center space-x-4">
            
            {/* <-- MUDANÇA: Lógica de Login/Logout condicional */}
            {user ? (
              // Se ESTIVER LOGADO
              <>
                <span className="text-sm text-slate-300 hidden sm:inline">
                  Olá, {user.displayName?.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              // Se NÃO ESTIVER LOGADO
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 transition-colors"
              >
                Login com Google
              </button>
            )}
            
            {/* Botão de Adicionar Aparelho (só aparece se estiver logado) */}
            {user && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition-colors"
                aria-label="Adicionar novo aparelho"
              >
                <PlusIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Adicionar Aparelho</span>
              </button>
            )}

          </div>
          {/* FIM DOS BOTÕES DO HEADER */}

        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* <-- MUDANÇA: Mostrar conteúdo só se estiver logado */}
        {!user && (
          <div className="text-center p-10 bg-slate-800 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Bem-vindo ao EcoWatt</h2>
            <p className="text-slate-300">Por favor, faça login para monitorar seus aparelhos.</p>
          </div>
        )}

        {user && (
          // O usuário só vê o conteúdo principal se estiver logado
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Settings Card */}
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4">Configurações</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
                {/* Tariff Input */}
                <div>
                  <label htmlFor="tariff" className="block text-sm font-medium text-slate-300 mb-1">
                    Tarifa de Energia (R$/kWh)
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-slate-400 sm:text-sm">R$</span>
                    </div>
                    <input
                      type="number"
                      name="tariff"
                      id="tariff"
                      step="0.01"
                      className="block w-full rounded-md border-slate-600 bg-slate-700 pl-8 pr-4 py-2 text-white focus:border-emerald-500 focus:ring-emerald-500 sm:text-lg"
                      placeholder="0.75"
                      value={tariff}
                      onChange={handleTariffChange}
                    />
                  </div>
                </div>
                {/* API Key Input */}
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-slate-300 mb-1">
                    Chave da API Gemini
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <KeyIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="password"
                        name="apiKey"
                        id="apiKey"
                        className="block w-full rounded-md border-slate-600 bg-slate-700 pl-10 pr-4 py-2 text-white focus:border-emerald-500 focus:ring-emerald-500 sm:text-lg"
                        placeholder="Cole sua chave aqui"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Suspense fallback={<div className="text-center text-slate-400 p-10">Carregando painel...</div>}>
              <Dashboard appliances={appliances} tariff={tariff} />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start min-h-[500px]">
              <div className="lg:col-span-2 flex flex-col space-y-8">
                <Suspense fallback={<div className="text-center text-slate-400 p-10">Carregando aparelhos...</div>}>
                  <ApplianceList appliances={appliances} onDelete={deleteAppliance} tariff={tariff} />
                </Suspense>
              </div>
              <div className="lg:col-span-1 h-full flex flex-col self-stretch">
                <Suspense fallback={<div className="text-center text-slate-400 p-10">Carregando dicas...</div>}>
                  <AITips appliances={appliances} tariff={tariff} apiKey={apiKey} />
                </Suspense>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Appliance Modal */}
      <Suspense fallback={null}>
        {isModalOpen && (
          <AddApplianceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddAppliance={addAppliance}
          />
        )}
      </Suspense>
    </div>
  );
};

export default App;