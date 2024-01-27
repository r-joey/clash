<script>
    import { getImageURL } from '$lib/utils'
    import { Button } from 'flowbite-svelte'
    import { ShareAllOutline } from 'flowbite-svelte-icons'
    import { page } from '$app/stores'; 
    export let tournament 
    const shareable_url  = `${$page.url.origin}/${tournament.id}`
    const share = async () => {
        try {
            await navigator.share({url:shareable_url}); 
        } catch (error) {
            toast.error('Something went wrong while sharing shareable URL.')
        }
    }
</script>

<div class="rounded overflow-hidden shadow-lg bg-gray-900 text-gray-400"> 
    <div class="relative ">
        <a href={`/manage/${tournament.id}/details`}>
            <img class="w-full h-60 object-cover"
                src= {tournament?.cover ? getImageURL(tournament?.collectionId, tournament?.id, tournament?.cover, "0x0") : `/default_cover.jpg`}
                alt="Sunset in the mountains">
            <div
                class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25">
            </div>
        </a> 
        <!-- In-progress | Preparation | Finalized -->
        <!-- <div class="absolute bottom-0 left-0 bg-orange-500 px-4 py-2 text-white text-sm">
            
        </div>
          -->
    </div>
    <div class="px-6 py-4"> 
        <a href={`/manage/${tournament.id}/details`} class="font-semibold text-lg">
            <p class="line-clamp-1">
                {tournament.name}
            </p>
        </a>
        <p class="text-gray-500 font-bold text-sm">
            {tournament.status}
        </p> 
    </div> 
    <div class="pb-3 px-3">
        <Button on:click={share} class="w-full">
            <ShareAllOutline class="me-2" ></ShareAllOutline>
            Share
        </Button>
    </div>
</div>
  