import { redirect } from '@sveltejs/kit' 
import { error } from '@sveltejs/kit'
export const actions = {
    updateProfile : async ({ locals, request }) => {
        console.log('updating profile...')
        let data = await request.formData()
        const userAvatar = data.get('avatar')

        if( userAvatar.size === 0) {
            data.delete('avatar')
        }
        
        try {
            const { name, avatar } = await locals.pb.collection('users').update(locals?.user?.id, data)

            locals.user.name = name
            locals.user.avatar = avatar
        } catch (err) { 
            throw error(err.status, err.message)
           
        }

        return {
            success: true
        }
    },
    updatePassword: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData());

		try {
			await locals.pb.collection('users').update(locals.user.id, data);
			locals.pb.authStore.clear();
		} catch (err) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}

		throw redirect(303, '/login');
	},

    updateEmail: async ({ locals, request }) => {
        const data = Object.fromEntries(await request.formData()) 
        try {
            await locals.pb.collection('users').requestEmailChange(data.email)

        } catch (err) { 
            throw error(err.status, err.data)
        }

        return {
            success: true
        }
    },

    updateUsername: async ({ locals, request }) => {
        const data = Object.fromEntries(await request.formData())

        try { 
            await locals.pb.collection('users').getFirstListItem(`username = "${data.username}"`)
        } catch (err) {  
            if (err.status === 404){
                try{ 
                    const { username } = await locals.pb.collection('users').update(locals.user.id, {username: data.username})
                    locals.user.username = username
                    return {
                        success: true
                    }
                } catch (err) { 
                    throw error(err.status, err.data)
                }
            }
            console.log('Error: ', err.message)
            throw error(err.status, err.message)
        }  
    }
};