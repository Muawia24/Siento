// api/profile.ts
import api from '../utils/api'; // Your base API instance
import axios, { isAxiosError } from 'axios';


export type ProfileData = {
  _id?: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  profileImage?: string;
  preferences?: {
    notificationsEnabled?: boolean;
    darkMode?: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
};
type ProfileImageResponse = {
  profileImage: string;
};
type ProfileApiResponse<T> = {
  data: T;
  message?: string;
  status: number;
};

export const getProfile = async (): Promise<ProfileApiResponse<ProfileData>> => {
  try {
    const response = await api.get<ProfileData>('/profile');
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw {
        message: 'Failed to fetch profile',
        status: error.response?.status,
        errors: error.response?.data?.errors,
      };
    }
    throw {
      message: 'An unexpected error occurred',
    };
  }
};

export const updateProfile = async (
  profileData: Partial<ProfileData>
): Promise<ProfileApiResponse<ProfileData>> => {
  try {
    const response = await api.put<ProfileData>('/profile-update', profileData);
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw {
        message: 'Failed to fetch profile',
        status: error.response?.status,
        errors: error.response?.data?.errors,
      };
    }
    throw {
      message: 'An unexpected error occurred',
    };
  }
};

export const uploadProfileImage = async (
  file: File
): Promise<ProfileApiResponse<ProfileImageResponse>> => {
  try {
    const formData = new FormData();
    formData.append('profileImage', file);
    
    const response = await api.put<ProfileImageResponse>(
      '/profile-update/picture',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: unknown) {
    console.log(error);
    if (isAxiosError(error)) {
      throw {
        message: 'Failed to fetch profile',
        status: error.response?.status,
        errors: error.response?.data?.errors,
      };
    }
    throw {
      message: 'An unexpected error occurred',
    };
  }
};

export const deleteAccount = async (): Promise<ProfileApiResponse<{ message: string }>> => {
  try {
    const response = await api.delete<{ message: string }>('/delete-account');
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw {
        message: 'Failed to fetch profile',
        status: error.response?.status,
        errors: error.response?.data?.errors,
      };
    }
    throw {
      message: 'An unexpected error occurred',
    };
  }
};