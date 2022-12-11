// -----------------------------------Authorization----------------------------------
// const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')
const studentModel = require('../Model/studentModel')
const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const Authorization = async function (req, res, next) {
    try {
        //*USERID VALIDATION** */
        const userId = req.params.studentId
        if (!userId) return res.status(400).send({ status: false, message: "Student Id is must" })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Student Id is invalid" });
        const decodedToken = req.decodedToken
        const userbyuserId = await studentModel.findOne({ "_id": userId, isDeleted: false })
        if (!userbyuserId) {
            return res.status(400).send({ status: false, message: `Enter valid Student Id ${userId}, Student Id does not found` })
        }
        //**AUTHORIZATION**
        if (decodedToken.userId != userbyuserId._id) return res.status(403).send({ status: false, message: "unauthorize access" });
        next()
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.Authorization = Authorization