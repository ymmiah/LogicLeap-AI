import React from 'react';
import { TaskType, Language } from '../types';
import { EXAMPLE_PROMPTS } from '../constants';

interface ExamplePromptsProps {
    taskType: TaskType;
    onExampleClick: (text: string, language: Language) => void;
    searchQuery: string;
}

export const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ taskType, onExampleClick, searchQuery }) => {
    const examples = EXAMPLE_PROMPTS[taskType] || [];
    
    const filteredExamples = searchQuery
        ? examples.filter(example => example.text.toLowerCase().includes(searchQuery.toLowerCase()))
        : examples;

    if (examples.length === 0) {
        return null;
    }

    return (
        <div className="mt-2">
            <h3 className="text-sm font-semibold text-zinc-400 mb-2">Examples:</h3>
            {filteredExamples.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {filteredExamples.map((example, index) => (
                        <button
                            key={index}
                            onClick={() => onExampleClick(example.text, example.language)}
                            className="text-left text-xs bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors duration-200"
                            aria-label={`Use example prompt: ${example.text}`}
                        >
                            {example.text}
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-zinc-500 italic">No examples found for "{searchQuery}".</p>
            )}
        </div>
    );
};