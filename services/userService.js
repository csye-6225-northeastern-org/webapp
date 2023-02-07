const User = require("../models/users");
class UserService {
    
    async createUser(user){
        return await User.create(user);
    }

    async findOneById(userId){
        return await User.findOne({where: {id: userId}});
    }
    
    async findOneByUsername(username){
        return await User.findOne({where: {username}});
    }

}

module.exports = UserService;
