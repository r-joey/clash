<script>
    import { onMount } from "svelte";
    import StagesModal from "./StagesModal.svelte"; 
    import { Radio, Tabs,TabItem, Modal, NumberInput, Label, Input, Checkbox, Select, Button, MultiSelect, ListgroupItem, Avatar, ButtonGroup, InputAddon, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Textarea } from 'flowbite-svelte'
    export let tournament  
    import { BracketsManager, helpers } from 'brackets-manager';

    let stages = tournament?.expand?.['stages(tournament)'] ?? []
    let active_stage = null

    let matchModal = false
    let selectedmatch = null
    let selectedBracket = null
    let opp1 = null
    let opp2 = null
    let winner = null

    onMount(() => {
      if (stages) {
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

{#each stages as stage,idx  }
<Button class="mr-2" on:click={()=>{renderBracket(stage.data); selectedBracket = stage.data}}>{stage.data.stage[0].name}</Button>
{/each}
<StagesModal  {tournament}/>
<div class="brackets-viewer mt-2 rounded-md"></div>
 
<Modal title="Update Match" bind:open={matchModal}>
  <div class="flex justify-center items-center gap-3">
    <h3 class="text-orange-500 text-3xl font-bold">{opp1.name}</h3>
    <h3 class="font-bold">vs</h3>
    <h3 class="text-orange-500 text-3xl font-bold">{opp2.name}</h3>
  </div>
 <!-- {#each selectedmatch?.metadata?.games ?? [] as game }
    <Button outline class="mr-2">Game {game.number}</Button>
 {/each}
 <div>
   <Label>Opponent 1</Label>
   <NumberInput></NumberInput>
   <Label>Opponent 2</Label>
   <NumberInput></NumberInput> 
  </div> -->
<Tabs style="full" defaultClass="flex rounded-lg divide-x rtl:divide-x-reverse divide-gray-200 shadow dark:divide-gray-700">
  {#each selectedmatch?.metadata?.games ?? [] as game, index}
  <TabItem class="w-full" open={index === 0 ? true : false}>
    <span slot="title">Game {game.number}</span> 
    <div class="mb-2 grid grid-cols-4">
      <div class='col-span-3'>
        <Label>{opp1.name}</Label>
        <NumberInput id={`${game.number}${game.opponent1.id}`}></NumberInput>
      </div>
      <div class='col-span-1 flex items-center justify-center'> <!-- Use flex and items-center to center the content -->
        <Radio class="p-3" bind:group={winner} value={`${game.opponent1.id}`}>Winner</Radio>
      </div>
    </div>
    <div class="mb-2 grid grid-cols-4">
      <div class='col-span-3'>
        <Label>{opp2.name}</Label>
        <NumberInput id={`${game.number}${game.opponent2.id}`}></NumberInput>
      </div>
      <div class="col-span-1 flex items-center justify-center"> <!-- Use flex and items-center to center the content -->
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
    
  </TabItem>
{/each} 
</Tabs>
  <svelte:fragment slot="footer">
    <Button on:click={() => alert('Handle "success"')}>Save</Button>
    <Button color="alternative">Cancel</Button>
  </svelte:fragment>
</Modal>