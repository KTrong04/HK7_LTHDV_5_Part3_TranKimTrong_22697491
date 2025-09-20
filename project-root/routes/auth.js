const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { ensureNotAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 */

/**
 * @swagger
 * /register:
 *   get:
 *     summary: Show registration page
 *     tags: [Auth]
 */
router.get('/register', ensureNotAuthenticated, authController.showRegister);
router.post('/register', authController.register);

router.get('/login', ensureNotAuthenticated, authController.showLogin);
router.post('/login', authController.login);

router.get('/forgot', ensureNotAuthenticated, authController.showForgot);
router.post('/forgot', authController.resetPassword);

router.get('/logout', authController.logout);

module.exports = router;
