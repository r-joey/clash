import { redirect, error } from '@sveltejs/kit';
import { generateUsername } from '$lib/utils';
 
export const actions = {
    register: async ({ locals, request }) => {
        const body = Object.fromEntries(await request.formData())

        let username = generateUsername(body.name.split(' ').join('')).toLowerCase() 
        try{
            await locals.pb.collection('users').create({username, ...body})
            await locals.pb.collection('users').requestVerification(body.email)
        } catch (err) {
            throw error(err.status, err?.data ?? '') 
        } 

        throw redirect(303, '/login')
    }
}; 

export const load = async ({ locals }) =>{
    if (locals.pb.authStore.isValid) {
        throw redirect(303, '/dashboard')
    }
}