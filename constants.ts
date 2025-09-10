import { TaskType, Language } from './types';

export const TASK_OPTIONS = [
    { value: TaskType.GENERATE, label: 'Create script' },
    { value: TaskType.EXPLAIN, label: 'Explain a script' },
    { value: TaskType.TRANSLATE, label: 'Translate a script' },
    { value: TaskType.DEBUG, label: 'Debug a script' },
    { value: TaskType.CODE_REVIEW, label: 'Review Code' },
    { value: TaskType.SECURITY, label: 'Analyze for Security' },
    { value: TaskType.STEP_BY_STEP, label: 'Give solution step by step' },
];

export const LANGUAGE_OPTIONS = [
    { value: Language.AUTO, label: 'Auto-detect by AI' },
    { value: Language.POWERSHELL, label: 'PowerShell' },
    { value: Language.BASH, label: 'Bash (for WSL)' },
    { value: Language.CMD, label: 'CMD Batch' },
    { value: Language.VBA, label: 'VBA' },
    { value: Language.PYTHON, label: 'Python' },
    { value: Language.SQL, label: 'SQL' },
    { value: Language.RUBY, label: 'Ruby' },
    { value: Language.GO, label: 'Go' },
];

export const EXAMPLE_PROMPTS: Record<TaskType, { language: Language, text: string }[]> = {
    [TaskType.GENERATE]: [
        { language: Language.POWERSHELL, text: 'Create a PowerShell script to zip all .log files in the C:\\temp directory.' },
        { language: Language.BASH, text: 'Write a Bash script that counts the number of files in the current directory.' },
        { language: Language.PYTHON, text: 'Generate a Python script to read a CSV file and print the third column.' },
    ],
    [TaskType.EXPLAIN]: [
        { language: Language.POWERSHELL, text: 'Explain this PowerShell command: Get-ChildItem -Path C:\\ -Recurse -ErrorAction SilentlyContinue | Where-Object { !$_.PSIsContainer } | Group-Object -Property Extension -NoElement | Sort-Object -Property Count -Descending' },
        { language: Language.BASH, text: 'What does this Bash script do?\n\n#!/bin/bash\nfor i in {1..5}; do\n  echo "Welcome $i times"\ndone' },
        { language: Language.CMD, text: 'Explain this batch command: for /f "tokens=*" %%a in (\'dir /b /s *.txt\') do @echo %%a' },
    ],
    [TaskType.TRANSLATE]: [
        { language: Language.POWERSHELL, text: 'Translate the following Bash command to PowerShell:\n\nls -l | grep ".txt"' },
        { language: Language.BASH, text: 'Translate this PowerShell one-liner to Bash:\n\nGet-Service | Where-Object {$_.Status -eq "Running"}' },
        { language: Language.PYTHON, text: 'Translate this VBA macro to Python:\n\nSub HelloWorld()\n    MsgBox "Hello, World!"\nEnd Sub' },
    ],
    [TaskType.DEBUG]: [
        { language: Language.POWERSHELL, text: 'Debug this PowerShell script. It says "Cannot bind argument to parameter \'Path\' because it is null".\n\n$logFolder = "C:\\nonexistent_folder"\nGet-ChildItem -Path $logFolder' },
        { language: Language.VBA, text: 'Why is my VBA code giving a "Type Mismatch" error here?\n\nSub Test()\n    Dim x As Integer\n    x = "hello"\nEnd Sub' },
        { language: Language.PYTHON, text: 'This Python script is not working. It should print a list of files but it does nothing. \n\nimport os\n\ndef list_files(directory):\n  for file in os.listdir(dir):\n    print(file)' },
    ],
    [TaskType.CODE_REVIEW]: [
        { language: Language.PYTHON, text: 'Review this Python function for readability and suggest improvements:\n\ndef process_data(d):\n    r = []\n    for i in d:\n        if i[\'status\'] == \'active\':\n            r.append(i[\'value\'] * 2)\n    return r' },
        { language: Language.POWERSHELL, text: 'Is this PowerShell script following best practices for error handling?\n\nfunction Get-RemoteFile {\n    param($URL, $OutputPath)\n    try {\n        Invoke-WebRequest -Uri $URL -OutFile $OutputPath\n    } catch {\n        Write-Host "Download failed."\n    }\n}' },
        { language: Language.BASH, text: 'Code review this Bash script. Can it be made more robust?\n\n#!/bin/bash\nread -p "Enter filename: " FILENAME\nif [ -f "$FILENAME" ]; then\n    rm $FILENAME\n    echo "File deleted."\nfi' },
    ],
    [TaskType.SECURITY]: [
        { language: Language.POWERSHELL, text: 'Create a PowerShell script to find all local accounts with administrative privileges.' },
        { language: Language.BASH, text: 'Write a Bash script to find all files with SUID permissions.' },
        { language: Language.POWERSHELL, text: 'Analyze this script for security vulnerabilities: "Invoke-Expression -Command $UserInput"' },
    ],
    [TaskType.STEP_BY_STEP]: [
        { language: Language.POWERSHELL, text: 'Provide a step-by-step guide to create a new local user on Windows and add them to the Remote Desktop Users group.' },
        { language: Language.BASH, text: 'Walk me through the steps to set up a simple Nginx web server on Ubuntu.' },
        { language: Language.POWERSHELL, text: 'How do I schedule a PowerShell script to run daily using Task Scheduler? Explain each step.' },
    ]
};

