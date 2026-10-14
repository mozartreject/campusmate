import React, { useState } from 'react';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle, 
  UserCheck, 
  Sparkles,
  X,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockStudents } from '../data/mockData';

export const LoginPage: React.FC = () => {
  const { login, allUsers, setHciModalOpen } = useApp();
  const [email, setEmail] = useState('janvi.porwal@nmims.edu.in');
  const [password, setPassword] = useState('••••••••••••');
  const [forgotModal, setForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSent(true);
    setTimeout(() => {
      setForgotModal(false);
      setResetSent(false);
      setResetEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-slate-200">
        {/* Left Side: Branding & HCI Vision */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg p-2">
                <svg viewBox="0 0 48 48" className="w-full h-full text-blue-900" fill="none">
                  <path d="M24 8L4 18L24 28L44 18L24 8Z" fill="#1E293B" />
                  <path d="M10 21.5V31.5C10 37.5 16.5 41 24 41C31.5 41 38 37.5 38 31.5V21.5L24 28.5L10 21.5Z" fill="#1E293B" fillOpacity="0.8" />
                  <path d="M40 19.5V33H42V18.5L40 19.5Z" fill="#D97706" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-black font-serif tracking-tight">CampusMate</h1>
                <p className="text-xs text-blue-200 font-medium">SVKM's NMIMS MPSTME</p>
              </div>
            </div>

            <h2 className="text-xl font-bold leading-snug">
              A Human-Centered Smart Student Companion
            </h2>
            <p className="text-xs text-blue-100 mt-2 leading-relaxed opacity-90">
              Replacing 6+ fragmented campus touchpoints with a single, prioritized view of what matters today.
            </p>

            <div className="mt-8 space-y-2.5">
              <div className="p-3 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-xs text-xs">
                <p className="font-bold text-amber-300">HCI Mini Project Core Team:</p>
                <p className="text-slate-100 mt-0.5 font-medium">Janvi Jain (A011) • Janvi Porwal (A012) • Joshua Rebello (S020)</p>
              </div>

              <div className="p-3 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-xs text-xs">
                <p className="font-bold text-blue-200">Built on HCI Principles:</p>
                <p className="text-slate-200 mt-0.5 text-[11px]">
                  Shneiderman's 8 Golden Rules, 7 Universal Design Principles & Recognition over Recall.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 relative z-10 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-blue-200">
            <span>B.Tech AI & Data Science</span>
            <span>Semester VII</span>
          </div>

          {/* Background circles */}
          <div className="absolute -bottom-16 -right-16 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Right Side: University SSO Login Form & 1-Click Persona Demos */}
        <div className="md:col-span-7 p-8 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Student Portal Sign In</h3>
                <p className="text-xs text-slate-500 mt-0.5">Use your official NMIMS college email</p>
              </div>
              <button
                onClick={() => setHciModalOpen(true)}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors"
                title="View HCI System Design"
              >
                <HelpCircle className="w-5 h-5 text-amber-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">NMIMS Student Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="student@nmims.edu.in"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setForgotModal(true)}
                    className="text-blue-600 hover:underline text-[11px] font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In via NMIMS SSO</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Persona Fast-Logins */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                ⚡ Instant Evaluation Fast-Login (Select Persona):
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {allUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => login(user)}
                    className="p-2.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-2xl text-left transition-all flex items-center gap-2.5 group"
                  >
                    <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate group-hover:text-blue-700">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.rollNo} • {user.personaTitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-[11px] text-slate-400">
            CampusMate Human-Centered Design Prototype • 2026
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Reset College Password</h3>
              <button onClick={() => setForgotModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {resetSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs text-center space-y-1">
                <p className="font-bold">Password Reset Link Sent!</p>
                <p className="text-emerald-600">Please check your NMIMS student inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-4 text-xs">
                <p className="text-slate-600 leading-relaxed">
                  Enter your registered NMIMS email. We'll send an authenticated password reset link to your student inbox.
                </p>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Email</label>
                  <input
                    type="email"
                    required
                    placeholder="student@nmims.edu.in"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
