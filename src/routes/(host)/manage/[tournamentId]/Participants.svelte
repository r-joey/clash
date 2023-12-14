<script>
    export let tournament 
	import { enhance } from '$app/forms';
    import toast from 'svelte-french-toast';
    import { DotsHorizontalOutline, DotsVerticalOutline, ExclamationCircleOutline, UsersSolid, TrashBinSolid} from 'flowbite-svelte-icons'
 
    import {  Modal, Label, Input, Checkbox, Select, Button, Hr, Helper, Listgroup, ListgroupItem, Avatar, ButtonGroup, InputAddon, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Textarea } from 'flowbite-svelte'
    const { participant_type } = tournament
    let playerModal = false 
    let selectedTeam = {}
    let participants = tournament?.expand?.['participants(tournament)'] ?? []
    let loading = false;
    let deleteParticipantModal = false
    const handleCreateParticipant = () => {
        loading = true;
        return async ({ result, update }) => { 
            console.log(result)
        switch (result.type) { 
            case 'success':
                await update();
                break; 
            case 'error': 
                toast.error(result.error.message); 
                break;
            default:
                await update();
        }
        loading = false;
        };
    };
    const handleTeamClick = (team) => { 
        selectedTeam = team
        playerModal = true
    }

    const handleAddPlayer = (event) => { 
        const newPlayer = Object.fromEntries(new FormData(event.target) )
        console.log(newPlayer)
        selectedTeam.players = [...selectedTeam.players ?? [], newPlayer]
        event.target.reset()
        // teamPlayersList = selectedTeam.players
        // console.log(teamPlayersList)
        // console.log(selectedTeam)
        // console.log(participants)

    }
</script>
{#if participant_type === 'team'}    
<form class="space-y-2 mb-4" action="?/createParticipant" method="POST">
    <Label>Team details</Label>
    <ButtonGroup class="w-full"> 
        <Input  type="text" name="name" placeholder="Team name" required />
        <Input  type="text" name="social" placeholder="https://www.facebook.com/joey_rapista" />
        <Button outline color="primary" type="submit">Add</Button> 
      </ButtonGroup> 
</form>
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
                <TableBodyCell>{participant.social ?? ''}</TableBodyCell>
                <TableBodyCell>
                    <Button size="sm" on:click={()=> handleTeamClick(participant)}><UsersSolid size="sm"></UsersSolid></Button>
                    <Button size="sm" on:click={()=> {deleteParticipantModal=true; selectedTeam=participant; console.log(selectedTeam)}}><TrashBinSolid size="sm"></TrashBinSolid></Button>
                </TableBodyCell> 
            </TableBodyRow>
        {/each} 
    </TableBody>
</Table>

  
  <Modal bind:open={playerModal} size="lg" autoclose={false} class="w-full">
    <form class="space-y-2 mb-4" on:submit|preventDefault={handleAddPlayer}>
        <Label>Player details</Label>
        <ButtonGroup class="w-full"> 
            <Input  type="text" name="name" placeholder="Player name" required />
            <Input  type="text" name="social" placeholder="https://www.facebook.com/joey_rapista" required />
            <Input  type="text" name="identifier" placeholder="IGN, jersey number etc..." required />
            <Input  type="text" name="position" placeholder="Mid, Point Guard etc..." required />
            <Button outline color="primary" type="submit">Add</Button> 
          </ButtonGroup> 
    </form>
    <Hr/>
    <Table>
        <TableHead> 
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Link</TableHeadCell>
                <TableHeadCell>Identifier</TableHeadCell> 
                <TableHeadCell>Position</TableHeadCell> 
        </TableHead>
        <TableBody>
            {#each selectedTeam.players ?? [] as player} 
                <TableBodyRow> 
                    <TableBodyCell>{player.name ?? ''}</TableBodyCell>
                    <TableBodyCell>{player.social ?? ''}</TableBodyCell>
                    <TableBodyCell>{player.identifier ?? ''}</TableBodyCell>
                    <TableBodyCell>{player.position ?? ''}</TableBodyCell>
                </TableBodyRow>
            {/each} 
        </TableBody>
    </Table>
  </Modal>
{/if}
<Modal bind:open={deleteParticipantModal} size="xs" autoclose={false}>
    <div class="text-center">
        <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete {selectedTeam.name}?</h3> 
        <form action="?/deleteParticipant" method="POST">  
            <input type="hidden" name="id" value={selectedTeam.id}>
            <Button type="submit" color="primary" class="me-2">Yes</Button>
            <Button type="button" on:click={()=>{selectedTeam={}}} color="alternative">Cancel</Button>
        </form>
    </div>
</Modal> 

{#if participant_type === 'player'}
<form class="space-y-2 mb-4" action="?/createParticipant" method="POST">
    <Label>Player details</Label>
    <ButtonGroup class="w-full"> 
        <Input  type="text" name="name" placeholder="player name" required />
        <Input  type="text" name="identifier" placeholder="game username, jersey number etc... " required />
        <Input  type="text" name="social" placeholder="https://www.facebook.com/joey_rapista" />
        <Button color="primary" type="submit">Add</Button> 
      </ButtonGroup> 
</form>
<Hr/>
<Table>
    <TableHead> 
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Identifier</TableHeadCell>
            <TableHeadCell>Link</TableHeadCell> 
            <TableHeadCell></TableHeadCell>
    </TableHead>
    <TableBody>
        {#each participants as participant} 
            <TableBodyRow> 
                <TableBodyCell>{participant.name ?? ''}</TableBodyCell>
                <TableBodyCell>{participant.identifier ?? ''}</TableBodyCell>
                <TableBodyCell>{participant.social ?? ''}</TableBodyCell>
                <TableBodyCell>
                    <Button size="sm" on:click={()=> {deleteParticipantModal=true; selectedTeam=participant; console.log(selectedTeam)}}><TrashBinSolid size="sm"></TrashBinSolid></Button>
                </TableBodyCell>
            </TableBodyRow>
        {/each} 
    </TableBody>
</Table>
{/if}