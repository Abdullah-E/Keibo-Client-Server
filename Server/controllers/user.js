import supabase from "../config/db.js";
import { fastify } from "../routes/init.js";

export const createUser = async (request, reply) => {
    const { email, name, password } = request.body;
    try{
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
    
        if (error) throw error;

        const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{ id: data.user.id, email, name }]);

        if (userError) throw userError;

        return reply.send({ success: true, message: 'Signup successful' });
    }
    catch(err){
        fastify.log.error(err);
        console.error(err);
        reply.status(400).send({ success: false, error: err.message });
    }
}