<script>
    import { TournamentItem } from "$lib/components" 
    export let data
    const { tournaments } = data 
    const { user } = data

 
</script>  
<div class="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-10">
    {#each tournaments as tournament }
        <TournamentItem {tournament} {user}/>
    {/each} 
</div> 