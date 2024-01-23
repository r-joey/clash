import { error, redirect } from '@sveltejs/kit'; 
export const actions = {
    deleteTournament: async({ request, locals}) => {
		const { id } = Object.fromEntries(await request.formData());  
		try {
			await locals.pb.collection('tournaments').delete(id);
		} catch (err) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}
		throw redirect(303, '/dashboard')
	},
    updateStatus: async({ request, locals, params }) => { 
        const formData = Object.fromEntries(await request.formData());  
		try {
			await locals.pb.collection('tournaments').update(params.tournamentId, formData);
		} catch (err) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}
		return {
            success: true
        }
    }
};