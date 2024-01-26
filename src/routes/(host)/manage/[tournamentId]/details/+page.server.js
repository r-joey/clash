import { error } from '@sveltejs/kit';
export const actions = {
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
		return {
			success: true
		}; 
	}, 
};