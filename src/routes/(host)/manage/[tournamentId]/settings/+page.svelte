<script>
    export let data
    import { enhance } from '$app/forms'; 
    import toast from 'svelte-french-toast';
    import { Heading, Span, List, Li, Select, Button, Hr, Modal, Spinner } from 'flowbite-svelte';
    import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
    let deleteTournamentModal = false;
    let loading = false;   
     
    let statuses = [
          { value: 'Preparation', name: 'Preparation' },
          { value: 'In progress', name: 'In progress' },
          { value: 'Finalized', name: 'Finalized' }
        ];


    const handleUpdateStatus = () => {
        loading = true;
        return async ({ result, update }) => {   
            switch (result.type) { 
                case 'success':   
                    await update({reset: false});  
                    toast.success("Tournament status has been updated successfully.");  
                    break; 
                case 'error': 
                    toast.error("Something went wrong while updating the tournament. Please try again."); 
                    break;
                default:
                    break;
            }   
        loading = false; 
        };
    }; 
</script>
<div class="space-y-20">
    <div>
        <Hr classHr="my-8 w-full"><p class="text-red-500">Status</p></Hr>
        <div class="flex flex-col items-center">  
                <form class="flex w-52 gap-2" action="?/updateStatus" method="POST" use:enhance={handleUpdateStatus}> 
                    <Select name="status" items={statuses} value={data?.tournament?.status ?? null} />  
                    <Button color="primary"  type="submit">
                        Save
                    </Button> 
                </form> 
        </div> 
        <div class="mt-5">   
            <Heading tag="h2" customSize="text-lg font-semibold" class="text-lg font-semibold  text-gray-900 dark:text-orange-400">
                Preparation, <span class="font-light dark:text-white">this will</span>
            </Heading>   
            <List tag="ol" class="space-y-1 text-gray-500 dark:text-gray-400">
                <!-- <Li><Span>DELETE</Span> all stages;</Li>  -->
                <Li>disable adding stage/s.</Li>  
            </List>

            <Heading tag="h2" customSize="text-lg font-semibold" class="mt-10 text-lg font-semibold  text-gray-900 dark:text-orange-400">
                In progress, <span class="font-light dark:text-white">this will</span>
            </Heading>   
            <List tag="ol" class="space-y-1 text-gray-500 dark:text-gray-400"> 
                <Li>disable adding, updating, and deleting participant/s;</Li>
                <Li>will allow you to add, update, delete stage/s.</Li>
            </List>

            <Heading tag="h2" customSize="text-lg font-semibold" class="mt-10 text-lg font-semibold dark:text-orange-400 ">
                Finalized, <span class="font-light dark:text-white">this will</span>
            </Heading>   
            <List tag="ol" class="space-y-1 text-gray-500 dark:text-gray-400">
                <Li>disable updating Tournament details;</Li>
                <Li>disable adding, updating, and deleting participant/s;</Li> 
                <Li>disable adding, updating, and deleting stage/s.</Li>
            </List> 
 
      </div>
    </div>
    <div>
        <Hr classHr="my-8 w-full"><p class="text-red-500">Danger</p></Hr>
        <div class="flex flex-col items-center"> 
            <div class="w-52">    
                <Button class='w-full' on:click={() => (deleteTournamentModal = true)}>Delete this tournament</Button> 
            </div>
        </div>
    </div>
</div>



<Modal bind:open={deleteTournamentModal} size="xs" autoclose={false}>
<div class="text-center">
    <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to DELETE this Tournament?</h3>
    <p class="mb-5 text-orange-500">NOTE: You will not be able to undo this later.</p>
    <form action="?/deleteTournament" method="POST">  
        <input type="hidden" name="id" value={data.tournament.id}>
       
        <Button disabled={loading} type='submit' color="red" class="me-2">
            {#if loading} 
                <Spinner class="me-3" size="4" color="white" /> 
            {/if} 
            Yes, I'm sure
        </Button>
        <Button on:click={()=>{deleteTournamentModal = false}} color="alternative">No, cancel</Button>
    </form>
</div>
</Modal>