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
  
  if(!validateId(quantity)){
    const quantityParsed = parseInt(quantity);
    if(quantityParsed >= 1 && quantityParsed <= 100 ){
      return true;
    }
  }
  return false;
}

function validInputsForProductForPatch(params) {
  const { quantity } = params; //{}
  const numericalQty = Number(quantity);
  const validQuantity = numericalQty >= 0 && numericalQty <= 100;
  for (let i in params) {
    if (i === "quantity" && !validQuantity) {
      return false;
    }
    if (!params[i] || params[i] === "") {
      return false;
    }
  }
  return true;
}

module.exports = {
    validateEmail,
    validateId,
    checkEmptyInput,
    validateQuantity,
    validInputsForProductForPatch
};
