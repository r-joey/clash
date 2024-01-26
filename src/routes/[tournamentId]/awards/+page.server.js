import { redirect, error, invalid } from '@sveltejs/kit';  
import { serializeNonPOJOs } from '$lib/utils';

export async function load({ params, locals }) {
 
    const getAwards = async () => {
        try { 
            const awards = serializeNonPOJOs(await locals.pb.collection('awards').getFullList({
                filter: `tournament = "${params.tournamentId}"`,
                expand: 'participant'
            }))     
            return awards
        } catch (err) { 
            throw error(err.status, err.message)
        }  
    }
    
    return {
        awards: getAwards() 
    }
};