const mongoose = require("mongoose");
const studentModel = require("../Model/studentModel");
const userModel = require("../Model/UserModel");
const { isValidName, isValidate, isValid, isValidObjectId } = require("../validation/validation")
const ObjectId = require('mongoose').Types.ObjectId

//========================creating students=============================

const studentData = async (req, res) => {
    try {

        let info = req.body;
        let userId = req.params.userId
        // let id = req.body.userId

        let { name, subject, marks } = info

        if (Object.keys(info).length == 0)
            return res.status(400).send({ status: false, message: "Please Provide Student Infomation " })

        if (!userId)
            return res.status(400).send({ status: false, message: "UserId is mandatory. " })

        // if (!isValidObjectId(id))
        //     return res.status(400).send({ status: false, message: "Teacher by this id  is not present" })

        //-----check for authntication----
        if (req.headers.userId != userId) {
            return res.status(400).send({ status: false, message: "User not authorized." })
        }

        if (!name)
            return res.status(400).send({ status: false, message: "Name is mandatory" })

        if (!isValidName(name))
            return res.status(400).send({ status: false, message: "Name is invalid" });

        if (!subject)
            return res.status(400).send({ status: false, message: "subject is mandatory " })

        if (!marks)
            return res.status(400).send({ status: false, message: "marks is mandatory " })

        // if student is already present then add the marks
        let studentPresent = await studentModel.findOne({ name: name, subject: subject })

        if (studentPresent) {
            studentPresent["marks"] += marks;
            await studentPresent.save();
            return res.status(200).send({ status: true, message: "Updated the marks since student was already present", data: studentPresent })
        }

        let savedData = await studentModel.create(info)
        return res.status(201).send({ status: true, data: savedData })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

//===============================get student data================================

const getStudentData = async (req, res) => {
    try {
        let query = req.query
        let userId = req.params.userId

        let checkDelete = { isDeleted: false }
        let sortArr = {}

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: " UserId is invalid. Please check again." })

        const { name, marks, subject, marksLessThan, marksMoreThan, marksSort } = query

        //-----------authorization----------
        if (req.headers.userId != userId) {
            return res.status(400).send({ status: false, message: "Person is not authorized for checking students data." })
        }
        data["userId"] = userId

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
        const allDetails = await studentModel.find(checkDelete).select({ updatedAt: 0, __v: 0, createdAt: 0 }).sort(sortArr)

        if (allDetails.length == 0) return res.status(404).send({ status: false, message: "No data found here!!" })

        return res.status(200).send({ status: true, message: "Success : List of students found ", send: allDetails })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

//============================update/Edit data=========================

const editStudent = async (req, res) => {
    try {
        const data = req.body;
        let userId = req.params.userId;
        let studentId = req.params.studentId;

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Please check the userID" })
        if (!isValidObjectId(studentId)) return res.status(400).send({ status: false, message: "Please check Student Id" })

        //-----authorization-------
        if (req.headers.userId != userId) {
            return res.status(400).send({ status: false, message: "user entered is unauthorized." })
        }

        let { name, subject, marks } = data;
        let checkDelete = { isDeleted: false };

        let savedData = await studentModel.findById({ studentId });
        if (!savedData) return res.status(400).send({ status: false, message: "Student not present." })

        // if(name == savedData.name)
        // return res.status(400).send({status: false , message : "Name Already present."})
        // checkDelete["name"] = name

        // if(marks == savedData.marks) 
        // return res.status(400).send({status: false , message : "Name Already present."})
        // checkDelete["name"] = name


        let updateData = await studentModel.findOneAndUpdate(
            { name: name , subject : subject},
            { $set: { marks: savedData.marks + marks } },
            { new: true , upsert: true}
        );
        res.status(200).send({ data: updateData, message: "marks updated successfully" });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};


//------------------------delete student----------------------
const deleatByid = async (req, res) => {
    try {
        let userId = req.params.userId;
        let studentId = req.params.studentId;

        if(!isValidObjectId(userId)) 
        return res.status(400).send({status : false , send: "Please check userID."})

        if(!isValidObjectId(studentId))
        return res.status(400).send({status : false , send: "Please check studentId."})

        let student = await studentModel.findById({_id : studentId})
        if (!student) return res.status(404).send({ status: false, message: "Student does not exist" })

        //----authorized-----
        if(req.headers.userId != userId){
            return res.status(400).send({status : false , message: "Your are not authorized for deleting the user."})
        }

        let is_Deleted = student.isDeleted
        if (is_Deleted == true) return res.status(404).send({ status: false, message: "Student is already Deleted " })

        let deleteStudent = await studentModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } }, { new: true })
        return res.status(200).send({ status: true, data: deleteStudent })

    } catch (err) {
        return res.send({ status: false, message: err.message })
    }
}



module.exports = { studentData, getStudentData, editStudent, deleatByid }