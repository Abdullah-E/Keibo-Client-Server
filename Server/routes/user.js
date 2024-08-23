const users = require('../users');
//const {getUsers,getUser} = require('../controllers/UserController');
const fastify = require('fastify');
const{v4:uuidv4} = require('uuid');

const Users = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    password: { type: 'string' }
  }
};


const getUsersOpts = {
  schema: {
    response: {
      200: {
        type: 'array',
        items: Users
      }
    }

  },}
//   handler:function(request, reply) {
//     reply.send(items);
// }};



const getUserOpts={
    schema:{
        response:{
            200:Users
        }
    }
}



function itemRoutes(fastify, options, done) {
  // GET /users - Return the array of users
  fastify.get('/users', getUsersOpts, async (request, reply) => {
    return users;  // Return the users array directly
  });

  // GET /users/:password - Return a user matching the password
  fastify.get('/users/:password', getUserOpts,async (request, reply) => {
    const { password } = request.params;
    const user = users.find(user => user.password === password);
    
    if (user) {
      reply.send(user);
    } else {
      reply.status(404).send({ error: 'User not found' });
    }
  });

  
// POST /users - Create a new user
fastify.post('/users', {
  schema: {
    body: {
      type: 'object',
      required: ['name', 'password'],
      properties: {
        name: { type: 'string' },
        password: { type: 'string' }
      }
    },
    response: {
      201: Users
    }
  },
  handler: (request, reply) => {
    const { name, password } = request.body;
    const id = uuidv4();
    const user = { id, name, password };
    users.push(user);
    reply
      .code(201)
      .send(user);
  }
});

  done();




}


module.exports = itemRoutes;
