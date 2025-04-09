import { Brain, Sun, Camera, ChevronRight, Bell, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getProfile, updateProfile, uploadProfileImage, deleteAccount } from '../hooks/profile';
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
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    notificationsEnabled: true,
    darkMode: false,
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profData = await getProfile();
        setProfileData({
          name: profData.data.name || '',
          email: profData.data.email || '',
          bio: profData.data.bio || '',
          location: profData.data.location || '',
          website: profData.data.website || '',
          notificationsEnabled: profData.data.prefrences?.notificationsEnabled ?? true,
          darkMode: profData.data.prefrences?.darkMode ?? false,
          profileImage: profData.data.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  type ToggleableFields = 'notificationsEnabled' | 'darkMode';
  const handleToggle = (field: ToggleableFields) => {
    setProfileData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    // Mock save functionality
    /*console.log('Saving profile...', {
      name,
      email,
      bio,
      location,
      website,
      notificationsEnabled,
      darkMode
    });*/

    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await updateProfile({
        name: profileData.name,
        email: profileData.email,
        bio: profileData.bio,
        location: profileData.location,
        website: profileData.website,
        prefrences: {
          notificationsEnabled: profileData.notificationsEnabled,
          darkMode: profileData.darkMode
        },
      });
      
      setProfileData(prev => ({
        ...prev,
        ...updatedProfile,
        notificationsEnabled: updatedProfile.data.prefrences?.notificationsEnabled ?? prev.notificationsEnabled,
        darkMode: updatedProfile.data.prefrences?.darkMode ?? prev.darkMode
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  console.log('Profile image path:', profileData.profileImage);

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    console.log(file);
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await uploadProfileImage(file);
      setProfileData(prev => ({ ...prev, profileImage: data.profileImage }));
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await deleteAccount();
      onLogout(); // Call logout after successful deletion
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
                    src={`http://localhost:5000${profileData.profileImage}`}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white"
                  />
                  <label className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md hover:bg-gray-50 cursor-pointer">
                    <Camera className="w-4 h-4 text-gray-600" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
              {/* Profile Content */}
              <div className="pt-16 px-8 pb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{profileData.name}</h1>
                <p className="text-gray-600">{profileData.email}</p>

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
                          name="name"
                          value={profileData.name}
                          onChange={handleChange}
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
                          name="email"
                          value={profileData.email}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          value={profileData.bio}
                          onChange={handleChange}
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
                          name="location"
                          value={profileData.location}
                          onChange={handleChange}
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
                          name="website"
                          value={profileData.website}
                          onChange={handleChange}
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
                          onClick={() => handleToggle('notificationsEnabled')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            profileData.notificationsEnabled ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              profileData.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
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
                          onClick={() => handleToggle('darkMode')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            profileData.darkMode ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              profileData.darkMode ? 'translate-x-6' : 'translate-x-1'
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
                  <button 
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="w-full flex items-center justify-between py-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
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