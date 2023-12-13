<script>
    export let tournament
    import {  Modal, Label, Input, Checkbox, Select, Button, Helper, Listgroup, ListgroupItem, Avatar, ButtonGroup, InputAddon, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Textarea } from 'flowbite-svelte'
    const { participant_type } = tournament
    
    let participants = tournament?.expand?.['participants(tournament)'] ?? []
    
</script>
<form class="space-y-2" action="?/createParticipant" method="POST">
    <Label>Name</Label>
    <Input name='name' required> </Input>
    <Button type="submit">Add participant</Button>
</form>

<div class="text-white">
    <ul>
        {#each participants as participant} 
        <li>{participant.name}</li>
        {/each}
    </ul>
</div>
 