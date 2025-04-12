import { useState, useEffect } from 'react';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, addWeeks } from 'date-fns';
import { ArrowLeft, ArrowRight, Calendar, Trash2, Loader2, Smile, Frown, Meh, BookOpen, Sparkles } from 'lucide-react';
import { useEntries } from '../hooks/useEntries';
import { useAuth } from '../hooks/useAuth';

interface WeeklyViewProps {
  entries: any[];
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export function WeeklyView({ entries, onDelete, deletingId }: WeeklyViewProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
   const { user } = useAuth();
    const { loading } = useEntries(user?._id) || {};
  
  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getEntriesForDay = (day: Date) => {
    return entries.filter(entry => 
      new Date(entry.date).toDateString() === day.toDateString()
    );
  };

  

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(addWeeks(currentWeek, direction === 'prev' ? -1 : 1));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Weekly Journal</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigateWeek('prev')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </span>
          </div>
          <button 
            onClick={() => navigateWeek('next')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {weekDays.map(day => {
          const dayEntries = getEntriesForDay(day);
          return (
            <div key={day.toString()} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {format(day, 'EEEE, MMMM d')}
              </h3>
              
              {dayEntries.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-xl shadow-sm">
                  <div className="mx-auto h-16 w-16 text-gray-400">
                    <BookOpen className="w-full h-full opacity-50" />
                  </div>
                  <p className="mt-2 text-gray-500">No entries for this day</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dayEntries.map(entry => (
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
                            {format(new Date(entry.date), 'h:mm a')}
                          </span>
                        </div>
                        <button
                          onClick={() => onDelete(entry._id)}
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
                      {entry.aiResponse && (
                        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <h4 className="text-sm font-semibold text-purple-900">AI Insights</h4>
                          </div>
                          <p className="text-sm text-purple-800">{entry.aiResponse}</p>
                        </div>
                      )}
                      {loading && (
                        <div className="mt-4 flex items-center gap-2 text-purple-600">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Analyzing your entry...</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}