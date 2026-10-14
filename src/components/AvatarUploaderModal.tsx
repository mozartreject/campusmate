import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { avatarPresets } from '../utils/avatarUtils';
import { SafeAvatar } from './SafeAvatar';

export const AvatarUploaderModal: React.FC = () => {
  const { currentUser, updateProfileAvatar, avatarModalOpen, setAvatarModalOpen, darkMode } = useApp();
  const [previewUrl, setPreviewUrl] = useState<string>(currentUser.avatar);
  const [zoom, setZoom] = useState<number>(1.0);
  const [focalPoint, setFocalPoint] = useState<'center' | 'top' | 'face'>('center');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!avatarModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPreviewUrl(reader.result);
          setZoom(1.0);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfileAvatar(previewUrl);
    setAvatarModalOpen(false);
  };

  const focalStyles = {
    center: 'object-center',
    top: 'object-top',
    face: 'object-[50%_25%]'
  }[focalPoint];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`${
        darkMode ? 'bg-[#121420] text-slate-100 border-white/10' : 'bg-white text-slate-900 border-slate-200 shadow-2xl'
      } border rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-4`}>
        
        {/* Top ambient glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-40 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-3 border-b border-current/10 relative z-10">
          <div>
            <span className="text-[10px] font-tech uppercase text-indigo-500 tracking-widest block font-bold">
              SCHOLAR IDENTITY · AVATAR CALIBRATOR
            </span>
            <h3 className="text-xl font-display font-extrabold">
              Photo Framing & Live Preview
            </h3>
          </div>
          <button 
            onClick={() => setAvatarModalOpen(false)}
            className="p-1.5 opacity-60 hover:opacity-100 rounded-xl transition-opacity"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Multi-Size Preview Bar (Solves Unreadable Avatar Size) */}
        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'} space-y-3 relative z-10`}>
          <div className="flex items-center justify-between text-[11px] font-tech font-bold opacity-75">
            <span>LIVE AVATAR SCALING PREVIEW:</span>
            <span className="text-indigo-500">Tested across 3 UI scales</span>
          </div>

          <div className="flex items-center justify-around gap-4 pt-1">
            {/* 1. Large 96px */}
            <div className="text-center">
              <div className="w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-indigo-500/40 shadow-xl mx-auto bg-slate-900">
                <img 
                  src={previewUrl} 
                  alt="Large" 
                  className={`w-full h-full object-cover transition-transform duration-150 ${focalStyles}`}
                  style={{ transform: `scale(${zoom})` }}
                />
              </div>
              <span className="text-[10px] font-tech opacity-60 mt-1 block">Profile (96px)</span>
            </div>

            {/* 2. Medium 40px */}
            <div className="text-center">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-indigo-500/50 shadow-md mx-auto bg-slate-900">
                <img 
                  src={previewUrl} 
                  alt="Medium" 
                  className={`w-full h-full object-cover transition-transform duration-150 ${focalStyles}`}
                  style={{ transform: `scale(${zoom})` }}
                />
              </div>
              <span className="text-[10px] font-tech opacity-60 mt-1 block">Sidebar (40px)</span>
            </div>

            {/* 3. Small 28px */}
            <div className="text-center">
              <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-indigo-500 shadow-xs mx-auto bg-slate-900">
                <img 
                  src={previewUrl} 
                  alt="Small" 
                  className={`w-full h-full object-cover transition-transform duration-150 ${focalStyles}`}
                  style={{ transform: `scale(${zoom})` }}
                />
              </div>
              <span className="text-[10px] font-tech opacity-60 mt-1 block">Topbar (28px)</span>
            </div>
          </div>
        </div>

        {/* Zoom & Crop Alignment Controls */}
        <div className="space-y-3 relative z-10 text-xs">
          <div className="flex items-center justify-between font-tech">
            <span className="font-bold opacity-80">Zoom / Scale ({zoom.toFixed(1)}x):</span>
            <div className="flex gap-1">
              {(['center', 'top', 'face'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFocalPoint(f)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-tech font-bold uppercase transition-all ${
                    focalPoint === f
                      ? 'bg-indigo-600 text-white'
                      : darkMode ? 'bg-white/10 text-slate-300' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <input 
            type="range"
            min="1.0"
            max="2.5"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Upload Custom Image Button & Dropzone */}
        <div className="space-y-3 relative z-10 my-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className={`w-full py-3 px-4 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2.5 text-xs font-tech font-bold transition-all ${
              darkMode 
                ? 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300 hover:bg-indigo-950/40 hover:border-indigo-400' 
                : 'border-indigo-400/50 bg-indigo-50/60 text-indigo-700 hover:bg-indigo-100/70 hover:border-indigo-600'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photo from Computer (JPG, PNG, WebP)</span>
          </button>
        </div>

        {/* Preset Vector Avatars (Guaranteed Offline / Never Breaks) */}
        <div className="relative z-10 mb-5">
          <div className="flex items-center justify-between text-xs font-tech mb-2.5 opacity-80 font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Or Select an Academic Avatar:</span>
            </span>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {avatarPresets.map((preset) => {
              const isSelected = previewUrl === preset.url;
              return (
                <button
                  key={preset.id}
                  onClick={() => setPreviewUrl(preset.url)}
                  className={`relative p-1 rounded-2xl border transition-all duration-200 hover:scale-105 ${
                    isSelected 
                      ? 'border-indigo-500 ring-2 ring-indigo-500/50 bg-indigo-500/10' 
                      : 'border-current/10 hover:border-indigo-400/40'
                  }`}
                  title={preset.name}
                >
                  <img 
                    src={preset.url} 
                    alt={preset.name} 
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-current/10 relative z-10">
          <button
            onClick={() => setAvatarModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold opacity-70 hover:opacity-100 transition-opacity"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-tech font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Apply Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
