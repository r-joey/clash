import { redirect, error} from '@sveltejs/kit'
import { serializeNonPOJOs } from "$lib/utils";
export async function load({locals, params}) {
    try { 
        const awards = await locals.pb.collection('awards').getFullList({
            filter: `tournament = "${params.tournamentId}"`,
            sort: '-created'
        })
        return {
            awards
        }
    } catch (err) { 
        throw error(err.status, err.message)
    } 
}