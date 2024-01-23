<script>
    import { enhance } from '$app/forms'; 
    import toast from 'svelte-french-toast';
    import { Input, Label, Select, Fileupload, Button, Spinner  } from "flowbite-svelte"
    import { PUBLIC_TINY_MCE_API_KEY } from '$env/static/public'
    import Editor from '@tinymce/tinymce-svelte';    
    
    let information = ''

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


    let loading
    
    const submitCreate = () => {
        loading = true;
        return async ({ result, update }) => {
        switch (result.type) {  
            case 'success':  
                toast.success('Tournament successfully created.');  
                break;
            case 'error':  
                toast.error("Something went wrong while creating the tournament. Please try again.");  
                break;
            default:
                await update();
        }
        loading = false;
        };
    };
</script>
<div class="text-gray-400 space-y-4">
    <!-- HEADER -->
    <h3 class="text-center text-xl font-bold">Create Tournament</h3> 
    <!-- FORM START -->
    <form action="?/createTournament" method="post" enctype="multipart/form-data" use:enhance={submitCreate}>
        <div class="grid gap-4 mb-4 sm:grid-cols-2">
            <div>
                <Label>Name</Label>
                <Input disabled={loading} name='name' required></Input> 
            </div>
            <div>
                <Label>Game</Label>
                <Select disabled={loading} name='game' items={gamesOpts} required></Select>
            </div>  

         
            <div class="sm:col-span-2">
                <Label>Cover Image</Label>
                <Fileupload disabled={loading} name='cover'/> 
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
                <Button disabled={loading} type="submit" class="w-full">
                    {#if loading} 
                        <Spinner class="me-3" size="4" color="white" /> 
                    {/if}
                    Create Tournament
                </Button>
            </div>  
        </div> 
      </form>
      <!-- FORM END -->
</div>


