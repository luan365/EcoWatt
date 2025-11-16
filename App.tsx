import React, { useState, Suspense, useEffect } from 'react';
import type { Appliance } from './types';
import { LeafIcon } from './components/icons/LeafIcon';
import { PlusIcon } from './components/icons/PlusIcon';
import { KeyIcon } from './components/icons/KeyIcon';
import { GoogleIcon } from './components/icons/GoogleIcon'; // <-- MUDANÇA 1

import { 
  signInWithGoogle, 
  signOutUser, 
  signInAnonymouslyUser 
} from './services/auth.js';
import { auth } from './firebaseConfig.js';
import type { User } from 'firebase/auth';

import { loadAppliances, saveAppliances } from './services/database.js';
import { useLocalStorage } from './hooks/useLocalStorage';

// Lazy imports
const AddApplianceModal = React.lazy(() => import('./components/AddApplianceModal'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const ApplianceList = React.lazy(() => import('./components/ApplianceList'));
const AITips = React.lazy(() => import('./components/AITips'));

const App: React.FC = () => {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [tariff, setTariff] = useLocalStorage<number>('tariff', 0.75);
  const [apiKey, setApiKey] = useLocalStorage<string>('geminiApiKey', '');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- MUDANÇA 2: Login Anônimo Padrão ---
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      
      if (currentUser) {
        // Usuário já está logado (Google ou Anônimo)
        setUser(currentUser);
        if (currentUser.isAnonymous) {
          // Se for anônimo, limpa e para de carregar
          console.log("Sessão anônima ativa.");
          setAppliances([]); 
          setIsLoading(false);
        } else {
          // Se for Google, carrega os dados
          setIsLoading(true);
          console.log("Carregando dados do usuário:", currentUser.uid);
          const loadedData = await loadAppliances(currentUser.uid);
          setAppliances(loadedData);
          setIsLoading(false);
        }
      } else {
        // NÃO HÁ NINGUÉM LOGADO -> LOGA ANONIMAMENTE
        console.log("Nenhum usuário. Iniciando sessão anônima padrão.");
        setIsLoading(true); // Mostra "Carregando" enquanto loga
        await signInAnonymouslyUser();
        // O listener vai rodar de novo e cair no `if (currentUser)`
      }
    });

    return () => unsubscribe();
  }, []); // Array vazio [], roda apenas uma vez

  // Bloco para SALVAR dados (sem mudança)
  useEffect(() => {
    if (isLoading || !user || user.isAnonymous) {
      return; 
    }
    const saveTimer = setTimeout(() => {
      console.log("Salvando aparelhos no Firestore...");
      saveAppliances(user.uid, appliances);
    }, 1000); 
    return () => clearTimeout(saveTimer);
  }, [appliances, user, isLoading]);

  // Funções de Login/Logout
  const handleLogin = async () => {
    await signInWithGoogle();
  };
  
  // (Não precisamos mais do handleAnonymousLogin, pois é automático)

  const handleLogout = async () => {
    await signOutUser();
    // Ao fazer logout, ele vai cair no `else` do `useEffect` e logar anonimamente de novo
  };

  // Funções dos Aparelhos
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

          {/* --- MUDANÇA 3: Lógica de botões no Header --- */}
          <div className="flex items-center space-x-4">
            
            {user && user.isAnonymous && (
              // SE ESTIVER ANÔNIMO: Mostra o botão de "Upgrade" para o Google
              <button
                onClick={handleLogin}
                // Novo estilo para o botão do Google
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:bg-gray-100 transition-colors"
              >
                <GoogleIcon className="w-5 h-5" />
                <span>Login com Google</span>
              </button>
            )}

            {user && !user.isAnonymous && (
              // SE ESTIVER LOGADO COM GOOGLE: Mostra saudação e logout
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
            )}
            
            {/* O botão de "Adicionar" aparece para TODOS os usuários logados */}
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
          {/* FIM DA MUDANÇA NOS BOTÕES */}

        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 sm:p-6 lg:px-8">
        
        {/* Mensagem de loading (agora cobre o estado inicial) */}
        {isLoading && (
          <div className="text-center text-slate-400 p-10">Carregando...</div>
        )}

        {/* O conteúdo aparece para qualquer usuário logado (Google ou Anônimo) */}
        {user && !isLoading && (
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Aviso para usuários anônimos */}
            {user.isAnonymous && (
              <div className="bg-yellow-800/50 border border-yellow-700 text-yellow-200 p-4 rounded-xl shadow-lg">
                <p className="font-bold">Modo Convidado</p>
                <p className="text-sm">Você está em modo de teste. Faça o "Login com Google" para salvar seus aparelhos.</p>
              </div>
            )}

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