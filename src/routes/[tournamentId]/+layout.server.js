import { error} from '@sveltejs/kit'
import { serializeNonPOJOs } from "$lib/utils";


export async function load({locals, params}) {  
    try {
        const tournament = serializeNonPOJOs(await locals.pb.collection('tournaments').getOne(params.tournamentId,  {expand : 'user'})) 
        return {
            tournament
        }
    } catch (err) {
        console.log(err)
        throw error(err.status, err.message)
    } 
};
