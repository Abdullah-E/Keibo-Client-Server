import { fastify, BASE_PATH } from "./init.js";
import { createUser } from "../controllers/user.js";

fastify.post(`${BASE_PATH}/users/signup`, async (request, reply) => {
    await createUser(request, reply);
})