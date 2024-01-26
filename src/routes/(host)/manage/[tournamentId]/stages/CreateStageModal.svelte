<script>
    export let participants 
    export let disabled
    import { GradientButton, Modal, Label, Input, Checkbox, Select, Button, NumberInput, MultiSelect, Spinner, Avatar } from 'flowbite-svelte'
    import { enhance } from '$app/forms';
    import toast from 'svelte-french-toast';  ;
    import { SortableList } from '@jhubbardsf/svelte-sortablejs'; 
    import { getImageURL } from '$lib/utils'   
    let createStageModal = false  
    let loading = false 
    
    let stageSeeding = []
    let stageName;
    let stageType;
    let seriesType; 
     
    let series_types = [
      { value: 1, name: 'Best-of-1'},
      { value: 3, name: 'Best-of-3'},
      { value: 5, name: 'Best-of-5'},
      { value: 7, name: 'Best-of-7'} 
    ]
    let stage_types = [
      { value: 'single_elimination', name: 'Single Elimination'},
      { value: 'double_elimination', name: 'Double Elimination'},
      { value: 'round_robin', name: 'Round Robin'} 
    ]

    // Single elimination settings 
    let se_settings = { 
      consolationFinal: false,
      seedOrdering: ''
    } 
    let se_seeding_types= [
      { value: 'natural', name: 'Natural'},
      { value: 'reverse', name: 'Reverse'},
      { value: 'half_shift', name: 'Half Shift'},
      { value: 'reverse_half_shift', name: 'Reverse Half Shift'},
      { value: 'pair_flip', name: 'Pair Flip'},
      { value: 'inner_outer', name: 'Inner Outer'},
    ]

    // Double elimination settings
    let de_grand_final_types = [
      { value:'simple', name: 'Simple'},
      { value:'double', name: 'Double'}
    ]
    let de_seeding_types= [
      { value: 'natural', name: 'Natural'},
      { value: 'reverse', name: 'Reverse'},
      { value: 'half_shift', name: 'Half Shift'},
      { value: 'reverse_half_shift', name: 'Reverse Half Shift'},
      { value: 'pair_flip', name: 'Pair Flip'},
      { value: 'inner_outer', name: 'Inner Outer'},
    ]
    let de_settings = { 
      skipFirstRound: false,
      grandFinal: '',
      consolationFinal: false,
      seedOrdering: [],

    } 


    // Round Robin settings 
    let rr_seeding_types= [
      { value: 'groups.effort_balanced', name: 'Effort Balanced'},
      { value: 'groups.seed_optimized', name: 'Seed Optimized'},
      { value: 'groups.bracket_optimized', name: 'Bracket Optimized'}
    ]
    let rr_mode_types = [
      { value:'simple', name: 'Simple'},
      { value:'double', name: 'Double'}
    ]
    let rr_settings = {
      roundRobinMode: null,
      groupCount: null,
      seedOrdering: []
    }
    const handleCreateStage = async () => {
        loading = true;
        return async ({ result, update }) => {    
            switch (result.type) { 
                case 'success':   
                    await update();  
                    toast.success("Stage successfully created.");   
                    break;  
                case 'error': 
                    toast.error(`${result?.error?.message ?? "Something went wrong while creating the stage. Please try again."}`); 
                    break;
                default:
                    break;
            }  
        createStageModal = false
        loading = false; 
        };
    }  
    const handleAddSeed = (event) => {

      if (event.items.length > 0) { 
        event.items.forEach((selectedItem, index) => {
          const item = selectedItem.querySelector('input');
          item.setAttribute('name', 'seeding'); 
        });
      } else {
        const item = event.item.querySelector('input')
        item.setAttribute('name', 'seeding')
      } 
    }

    const handleRemoveSeed = (event) => {
      if (event.items.length > 0) { 
        event.items.forEach((selectedItem, index) => {
          const item = selectedItem.querySelector('input');
          item.setAttribute('name', 'seeding'); 
        });
      } else {
        const item = event.item.querySelector('input')
        item.setAttribute('name', 'seeding')
      } 
    }
</script>
<GradientButton disabled={disabled} color="pinkToOrange" size='sm' outline on:click={() => (createStageModal = true)}>Add stage</GradientButton>

