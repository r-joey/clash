<script>
    export let data;
    import { Card, Avatar, Modal } from 'flowbite-svelte';
    import { getImageURL } from '$lib/utils' 
    const { participants } = data 
    let participantModal = false;
    let selectedParticipant = {}
</script>



<div class="grid grid-cols-2 md:grid-cols-4 sm:grid-cols-3 gap-5">
    {#each participants as participant}
    <Card on:click={() => { selectedParticipant=participant; participantModal=true; console.log(participant)}} class="hover:cursor-pointer hover:bg-slate-500"  padding="sm"> 
        <div class="flex flex-col items-center">
            <Avatar rounded size="lg" src={participant?.profile_picture ? getImageURL(participant?.collectionId, participant?.id, participant?.profile_picture, "80x80") : `/PP.jpg`} />
          <h5 class="mt-2 text-xl font-medium text-gray-900 dark:text-white">{participant.name}</h5> 
        </div>
      </Card>
    {/each} 
</div> 
   
    
  <Modal size="xs"  bind:open={participantModal} autoclose outsideclose>
    <div class="flex flex-col items-center">
        <Avatar rounded size="xl" src={selectedParticipant?.profile_picture ? getImageURL(selectedParticipant?.collectionId, selectedParticipant?.id, selectedParticipant?.profile_picture, "80x80") : `/PP.jpg`} />
      <h5 class="mt-2 text-xl font-medium text-gray-900 dark:text-white">{selectedParticipant.name}</h5> 
    </div>
    {#if selectedParticipant.additional_information}
    <div class="text-sm text-gray-300 ">
        <div class="no-tailwindcss-base">
            {@html selectedParticipant.additional_information}
        </div>
    </div> 
    {:else}
    <p class="text-center">No additional information</p>
    {/if} 
  </Modal>
