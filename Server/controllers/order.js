import supabase from "../config/db.js";


export const createOrder = async (request, reply) => {
    const {email} = request.query;
    const orderData = request.body;

    try {
        const { data:user, error:userError } = await supabase
            .from('user')
            .select('id, email')
            .eq('email', email)
            .single();
        if(userError) throw userError;

        const { data:cartData, error:cartError } = await supabase
            .from('cart')
            .select('items')
            .eq('user_id', user.id)
            .single();
        if(cartError) throw cartError;

        if(!cartData || cartData.length === 0 || !cartData.items.length){
            return reply.status(400).send({
                message: "Cart is empty",
            });
        }

        const { data, error } = await supabase
            .from("order")
            .insert([
                {
                    user_id: user.id,
                    ...orderData,
                    items: cartData.items,
                }
            ]);
        if(error) throw error;

        return reply.status(201).send({
            message: "Order created successfully",
            data,
        });
    } catch (error) {
        return reply.status(500).send({
            message: "Error creating order",
            error: error.message,
        });
    }
}

export const getOrders = async (request, reply) => {
    const params = request.query;

    const email = params.email;

    try{
        const { data, error} = await supabase
            .from("order")
            .select("*")
            .eq("email", email);
        if(error) throw error;
        return reply.status(200).send({
            message: "Orders fetched successfully",
            data,
        });
    }
    catch(error){
        console.error(error);
        return reply.status(500).send({
            message: "Error fetching orders",
            error: error.message,
        });
    }


}