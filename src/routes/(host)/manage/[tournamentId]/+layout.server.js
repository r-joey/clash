import { redirect, error} from '@sveltejs/kit'
import { serializeNonPOJOs } from "$lib/utils";
export async function load({locals, params}) { 

    try { 
        const tournament = serializeNonPOJOs(await locals.pb.collection('tournaments').getOne(params.tournamentId))  
        if (locals.user.id === tournament.user) {
            return {
                tournament
            };
        }  
    } catch (err) { 
        throw error(err.status, err.message)
    } 
	// redirect to dashboard if not the owner of the tournament 
	throw redirect(303, '/dashboard')
};
