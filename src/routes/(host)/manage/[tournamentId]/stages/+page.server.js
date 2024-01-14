import { error, redirect } from '@sveltejs/kit';
import { serializeNonPOJOs, formBody } from '$lib/utils';
import { BracketsManager } from 'brackets-manager';
import { InMemoryDatabase } from 'brackets-memory-db';

export async function load({locals, params}) {
	try { 
		const participants = serializeNonPOJOs(await locals.pb.collection('participants').getFullList({
			filter: `tournament = "${params.tournamentId}"`
		})) 
        const stages = serializeNonPOJOs(await locals.pb.collection('stages').getFullList({
			filter: `tournament = "${params.tournamentId}"`
		}))  
		console.log('stages loads trigred')
        return {
			stages,
			participants
		}
    } catch (err) { 
        throw error(err.status, err.message)
    }  
}

export const actions = {
    createStage : async ({ locals, request, params}) => {
		try {
			 
			const tournament = serializeNonPOJOs(await locals.pb.collection('tournaments').getOne(params.tournamentId, {
				expand: 'participants(tournament)'
			}))  
			const body = formBody(await request.formData())
			const participantsFromDB = tournament?.expand?.['participants(tournament)'] ?? [] 
			const seedings = participantsFromDB.filter(item => body.seeding.includes(item.id));
			
			// manual convert into brackets-manager object 
			const { name, seeding, type, seedOrdering, ...rest } = body; 
			let config = {
				tournamentId: 0,
				name,
				seeding: seedings,
				type,
				settings: {
					seedOrdering: Array.isArray(seedOrdering) ? seedOrdering : [seedOrdering],
					...rest
				}
			}; 
			const storage = new InMemoryDatabase()    
			const manager = new BracketsManager(storage)   
			await manager.create.stage(config)
			
			const newStage = {
				data: storage.data,
				tournament: params.tournamentId
			}
			// insert to DB 
			await locals.pb.collection('stages').create(newStage)  
		} catch (err) {
			console.log(err)
			throw error(err.status, err.message)
		}
        return {
			success: true
		}
		
	}
 };