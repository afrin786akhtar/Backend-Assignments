const mongoose = require('mongoose')

const isValidObjectId = function(objectId){
  return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidName = (name) => {
  if (/^[A-Za-z]{1,35}/.test(name)) return true
  return false
}

const isValidEmail = (mail) => {
  if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(mail)) return true
  return false
}

const isValidPassword = (password) => {
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(password);
}
  
const isValid = (value) => {
  if (typeof value == undefined || value == null || value.length == 0)
    return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidate = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length > 0) return true;
  return false;
};

module.exports = { isValidName, isValidEmail, isValidPassword, isValid, isValidate , isValidObjectId}