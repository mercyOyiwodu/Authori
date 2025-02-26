const { register, login, verifyEmail, resendVerificationEmail, forgotPassword, changePassword, changeUserToAdmin } = require('../controllers/userController')
const { authenticateUserToAdmin } = require('../middleware/authenticate')

const router = require('express').Router()

router.post('/register',register)
router.post('/reset-password',forgotPassword)
router.post('/login',login)
router.get('/user-verify/:token',verifyEmail)
router.post('/resend-verification',resendVerificationEmail)
router.put('/change-password/:id',changePassword)
router.patch('/user-admin/:id',authenticateUserToAdmin,changeUserToAdmin)



module.exports = router
