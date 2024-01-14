<script>
    import { DotsHorizontalOutline, DotsVerticalOutline, ExclamationCircleOutline, UsersSolid, TrashBinSolid, UserEditSolid, EditOutline} from 'flowbite-svelte-icons'
    import {  Modal, Label, Input, Checkbox, Select, Button, Hr, Helper, Listgroup, ListgroupItem, Avatar, ButtonGroup, InputAddon, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Textarea, GradientButton } from 'flowbite-svelte'
    import { enhance, applyAction } from '$app/forms';
    import toast from 'svelte-french-toast';
    export let participant
    let openDel = false
    let loading = false

    const handleDeleteParticipant = () => {
        loading = true;
        return async ({ result, update }) => {   
            switch (result.type) { 
                case 'success':   
                    await update();  
                    toast.success("Participant successfully deleted."); 
                    break; 
                case 'error': 
                    toast.error(result.error.message); 
                    break;
                default:
                    break;
            }  
        openDel = false
        loading = false;  
        };
    }; 
</script>

<Button size="sm" on:click={()=>{openDel = true}}><TrashBinSolid size="sm"></TrashBinSolid></Button>

<Modal bind:open={openDel} size="xs" autoclose={false}>
    <div class="text-center">
        <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <h3 class="text-md font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete participant:</h3> 
        <p class="mb-5 text-lg font-normal"> <strong>{participant.name}</strong>?</p>
        <form action="?/deleteParticipant" method="POST" use:enhance={handleDeleteParticipant}>  
            <input type="hidden" name="id" value={participant.id}>
            <Button type="submit" color="primary" class="me-2">Yes</Button>
            <Button on:click={()=>{openDel = false}} type="button" color="alternative">Cancel</Button>
        </form>
    </div>
</Modal> 