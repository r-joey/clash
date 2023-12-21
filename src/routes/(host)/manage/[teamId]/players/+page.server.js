 
import { error, redirect } from '@sveltejs/kit';
import { serializeNonPOJOs, formBody } from '$lib/utils';

export async function load({locals, params}) { 
    const { teamId } = params 
    try {
        const team = serializeNonPOJOs(await locals.pb.collection('participants').getOne(teamId))
        const players = serializeNonPOJOs(await locals.pb.collection('players').getFullList({filter:`team="${teamId}"`})) 
        return {
            team: team,
            players: players
        }
    } catch (err) {
        console.log("Error:", err)
        throw error(err.status, err.message) 
    }
} 

export const actions = {
    createPlayer : async ({request, locals, params}) => {
        const formData =  await request.formData()   
		formData.append('team', params.teamId) 
        try{
            await locals.pb.collection('players').create(formData)
        } catch (err) { 
            console.log(err.data) 
            throw error(err.status, err.data)
             
        }  
        return {
			success: true
		}
    },
    deletePlayer : async ({ request, locals, params }) => {
        const formData = await request.formData() 
        try {
			await locals.pb.collection('players').delete(await formData.get('id'));
		} catch (err) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}
		return {
			success: true
		};
    }
};