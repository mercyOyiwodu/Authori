const { createScore, getAllScores, getAllScoreByAStudent } = require('../controllers/scoreController')
const { authenticateAdmin, authenticate } = require('../middleware/authenticate')

const router = require('express').Router()


router.post('/access/student/:userId',authenticateAdmin,createScore)
router.get('/access/student/:userId',authenticate,getAllScoreByAStudent)
router.get('/access/student/',authenticateAdmin,getAllScores)

module.exports = router