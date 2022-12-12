const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const studentSchema = new mongoose.Schema({

    name: {
        type: String,
        unique: true,

    },

    subject: [{
        type: String,
        unique: true,
        enum: ["Maths", "English", "Science", "Hindi", "GK", "Computer"]

    }],

    marks: {
        type: Number,
        required: true

    },
    teacherId: {
        type: ObjectId,
        ref: 'user'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }


}, { timestamps: true });

module.exports = mongoose.model("student", studentSchema);