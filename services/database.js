import { db } from "../firebaseConfig.js"; // Importa o 'db' que acabamos de configurar
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * Salva a lista de aparelhos de um usuário no Firestore.
 * @param {string} userId - O ID do usuário (vem do auth)
 * @param {Array} appliances - A lista de aparelhos do estado do React
 */
export const saveAppliances = async (userId, appliances) => {
  if (!userId) return; // Não faz nada se não tiver ID de usuário

  try {
    // Cria uma referência para um documento específico
    // O nome do documento será o ID do usuário
    const userDocRef = doc(db, "appliances", userId);
    
    // Salva a lista inteira dentro de um objeto
    // Usamos 'setDoc' para sobrescrever o documento antigo
    await setDoc(userDocRef, { list: appliances });
    
  } catch (error) {
    console.error("Erro ao salvar aparelhos:", error);
  }
};

/**
 * Carrega a lista de aparelhos de um usuário do Firestore.
 * @param {string} userId - O ID do usuário (vem do auth)
 * @returns {Array} - A lista de aparelhos salva, ou um array vazio.
 */
export const loadAppliances = async (userId) => {
  if (!userId) return []; // Retorna lista vazia se não tiver ID

  try {
    // Pega a referência do documento do usuário
    const userDocRef = doc(db, "appliances", userId);
    
    // Tenta ler o documento
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      // Se o documento existir, retorna a 'list' de dentro dele
      return docSnap.data().list;
    } else {
      // Se não existir (primeiro login), retorna lista vazia
      return [];
    }

  } catch (error) {
    console.error("Erro ao carregar aparelhos:", error);
    return []; // Retorna vazio em caso de erro
  }
};