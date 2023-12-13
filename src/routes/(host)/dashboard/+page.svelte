<script>
    import { TournamentItem } from "$lib/components"
    import { Button, Dropdown, DropdownItem } from 'flowbite-svelte'
    export let data
    const { tournaments } = data 

 
</script>  
<div class="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-10">
    {#each tournaments as tournament }
        <TournamentItem {tournament}/>
    {/each} 
</div> 