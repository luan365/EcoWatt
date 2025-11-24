import { GoogleGenAI } from "@google/genai";
import type { Appliance } from '../types';

export const getEnergySavingTips = async (appliances: Appliance[], tariff: number, apiKey: string): Promise<string> => {
  if (appliances.length === 0) {
    return "Por favor, adicione alguns eletrodomésticos primeiro para obter dicas personalizadas.";
  }

  const ai = new GoogleGenAI({ apiKey });

  const applianceList = appliances
    .map(a => `- ${a.name}: ${a.power}W, usado por ${a.dailyUsage} horas/dia`)
    .join('\n');

  const prompt = `
    Você é um especialista em eficiência energética e deve gerar uma dica personalizada para cada aparelho fornecido.
    para o usuário reduzir o consumo de energia com base nos dados fornecidos.

    Contexto:
    Tarifa: R$${tariff.toFixed(2)}/kWh
    Eletrodomésticos:
    ${applianceList}



    Formato de saída (siga exatamente):
    1. A primeira linha deve ser: "Aqui estão dicas personalizadas para ajudar a reduzir seu consumo de energia:"
    2. Para cada eletrodoméstico listado, gere UMA dica específica para aquele aparelho, seguindo esta estrutura:
    ─────────────────────────────────
    [EMOJI relacionado ao aparelho] DICA [NOME DO APARELHO]: [título curto e direto]
    Em até 3 tópicos, cada um começando com "• ", escreva orientações práticas e claras para o uso eficiente desse aparelho. Cada tópico deve estar em uma linha separada.
    **Economia estimada: R$X–R$Y/mês**
    ─────────────────────────────────
    3. Após as dicas específicas, gere UMA dica geral para toda a casa, seguindo a mesma estrutura:
    ─────────────────────────────────
    🏠 DICA GERAL: [título curto e direto]
    Em até 3 tópicos, cada um começando com "• ", escreva orientações práticas e claras para economia de energia na casa toda. Cada tópico deve estar em uma linha separada.
    **Economia estimada: R$X–R$Y/mês**
    ─────────────────────────────────

    Regras de formatação:
    - NÃO use *asteriscos*, # ou -.
    - NÃO use • nas barras divisórias
    - Os títulos (DICA 1, 2, 3) devem estar em MAIÚSCULAS.
    - Cada seção deve ser separada apenas pelas barras “─────────────────────────────────”.
    - Se for a última sessão não adicione a barra divisória.
    - O texto deve ser limpo, simétrico e legível em um componente de interface escura.
    - O tom é profissional, direto e encorajador, sem exageros.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating tips from Gemini API:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
      return "A chave da API fornecida não é válida. Por favor, verifique e tente novamente.";
    }
    return "Desculpe, não consegui gerar as dicas no momento. Tente novamente mais tarde.";
  }
};
