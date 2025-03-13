import React from 'react';
import { useState } from 'react';
import { Smile, Frown, Meh, Sun, CloudRain, CloudSun, Lightbulb, BarChart, Calendar, PenLine, Plus, Brain, TrendingUp } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

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

const analyzeSentiment = (text: string) => {
    // Simple mock sentiment analysis
    const words = text.toLowerCase().split(' ');
    const positiveWords = ['happy', 'good', 'great', 'excellent', 'amazing', 'wonderful', 'joy'];
    const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'unhappy', 'frustrated', 'angry'];
    
    let score = 0;
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });
    
    return score;
};

type MoodCounts = Record<string, number>;
type WeatherImpact = Record<string, { count: number; moodSum: number }>;

const generateInsights = (entries: any[]) => {
    const moodCounts: MoodCounts = entries.reduce((acc: any, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});
  
    const weatherImpact : WeatherImpact = entries.reduce((acc: any, entry) => {
      if (!acc[entry.weather]) acc[entry.weather] = { count: 0, moodSum: 0 };
      acc[entry.weather].count += 1;
      acc[entry.weather].moodSum += entry.mood === 'happy' ? 1 : entry.mood === 'sad' ? -1 : 0;
      return acc;
    }, {});
  
    return {
      moodCounts,
      weatherImpact,
      totalEntries: entries.length
    };
};

function JournalPage({ onLogout }: { onLogout: () => void }) {
  const [selectedDate] = useState(new Date());
  const [mood, setMood] = useState<'happy' | 'neutral' | 'sad' | null>(null);
  const [weather, setWeather] = useState<'sunny' | 'cloudy' | 'rainy' | null>(null);
  const [journalEntry, setJournalEntry] = useState('');
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [entries, setEntries] = useState<Array<{
    id: number;
    date: Date;
    mood: string;
    weather: string;
    content: string;
    sentiment: number;
  }>>([
    {
      id: 1,
      date: new Date(),
      mood: 'happy',
      weather: 'sunny',
      content: 'Today was a productive day! I accomplished all my tasks and had time for self-care.',
      sentiment: 2
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood || !weather || !journalEntry.trim()) return;

    const sentiment = analyzeSentiment(journalEntry);

    setEntries([...entries, {
      id: Date.now(),
      date: selectedDate,
      mood,
      weather,
      content: journalEntry,
      sentiment
    }]);

    // Reset form
    setMood(null);
    setWeather(null);
    setJournalEntry('');
  };

  const insights = generateInsights(entries);

  const moodData = {
    labels: entries.map(entry => 
      new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Mood Trend',
        data: entries.map(entry => entry.mood === 'happy' ? 1 : entry.mood === 'sad' ? -1 : 0),
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
          entries.filter(e => e.sentiment > 0).length,
          entries.filter(e => e.sentiment === 0).length,
          entries.filter(e => e.sentiment < 0).length
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
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">MoodMind</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAIInsights(!showAIInsights)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  showAIInsights 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Lightbulb className="w-5 h-5" />
                <span>AI Insights</span>
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* New Entry Form */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-6">
                <PenLine className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">New Journal Entry</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How are you feeling today?
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setMood('happy')}
                      className={`p-3 rounded-lg flex items-center space-x-2 ${
                        mood === 'happy' ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      <Smile className="w-6 h-6" />
                      <span>Happy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMood('neutral')}
                      className={`p-3 rounded-lg flex items-center space-x-2 ${
                        mood === 'neutral' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      <Meh className="w-6 h-6" />
                      <span>Neutral</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMood('sad')}
                      className={`p-3 rounded-lg flex items-center space-x-2 ${
                        mood === 'sad' ? 'bg-red-100 text-red-700' : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      <Frown className="w-6 h-6" />
                      <span>Sad</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How's the weather?
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setWeather('sunny')}
                      className={`p-3 rounded-lg flex items-center space-x-2 ${
                        weather === 'sunny' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      <Sun className="w-6 h-6" />
                      <span>Sunny</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeather('cloudy')}
                      className={`p-3 rounded-lg flex items-center space-x-2 ${
                        weather === 'cloudy' ? 'bg-gray-200 text-gray-700' : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      <CloudSun className="w-6 h-6" />
                      <span>Cloudy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeather('rainy')}
                      className={`p-3 rounded-lg flex items-center space-x-2 ${
                        weather === 'rainy' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      <CloudRain className="w-6 h-6" />
                      <span>Rainy</span>
                    </button>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Write your thoughts here..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center items-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Entry</span>
                </button>
              </form>
            </div>

            {showAIInsights && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <span>Mood Trends</span>
                    </h3>
                    <div className="h-64">
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
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                      <BarChart className="w-5 h-5 text-purple-600" />
                      <span>Sentiment Analysis</span>
                    </h3>
                    <div className="h-64">
                      <Bar
                        data={sentimentData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-medium text-purple-700 mb-2">Total Entries</h4>
                      <p className="text-2xl font-bold text-purple-900">{insights.totalEntries}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-700 mb-2">Most Common Mood</h4>
                      <p className="text-2xl font-bold text-green-900">
                        {Object.entries(insights.moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-700 mb-2">Best Weather Impact</h4>
                      <p className="text-2xl font-bold text-blue-900">
                        {Object.entries(insights.weatherImpact)
                          .sort((a, b) => (b[1].moodSum / b[1].count) - (a[1].moodSum / a[1].count))[0]?.[0] || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Journal Entries List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Your Journal</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>Filter by date</span>
              </div>
            </div>

            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {entry.mood === 'happy' && <Smile className="w-5 h-5 text-green-500" />}
                      {entry.mood === 'neutral' && <Meh className="w-5 h-5 text-blue-500" />}
                      {entry.mood === 'sad' && <Frown className="w-5 h-5 text-red-500" />}
                      <span className="text-sm text-gray-600">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div>
                      {entry.weather === 'sunny' && <Sun className="w-5 h-5 text-yellow-500" />}
                      {entry.weather === 'cloudy' && <CloudSun className="w-5 h-5 text-gray-500" />}
                      {entry.weather === 'rainy' && <CloudRain className="w-5 h-5 text-blue-500" />}
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JournalPage;