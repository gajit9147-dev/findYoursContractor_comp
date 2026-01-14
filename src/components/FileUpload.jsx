import React, { useRef, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';

const FileUpload = ({
    onFilesChange,
    accept = '*',
    multiple = true,
    maxFiles = 10,
    label = 'Upload Files'
}) => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFiles = (newFiles) => {
        const fileArray = Array.from(newFiles);
        const limitedFiles = multiple
            ? fileArray.slice(0, maxFiles - files.length)
            : [fileArray[0]];

        setFiles(prev => {
            const updated = multiple ? [...prev, ...limitedFiles] : limitedFiles;
            onFilesChange(updated);
            return updated;
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            handleFiles(droppedFiles);
        }
    };

    const handleFileInputChange = (e) => {
        const selectedFiles = e.target.files;
        if (selectedFiles.length > 0) {
            handleFiles(selectedFiles);
        }
    };

    const removeFile = (index) => {
        setFiles(prev => {
            const updated = prev.filter((_, i) => i !== index);
            onFilesChange(updated);
            return updated;
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="w-full">
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
            >
                <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className="text-sm font-medium text-gray-700 mb-1">
                    {label}
                </p>
                <p className="text-xs text-gray-500">
                    Drag and drop files here, or click to browse
                </p>
                {multiple && (
                    <p className="text-xs text-gray-400 mt-2">
                        Maximum {maxFiles} files
                    </p>
                )}
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleFileInputChange}
                className="hidden"
            />

            {/* File List */}
            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                        Selected Files ({files.length})
                    </p>
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-700 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(index);
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                aria-label="Remove file"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
