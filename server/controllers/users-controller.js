// const {Client} = require('pg')

const cookie = require("cookie-parser")
const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')
const jwt = require('jsonwebtoken')
const process = require("process")
const bcrypt = require("bcrypt");


const saltRounds = 10;

const createAccount = async (req, res) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(req.body.password.toString(), salt)
    const newUser = {
        id: uuidv4(),
        username: req.body.username,
        email: req.body.email,
        password: hash,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        dob: req.body.dob,
        user_role: req.body.user_role
    }
    models.User.create(newUser);
    return res.status(200).send()
}

const login = async (req, res, next) => {
    const matchingUser = await models.User.findOne({
        where: {
            'email': req.body.email,
        },
        raw: true
    })
    if (matchingUser.length !== 0) {
        const passwordValid = await bcrypt.compare(req.body.password, matchingUser.password)
        if (passwordValid) {
            const tokenTime = 1800000
            const secret = process.env.SECRET; //grab secret
            const token = jwt.sign({
                id: matchingUser.id,
            }, secret, {
                algorithm: "HS256",
                expiresIn: "30 minutes",
            }) //set session up
            const requiredUserData = {
                user: matchingUser.id,
                user_role: matchingUser.user_role,
                token_expires_in: tokenTime
            }
            return res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                maxAge: tokenTime, //30 min
            }).status(200).send(requiredUserData)
            
        } else {
            return res.status(401).send({
                status: "Login info is incorrect"
            })
        }

    } else {
        return res.status(401).send({
            status: "No user with info provided exists."
        })
    }
}

// const refreshToken = async(req, res) => {
//     const matchingUser = await models.User.findOne({
//         where: {
//             'id': req.body.id,
//         },
//         raw: true
//     })
//     res.clearCookie("token", {
//         httpOnly: true,
//         secure: false
//     })
//     const refreshSecret = process.env.REFRESH_SECRET;
//     const refreshToken = jwt.sign({
//         id: matchingUser.id,
//     }, refreshSecret, {
//         algorithm: "HS256",
//         expiresIn: "30 minutes",
//     }) //set session up

//     return res.cookie("token", )
// }

const logout = async (req, res) => {
    return res.status(200).clearCookie("token", {
        httpOnly: true,
        secure: false
    }).send();
}
 
module.exports = {
    createAccount,
    login,
    logout,
   // refreshToken
}