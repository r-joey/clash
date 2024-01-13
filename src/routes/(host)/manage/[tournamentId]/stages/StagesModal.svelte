<script>
    import { GradientButton, Modal, Label, Input, Checkbox, Select, Button, MultiSelect, NumberInput, ListgroupItem, Avatar, ButtonGroup, InputAddon, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Textarea } from 'flowbite-svelte'
    export let participants 
 
    import { enhance, applyAction } from '$app/forms';
    
    import toast from 'svelte-french-toast';
    let createStageModal = false  
    let loading = false
    let tournamentParticipants = participants ? participants.map((participant)=>({ value: participant.id, name: participant.name})) : null
    
    let stageSeeding = []
    let stageName;
    let stageType;
    let seriesType; 
     
    let series_types = [
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
    const handleCreateStage = () => {
        loading = true;
        return async ({ result, update }) => {   
            switch (result.type) { 
                case 'success':   
                    await update();  
                    toast.success("Stage successfully created.");   
                    break; 
                case 'error': 
                    toast.error(result.error.message); 
                    break;
                default:
                    break;
            }  
        loading = false; 
        createStageModal = false
        };
    }; 
</script>
<GradientButton color="pinkToOrange" size='sm' outline on:click={() => (createStageModal = true)}>Add stage</GradientButton>

<Modal bind:open={createStageModal} size="lg" autoclose={false} class="w-full h-2/3">
    <!-- <form class="flex flex-col space-y-6" on:submit={createStage}> -->
    <form class="flex flex-col space-y-6" action="?/createStage" method="POST" use:enhance={handleCreateStage} >
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">Create a stage</h3>
      
      <Label class="space-y-2">
        <span>Stage Name</span>
        <Input bind:value={stageName} type="text" name="name" placeholder="Elimination stage" required />
      </Label>
      <Label class="space-y-2">
        <span>Seeds</span>
        <MultiSelect name="seeding" placeholder="Choose seeds" items={tournamentParticipants} bind:value={stageSeeding} required />
      </Label>
      <div class="grid grid-cols-2 gap-3">
        <Label class="space-y-2">
          <span>Stage Type</span>
          <Select name="type" placeholder="Choose stage type" items={stage_types} bind:value={stageType} required />
        </Label>
  
        <Label class="space-y-2">
          <span>Series</span>
          <Select name="matchesChildCount" placeholder="Choose a series type" items={series_types} bind:value={seriesType} required />
        </Label>
      </div>
      
       
  
      {#if stageType === 'single_elimination'}
      <Label class="space-y-2">
        <span>Seeding Type</span>
        <Select name="seedOrdering" placeholder="Choose seeding type" items={se_seeding_types} bind:value={se_settings['seedOrdering']} required />
      </Label>
      <div> 
        <Checkbox name="consolationFinal" bind:checked={se_settings['consolationFinal']}>Consolation Final</Checkbox> 
      </div>
      {/if}
  
      {#if stageType === 'double_elimination'}
      <Label class="space-y-2">
        <span>Seeding Type</span>
        <MultiSelect name="seedOrdering" placeholder="Choose seeding type" items={de_seeding_types} bind:value={de_settings['seedOrdering']} required />
      </Label> 
      <Label class="space-y-2">
        <span>Grand Final Type</span>
        <Select name="grandFinal" placeholder="Choose seeding type" items={de_grand_final_types} bind:value={de_settings['grandFinal']} required />
      </Label>  
      <div> 
        <Checkbox name="consolationFinal" bind:checked={de_settings['consolationFinal']}>Consolation Final</Checkbox> 
      </div>
      <div> 
        <Checkbox name="skipFirstRound" bind:checked={de_settings['skipFirstRound']}>Skip first round</Checkbox> 
      </div>
      {/if}
  
      {#if stageType === 'round_robin'}
      <Label class="space-y-2">
        <span>Seeding Type</span>
        <Select name="seedOrdering" placeholder="Choose seeding type" items={rr_seeding_types} bind:value={rr_settings['seedOrdering']} required />
      </Label>
      <Label class="space-y-2">
        <span>Mode</span>
        <Select name="roundRobinMode" placeholder="Choose Mode" items={rr_mode_types} bind:value={rr_settings['roundRobinMode']} required />
      </Label> 
      <Label class="space-y-2">
        <span>Group Count</span>
        <NumberInput name="groupCount" placeholder="Enter number of Groups" bind:value={rr_settings['groupCount']} required />
      </Label> 
      {/if}
  
  
  
      <Button type="submit" class="w-full1">Create</Button>
   
    </form>
  </Modal>