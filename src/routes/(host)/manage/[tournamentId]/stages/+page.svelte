<script>
    export let data 
    import { enhance } from '$app/forms';
    import toast from 'svelte-french-toast';
    import { onMount } from "svelte";
    import CreateStageModal from "./CreateStageModal.svelte"; 
    import { getImageURL } from '$lib/utils';
    import { Dropdown, DropdownItem, Spinner, Radio, Modal, NumberInput, Label, Input, Button, Avatar, ButtonGroup, InputAddon, Textarea } from 'flowbite-svelte'
    import {  helpers } from 'brackets-manager';
    import { ChevronDownSolid, RedoOutline } from 'flowbite-svelte-icons';
    import DeleteStageModal from './DeleteStageModal.svelte';
    
    let selectedStage = null
    let selectedMatch = null
    let selectedGame = null

    let matchModal = false
    let loading = false
    let opp1 = null
    let opp2 = null 
    let winner = null 
     
    let disabled = data?.tournament?.status !== 'In progress' ? true : false
    $: if (selectedStage){
        selectedStage = data?.stages.find(stage => stage.id === selectedStage.id); 
        if (selectedStage){
          renderBracket(selectedStage?.data) 
        }else{
          // clear render
          const bracket_viewer = document.querySelector(".brackets-viewer");
          bracket_viewer.innerHTML = "";
        }
    }
    onMount(() => {
      if (data?.stages && data?.stages.length > 0) {
        selectedStage = data?.stages[data?.stages.length - 1] 
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

    const gameClicked = (game) => {
      selectedGame = game; 
      winner = selectedGame?.opponent1?.result === 'win' ? 'opp1' : selectedGame?.opponent2?.result === 'win' ? 'opp2' : null
    }

    const matchClicked = async (match) => {
      // console.log(match) 
      selectedMatch = match
      bracketsManager.import(selectedStage.data)
      const stageData = await bracketsManager.get.tournamentData(0)  
      
      opp1 = match.opponent1.id ? await helpers.findParticipant(stageData.participant, match.opponent1) : {id: 0, name: 'TBD'} 
      opp2 = match.opponent2.id ? await helpers.findParticipant(stageData.participant, match.opponent2) : {id: 0, name: 'TBD'} 
      selectedGame = selectedMatch.metadata.games[0]
      winner = selectedGame?.opponent1?.result === 'win' ? 'opp1' : selectedGame?.opponent2?.result === 'win' ? 'opp2' : null
      // console.log(opp1.profile_picture)
      matchModal = true
    }  
    const handleResetScores =() => {
      winner = null
      selectedGame.opponent1.score = 0;
      selectedGame.opponent2.score = 0;
    }
    const handleUpdateStage = () => {
        loading = true;
        return async ({ result, update }) => {   
            switch (result.type) { 
                case 'success':   
                    await update();  
                    renderBracket(selectedStage.data) 
                    toast.success("Match successfully updated."); 
                    break; 
                case 'error': 
                    toast.error("Something went wrong while creating the tournament. Please try again."); 
                    break;
                default:
                    break;
            }  
        matchModal = false
        loading = false; 
        };
    }; 
    
</script>

<!-- Navigations START -->
<div class="flex flex-nowrap overflow-x-auto gap-3 items-center justify-start whitespace-nowrap"> 
  {#each data?.stages as stage,idx  }
  <Button color='light' size='sm' on:click={()=>{selectedStage = stage}}>{stage.data.stage[0].name}<ChevronDownSolid class={`w-3 h-3 ms-2 text-white dark:text-white stage_actions_trigger_${stage.id}`} /></Button>
  <Dropdown triggeredBy={`.stage_actions_trigger_${stage.id}`}> 
    <DeleteStageModal {stage}/> 
  </Dropdown> 
  {/each}
  <CreateStageModal {disabled} participants={data.participants}  /> 
</div>
<!-- Navigations END -->



<div class="brackets-viewer mt-2 rounded-md"></div>


<Modal size='md' title="Update Match" bind:open={matchModal}> 
  <div class="flex flex-nowrap overflow-x-auto gap-3 items-center justify-start whitespace-nowrap">
    {#each selectedMatch?.metadata?.games ?? [] as game}
      <Button outline = {selectedGame.id === game.id ? false : true} on:click={()=>gameClicked(game)} >Game {game.number}</Button>
    {/each}
  </div>  
    <form action="?/updateStage" method="POST" class="space-y-2" use:enhance={handleUpdateStage}>
        <input value={selectedStage.id} type="text" hidden name="stage_id">
        <input value={selectedMatch.id} type="text" hidden name="match_id">
        <input value={selectedGame.number} type="text" hidden name="game_number">
        <div class="grid grid-cols-7 "> 
           
          <div class="col-span-3 mb-3">
            <div class="flex items-center justify-center" > 
              <Avatar size="lg" src={opp1?.profile_picture ? getImageURL(opp1?.collectionId, opp1?.id, opp1?.profile_picture, "80x80") : `/PP.jpg`} />
            </div>
            <div class="line-clamp-1 flex text-white  font-bold items-center justify-center">  
              {opp1.name} 
            </div>  
          </div> 
          <div class="flex items-center justify-center font-bold">vs</div>
          <div class="col-span-3 mb-3">
            <div class="flex items-center justify-center" > 
              <Avatar size="lg" src={opp2?.profile_picture ? getImageURL(opp2?.collectionId, opp2?.id, opp2?.profile_picture, "80x80") : `/PP.jpg`} />
            </div>
            <div class="line-clamp-1 flex text-white  font-bold items-center justify-center">  
              {opp2.name} 
            </div>  
          </div>

          <div class="col-span-3"> 
            <ButtonGroup class="w-full">
              <NumberInput disabled={loading || opp1.id === 0 || opp2.id === 0} value={selectedGame.opponent1.score ?? ''} name="opp1"></NumberInput> 
              <InputAddon><Radio disabled={loading || opp1.id === 0 || opp2.id === 0} name='winner' bind:group={winner} value='opp1'>win</Radio></InputAddon>
            </ButtonGroup>
          </div> 
          <div class="col-span-1 flex  items-center justify-center">    
              <Button disabled={loading || opp1.id === 0 || opp2.id === 0} on:click={handleResetScores} size='xs'><RedoOutline size='xs'/></Button>
          </div> 
          <div class="col-span-3"> 
            <ButtonGroup class="w-full">
              <InputAddon><Radio disabled={loading || opp1.id === 0 || opp2.id === 0} name='winner' bind:group={winner} value='opp2'>win</Radio></InputAddon>   
              <NumberInput disabled={loading || opp1.id === 0 || opp2.id === 0} value={selectedGame.opponent2.score ?? ''} name="opp2"></NumberInput> 
            </ButtonGroup>
          </div> 
        </div>
        <div>
          <Label>Video URL</Label>
          <Input disabled={loading || opp1.id === 0 || opp2.id === 0} value={selectedGame.vid_url ?? ''} name="video_url"></Input>
        </div>
        <div>  
          <Label for="additional_information-id">Additional match information</Label>
          <Textarea disabled={loading || opp1.id === 0 || opp2.id === 0} id="additional_information-id" value={selectedGame.additional_information ?? ''} rows="5" name="additional_information" />
        </div> 
        <Button disabled={loading || opp1.id === 0 || opp2.id === 0} type="submit" class="w-full">
          {#if loading} 
            <Spinner class="me-3" size="4" color="white" /> 
          {/if}
          Save
        </Button>
      </form> 
</Modal>