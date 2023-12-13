import { error, redirect } from '@sveltejs/kit';
import { serializeNonPOJOs } from '$lib/utils';

export async function load({locals}) {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const getUsersTournaments = async (userId) => {
		try {
			const tournaments = serializeNonPOJOs(
				await locals.pb.collection('tournaments').getFullList({
					filter: `user = "${userId}"`,
                    sort: '-created'
				})
			);
			return tournaments;
		} catch (err) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		}
	};

	return {
		tournaments: getUsersTournaments(locals.user.id)
	};
};