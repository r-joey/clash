import { redirect, error, invalid } from '@sveltejs/kit';  
import { serializeNonPOJOs } from '$lib/utils';
import { TableRowOutline } from 'flowbite-svelte-icons';
import { format } from 'path';

export async function load({locals, params}) {
	try { 
        const participants = serializeNonPOJOs(await locals.pb.collection('participants').getFullList({
			filter: `tournament = "${params.tournamentId}"`
		}))   
        return {
			participants
		}
    } catch (err) { 
        throw error(err.status, err.message)
    }  
}
 export const actions = {
    createParticipant : async ({ request, locals, params }) => { 
		let tournament = null
		try {
			tournament = serializeNonPOJOs(await locals.pb.collection('tournaments').getOne(params.tournamentId))  
		} catch (err) {
			console.log(err)
			throw error(err.status, err?.message)
		}

		if (tournament !== null && tournament?.status !== 'Preparation') {
			throw error(403, {message: 'Not allowed to create new participant while the tournament is In progress or has been Finalized'})
		}
		const formData =  await request.formData()   
		try {
			await locals.pb.collection('participants').getFirstListItem(`name = "${formData.get('name')}" && tournament = "${tournament.id}"`)  
		} catch (err) {
			if (err.status === 404){ 
				try {
					const profile_picture = formData.get('profile_picture') 	
					if(profile_picture.size === 0) {
						formData.delete('profile_picture')
					}
					formData.append('tournament', params.tournamentId) 
					try{
						await locals.pb.collection('participants').create(formData)
					} catch (err) { 
						console.log(err?.message) 
						throw error(err.status, err?.message) 
					}  
					return {
						success: true
					}
				} catch (err) { 
					console.log(err.data) 
					throw error(err.status, err.data) 
				}
			}
		}
		throw error(403, {
			message: 'Participant already exist'
		})
		 
	},
	updateParticipant : async ({ request, locals, params }) => {
		let tournament = null
		try {
			tournament = serializeNonPOJOs(await locals.pb.collection('tournaments').getOne(params.tournamentId))  
		} catch (err) {
			console.log(err)
			throw error(err.status, err?.message)
		}

		if (tournament !== null && tournament?.status !== 'Preparation') {
			throw error(403, {message: 'Not allowed to edit participant while the tournament is In progress or has been Finalized'})
		}
		const formData =  await request.formData() 
		const profile_picture = formData.get('profile_picture') 	
		if(profile_picture.size === 0) {
			formData.delete('profile_picture')
		}
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
	deleteParticipant: async({ request, locals, params}) => {
		let tournament = null
		try {
			tournament = serializeNonPOJOs(await locals.pb.collection('tournaments').getOne(params.tournamentId))  
		} catch (err) {
			console.log(err)
			throw error(err.status, err?.message)
		}

		if (tournament !== null && tournament?.status !== 'Preparation') {
			throw error(403, {message: 'Not allowed to delete participant while the tournament is In progress or has been Finalized'})
		}
		const { id } = Object.fromEntries(await request.formData()); 
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
 };