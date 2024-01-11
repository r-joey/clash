<script>

    export let data
    const {tournament} = data
    import { getImageURL } from '$lib/utils' 
    import { enhance, applyAction } from '$app/forms'; 
    import toast from 'svelte-french-toast';
    import { Input, Label, Select, Button, Helper} from 'flowbite-svelte'
    import { PenSolid } from 'flowbite-svelte-icons'
    import { PUBLIC_TINY_MCE_API_KEY } from '$env/static/public'
    import Editor from '@tinymce/tinymce-svelte';     
    let information = tournament.information ?? ''
    let loading = false

    let gamesOpts = [
      { value: 'mobile_legends', name: 'Mobile Legends' },
      { value: 'basketball', name: 'Basketball' },
      { value: 'baseball', name: 'Baseball' },
      { value: 'dota', name: 'DoTA' },
      { value: 'league_of_legends', name: 'League of Legends' },
      { value: 'badminton', name: 'Badminton' },
      { value: 'football', name: 'Football' }
    ];

    let sizeOpts = [
      { value: 2, name: '2' },
      { value: 4, name: '4' },
      { value: 8, name: '8' },
      { value: 16, name: '16' },
      { value: 32, name: '32' },
      { value: 64, name: '64' }
    ]; 

    let participantsTypeOpts = [
      {value:'player', name:'Player'},
      {value:'team', name:'Team'}
    ]   
    const showPreview = (event) => {
        const target = event.target
        const files = target.files

        if (files.length > 0) {
            const src = URL.createObjectURL(files[0])
            const preview = document.getElementById("cover-preview") 
            preview.src = src
        }
    }
    const handleUpdateTournament = () => {
        loading = true;
        return async ({ result, update }) => {   
        switch (result.type) { 
            case 'success':
                await update({reset: false});
                toast.success("Tournament details successfully updated."); 
                break; 
            case 'error': 
                toast.error(result.error.message); 
                break;
            default:
                break;
        }
        loading = false; 
        };
    }; 
</script>
<form action="?/updateTournament" method="POST" enctype="multipart/form-data" use:enhance={handleUpdateTournament}> 
    <!-- COVER START -->
  <div class="relative">
      <div class="rounded-lg overflow-hidden"> 
          <img id="cover-preview" class="object-cover w-full" src={tournament.cover ? getImageURL(tournament.collectionId, tournament.id, tournament.cover, "0x0") : '/mlbb.jpg'} alt="">
      </div> 
      <label for="cover">
          <span class="rounded-full absolute bottom-2 right-2 hover:cursor-pointer hover:bg-orange-500 px-4 py-2 hover:text-white text-orange-500 text-sm">
              <PenSolid size="lg"/> 
          </span>  
      </label>
      <input on:change={showPreview} type="file" id="cover" name="cover" hidden >
  </div>
  <!-- COVER END -->
  <!-- DETAIL START -->
  <div class="mt-4 grid gap-4 mb-4 sm:grid-cols-2">
    <div>
        <Label>Name</Label>
        <Input type="text" value={tournament.name ?? ''} name='name' required></Input>
        
    </div>
    <div>
        <Label>Game</Label>
        <Select name='game' items={gamesOpts} value={tournament.game ?? null} required></Select>
    </div>  
    <div>
        <Label>Size</Label>
        <Select name='size' items={sizeOpts} value={tournament.size ?? null}  required></Select>
    </div>
 
    <div>
        <Label>Participant Type</Label>
        <Select name='participant_type' value={tournament.participant_type ?? null}  items={participantsTypeOpts} required></Select>
    </div> 
    <div class="sm:col-span-2">
        <Label>Information</Label>
        <textarea hidden name='information' bind:value={information}></textarea>
        <Editor  
        apiKey={PUBLIC_TINY_MCE_API_KEY}
        bind:value={information}
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
    <div class="sm:col-span-2">    
        <Button disabled={loading} type="submit" class="w-full">Update Details</Button>
    </div>  
</div> 

</form>