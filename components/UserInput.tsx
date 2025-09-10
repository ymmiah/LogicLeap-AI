import React, { useState, useCallback, useEffect } from 'react';

interface UserInputProps {
    userInput: string;
    setUserInput: (value: string) => void;
    imageFile: File | null;
    onImageChange: (file: File | null) => void;
    isLoading: boolean;
}

export const UserInput: React.FC<UserInputProps> = ({ userInput, setUserInput, imageFile, onImageChange, isLoading }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setImagePreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setImagePreviewUrl(null);
        }
    }, [imageFile]);
    

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageChange(e.target.files[0]);
        }
         // Reset file input to allow uploading the same file again
        e.target.value = '';
    };

    const handleDragEvents = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvents(e);
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    }, [handleDragEvents]);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvents(e);
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setIsDragging(false);
    }, [handleDragEvents]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvents(e);
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            if (e.dataTransfer.files[0].type.startsWith('image/')) {
                 onImageChange(e.dataTransfer.files[0]);
            } else {
                alert("Invalid file type. Please upload an image.");
            }
        }
    }, [handleDragEvents, onImageChange]);

    const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
         const file = Array.from(e.clipboardData.files).find(f => f.type.startsWith('image/'));
        if (file) {
            e.preventDefault();
            onImageChange(file);
        }
    }, [onImageChange]);

    const handleRemoveImage = () => {
        onImageChange(null);
    };

    return (
        <div 
            className="form-group flex-grow flex flex-col relative"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragEvents}
            onDrop={handleDrop}
            onPaste={handlePaste}
        >
            <label htmlFor="user_input" className="block font-semibold text-zinc-300 mb-2">Describe your problem or paste your code here:</label>

            {imagePreviewUrl && (
                 <div className="relative mb-2 w-fit">
                    <img src={imagePreviewUrl} alt="Image preview" className="max-w-full max-h-40 h-auto rounded-md border-2 border-zinc-600" />
                    <button 
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-800 transition-transform hover:scale-110"
                        aria-label="Remove image"
                        disabled={isLoading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
            )}
            
            <textarea 
                id="user_input"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="e.g., 'Find all files ending in .tmp in C:\\Windows and delete them.'"
                className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-lg h-48 resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm text-zinc-200 flex-grow disabled:opacity-50"
                aria-label="User input for script generation"
                disabled={isLoading}
            />
            <div className="mt-3 text-center">
                 <input
                    type="file"
                    id="image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isLoading}
                />
                <label 
                    htmlFor="image-upload" 
                    className={`inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white cursor-pointer transition-colors p-2 rounded-md ${isLoading ? 'cursor-not-allowed opacity-50' : 'hover:bg-zinc-700'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                    Upload Image
                </label>
                 <span className="text-sm text-zinc-500 mx-2">or</span>
                 <span className="text-sm text-zinc-500">drag & drop or paste a screenshot</span>
            </div>

            {isDragging && (
                 <div className="absolute inset-0 border-2 border-dashed border-blue-500 bg-blue-500/10 rounded-lg flex items-center justify-center pointer-events-none z-20">
                    <p className="text-blue-300 font-semibold text-lg">Drop image here for analysis</p>
                </div>
            )}
        </div>
    );
};