export const PROMPT_BASE = `
You are "LogicLeap," an expert-level scripting, automation, and cybersecurity assistant. Your primary goal is to generate accurate, efficient, and **secure** code for system administrators, developers, and power users, covering 1st, 2nd, and 3rd line IT support roles.

**Core Instructions:**
- **Security First:** Every response must be viewed through a security lens. Prioritize secure coding practices, identify potential vulnerabilities, and offer hardening advice.
- **Tiered Support Mindset:** Understand the context of the request. A 1st line script might be simple and focused on a single user, while a 3rd line script might involve server infrastructure and automation at scale.
- **Clarity and Actionability:** Provide code that works, explanations that are easy to understand, and warnings that are clear.
- **Multimodal Analysis:** If an image is provided, it is crucial context. Analyze it in conjunction with the user's text input to provide the most relevant and accurate solution. The image could be a screenshot of code, an error message, a terminal window, or a diagram.

**IMPORTANT: The response format depends on the user's selected 'Task Type'.**
`;

export const PROMPT_STEP_BY_STEP_STRUCTURE = `
**Formatting Rule: The user has selected 'Give solution step by step'.**
- You MUST structure your entire response as a numbered list of steps.
- Each step must clearly explain one part of the process.
- If a step involves a command or code, include a small, relevant code snippet *within* that step's explanation.
- **Crucially, do NOT provide one single, large code block at the beginning or end of your response.**
- The goal is to walk the user through a process, not just give them a final script.
`;

export const PROMPT_SCRIPT_BLOCK_STRUCTURE = `
**Formatting Rule: The user has selected a task that requires a script or code analysis.**
- You MUST structure your response in two distinct parts: 1. The Code Block, and 2. The Explanation Block.

---

**[Part 1: The Code Block]**
- The code must be clean, well-commented, and ready to run.
- If the primary task is a review or explanation, you may present an improved version of the user's code here.
- Always use a formatted markdown code block with the correct language identifier (e.g., \`\`\`powershell, \`\`\`bash, \`\`\`vba).
- Prioritize best practices: use variables, handle potential errors, and avoid hardcoding paths or credentials.

**[Part 2: The Explanation Block]**
- Start with the heading "### Explanation:".
- Provide a clear, step-by-step breakdown of what the script does.
- Explain the purpose of key commands, functions, or parameters.
- **When the task is 'Analyze for Security', you MUST include a "### Security Analysis:" section.** In this section, detail potential risks (e.g., injection, permissions), the security measures you've implemented (e.g., input sanitization), and recommendations for secure deployment. For other tasks, this section is optional but recommended if there are security implications.
- **When the task is 'Review Code', you MUST include a "### Code Review:" section.** In this section, provide a detailed analysis covering: code quality, adherence to best practices, potential bugs, style suggestions, and areas for improvement or refactoring.
- If there are prerequisites or other important warnings, state them clearly under a "⚠️ **Important Notes:**" section.
`;


