import { error, redirect } from '@sveltejs/kit' 
import { serializeNonPOJOs, formBody, isPowerOfTwo } from '$lib/utils';

export async function load({ locals, params}) {
    try {
        const stages = serializeNonPOJOs(await locals.pb.collection('stages').getFullList({
			filter: `tournament = "${params.tournamentId}"`
		}))
        return {
            stages
        }
    } catch (err) {
        console.log(err)
        throw error(err.status, err.message)
    } 
};