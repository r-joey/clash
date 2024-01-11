<script>
    import { onMount } from "svelte";
    import StagesModal from "./StagesModal.svelte"; 
    import { Dropdown, DropdownItem, DropdownDivider, DropdownHeader, Radio, Tabs,TabItem, Modal, NumberInput, Label, Input, Checkbox, Select, Button, MultiSelect, ListgroupItem, Avatar, ButtonGroup, InputAddon, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Textarea } from 'flowbite-svelte'
    export let data
    const { tournament } = data
    import { BracketsManager, helpers } from 'brackets-manager';
    import { ChevronDownSolid } from 'flowbite-svelte-icons';
    

    let stages = tournament?.expand?.['stages(tournament)'] ?? []
    let active_stage = null

    let matchModal = false
    let selectedmatch = null
    let selectedBracket = null
    let opp1 = null
    let opp2 = null
    let winner = null

    onMount(() => {
      if (stages && stages.length > 0) {
        active_stage = stages[stages.length - 1]
        renderBracket(active_stage.data)
        selectedBracket = active_stage.data
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
      console.log(match) 
      selectedmatch = match 
      bracketsManager.import(selectedBracket)
      const stageData = await bracketsManager.get.tournamentData(0) 
      console.log(stageData)
      
      opp1 = match.opponent1.id ? await helpers.findParticipant(stageData.participant, match.opponent1) : {id: 0, name: 'TBD'} 
      opp2 = match.opponent1.id ? await helpers.findParticipant(stageData.participant, match.opponent2) : {id: 0, name: 'TBD'} 
      
      matchModal = true
    } 
    
</script>


<div class="flex flex-col-1 gap-3 flex-wrap mb-3">

  {#each stages as stage,idx  }
  <Button color='light' size='sm' on:click={()=>{renderBracket(stage.data); selectedBracket = stage.data}}>{stage.data.stage[0].name}<ChevronDownSolid class={`w-3 h-3 ms-2 text-white dark:text-white stage_actions_trigger_${stage.id}`} /></Button>
  <Dropdown triggeredBy={`.stage_actions_trigger_${stage.id}`}>
    <DropdownItem>Delete</DropdownItem>
    <DropdownItem>Reset</DropdownItem> 
  </Dropdown>
  <!-- <Button class="mr-2" on:click={()=>{renderBracket(stage.data); selectedBracket = stage.data}}>{stage.data.stage[0].name}</Button> -->
  {/each}
  <StagesModal  {tournament}/>
</div>
<div class="brackets-viewer mt-2 rounded-md"></div>
 
<Modal title="Update Match" bind:open={matchModal}>
  <div class="flex justify-center items-center gap-3">
    <h3 class="text-orange-500 text-3xl font-bold">{opp1.name}</h3>
    <h3 class="font-bold">vs</h3>
    <h3 class="text-orange-500 text-3xl font-bold">{opp2.name}</h3>
  </div>
 
<Tabs >
  {#each selectedmatch?.metadata?.games ?? [] as game, index}


  <TabItem open={index === 0 ? true : false} title={`Game ${game.number}`}>
    <p class="text-sm text-gray-500 dark:text-gray-400">
      <b>{game.opponent1.id}</b>
      <b>{game.opponent2.id}</b>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </p>
  </TabItem>


  {/each} 

  
</Tabs> 
</Modal>
  
  <!-- <TabItem open={index === 0 ? true : false}>
    <span slot="title">Game {game.number}</span> 
    <div class="mb-2 grid grid-cols-4">
      <div class='col-span-3'>
        <Label>{opp1.name}</Label>
        <NumberInput id={`${game.number}${game.opponent1.id}`}></NumberInput>
      </div>
      <div class='col-span-1 flex items-center justify-center'>  
        <Radio class="p-3" bind:group={winner} value={`${game.opponent1.id}`}>Winner</Radio>
      </div>
    </div>
    <div class="mb-2 grid grid-cols-4">
      <div class='col-span-3'>
        <Label>{opp2.name}</Label>
        <NumberInput id={`${game.number}${game.opponent2.id}`}></NumberInput>
      </div>
      <div class="col-span-1 flex items-center justify-center">  
        <Radio class="p-3" bind:group={winner} value={`${game.opponent2.id}`}>Winner</Radio>
      </div> 
    </div>
    <div class="mb-2">
      <Label>Link</Label>
      <Input name="link"></Input> 
    </div>
    <div class="mb-2">
      <Label>Additional Info</Label>
      <Textarea name="additional_info"></Textarea> 
    </div>
    
  </TabItem> -->
