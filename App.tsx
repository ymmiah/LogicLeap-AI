import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { UserInput } from './components/UserInput';
import { Result } from './components/Result';
import { ExamplePrompts } from './components/ExamplePrompts';
import { LayoutHeader } from './components/LayoutHeader';
import { LayoutFooter } from './components/LayoutFooter';
import { VersionHistoryModal } from './components/VersionHistoryModal';
import { generateScriptSolutionStream } from './services/geminiService';
import { fileToGenerativePart } from './services/imageUtils';
import { TaskType, Language, SearchSuggestion, ScriptVersion } from './types';
import { TASK_OPTIONS, LANGUAGE_OPTIONS, EXAMPLE_PROMPTS, ADVANCED_SCRIPTS, STORAGE_CLEANUP_SCRIPTS, SECURITY_SCRIPTS } from './constants';
import { Part } from '@google/genai';

const App: React.FC = () => {
    const [taskType, setTaskType] = useState<TaskType>(TASK_OPTIONS[0].value);
    const [language, setLanguage] = useState<Language>(LANGUAGE_OPTIONS[0].value);
    const [userInput, setUserInput] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [result, setResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterLanguage, setFilterLanguage] = useState<Language | string>('all');
    const [scriptVersions, setScriptVersions] = useState<ScriptVersion[]>([]);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);

    useEffect(() => {
        try {
            const storedVersions = localStorage.getItem('logicLeapScriptVersions');
            if (storedVersions) {
                setScriptVersions(JSON.parse(storedVersions));
            }
        } catch (error) {
            console.error("Failed to load script versions from localStorage", error);
            setScriptVersions([]); // Reset to empty array on error
        }
    }, []);

    const allSearchableItems = useMemo((): SearchSuggestion[] => {
        const items: SearchSuggestion[] = [];
        const seen = new Set<string>();

        const addItem = (item: Omit<SearchSuggestion, 'label'> & { label: string }) => {
            if (!seen.has(item.label.toLowerCase())) {
                items.push(item);
                seen.add(item.label.toLowerCase());
            }
        };

        // 1. Process Example Prompts
        Object.values(EXAMPLE_PROMPTS).flat().forEach(prompt => {
            addItem({
                label: prompt.text,
                text: prompt.text,
                language: prompt.language,
                type: 'Example'
            });
        });

        // 2. Process Advanced Scripts
        (Object.entries(ADVANCED_SCRIPTS) as [Language, { label: string; script: string }[]][]).forEach(([lang, scripts]) => {
            if (lang === Language.AUTO) return;
            scripts.forEach(script => {
                addItem({
                    label: script.label,
                    text: script.script,
                    language: lang,
                    type: 'Quick Script'
                });
            });
        });

        // 3. Process Storage Cleanup Scripts
        STORAGE_CLEANUP_SCRIPTS.forEach(script => {
            addItem({
                label: script.label,
                text: script.script,
                language: script.language,
                type: 'Cleanup Script'
            });
        });

        // 4. Process Security Scripts
        SECURITY_SCRIPTS.forEach(script => {
            addItem({
                label: script.label,
                text: script.script,
                language: script.language,
                type: 'Security Script'
            });
        });
        
        return items;
    }, []);

    const suggestions = useMemo((): SearchSuggestion[] => {
        if (searchQuery.length < 2) {
            return [];
        }
        const lowerCaseQuery = searchQuery.toLowerCase();
        return allSearchableItems
            .filter(item => {
                const typeMatch = filterType === 'all' || item.type === filterType;
                const langMatch = filterLanguage === 'all' || item.language === filterLanguage;
                const queryMatch = item.label.toLowerCase().includes(lowerCaseQuery);
                return typeMatch && langMatch && queryMatch;
            })
            .slice(0, 8);
    }, [searchQuery, allSearchableItems, filterType, filterLanguage]);

    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
        setUserInput(suggestion.text);
        setLanguage(suggestion.language);
        if (suggestion.type === 'Quick Script' || suggestion.type === 'Cleanup Script' || suggestion.type === 'Security Script') {
            setTaskType(TaskType.EXPLAIN);
        }
        setSearchQuery(''); 
        setImageFile(null);
    };
    
    const handleImageChange = useCallback((file: File | null) => {
        setError(null);
        setResult('');
        setImageFile(file);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!userInput.trim() && !imageFile) {
            setError('Please describe your problem, provide a script, or upload an image.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult('');

        try {
            const taskLabel = TASK_OPTIONS.find(opt => opt.value === taskType)?.label || 'Generate';
            const langLabel = LANGUAGE_OPTIONS.find(opt => opt.value === language)?.label || 'PowerShell';

            let imagePart: Part | undefined = undefined;
            if (imageFile) {
                imagePart = await fileToGenerativePart(imageFile);
            }

            await generateScriptSolutionStream(taskLabel, langLabel, userInput, (chunk) => {
                setResult(prev => prev + chunk);
            }, imagePart);

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(`An error occurred: ${err.message}`);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [userInput, imageFile, taskType, language]);
    
    const handleExampleClick = (text: string, lang: Language) => {
        setUserInput(text);
        setLanguage(lang);
        setImageFile(null);
    };

    const handleScriptSelect = useCallback((script: string, lang: Language) => {
        setUserInput(script);
        setLanguage(lang);
        setTaskType(TaskType.EXPLAIN); // Default to explaining the script
        setImageFile(null);
    }, []);
    
    const getButtonText = () => {
        if (isLoading) return 'Generating...';
        return 'Generate Solution';
    }

    const handleSaveVersion = useCallback(() => {
        if (!result.trim()) return;

        const newVersion: ScriptVersion = {
            id: `version-${Date.now()}`,
            prompt: userInput,
            taskType,
            language,
            result,
            savedAt: new Date().toISOString(),
        };

        setScriptVersions(prevVersions => {
            const updatedVersions = [newVersion, ...prevVersions];
            localStorage.setItem('logicLeapScriptVersions', JSON.stringify(updatedVersions));
            return updatedVersions;
        });
    }, [result, userInput, taskType, language]);

    const handleLoadVersion = useCallback((versionResult: string) => {
        setResult(versionResult);
        setIsHistoryModalOpen(false);
    }, []);

    const handleDeleteVersion = useCallback((versionId: string) => {
        setScriptVersions(prevVersions => {
            const updatedVersions = prevVersions.filter(v => v.id !== versionId);
            localStorage.setItem('logicLeapScriptVersions', JSON.stringify(updatedVersions));
            return updatedVersions;
        });
    }, []);

    const handleClearHistory = useCallback(() => {
        setScriptVersions([]);
        localStorage.removeItem('logicLeapScriptVersions');
    }, []);

    return (
        <div className="min-h-screen w-full flex flex-col bg-zinc-900 text-zinc-200">
            <LayoutHeader onScriptSelect={handleScriptSelect} searchQuery={searchQuery} />
            <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-grow flex flex-col">
                <Header 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery}
                    suggestions={suggestions}
                    onSuggestionClick={handleSuggestionClick}
                    filterType={filterType}
                    setFilterType={setFilterType}
                    filterLanguage={filterLanguage}
                    setFilterLanguage={setFilterLanguage}
                />
                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6 flex-grow">
                    {/* Left Panel: Controls */}
                    <div className="bg-zinc-800/50 border border-zinc-700 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex flex-col gap-6">
                        <Controls
                            taskType={taskType}
                            setTaskType={setTaskType}
                            language={language}
                            setLanguage={setLanguage}
                        />
                        <UserInput 
                            userInput={userInput} 
                            setUserInput={setUserInput}
                            imageFile={imageFile}
                            onImageChange={handleImageChange}
                            isLoading={isLoading}
                        />
                        <ExamplePrompts taskType={taskType} onExampleClick={handleExampleClick} searchQuery={searchQuery} />
                        <div>
                             <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                                )}
                                <span>{getButtonText()}</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Panel: Output */}
                    <div className="bg-zinc-800/50 border border-zinc-700 backdrop-blur-sm rounded-2xl shadow-lg relative min-h-[300px] lg:min-h-0">
                         {error && <p className="absolute top-4 left-4 right-4 z-10 text-center text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">{error}</p>}
                         <Result
                            isLoading={isLoading}
                            result={result}
                            onSaveVersion={handleSaveVersion}
                            onOpenHistory={() => setIsHistoryModalOpen(true)}
                        />
                    </div>
                </main>
            </div>
            <LayoutFooter />
            <VersionHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                versions={scriptVersions}
                onLoadVersion={handleLoadVersion}
                onDeleteVersion={handleDeleteVersion}
                onClearHistory={handleClearHistory}
            />
        </div>
    );
};

export default App;