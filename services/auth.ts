import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Importa o 'auth' que você configurou

// Cria um provedor Google
const provider = new GoogleAuthProvider();

/**
 * Função para fazer login com o Google
 */
export const signInWithGoogle = async () => {
  try {
    // Abre o Pop-up do Google
    const result = await signInWithPopup(auth, provider);
    
    // Pega o usuário logado
    const user = result.user;
    console.log("Usuário logado:", user);
    return user;

  } catch (error) {
    // Trata erros
    console.error("Erro no login com Google:", error);
    return null;
  }
};

/**
 * Função para fazer logout
 */
export const signOutUser = async () => {
  try {
    await auth.signOut();
    console.log("Usuário deslogado");
  } catch (error) {
    console.error("Erro ao deslogar:", error);
  }
};