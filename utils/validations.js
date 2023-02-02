function validateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true);
  }
    return (false);
}

function validateId(userId){
  if (!isNaN(userId)) {
    return true;
  }
  return false;
}

function validatePassword(inputPass){
  if(inputPass === ""){
    return true;
  }
  else{
    return false;
  }
}

module.exports = {
    validateEmail,
    validateId,
    validatePassword
};
