const express = require('express')
const router = express.Router()
const userController= require('../Controller/userController')
const studentController = require('../controller/studentController')
const Authentication = require('../Middleware/Authentication')
const Authorization = require('../Middleware/Authorization')

//----------------Dummy API-------------
router.get('/test', function(req, res){
    return res.send({status: true, msg: "running"})
})

router.post("/register" ,userController.createUser)

router.post("/userLogin"  ,userController.userLogin )

router.post("/studentData" , Authentication.Authenticate ,studentController.studentData)

router.get("/studentData/:userId" ,Authentication.Authenticate , studentController.getStudentData)


router.delete("/student/:studentId",Authorization.Authorization,studentController.deleatByid)


module.exports = router