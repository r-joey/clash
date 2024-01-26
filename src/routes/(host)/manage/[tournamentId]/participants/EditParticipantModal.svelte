<script>
    export let participant
    export let disabled = false
    import { Modal, Label, Input, Button, Spinner } from 'flowbite-svelte'
    import { PUBLIC_TINY_MCE_API_KEY } from '$env/static/public'
    import Editor from '@tinymce/tinymce-svelte';    
    import { PenSolid, EyeOutline } from 'flowbite-svelte-icons'
    import { enhance } from '$app/forms';
    import toast from 'svelte-french-toast';
    import { getImageURL } from '$lib/utils'  
    let additional_information = participant?.additional_information
    let loading = false
    let openEdit = false
    
    const showPreview = (event) => {
        const target = event.target
        const files = target.files

        if (files.length > 0) {
            const src = URL.createObjectURL(files[0])
            const preview = document.getElementById("profile_picture-preview") 
            preview.src = src
        }
    } 

    const handleUpdateParticipant = () => {
        loading = true;
        return async ({ result, update }) => {    
            switch (result.type) { 
                case 'success':   
                    await update();  
                    toast.success("Participant successfully added.");  
                    break; 
                case 'error':  
                    toast.error(`${result?.error?.message ?? "Something went wrong while updating the participant. Please try again."}`); 
                    break;
                default:
                    break;
            }  
            openEdit = false
        loading = false; 
        };
    }; 
</script>
<Button size="sm" on:click={()=>{openEdit = true}}>
    {#if disabled}
        <EyeOutline size='sm'></EyeOutline>
    {:else}
        <PenSolid size="sm"></PenSolid>
    {/if}
</Button>
<Modal bind:open={openEdit} size="md" autoclose={false}> 
<form class="space-y-2 mb-4" action="?/updateParticipant" method="POST" enctype="multipart/form-data" use:enhance={handleUpdateParticipant}>
    <input type="text" hidden name="id" value={participant.id}>
    <!-- Participant Cover  START-->
    <div class="relative items-center">
        <div class="overflow-hidden flex justify-center items-center"> 
            <img id="profile_picture-preview" class="h-72 w-72 rounded-full object-cover" src={participant?.profile_picture ? getImageURL(participant?.collectionId, participant?.id, participant?.profile_picture, '0x0') : `/PP.jpg`} alt="">
        </div> 
        <label disabled={disabled} for="profile_picture">
            <span class="absolute bottom-2 right-2 hover:cursor-pointer px-4 py-2 hover:text-white text-orange-500 text-sm">
                <PenSolid disabled={disabled} size="lg"/> 
            </span>  
        </label>
        <input disabled={disabled} on:change={showPreview} type="file" id="profile_picture" name="profile_picture" hidden >
    </div> 
    
    <!-- Participant Cover  END-->
    <div class="mt-4 grid gap-4 mb-4 sm:grid-cols-2">
        <div class="sm:col-span-2">
            <Label>Name</Label>
            <Input disabled={loading || disabled} type="text" name='name' value={participant?.name ?? ''} required></Input>
            
        </div> 
        <div class="sm:col-span-2">
            <Label>Additional Information</Label>
            <textarea hidden name='additional_information' bind:value={additional_information}></textarea>
            <Editor  
            apiKey={PUBLIC_TINY_MCE_API_KEY}
            bind:value={additional_information}
            disabled={disabled}
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
    </div>
    <div class="sm:col-span-2">    
        <Button disabled={loading || disabled} type="submit" class="w-full">
            {#if loading} 
                <Spinner class="me-3" size="4" color="white" /> 
            {/if} 
            Save
        </Button>
    </div>  
</form>
</Modal>