import React, { useRef, useEffect } from 'react';
import { ScriptVersion } from '../types';

interface VersionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    versions: ScriptVersion[];
    onLoadVersion: (result: string) => void;
    onDeleteVersion: (id: string) => void;
    onClearHistory: () => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
    isOpen,
    onClose,
    versions,
    onLoadVersion,
    onDeleteVersion,
    onClearHistory
}) => {
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

    const handleConfirmClear = () => {
        if (window.confirm('Are you sure you want to delete all saved versions? This action cannot be undone.')) {
            onClearHistory();
        }
    };
    
    const handleConfirmDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this version?')) {
            onDeleteVersion(id);
        }
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        <h2 id="history-modal-title" className="text-xl font-bold text-white">Script Version History</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-400 bg-zinc-700 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-red-500 transition-all"
                        aria-label="Close version history"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
                    </button>
                </header>
                <div className="flex-grow p-6 overflow-y-auto">
                    {versions.length > 0 ? (
                        <>
                            <div className="text-right mb-4">
                                <button
                                    onClick={handleConfirmClear}
                                    className="text-sm bg-red-600/80 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-red-500 transition-all"
                                >
                                    Clear All History
                                </button>
                            </div>
                            <ul className="space-y-4">
                                {versions.map((version) => (
                                    <li key={version.id} className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700 transition-all duration-200">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                            <div className="flex-grow">
                                                <p className="font-mono text-sm text-zinc-400 bg-zinc-700/50 p-2 rounded truncate" title={version.prompt}>
                                                    Prompt: {version.prompt || 'N/A'}
                                                </p>
                                                <div className="text-xs text-zinc-500 mt-2 flex items-center gap-4">
                                                     <span><strong>Task:</strong> {version.taskType}</span>
                                                     <span><strong>Language:</strong> {version.language}</span>
                                                     <span><strong>Saved:</strong> {new Date(version.savedAt).toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 flex items-center gap-2 w-full sm:w-auto">
                                                <button
                                                    onClick={() => onLoadVersion(version.result)}
                                                    className="w-1/2 sm:w-auto flex-grow justify-center flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-blue-500 transition-all"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M12 15v-6"/><path d="m9 12 3-3 3 3"/></svg>
                                                    Load
                                                </button>
                                                <button
                                                    onClick={() => handleConfirmDelete(version.id)}
                                                    className="w-1/2 sm:w-auto flex-grow justify-center flex items-center gap-2 bg-zinc-600 hover:bg-red-500/80 text-white font-semibold text-sm py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-red-500 transition-all"
                                                >
                                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                                     Delete
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-500 mb-4"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                            <p className="text-zinc-400">No script versions have been saved yet.</p>
                            <p className="text-sm text-zinc-500 mt-1">Generate a solution and click "Save Version" to store it here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};