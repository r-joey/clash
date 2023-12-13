import PocketBase from 'pocketbase';
import { serializeNonPOJOs } from '$lib/utils';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
  
export const handle = async ({event, resolve}) => { 
    event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL)
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')

    try {
        if (event.locals.pb.authStore.isValid){
            await event.locals.pb.collection('users').authRefresh()
            event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model)
        }
    } catch (_) {
        event.locals.pb.authStore.clear()
        event.locals.user = undefined
    } 

    const response = await resolve(event)
    // TODO: Secure before deployment
    response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({secure: false}))
    
    return response
}