import React, { useState, useEffect } from 'react';
import { 
  Smile, BarChart, TrendingUp, AlertTriangle, XCircle, Loader2 
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
import { startOfWeek, format } from 'date-fns';

import { useEntries } from '../hooks/useEntries';
import { useAuth } from '../hooks/useAuth';
import { WeeklyView } from '../components/WeeklyView';
import { Navigation } from '../components/Navigation';
import { NewEntryForm } from '../components/NewEntryForm';
import { StatsGrid } from '../components/StatsCard';
import { 
  generateInsights, 
  filterEntriesByWeek 
} from '../utils/journalUtils';
import { 
  getMoodChartData, 
  getSentimentChartData, 
  moodChartOptions, 
  sentimentChartOptions 
} from '../utils/chartUtils';
import { JournalPageProps, JournalEntry } from '../types/journal';

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

export function JournalPage({ onLogout, onProfile }: JournalPageProps) {
  const { user } = useAuth();
  const { entries = [], addEntry, deleteEntry, error, loading } = useEntries(user?._id) || {};
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [optimisticEntries, setOptimisticEntries] = useState<JournalEntry[]>(entries);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => {
    setOptimisticEntries(entries);
  }, [entries]);

  const handleAddEntry = async (content: string) => {
    const newEntry = await addEntry(content);
    if (newEntry) {
      setOptimisticEntries(prev => [newEntry, ...prev]);
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

  const handleWeekChange = (newWeek: Date) => {
    setCurrentWeek(newWeek);
  };

  const currentWeekEntries = filterEntriesByWeek(optimisticEntries, currentWeek);
  const insights = generateInsights(currentWeekEntries);
  const moodData = getMoodChartData(currentWeekEntries);
  const sentimentData = getSentimentChartData(currentWeekEntries);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation onProfile={onProfile} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Journal Content */}
          <div className="lg:col-span-2 space-y-8">
            <NewEntryForm onSubmit={handleAddEntry} />

            {/* Weekly View Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Weekly View</h2>
              </div>

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

              <WeeklyView 
                entries={currentWeekEntries}
                onDelete={handleDeleteClick}
                deletingId={deletingId}
                currentWeek={currentWeek}
                onWeekChange={handleWeekChange}
              />
            </div>
          </div>

          {/* Right Column - Analytics */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <Smile className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Your Mood Insights</h2>
              </div>

              <div className="space-y-8">
                {/* Mood Trends */}
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span>Mood Trends - Week of {format(startOfWeek(currentWeek), 'MMM d')}</span>
                  </h3>
                  <div className="h-60">
                    <Line data={moodData} options={moodChartOptions} />
                  </div>
                </div>

                {/* Sentiment Analysis */}
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <BarChart className="w-5 h-5 text-purple-600" />
                    <span>Sentiment Analysis</span>
                  </h3>
                  <div className="h-60">
                    <Bar data={sentimentData} options={sentimentChartOptions} />
                  </div>
                </div>

                <StatsGrid insights={insights} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {entryToDelete && (
        <DeleteConfirmationModal
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
          isDeleting={deletingId === entryToDelete}
        />
      )}
    </div>
  );
}

const DeleteConfirmationModal: React.FC<{
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}> = ({ onCancel, onConfirm, isDeleting }) => (
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
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
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
);