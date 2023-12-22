
import { error, redirect } from '@sveltejs/kit';
import { serializeNonPOJOs, formBody } from '$lib/utils';
import { BracketsManager } from 'brackets-manager';
import { InMemoryDatabase } from 'brackets-memory-db';


 
export async function load({locals, params}) { 

    try {
        const tournament = serializeNonPOJOs(await locals.pb.collection('tournaments').getOne(params.tournamentId, {
			expand: 'participants(tournament), stages(tournament)'
		})) 
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

 
export const actions = {
	createParticipant : async ({ request, locals, params }) => {
		const formData =  await request.formData()  
	 
		formData.append('tournament', params.tournamentId) 
        try{
            await locals.pb.collection('participants').create(formData)
        } catch (err) { 
            console.log(err.data) 
            throw error(err.status, err.data)
             
        }  
        return {
			success: true
		}
	},
	editParticipant : async ({ request, locals }) => {
		const formData =  await request.formData() 
		try {
			await locals.pb.collection('participants').update(formData.get('id'), formData);
		} catch (err) {
			console.log('Error', err)
			throw error(err.status, err.message);
		}
		return {
			success: true
		}
	},
	deleteParticipant: async({ request, locals}) => {
		const { id } = Object.fromEntries(await request.formData());
		console.log(id)
		try {
			await locals.pb.collection('participants').delete(id);
		} catch (err) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}
		return {
			success: true
		};
	},
	updateTournament: async ({ request, locals, params }) => {
		const formData = await request.formData();

		const cover = formData.get('cover');

		if (cover.size === 0) {
			formData.delete('cover');
		}

		try {
			await locals.pb.collection('tournaments').update(params.tournamentId, formData);
		} catch (err) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}

		// throw redirect(303, `/dashboard`);
	}, 
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
					seedOrdering: [seedOrdering],
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
			return {
				success: true
			}
		} catch (err) {
			console.log(err)
			throw error(err.status, err.message)
		}

		
	}
};