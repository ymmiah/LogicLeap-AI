import React from 'react';
import { TaskType, Language } from '../types';
import { TASK_OPTIONS, LANGUAGE_OPTIONS } from '../constants';

interface ControlsProps {
    taskType: TaskType;
    setTaskType: (value: TaskType) => void;
    language: Language;
    setLanguage: (value: Language) => void;
}

export const Controls: React.FC<ControlsProps> = ({
    taskType,
    setTaskType,
    language,
    setLanguage
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
                <label htmlFor="task_type" className="block font-semibold text-zinc-300 mb-2">I want to:</label>
                 <div className="relative">
                    <select 
                        id="task_type" 
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value as TaskType)}
                        className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-zinc-100 appearance-none pr-10"
                    >
                        {TASK_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="output_language" className="block font-semibold text-zinc-300 mb-2">Target Language:</label>
                <div className="relative">
                    <select 
                        id="output_language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-zinc-100 appearance-none pr-10"
                    >
                        {LANGUAGE_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                </div>
            </div>
        </div>
    );
};