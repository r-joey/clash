<script>
    export let data
    import { page } from '$app/stores';
    import { getImageURL, getGameName } from '$lib/utils' 
    import { Heading, P, A, Button } from 'flowbite-svelte';
    import { ChevronRightSolid } from 'flowbite-svelte-icons';
    const { tournament } = data 
    const { expand: { user } = {} } = tournament || {}; 
    const navigation = [
        {title: 'Details', href: `/${tournament.id}`},
        {title: 'Participants', href: `/${tournament.id}/participants`},
        {title: 'Stages', href: `/${tournament.id}/stages`},
        {title: 'Awards', href: `/${tournament.id}/awards`}
    ] 
</script> 
<div class="rounded-lg overflow-hidden"> 
    <img id="cover-preview" class="object-cover w-full" src={tournament.cover ? getImageURL(tournament.collectionId, tournament.id, tournament.cover, "0x0") : '/mlbb.jpg'} alt="clash">
</div>    

<div class="text-center mt-2">
    <Heading tag="h4" customSize="text-lg font-extrabold ">{tournament.name}</Heading>
    <p class="text-gray-400 font-semibold">{getGameName(tournament.game)} | {tournament.status}</p>
    <p class="text-gray-500 text-sm font-semibold">{user.name}</p>
</div>

<div class="flex flex-nowrap overflow-x-auto gap-3 items-center justify-start whitespace-nowrap mt-5 mb-5"> 
    {#each navigation as navItem}
      <Button size='xs' outline={$page.url.pathname === navItem.href ? false : true} href={navItem.href}>{navItem.title}</Button>
    {/each} 
</div>
 
<slot/>