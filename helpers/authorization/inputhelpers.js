const bcrypt = require("bcryptjs");
const validateinputuser = (email, password) => {
    return email && password;
}
const comparepasswrod = (password, hashedpassword) => {
    return bcrypt.compareSync(password, hashedpassword);
}

module.exports = {
    validateinputuser,
    comparepasswrod
};