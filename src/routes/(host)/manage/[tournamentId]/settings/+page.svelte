<script>
    export let data
    import { enhance } from '$app/forms'; 
    import toast from 'svelte-french-toast';
    import { page } from '$app/stores'; 
    import { Heading, List, Li, Select, Button, Hr, Modal, Spinner, Input, ButtonGroup} from 'flowbite-svelte';
    import { ExclamationCircleOutline, ShareAllOutline, CopySolid } from 'flowbite-svelte-icons';
    let deleteTournamentModal = false;
    let loading = false;   
    const shareable_url  = `${$page.url.origin}/${$page.params.tournamentId}`
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
    const copyToClipboard = async () => {
        try { 
            await navigator.clipboard.writeText(shareable_url);
            toast.success('Shareable URL copied to clipboard')
        } catch (error) {
            toast.error('Something went wrong while copying shareable URL.')
        }
    };

    const share = async () => {
        try {
            await navigator.share({url:shareable_url}); 
        } catch (error) {
            toast.error('Something went wrong while sharing shareable URL.')
        }
    }
</script>
<div class="space-y-20">
    <div>
        <div class="mb-16 text-center">
            <Hr classHr="my-8 w-full"><p class="text-red-500">Share</p></Hr>
            <div class="flex items-center justify-center">
                <ButtonGroup class="w-96"> 
                    <Input value={shareable_url} disabled id="input-addon" type="text" placeholder="elonmusk" />
                    <Button on:click={copyToClipboard} color="primary">
                        <CopySolid class="me-2" ></CopySolid>
                        Copy
                    </Button>
                    <Button on:click={share} outline color="primary">
                        <ShareAllOutline class='me-2'></ShareAllOutline>
                        Share 
                    </Button>
                </ButtonGroup> 
            </div> 
        </div> 
        <Hr classHr="my-8 w-full"><p class="text-red-500">Status</p></Hr>
        <div class="flex flex-col items-center">  
                <form class="flex  gap-2" action="?/updateStatus" method="POST" use:enhance={handleUpdateStatus}> 
                    <Select disabled={loading} name="status" items={statuses} value={data?.tournament?.status ?? null} />  
                    <Button disabled={loading} color="primary"  type="submit">
                        {#if loading} 
                            <Spinner class="me-3" size="4" color="white" /> 
                        {/if} 
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
                <Li>enable adding, updating, and deleting award/s.</Li>
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