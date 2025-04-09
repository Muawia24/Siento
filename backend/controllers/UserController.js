import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default class UsersController {
    static async postNew(req, res) {
        const { name, email, password } = req.body;

        if (!email) {
            res.status(400).send({ error: 'Missing email' });
            return;
        }
        if (!password) {
            res.status(400).send({ error: 'Missing password' });
            return;
        }
        try {
            const user = await User.findOne({ email });

            if (user) {
                res.status(400).send({ error: 'User already exist' });
                return;
              }
            const hashedPwd = await bcrypt.hash(password, 10);

            const newUser = new User({ name, email, password: hashedPwd });
            if (!newUser) {
                return res.status(400).json({ message: 'Invalid user data' });
            }
            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                token: token,
                encryptedPrivateKey: newUser.encryptedPrivateKey,
                publicKey: newUser.publicKey
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Server Error" });
        }
    }

    static async logMe(req, res) {
        const { email, password } = req.body;
        try {
            console.log(email);
            const user = await User.findOne({ email });
            if (!user) {
                console.log('no user found');
                return res.status(401).json({ error: "Invalid email or password" });
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid email or password" });
            }
            console.log(isMatch);

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token,
            });
        } catch(error) {
            console.error(error);
            return res.status(500).json({ error: "Server Error" });
        }
    }
    static async getAllUsers(req, res) {
        try {
            const users = await User.find({});
            console.log(users);
            return res.status(200).json(users);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Server Error" });
        }
    }

    static async verifyEmail(req, res) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
    
            if (!user) return res.status(400).json({ error: 'User not found' });
    
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
            const verificationLink = `http://localhost:3000/verify/${token}`;
    
            await sendEmail(user.email, 'Email Verification', `Click the link to verify: ${verificationLink}`);
    
            res.json({ message: 'Verification email sent' });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async activate(req, res) {
        try {
            const { token } = req.params;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
            const user = await User.findById(decoded.id);
            if (!user) return res.status(400).json({ error: 'Invalid token' });
    
            res.json({ message: 'Email verified successfully' });
        } catch (error) {
            res.status(400).json({ error: 'Invalid or expired token' });
        }
    }

    static async pwdForgot(req, res) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
    
            if (!user) return res.status(400).json({ error: 'User not found' });
    
            const resetToken = crypto.randomBytes(32).toString('hex');
            user.resetToken = resetToken;
            user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
            await user.save();
    
            const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
            await sendEmail(user.email, 'Password Reset', `Click the link to reset: ${resetLink}`);
    
            res.json({ message: 'Password reset email sent' });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async pwdReset(req, res) {
        try {
            const { token } = req.params;
            const { password } = req.body;
    
            const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    
            if (!user) return res.status(400).json({ error: 'Invalid or expired token' });
    
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            user.resetToken = undefined;
            user.resetTokenExpiry = undefined;
            await user.save();
    
            res.json({ message: 'Password reset successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);

        } catch {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async updateProfile(req, res) {
        try {
            const { name, email, bio, location, website, notificationsEnabled, darkMode } = req.body;

            if (req.body.website!== '' && !validator.isURL(req.body.website)) {
                return res.status(400).json({ message: 'Invalid website URL' });
            }

            const updates = {
            name,
            email,
            bio,
            location,
            website,
            preferences: {
                notificationsEnabled,
                darkMode
            }
            };

            const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
            ).select('-password');

            res.json(user);
                
        } catch (error) {
            console.error("Error updating profile:", error);
            res.status(500).json({ error: "Server error" });
        }
    }

    static async updateProfilePic(req, res) {
        try {
            if (!req.file) {
              return res.status(400).json({ message: 'No file uploaded' });
            }
        
            const profileImage = `/uploads/profile-images/${req.file.filename}`;
            console.log(profileImage);
            const user = await User.findByIdAndUpdate(
              req.user.id,
              { profileImage },
              { new: true }
            ).select('-password');
        
            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
          }
    }

    static async deleteAccount(req, res) {
        try {
            await User.findByIdAndDelete(req.user.id);
            res.json({ message: 'Account deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
}