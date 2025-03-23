import express from 'express';
import MoodController from '../controllers/MoodController.js';
import UsersController from '../controllers/UserController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/register', UsersController.postNew);
router.post('/login', UsersController.logMe);
router.post('/verify-email', UsersController.verifyEmail);
router.get('/verify/:token', UsersController.activate);
router.post('/forgot-password', UsersController.pwdForgot);
router.post('/reset-password/:token', UsersController.pwdReset);

router.post('/entries/new', protect, MoodController.addNew);
router.get('/entries/:userId', protect, MoodController.userHistory);

export default router;