const bcrypt = require("bcrypt");

const saltRounds = 10;

function encryptPassword(password){
    // Salting and hashing the password
    return bcrypt.genSalt(saltRounds)
              .then(salt => {
                  console.log('Salt: ', salt)
                  return bcrypt.hash(password, salt);
              })
              .then(hash => {
                  console.log('Hash: ', hash)
                  return hash;
              })
              .catch(err => console.error(err.message))
}

function comparePasswords(password){
    bcrypt
      .compare(password, hash)
      .then(res => {
        return (res) // return true
      })
      .catch(err => console.error(err.message));
}

module.exports = {
    encryptPassword,
    comparePasswords
  };
