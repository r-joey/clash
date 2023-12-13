import { redirect, error, invalid } from '@sveltejs/kit'; 

 export const actions = {
    createTournament : async ({request, locals}) => {
        const formData =  await request.formData() 
        const cover = formData.get('cover') 
        // console.log(formData)
        if(cover.size === 0) {
            formData.delete('cover')
        }

        const defaultTournamentData = {
            data: {
              participant: [],
              stage: [],
              group: [],
              round: [],
              match: [],
              match_game: []
            }
          }
        formData.append('user', locals.user.id)
        formData.append('status', 'In-progress')
        formData.append('tournament_data', JSON.stringify(defaultTournamentData) )
        try{
            await locals.pb.collection('tournaments').create(formData)
        } catch (err) { 
            console.log(err.data) 
            throw error(err.status, err.data)
             
        }  
        throw redirect(303, '/dashboard')
    }
 };