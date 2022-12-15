// ---------------------------Authentication---------------------------------------
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')

const Authenticate = async function (req, res, next) {
    try {
        let token = req.headers["authorization"];
        // console.log(token)

        if (!token)
            return res.status(400).send({ status: false, message: "Token must be present in the request header" })
        token = token.split(" ")[1]

        jwt.verify(token, "Students-portal", (error, decodedToken) => {
            if (error) {
                return res.status(401).send({ status: false, error: error.message })
            }
            else {
                req.headers = decodedToken
                next()
            }
        })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.Authenticate = Authenticate