const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const sendEmail = require('../middleware/nodemailer');
const jwt = require('jsonwebtoken');
const { signUpTemplate } = require('../utils/mailTemplates');
const {validate} = require('../helpers/utilities');
const {registerUserSchema, loginUserSchema} =require('../validation/user');

exports.register = async (req, res) => {
    try {
        const validatedData = await validate(req.body, registerUserSchema)
        const { fullName, email, gender, password, username } = validatedData;

        const usernameExists = await userModel.findOne({ userName: username.toLowerCase() });
        if (usernameExists) {
            return res.status(480).json({
                message: `Username has already been taken`
            })
        };
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new userModel({
            fullName,
            email,
            password: hashedPassword,
            gender,
            username
        });


        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const link = `${req.protocol}://${req.get('host')}/api/v1/user-verify/${token}`
        const firstName = user.fullName.split(' ')[1]
        const html = signUpTemplate(link, firstName)
        const mailOptions = {
            subject: 'Welcome Email',
            email: user.email,
            html
        };
        await sendEmail(mailOptions);
        await user.save();
        res.status(201).json({
            message: 'User created successfully',
            data: user,
            token
        })
    }
    catch (error) {
        res.status(500).json({
            message: 'Error registering User',
            data: error.message
        })
    }
}

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        if (!token) {
            return res.status(400).json({
                message: 'Token not found'
            })
        };
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decodedToken.userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        };

        user.isVerified = true;
        await user.save()
        res.status(200).json({
            message: 'User verified successfully'
        })
    }
    catch (error) {
        console.log(error.message)
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: 'Verification link expired'
            })
        }
        res.status(500).json({
            message: 'Error verifying User: ' + error.message
        })
    }
}

exports.resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: 'Please enter email address'
            });
        }
        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const link = `${req.protocol}://${req.get('host')}/api/v1/user-verify/${token}`;
        const firstName = user.fullName.split(' ')[1];
        const html = signUpTemplate(link, firstName);
        const mailOptions = {
            subject: 'Email Verification',
            email: user.email,
            html
        };
        await sendEmail(mailOptions);
        res.status(200).json({
            message: 'Verification email sent, Please check your mail box'
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Error resending verification email: ' + error.message
        });
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({
                message: 'Please enter email address'
            });
        }
        const user = await userModel.findOne({ email: email.toLowerCase() })
        if (user === null) {
            res.status(404).json({
                message: 'User Not Found'
            })
        }
        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        const link = `${req.protocol}://${req.get('host')}/api/v1/reset-password/${token}`
        const firstName = user.fullName.split(' ')[0]
        const mailOptions = {
            subject: 'Password Reset',
            email: user.email,
            html: forgotPassworTemplate(link, firstName)
        }
        await sendEmail(mailOptions)
        res.status(200).json({
            message: 'Password reset link initiated, Please check your mail box'
        })
    } catch (error) {
        console.log(error.message);
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                message: 'Verificarion link expired'
            })
        }
        res.status(500).json({
            message: 'Error Logging in User'
        });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;

        const { password, confirmPassword } = req.body;
        const { userId } = await jwt.verify(token, process.env.JWT_SECRET,{expiresIn:'1h'})
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'Password do not match'
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        user.password = hashedPassword
        await user.save();

        res.status(200).json({
            message: 'Password reset successful'
        })

    } catch (error) {
        console.log(error.message);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: 'Verification link expired'
            })
        }
        res.status(500).json({
            message: 'Error reseting password'
        });

    }
}

exports.login = async (req, res) => {
    try {
        const validatedData = await validate(req.body,loginUserSchema)
        const { email, password } = validatedData;
        const userExists = await userModel.findOne({ email: email.toLowerCase() });
        if (userExists === null) {
            return res.status(404).json({
                message: `User with email: ${email} does not exist`
            });
        }
        const isCorrectPassword = await bcrypt.compare(password, userExists.password);
        if (isCorrectPassword === false) {
            return res.status(400).json({
                message: "Incorrect Password"
            });
        }
        console.log(userExists)
        if (userExists.isVerified === false) {
            return res.status(400).json({
                message: "User not verified, Please check your email to verify"
            });
        }
        const token = await jwt.sign({ userId: userExists._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({
            message: 'Login successful',
            data: userExists,
            token
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error Logging in User',
            data : error.message
        });
    }
};
exports.changePassword = async (req, res) => {
    try {
        const { id } = req.params
        const { newPassword } = req.body
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        const isMatch = await bcrypt.compare(newPassword, user.password)
        if (isMatch === null) {
            return res.status(400).json({
                message: 'current password is the same as formal one'
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword,salt)

        user.password = hashedPassword

        user.save()
        res.status(200).json({
            message: 'Password updated successfully'
        });


    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Error changing password'
        });
    }

}
exports.changeUserToAdmin = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        
        if (!req.user.isAdmin) { 
            console.log("User is not an admin.");

            return res.status(403).json({
                message: 'You are not authorized to make this change'
            });
        }
        user.isAdmin = true
        user.save()
        res.status(200).json({
            message: 'User has been granted admin status',
            data: user
        })


    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Error changing password'
        });
    }
}
