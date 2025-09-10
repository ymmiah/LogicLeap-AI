import React from 'react';
import { SearchSuggestion, Language } from '../types';
import { LANGUAGE_OPTIONS } from '../constants';

interface HeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    suggestions: SearchSuggestion[];
    onSuggestionClick: (suggestion: SearchSuggestion) => void;
    filterType: string;
    setFilterType: (type: string) => void;
    filterLanguage: string;
    setFilterLanguage: (lang: Language | string) => void;
}

const typeColorMap = {
    'Example': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    'Quick Script': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'Cleanup Script': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Security Script': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
};

export const Header: React.FC<HeaderProps> = ({ 
    searchQuery, setSearchQuery, suggestions, onSuggestionClick,
    filterType, setFilterType, filterLanguage, setFilterLanguage 
}) => (
    <div className="text-center mb-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-100 mb-2 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block h-10 w-10 -mt-1 mr-2 text-blue-500">
                <path d="M4 20v-8a4 4 0 0 1 4-4h12" />
                <path d="m16 4 4 4-4 4" />
            </svg>
            LogicLeap
        </h1>
        <p className="text-lg text-zinc-400 mb-6">
            Tech Simplified, Results Amplified
        </p>
        <div className="max-w-xl mx-auto">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <input
                    type="search"
                    placeholder="Search examples and quick scripts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 pl-10 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-zinc-700 transition-all text-white placeholder-zinc-500"
                    aria-label="Search examples and quick scripts"
                    autoComplete="off"
                />
                {suggestions.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-zinc-800/80 backdrop-blur-lg border border-zinc-700 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
                        <ul className="divide-y divide-zinc-700">
                            {suggestions.map((suggestion, index) => (
                                <li key={`${suggestion.label}-${index}`}>
                                    <button
                                        onClick={() => onSuggestionClick(suggestion)}
                                        className="w-full text-left p-3 hover:bg-blue-600/20 transition-colors duration-150 flex items-center gap-3"
                                    >
                                        <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full border ${typeColorMap[suggestion.type]}`}>
                                            {suggestion.type}
                                        </span>
                                        <span className="text-zinc-200 truncate">{suggestion.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3 text-left">
                <div>
                    <label htmlFor="filter-type" className="text-xs font-semibold text-zinc-400 mb-1 block">Filter by Type</label>
                    <div className="relative">
                        <select 
                            id="filter-type"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-zinc-200 text-sm appearance-none pr-8"
                        >
                            <option value="all">All Types</option>
                            {Object.keys(typeColorMap).map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="filter-language" className="text-xs font-semibold text-zinc-400 mb-1 block">Filter by Language</label>
                    <div className="relative">
                        <select
                            id="filter-language"
                            value={filterLanguage}
                            onChange={(e) => setFilterLanguage(e.target.value)}
                            className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-zinc-200 text-sm appearance-none pr-8"
                        >
                            <option value="all">All Languages</option>
                            {LANGUAGE_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);