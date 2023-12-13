import { error, redirect } from '@sveltejs/kit';  

export const actions = {
    login : async ({ request, locals }) => {
        const body =  Object.fromEntries(await request.formData())
        try {
            await locals.pb.collection('users').authWithPassword(body.email, body.password)
            if(!locals.pb?.authStore?.model?.verified){
                locals.pb.authStore.clear()
                return {
                    notVerified: true
                }
            }
        } catch (err) {  
            throw error(err.status, err.data);
        }

        throw redirect(303, '/dashboard')

    }
};

 
export const load = async ({ locals }) =>{
    if (locals.pb.authStore.isValid) {
        throw redirect(303, '/dashboard')
    }
}