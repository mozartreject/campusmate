import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Undo2, Redo2, Hand, Sparkles, HelpCircle, X } from 'lucide-react';

export const GestureUndoRedoListener: React.FC = () => {
  const { 
    undoStack, 
    redoStack, 
    canUndo, 
    canRedo, 
    triggerUndo, 
    triggerRedo, 
    lastGesture, 
    darkMode 
  } = useApp();

  const [activeGestureFeedback, setActiveGestureFeedback] = useState<{
    direction: 'left' | 'right' | null;
    label: string;
    actionDescription: string;
    visible: boolean;
  }>({ direction: null, label: '', actionDescription: '', visible: false });

  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0); // -100 to 100
  const [showGestureGuide, setShowGestureGuide] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Touch tracking refs
  const touchStartRef = useRef<{ x: number; y: number; time: number; touches: number } | null>(null);
  const lastWheelTriggerRef = useRef<number>(0);
  const feedbackTimeoutRef = useRef<any>(null);

  const displayHud = (direction: 'left' | 'right', label: string, actionDescription: string) => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    setActiveGestureFeedback({
      direction,
      label,
      actionDescription,
      visible: true
    });
    feedbackTimeoutRef.current = setTimeout(() => {
      setActiveGestureFeedback(prev => ({ ...prev, visible: false }));
    }, 2800);
  };

  // 1. Touchscreen Multi-Finger & Single-Finger Gesture Detection
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
        touches: e.touches.length
      };
      setIsSwiping(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current || e.touches.length === 0) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const dx = currentX - touchStartRef.current.x;
      const dy = currentY - touchStartRef.current.y;

      // Only track if mainly horizontal
      if (Math.abs(dx) > Math.abs(dy) * 1.2) {
        setSwipeProgress(Math.min(100, Math.max(-100, (dx / 120) * 100)));
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      setIsSwiping(false);
      setSwipeProgress(0);
      if (!touchStartRef.current) return;

      const endX = e.changedTouches[0]?.clientX || touchStartRef.current.x;
      const endY = e.changedTouches[0]?.clientY || touchStartRef.current.y;
      const dx = endX - touchStartRef.current.x;
      const dy = endY - touchStartRef.current.y;
      const dt = Date.now() - touchStartRef.current.time;
      const touchesCount = touchStartRef.current.touches;

      touchStartRef.current = null;

      // Gesture criteria: horizontal distance > 55px, horizontal > vertical * 1.3, duration < 750ms
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3 && dt < 750) {
        if (dx < 0) {
          // Swiped Left with finger -> UNDO!
          const success = triggerUndo();
          displayHud('left', `${touchesCount}-Finger Swipe Left Recognized`, success ? 'Action Reversal (Undo) Executed' : 'Undo stack is empty');
        } else {
          // Swiped Right with finger -> REDO!
          const success = triggerRedo();
          displayHud('right', `${touchesCount}-Finger Swipe Right Recognized`, success ? 'Action Re-applied (Redo) Executed' : 'Redo stack is empty');
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [triggerUndo, triggerRedo]);

  // 2. Trackpad 2-Finger Horizontal Swipe & Keyboard Accelerators
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Trackpad 2-finger horizontal pan gesture
      const now = Date.now();
      if (now - lastWheelTriggerRef.current < 650) return;

      if (Math.abs(e.deltaX) > 65 && Math.abs(e.deltaX) > Math.abs(e.deltaY) * 2.2) {
        lastWheelTriggerRef.current = now;
        if (e.deltaX > 65) {
          // 2-finger swipe left on trackpad
          const success = triggerUndo();
          displayHud('left', 'Trackpad 2-Finger Swipe Left Recognized', success ? 'Action Reversal (Undo)' : 'Nothing to undo');
        } else if (e.deltaX < -65) {
          // 2-finger swipe right on trackpad
          const success = triggerRedo();
          displayHud('right', 'Trackpad 2-Finger Swipe Right Recognized', success ? 'Action Re-applied (Redo)' : 'Nothing to redo');
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in form inputs
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      // Cmd+Z or Ctrl+Z (Undo)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        const success = triggerUndo();
        displayHud('left', 'Keyboard Shortcut (⌘Z / Ctrl+Z)', success ? 'Action Reversal (Undo)' : 'Nothing to undo');
      }
      // Cmd+Shift+Z or Ctrl+Y (Redo)
      else if (
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && e.shiftKey) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault();
        const success = triggerRedo();
        displayHud('right', 'Keyboard Shortcut (⌘⇧Z / Ctrl+Y)', success ? 'Action Re-applied (Redo)' : 'Nothing to redo');
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [triggerUndo, triggerRedo]);

  return (
    <>
      {/* ======================================================== */}
      {/* 1. TOP FLOATING FINGER GESTURE RECOGNITION HUD           */}
      {/* ======================================================== */}
      {activeGestureFeedback.visible && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in slide-in-from-top-4 fade-in duration-200">
          <div className={`px-5 py-3 rounded-2xl border shadow-2xl backdrop-blur-md flex items-center gap-3.5 ${
            darkMode 
              ? 'bg-[#141624]/95 border-indigo-500/50 text-white shadow-indigo-500/20' 
              : 'bg-white/95 border-indigo-400 text-slate-900 shadow-xl'
          }`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              activeGestureFeedback.direction === 'left'
                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40'
            }`}>
              {activeGestureFeedback.direction === 'left' ? (
                <Undo2 className="w-5 h-5 animate-pulse" />
              ) : (
                <Redo2 className="w-5 h-5 animate-pulse" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-tech uppercase tracking-widest font-black text-indigo-500">
                  {activeGestureFeedback.label}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="font-display font-bold text-xs sm:text-sm mt-0.5">
                {activeGestureFeedback.actionDescription}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. REAL-TIME SWIPE TRACKER INDICATOR (ACTIVE TOUCH)      */}
      {/* ======================================================== */}
      {isSwiping && Math.abs(swipeProgress) > 15 && (
        <div className="fixed top-1/2 -translate-y-1/2 left-0 right-0 z-40 pointer-events-none flex items-center justify-between px-8">
          {swipeProgress < 0 && (
            <div className="p-4 rounded-3xl bg-indigo-600/90 text-white shadow-2xl backdrop-blur-sm animate-bounce flex items-center gap-2 font-tech font-bold text-xs">
              <Undo2 className="w-5 h-5" />
              <span>Release to Undo (Left Swipe)</span>
            </div>
          )}
          {swipeProgress > 0 && (
            <div className="p-4 rounded-3xl bg-indigo-600/90 text-white shadow-2xl backdrop-blur-sm animate-bounce ml-auto flex items-center gap-2 font-tech font-bold text-xs">
              <span>Release to Redo (Right Swipe)</span>
              <Redo2 className="w-5 h-5" />
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. DOCKED BOTTOM GESTURE DOCK & SIMULATOR PILL           */}
      {/* ======================================================== */}
      <div className="fixed bottom-5 right-5 z-40 font-tech">
        {isCollapsed ? (
          <button
            onClick={() => setIsCollapsed(false)}
            className={`p-3 rounded-2xl border shadow-xl flex items-center gap-2 text-xs font-bold transition-all ${
              darkMode 
                ? 'bg-[#141624] border-white/10 text-white hover:border-indigo-500/50' 
                : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-400'
            }`}
            title="Expand Finger Gesture Controller (Undo/Redo)"
          >
            <Hand className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">Gestures</span>
            <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px]">
              {undoStack.length}
            </span>
          </button>
        ) : (
          <div className={`p-3.5 sm:p-4 rounded-3xl border shadow-2xl backdrop-blur-md space-y-2.5 max-w-sm ${
            darkMode ? 'bg-[#141624]/95 border-white/10 text-white' : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl'
          }`}>
            
            {/* Header: Title and minimize */}
            <div className="flex items-center justify-between pb-2 border-b border-current/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <Hand className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs leading-none">
                    Finger Gesture Undo & Redo
                  </h4>
                  <p className="text-[10px] opacity-60 font-tech mt-0.5">
                    Shneiderman #6 · Norman Stage 4 & 7
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowGestureGuide(!showGestureGuide)}
                  className="p-1 opacity-60 hover:opacity-100 rounded-lg text-indigo-500"
                  title="Gesture guide instructions"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsCollapsed(true)}
                  className="p-1 opacity-60 hover:opacity-100 rounded-lg"
                  title="Minimize gesture dock"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Gesture Quick Actions: Undo & Redo with Touch/Simulator Triggers */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  const success = triggerUndo();
                  displayHud('left', 'Manual Tap / Gesture Trigger', success ? 'Action Reversal (Undo)' : 'Nothing to undo');
                }}
                disabled={!canUndo}
                className={`py-2 px-3 rounded-xl border flex items-center justify-between transition-all text-xs font-bold ${
                  canUndo
                    ? darkMode
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                      : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100 shadow-xs'
                    : 'opacity-40 cursor-not-allowed border-current/10'
                }`}
                title="Swipe Left or Press ⌘Z"
              >
                <span className="flex items-center gap-1.5">
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>👈 Undo</span>
                </span>
                <span className="text-[10px] opacity-75 font-mono">({undoStack.length})</span>
              </button>

              <button
                onClick={() => {
                  const success = triggerRedo();
                  displayHud('right', 'Manual Tap / Gesture Trigger', success ? 'Action Re-applied (Redo)' : 'Nothing to redo');
                }}
                disabled={!canRedo}
                className={`py-2 px-3 rounded-xl border flex items-center justify-between transition-all text-xs font-bold ${
                  canRedo
                    ? darkMode
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-xs'
                    : 'opacity-40 cursor-not-allowed border-current/10'
                }`}
                title="Swipe Right or Press ⌘Y"
              >
                <span className="flex items-center gap-1.5">
                  <span>Redo 👉</span>
                  <Redo2 className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] opacity-75 font-mono">({redoStack.length})</span>
              </button>
            </div>

            {/* Gesture Touch Simulation Surface */}
            <div 
              onMouseDown={(e) => {
                const startX = e.clientX;
                const onMouseUp = (upEvent: MouseEvent) => {
                  const dx = upEvent.clientX - startX;
                  if (dx < -30) {
                    const s = triggerUndo();
                    displayHud('left', 'Pointer Drag Swipe Left', s ? 'Action Reversal (Undo)' : 'Nothing to undo');
                  } else if (dx > 30) {
                    const s = triggerRedo();
                    displayHud('right', 'Pointer Drag Swipe Right', s ? 'Action Re-applied (Redo)' : 'Nothing to redo');
                  }
                  window.removeEventListener('mouseup', onMouseUp);
                };
                window.addEventListener('mouseup', onMouseUp);
              }}
              className={`p-2 rounded-2xl border text-center cursor-ew-resize select-none transition-colors ${
                darkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
              title="Click and drag horizontally across this pill to simulate a finger swipe gesture"
            >
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-indigo-500">
                <span>↔ Drag Left / Right to Swipe</span>
              </div>
            </div>

            {/* Expanded Gesture Guide Instructions */}
            {showGestureGuide && (
              <div className={`p-3 rounded-2xl border text-[11px] space-y-1.5 leading-relaxed animate-in fade-in ${
                darkMode ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
              }`}>
                <div className="font-bold flex items-center gap-1 text-indigo-500">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>How to use Finger Gestures:</span>
                </div>
                <p>• <strong>Touchscreen:</strong> Swipe 2 fingers left anywhere on screen to Undo; swipe right to Redo.</p>
                <p>• <strong>Mac Trackpad:</strong> Two-finger horizontal flick left to Undo, right to Redo.</p>
                <p>• <strong>Keyboard Shortcut:</strong> ⌘Z / Ctrl+Z (Undo) and ⌘⇧Z / Ctrl+Y (Redo).</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
