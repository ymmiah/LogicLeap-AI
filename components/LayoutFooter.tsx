import React, { useState } from 'react';
import { GuideModal } from './GuideModal';

export const LayoutFooter: React.FC = () => {
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

    return (
        <>
            <footer className="w-full p-4 text-center border-t border-zinc-800">
                <div className="flex justify-center items-center gap-4 flex-wrap">
                    <p className="text-sm text-zinc-500">
                        © 2025 LogicLeap. All rights reserved. Powered by Google Gemini.
                    </p>
                    <span className="text-zinc-600 hidden sm:inline">|</span>
                    <button 
                        onClick={() => setIsGuideModalOpen(true)}
                        className="text-sm text-zinc-400 hover:text-white hover:underline focus:outline-none"
                        aria-label="Open application usage guide"
                    >
                        App Guide
                    </button>
                    <span className="text-zinc-600 hidden sm:inline">|</span>
                     <a 
                        href="https://github.com/ymmiah/LogicLeap-AI"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white hover:underline focus:outline-none"
                        aria-label="View source code on GitHub"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                        GitHub
                    </a>
                </div>
            </footer>
            <GuideModal isOpen={isGuideModalOpen} onClose={() => setIsGuideModalOpen(false)} />
        </>
    );
};