import { GoogleGenAI, Part } from "@google/genai";
import { 
    PROMPT_BASE, 
    PROMPT_STEP_BY_STEP_STRUCTURE, 
    PROMPT_SCRIPT_BLOCK_STRUCTURE,
    PROMPT_USER_REQUEST_SUFFIX
} from '../constants';
import { Language } from "../types";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateScriptSolutionStream = async (
    taskType: string,
    outputLanguage: string,
    userInput: string,
    onStream: (chunk: string) => void,
    imagePart?: Part
): Promise<void> => {
    
    const languageInstruction = outputLanguage === Language.AUTO
        ? "Auto-detect the most suitable language based on the user's request. Ensure the code block includes the correct language identifier (e.g., ```powershell)."
        : outputLanguage;

    let promptBody = '';
    // The task label for step-by-step is "Give solution step by step"
    if (taskType === 'Give solution step by step') {
        promptBody = PROMPT_STEP_BY_STEP_STRUCTURE;
    } else {
        promptBody = PROMPT_SCRIPT_BLOCK_STRUCTURE;
    }

    let finalPrompt = PROMPT_BASE + promptBody + PROMPT_USER_REQUEST_SUFFIX;

    finalPrompt = finalPrompt
        .replace('{task_type}', taskType)
        .replace('{output_language}', languageInstruction)
        .replace('{user_input}', userInput || 'No text prompt provided.'); // Handle empty user input when image is present

    try {
        const contents = imagePart
            ? { parts: [{ text: finalPrompt }, imagePart] }
            : finalPrompt;
        
        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: contents,
        });
        
        for await (const chunk of responseStream) {
            onStream(chunk.text);
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get a response from the AI. Please check the console for more details.");
    }
};