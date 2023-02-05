const bcrypt = require("bcrypt");

const saltRounds = 10;

async function comparePassword(enteredPassword, hash){
    return await bcrypt.compare(enteredPassword, hash);
}

module.exports = {
    comparePassword
};