export const PROMPT_USER_REQUEST_SUFFIX = `
---

**USER REQUEST DETAILS:**

**Task Type:** {task_type}
**Output Language:** {output_language}
**User Input:**
{user_input}
`;


export const ADVANCED_SCRIPTS: Record<Language, { label: string; script: string }[]> = {
    [Language.POWERSHELL]: [
        { label: 'Bulk Rename Files', script: 'Get-ChildItem -Path .\\*.txt | Rename-Item -NewName { $_.Name -replace \'.txt\',\'.log\' }' },
        { label: 'Check Service Status', script: 'Get-Service -Name "spooler" | Select-Object -Property Name, Status' },
        { label: 'Export AD Users to CSV', script: 'Get-ADUser -Filter * -Properties * | Select-Object -Property Name, SamAccountName, EmailAddress | Export-Csv -Path ".\\ADUsers.csv" -NoTypeInformation' },
        { label: 'Get System Uptime', script: '(Get-Date) - (Get-CimInstance -ClassName Win32_OperatingSystem).LastBootUpTime' },
        { label: 'List Installed Software', script: 'Get-ItemProperty HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName, DisplayVersion, Publisher, InstallDate | Format-Table -AutoSize' },
        { label: 'Clear DNS Cache', script: 'Clear-DnsClientCache' },
    ],
    [Language.BASH]: [
        { label: 'Find Files by Content', script: 'grep -r "your-search-string" /path/to/search' },
        { label: 'Check Open Ports', script: 'sudo netstat -tuln | grep LISTEN' },
        { label: 'Monitor Disk Usage', script: 'df -h' },
        { label: 'Create Directory Backup', script: 'tar -czvf backup_$(date +%Y-%m-%d).tar.gz /path/to/directory' },
        { label: 'Find Large Directories', script: 'du -ah . | sort -rh | head -n 10' },
        { label: 'Check Listening Services', script: 'sudo lsof -i -P -n | grep LISTEN' },
    ],
     [Language.CMD]: [
        { label: 'Flush DNS', script: 'ipconfig /flushdns' },
        { label: 'Check Network Connection', script: 'ping 8.8.8.8' },
        { label: 'Show WiFi Passwords', script: 'netsh wlan show profile name="*" key=clear' },
    ],
    [Language.PYTHON]: [
        { label: 'Simple Web Server', script: 'python -m http.server 8000' },
        { label: 'Convert JSON to CSV', script: 'import pandas as pd\\ndf = pd.read_json("input.json")\\ndf.to_csv("output.csv", index=False)' },
        { label: 'Simple API GET Request', script: 'import requests\\n\\nresponse = requests.get("https://api.github.com")\\nprint(response.status_code)\\nprint(response.json())' },
    ],
    [Language.SQL]: [
        { label: 'Select Top 100 Rows', script: 'SELECT TOP 100 * FROM YourTable;' },
        { label: 'Count Rows in Table', script: 'SELECT COUNT(*) AS total_rows FROM YourTable;' },
    ],
    [Language.AUTO]: [],
    [Language.VBA]: [],
    [Language.RUBY]: [],
    [Language.GO]: [],
};

