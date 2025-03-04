import express from 'express';
import MoodController from '../controllers/MoodController';
import UsersController from '../controllers/UserController';
import protect from '../middleware/authMiddleware';

const router = express.Router();

router.post('/add', protect, MoodController.postEntry);
router.post('/register', UsersController.postNew);
router.post('/login', UsersController.logMe);
router.post('/verify-email', UsersController.verifyEmail);
router.get('/verify/:token', UsersController.activate);
router.post('/forgot-password', UsersController.pwdForgot);
router.post('/reset-password/:token', UsersController.pwdReset);

router.get('/:userId', protect, MoodController.getAllEntries);
router.get('/verify/:token', UsersController.verifyToken);

export default router;

