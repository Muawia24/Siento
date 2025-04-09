import React from 'react';
import { useState, useEffect } from 'react';
import { Smile, Frown, Meh, LogOut, User, BarChart, Trash2, Calendar, PenLine, Plus, Brain, TrendingUp } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useEntries } from '../hooks/useEntries';
import { useAuth } from '../hooks/useAuth';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);



type MoodCounts = Record<string, number>;

const generateInsights = (entries: any[]) => {
    const moodCounts: MoodCounts = entries.reduce((acc: any, entry) => {
      acc[entry.moodText] = (acc[entry.moodText] || 0) + 1;
      return acc;
    }, {});
  
  
    return {
      moodCounts,
      totalEntries: entries.length
    };
};

export function JournalPage({ onLogout, onProfile }: { onLogout: () => void ;  onProfile: () => void }) {
  const {user} = useAuth();
  const { entries = [], addEntry, deleteEntry, error, loading } = useEntries(user?._id) || {};
  const [journalEntry, setJournalEntry] = useState('');
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [optimisticEntries, setOptimisticEntries] = useState(entries);

  useEffect(() => {
    setOptimisticEntries(entries);
  }, [entries]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalEntry.trim()) return;
    console.log(journalEntry);
    try {
      const newEntry = await addEntry(journalEntry);
      if (newEntry) {
        setOptimisticEntries((prev) => [newEntry, ...prev]);
      }
      // Reset form
    setJournalEntry('');
    } catch(err) {
      console.error("Error adding entry:", err);
    }
  };

  const handleDeleteClick = (entryId: string) => {
    console.log('hereee', entryId);
    setEntryToDelete(entryId);
  };

  const confirmDelete = async () => {
    if (entryToDelete) {
      setOptimisticEntries(prev => prev.filter(e => e._id !== entryToDelete));
      setDeletingId(entryToDelete);
      try {
        await deleteEntry(entryToDelete);
      } catch (error) {
        // Revert if deletion fails
        setOptimisticEntries(entries);
      } finally {
        setDeletingId(null);
        setEntryToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setEntryToDelete(null);
  };

  const insights = generateInsights(entries);

  const moodData = {
    labels: entries.map(entry => 
      new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Mood Trend',
        data:  entries.map(entry => entry.moodScore > 0 ? 1 : entry.moodScore < 0 ? -1 : 0),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        tension: 0.4
      }
    ]
  };

  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        label: 'Sentiment Distribution',
        data: [
          entries.filter(e => e.moodScore > 0).length,
          entries.filter(e => e.moodScore === 0).length,
          entries.filter(e => e.moodScore < 0).length
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(239, 68, 68, 0.6)'
        ]
      }
    ]
  };

  return (
   <div className="min-h-screen bg-gray-50">
         {/* Navigation */}
         <nav className="bg-white border-b border-gray-100">
           <div className="max-w-7xl mx-auto px-4 py-4">
             <div className="flex justify-between items-center">
               <div className="flex items-center space-x-2">
                 <Brain className="w-8 h-8 text-purple-600" />
                 <span className="text-xl font-bold text-gray-900">MoodMind</span>
               </div>
               <div className="flex items-center space-x-4">
                 <button
                   onClick={onProfile}
                   className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                 >
                   <User className="w-5 h-5" />
                   Profile
                 </button>
                 <button
                   onClick={onLogout}
                   className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                 >
                   <LogOut className="w-5 h-5" />
                   Sign out
                 </button>
               </div>
             </div>
           </div>
         </nav>
   
         <div className="max-w-7xl mx-auto px-4 py-8">
           <div className="flex gap-8">
             {/* Left Column - Journal Entry Form and History */}
             <div className="flex-1 space-y-8">
               {/* New Entry Form */}
               <div className="bg-white rounded-2xl shadow-sm p-6">
                 <div className="flex items-center gap-3 mb-6">
                   <PenLine className="w-6 h-6 text-purple-600" />
                   <h2 className="text-2xl font-bold text-gray-900">New Entry</h2>
                 </div>
                 
                 <form onSubmit={handleSubmit} className="space-y-6">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       How are you feeling today?
                     </label>
                     <div className="flex gap-4">
                     </div>
                   </div>
   
                   <div>
                     <label htmlFor="entry" className="block text-sm font-medium text-gray-700 mb-2">
                       What's on your mind?
                     </label>
                     <textarea
                       id="entry"
                       rows={6}
                       value={journalEntry}
                       onChange={(e) => setJournalEntry(e.target.value)}
                       className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                       placeholder="Write your thoughts here..."
                     ></textarea>
                   </div>
   
                   <button
                     type="submit"
                     className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                   >
                     <Plus className="w-5 h-5" />
                     <span>Add Entry</span>
                   </button>
                 </form>
               </div>
   
               {/* Journal Entries List */}
               <div className="space-y-6">
                 <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-bold text-gray-900">Your Journal</h2>
                   <div className="flex items-center gap-2 text-sm text-gray-600">
                     <Calendar className="w-5 h-5" />
                     <span>Filter by date</span>
                   </div>
                 </div>

                 {/* Loading & Error Handling */}
                 {loading && <p className="text-gray-600">Loading...</p>}
                 {error && <p className="text-red-500">{error}</p>}
   
                 <div className="space-y-4">
                   {optimisticEntries.map((entry) => (
                     <div key={entry._id} className="bg-white rounded-xl shadow-sm p-6 transition-shadow hover:shadow-md">
                       <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-2">
                            {entry.moodScore > 0 && <Smile className="w-5 h-5 text-green-500" />}
                            {entry.moodScore === 0 && <Meh className="w-5 h-5 text-blue-500" />}
                            {entry.moodScore < 0 && <Frown className="w-5 h-5 text-red-500" />}
                           <span className="text-sm text-gray-600">
                             {new Date(entry.date).toLocaleDateString('en-US', {
                               weekday: 'long',
                               year: 'numeric',
                               month: 'long',
                               day: 'numeric'
                             })}
                           </span>
                         </div>
                         <button
                            onClick={() => handleDeleteClick(entry._id)}
                            disabled={deletingId === entry._id}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Delete entry"
                          >
                            {deletingId === entry._id ? (
                              <span className="animate-spin">...</span>
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                         
                       </div>
                       <p className="text-gray-700 whitespace-pre-wrap">{entry.moodText}</p>
                     </div>
                   ))}
                </div>
                {/* No Entries Message */}
                {entries.length === 0 && !loading && <p className="text-gray-500">No journal entries yet.</p>}
               </div>
             </div>
   
             {/* Right Column - AI Insights */}
             <div className="w-96 space-y-8">
               <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
                 <div className="flex items-center gap-3 mb-6">
                   <Brain className="w-6 h-6 text-purple-600" />
                   <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
                 </div>
   
                 <div className="space-y-8">
                   <div>
                     <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                       <TrendingUp className="w-5 h-5 text-purple-600" />
                       <span>Mood Trends</span>
                     </h3>
                     <div className="h-48">
                       <Line
                         data={moodData}
                         options={{
                           responsive: true,
                           maintainAspectRatio: false,
                           scales: {
                             y: {
                               beginAtZero: true,
                               max: 1,
                               min: -1,
                               ticks: {
                                 callback: function(value) {
                                   if (value === 1) return 'Happy';
                                   if (value === 0) return 'Neutral';
                                   if (value === -1) return 'Sad';
                                   return '';
                                 }
                               }
                             }
                           }
                         }}
                       />
                     </div>
                   </div>
   
                   <div>
                     <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                       <BarChart className="w-5 h-5 text-purple-600" />
                       <span>Sentiment Analysis</span>
                     </h3>
                     <div className="h-48">
                       <Bar
                         data={sentimentData}
                         options={{
                           responsive: true,
                           maintainAspectRatio: false,
                         }}
                       />
                     </div>
                   </div>
   
                   <div className="grid grid-cols-2 gap-4">
                     <div className="bg-purple-50 rounded-xl p-4">
                       <h4 className="font-medium text-purple-700 mb-1">Total Entries</h4>
                       <p className="text-2xl font-bold text-purple-900">{insights.totalEntries}</p>
                     </div>
                     <div className="bg-green-50 rounded-xl p-4">
                       <h4 className="font-medium text-green-700 mb-1">Most Common Mood</h4>
                       <p className="text-2xl font-bold text-green-900">
                         {Object.entries(insights.moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
         {entryToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl max-w-md w-full">
                <h3 className="text-lg font-bold mb-4">Delete Entry</h3>
                <p className="mb-6">Are you sure you want to delete this journal entry? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    {deletingId === entryToDelete ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
  );
}