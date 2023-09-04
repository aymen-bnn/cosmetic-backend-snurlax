const User = require('../models/userModel')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs');
const nodemailer = require('nodemailer')
require("dotenv").config()

const register = async (req, res) => {
    try {
        const { fullName, username, email, password, phone, confirmedPassword } = req.body

        if (!fullName || !username || !email || !password || !phone || !confirmedPassword) {
            return res.status(400).json({ error: "all fields are required " })
        }
        if (password !== confirmedPassword) {
            return res.status(400).json({ error: "passwords must be identical" })
        }
        //validate email 
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "email must be valid" })
        }
        //validate password 
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ error: "password must be strong" })
        }
        //check if user is already in signed in
        const checkUser = await User.findOne().or([{ email }, { username }]);
        if (checkUser) {
            return res.status(400).json({ error: "user already signed up change email or username" })
        }

        //hashing the password
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            fullName,
            username,
            phone,
            email,
            password: hashedPassword
        })
        res.status(200).json({ message: "user created succesfully", user })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }


}

const login = async (req, res) => {

    const { email, password , fcmToken } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: "all fields are required" })
    }

    try {

        const user = await User.findOne({ email })
        //check if user exists
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isValidPassword = bcrypt.compareSync(password, user.password)

        //check if passsword is valid
        if (!isValidPassword) {
            return res.status(400).json({ error: "email or pasword are not valid" })
        }

        //check if admin accepted user
        if (!user.active) {
            return res.status(400).json({ error: "user is pending please wait " })
        }


        const token = await jwt.sign({ user }, process.env.JWT_TOKEN_KEY, { expiresIn: '365d' })

        if (fcmToken) {
            user.fcmToken = fcmToken;
            await user.save();
        }

        res.status(200).json({ user, token })
    } catch (error) {
        res.status(400).json({ error : error.message})
    }
}

const profile = async (req, res) => {

    const { token } = req.headers
    if (!token) {
        return res.status(400).json({ error: "Token is not found" });
    }

    jwt.verify(token, process.env.JWT_TOKEN_KEY, (error, user) => {
        if (error) {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        res.status(200).json({ user })
    });
}

const logout = async (req, res) => {
    if (!token) {
        return res.status(400).json({ error: "Token is not found" });
    }
    //deleting the token from the headers
    jwt.verify(token, process.env.JWT_TOKEN_KEY);
}

const accept = async (req, res) => {
    const { userId } = req.params
    const { token } = req.headers
    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            if (err) {
                return res.status(400).json({ error: "Invalid token" });
            }

            const admin = await User.findOne({ email: data.user.email })
            //check if the user is admin 
            if (!admin.isAdmin) {
                return res.status(400).json({ error: " authorisation error" })
            }
            const user = await User.findOne({ _id: userId })
            user.active = true
            user.save()
            res.status(200).json({ message: "user accepted", user })
        })
    } catch (error) {
        res.status(400).json({ error })
    }
}
const refuse = async (req, res) => {
    const { userId } = req.params
    const { token } = req.headers
    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            if (err) {
                return res.status(400).json({ error: "Invalid token" });
            }
            const admin = await User.findOne({ email: data.user.email })
            //check if the user is admin 
            if (!admin.isAdmin) {
                return res.status(400).json({ error: " authorisation error" })
            }
            const user = await User.findOne({ _id: userId })
            user.active = false
            user.save()
            res.status(200).json({ message: "user refused", user })
        })
    } catch (error) {
        res.status(400).json({ error })
    }
}
const getNotActiveUsers = async (req, res) => {
    const { token } = req.headers
    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            if (err) {
                return res.status(400).json({ error: "Invalid token" });
            }
            const admin = await User.findOne({ email: data.user.email })

            if (!admin.isAdmin) {
                return res.status(400).json({ error: " authorisation error" })
            }
            const user = await User.find({ active: false })

            res.status(200).json({ user })
        })
    } catch (error) {
        res.status(400).json({ error })
    }
}
const getActiveUsers = async (req, res) => {

    const { token } = req.headers
    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            if (err) {
                return res.status(400).json({ error: "Invalid token" });
            }
            const admin = await User.findOne({ email: data.user.email })

            if (!admin.isAdmin) {
                return res.status(400).json({ error: " authorisation error" })
            }
            const users = await User.find({ active: true })

            res.status(200).json({ users })
        })
    } catch (error) {
        res.status(400).json({ error })
    }
}
const getAllUsers = async (req, res) => {

    const { token } = req.headers
    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            if (err) {
                return res.status(400).json({ error: "Invalid token" });
            }
            const admin = await User.findOne({ email: data.user.email })

            if (!admin.isAdmin) {
                return res.status(400).json({ error: " authorisation error" })
            }
            const user = await User.find({})

            res.status(200).json({ user })
        })
    } catch (error) {
        res.status(400).json({ error })
    }
}

