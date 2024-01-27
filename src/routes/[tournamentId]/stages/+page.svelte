<script>
    export let data
    import { onMount } from "svelte";
    import { getImageURL } from '$lib/utils';
    import {  helpers } from 'brackets-manager';
    import { Badge, Modal, Button, Avatar, Textarea } from 'flowbite-svelte'
    import getYouTubeID from 'get-youtube-id';
    import { BxsArchive, BxsCheckCircle, BxsStopwatch, BxsHourglass, BxsLock, BxLoader } from 'svelte-boxicons';
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
      winner = selectedGame?.opponent1?.result === 'win' ? 'opp1' : selectedGame?.opponent2?.result === 'win' ? 'opp2' : null
    }

    const matchClicked = async (match) => { 
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
        bracketsViewer.setParticipantImages(bracketsData.participant.map((participant) => ({ 
            participantId: participant.id,
            imageUrl: participant?.profile_picture ? getImageURL(participant?.collectionId, participant?.id, participant?.profile_picture, "12x12") : `/PP.jpg`
        })));
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
 
<div id="bracket_viewer" class="brackets-viewer mt-3 rounded-md"></div> 
 

<Modal size='md' bind:open={matchModal} outsideclose>  
    {#if getYouTubeID(selectedGame?.vid_url)}
    <div class="mt-7 aspect-w-16 aspect-h-9">
        <iframe 
            class="rounded-md"
            src= {`https://www.youtube.com/embed/${getYouTubeID(selectedGame?.vid_url)}`}
            title="" 
            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
        </iframe>
      </div>
    {/if}
      
    <div class="mt-7 flex flex-nowrap overflow-x-auto gap-3 items-center justify-start whitespace-nowrap">
      {#each selectedMatch?.metadata?.games ?? [] as game}
        <Button size="xs" outline = {selectedGame.id === game.id ? false : true} on:click={()=>gameClicked(game)}>
            Game {game.number}
            {#if game.status === 0}
                <BxsLock class="ms-2" size='18'></BxsLock>
            {:else if game.status === 1}
                <BxsHourglass class="ms-2" size='18'></BxsHourglass>
            {:else if game.status === 2}
                <BxsStopwatch class="ms-2" size='18'></BxsStopwatch>
            {:else if game.status === 3}
                <BxLoader class="ms-2" size='18'></BxLoader>
            {:else if game.status === 4}
                <BxsCheckCircle class="ms-2" size='18'></BxsCheckCircle>
            {:else if game.status === 5}
                <BxsArchive class="ms-2" size='18'></BxsArchive>
            {/if}
        </Button>
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
    <div class="flex justify-between">
        <div class="flex justify-center items-center"> 
           <BxsLock class="me-1" size='18'></BxsLock> 
           <p>Locked</p>
        </div>
        <div class="flex justify-center items-center"> 
          <BxsHourglass class="me-1" size='18'></BxsHourglass> 
          <p>Waiting</p>
        </div>
        <div class="flex justify-center items-center"> 
          <BxsStopwatch class="me-1" size='18'></BxsStopwatch> 
          <p>Ready</p>
        </div>
        <div class="flex justify-center items-center"> 
          <BxLoader class="me-1" size='18'></BxLoader> 
          <p>Running</p>
        </div>
        <div class="flex justify-center items-center"> 
          <BxsCheckCircle class="me-1" size='18'></BxsCheckCircle> 
          <p>Completed</p>
        </div>
        <div class="flex justify-center items-center"> 
          <BxsArchive class="me-1" size='18'></BxsArchive> 
          <p>Archived</p>
        </div>
      </div> 
  </Modal>
<style>
    .brackets-viewer {
  /* Colors */
  /* --primary-background: rgb(17 24 39);
  --secondary-background: rgb(31 41 55);
  --match-background: rgb(63, 77, 97);
  --font-color: #d9d9d9;
  --win-color: #50b649;
  --loss-color: #e61a1a;
  --label-color: grey;
  --hint-color: #a7a7a7;
  --connector-color: rgb(63, 77, 97);
  --border-color: var(--primary-background);
  --border-hover-color:  rgb(249 115 22); */

  /* Sizes */
  --text-size: 14px;
  --round-margin: 50px;
  --match-width: 200px;
  --match-horizontal-padding: 10px;
  --match-vertical-padding: 10px;
  --connector-border-width: 3px;
  --match-border-width: 1px;
  --match-border-radius: 0.5em;
}
</style>