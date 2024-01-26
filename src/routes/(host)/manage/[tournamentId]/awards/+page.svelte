<script>
    export let data  
    import { enhance } from '$app/forms';
    import toast from 'svelte-french-toast';
    import { UserEditSolid } from 'flowbite-svelte-icons'
    import { PUBLIC_TINY_MCE_API_KEY } from '$env/static/public'
    import Editor from '@tinymce/tinymce-svelte';    
    import { Avatar, Modal, Label, Input, Button, Hr, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Spinner, GradientButton } from 'flowbite-svelte'
    import { Select } from 'flowbite-svelte'; 
    import EditAward from './EditAward.svelte';
    import DeleteAward from './DeleteAward.svelte';
    const participants = data?.participants.map((p)=> { return {value:p.id, name: p.name}}) 
    let selected; 
    let loading = false; 

    let disabled = data?.tournament?.status !== 'Finalized' ? true : false
    let addAwardModal = false
    

    const getParticipantName = (id) => { 
        return participants.find(p => p.value === id);  
    }

    const handleCreateAward = () => {
        loading = true;
        return async ({ result, update }) => {   
            console.log(result)
            switch (result.type) { 
                case 'success':   
                    await update();  
                    toast.success("Award successfully added."); 
                    break; 
                case 'error':  
                    toast.error(`${result?.error?.message ?? "Something went wrong while adding the award. Please try again."}`); 
                    break;
                default:
                    break;
            }  
        addAwardModal = false
        loading = false; 
        };
    }; 
</script>

<div class="flex flex-col-1 gap-3 flex-wrap items-center justify-center">
    <GradientButton disabled={loading || disabled}  size="sm" color="pinkToOrange" outline on:click={()=> addAwardModal = true}>Add award</GradientButton>
</div>
 


 
<Modal title="Add award" bind:open={addAwardModal} size="md" autoclose={false}>
    <form class="space-y-4 " action="?/createAward" method="POST" enctype="multipart/form-data" use:enhance={handleCreateAward}>
        <div>
            <Label>Title</Label>
            <Input disabled={loading || disabled} type="text" name='title' required></Input> 
        </div>
        <div>     
            <Label> Select an option </Label>
            <Select disabled={loading || disabled} name="participant" items={participants} bind:value={selected} required />
        </div>
           
        <div class="sm:col-span-2">    
            <Button disabled={loading || disabled} type="submit" class="w-full">
                {#if loading} 
                    <Spinner class="me-3" size="4" color="white" /> 
                {/if} 
                Save
            </Button>
        </div>  
    </form>
</Modal> 



<Hr/>
<Table>
    <TableHead> 
            <TableHeadCell>Title</TableHeadCell>
            <TableHeadCell>Participant</TableHeadCell> 
            <TableHeadCell>Actions</TableHeadCell>  
    </TableHead>
    <TableBody>
        {#each data.awards as award} 
            <TableBodyRow>  
                <TableBodyCell>{award.title}</TableBodyCell> 
                <TableBodyCell>{getParticipantName(award.participant).name}</TableBodyCell> 
                <TableBodyCell>
                    <EditAward {participants} {award}/>
                    <DeleteAward disabled={false} {award}/>
                </TableBodyCell>  
            </TableBodyRow>
        {/each} 
    </TableBody>
</Table>
 