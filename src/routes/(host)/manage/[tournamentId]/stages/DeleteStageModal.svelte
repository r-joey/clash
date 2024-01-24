<script>
    export let stage 
    export let disabled = false
    import { DropdownItem, Button, Modal, Spinner } from 'flowbite-svelte'
    import { ExclamationCircleOutline, TrashBinOutline } from 'flowbite-svelte-icons'
    import { enhance } from '$app/forms';
    import toast from 'svelte-french-toast';  
    let loading = false 
     
    let openDelete = false
 
    const handleDeleteStage = async () => {
        loading = true;
        return async ({ result, update }) => {    
            switch (result.type) { 
                case 'success':   
                    await update();  
                    toast.success("Stage successfully delete.");   
                    break;  
                case 'error': 
                    toast.error(`${result?.error?.message ?? "Something went wrong while creating the stage. Please try again."}`); 
                    break;
                default:
                    break;
            }  
        openDelete = false
        loading = false; 
        };
    }  
     
</script> 
<DropdownItem disabled={disabled}  size="sm" on:click={()=>{openDelete = true}}>  
    <span class="flex gap-2">
        <TrashBinOutline size="sm"></TrashBinOutline>Delete
    </span>
</DropdownItem>

<Modal title="Delete stage" bind:open={openDelete} size="xs" autoclose={false}>
        <div class="text-center">
            <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
            <h3 class="text-md font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this stage?:</h3> 
            <p class="mb-5 text-lg font-normal"> <strong>{stage?.data?.stage[0].name}</strong>?</p>
            <p class="mb-5 text-orange-500">NOTE: You will not be able to undo this later.</p>
            <form action="?/deleteStage" method="POST" use:enhance={handleDeleteStage}>  
                <input type="hidden" name="id" value={stage.id}>
                <Button disabled={loading} type="submit" color="primary" class="me-2">
                    {#if loading} 
                        <Spinner class="me-3" size="4" color="white" /> 
                    {/if} 
                    Yes
                </Button>
                <Button on:click={()=>{openDelete = false}} type="button" color="alternative">Cancel</Button>
            </form>
        </div>  
</Modal>
 