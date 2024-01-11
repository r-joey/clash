<script>  
    export let data
    import { enhance, applyAction } from '$app/forms';
    import toast, { LoaderIcon } from 'svelte-french-toast';
    import { ArrowLeftSolid, DotsHorizontalOutline, DotsVerticalOutline, ExclamationCircleOutline, UsersSolid, TrashBinSolid, UserEditSolid, EditOutline} from 'flowbite-svelte-icons'
    import {  Modal, Label, Input, Checkbox, Select, Button, Hr, Helper, Listgroup, ListgroupItem, Avatar, ButtonGroup, InputAddon, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Textarea } from 'flowbite-svelte'
    let deletePlayerModal = false
    let selectedPlayer = null
    let loading = false

    const handleCreateParticipant = () => {
        loading = true;
        return async ({ result, update }) => {   
        switch (result.type) { 
            case 'success':
                await update();
                break; 
            case 'error': 
                toast.error(result.error.message); 
                break;
            default:
                await applyAction();
        }
        loading = false;
        deletePlayerModal = false
        };
    }; 

</script>

<div class="flex items-center justify-center gap-2">
    <Button href={`/manage/${data.team.tournament}/participants`} size="sm" outline={true} pill={true}>
        <ArrowLeftSolid size="sm"/>
    </Button> 
    <h3 class="text-white text-3xl font-bold">{data.team.name}</h3>
</div>

<form class="space-y-2 mb-4" action="?/createPlayer" method="POST" use:enhance={handleCreateParticipant}>
    <Label>Player details</Label>
    <ButtonGroup class="w-full"> 
        <Input  type="text" name="name" placeholder="Player name" required />
        <Input  type="text" name="social" placeholder="https://www.facebook.com/joey_rapista" required />
        <Input  type="text" name="identity" placeholder="IGN or jersey number etc..." required />
        <Input  type="text" name="position" placeholder="Mid, Point Guard etc..." required />
        <Button outline disabled={loading} color="primary" type="submit">Add</Button>
      </ButtonGroup> 
</form>
<Hr/>
<Table>
    <TableHead> 
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Link</TableHeadCell>
            <TableHeadCell>Identity</TableHeadCell> 
            <TableHeadCell>Position</TableHeadCell> 
            <TableHeadCell></TableHeadCell> 
    </TableHead>
    <TableBody>
        {#each data.players ?? [] as player} 
            <TableBodyRow> 
                <TableBodyCell>{player.name ?? ''}</TableBodyCell>
                <TableBodyCell><a target="_blank"  class="underline text-orange-300" href={player.social ?? ''}>social</a> </TableBodyCell>
                <TableBodyCell>{player.identity ?? ''}</TableBodyCell>
                <TableBodyCell>{player.position ?? ''}</TableBodyCell>
                <TableBodyCell><Button  on:click={()=>{deletePlayerModal=true; selectedPlayer=player}} size="xs"><TrashBinSolid size="xs" /></Button></TableBodyCell>
            </TableBodyRow>
        {/each} 
    </TableBody>
</Table>

<Modal bind:open={deletePlayerModal} size="xs" autoclose={false}>
    <div class="text-center">
        <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <h3 class="text-md font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete participant:</h3> 
        <p class="mb-5 text-lg font-normal"> <strong>{selectedPlayer.name}</strong>?</p>
        <form action="?/deletePlayer" method="POST" use:enhance={handleCreateParticipant}>  
            <input hidden name="id" value={selectedPlayer.id}>
            <Button disabled={loading} type="submit" color="primary" class="me-2">Yes</Button>
            <Button disabled={loading} type="button" on:click={()=>{selectedPlayer={}; deletePlayerModal=false}} color="alternative">Cancel</Button>
        </form>
    </div>
</Modal> 