<script>
    export let data  
    import { enhance } from '$app/forms';
    import toast from 'svelte-french-toast';
    import { UserEditSolid } from 'flowbite-svelte-icons'
    import { PUBLIC_TINY_MCE_API_KEY } from '$env/static/public'
    import Editor from '@tinymce/tinymce-svelte';    
    import { Avatar, Modal, Label, Input, Button, Hr, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Spinner, GradientButton } from 'flowbite-svelte'
 
  
    let loading = false;
    let additional_information = ''

    let disabled = data?.tournament?.status === 'In progress' || data?.tournament?.status === 'Finalized' ? true : false
    let addParticipantModal = false
   
    console.log(data?.awards)


    const handleCreateParticipant = () => {
        loading = true;
        return async ({ result, update }) => {   
            console.log(result)
            switch (result.type) { 
                case 'success':   
                    await update();  
                    toast.success("Participant successfully added."); 
                    additional_information = ''
                    break; 
                case 'error':  
                    toast.error(`${result?.error?.message ?? "Something went wrong while adding the participant. Please try again."}`); 
                    break;
                default:
                    break;
            }  
        addParticipantModal = false
        loading = false; 
        };
    }; 
</script>

<!-- <div class="flex flex-col-1 gap-3 flex-wrap items-center justify-center">
    <GradientButton disabled={disabled} size="sm" color="pinkToOrange" outline on:click={()=> addParticipantModal = true}>Add participant</GradientButton>
</div>
  -->


<!-- 
<Modal title="Add new participant" bind:open={addParticipantModal} size="md" autoclose={false}>
    <form class="space-y-2 mb-4" action="?/createParticipant" method="POST" enctype="multipart/form-data" use:enhance={handleCreateParticipant}>
        
        <div class="mt-4 grid gap-4 mb-4 sm:grid-cols-2">
            <div>
                <Label>Title</Label>
                <Input disabled={loading} type="text" name='title' required></Input> 
            </div>
            <div>
                <Label>Social</Label>
                <Input disabled={loading} type="text" name='social'></Input>
            </div>  
        </div>
        <div class="sm:col-span-2">    
            <Button disabled={loading} type="submit" class="w-full">
                {#if loading} 
                    <Spinner class="me-3" size="4" color="white" /> 
                {/if} 
                Save
            </Button>
        </div>  
    </form>
</Modal>  -->



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
            </TableBodyRow>
        {/each} 
    </TableBody>
</Table>
{#if data.awards.lenght === 0} 
    <p class="text-center text-white">No awards yet</p>
{/if}
  