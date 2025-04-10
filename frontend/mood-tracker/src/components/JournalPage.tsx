import React from 'react';
import { useState, useEffect } from 'react';
import { 
  Smile, Frown, Meh, LogOut, User, BarChart, Trash2, Calendar, 
  PenLine, Plus, Brain, TrendingUp, Loader2, AlertTriangle, 
  Activity, BookOpen, XCircle 
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
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
type MoodScore = -1 | 0 | 1;

interface eany {
  _id: string;
  moodText: string;
  moodScore: MoodScore;
  date: string;
}

const generateInsights = (entries: any[]) => {
  const moodCounts: MoodCounts = entries.reduce((acc, entry) => {
    const mood = entry.moodScore > 0 ? 'Happy' : entry.moodScore === 0 ? 'Neutral' : 'Sad';
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {} as MoodCounts);

  const currentStreak = calculateStreak(entries);
  const avgSentiment = calculateAverageSentiment(entries);

  return {
    moodCounts,
    totalEntries: entries.length,
    currentStreak,
    avgSentiment
  };
};

const calculateStreak = (entries: any[]): number => {
  // Implementation for calculating streak
  return entries.length > 0 ? 1 : 0;
};

const calculateAverageSentiment = (entries: any[]): number => {
  if (entries.length === 0) return 0;
  const sum = entries.reduce((total, entry) => total + entry.moodScore, 0);
  return sum / entries.length;
};

export function JournalPage({ onLogout, onProfile }: { onLogout: () => void; onProfile: () => void }) {
  const { user } = useAuth();
  const { entries = [], addEntry, deleteEntry, error, loading } = useEntries(user?._id) || {};
  const [journalEntry, setJournalEntry] = useState('');
  const [moodScore, setMoodScore] = useState<MoodScore | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [optimisticEntries, setOptimisticEntries] = useState<any[]>(entries);

  useEffect(() => {
    setOptimisticEntries(entries);
  }, [entries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalEntry.trim()) return;
    
    try {
      const newEntry = await addEntry(journalEntry);
      
      if (newEntry) {
        setOptimisticEntries(prev => [newEntry, ...prev]);
        setJournalEntry('');
        setMoodScore(null);
      }
    } catch (err) {
      console.error("Error adding entry:", err);
    }
  };

  const handleDeleteClick = (entryId: string) => {
    setEntryToDelete(entryId);
  };

  const confirmDelete = async () => {
    if (!entryToDelete) return;
    
    setDeletingId(entryToDelete);
    try {
      await deleteEntry(entryToDelete);
      setOptimisticEntries(prev => prev.filter(e => e._id !== entryToDelete));
    } catch (error) {
      console.error("Error deleting entry:", error);
      setOptimisticEntries(entries);
    } finally {
      setDeletingId(null);
      setEntryToDelete(null);
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
        data: entries.map(entry => entry.moodScore),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        tension: 0.4,
        pointBackgroundColor: entries.map(entry => 
          entry.moodScore > 0 ? '#4ade80' : 
          entry.moodScore < 0 ? '#f87171' : '#60a5fa'
        )
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
          'rgba(34, 197, 94, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-30 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Brain className="w-7 h-7 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900 tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MoodMind
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={onProfile}
                className="relative group px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100/50"
              >
                <div className="flex items-center gap-2 text-gray-700 group-hover:text-purple-600">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </div>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button 
                onClick={onLogout}
                className="relative group px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100/50"
              >
                <div className="flex items-center gap-2 text-gray-700 group-hover:text-red-500">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign out</span>
                </div>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Journal Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* New Entry Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <PenLine className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">New Journal Entry</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
              <div>
              </div>
                
                <div>
                  <label htmlFor="entry" className="block text-sm font-semibold text-gray-700 mb-3">
                    What's on your mind?
                  </label>
                  <textarea
                    id="entry"
                    rows={5}
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    placeholder="Write your thoughts here..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!journalEntry.trim()}
                  className="w-full flex justify-center items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add Entry</span>
                </button>
              </form>
            </div>

            {/* Journal Entries Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Your Journal History</h2>
                <div className="relative">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors">
                    <Calendar className="w-5 h-5" />
                    <span>Filter by date</span>
                  </button>
                </div>
              </div>

              {/* Loading and Error States */}
              {loading && (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600"></div>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Entries List */}
              <div className="space-y-4">
                {optimisticEntries.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="mx-auto h-24 w-24 text-gray-400">
                      <BookOpen className="w-full h-full opacity-50" />
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No journal entries yet</h3>
                    <p className="mt-1 text-gray-500">Start by adding your first journal entry above.</p>
                  </div>
                )}

                {optimisticEntries.map((entry) => (
                  <div
                    key={entry._id}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            entry.moodScore > 0
                              ? 'bg-green-100 text-green-600'
                              : entry.moodScore === 0
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {entry.moodScore > 0 ? (
                            <Smile className="w-5 h-5" />
                          ) : entry.moodScore === 0 ? (
                            <Meh className="w-5 h-5" />
                          ) : (
                            <Frown className="w-5 h-5" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteClick(entry._id)}
                        disabled={deletingId === entry._id}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200"
                      >
                        {deletingId === entry._id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{entry.moodText}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Analytics */}
          <div className="space-y-8">
            {/* Insights Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Your Mood Insights</h2>
              </div>

              <div className="space-y-8">
                {/* Mood Trends */}
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span>Mood Trends</span>
                  </h3>
                  <div className="h-60">
                    <Line
                      data={moodData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const value = context.raw as number;
                                return value === 1 ? 'Happy' : value === 0 ? 'Neutral' : 'Sad';
                              }
                            }
                          }
                        },
                        scales: {
                          y: {
                            min: -1,
                            max: 1,
                            ticks: {
                              callback: (value) => {
                                if (value === 1) return '😊 Happy';
                                if (value === 0) return '😐 Neutral';
                                if (value === -1) return '😞 Sad';
                                return '';
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Sentiment Analysis */}
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <BarChart className="w-5 h-5 text-purple-600" />
                    <span>Sentiment Analysis</span>
                  </h3>
                  <div className="h-60">
                    <Bar
                      data={sentimentData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                      <h4 className="text-sm font-semibold text-purple-700">Total Entries</h4>
                    </div>
                    <p className="text-2xl font-bold text-purple-900">{insights.totalEntries}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Smile className="w-4 h-4 text-green-600" />
                      <h4 className="text-sm font-semibold text-green-700">Most Common Mood</h4>
                    </div>
                    <p className="text-2xl font-bold text-green-900">
                      {Object.entries(insights.moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <h4 className="text-sm font-semibold text-blue-700">Active Streak</h4>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{insights.currentStreak} days</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-4 h-4 text-amber-600" />
                      <h4 className="text-sm font-semibold text-amber-700">Avg. Sentiment</h4>
                    </div>
                    <p className="text-2xl font-bold text-amber-900">
                      {insights.avgSentiment > 0 ? 'Positive' : insights.avgSentiment < 0 ? 'Negative' : 'Neutral'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {entryToDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-bold text-gray-900">Delete Journal Entry</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this journal entry? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingId === entryToDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {deletingId === entryToDelete ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}