export enum TaskType {
    GENERATE = 'Generate',
    EXPLAIN = 'Explain',
    TRANSLATE = 'Translate',
    DEBUG = 'Debug',
    CODE_REVIEW = 'Code Review',
    SECURITY = 'Security',
    STEP_BY_STEP = 'Step by step'
}

export enum Language {
    AUTO = 'Auto-detect by AI',
    POWERSHELL = 'PowerShell',
    BASH = 'Bash (for WSL)',
    CMD = 'CMD Batch',
    VBA = 'VBA',
    PYTHON = 'Python',
    SQL = 'SQL',
    RUBY = 'Ruby',
    GO = 'Go'
}

export interface SearchSuggestion {
    label: string;
    text: string;
    language: Language;
    type: 'Example' | 'Quick Script' | 'Cleanup Script' | 'Security Script';
}

export interface ScriptVersion {
    id: string;
    prompt: string;
    taskType: TaskType;
    language: Language;
    result: string;
    savedAt: string;
}