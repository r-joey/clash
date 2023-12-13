import { json, redirect } from '@sveltejs/kit';

export const POST = ({ request }) => {
    console.log(request)
    return json({
        name: 'yey'
    })
};