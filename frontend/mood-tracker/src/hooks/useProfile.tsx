// hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { getProfile, updateProfile, uploadProfileImage, deleteAccount } from '../utils/profileUtils';

export function useProfile() {
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
      return true; // Indicate success
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
      setIsDeleting(false);
      return false;
    }
  };

  return {
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
  };
}