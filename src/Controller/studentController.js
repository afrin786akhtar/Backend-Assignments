const mongoose = require("mongoose");
const studentModel = require("../Model/studentModel");
const userModel = require("../Model/UserModel");
const { isValidName, isValidEmail, isValidate, isValid } = require("../validation/validation")
const ObjectId = require('mongoose').Types.ObjectId

//---------------------creating students---------------------
const studentData = async (req, res) => {
    try {

        let info = req.body;
        if (Object.keys(info).length == 0) {
            return res.status(400).send({ status: false, message: "Please Provide Student Infomation " })
        }
        const { name, subject, marks, teacherId } = info
        // let id = req.query.teacherId
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     return res.status(400).send({ status: false, msg: "userId is not valid" })
        // }


        if (!name) {
            return res.status(400).send({ status: false, message: "Name is mandatory" })

        }

        if (!isValidName(name)) {
            return res.status(400).send({ status: false, message: "Name is invalid" });
        }

        if (!subject) {
            return res.status(400).send({ status: false, message: "subject is mandatory " })

        }
        if (!marks) {
            return res.status(400).send({ status: false, message: "marks is mandatory " })

        }
        if (!teacherId) {
            return res.status(400).send({ status: false, message: "Teacher Id is mandatory " })

        }

        let id = req.body.teacherId
        if (!ObjectId.isValid(id)) return res.status(400).send({ status: false, message: "Teacher by this id  is not present" })

        const teacher = await userModel.findById(id);
        if (!teacher)
            return res.status(400).send({ status: false, msg: "Teacher Not found" });

        let savedData = await studentModel.create(info)
        return res.status(201).send({ status: true, data: savedData })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

//-----------------------get student data---------------------
const getStudentData = async (req, res) => {
    try {
        let query = req.query
        let checkDelete = { isDeleted: false }
        let sortArr = {}

        const { name, marks, subject, marksLessThan, marksMoreThan, marksSort } = query

        //-----------filteration by subjects-------
        if (subject) {
            query.subject = query.subject
            if (!isValidate(query.subject)) return res.status(400).send({ status: false, message: "Please Enter the subjects from (maths, english, science, hindi" })

            checkDelete.subject = {}
            checkDelete.subject = { $in: query.subject }
        }

        //---------filter by name---------
        if (name) checkDelete["name"] = query.name

        //---------filter for marks--------
        if (marks) checkDelete["marks"] = query.marks

        //--------get list for maximum marks-----
        if (marksMoreThan) checkDelete["marks"] = { $gt: Number(marksMoreThan) }

        //--------get list for minimum marks----
        if (query.marksLessThan) checkDelete["marks"] = { $lt: Number(marksLessThan) }

        //-------sorting the marks--------- 
        if (marksSort) {
            if (!["-1", "1"].includes(marksSort)) {
                return res.status(400).send({ status: false, message: "For sorting the data from low to high(ascending order) [1] and from high to low(decending order) please provide [-1]" })
            }
            sortArr["marks"] = Number(marksSort)
        }

        //------------returning all the details available
        const allDetails = await studentModel.find(checkDelete).sort(sortArr)

        if (allDetails.length == 0) return res.status(404).send({ status: false, message: "No data found here!!" })

        return res.status(200).send({ status: true, message: "Success : List of students found ", send: allDetails })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

//----------------------update/Edit data----------------------
const editStudent = async (req, res) => {
    try {
        let data = req.body
        let teacherId = req.params.teacherId
        let studentId = req.params.studentId
        let checkDelete = { isDeleted: false }

        let { name, subject, marks } = data
        let savedData = await studentModel.findOne({ name: name } || { subject: subject })

        let checkStudent = await studentModel.findById(studentId)
        if(!checkStudent) return res.status(404).send({status : false , message : "No student found with this student Id!!"})

        if(name = checkStudent.name) {
            checkDelete["name"] = name
        }

        // if(marks == checkDelete.marks){

        // }
        // if (savedData) {
        //     let CreateData = await studentModel.findOneAndUpdate({ name: name, subject: subject },
        //         { $set: { marks: savedData.marks + marks } },
        //         { new: true, upsert: true })
        //     res.status(200).send({ data: CreateData, message: "marks updated successfully" })

        // } else {
        //     let create1 = await studentModel.create(data)
        //     return res.status(201).send({ status: true, data: create1 })

        // }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//------------------------delete student----------------------
const deleatByid = async (req, res) => {
    try {
        let id = req.params.studentId
        // if(!id) return res.status(400).send({status:false , message:"Student id is required"})
        if (!ObjectId.isValid(id)) return res.status(400).send({ status: false, message: "Student by this id  is not present" })
        let student = await studentModel.findById(id)
        if (!student) return res.status(404).send({ status: false, message: "Student does not exist" })

        let is_Deleted = student.isDeleted
        if (is_Deleted == true) return res.status(404).send({ status: false, message: "Student is already Deleted " })

        let deleteStudent = await studentModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } }, { new: true })
        return res.status(200).send({ status: true, data: deleteStudent })

    } catch (err) {
        return res.send({ status: false, message: err.message })
    }
}



module.exports = { studentData, getStudentData, editStudent, deleatByid }