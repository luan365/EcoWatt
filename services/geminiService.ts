
import { GoogleGenAI } from "@google/genai";
import { Appliance } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEnergySavingTips = async (appliances: Appliance[], tariff: number): Promise<string> => {
  if (appliances.length === 0) {
    return "Por favor, adicione alguns eletrodomésticos primeiro para obter dicas personalizadas.";
  }

  const applianceList = appliances.map(a => `- ${a.name}: ${a.power}W, usado por ${a.dailyUsage} horas/dia`).join('\n');

  const prompt = `
    Você é um especialista em eficiência energética para residências brasileiras. Seu tom é encorajador, positivo e prestativo.
    Com base na lista de eletrodomésticos e seu uso diário a seguir, forneça 3 dicas personalizadas, práticas e fáceis de implementar para reduzir o consumo de eletricidade.
    Para cada dica, explique brevemente o impacto potencial de forma simples. A tarifa de eletricidade do usuário é de R$${tariff.toFixed(2)}/kWh.
    A resposta deve ser formatada como uma lista markdown. Não use cabeçalhos.

    Eletrodomésticos:
    ${applianceList}
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating tips from Gemini API:", error);
    return "Desculpe, não consegui gerar as dicas no momento. Por favor, verifique sua chave de API ou tente novamente mais tarde.";
  }
};
