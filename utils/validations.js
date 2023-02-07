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

function checkEmptyInput(inputPass){
  if(inputPass === ""){
    return true;
  }
  else{
    return false;
  }
}

function validateQuantity(quantity){

  if(Number.isInteger(quantity)){
    if(quantity >= 0 && quantity <= 100 ){
      return true;
    }
  }
  return false;
}


module.exports = {
    validateEmail,
    validateId,
    checkEmptyInput,
    validateQuantity
};
