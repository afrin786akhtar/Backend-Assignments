const express = require('express')
const router = express.Router()
const userController = require('../Controller/userController')
const {studentData, getStudentData, editStudent, deleatByid} = require('../controller/studentController')
const authentication = require('../Middleware/Authentication')

//----------------Dummy API-------------
router.get('/test', function (req, res) {
    return res.send({ status: true, msg: "running" })
})

router.post("/register", userController.createUser)

router.post("/userLogin", userController.userLogin)

router.post("/studentData/:userId", authentication.Authenticate, studentData)

router.get("/studentData/:userId", authentication.Authenticate, getStudentData)

router.put("/student/:userId/:studentId", authentication.Authenticate, editStudent)

router.delete("/deleteData/:userId/:studentId", authentication.Authenticate, deleatByid)


module.exports = router