import { redirect, error, invalid } from '@sveltejs/kit';  
import { serializeNonPOJOs } from '$lib/utils';

export async function load({ params, locals }) {
    try { 
        const participants = serializeNonPOJOs(await locals.pb.collection('participants').getFullList({
			filter: `tournament = "${params.tournamentId}"`
		}))   
        return {
			participants
		}
    } catch (err) { 
        throw error(err.status, err.message)
    }   
};