export const STORAGE_CLEANUP_SCRIPTS: { label: string; description: string; script: string; language: Language }[] = [
    {
        label: 'Clear Windows Temp Files',
        description: 'Safely removes temporary files from the user and system temp folders on Windows.',
        script: `
# Clears the current user's temp folder
Write-Host "Clearing user temp folder: $env:TEMP"
Remove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue

# Clears the Windows temp folder
Write-Host "Clearing Windows temp folder: C:\\Windows\\Temp"
Remove-Item -Path "C:\\Windows\\Temp\\*" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Temporary files cleanup complete."
        `.trim(),
        language: Language.POWERSHELL
    },
    {
        label: 'Clear Windows Update Cache',
        description: 'Stops the Windows Update service and clears its downloaded cache files to free up space.',
        script: `
Write-Host "Stopping Windows Update Service..."
Stop-Service -Name wuauserv -Force
Write-Host "Deleting Windows Update cache files..."
Remove-Item -Path "$($env:windir)\\SoftwareDistribution\\Download\\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "Restarting Windows Update Service..."
Start-Service -Name wuauserv
Write-Host "Windows Update cache cleanup complete."
        `.trim(),
        language: Language.POWERSHELL
    },
    {
        label: 'Run Windows Disk Cleanup',
        description: 'Launches the built-in Windows Disk Cleanup utility (cleanmgr.exe) for the system drive.',
        script: 'cleanmgr /sagerun:1',
        language: Language.CMD
    },
    {
        label: 'Clear Docker Build Cache',
        description: 'Removes all dangling build cache from Docker to reclaim significant disk space.',
        script: 'docker builder prune -af',
        language: Language.BASH
    },
    {
        label: 'Clear NuGet Package Cache',
        description: 'Clears all local NuGet package caches. Useful for resolving package issues.',
        script: 'dotnet nuget locals all --clear',
        language: Language.POWERSHELL
    },
    {
        label: 'Clear npm Cache',
        description: 'Cleans the npm cache to fix corruption issues or free up a small amount of space.',
        script: 'npm cache clean --force',
        language: Language.BASH
    },
    {
        label: 'Clear Homebrew Cache (macOS)',
        description: 'Removes outdated downloads and lock files for Homebrew on macOS.',
        script: 'brew cleanup',
        language: Language.BASH
    },
    {
        label: 'Find Top 10 Largest Files (PowerShell)',
        description: 'Scans a directory to find and list the 10 largest files. Prompts for the directory path.',
        script: `
$targetPath = Read-Host -Prompt "Enter the full path to the directory you want to scan (e.g., C:\\Users\\YourUser)"
if (-not (Test-Path -Path $targetPath)) {
    Write-Error "The specified path does not exist. Please run the script again with a valid path."
    return
}
Write-Host "Scanning for large files in $targetPath..."
Get-ChildItem -Path $targetPath -Recurse -File -ErrorAction SilentlyContinue | Sort-Object -Property Length -Descending | Select-Object -First 10 | Format-Table @{Name="Size (MB)"; Expression={"{0:N2}" -f ($_.Length / 1MB)}}, FullName
        `.trim(),
        language: Language.POWERSHELL
    },
    {
        label: 'Find Top 10 Largest Files (Bash)',
        description: 'Scans a directory to find and list the 10 largest files. Searches from the current directory.',
        script: `
#!/bin/bash
echo "Finding the 10 largest files in the current directory and its subdirectories..."
find . -type f -exec du -h {} + | sort -rh | head -n 10
        `.trim(),
        language: Language.BASH
    },
];

export const SECURITY_SCRIPTS: { label: string; description: string; script: string; language: Language }[] = [
    {
        label: 'Audit Local Admins (PowerShell)',
        description: 'Lists all members of the local Administrators group on a Windows machine.',
        script: 'Get-LocalGroupMember -Group "Administrators" | Select-Object Name, PrincipalSource, ObjectClass',
        language: Language.POWERSHELL
    },
    {
        label: 'Check Firewall Status (CMD)',
        description: 'Checks the status of the Windows Defender Firewall for all profiles (Domain, Private, Public).',
        script: 'netsh advfirewall show allprofiles state',
        language: Language.CMD
    },
    {
        label: 'Find World-Writable Files (Bash)',
        description: 'Searches for files and directories that are writable by everyone, which can be a security risk.',
        script: 'find / -type f -perm -0002 -ls\nfind / -type d -perm -0002 -ls',
        language: Language.BASH
    },
    {
        label: 'Check for Unquoted Service Paths',
        description: 'Finds Windows services with unquoted executable paths, a potential privilege escalation vulnerability.',
        script: `Get-CimInstance -ClassName Win32_Service | Where-Object { $_.PathName -notmatch '^"' -and $_.PathName -notmatch 'system32' } | Select-Object Name, PathName, StartMode`,
        language: Language.POWERSHELL
    },
    {
        label: 'List Open Ports (Bash)',
        description: 'Uses netstat to show all listening TCP and UDP ports. Requires sudo for full process info.',
        script: 'sudo netstat -tulpn',
        language: Language.BASH
    },
    {
        label: 'Get NTFS Folder Permissions',
        description: 'Retrieves the Access Control List (ACL) for a specific folder to review user permissions.',
        script: 'Get-Acl -Path "C:\\Path\\To\\Your\\Folder" | Format-List',
        language: Language.POWERSHELL
    }
];