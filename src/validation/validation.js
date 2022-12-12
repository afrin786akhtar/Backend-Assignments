const isValidName = (name) => {
  if (/^[A-Za-z]{1,35}/.test(name)) return true
  return false
}

const isValidEmail = (mail) => {
  if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(mail)) return true
  return false
}

const isValidPassword = (password) => {
  if (/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$/.test(password)) return true
  return false
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

module.exports = { isValidName, isValidEmail, isValidPassword, isValid, isValidate }