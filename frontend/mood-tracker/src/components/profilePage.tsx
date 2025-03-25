import { Brain, Sun, Camera, ChevronRight, Bell, LogOut } from 'lucide-react';
import { useState } from 'react';
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


export function ProfilePage({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [bio, setBio] = useState('UI/UX Designer & Developer');
  const [location, setLocation] = useState('San Francisco, CA');
  const [website, setWebsite] = useState('https://johndoe.com');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');

  const handleSave = () => {
    // Mock save functionality
    console.log('Saving profile...', {
      name,
      email,
      bio,
      location,
      website,
      notificationsEnabled,
      darkMode
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
                ← Back
              </button>
              <div className="flex items-center space-x-2">
                <Brain className="w-8 h-8 text-purple-600" />
                <span className="text-xl font-bold text-gray-900">MoodMind</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Profile Header */}
            <div className="relative h-32 bg-purple-600">
              <div className="absolute -bottom-12 left-8">
                <div className="relative">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white"
                  />
                  <button className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md hover:bg-gray-50">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
              {/* Profile Content */}
              <div className="pt-16 px-8 pb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{name}</h1>
                <p className="text-gray-600">{email}</p>

                {/* Profile Sections */}
                <div className="mt-8 space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Tell us about yourself"
                        />
                      </div>
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="City, Country"
                        />
                      </div>
                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <input
                          type="url"
                          id="website"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <Bell className="w-5 h-5 text-gray-400" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                            <p className="text-sm text-gray-500">Receive daily reminders and insights</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notificationsEnabled ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Sun className="w-5 h-5 text-gray-500" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Dark Mode</h3>
                            <p className="text-sm text-gray-500">Toggle dark mode theme</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDarkMode(!darkMode)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            darkMode ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              darkMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={onBack}
                      className="flex-1 bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between py-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <LogOut className="w-5 h-5" />
                      <div>
                        <h3 className="text-sm font-medium">Delete Account</h3>
                        <p className="text-sm opacity-75">Permanently delete your account and all data</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}