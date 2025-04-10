import { Brain, Sun, Camera, ChevronRight, Bell, LogOut, Loader2, AlertTriangle, User, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getProfile, updateProfile, uploadProfileImage, deleteAccount } from '../hooks/profile';

export function ProfilePage({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    notificationsEnabled: true,
    darkMode: false,
    profileImage: '/default-profile.jpg'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        console.log(data.profileImage);
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          bio: data.bio || '',
          location: data.location || '',
          website: data.website || '',
          notificationsEnabled: data.preferences?.notificationsEnabled ?? true,
          darkMode: data.preferences?.darkMode ?? false,
          profileImage: data.profileImage || '/default-profile.jpg'
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (field: 'notificationsEnabled' | 'darkMode') => {
    setProfileData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      const { data } = await updateProfile({
        name: profileData.name,
        email: profileData.email,
        bio: profileData.bio,
        location: profileData.location,
        website: profileData.website,
        preferences: {
          notificationsEnabled: profileData.notificationsEnabled,
          darkMode: profileData.darkMode
        }
      });
      
      setProfileData(prev => ({
        ...prev,
        ...data,
        notificationsEnabled: data.preferences?.notificationsEnabled ?? prev.notificationsEnabled,
        darkMode: data.preferences?.darkMode ?? prev.darkMode
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
    
    setIsDeleting(true);
    setError(null);
    
    try {
      await deleteAccount();
      onLogout();
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Error loading profile</h3>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <div className="mt-5">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
   
      <nav className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-30 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button 
                onClick={onBack} 
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <div className="flex items-center space-x-2">
                <Brain className="w-7 h-7 text-purple-600" />
                <span className="text-xl font-bold text-gray-900 tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  MoodMind
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
            {/* Profile Header - Similar to Journal Entry Card */}
            <div className="relative h-40 bg-gradient-to-r from-purple-600 to-blue-600">
              <div className="absolute -bottom-16 left-8">
                <div className="relative group">
                  <img
                    src={`http://localhost:5000${profileData.profileImage}`}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                  />
                  <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 cursor-pointer transition-colors">
                    <Camera className="w-5 h-5 text-gray-600" />
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
              <div className="pt-20 px-8 pb-8">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                  <p className="text-gray-600">{profileData.email}</p>
                </div>

                <div className="space-y-8">
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          value={profileData.bio}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferences Section - Similar to Journal Stats */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <Bell className="w-5 h-5 text-gray-500" />
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
                      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
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

                  {/* Save/Cancel Buttons - Matches Journal Page Style */}
                  <div className="flex gap-4 pt-6">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-70"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={onBack}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone - Similar to Delete Entry Modal */}
              <div className="border-t border-gray-200 px-8 py-6">
                <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
                <div className="space-y-4">
                  <button 
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="w-full flex items-center justify-between p-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <LogOut className="w-5 h-5" />
                      <div>
                        <h3 className="text-sm font-medium">Delete Account</h3>
                        <p className="text-sm opacity-75">Permanently delete your account and all data</p>
                      </div>
                    </div>
                    {isDeleting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal - Matches Journal Page */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-bold text-gray-900">Delete Account</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleting(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    'Delete Account'
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