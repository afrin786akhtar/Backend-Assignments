const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: "String",
        require: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true })

module.export = mongoose.model("user", userSchema)