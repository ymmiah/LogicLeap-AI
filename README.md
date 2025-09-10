# LogicLeap AI

**Last Updated:** 10 September 2025

## 1. Introduction

LogicLeap is a sophisticated AI assistant built to empower system administrators, developers, and IT professionals. It leverages the cutting-edge Google Gemini API to generate, explain, translate, and debug command-line scripts and automation code with unparalleled accuracy and security focus.

What sets LogicLeap apart is its **multimodal capability**. Users can upload screenshots of code, error messages, or even diagrams, allowing the AI to analyze visual context and provide solutions that are faster and more intuitive than ever before.

## 2. Core Features

-   **🤖 Comprehensive AI Scripting Suite**:
    -   **Create**: Generate robust scripts from plain English descriptions.
    -   **Explain**: Demystify complex code with detailed, line-by-line explanations.
    -   **Translate**: Seamlessly convert scripts between languages (e.g., Bash to PowerShell).
    -   **Debug**: Pinpoint and resolve errors by providing your code and the corresponding error message.
    -   **Code Review**: Enhance code quality with professional reviews covering best practices, performance, and style.
    -   **Security Analysis**: Proactively identify and mitigate vulnerabilities in your scripts.
    -   **Step-by-Step Guides**: Break down complex tasks into easy-to-follow numbered instructions.

-   **🖼️ Multimodal Analysis with Images**:
    -   Go beyond text. **Upload, drag-and-drop, or paste images** for deeper context.
    -   Perfect for analyzing screenshots of terminal errors, UI elements, or code from non-copyable sources.

-   **🧰 Built-in Script Toolkits**:
    -   **Security Toolkit**: A curated library of scripts for essential security audits (e.g., check firewall status, find insecure permissions).
    -   **Storage Cleanup Toolkit**: Ready-to-use scripts for reclaiming disk space by clearing caches and finding large files.
    -   **Quick Scripts Library**: A handy dropdown of common one-liners and commands to accelerate daily tasks.

-   **🔍 Powerful Search and Filtering**:
    -   Instantly find examples, scripts, and toolkit items using the main search bar.
    -   Refine searches by type (Example, Quick Script) and language.

-   **✨ User-Friendly Interface**:
    -   A clean, responsive layout built with React and Tailwind CSS.
    -   Streaming AI responses for a real-time experience.
    -   Interactive code blocks with syntax highlighting, one-click copy, and download functionality.

## 3. How to Use

1.  **Select Your Task**: Choose what you want to do from the `I want to:` dropdown (e.g., "Create script").
2.  **Provide Context**:
    -   Write a clear description in the text area.
    -   *Optionally*, upload a screenshot of an error, code, or diagram for more accurate results.
    -   Select your target language (e.g., "PowerShell"), or leave it as "Auto-detect by AI".
3.  **Generate Solution**: Click the "Generate Solution" button and watch the AI craft your response in real-time.

## 4. Technology Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **AI Backend**: Google Gemini API (`gemini-2.5-flash`)
-   **Dependencies**:
    -   `@google/genai`: Official Google GenAI SDK for API communication.
    -   `marked`: For parsing Markdown in the AI's response.
    -   `highlight.js`: For syntax highlighting in code blocks.

## 5. Project Setup & Configuration

This application is designed to run in an environment where the Google Gemini API key is securely provided as an environment variable (`process.env.API_KEY`). The application logic in `services/geminiService.ts` directly consumes this variable for API client initialization. No user-facing input for the API key is provided.

## 6. File Structure

The project is organized into logical modules for maintainability and clarity.

```
/
├── index.html              # Main HTML entry point, loads scripts and styles
├── index.tsx               # Root of the React application
├── App.tsx                 # Main application component, manages state and layout
├── metadata.json           # Application name and description
├── README.md               # This project documentation
├── constants.ts            # All static data: AI prompts, dropdown options, example scripts
├── types.ts                # TypeScript type definitions and enums (TaskType, Language)
│
├── components/
│   ├── Controls.tsx        # Dropdowns for task type and language selection
│   ├── ExamplePrompts.tsx  # Displays clickable example prompts based on the current task
│   ├── GuideModal.tsx      # A popup modal explaining how to use the app
│   ├── Header.tsx          # Main header with title, description, and search bar
│   ├── LayoutFooter.tsx    # Application footer with copyright and guide button
│   ├── LayoutHeader.tsx    # Top sticky header with Toolkit and Quick Script buttons
│   ├── Result.tsx          # Renders the AI's streaming output with Markdown and syntax highlighting
│   └── UserInput.tsx       # Text area and image upload/drag-and-drop functionality
│
└── services/
    ├── geminiService.ts    # Handles all communication with the Google Gemini API
    └── imageUtils.ts       # Utility function to convert image files to base64 for the API
```

---

© 2025 LogicLeap. All rights reserved.