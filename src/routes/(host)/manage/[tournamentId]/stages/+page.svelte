<script>
    import { onMount } from "svelte";
    import StagesModal from "./StagesModal.svelte"; 
    import toast from 'svelte-french-toast';
    import { Dropdown, DropdownItem, DropdownDivider, DropdownHeader, Radio, Tabs,TabItem, Modal, NumberInput, Label, Input, Checkbox, Select, Button, MultiSelect, ListgroupItem, Avatar, ButtonGroup, InputAddon, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Textarea } from 'flowbite-svelte'
    export let data 
    import { BracketsManager, helpers } from 'brackets-manager';
    import { ChevronDownSolid } from 'flowbite-svelte-icons';
    import { PUBLIC_TINY_MCE_API_KEY } from '$env/static/public'
    import Editor from '@tinymce/tinymce-svelte';  
    const { participants } = data
 
    let active_stage = null
    let matchModal = false
    let selectedmatch = null
    let selectedBracket = null
    let opp1 = null
    let opp2 = null
    let winner = null
    let additional_information = ''

    onMount(() => {
      if (data?.stages && data?.stages.length > 0) {
        active_stage = data?.stages[data?.stages.length - 1]
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
      
      opp1 = match.opponent1.id ? await helpers.findParticipant(stageData.participant, match.opponent1) : {id: 0, name: 'TBD'} 
      opp2 = match.opponent2.id ? await helpers.findParticipant(stageData.participant, match.opponent2) : {id: 0, name: 'TBD'} 
      
      matchModal = true
    } 

    const handleUpdateMatch = (event) => {
    
      const formData = new FormData(event.target); 
      formData.append('winner', winner)
      const formObject = Object.fromEntries(formData.entries()) 
      console.log(formObject) 
    }
    
</script>


<div class="flex flex-col-1 gap-3 flex-wrap mb-3">

  {#each data?.stages as stage,idx  }
  <Button color='light' size='sm' on:click={()=>{renderBracket(stage.data); selectedBracket = stage.data}}>{stage.data.stage[0].name}<ChevronDownSolid class={`w-3 h-3 ms-2 text-white dark:text-white stage_actions_trigger_${stage.id}`} /></Button>
  <Dropdown triggeredBy={`.stage_actions_trigger_${stage.id}`}>
    <DropdownItem>Delete</DropdownItem>
    <DropdownItem>Reset</DropdownItem> 
  </Dropdown> 
  {/each}
  <StagesModal {participants}  />
</div>

<div class="brackets-viewer mt-2 rounded-md"></div>
 
<Modal size='md' title="Update Match" bind:open={matchModal}>  
  <Tabs style="pill" >
    {#each selectedmatch?.metadata?.games ?? [] as game, index} 
      <TabItem open={index === 0 ? true : false} title={`Game ${game.number}`}>
        <form on:submit|preventDefault={handleUpdateMatch} class="space-y-2">
          <input value={game.id} type="text" hidden name="game_id">
          <div class="grid grid-cols-7 "> 
            <div class="col-span-3 flex text-white  font-bold items-center justify-center">
              {opp1.name}
            </div> 
            <div class="col-span-1 flex  items-center justify-center">
              vs
            </div>
            <div class="col-span-3 flex  text-white font-bold items-center justify-center">
              {opp2.name}
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
      </TabItem> 
    {/each}  
  </Tabs> 

</Modal>
   