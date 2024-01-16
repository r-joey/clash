<script>
    export let data 
    import { afterUpdate, onMount } from "svelte";
    import CreateStageModal from "./CreateStageModal.svelte"; 
    // import UpdateMatchModal from "./UpdateMatchModal.svelte"; 
    import toast from 'svelte-french-toast';
    import { Dropdown, DropdownItem, DropdownDivider, DropdownHeader, Radio, Tabs,TabItem, Modal, NumberInput, Label, Input, Checkbox, Select, Button, MultiSelect, ListgroupItem, Avatar, ButtonGroup, InputAddon, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Textarea } from 'flowbite-svelte'
    import { BracketsManager, helpers } from 'brackets-manager';
    import { ChevronDownSolid } from 'flowbite-svelte-icons';
    import { PUBLIC_TINY_MCE_API_KEY } from '$env/static/public'
    import Editor from '@tinymce/tinymce-svelte';   
    
    let selectedStage = null
    let selectedMatch = null
    let selectedGame = null

    let matchModal = false
    let opp1 = null
    let opp2 = null

    let winner = null
    let additional_information = ''

    $: if (selectedStage){  
      renderBracket(selectedStage) 
    }

    onMount(() => {
      if (data?.stages && data?.stages.length > 0) {
        selectedStage = data?.stages[data?.stages.length - 1].data
        console.log(selectedStage) 
      }
    }) 

    const renderBracket = (bracketsData) => { 
      bracketsViewer.render({
                    stages: bracketsData.stage,
                    matches: bracketsData.match, 
                    matchGames: bracketsData.match_game, 
                    participants: bracketsData.participant, 
                }, { 
                    clear: true,
                    onMatchClick: matchClicked,
                    separatedChildCountLabel: true,
                    highlightParticipantOnHover: true
                });
    }

    const matchClicked = async (match) => {
      // console.log(match) 
      selectedMatch = match
      bracketsManager.import(selectedStage)
      const stageData = await bracketsManager.get.tournamentData(0)  
      
      opp1 = match.opponent1.id ? await helpers.findParticipant(stageData.participant, match.opponent1) : {id: 0, name: 'TBD'} 
      opp2 = match.opponent2.id ? await helpers.findParticipant(stageData.participant, match.opponent2) : {id: 0, name: 'TBD'} 
      selectedGame = selectedMatch.metadata.games[0]

      // console.log(selectedGame.id)
      matchModal = true
    }  
    
    const handleUpdateMatch = (event) => {

      console.log('stage: ', selectedStage.stage[0].name)
      console.log('match: ', selectedMatch.metadata.label)
      console.log('game: ', selectedGame.number)
      const formData = new FormData(event.target); 
      formData.append('winner', winner)
      const formObject = Object.fromEntries(formData.entries()) 
      // console.log(formObject) 
    }
    
</script>

<!-- Navigations START -->
<div class="flex flex-col-1 gap-3 flex-wrap mb-3"> 
  {#each data?.stages as stage,idx  }
  <Button color='light' size='sm' on:click={()=>{selectedStage = stage.data}}>{stage.data.stage[0].name}<ChevronDownSolid class={`w-3 h-3 ms-2 text-white dark:text-white stage_actions_trigger_${stage.id}`} /></Button>
  <Dropdown triggeredBy={`.stage_actions_trigger_${stage.id}`}>
    <DropdownItem>Delete</DropdownItem>
    <DropdownItem>Reset</DropdownItem> 
  </Dropdown> 
  {/each}
  <CreateStageModal participants={data.participants}  /> 
</div>
<!-- Navigations END -->



<div class="brackets-viewer mt-2 rounded-md"></div>


<Modal size='md' title="Update Match" bind:open={matchModal}> 
  <div class="flex gap-3">
    {#each selectedMatch?.metadata?.games ?? [] as game, index}
      <Button on:click={() => {selectedGame = game}} outline>Game {game.number}</Button>
    {/each}
  </div>  
    <form on:submit|preventDefault={handleUpdateMatch} class="space-y-2">
        <input value={selectedGame.id} type="text" hidden name="game_id">
        <div class="grid grid-cols-7 "> 
            
          <div class="col-span-3 flex text-white  font-bold items-center justify-center"> 
            {opp1.name}
            <!-- <slot name="opp1" ></slot> -->
          </div> 
          <div class="col-span-1 flex  items-center justify-center">
            vs
          </div>
          <div class="col-span-3 flex  text-white font-bold items-center justify-center"> 
            {opp2.name}
            <!-- <slot name="opp2" ></slot> -->
          </div>
          <div class="col-span-3"> 
            <ButtonGroup class="w-full">
              <NumberInput name="opp1"></NumberInput> 
              <InputAddon><Radio bind:group={winner} value='opp1'>win</Radio></InputAddon>
            </ButtonGroup>
          </div> 
          <div class="col-span-1 flex  items-center justify-center">    
            <div>
              <Button><ChevronDownSolid class="w-3 h-3 text-white dark:text-white" /></Button>
              <Dropdown>
                <DropdownItem>Reset Winner</DropdownItem>
                <DropdownItem>Reset Score</DropdownItem>
                <DropdownItem>Reset Game</DropdownItem> 
              </Dropdown>
            </div>
          </div> 
          <div class="col-span-3"> 
            <ButtonGroup class="w-full">
              <InputAddon><Radio bind:group={winner} value='opp2'>win</Radio></InputAddon>   
              <NumberInput name="opp2"></NumberInput> 
            </ButtonGroup>
          </div> 
        </div>
        <div>
          <Label>Video URL</Label>
          <Input name="video_url"></Input>
        </div>
        <div>  
          <Label>Additional match information</Label>
          <textarea hidden name='additional_information' bind:value={additional_information}></textarea>
          <Editor  
          apiKey={PUBLIC_TINY_MCE_API_KEY}
          bind:value={additional_information}
          conf={
              {
              plugins: 'lists link ',
              toolbar: "undo redo | styles | bold italic underline strikethrough | align | bullist numlist | link ",
              menubar: false,
              skin: 'oxide-dark',
              content_css: 'dark'
              }
            }
          />  
    
        </div> 
        <Button type="submit" class="w-full">Save</Button>
      </form> 
</Modal>