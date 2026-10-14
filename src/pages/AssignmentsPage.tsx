import React, { useState } from 'react';
import { 
  FileCheck2, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Tag, 
  Filter, 
  UploadCloud,
  X,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PriorityLevel, Assignment } from '../types';

export const AssignmentsPage: React.FC = () => {
  const { assignments, toggleAssignmentComplete, addAssignment, deleteAssignment } = useApp();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Completed'>('Pending');
  const [priorityFilter, setPriorityFilter] = useState<'All' | PriorityLevel>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New assignment form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Human Computer Interaction');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('High');
  const [newDescription, setNewDescription] = useState('');
  const [formError, setFormError] = useState('');

  const filteredAssignments = assignments.filter(a => {
    const matchesStatus = 
      activeFilter === 'All' ? true :
      activeFilter === 'Pending' ? !a.completed : a.completed;

    const matchesPriority = 
      priorityFilter === 'All' ? true : a.priority === priorityFilter;

    return matchesStatus && matchesPriority;
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('Please enter a valid title for the assignment.');
      return;
    }
    if (!newDueDate) {
      setFormError('Please select a deadline date.');
      return;
    }

    addAssignment({
      title: newTitle.trim(),
      subject: newSubject,
      dueDate: newDueDate,
      dueTime: '11:59 PM',
      deadlineRelative: 'Due soon',
      priority: newPriority,
      completed: false,
      submissionType: 'File Upload',
      description: newDescription.trim() || 'No description provided.',
      points: 20,
      tags: ['Coursework', newSubject.split(' ')[0]]
    });

    setNewTitle('');
    setNewDueDate('');
    setNewDescription('');
    setFormError('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header and Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Assignments & Deadlines</h2>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">
              {assignments.filter(a => !a.completed).length} Pending
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Prioritized submission pipeline with High/Medium/Low urgency tags and instant completion tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Tabs */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200">
            {(['Pending', 'Completed', 'All'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeFilter === tab
                    ? 'bg-white text-blue-600 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-2xl focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">All caught up!</h3>
            <p className="text-xs text-slate-400 mt-1">No assignments found matching the selected filter.</p>
          </div>
        ) : (
          filteredAssignments.map((asg) => (
            <div
              key={asg.id}
              className={`bg-white rounded-3xl p-5 border transition-all ${
                asg.completed 
                  ? 'border-slate-200 bg-slate-50/50 opacity-80' 
                  : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
              } flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}
            >
              <div className="flex items-start gap-3.5">
                {/* Complete Checkbox (Shneiderman Rule #3 & #6) */}
                <button
                  onClick={() => toggleAssignmentComplete(asg.id)}
                  className="mt-1 p-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                  title={asg.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {asg.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <div className="w-6 h-6 rounded-lg border-2 border-slate-300 hover:border-emerald-500 transition-colors" />
                  )}
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {asg.subject}
                    </span>

                    {/* Priority Badge */}
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      asg.priority === 'High'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : asg.priority === 'Medium'
                        ? 'bg-orange-100 text-orange-900 border border-orange-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      {asg.priority} Priority
                    </span>

                    <span className="text-[11px] text-slate-400">
                      {asg.points} Marks
                    </span>
                  </div>

                  <h3 className={`text-base font-bold leading-snug ${
                    asg.completed ? 'line-through text-slate-400' : 'text-slate-900'
                  }`}>
                    {asg.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                    {asg.description}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> {asg.deadlineRelative}
                    </span>
                    <span>•</span>
                    <span className="text-slate-400">Submission format: {asg.submissionType}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => deleteAssignment(asg.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Delete assignment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Assignment Modal (Error Prevention & Form Guidance) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Add New Assignment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Heuristic Evaluation Report"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject *</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="Human Computer Interaction">Human Computer Interaction</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Data Mining">Data Mining</option>
                    <option value="Database Management Systems">DBMS</option>
                    <option value="Cloud Computing & DevOps">Cloud Computing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority Level *</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Task Instructions / Description</label>
                <textarea
                  rows={3}
                  placeholder="Details, rubric points or upload links..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
