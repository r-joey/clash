<script>
    export let data
    import { onMount } from "svelte";
    import { getImageURL } from '$lib/utils';
    import {  helpers } from 'brackets-manager';
    import { Badge, Indicator, Spinner, Radio, Modal, NumberInput, Label, Input, Button, Avatar, ButtonGroup, InputAddon, Textarea } from 'flowbite-svelte'
    import getYouTubeID from 'get-youtube-id';
    const { stages } = data
    let selectedStage = null
    let matchModal = false

    let selectedMatch = null
    let selectedGame = null
  
    let opp1 = null
    let opp2 = null 
    let winner = null 


    onMount(() => {
      if (data?.stages && data?.stages.length > 0) {
        selectedStage = data?.stages[data?.stages.length - 1] 
      }
    }) 

    $: if (selectedStage){ 
        renderBracket(selectedStage?.data)  
    }

    const gameClicked = (game) => { 
      selectedGame = game; 
      console.log(selectedGame) 
      winner = selectedGame?.opponent1?.result === 'win' ? 'opp1' : selectedGame?.opponent2?.result === 'win' ? 'opp2' : null
    }

    const matchClicked = async (match) => {
        console.log(match)
        selectedMatch = match
        bracketsManager.import(selectedStage.data)
        const stageData = await bracketsManager.get.tournamentData(0)  
        
        opp1 = match.opponent1.id ? await helpers.findParticipant(stageData.participant, match.opponent1) : {id: 0, name: 'TBD'} 
        opp2 = match.opponent2.id ? await helpers.findParticipant(stageData.participant, match.opponent2) : {id: 0, name: 'TBD'} 
        selectedGame = selectedMatch.metadata.games[0]
        winner = selectedGame?.opponent1?.result === 'win' ? 'opp1' : selectedGame?.opponent2?.result === 'win' ? 'opp2' : null 
        matchModal = true
    }

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
 
</script>

<div class="flex flex-nowrap overflow-x-auto gap-1 items-center justify-start whitespace-nowrap"> 
    {#each stages as stage  }
    <Button size="xs" color='light' on:click={()=>{selectedStage = stage}}>{stage.data.stage[0].name}</Button>
    {/each} 
</div>

<div class="brackets-viewer mt-2 rounded-md"></div> 

<Modal size='md' bind:open={matchModal} outsideclose>  
    {#if selectedGame?.vid_url}       
    <div class="mt-7  aspect-w-16 aspect-h-9">
        <iframe 
            class="rounded-md"
            src= {`https://www.youtube.com/embed/${getYouTubeID(selectedGame?.vid_url)}`}
            title="(ENG) M5 World Championship | Grand Finals | ONIC vs APBR | Game 7" 
            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
        </iframe>
      </div>
    {/if}
      
    <div class="flex flex-nowrap overflow-x-auto gap-3 items-center justify-start whitespace-nowrap">
      {#each selectedMatch?.metadata?.games ?? [] as game}
        <Button size="xs" outline = {selectedGame.id === game.id ? false : true} on:click={()=>gameClicked(game)} >Game {game.number}</Button>
      {/each}
    </div>  
    <div class="grid grid-cols-7">  
        <div class="col-span-3 mb-3">
            <div class="flex items-center justify-center" > 
                <div class="relative p-2">
                    {#if selectedGame?.opponent1?.result === 'win'}
                        <Badge class="absolute top-0 left-0" rounded color="green">Win</Badge>
                    {/if}
                    <Avatar rounded  size="lg" src={opp1?.profile_picture ? getImageURL(opp1?.collectionId, opp1?.id, opp1?.profile_picture, "80x80") : `/PP.jpg`} />
                  </div>
                  
            </div>
            <div class="line-clamp-1 flex text-white  font-bold items-center justify-center">  
            {opp1.name} 
            </div>  
        </div> 
        <div class="flex items-center justify-center font-bold">vs</div>
        <div class="col-span-3 mb-3">
            <div class="flex items-center justify-center" > 
                <div class="relative p-2">
                    {#if selectedGame?.opponent2?.result === 'win'}
                        <Badge class="absolute top-0 right-0" rounded color="green">Win</Badge>
                    {/if}
                    <Avatar rounded  size="lg" src={opp2?.profile_picture ? getImageURL(opp2?.collectionId, opp2?.id, opp2?.profile_picture, "80x80") : `/PP.jpg`} /> 
                </div>
            </div>
            <div class="line-clamp-1 flex text-white  font-bold items-center justify-center">  
            {opp2.name} 
            </div>  
        </div>

        <div class="col-span-3"> 
            <p class="text-center font-extrabold text-2xl bg-gray-900 p-2 rounded-md">
                {selectedGame.opponent1.score ?? '0'}
            </p> 
        </div> 
        <div class="col-span-1">    
                
        </div> 
        <div class="col-span-3"> 
            <p class="text-center font-extrabold text-2xl bg-gray-900 p-2 rounded-md">
                {selectedGame.opponent2.score ?? '0'}
            </p> 
        </div> 
    </div> 
    <div>   
    <Textarea value={selectedGame.additional_information ?? ''} rows="5" disabled/>
    </div>  
  </Modal>