import { Part } from "@google/genai";

/**
 * Converts a File object to a GoogleGenAI.Part object for use in multimodal prompts.
 * @param file The image file to convert.
 * @returns A Promise that resolves with the Part object.
 */
export const fileToGenerativePart = (file: File): Promise<Part> => {
    return new Promise((resolve, reject) => {
        // Ensure the file is an image
        if (!file.type.startsWith('image/')) {
            return reject(new Error("Invalid file type. Only images are supported."));
        }

        const reader = new FileReader();
        
        reader.onload = () => {
            const base64Data = (reader.result as string).split(',')[1];
            if (base64Data) {
                resolve({
                    inlineData: {
                        data: base64Data,
                        mimeType: file.type,
                    },
                });
            } else {
                reject(new Error("Failed to read file data. The file might be empty or corrupted."));
            }
        };
        
        reader.onerror = (error) => {
            reject(new Error(`File could not be read: ${error}`));
        };

        reader.readAsDataURL(file);
    });
};