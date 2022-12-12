const bcrypt = require("bcrypt");
const saltRound = 10

const userModel = require("../Model/UserModel")
const jwt = require("jsonwebtoken")
const { isValidName, isValidEmail, isValidPassword } = require("../validation/validation")

//--------creating the user---------
const createUser = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please Provide Teacher Information" })
        }
        const { name, email, password } = data
        if (!name) {
            return res.status(400).send({ status: false, message: "Name is mandatory" })
        }

        if (!isValidName(name)) {
            return res.status(400).send({ status: false, message: "Name is invalid" });
        }

        if (!email) {
            return res.status(400).send({ status: false, message: "email is mandatory" })
        }
        if (!isValidEmail(email)) {
            return res.status(404).send({ status: false, message: "email is invalid" })
        }
        let emailExist = await userModel.findOne({ email });
        if (emailExist) {
            return res.status(400).send({ status: false, message: "Teacher with this email already exists" })
        }
        if (!password) {
            return res.status(400).send({ status: false, message: "Password is mandatory" })
        }
        // if (!isValidPassword(password)) {
        // return res.status(400).send({ status: false, message: "Password is invalid" })
        // }
        let encryptedPassword = bcrypt
            .hash(req.body.password, saltRound)
            .then((hash) => {
                // console.log(`Hash: ${hash}`);
                return hash;
            });
        req.body.password = await encryptedPassword;

        const allData = await userModel.create(data);
        return res.status(201).send({ status: true, message: "Student is successfully created", data: allData })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

// ===========================login=============================================================

const userLogin = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please Provide data" })
        }
        const { email, password } = data
        if (!email) {
            return res.status(400).send({ status: false, message: "email is mandatory" })
        }
        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Please Provide Valid Email " })
        }
        if (!password) {
            return res.status(400).send({ status: false, message: "Password is mandatory" })
        }

        const Login = await userModel.findOne({ email });
        if (!Login)
            return res.status(404).send({ status: false, message: "Not a register email Id" });

        let decodePwd = await bcrypt.compare(password, Login.password);
        if (!decodePwd)
            return res.status(400).send({ status: false, message: "Password not match" });

        let token = jwt.sign(
            {
                userId: Login._id.toString(),
            },
            "As calm as the sea",
            { expiresIn: "50d" }
        );

        return res.status(200).send({
            status: true,
            message: "Teacher login successfull",
            data: { userId: Login._id, token: token },
        })
        //  if(!isValidPassword(Password)){
        //     return res
        //   .status(400)
        //   .send({status:false, message:"Please Provide Password "})
        //  }
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}
module.exports = { createUser, userLogin }