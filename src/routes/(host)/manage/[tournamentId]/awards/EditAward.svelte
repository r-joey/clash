<script>
    export let award
    export let participants
    export let disabled = false
    import { Modal, Label, Input, Button, Hr, Select, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Spinner, GradientButton } from 'flowbite-svelte'
    import { PUBLIC_TINY_MCE_API_KEY } from '$env/static/public'
    import Editor from '@tinymce/tinymce-svelte';    
    import { PenSolid, EyeOutline } from 'flowbite-svelte-icons'
    import { enhance } from '$app/forms';
    import toast from 'svelte-french-toast';
    import { getImageURL } from '$lib/utils'



    let loading = false
    let openEdit = false
    
    const handleUpdateAward = () => {
        loading = true;
        return async ({ result, update }) => {    
            switch (result.type) { 
                case 'success':   
                    await update({reset: false});  
                    toast.success("Award successfully added.");  
                    break; 
                case 'error':  
                    toast.error(`${result?.error?.message ?? "Something went wrong while updating the participant. Please try again."}`); 
                    break;
                default:
                    break;
            }  
            openEdit = false
        loading = false; 
        };
    }; 
</script>
<Button size="sm" on:click={()=>{openEdit = true}}>
    {#if disabled}
        <EyeOutline size='sm'></EyeOutline>
    {:else}
        <PenSolid size="sm"></PenSolid>
    {/if}
</Button>
<Modal title="Edit award" bind:open={openEdit} size="md" autoclose={false}> 
    <form class="space-y-4 " action="?/updateAward" method="POST" enctype="multipart/form-data" use:enhance={handleUpdateAward}>
        <input type="text" hidden name="id" value={award.id}>
        <div>
            <Label>Title</Label>
            <Input disabled={loading || disabled} type="text" name='title' value={award.title ?? ''} required></Input> 
        </div>
        <div>     
            <Label> Select an option </Label>
            <Select disabled={loading || disabled} name="participant" items={participants} value={award.participant ?? null} required />
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