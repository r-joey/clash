import { redirect, error, invalid } from '@sveltejs/kit'; 

 export const actions = {
    createTournament : async ({request, locals}) => {
        const formData =  await request.formData() 
        const cover = formData.get('cover')  
        if(cover.size === 0) {
            formData.delete('cover')
        } 
        formData.append('user', locals.user.id)
        formData.append('status', 'Preparation') 
        // status, PREPARATION | IN PROGRESS | FINALIZED
        try{
            await locals.pb.collection('tournaments').create(formData)
        } catch (err) { 
            console.log(err.data) 
            throw error(err.status, err.data)
             
        }  
        throw redirect(303, '/dashboard')
    }
 };