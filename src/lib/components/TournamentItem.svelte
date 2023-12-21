<script>
    import { getImageURL } from '$lib/utils'
    import { Button, Dropdown, DropdownItem } from 'flowbite-svelte'
    import { DotsVerticalOutline } from 'flowbite-svelte-icons'
    export let tournament
</script>

<div class="rounded overflow-hidden shadow-lg bg-gray-900 text-gray-400"> 
    <div class="relative ">
        <a href={`/manage/${tournament.id}`}>
            <img class="w-full h-60 object-cover"
                src= {tournament?.cover ? getImageURL(tournament?.collectionId, tournament?.id, tournament?.cover, "0x0") : `https://miro.medium.com/v2/resize:fit:1200/1*RCux7YwbQaREA2313BevCg.jpeg`}
                alt="Sunset in the mountains">
            <div
                class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25">
            </div>
        </a> 
        <!-- In-progress | Preparation | Finalized -->
        <div class="absolute bottom-0 left-0 bg-orange-500 px-4 py-2 text-white text-sm">
            {tournament.status}
        </div>  
    </div>
    <div class="px-6 py-4"> 
        <a href={`/manage/${tournament.id}`} class="font-semibold text-lg inline-block">
            {tournament.name}
        </a>
        <p class="text-gray-500 font-bold text-sm">
            MLBB undergroud
        </p>
    </div>
    <div class="px-6 py-4 flex justify-between flex-row items-center">
        <span class="py-1 text-sm font-regular text-gray-700 mr-1 flex flex-row items-center">
            <!-- icon goes here -->
            <span class="ml-1">6 mins ago</span> 
        </span>
        <span href="#/" class="py-1 text-sm font-regular text-gray-700 mr-1 flex flex-row items-center">
            <!-- icon goes here -->
            <span class="ml-1">{tournament.game}</span> 
        </span>
            
    </div>
</div>
  