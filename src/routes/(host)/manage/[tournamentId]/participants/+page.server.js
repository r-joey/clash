import { redirect, error, invalid } from '@sveltejs/kit';  
import { serializeNonPOJOs } from '$lib/utils';

export async function load({locals, params}) {
	try { 
		 
        const participants = serializeNonPOJOs(await locals.pb.collection('participants').getFullList({
			filter: `tournament = "${params.tournamentId}"`
		}))  
		console.log('participants loads trigred')
        return {
			participants
		}
    } catch (err) { 
        throw error(err.status, err.message)
    }  
}
 export const actions = {
    createParticipant : async ({ request, locals, params }) => {
		const formData =  await request.formData()  
		const profile_picture = formData.get('profile_picture') 
		if(profile_picture.size === 0) {
            formData.delete('profile_picture')
        }
		formData.append('tournament', params.tournamentId) 
        try{
            await locals.pb.collection('participants').create(formData)
        } catch (err) { 
            console.log(err.data) 
            throw error(err.status, err.data)
             
        }  
        return {
			success: true
		}
	},
	editParticipant : async ({ request, locals }) => {
		const formData =  await request.formData() 
		try {
			await locals.pb.collection('participants').update(formData.get('id'), formData);
		} catch (err) {
			console.log('Error', err)
			throw error(err.status, err.message);
		}
		return {
			success: true
		}
	},
	deleteParticipant: async({ request, locals}) => {
		const { id } = Object.fromEntries(await request.formData());
		console.log(id)
		try {
			await locals.pb.collection('participants').delete(id);
		} catch (err) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}
		return {
			success: true
		};
	},
 };