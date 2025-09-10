import React, { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        marked: {
            parse(markdown: string): string;
        };
        hljs: {
            highlightAll(): void;
            highlightElement(element: HTMLElement): void;
        };
    }
}

interface ResultProps {
    isLoading: boolean;
    result: string;
    onSaveVersion: () => void;
    onOpenHistory: () => void;
}

export const Result: React.FC<ResultProps> = ({ isLoading, result, onSaveVersion, onOpenHistory }) => {
    const resultRef = useRef<HTMLDivElement>(null);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

    const handleSaveClick = () => {
        onSaveVersion();
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
    };

    // Reset save status if result changes
    useEffect(() => {
        setSaveStatus('idle');
    }, [result]);

    useEffect(() => {
        if (resultRef.current) {
            // 1. Parse Markdown and update DOM
            const parsedHtml = window.marked.parse(result);
            resultRef.current.innerHTML = parsedHtml;

            // 2. Apply general styling
            resultRef.current.querySelectorAll('code:not(pre code)').forEach(el => {
                el.className = 'bg-zinc-700 text-amber-400 px-1.5 py-0.5 rounded font-mono text-sm';
            });
            resultRef.current.querySelectorAll('h3').forEach(el => {
                el.className = 'text-2xl font-bold text-zinc-200 mt-6 mb-3 border-b-2 border-zinc-700 pb-2';
            });
            resultRef.current.querySelectorAll('ul').forEach(el => {
                el.className = 'list-disc list-inside space-y-2 text-zinc-400';
            });
            resultRef.current.querySelectorAll('p').forEach(el => {
                 if (el.textContent?.startsWith('⚠️')) {
                    el.className = 'mb-4 text-zinc-300 bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-lg';
                } else {
                    el.className = 'mb-4 text-zinc-400 leading-relaxed';
                }
            });

            // 3. Enhance code blocks
            resultRef.current.querySelectorAll('pre').forEach(preEl => {
                if (preEl.parentElement?.classList.contains('code-block-wrapper')) {
                    return; // Already processed
                }
                
                const codeEl = preEl.querySelector('code');
                if (codeEl) {
                    // --- Language remapping for highlight.js ---
                    const langRemap: Record<string, string> = { 'language-vba': 'language-vbscript', 'language-shell': 'language-bash' };
                    Object.keys(langRemap).forEach(key => {
                        if (codeEl.classList.contains(key)) {
                            codeEl.classList.remove(key);
                            codeEl.classList.add(langRemap[key]);
                        }
                    });
                    
                    window.hljs.highlightElement(codeEl as HTMLElement);

                    // --- Create a new wrapper structure ---
                    const wrapper = document.createElement('div');
                    wrapper.className = 'code-block-wrapper bg-zinc-900/70 rounded-lg border border-zinc-700 my-4 shadow-lg';

                    // --- Create Title Bar ---
                    const titleBar = document.createElement('div');
                    titleBar.className = 'flex justify-between items-center px-4 py-1.5 border-b border-zinc-700';
                    
                    const langClass = Array.from(codeEl.classList).find(c => c.startsWith('language-')) || 'language-txt';
                    const lang = langClass.replace('language-', '');
                    const langName = document.createElement('span');
                    langName.className = 'text-xs font-sans font-semibold text-zinc-400 select-none tracking-wider uppercase';
                    langName.textContent = lang;

                    const buttonContainer = document.createElement('div');
                    buttonContainer.className = 'flex items-center gap-1';
                    
                    // --- Download Button ---
                    const downloadButton = document.createElement('button');
                    downloadButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
                    downloadButton.className = 'p-1.5 rounded-md hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors';
                    downloadButton.title = 'Download script file';
                    
                    const getFileExtension = (lang: string): string => ({
                        powershell: 'ps1', bash: 'sh', shell: 'sh', cmd: 'bat', batch: 'bat',
                        vba: 'vbs', vbscript: 'vbs', python: 'py', sql: 'sql', ruby: 'rb', go: 'go'
                    }[lang.toLowerCase()] || 'txt');

                    downloadButton.addEventListener('click', () => {
                        const codeContent = codeEl.textContent || '';
                        const extension = getFileExtension(lang);
                        const blob = new Blob([codeContent], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `script.${extension}`;
                        a.click();
                        URL.revokeObjectURL(url);
                    });

                    // --- Copy Button ---
                    const copyButton = document.createElement('button');
                    copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="check-icon hidden"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                    copyButton.className = 'p-1.5 rounded-md hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors';
                    copyButton.title = 'Copy code to clipboard';
                    
                    copyButton.addEventListener('click', () => {
                        navigator.clipboard.writeText(codeEl.textContent || '').then(() => {
                            copyButton.querySelector('.copy-icon')?.classList.add('hidden');
                            copyButton.querySelector('.check-icon')?.classList.remove('hidden');
                            setTimeout(() => {
                                copyButton.querySelector('.copy-icon')?.classList.remove('hidden');
                                copyButton.querySelector('.check-icon')?.classList.add('hidden');
                            }, 2000);
                        });
                    });

                    buttonContainer.appendChild(downloadButton);
                    buttonContainer.appendChild(copyButton);
                    titleBar.appendChild(langName);
                    titleBar.appendChild(buttonContainer);
                    
                    // --- Assemble and replace ---
                    preEl.className = 'overflow-x-auto p-4 font-mono text-sm';
                    wrapper.appendChild(titleBar);
                    preEl.parentNode?.insertBefore(wrapper, preEl);
                    wrapper.appendChild(preEl);
                }
            });

            // 4. Handle blinking cursor for streaming
            const existingCursor = resultRef.current.querySelector('.blinking-cursor');
            if (existingCursor) existingCursor.remove();

            if (isLoading && result) {
                const cursor = document.createElement('span');
                cursor.className = 'blinking-cursor text-blue-400 ml-1 text-2xl';
                cursor.innerHTML = '▋';
                const lastElement = resultRef.current.lastElementChild;
                if(lastElement) {
                   // If last element is a code block wrapper, append inside the code tag for correct positioning
                   const codeWrapper = lastElement.querySelector('pre > code');
                   if (codeWrapper) {
                       codeWrapper.appendChild(cursor);
                   } else {
                       lastElement.appendChild(cursor);
                   }
                } else {
                    resultRef.current.appendChild(cursor);
                }
            }
        }
    }, [result, isLoading]);


    const renderPlaceholder = () => (
         <div className="flex flex-col items-center justify-center h-full text-center text-zinc-600 p-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 mb-4"><path d="M10 10.5 8 12l2 1.5"/><path d="M14 10.5 16 12l-2 1.5"/><path d="M20 18.5c.34.34.5.77.5 1.25a2.5 2.5 0 0 1-5 0c0-.48.16-.91.5-1.25"/><path d="M13.5 3.5c-.34-.34-.5-.77-.5-1.25a2.5 2.5 0 0 1 5 0c0 .48-.16.91-.5 1.25"/><path d="m4.2 4.2 1.4 1.4"/><path d="M18.4 18.4 17 17"/><path d="m4.2 19.8 1.4-1.4"/><path d="m17 7 1.4-1.4"/><circle cx="12" cy="12" r="10"/></svg>
            <h3 className="text-xl font-semibold text-zinc-400">AI Output</h3>
            <p className="max-w-xs mt-1 text-zinc-500">
                Your generated solution will appear here.
            </p>
        </div>
    );
    
    const renderLoadingState = () => (
         <div className="p-6 space-y-6 animate-pulse">
            <div className="h-7 w-1/3 bg-zinc-700/50 rounded"></div>
            <div className="space-y-3">
                <div className="h-4 bg-zinc-700/50 rounded"></div>
                <div className="h-4 w-5/6 bg-zinc-700/50 rounded"></div>
            </div>
            <div className="bg-zinc-900/50 rounded-lg border border-zinc-700/50">
                <div className="h-9 bg-zinc-700/50 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                     <div className="h-4 w-4/5 bg-zinc-700/50 rounded"></div>
                     <div className="h-4 w-3/4 bg-zinc-700/50 rounded"></div>
                     <div className="h-4 w-4/6 bg-zinc-700/50 rounded"></div>
                </div>
            </div>
            <div className="h-4 w-1/2 bg-zinc-700/50 rounded"></div>
        </div>
    );

    return (
        <div className="h-full w-full overflow-hidden flex flex-col">
            <div className="flex-shrink-0 p-4 border-b border-zinc-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-zinc-300">Generated Solution</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSaveClick}
                        disabled={isLoading || !result.trim() || saveStatus === 'saved'}
                        className="flex items-center gap-2 text-sm bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-md hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        title="Save the current script version"
                    >
                        {saveStatus === 'saved' ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                <span>Saved!</span>
                            </>
                        ) : (
                            <>
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                                <span>Save Version</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={onOpenHistory}
                        className="flex items-center gap-2 text-sm bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-md hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        title="View saved script versions"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        <span>History</span>
                    </button>
                </div>
            </div>
            <div className="overflow-y-auto flex-grow">
                {isLoading && !result && renderLoadingState()}
                {!isLoading && !result && renderPlaceholder()}
                <div ref={resultRef} className="p-6"></div>
            </div>
        </div>
    );
};