import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously 
} from "firebase/auth";

// AQUI ESTAVA O ERRO: Faltava o '.js' no final
import { auth } from "../firebaseConfig.js"; 

// --- Login com Google (você já tem) ---
const provider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Usuário logado:", user);
    return user;
  } catch (error) {
    console.error("Erro no login com Google:", error);
    return null;
  }
};

// --- ADICIONE ESTA NOVA FUNÇÃO ---
/**
 * Função para fazer login anônimo (convidado)
 */
export const signInAnonymouslyUser = async () => {
  try {
    // Chama a função do Firebase
    const result = await signInAnonymously(auth);
    const user = result.user;
    console.log("Usuário anônimo logado:", user);
    return user;
  } catch (error) {
    console.error("Erro no login anônimo:", error);
    return null;
  }
};
// --- FIM DA NOVA FUNÇÃO ---

// --- Logout (você já tem) ---
export const signOutUser = async () => {
  try {
    await auth.signOut();
    console.log("Usuário deslogado");
  } catch (error) {
    console.error("Erro ao deslogar:", error);
  }
};