<Modal title="Create a stage" bind:open={createStageModal} size="lg" autoclose={false} > 

    <form class="flex flex-col space-y-6" action="?/createStage" method="POST" use:enhance={handleCreateStage} > 
      
      <Label class="space-y-2">
        <span>Stage Name</span>
        <Input disabled={loading} bind:value={stageName} type="text" name="name" placeholder="Elimination stage" required />
      </Label>
     
      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-2">
          <Label>Seeds for this Stage</Label>
          <SortableList class="border-orange-500 space-y-1 h-full" group='participants_seed' animation={250} multiDragClass="selected_participant" onAdd={handleAddSeed} onRemove={handleRemoveSeed}>
          </SortableList>
        </div>
       
        <div class="space-y-2">
          <Label>Participants</Label>
          <SortableList  class="border-orange-500 space-y-1 h-full" group='participants_seed' animation={250} multiDragClass="selected_participant"> 
            {#each participants as participant, idx (participant.id) }
            <div class="hover:cursor-grab border rounded-md p-2 flex flex-col-1 content-center items-center justify-between align-middle"> 
              <div class="flex flex-col-1 content-center items-center justify-between align-middle space-x-2">
                <input type="text" hidden value={participant.id}>
                <Avatar rounded size='sm' src={participant?.profile_picture ? getImageURL(participant?.collectionId, participant?.id, participant?.profile_picture, "80x80") : `/PP.jpg`} />
                <span class="line-clamp-1">{participant.name}</span> 
              </div> 
            </div>
          {/each}
          </SortableList>
        </div> 
      </div> 


          <!-- <MultiSelect name="seeding" placeholder="Choose seeds" items={tournamentParticipants} bind:value={stageSeeding} required /> -->
     
   
      <div class="grid grid-cols-2 gap-3">
        <Label class="space-y-2">
          <span>Stage Type</span>
          <Select disabled={loading} name="type" placeholder="Choose stage type" items={stage_types} bind:value={stageType} required />
        </Label>
  
        <Label class="space-y-2">
          <span>Series</span>
          <Select disabled={loading} name="matchesChildCount" placeholder="Choose a series type" items={series_types} bind:value={seriesType} required />
        </Label>
      </div>
      
       
  
      {#if stageType === 'single_elimination'}
      <Label class="space-y-2">
        <span>Seeding Type</span>
        <Select disabled={loading} name="seedOrdering" placeholder="Choose seeding type" items={se_seeding_types} bind:value={se_settings['seedOrdering']} required />
      </Label>
      <div> 
        <Checkbox disabled={loading} name="consolationFinal" bind:checked={se_settings['consolationFinal']}>Consolation Final</Checkbox> 
      </div>
      {/if}
  
      {#if stageType === 'double_elimination'}
      <Label class="space-y-2">
        <span>Seeding Type</span>
        <MultiSelect disabled={loading} name="seedOrdering" placeholder="Choose seeding type" items={de_seeding_types} bind:value={de_settings['seedOrdering']} required />
      </Label> 
      <Label class="space-y-2">
        <span>Grand Final Type</span>
        <Select disabled={loading} name="grandFinal" placeholder="Choose seeding type" items={de_grand_final_types} bind:value={de_settings['grandFinal']} required />
      </Label>  
      <div> 
        <Checkbox disabled={loading} name="consolationFinal" bind:checked={de_settings['consolationFinal']}>Consolation Final</Checkbox> 
      </div>
      <div> 
        <Checkbox disabled={loading} name="skipFirstRound" bind:checked={de_settings['skipFirstRound']}>Skip first round</Checkbox> 
      </div>
      {/if}
  
      {#if stageType === 'round_robin'}
      <Label class="space-y-2">
        <span>Seeding Type</span>
        <Select disabled={loading} name="seedOrdering" placeholder="Choose seeding type" items={rr_seeding_types} bind:value={rr_settings['seedOrdering']} required />
      </Label>
      <Label class="space-y-2">
        <span>Mode</span>
        <Select disabled={loading} name="roundRobinMode" placeholder="Choose Mode" items={rr_mode_types} bind:value={rr_settings['roundRobinMode']} required />
      </Label> 
      <Label class="space-y-2">
        <span>Group Count</span>
        <NumberInput disabled={loading} name="groupCount" placeholder="Enter number of Groups" bind:value={rr_settings['groupCount']} required />
      </Label> 
      {/if}
  
  
  
      <Button disabled={loading} type="submit" class="w-full1">
        {#if loading} 
          <Spinner class="me-3" size="4" color="white" /> 
        {/if}
        Create
      </Button>
   
    </form>
  </Modal>


<style> 
	:global(.selected_participant) { 
		border: solid rgb(255, 123, 0) 1px;
	}
 </style>