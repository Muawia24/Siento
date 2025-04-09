import express from 'express';
import MoodController from '../controllers/MoodController.js';
import UsersController from '../controllers/UserController.js';
import protect from '../middleware/authMiddleware.js';
import { upload } from '../utils/multer.js';
const router = express.Router();


router.post('/register', UsersController.postNew);
router.post('/login', UsersController.logMe);
router.post('/verify-email', UsersController.verifyEmail);
router.get('/verify/:token', UsersController.activate);
router.post('/forgot-password', UsersController.pwdForgot);
router.post('/reset-password/:token', UsersController.pwdReset);

router.post('/entries/new', protect, MoodController.addNew);
router.delete('/entries/delete/:id', protect, MoodController.deleteEntry);
router.get('/entries/:userId', protect, MoodController.userHistory);

router.get('/profile', protect, UsersController.getProfile);
router.put('/profile-update', protect, UsersController.updateProfile);
router.put('/profile-update/picture', protect, upload.single('profileImage'), UsersController.updateProfilePic);
router.delete('/delete-account', protect, UsersController.deleteAccount);

export default router;