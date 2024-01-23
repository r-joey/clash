import { error, redirect } from '@sveltejs/kit' 
import { serializeNonPOJOs, formBody, isPowerOfTwo } from '$lib/utils';
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
		const body = formBody(await request.formData()) 
		if (!isPowerOfTwo(body.seeding.length)){
			console.log('is not power of 2, throwing error error')
			throw error(403, {
				message: 'Number of seeds must be a power of two. e.g. (2, 4, 8 ...)'
			})
		}
		try {
			 
			const tournament = serializeNonPOJOs(await locals.pb.collection('tournaments').getOne(params.tournamentId, {
				expand: 'participants(tournament)'
			}))  
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
			console.log('creating stage') 
			await manager.create.stage(config)
			
			const newStage = {
				data: storage.data,
				tournament: params.tournamentId
			}
			// insert to DB 
			await locals.pb.collection('stages').create(newStage)  
		} catch (err) {
			console.log(err)
			throw error(403)
		}
        return {
			success: true
		}
		
	},
	updateStage : async ({ locals, request}) => {
		try {

			const formData = formBody(await request.formData())   
			// console.log( formData.video_url === 0 )
			const stage = serializeNonPOJOs(await locals.pb.collection('stages').getOne(formData.stage_id)) 

			const storage = new InMemoryDatabase()    
			const manager = new BracketsManager(storage)  
			await manager.import(stage.data);
			const matchGameData = {
								parent_id: formData.match_id,
								number: formData.game_number, 
								vid_url : formData.video_url !== 0 ? formData.video_url: '',
								additional_information : formData.additional_information !== 0 ? formData.additional_information : '',
								opponent1: { score: formData.opp1 },
								opponent2: { score: formData.opp2 }
							}
			
			if (formData.winner == 'opp1') {
				matchGameData.opponent1.result = 'win';
			} else if (formData.winner == 'opp2') {
				matchGameData.opponent2.result = 'win';
				}

			await manager.update.matchGame(matchGameData);
			const newData = await manager.export();
			
			await locals.pb.collection('stages').update(formData.stage_id, {data: newData})
			// console.log('updating stage')
		} catch (err) {
			console.log(err)
			throw error(403)
		}

		return {
			success: true
		}
	}
 };