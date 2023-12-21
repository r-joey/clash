<script>
    export let tournament  
    import { enhance, applyAction } from '$app/forms';
    import toast from 'svelte-french-toast';
    import { DotsHorizontalOutline, DotsVerticalOutline, ExclamationCircleOutline, UsersSolid, TrashBinSolid, UserEditSolid, EditOutline} from 'flowbite-svelte-icons'
 
    import {  Modal, Label, Input, Checkbox, Select, Button, Hr, Helper, Listgroup, ListgroupItem, Avatar, ButtonGroup, InputAddon, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Textarea } from 'flowbite-svelte'
    const { participant_type } = tournament
 
    let participants = tournament?.expand?.['participants(tournament)'] ?? []
    let loading = false;


    let teamEditMode = false
    let selectedTeam = null
    let deleteParticipantModal = false

    const handleCreateParticipant = () => {
        loading = true;
        return async ({ result, update }) => { 
            console.log(result)
            await applyAction(result)
        // switch (result.type) { 
        //     case 'success':
        //         await update();
        //         break; 
        //     case 'error': 
        //         toast.error(result.error.message); 
        //         break;
        //     default:
        //         await applyAction();
        // }
        loading = false;
        };
    }; 
 
    // Player area 
    let playerEditMode = false
    let selectedPlayer = null
    let deletePlayerModal = false
    // end Player area
</script>



 
 
<!-- Team starts -->
{#if participant_type === 'team'}    
    {#if !teamEditMode}    
    <form class="space-y-2 mb-4" action="?/createParticipant" method="POST" use:enhance>
        <Label>Team details</Label>
        <ButtonGroup class="w-full"> 
            <Input  type="text" name="name" placeholder="Team name" required /> 
            <Input  type="text" name="social" placeholder="https://www.facebook.com/joey_rapista" /> 
            <Button color="primary" type="submit">Add</Button> 
        </ButtonGroup> 
    </form>
    {/if}
    {#if teamEditMode}    
    <form class="space-y-2 mb-4" action="?/editParticipant" method="POST">
        <Label>Team details</Label>
        <ButtonGroup class="w-full"> 
            <input value={selectedTeam.id ?? ''} hidden name="id" />
            <Input value={selectedTeam.name ?? ''}  type="text" name="name" placeholder="player name" required /> 
            <Input value={selectedTeam.social ?? ''} type="text" name="social" placeholder="https://www.facebook.com/joey_rapista" />
            <Button color="primary" type="submit">Save</Button> 
            <Button on:click={()=>teamEditMode=false} outline color="primary" type="submit">Cancel</Button> 
        </ButtonGroup> 
    </form>
    {/if}
<Hr/>
<Table>
    <TableHead> 
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Link</TableHeadCell>
            <TableHeadCell> </TableHeadCell>  
    </TableHead>
    <TableBody>
        {#each participants as participant} 
            <TableBodyRow> 
                <TableBodyCell>{participant.name}</TableBodyCell>
                <TableBodyCell><a target="_blank" class="underline text-orange-300" href={participant.social ?? ''}>social</a> </TableBodyCell>
                <TableBodyCell>
                    <Button size="sm" href={`/manage/${participant.id}/players`}><UsersSolid size="sm"></UsersSolid></Button>
                    <Button size="sm" on:click={()=> {teamEditMode=true; selectedTeam=participant}}><UserEditSolid size="sm"></UserEditSolid></Button>
                    <Button size="sm" on:click={()=> {deleteParticipantModal=true; selectedTeam=participant; console.log(selectedTeam)}}><TrashBinSolid size="sm"></TrashBinSolid></Button>
                </TableBodyCell> 
            </TableBodyRow>
        {/each} 
    </TableBody>
</Table>
 
 {/if}  
<Modal bind:open={deleteParticipantModal} size="xs" autoclose={false}>
    <div class="text-center">
        <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <h3 class="text-md font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete participant:</h3> 
        <p class="mb-5 text-lg font-normal"> <strong>{selectedTeam.name}</strong>?</p>
        <form action="?/deleteParticipant" method="POST">  
            <input type="hidden" name="id" value={selectedTeam.id}>
            <Button type="submit" color="primary" class="me-2">Yes</Button>
            <Button type="button" on:click={()=>{selectedTeam={}}} color="alternative">Cancel</Button>
        </form>
    </div>
</Modal> 
<!-- team ends -->













{#if participant_type === 'player'}
    {#if !playerEditMode}    
        <form class="space-y-2 mb-4" action="?/createParticipant" method="POST">
            <Label>Player details</Label>
            <ButtonGroup class="w-full"> 
                <Input  type="text" name="name" placeholder="player name" required />
                <Input  type="text" name="identity" placeholder="game username or jersey number etc... " required />
                <Input  type="text" name="social" placeholder="https://www.facebook.com/joey_rapista" />
                <Button color="primary" type="submit">Add</Button> 
            </ButtonGroup> 
        </form>
    {/if}
    {#if playerEditMode}    
        <form class="space-y-2 mb-4" action="?/editParticipant" method="POST">
            <Label>Player details</Label>
            <ButtonGroup class="w-full"> 
                <input value={selectedPlayer.id ?? ''} hidden name="id" />
                <Input value={selectedPlayer.name ?? ''}  type="text" name="name" placeholder="player name" required />
                <Input value={selectedPlayer.identity ?? ''} type="text" name="identity" placeholder="game username or jersey number etc... " required />
                <Input value={selectedPlayer.social ?? ''} type="text" name="social" placeholder="https://www.facebook.com/joey_rapista" />
                <Button color="primary" type="submit">Save</Button> 
                <Button on:click={()=>playerEditMode=false} outline color="primary" type="submit">Cancel</Button> 
            </ButtonGroup> 
        </form>
    {/if}
<Hr/>
<Table>
    <TableHead> 
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Identity</TableHeadCell>
            <TableHeadCell>Link</TableHeadCell> 
            <TableHeadCell></TableHeadCell>
    </TableHead>
    <TableBody>
        {#each participants as participant} 
            <TableBodyRow> 
                <TableBodyCell>{participant.name ?? ''}</TableBodyCell>
                <TableBodyCell>{participant.identity ?? ''}</TableBodyCell>
                <TableBodyCell><a target="_blank"  class="underline text-orange-300" href={participant.social ?? ''}>social</a> </TableBodyCell>
                <TableBodyCell>
                    <Button size="sm" on:click={()=> {deletePlayerModal=true; selectedPlayer=participant}}><TrashBinSolid size="sm"></TrashBinSolid></Button>
                    <Button size="sm" on:click={()=> {playerEditMode=true; selectedPlayer=participant}}><UserEditSolid size="sm"></UserEditSolid></Button>
                </TableBodyCell>
            </TableBodyRow>
        {/each} 
    </TableBody>
</Table>

<Modal bind:open={deletePlayerModal} size="xs" autoclose={false}>
    <div class="text-center">
        <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <h3 class="text-md font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete participant:</h3> 
        <p class="mb-5 text-lg font-normal"> <strong>{selectedPlayer.name}</strong>?</p>
        <form action="?/deleteParticipant" method="POST">  
            <input type="hidden" name="id" value={selectedPlayer.id}>
            <Button type="submit" color="primary" class="me-2">Yes</Button>
            <Button type="button" on:click={()=>{selectedPlayer=null; deletePlayerModal=false}} color="alternative">Cancel</Button>
        </form>
    </div>
</Modal> 
{/if}