const upload = async (req, res) => {
    const uploadedFiles = []
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i]
        const extension = originalname.split('.')[1]
        const newPath = path + '.' + extension
        fs.renameSync(path, newPath)
        uploadedFiles.push(newPath.replace('uploads\\', ''))
    }

    res.status(200).json(uploadedFiles)
}

const changePassword = async (req, res) => {

    const { password, newPassword, confirmNewPassword } = req.body
    const { token } = req.headers

    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            if (err) {
                return res.status(400).json({ error: "Invalid token" });
            }
            const user = await User.findOne({ email: data.user.email })
            if (!user) {
                return res.status(400).json({ error: "user doesn't exist" })
            }

            if (newPassword !== confirmNewPassword) {
                return res.status(400).json({ error: "password and confirmed password must be identical" })
            }
            const isValidPassword = bcrypt.compareSync(password, user.password)

            if (!isValidPassword) {
                return res.status(400).json({ error: "password is wrong" })
            }

            if (!validator.isStrongPassword(newPassword)) {
                return res.status(400).json({ error: "password must be strong" })
            }

            const hashPassword = await bcrypt.hash(newPassword, 10)

            user.password = hashPassword
            await user.save()

            res.status(200).json({ message: "password is changed ", user })


        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const forgotPassword = async (req, res) => {

    const { email } = req.body
    try {
        const codeVerification = Math.floor(Math.random() * 9000 + 1000)
        //chackout the email 
        const user = await User.findOne({ email })

        if (!user || !user.active) {
            return res.status(400).json({ error: "user doesn't exist" })
        }
        user.codeVerification = codeVerification
        await user.save()

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: "587",
            secure: false,
            auth: {

                user: process.env.MAILEREMAIL,
                pass: process.env.MAILERPASSWORD
            }
        });
        const info = await transporter.sendMail({
            from: process.env.MAILEREMAIL, // sender address
            to: email, // list of receivers
            subject: "Verifivation Code ", // Subject line
            text: String(codeVerification), // plain text body
            html: `<b>${codeVerification}</b>` // html body
        });
        res.status(200).json({ message : "email sent" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const confirmForgotPasswort = async (req, res) => {
    const { email, code, password, confirmedPassword } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "user is not found" })
        }

        if (password !== confirmedPassword) {
            return res.status(400).json({ error: "password and confirmed password must be identical" })
        }

        if (code === null || user.codeVerification === null) {
            return res.status(400).json({ error: "password can't be changed" })
        }

        if (user.codeVerification !== code) {
            return res.status(400).json({ error: "code verification is wrong" })
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ error: "password must be strong" })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        user.password = hashPassword
        user.codeVerification = null
        await user.save()

        res.status(200).json({ message: "password is changed " })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const addAdmin = async (req, res) => {
    const { fullName, username, email, password, phone, confirmedPassword } = req.body
    const { token } = req.headers

    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            if (err) {
                return res.status(400).json({ error: "Invalid token" });
            }

            if (password !== confirmedPassword) {
                return res.status(400).json({ error: "password and confirmed password must be identical" })
            }

            const admin = await User.findOne({ email: data.user.email })
            if (!admin || !admin.isAdmin) {
                return res.status(400).json({ error: "admin doesn't exist" })
            }


            if (!fullName || !username || !email || !password || !phone || !confirmedPassword) {
                return res.status(400).json({ error: "all fields are required " })
            }
            if (password !== confirmedPassword) {
                return res.status(400).json({ error: "passwords must be identical" })
            }
            //validate email 
            if (!validator.isEmail(email)) {
                return res.status(400).json({ error: "email must be valid" })
            }
            //validate password 
            if (!validator.isStrongPassword(password)) {
                return res.status(400).json({ error: "password must be strong" })
            }
            //check if user is already in signed in
            const checkUser = await User.findOne().or([{ email }, { username }]);
            if (checkUser) {
                return res.status(400).json({ error: "user already signed up change email or username" })
            }

            const hashPassword = await bcrypt.hash(password, 10)

            const user = await User.create({
                fullName,
                username,
                email,
                phone,
                password:hashPassword,
                active: true,
                isAdmin: true,

            })

            res.status(200).json({ message: "admin has been created", user })
        })
    } catch (error) {

    }
}
module.exports = { register, login, profile, logout, accept, refuse, upload, changePassword, getActiveUsers, getNotActiveUsers, getAllUsers, forgotPassword, confirmForgotPasswort, addAdmin }