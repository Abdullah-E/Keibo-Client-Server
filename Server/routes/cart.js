import { fastify, BASE_PATH } from "./init.js";
import { addToCart, getCart } from "../controllers/cart.js";

fastify.get(BASE_PATH+'/cart', async(request, reply)=>{
    await getCart(request,reply);
})

fastify.post(`${BASE_PATH}/cart/add`, async (request, reply) => {
    await addToCart(request, reply);
})

