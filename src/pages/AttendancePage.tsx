import React, { useState } from 'react';
import { 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Calculator, 
  ChevronRight, 
  Plus, 
  Minus,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AttendancePage: React.FC = () => {
  const { 
    attendanceRecords, 
    overallAttendance, 
    attendanceTarget, 
    setAttendanceTarget, 
    logClassAttendance 
  } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(attendanceRecords[3].id); // DBMS (72%) by default to demonstrate Aarav's scenario

  const selectedRecord = attendanceRecords.find(r => r.id === selectedSubjectId) || attendanceRecords[0];

  // Predictive Bunk / Catch-up Calculator formula
  // If % >= target: safe skips = floor((attended - target/100 * total) / (target/100))
  // If % < target: classes needed = ceil((target/100 * total - attended) / (1 - target/100))
  const calculatePlanning = (attended: number, total: number, targetPct: number) => {
    const currentPct = (attended / total) * 100;
    const target = targetPct / 100;

    if (currentPct >= targetPct) {
      // Safe to miss
      const safeSkips = Math.floor((attended - target * total) / target);
      return {
        isSafe: true,
        count: Math.max(0, safeSkips),
        message: safeSkips > 0 
          ? `You can safely miss ${safeSkips} more class${safeSkips > 1 ? 'es' : ''} while maintaining above ${targetPct}%.`
          : `You are right on the edge of ${targetPct}%. Do not miss your next class!`
      };
    } else {
      // Must attend
      const classesNeeded = Math.ceil((target * total - attended) / (1 - target));
      return {
        isSafe: false,
        count: Math.max(1, classesNeeded),
        message: `You must attend the next ${classesNeeded} consecutive class${classesNeeded > 1 ? 'es' : ''} without missing to reach ${targetPct}%.`
      };
    }
  };

  const currentPlan = calculatePlanning(selectedRecord.attended, selectedRecord.total, attendanceTarget);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Overview & Target Control */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Attendance Analytics</h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Official NMIMS Academic Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status indicators, low attendance warnings, and predictive catch-up planning.
          </p>
        </div>

        {/* Target Attendance Setter (Locus of Control) */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Minimum Goal</span>
            <span className="text-sm font-bold text-slate-800">{attendanceTarget}% Target</span>
          </div>
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setAttendanceTarget(75)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                attendanceTarget === 75 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              75% (Norm)
            </button>
            <button
              onClick={() => setAttendanceTarget(80)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                attendanceTarget === 80 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              80% (Safe)
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: Overall Gauge + Interactive Catch-up / Bunk Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Overall Gauge Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between items-center text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Cumulative Attendance
          </span>

          <div className="relative w-44 h-44 my-4 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F1F5F9" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke={overallAttendance >= attendanceTarget ? '#10B981' : '#EF4444'}
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * overallAttendance) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900">{overallAttendance}%</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${
                overallAttendance >= attendanceTarget ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {overallAttendance >= attendanceTarget ? 'Above Criteria' : 'Attendance Shortage'}
              </span>
            </div>
          </div>

          <div className="w-full pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Total Attended</span>
              <span className="font-bold text-slate-800 text-sm">
                {attendanceRecords.reduce((acc, c) => acc + c.attended, 0)} classes
              </span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Total Missed</span>
              <span className="font-bold text-slate-800 text-sm">
                {attendanceRecords.reduce((acc, c) => acc + (c.total - c.attended), 0)} classes
              </span>
            </div>
          </div>
        </div>

        {/* Right: Smart Catch-up / Safe-Bunk Calculator (Solves Slide 10/11) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Calculator className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Smart Attendance & Catch-Up Planner</h3>
                  <p className="text-xs text-blue-200">Interactive planner to prevent last-minute eligibility crises</p>
                </div>
              </div>
              <span className="text-xs font-mono bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-400/30">
                Target: {attendanceTarget}%
              </span>
            </div>

            {/* Subject Selector Pill List */}
            <div className="flex flex-wrap gap-2 mb-6">
              {attendanceRecords.map(r => (
                <button
                  key={r.id}
                  onClick={() => setSelectedSubjectId(r.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedRecord.id === r.id
                      ? 'bg-blue-500 text-white font-bold ring-2 ring-white/50 shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-slate-300'
                  }`}
                >
                  {r.code} ({r.percentage}%)
                </button>
              ))}
            </div>

            {/* Calculated Recommendation Card */}
            <div className={`p-5 rounded-2xl border ${
              currentPlan.isSafe
                ? 'bg-emerald-950/40 border-emerald-500/40'
                : 'bg-amber-950/40 border-amber-500/40'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl shrink-0 ${
                  currentPlan.isSafe ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {currentPlan.isSafe ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{selectedRecord.subject}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      selectedRecord.percentage >= attendanceTarget ? 'bg-emerald-400/20 text-emerald-300' : 'bg-red-400/20 text-red-300'
                    }`}>
                      Current: {selectedRecord.percentage}% ({selectedRecord.attended}/{selectedRecord.total})
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-100 mt-2 leading-relaxed">
                    {currentPlan.message}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Faculty: {selectedRecord.faculty} • Venue: {selectedRecord.room}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Logger */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Simulate next class for {selectedRecord.code}:
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => logClassAttendance(selectedRecord.id, true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors shadow-sm"
              >
                + Attended Next Class
              </button>
              <button
                onClick={() => logClassAttendance(selectedRecord.id, false)}
                className="px-3.5 py-1.5 bg-red-600/80 hover:bg-red-500 text-white font-semibold rounded-xl transition-colors shadow-sm"
              >
                - Missed Next Class
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Subject-Wise Detailed Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
          <span>Subject-Wise Attendance Breakdown</span>
          <span className="text-xs font-normal text-slate-400">Semester VII</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">Subject Name</th>
                <th className="pb-3 text-center">Classes Attended</th>
                <th className="pb-3 text-center">Total Conducted</th>
                <th className="pb-3 text-center">Percentage</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 pr-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceRecords.map((item) => {
                const isBelow = item.percentage < attendanceTarget;
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 pl-2 font-medium">
                      <p className="font-bold text-slate-800 text-sm">{item.subject}</p>
                      <p className="text-[11px] text-slate-400">{item.code} • {item.faculty}</p>
                    </td>

                    <td className="py-4 text-center font-semibold text-slate-700">
                      {item.attended}
                    </td>

                    <td className="py-4 text-center font-semibold text-slate-700">
                      {item.total}
                    </td>

                    <td className="py-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`font-black text-sm ${isBelow ? 'text-red-600' : 'text-emerald-600'}`}>
                          {item.percentage}%
                        </span>
                        <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                          <div 
                            className={`h-full rounded-full ${isBelow ? 'bg-red-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        isBelow 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isBelow ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {isBelow ? 'Critical Warning' : 'Safe Standing'}
                      </span>
                    </td>

                    <td className="py-4 pr-2 text-right">
                      <button
                        onClick={() => setSelectedSubjectId(item.id)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl text-xs transition-colors"
                      >
                        Plan Catch-up
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
