import { generateToken } from "../Auth/JWT.js"
import userModel from "../model/userSchema.js"
import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'


export const userRegister = (req, res) => {
    try {
        let { userName, password, email } = req.body
        console.log(userName,password,email)
        userModel.findOne({ userName })
            .then((user) => {
                if (user) {
                    res.status(200).json({ registration: false })
                } else { 
                    bcrypt.hash(password, 10) 
                        .then((hash) => {
                            const newUser = new userModel({
                                userName,
                                email,
                                password: hash,
                            })
                            newUser.save()
                                .then((user) => {
                                    const token = generateToken({
                                        userId:user._id
                                    })
                                    res.status(200).json({ registration: true, token })
                                })
                        })
                }
            })
    } catch (err) {
        res.status(500)
    }
}


export const signIn = (req, res) => {
    try {
        let { email, password } = req.body
        userModel.findOne({ email })
            .then((user) => {
                if (user) {
                    bcrypt.compare(password, user.password, function (err, result) {
                        if(result){
                            const token = generateToken({
                                userId:user._id
                            })
                            res.status(200).json({ logIn: 'success', token })
                        }else{
                            res.status(200).json({ logIn: 'incPass' })
                        }
                    })
                } else {
                    res.status(200).json({ logIn: 'noUser' })
                }
            })
    } catch (err) {
        res.status(500)
    }
}

export const userCheck = (req,res) => {
    try{
        let token = req.headers?.authorization
        console.log(token)
        if(token){
            jwt.verify(token,process.env.TOKEN_SECRET,(err,result)=>{
                if(err){
                    res.status(401).json({ authorization: false })
                }else{
                    userModel.findOne({_id:result.userId}).then((user)=>{
                        user ? res.status(200).json({ authorization: true }) : res.status(401).json({ authorization: false })
                    })
                }
            })
        }else{
            res.status(401).json({ authorization: false })
        }
    }catch(err){
        res.status(500)
    }
}


