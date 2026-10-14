import React from 'react';
import { CheckCircle2, AlertTriangle, Info, AlertCircle, X, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icon = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
        }[toast.type];

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl flex items-start justify-between gap-3 border border-slate-700/60 animate-in slide-in-from-bottom-2 fade-in duration-200"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-2.5">
              {icon}
              <div>
                <p className="text-xs font-bold text-white leading-tight">{toast.title}</p>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
                
                {/* Undo Action Button for Easy Reversal */}
                {toast.undoAction && (
                  <button
                    onClick={() => {
                      toast.undoAction!();
                      removeToast(toast.id);
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-semibold transition-colors shadow-sm"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{toast.undoLabel || 'Undo'}</span>
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
