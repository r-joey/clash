<script>
    import StagesModal from "./StagesModal.svelte";
    import { Button } from 'flowbite-svelte'
    export let tournament  
     
    let stages = tournament?.expand?.['stages(tournament)'] ?? []
    console.log(stages)
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

    const matchClicked = (match) => {
      console.log(match)
    } 
    
</script>

<StagesModal  {tournament}/>
{#each stages as stage,idx  }
  <Button on:click={()=>renderBracket(stage.data)}>{`Stage ${idx+1}`}</Button>
{/each}
<div class="brackets-viewer"></div>