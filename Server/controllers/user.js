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
        console.log(data.user.id);
        const { data: userData, error: userError } = await supabase
        .from('user')
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

export const loginUser = async (request, reply) => {
    const { email, password } = request.body;
    try{
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
    
        if (error) throw error;
        
        const { data: userData, error: userError } = await supabase.from('user')
        .select('id, email, name')
        .eq('id', data.user.id)
        .single();

        if (userError) throw userError;

        data.userData = userData;

        return reply.send({ success: true, data });
    }
    catch(err){
        fastify.log.error(err);
        console.error(err);
        reply.status(400).send({ success: false, error: err.message });
    }
}

export const getUsers = async (request, reply) => {
    try{
        const params = request.query;
        const ids = params.id? (Array.isArray(params.id) ? params.id : [params.id]): null;
        
        let query = supabase
        .from('user')
        .select('id, email, name');
        if(ids){
            query = query.in('id', ids);
        }

        const { data, error } = await query;

        if (error) throw error;

        return reply.send({ success: true, data });
    }
    catch(err){
        fastify.log.error(err);
        console.error(err);
        reply.status(400).send({ success: false, error: err.message });
    }
}