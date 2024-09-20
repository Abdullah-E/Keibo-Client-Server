import { BASE_PATH, fastify } from "./init.js";

import { getOrders, createOrder } from "../controllers/order.js";

fastify.get(`${BASE_PATH}/orders`, async (request, reply) => {
    await getOrders(request, reply);
});

fastify.post(`${BASE_PATH}/orders`, async (request, reply) => {
    await createOrder(request, reply);
});
