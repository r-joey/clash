import { error} from '@sveltejs/kit'
import { serializeNonPOJOs } from "$lib/utils";
export async function load({locals, params}) {
    try { 
        const awards = await locals.pb.collection('awards').getFullList({
            filter: `tournament = "${params.tournamentId}"`,
            sort: 'created'
        })
        const participants = serializeNonPOJOs(await locals.pb.collection('participants').getFullList({
			filter: `tournament = "${params.tournamentId}"`
		})) 
        return {
            awards,
            participants
        }
    } catch (err) { 
        throw error(err.status, err.message)
    } 
}
  
export const actions = {
    createAward : async ({ request, locals, params }) => { 
		let tournament = null
		try {
			tournament = serializeNonPOJOs(await locals.pb.collection('tournaments').getOne(params.tournamentId))  
		} catch (err) {
			console.log(err)
			throw error(err.status, err?.message)
		}

		if (tournament !== null && tournament?.status !== 'Finalized') {
			throw error(403, {message: 'Not allowed to create new award while the tournament is in progress or has not been finalized'})
		}
		const formData =  await request.formData()   
        formData.append('tournament', params.tournamentId)
        try {
            await locals.pb.collection('awards').create(formData)
            return {
                success: true
            }
        } catch (err) { 
            console.log(err.data) 
            throw error(err.status, err.data) 
        }  
	},
    updateAward : async ({ request, locals, params }) => {
		let tournament = null
		try {
			tournament = serializeNonPOJOs(await locals.pb.collection('tournaments').getOne(params.tournamentId))  
		} catch (err) {
			console.log(err)
			throw error(err.status, err?.message)
		}

		if (tournament !== null && tournament?.status !== 'Finalized') {
			throw error(403, {message: 'Not allowed to edit award while the tournament is In progress or has not been Finalized'})
		}
		const formData =  await request.formData()  
		try {
			await locals.pb.collection('awards').update(formData.get('id'), formData);
		} catch (err) {
			console.log('Error', err)
			throw error(err.status, err.message);
		}
		return {
			success: true
		}
	},
    deleteAward: async({ request, locals, params}) => { 
		const { id } = Object.fromEntries(await request.formData()); 
		try {
			await locals.pb.collection('awards').delete(id);
		} catch (err) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}
		return {
			success: true
		};
	}
};