import React, { useState } from 'react';
import { GuideModal } from './GuideModal';

export const LayoutFooter: React.FC = () => {
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

    return (
        <>
            <footer className="w-full p-4 text-center border-t border-zinc-800">
                <div className="flex justify-center items-center gap-4">
                    <p className="text-sm text-zinc-500">
                        © 2025 LogicLeap. All rights reserved. Powered by Google Gemini.
                    </p>
                    <span className="text-zinc-600">|</span>
                    <button 
                        onClick={() => setIsGuideModalOpen(true)}
                        className="text-sm text-zinc-400 hover:text-white hover:underline focus:outline-none"
                        aria-label="Open application usage guide"
                    >
                        App Guide
                    </button>
                </div>
            </footer>
            <GuideModal isOpen={isGuideModalOpen} onClose={() => setIsGuideModalOpen(false)} />
        </>
    );
};