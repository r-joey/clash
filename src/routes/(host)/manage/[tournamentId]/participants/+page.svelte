<script>
    export let data  
    import { enhance } from '$app/forms';
    import toast from 'svelte-french-toast'; 
    import { PUBLIC_TINY_MCE_API_KEY } from '$env/static/public'
    import Editor from '@tinymce/tinymce-svelte';    
    import { Avatar, Modal, Label, Input, Button, Hr, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Spinner, GradientButton } from 'flowbite-svelte'

    import { PenSolid } from 'flowbite-svelte-icons'
    import { getImageURL } from '$lib/utils'  
    import DeleteParticipantModal from './DeleteParticipantModal.svelte';
    import EditParticipantModal from './EditParticipantModal.svelte';
  
    let loading = false;
    let additional_information = ''

    let disabled = data?.tournament?.status === 'In progress' || data?.tournament?.status === 'Finalized' ? true : false
    let addParticipantModal = false
   

    const showPreview = (event) => {
        const target = event.target
        const files = target.files

        if (files.length > 0) {
            const src = URL.createObjectURL(files[0])
            const preview = document.getElementById("profile_picture-preview") 
            preview.src = src
        }
    }


    const handleCreateParticipant = () => {
        loading = true;
        return async ({ result, update }) => {   
            console.log(result)
            switch (result.type) { 
                case 'success':   
                    await update();  
                    toast.success("Participant successfully added."); 
                    additional_information = ''
                    break; 
                case 'error':  
                    toast.error(`${result?.error?.message ?? "Something went wrong while adding the participant. Please try again."}`); 
                    break;
                default:
                    break;
            }  
        addParticipantModal = false
        loading = false; 
        };
    }; 
</script>

<div class="flex flex-col-1 gap-3 flex-wrap items-center justify-center">
    <GradientButton disabled={disabled} size="sm" color="pinkToOrange" outline on:click={()=> addParticipantModal = true}>Add participant</GradientButton>
</div>
 



<Modal title="Add new participant" bind:open={addParticipantModal} size="md" autoclose={false}>
    <form class="space-y-2 mb-4" action="?/createParticipant" method="POST" enctype="multipart/form-data" use:enhance={handleCreateParticipant}>
        <!-- Participant Cover  START-->
        <div class="relative items-center">
            <div class="overflow-hidden flex justify-center items-center"> 
                <img id="profile_picture-preview" class="h-72 w-72 rounded-md object-cover" src={'/PP.jpg'} alt="">
            </div> 
            <label for="profile_picture">
                <span class="absolute bottom-2 right-2 hover:cursor-pointer px-4 py-2 hover:text-white text-orange-500 text-sm">
                    <PenSolid size="lg"/> 
                </span>  
            </label>
            <input on:change={showPreview} type="file" id="profile_picture" name="profile_picture" hidden >
        </div> 
        
        <!-- Participant Cover  END-->
        <div class="mt-4 grid gap-4 mb-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
                <Label>Name</Label>
                <Input disabled={loading} type="text" name='name' required></Input>
                
            </div> 
            <div class="sm:col-span-2">
                <Label>Additional Information</Label>
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
        </div>
        <div class="sm:col-span-2">    
            <Button disabled={loading} type="submit" class="w-full">
                {#if loading} 
                    <Spinner class="me-3" size="4" color="white" /> 
                {/if} 
                Save
            </Button>
        </div>  
    </form>
</Modal> 



<Hr/>
<Table>
    <TableHead> 
            <TableHeadCell>Profile picture</TableHeadCell>
            <TableHeadCell>Name</TableHeadCell> 
            <TableHeadCell> </TableHeadCell>  
    </TableHead>
    <TableBody>
        {#each data.participants as participant} 
            <TableBodyRow>  
                <TableBodyCell><Avatar rounded src={participant?.profile_picture ? getImageURL(participant?.collectionId, participant?.id, participant?.profile_picture, "80x80") : `/PP.jpg`} /></TableBodyCell>
                <TableBodyCell>{participant.name}</TableBodyCell> 
                <TableBodyCell> 
                    <EditParticipantModal {disabled} {participant} />
                    <DeleteParticipantModal {disabled} {participant} />
                </TableBodyCell> 
            </TableBodyRow>
        {/each} 
    </TableBody>
</Table>
  