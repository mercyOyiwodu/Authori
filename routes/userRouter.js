const { register, login, verifyEmail, resendVerificationEmail, forgotPassword, changePassword, changeUserToAdmin, logOut } = require('../controllers/userController');
const { authenticateUserToAdmin, authenticate } = require('../middleware/authenticate');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const router = require('express').Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Full name of the user.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: Password for the user account.
 *                 example: Password@123
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request, validation error.
 */

/**
 * @swagger
 * /verify-email:
 *   post:
 *     summary: Verify a user's email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address to verify.
 *                 example: johndoe@example.com
 *               verificationCode:
 *                 type: string
 *                 description: Verification code sent to the user's email.
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *       400:
 *         description: Invalid verification code or email.
 */

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Request a password reset.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address to reset the password for.
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent.
 *       400:
 *         description: Email not found.
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: Password for the user account.
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Invalid email or password.
 */

/**
 * @swagger
 * /resend-verification:
 *   post:
 *     summary: Resend the email verification code.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address to resend the verification code to.
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: Verification email resent.
 *       400:
 *         description: Email not found or already verified.
 */

/**
 * @swagger
 * /change-password/{id}:
 *   put:
 *     summary: Change a user's password.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Current password of the user.
 *                 example: OldPassword@123
 *               newPassword:
 *                 type: string
 *                 description: New password for the user account.
 *                 example: NewPassword@123
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Invalid old password or validation error.
 */

/**
 * @swagger
 * /user-admin/{id}:
 *   patch:
 *     summary: Change a user's role to admin.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User role updated to admin.
 *       403:
 *         description: Unauthorized or insufficient permissions.
 */

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/reset-password', forgotPassword);
router.post('/login', login);
router.post('/logout', authenticate, logOut);
router.post('/resend-verification', resendVerificationEmail);
router.put('/change-password/:id',authenticate, changePassword);
router.patch('/user-admin/:id', authenticateUserToAdmin, changeUserToAdmin);

module.exports = router;
