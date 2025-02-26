const scoreModel = require('../models/scoreModel')
const userModel = require('../models/userModel')

exports.createScore = async (req, res) => {
    try {
        const { userId } = req.params
        const { punctuality, assignment, personalDefence, attendance, classAssessment } = req.body
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        const totalScore = punctuality + assignment + personalDefence + attendance + classAssessment;
        const prevScore = await scoreModel.find({ userId })
        const score = new scoreModel({
            week: prevScore.length + 1,
            punctuality,
            personalDefence,
            classAssessment,
            assignment,
            attendance,
            average: totalScore / 5,
            total: totalScore,
            name: user.fullName
        })

        await score.save()
        res.status(201).json({
            message: 'Score Added Successfully',
            data: score
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

exports.getAllScores = async (req,res)=>{
    try {
        const scores = await scoreModel.find()
        res.status(201).json({
            message: 'Score Added Successfully',
            data: scores
        })
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
exports.getAllScoreByAStudent = async (req,res)=>{
    try {
        const {userId} =req.user
        const user = await userModel.findById(userId)
        if(user ===null){
            return res.status(404).json({
                message: 'student not found'
            })
        }
        const scores = await scoreModel.find({ userId })
        res.status(200).json({
            message: `All Score For ${user.fullName}`,
            data: scores
        })
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}