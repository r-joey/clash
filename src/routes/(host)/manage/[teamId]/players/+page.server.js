 
import { error, redirect } from '@sveltejs/kit';
import { serializeNonPOJOs, formBody } from '$lib/utils';

export async function load({locals, params}) { 
    const { teamId } = params
    console.log(teamId)
    try {
        const players = serializeNonPOJOs(await locals.pb.collection('players').getFullList({filter:`team="${teamId}"`})) 
        return {
            players: players
        }
    } catch (err) {
        console.log("Error:", err)
        throw error(err.status, err.message)
        
    }
    return {}
}