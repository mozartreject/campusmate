import React, { useState } from 'react';
import { X, Award, CheckCircle2, BookOpen, Layers, Sparkles, ExternalLink, Lightbulb } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';

export const HCIPrinciplesModal: React.FC = () => {
  const { 
    hciModalOpen, 
    setHciModalOpen, 
    hciPrinciples, 
    setActiveTab 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<'All' | "Shneiderman's 8 Golden Rules" | "Nielsen's 10 Heuristics" | "Norman's 7 Principles of Design" | "Donald Norman's 7 Stages" | "7 Universal Design Principles">('All');

  if (!hciModalOpen) return null;

  const filteredPrinciples = activeCategory === 'All' 
    ? hciPrinciples 
    : hciPrinciples.filter(p => p.category === activeCategory);

  const handleJumpToScreen = (target: string) => {
    setHciModalOpen(false);
    if (target.toLowerCase().includes('attendance')) setActiveTab('attendance');
    else if (target.toLowerCase().includes('assignment') || target.toLowerCase().includes('task')) setActiveTab('assignments');
    else if (target.toLowerCase().includes('exam')) setActiveTab('exams');
    else if (target.toLowerCase().includes('library') || target.toLowerCase().includes('note')) setActiveTab('notes');
    else if (target.toLowerCase().includes('event') || target.toLowerCase().includes('rsvp')) setActiveTab('events');
    else if (target.toLowerCase().includes('timetable') || target.toLowerCase().includes('search')) setActiveTab('timetable');
    else setActiveTab('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/20">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">HCI Principles & Design Evaluation</h3>
              <p className="text-xs text-blue-100">
                Evaluation against Shneiderman's 8 Rules, Nielsen's 10 Heuristics, and Norman's 7 Principles of Design
              </p>
            </div>
          </div>
          <button
            onClick={() => setHciModalOpen(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
          {(['All', "Shneiderman's 8 Golden Rules", "Nielsen's 10 Heuristics", "Norman's 7 Principles of Design", "Donald Norman's 7 Stages", "7 Universal Design Principles"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Evaluation Cards List */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-blue-900">Project Context: </span>
              CampusMate was built as a textbook implementation of Ben Shneiderman’s 8 Golden Rules, Jakob Nielsen’s 10 Usability Heuristics, and Donald Norman’s 7 Principles of Design & Execution-Evaluation Cycle.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrinciples.map((item) => (
              <div 
                key={item.id}
                className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-4 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {item.category.includes('Principles of Design')
                        ? `Design Principle #${item.ruleNumber}`
                        : item.category.includes('Norman') 
                        ? (item.ruleNumber === 8 ? 'Both Gulfs' : `Stage #${item.ruleNumber}`)
                        : item.category.includes('Shneiderman') 
                        ? `Rule #${item.ruleNumber}` 
                        : item.category.includes('Nielsen')
                        ? `Heuristic #${item.ruleNumber}`
                        : `Principle #${item.ruleNumber}`}
                    </span>
                    <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full truncate max-w-[150px]">
                      {item.uiTarget}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <p className="text-[11px] font-bold text-slate-700 mb-0.5">Implemented in CampusMate:</p>
                    <p className="text-[11px] text-slate-600 leading-normal">{item.campusMateApplication}</p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => handleJumpToScreen(item.uiTarget)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                  >
                    <span>View in UI</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>CampusMate • Human-Computer Interaction Group Project</span>
          <button
            onClick={() => setHciModalOpen(false)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-xs"
          >
            Close Evaluator
          </button>
        </div>
      </div>
    </div>
  );
};
