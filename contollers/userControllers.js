
const User = require('../models/userModel')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
        console.log(error)
        res.status(400).json({ error: "error occured" })
    }


}

const login = async (req, res) => {

    const { email, password } = req.body

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


        const token = await jwt.sign({ user }, process.env.JWT_TOKEN_KEY, { expiresIn: '7d' })
        res.status(200).json({ user, token })
    } catch (error) {
        console.log(error)
        res.status(400).json({error})
    }
}

const profile = async (req , res) => {

    const {token} = req.headers 
    if (!token) {
        return res.status(400).json({ error: "Token is not found" });
      }
    
      jwt.verify(token, process.env.JWT_TOKEN_KEY, (error, user) => {
        if (error) {
          console.log({ message: 'Invalid token.' });
          return res.status(401).json({ message: 'Invalid token.' });
        }
        res.status(200).json({user})
      });
}

const logout = async (req , res) => {
    if (!token) {
        return res.status(400).json({ error: "Token is not found" });
      }
      //deleting the token from the headers
      jwt.verify(token, process.env.JWT_TOKEN_KEY);
}

const accept = async (req , res) => {
    const {userId} = req.params
    const { token } = req.headers
    try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (error, data) => {

        const admin = await User.findOne({ email: data.user.email })
        //check if the user is admin 
        if (!admin.isAdmin) {
            return res.status(400).json({ error: " authorisation error" })
        }
        const user = await User.findOne({_id : userId})
        user.active = true 
        user.save()
        res.status(200).json({ message : "user accepted",user})
    })
    } catch (error) {
        res.status(400).json({error})
    }
}
const refuse = async (req , res) => {
    const {userId} = req.params
    const { token } = req.headers
    try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (error, data) => {
        console.log(data)
        const admin = await User.findOne({ email: data.user.email })
        //check if the user is admin 
        if (!admin.isAdmin) {
            return res.status(400).json({ error: " authorisation error" })
        }
        const user = await User.findOne({_id : userId})
        user.active = false 
        user.save()
        res.status(200).json({ message : "user refused", user})
    })
    } catch (error) {
        res.status(400).json({error})
    }
}
const getNotActiveUsers = async (req , res) => {
    const { token } = req.headers
    try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (error, data) => {
        console.log(data)
        const admin = await User.findOne({ email: data.user.email })
       
        if (!admin.isAdmin) {
            return res.status(400).json({ error: " authorisation error" })
        }
        const user = await User.find({active : false})

        res.status(200).json({user})
    })
    } catch (error) {
        res.status(400).json({error})
    }
}
const getActiveUsers = async (req , res) => {

    const { token } = req.headers
    try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (error, data) => {
        console.log(data)
        const admin = await User.findOne({ email: data.user.email })
       
        if (!admin.isAdmin) {
            return res.status(400).json({ error: " authorisation error" })
        }
        const users = await User.find({active : true})

        res.status(200).json({users})
    })
    } catch (error) {
        res.status(400).json({error})
    }
}
const getAllUsers = async (req , res) => {

    const { token } = req.headers
    try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (error, data) => {
        console.log(data)
        const admin = await User.findOne({ email: data.user.email })
       
        if (!admin.isAdmin) {
            return res.status(400).json({ error: " authorisation error" })
        }
        const user = await User.find({})

        res.status(200).json({user})
    })
    } catch (error) {
        res.status(400).json({error})
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

const changePassword = async (req , res) => {

    const {password , newPassword , confirmNewPassword} = req.body
    const {token} = req.headers

    try {
        jwt.verify(token , process.env.JWT_TOKEN_KEY , async (err , data) => {
            const user = await User.findOne({ email: data.user.email })
            if(!user){
                return res.status(400).json({error : "user doesn't exist"})
            }

            if(newPassword !== confirmNewPassword){
                return res.status(400).json({error : "password and confirmed password must be identical"})
            }
            const isValidPassword = bcrypt.compareSync(password , user.password)

            if(!isValidPassword){
                return res.status(400).json({error : "password is wrong"})
            }

            if(!validator.isStrongPassword(newPassword)){
                return res.status(400).json({error : "password must be strong"})
            }

            const hashPassword = await bcrypt.hash(newPassword , 10)

            user.password = hashPassword
            await user.save()

            res.status(200).json({ message : "password is changed ",user})

            
        })
    } catch (error) {
        res.status(400).json({error})
    }
}
module.exports = { register, login , profile , logout , accept , refuse , upload , changePassword , getActiveUsers , getNotActiveUsers, getAllUsers }