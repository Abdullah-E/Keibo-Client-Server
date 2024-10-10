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

    const {email, user_id, recent} = params;

    try{
        let query = supabase
            .from("order")
            .select("*");
        // if(recent){
        //     query = query.eq("created_at", recent);
        // }
        console.log(user_id);

        
        if(email){
            const { data:user, error:userError } = await supabase
                .from('user')
                .select('id, email')
                .eq('email', email)
                .single();
            if(userError) throw userError;
            query = query.eq("user_id", user.id);
        }
        if(user_id){
            query = query.eq("user_id", user_id);
        }
        const { data, error } = await query;
        
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

export const getOrder = async (request, reply) => {
    const { id } = request.query;
    try{
        const { data, error } = await supabase
            .from('order')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return reply.send({ success: true, data });
    }
    catch(err){
        console.error(err);
        return reply.status(400).send({ success: false, error: err.message });
    }
}

//admin functions:

export const getAllOrders = async (request, reply) => {
    try{
        const {sortBy, order} = request.query;

        let query = supabase
            .from('order')
            .select('*');

        if(sortBy){
            query = query.order(sortBy, {ascending: order === "asc"});

        }
        const { data, error } = await query;


        if (error) throw error;

        return reply.send({ success: true, data });
    }
    catch(err){
        console.error(err);
        return reply.status(400).send({ success: false, error: err.message });
    }
}

export const updateQuote = async (request, reply) => {
    const {id} = request.query;
    const { quotation } = request.body;
    try{
        const { data, error } = await supabase
            .from('order')
            .update({ quotation })
            .eq('id', id);

        if (error) throw error;

        return reply.send({ success: true, data });
    }
    catch(err){
        console.error(err);
        return reply.status(400).send({ success: false, error: err.message });
    }
}