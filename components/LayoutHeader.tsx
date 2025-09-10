import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { ADVANCED_SCRIPTS, STORAGE_CLEANUP_SCRIPTS, SECURITY_SCRIPTS } from '../constants';

interface LayoutHeaderProps {
    onScriptSelect: (script: string, language: Language) => void;
    searchQuery: string;
}

interface ScriptMenuProps {
     onScriptSelect: (script: string, language: Language) => void;
    searchQuery: string;
}

const ScriptMenu: React.FC<ScriptMenuProps> = ({ onScriptSelect, searchQuery }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleScriptClick = (script: string, lang: Language) => {
        onScriptSelect(script, lang);
        setIsOpen(false);
    };
    
    // Fix: Corrected the type assertion for Object.entries.
    // Object.entries returns [string, value][] so we need to cast it through unknown to preserve the key type as Language.
    const languagesWithScripts = (Object.entries(ADVANCED_SCRIPTS) as unknown as [Language, { label: string; script: string }[]][])
        .map(([lang, scripts]) => {
            const filteredScripts = scripts.filter(script => 
                script.label.toLowerCase().includes(searchQuery.toLowerCase())
            );
            // Fix: Use 'as const' to ensure TypeScript infers a tuple type, not an array of a union of types, which resolves the error on line 87.
            return [lang, filteredScripts] as const;
        })
        .filter(([, scripts]) => scripts.length > 0);


    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-md bg-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <span>Quick Scripts</span>
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
            </button>
           
            <div className={`
                absolute right-0 mt-2 w-[48rem] max-w-[90vw] origin-top-right rounded-md bg-zinc-800/80 backdrop-blur-lg border border-zinc-700 shadow-lg ring-1 ring-black/5 focus:outline-none z-40 flex flex-col
                transition-all duration-200 ease-out
                ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                role="menu" aria-orientation="vertical" aria-labelledby="options-menu"
            >
                <div className="flex-shrink-0 p-3 border-b border-zinc-700 flex justify-between items-center">
                    <h3 id="options-menu" className="text-base font-semibold text-white">Quick Scripts Library</h3>
                     <button onClick={() => setIsOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-400 bg-zinc-700 hover:bg-zinc-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-blue-500 transition-all" aria-label="Close menu">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                    </button>
                </div>
                <div className="p-4 overflow-y-auto">
                    {languagesWithScripts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                            {languagesWithScripts.map(([lang, scripts]) => (
                                <div key={lang as string} className="space-y-2">
                                    <h3 className="font-semibold text-sm text-blue-400 border-b border-zinc-700 pb-1 mb-2">
                                        {lang as string}
                                    </h3>
                                    <ul className="space-y-1" role="none">
                                        {/* Fix: Removed unnecessary 'as any[]' cast as the type is now correctly inferred. */}
                                        {scripts.map((scriptItem) => (
                                            <li key={scriptItem.label}>
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleScriptClick(scriptItem.script, lang);
                                                    }}
                                                    className="block p-2 text-sm text-zinc-300 rounded-md hover:bg-blue-600/30 hover:text-white transition-colors"
                                                    role="menuitem"
                                                >
                                                    {scriptItem.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-8">
                            <p className="text-zinc-400">No quick scripts found for "{searchQuery}".</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface StorageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScriptSelect: (script: string, language: Language) => void;
    searchQuery: string;
}

const StorageModal: React.FC<StorageModalProps> = ({ isOpen, onClose, onScriptSelect, searchQuery }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }
    
    const filteredScripts = STORAGE_CLEANUP_SCRIPTS.filter(script => 
        script.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleScriptClick = (script: string, lang: Language) => {
        onScriptSelect(script, lang);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity duration-300"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div 
                ref={modalRef} 
                className="bg-zinc-800/80 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-zinc-700"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex-shrink-0 p-4 border-b border-zinc-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0-2 2v4h4v-4a2 2 0 0 0-2-2Z"/></svg>
                        <h2 id="storage-modal-title" className="text-xl font-bold text-white">Storage Cleanup Toolkit</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-400 bg-zinc-700 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-red-500 transition-all" 
                        aria-label="Close storage cleanup toolkit"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                    </button>
                </header>
                <div className="flex-grow p-6 overflow-y-auto">
                    {filteredScripts.length > 0 ? (
                        <ul className="space-y-4">
                            {filteredScripts.map((script) => (
                                <li key={script.label} className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700 hover:border-blue-500 hover:bg-zinc-700/50 transition-all duration-200 group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">{script.label}</h3>
                                            <p className="text-sm text-slate-400 mt-1">{script.description}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleScriptClick(script.script, script.language)}
                                            className="ml-4 flex-shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-blue-500 transition-all"
                                        >
                                            Use Script
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-16">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-500 mb-4"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <p className="text-zinc-400">No cleanup scripts found for "{searchQuery}".</p>
                            <p className="text-sm text-zinc-500 mt-1">Try a different search term.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface SecurityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScriptSelect: (script: string, language: Language) => void;
    searchQuery: string;
}

const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose, onScriptSelect, searchQuery }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }
    
    const filteredScripts = SECURITY_SCRIPTS.filter(script => 
        script.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleScriptClick = (script: string, lang: Language) => {
        onScriptSelect(script, lang);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity duration-300"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div 
                ref={modalRef} 
                className="bg-zinc-800/80 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-zinc-700"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex-shrink-0 p-4 border-b border-zinc-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        <h2 id="security-modal-title" className="text-xl font-bold text-white">Security Toolkit</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-400 bg-zinc-700 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-red-500 transition-all" 
                        aria-label="Close security toolkit"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                    </button>
                </header>
                <div className="flex-grow p-6 overflow-y-auto">
                    {filteredScripts.length > 0 ? (
                        <ul className="space-y-4">
                            {filteredScripts.map((script) => (
                                <li key={script.label} className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700 hover:border-purple-500 hover:bg-zinc-700/50 transition-all duration-200 group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-slate-200 group-hover:text-purple-400 transition-colors">{script.label}</h3>
                                            <p className="text-sm text-slate-400 mt-1">{script.description}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleScriptClick(script.script, script.language)}
                                            className="ml-4 flex-shrink-0 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-purple-500 transition-all"
                                        >
                                            Use Script
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-16">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-500 mb-4"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <p className="text-zinc-400">No security scripts found for "{searchQuery}".</p>
                            <p className="text-sm text-zinc-500 mt-1">Try a different search term.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const LayoutHeader: React.FC<LayoutHeaderProps> = ({ onScriptSelect, searchQuery }) => {
    const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);
    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

    return (
        <>
            <header className="w-full p-4 border-b border-zinc-800 bg-zinc-900/70 backdrop-blur-md sticky top-0 z-30">
                <div className="w-full max-w-7xl mx-auto flex justify-end items-center gap-4">
                     <button 
                        onClick={() => setIsSecurityModalOpen(true)}
                        className="flex items-center gap-2 rounded-md bg-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        <span>Security Toolkit</span>
                    </button>
                    <button 
                        onClick={() => setIsStorageModalOpen(true)}
                        className="flex items-center gap-2 rounded-md bg-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0-2 2v4h4v-4a2 2 0 0 0-2-2Z"/></svg>
                        <span>Storage Cleanup Toolkit</span>
                    </button>
                    <ScriptMenu onScriptSelect={onScriptSelect} searchQuery={searchQuery} />
                </div>
            </header>
            <StorageModal 
                isOpen={isStorageModalOpen} 
                onClose={() => setIsStorageModalOpen(false)} 
                onScriptSelect={onScriptSelect}
                searchQuery={searchQuery}
            />
             <SecurityModal 
                isOpen={isSecurityModalOpen} 
                onClose={() => setIsSecurityModalOpen(false)} 
                onScriptSelect={onScriptSelect}
                searchQuery={searchQuery}
            />
        </>
    );
};