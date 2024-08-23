const Users = require("../users")

const getUsers= (req,reply) => {
    reply.send(Users);
}

const getUser= (req,reply) => {
    const {password} = req.params;
    const user = Users.find(user => user.password === password);
    if(user){
        reply.send(user);
    }else{
        reply.status(404).send({error: 'User not found'});
    }
}

module.exports = {getUser,getUsers};