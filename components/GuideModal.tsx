import React, { useEffect, useRef } from 'react';

interface GuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
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

    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="mb-6">
            <h3 className="text-xl font-bold text-blue-400 mb-2 border-b border-zinc-700 pb-1">{title}</h3>
            <div className="space-y-2 text-zinc-300">{children}</div>
        </div>
    );
    
    const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <li className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-zinc-500 mt-1"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            <span>{children}</span>
        </li>
    );

    const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <code className="bg-zinc-700 text-amber-400 px-1.5 py-0.5 rounded font-mono text-sm">{children}</code>
    );

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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                        <h2 id="guide-modal-title" className="text-xl font-bold text-white">Welcome to LogicLeap!</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-400 bg-zinc-700 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-red-500 transition-all" 
                        aria-label="Close guide"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                    </button>
                </header>
                <div className="flex-grow p-6 overflow-y-auto text-zinc-400">
                    <p className="mb-6 text-lg">This guide will walk you through LogicLeap's powerful features to help you master AI-assisted scripting and automation.</p>

                    <Section title="1. Your First Script: The Core Workflow">
                        <p>Getting started is simple. Just follow these three steps on the main screen:</p>
                        <ul className="list-none space-y-3 pl-2 mt-4">
                            <ListItem><strong>Set Your Goal:</strong> Use the <Code>I want to:</Code> dropdown to tell the AI what you need. Are you creating a new script, debugging broken code, or need a step-by-step guide?</ListItem>
                            <ListItem><strong>Define the Details:</strong> In the text box, describe your problem in plain English. For best results, be specific! Select your desired <Code>Target Language</Code> or let the AI auto-detect it.</ListItem>
                            <ListItem><strong>Generate:</strong> Hit the <Code>Generate Solution</Code> button and watch the AI build your response in real-time on the right-hand panel.</ListItem>
                        </ul>
                    </Section>

                    <Section title="2. A Picture is Worth a Thousand Lines of Code">
                        <p>Supercharge your requests by providing visual context. You can upload, drag-and-drop, or paste a screenshot directly into the input area.</p>
                        <ul className="list-none space-y-3 pl-2 mt-4">
                            <ListItem><strong>Debug Errors Faster:</strong> Screenshot a cryptic error message in your terminal. The AI will analyze the image alongside your code to pinpoint the issue.</ListItem>
                            <ListItem><strong>Analyze Non-Copyable Code:</strong> Stuck with code in a PDF, video, or presentation? Snap a picture of it and let the AI transcribe and explain it.</ListItem>
                            <ListItem><strong>Visualize Your Goal:</strong> Sketch a simple flowchart or diagram of your desired process. The AI can interpret the visual and generate the corresponding script logic.</ListItem>
                        </ul>
                    </Section>

                    <Section title="3. The Power User's Toolkits">
                        <p>Don't start from scratch! Access our curated script libraries from the header at the top of the page to solve common problems instantly:</p>
                        <ul className="list-none space-y-3 pl-2 mt-4">
                            <ListItem><strong>Quick Scripts:</strong> A dropdown menu of essential one-liners and common commands. Perfect for sysadmins who need to rename files in bulk or check a service status quickly.</ListItem>
                            <ListItem><strong>Storage Cleanup Toolkit:</strong> A powerful collection of scripts to free up disk space by clearing system caches (Windows Update, Docker, npm) and hunting down large files.</ListItem>
                            <ListItem><strong>Security Toolkit:</strong> An arsenal of ready-to-use scripts for security audits, like checking firewall status, auditing local admins, or finding insecure file permissions.</ListItem>
                        </ul>
                    </Section>

                    <Section title="4. Mastering the AI's Response">
                        <p>The generated solution on the right is more than just text. Every code block is an interactive component:</p>
                        <ul className="list-none space-y-3 pl-2 mt-4">
                            <ListItem><strong>Language Identification:</strong> The top of the code block confirms the detected language (e.g., <Code>powershell</Code>).</ListItem>
                            <ListItem><strong>One-Click Copy:</strong> Instantly copy the entire script to your clipboard.</ListItem>
                            <ListItem><strong>Instant Download:</strong> Save the script as a file with the correct extension (e.g., <Code>.ps1</Code>, <Code>.sh</Code>).</ListItem>
                            <ListItem><strong>Clear Explanations:</strong> Below the code, you'll always find a detailed breakdown of how the script works, including security notes and best practices.</ListItem>
                        </ul>
                    </Section>

                    <Section title="5. Pro-Tips for World-Class Results">
                         <ul className="list-none space-y-3 pl-2 mt-4">
                            <ListItem>
                                <strong>Be Specific, Get Specific:</strong> Instead of "script for files," try "Create a PowerShell script to find all `.log` files in `C:\Temp` larger than 10MB and move them to `C:\Archives`."
                            </ListItem>
                            <ListItem>
                                <strong>Provide Critical Context:</strong> Always mention your operating system (e.g., Windows 11, Ubuntu 22.04), relevant software versions, and what you've already attempted.
                            </ListItem>
                            <ListItem>
                                <strong>Combine Your Inputs:</strong> The best debugging happens when you **paste your script into the text box** AND **upload a screenshot of the error message**. This gives the AI the complete picture to solve your problem efficiently.
                            </ListItem>
                        </ul>
                    </Section>
                </div>
            </div>
        </div>
    );
};