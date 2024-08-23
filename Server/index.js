const fastify = require('fastify')({ logger: true });
const MongoClient = require('mongodb').MongoClient;

// Connect to MongoDB
const uri = "mongodb+srv://salaramirwork:FqCgnZ9nmWfp3boM@keibo.5gbky.mongodb.net/?retryWrites=true&w=majority&appName=Keibo";

const dbName = 'Keibo';
let db;
async function connectDB() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected successfully to MongoDB');
  db = client.db(dbName);
  console.log('Database Name:', db.databaseName); 
}
connectDB (); 


fastify.register(require('@fastify/swagger'), {
  swagger: {
    info: {
      title: 'fastify-api',
      description: 'API documentation',
      version: '1.0.0'
    },
    host: 'localhost:5000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
});

// Register Swagger UI
fastify.register(require('@fastify/swagger-ui'), {
  routePrefix: '/docs',
  exposeRoute: true
});

fastify.register(require('./routes/user'))


const PORT= 5000





const start= async () => {
  try{
    await fastify.listen(PORT);
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  }catch(err){
    fastify.log.error(err);
    process.exit(1);
  }
}

start();