<script>
    export let award
    export let disabled
    import { ExclamationCircleOutline, TrashBinSolid } from 'flowbite-svelte-icons'
    import {  Modal, Spinner, Button } from 'flowbite-svelte'
    import { enhance } from '$app/forms';
    import toast from 'svelte-french-toast';
    let openDel = false
    let loading = false

    const handleDeleteAward = () => {
        loading = true;
        return async ({ result, update }) => {   
            switch (result.type) { 
                case 'success':   
                    await update();  
                    toast.success("Award successfully deleted."); 
                    break; 
                case 'error': 
                    toast.error(`${result?.error?.message ?? "Something went wrong while deleting the award. Please try again."}`); 
                    break;
                default:
                    break;
            }  
        openDel = false
        loading = false;  
        };
    }; 
</script>

<Button disabled={disabled} size="sm" on:click={()=>{openDel = true}}><TrashBinSolid size="sm"></TrashBinSolid></Button>

<Modal bind:open={openDel} size="xs" autoclose={false}>
    <div class="text-center">
        <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <h3 class="text-md font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete award:</h3> 
        <p class="mb-5 text-lg font-normal"> <strong>{award.title}</strong>?</p>
        <form action="?/deleteAward" method="POST" use:enhance={handleDeleteAward}>  
            <input type="hidden" name="id" value={award.id}>
            <Button disabled={loading} type="submit" color="primary" class="me-2">
                {#if loading} 
                    <Spinner class="me-3" size="4" color="white" /> 
                {/if} 
                Yes
            </Button>
            <Button on:click={()=>{openDel = false}} type="button" color="alternative">Cancel</Button>
        </form>
    </div>
</Modal> 