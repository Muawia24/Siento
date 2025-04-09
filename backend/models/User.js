import mongoose from "mongoose";
import validator from 'validator';

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    createdAt: { type: Date, default: Date.now },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot be more than 500 characters'],
        default: ''
      },
      location: {
        type: String,
        maxlength: [100, 'Location cannot be more than 100 characters'],
        default: ''
      },
      website: { 
        type: String, 
        default: '' 
    },
      profileImage: { type: String,
        default: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      preferences: {
        notificationsEnabled: { type: Boolean, default: true },
        darkMode: { type: Boolean, default: false}
      }
});

const User = mongoose.model('User', userSchema);

export default User;