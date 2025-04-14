import { Brain, Sun, Bell, LogOut, Loader2, AlertTriangle, XCircle } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileFormField } from '../components/ProfileFormField';
import { ToggleSetting } from '../components/ProfileToggleSettings';
import { DangerZone } from '../components/ProfileDangerZone';

export function ProfilePage({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) {
  const {
    profileData,
    isLoading,
    error,
    isSaving,
    isDeleting,
    setIsDeleting,
    handleChange,
    handleToggle,
    handleSave,
    handleImageUpload,
    handleDeleteAccount
  } = useProfile();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBar onBack={onBack} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <ProfileHeader 
              profileImage={profileData.profileImage} 
              onImageUpload={handleImageUpload} 
            />

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
                      <ProfileFormField
                        id="name"
                        name="name"
                        label="Name"
                        value={profileData.name}
                        onChange={handleChange}
                      />
                      <ProfileFormField
                        id="email"
                        name="email"
                        label="Email"
                        value={profileData.email}
                        onChange={handleChange}
                        type="email"
                      />
                      <ProfileFormField
                        id="bio"
                        name="bio"
                        label="Bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        textarea
                        placeholder="Tell us about yourself"
                      />
                      <ProfileFormField
                        id="location"
                        name="location"
                        label="Location"
                        value={profileData.location}
                        onChange={handleChange}
                        placeholder="City, Country"
                      />
                      <ProfileFormField
                        id="website"
                        name="website"
                        label="Website"
                        value={profileData.website}
                        onChange={handleChange}
                        type="url"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  {/* Preferences Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
                    <div className="space-y-4">
                      <ToggleSetting
                        icon={Bell}
                        title="Notifications"
                        description="Receive daily reminders and insights"
                        enabled={profileData.notificationsEnabled}
                        onToggle={() => handleToggle('notificationsEnabled')}
                      />
                      <ToggleSetting
                        icon={Sun}
                        title="Dark Mode"
                        description="Toggle dark mode theme"
                        enabled={profileData.darkMode}
                        onToggle={() => handleToggle('darkMode')}
                      />
                    </div>
                  </div>

                  <FormActions isSaving={isSaving} onCancel={onBack} />
                </div>
              </div>

              <DangerZone 
                onDelete={async () => {
                  const success = await handleDeleteAccount();
                  if (success) onLogout();
                }} 
                isDeleting={isDeleting} 
              />
            </form>
          </div>
        </div>
      </div>

      {isDeleting && <DeleteConfirmationModal onCancel={() => setIsDeleting(false)} onConfirm={handleDeleteAccount} />}
    </div>
  );
}

// Additional small components
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
    </div>
  );
}

function ErrorScreen({ error }: { error: string }) {
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

function NavBar({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) {
  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-30 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
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
  );
}

function FormActions({ isSaving, onCancel }: { isSaving: boolean; onCancel: () => void }) {
  return (
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
        onClick={onCancel}
        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
      >
        Cancel
      </button>
    </div>
  );
}

function DeleteConfirmationModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
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
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}