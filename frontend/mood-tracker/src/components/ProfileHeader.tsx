// components/ProfileHeader.tsx
import { Camera } from 'lucide-react';
export function ProfileHeader({ profileImage, onImageUpload }: { 
    profileImage: string; 
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void 
  }) {
    return (
      <div className="relative h-40 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="absolute -bottom-16 left-8">
          <div className="relative group">
            <img
              src={`http://localhost:5000${profileImage}`}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
            <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 cursor-pointer transition-colors">
              <Camera className="w-5 h-5 text-gray-600" />
              <input 
                type="file" 
                accept="image/*" 
                onChange={onImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    );
  }