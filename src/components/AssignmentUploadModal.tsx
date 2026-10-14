import React, { useState, useRef } from 'react';
import { Upload, X, Check, FileText, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Assignment } from '../types';

interface AssignmentUploadModalProps {
  assignment: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: (assignmentId: string, fileName: string) => void;
}

export const AssignmentUploadModal: React.FC<AssignmentUploadModalProps> = ({
  assignment,
  isOpen,
  onClose,
  onSubmitted
}) => {
  const { darkMode, addToast } = useApp();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [remarks, setRemarks] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !assignment) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      addToast({
        title: 'File Required',
        message: 'Please choose an assignment document to upload.',
        type: 'error'
      });
      return;
    }

    setIsUploading(true);
    setProgress(15);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            onSubmitted(assignment.id, selectedFile.name);
            addToast({
              title: 'Assignment Submitted!',
              message: `Uploaded "${selectedFile.name}" for ${assignment.subject}.`,
              type: 'success'
            });
            onClose();
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`${
        darkMode ? 'bg-[#121420] text-slate-100 border-white/10' : 'bg-white text-slate-900 border-slate-200 shadow-2xl'
      } border rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-current/10 mb-5">
          <div>
            <span className="text-[10px] font-tech uppercase text-indigo-500 tracking-widest block font-bold">
              COURSEWORK PORTAL · NMIMS
            </span>
            <h3 className="text-xl font-display font-black mt-0.5">
              Submit Assignment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 opacity-60 hover:opacity-100 rounded-xl transition-opacity"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assignment Metadata Badge */}
        <div className={`p-4 rounded-2xl mb-5 border ${
          darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-tech font-bold text-indigo-500 uppercase">{assignment.subject}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              assignment.priority === 'High' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'
            }`}>
              {assignment.priority} Priority
            </span>
          </div>
          <h4 className="font-display font-bold text-sm sm:text-base leading-snug">
            {assignment.title}
          </h4>
          <p className="text-xs opacity-70 mt-1">
            Deadline: {assignment.deadlineRelative} ({assignment.dueTime})
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept=".pdf,.docx,.zip,.ipynb,.py" 
            className="hidden" 
          />

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              selectedFile 
                ? 'border-emerald-500 bg-emerald-500/10' 
                : darkMode 
                ? 'border-indigo-500/30 hover:border-indigo-400 bg-white/5' 
                : 'border-indigo-300 hover:border-indigo-500 bg-indigo-50/40'
            }`}
          >
            {selectedFile ? (
              <div className="flex flex-col items-center gap-2 text-emerald-500">
                <CheckCircle2 className="w-8 h-8" />
                <span className="font-tech font-bold text-xs truncate max-w-xs">{selectedFile.name}</span>
                <span className="text-[10px] opacity-75 font-mono">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to submit</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-tech font-bold text-xs">Drag & drop your file here, or browse</p>
                  <p className="text-[10px] opacity-60 mt-0.5">Supports PDF, DOCX, ZIP, IPYNB (Max 25MB)</p>
                </div>
              </div>
            )}
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-tech font-bold opacity-80 mb-1">
              Submission Remarks (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Heuristic evaluation findings with Nielsen's 10 criteria included."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className={`w-full p-3 rounded-xl text-xs font-sans border focus:outline-none transition-colors ${
                darkMode ? 'bg-white/5 border-white/10 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
              }`}
            />
          </div>

          {/* Upload Progress Indicator */}
          {isUploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-tech">
                <span>Uploading assignment file...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-200" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-current/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 text-xs font-semibold opacity-70 hover:opacity-100 transition-opacity"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className={`px-6 py-2.5 rounded-xl font-tech font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 ${
                selectedFile 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30' 
                  : 'bg-indigo-600/40 text-white/50 cursor-not-allowed'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Uploading...' : 'Confirm Submission'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
