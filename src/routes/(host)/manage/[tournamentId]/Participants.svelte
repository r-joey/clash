<script>
    export let tournament 
    import { enhance } from '$app/forms'; 
    import toast from 'svelte-french-toast';
    import { DotsHorizontalOutline, DotsVerticalOutline, GearSolid } from 'flowbite-svelte-icons'

    import {  Modal, Label, Input, Checkbox, Select, Button, Hr, Helper, Listgroup, ListgroupItem, Avatar, ButtonGroup, InputAddon, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Textarea } from 'flowbite-svelte'
    const { participant_type } = tournament
    let playerModal = false 
    let selectedTeam = {}
    let participants = tournament?.expand?.['participants(tournament)'] ?? []
    let loading = false;

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
<form class="space-y-2 mb-4" action="?/createParticipant" method="POST" use:enhance={handleCreateParticipant}>
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
            <TableHeadCell>Players</TableHeadCell> 
    </TableHead>
    <TableBody>
        {#each participants as participant} 
            <TableBodyRow> 
                <TableBodyCell>{participant.name}</TableBodyCell>
                <TableBodyCell>{participant.social ?? ''}</TableBodyCell>
                <TableBodyCell><Button on:click={()=> handleTeamClick(participant)}>Players</Button></TableBodyCell>
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
                <TableBodyCell><DotsVerticalOutline/></TableBodyCell>
            </TableBodyRow>
        {/each} 
    </TableBody>
</Table>
{/if}