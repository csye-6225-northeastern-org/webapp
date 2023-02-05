function getCredentialsIfPresent(auth){
    try{
        const inputCredentials = auth.split(" ")[1];
        const decodedCredentials = Buffer.from(inputCredentials, 'base64').toString('utf-8')
        try{
            const [username, password] = decodedCredentials.split(":");
            return {status : true, username, password}
        }
        catch(error){
            console.error("Error while splitting the decoded string from user");
            return {status : false} 
        }

    }catch(error){
        console.error("Error while splitting the input string from user");
        return {status : false};
    }
      
}

function isObjEmpty(obj) {
    return JSON.stringify(obj) === '{}';
}

module.exports = {
    getCredentialsIfPresent,
    isObjEmpty
}