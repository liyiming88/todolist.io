import { GoogleGenAI, Type } from "@google/genai";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a list of actionable subtasks based on a high-level goal using Gemini 2.5 Flash.
 * @param goal The high-level goal (e.g., "Plan a birthday party")
 * @returns An array of string tasks
 */
export const generateTasksFromGoal = async (goal: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Break down the following goal into a list of 3 to 6 concise, actionable todo list items. Keep them short and direct. Goal: "${goal}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        },
        // Low temperature for more deterministic, practical lists
        temperature: 0.3,
      },
    });

    if (response.text) {
      const tasks = JSON.parse(response.text);
      if (Array.isArray(tasks)) {
        return tasks;
      }
    }
    
    return [];
  } catch (error) {
    console.error("Error in generateTasksFromGoal:", error);
    if (error && typeof error === 'object') {
      console.error("Error properties:", Object.keys(error));
      if ('message' in error) {
        console.error("Error message:", (error as Error).message);
      }
    }
    console.error("Error generating tasks:", error);
    throw error;
  }
};