import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  CheckSquare, 
  Download, 
  AlertCircle, 
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ExamsPage: React.FC = () => {
  const { exams, currentUser, addToast } = useApp();

  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    'check-1': true,
    'check-2': true,
    'check-3': false,
    'check-4': false
  });

  const nextExam = exams[0]; // HCI Exam in 14 days

  const toggleCheck = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownloadHallTicket = () => {
    addToast({
      title: 'Hall Ticket Downloaded 📄',
      message: `Hall Ticket generated for ${currentUser.name} (SAP ID: ${currentUser.sapId}).`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Banner with Countdown */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-3 py-1 rounded-full border border-white/20">
            Semester VII Mid-Term Examination Series
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
            Next Exam: {nextExam.subject}
          </h2>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-blue-100">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-300" /> {nextExam.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-300" /> {nextExam.time}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-300" /> {nextExam.venue}
            </span>
          </div>
        </div>

        {/* Live Countdown Display */}
        <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-xs shrink-0">
          <div className="text-center px-3">
            <span className="text-2xl font-black text-white">{nextExam.daysLeft}</span>
            <span className="text-[10px] text-blue-200 uppercase font-semibold block">Days</span>
          </div>
          <span className="text-white/40 text-xl font-light">:</span>
          <div className="text-center px-3">
            <span className="text-2xl font-black text-white">08</span>
            <span className="text-[10px] text-blue-200 uppercase font-semibold block">Hours</span>
          </div>
          <span className="text-white/40 text-xl font-light">:</span>
          <div className="text-center px-3">
            <span className="text-2xl font-black text-white">45</span>
            <span className="text-[10px] text-blue-200 uppercase font-semibold block">Mins</span>
          </div>
        </div>
      </div>

      {/* Row 1: Exam Schedule Cards + Preparation Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Complete Exam Schedule */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              Examination Timetable
            </h3>
            <button
              onClick={handleDownloadHallTicket}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Hall Ticket</span>
            </button>
          </div>

          <div className="space-y-3">
            {exams.map((exam, index) => (
              <div 
                key={exam.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all bg-slate-50/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">{exam.code}</span>
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                          {exam.weightage}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5">{exam.subject}</h4>
                      <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" /> {exam.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {exam.time}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <MapPin className="w-3 h-3 text-blue-600" /> {exam.venue} (Seat {exam.seatNo})
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block text-xs font-extrabold bg-blue-600 text-white px-3 py-1 rounded-full shadow-2xs">
                      in {exam.daysLeft} days
                    </span>
                  </div>
                </div>

                {/* Syllabus Topics */}
                <div className="mt-3 pt-3 border-t border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Tested Modules & Syllabus:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {exam.syllabus.map((s, idx) => (
                      <span key={idx} className="text-[11px] bg-white border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Exam Checklist & Mandatory Instructions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Preparation Checklist */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              Pre-Exam Readiness
            </h3>

            <div className="space-y-2.5 text-xs">
              {[
                { id: 'check-1', label: 'Hall ticket downloaded & printed' },
                { id: 'check-2', label: 'College ID card in holder' },
                { id: 'check-3', label: 'Attendance eligibility verified (>75%)' },
                { id: 'check-4', label: 'Non-programmable calculator ready' }
              ].map(item => (
                <label 
                  key={item.id} 
                  className="flex items-center gap-3 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checklist[item.id] || false}
                    onChange={() => toggleCheck(item.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className={`${checklist[item.id] ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* NMIMS Exam Guidelines Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 shadow-xs text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-900">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span>Official Rules & Guidelines</span>
            </div>
            <ul className="list-disc pl-4 space-y-1.5 text-slate-600 leading-relaxed">
              <li>Candidates must report 20 minutes prior to exam commencement.</li>
              <li>Smartphones, smartwatches, and programmable devices are strictly prohibited.</li>
              <li>Carry valid NMIMS student identity badge alongside the hall ticket.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
