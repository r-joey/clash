<script>
    export let data  
    import { enhance, applyAction } from '$app/forms';
    import toast from 'svelte-french-toast';
    import { DotsHorizontalOutline, DotsVerticalOutline, ExclamationCircleOutline, UsersSolid, TrashBinSolid, UserEditSolid, EditOutline} from 'flowbite-svelte-icons'
    import { PUBLIC_TINY_MCE_API_KEY } from '$env/static/public'
    import Editor from '@tinymce/tinymce-svelte';    
    import {  Modal, Label, Input, Checkbox, Select, Button, Hr, Helper, Listgroup, ListgroupItem, Avatar, ButtonGroup, InputAddon, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Textarea, GradientButton } from 'flowbite-svelte'

    import { PenSolid } from 'flowbite-svelte-icons'
    import { getImageURL } from '$lib/utils' 
    // export let form
    import { invalidateAll } from '$app/navigation'
 
    // let participants = tournament?.expand?.['participants(tournament)'] ?? []
    let loading = false;
    let additional_information = ''

    let teamEditMode = false
    let selectedTeam = null
    let deleteParticipantModal = false
    let addParticipantModal = false
  
    // Player area 
    let playerEditMode = false
    let selectedPlayer = null
    let deletePlayerModal = false
    // end Player area

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
            switch (result.type) { 
                case 'success':   
                    await update();  
                    toast.success("Participant successfully added."); 
                    break; 
                case 'error': 
                    toast.error(result.error.message); 
                    break;
                default:
                    break;
            }  
        loading = false; 
        addParticipantModal = false
        };
    }; 
</script>

<div class="flex flex-col-1 gap-3 flex-wrap mb-3">
    <GradientButton size="sm" color="pinkToOrange" outline on:click={()=> addParticipantModal = true}>Add participant</GradientButton>
</div>

<Modal title="Add new participant" bind:open={addParticipantModal} size="md" autoclose={false}>
    <form class="space-y-2 mb-4" action="?/createParticipant" method="POST" enctype="multipart/form-data" use:enhance={handleCreateParticipant}>
        <!-- Participant Cover  START-->
        <div class="relative items-center">
            <div class="overflow-hidden flex justify-center items-center"> 
                <img id="profile_picture-preview" class="h-72 w-72 rounded-full object-cover" src={'/PP.jpg'} alt="">
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
            <div>
                <Label>Name</Label>
                <Input type="text" name='name' required></Input>
                
            </div>
            <div>
                <Label>Social</Label>
                <Input type="text" name='social' required></Input>
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
            <Button disabled={loading} type="submit" class="w-full">Save</Button>
        </div>  
    </form>
</Modal> 



<Hr/>
<Table>
    <TableHead> 
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Social</TableHeadCell>
            <TableHeadCell> </TableHeadCell>  
    </TableHead>
    <TableBody>
        {#each data.participants as participant} 
            <TableBodyRow> 
                <TableBodyCell>{participant.name}</TableBodyCell>
                <TableBodyCell><a target="_blank" class="underline text-orange-300" href={participant.social ?? ''}>social</a> </TableBodyCell>
                <TableBodyCell> 
                    <Button size="sm" on:click={()=> {teamEditMode=true; selectedTeam=participant}}><UserEditSolid size="sm"></UserEditSolid></Button>
                    <Button size="sm" on:click={()=> {deleteParticipantModal=true; selectedTeam=participant; console.log(selectedTeam)}}><TrashBinSolid size="sm"></TrashBinSolid></Button>
                </TableBodyCell> 
            </TableBodyRow>
        {/each} 
    </TableBody>
</Table>
 
 
<!-- Team starts -->
<!-- {#if participant_type === 'team'}    
    {#if !teamEditMode}    
    <form class="space-y-2 mb-4" action="?/createParticipant" method="POST" use:enhance>
        <Label>Team details</Label>
        <ButtonGroup class="w-full"> 
            <Input  type="text" name="name" placeholder="Team name" required /> 
            <Input  type="text" name="social" placeholder="https://www.facebook.com/joey_rapista" /> 
            <Button color="primary" type="submit">Add</Button> 
        </ButtonGroup> 
    </form>
    {/if}
    {#if teamEditMode}    
    <form class="space-y-2 mb-4" action="?/editParticipant" method="POST">
        <Label>Team details</Label>
        <ButtonGroup class="w-full"> 
            <input value={selectedTeam.id ?? ''} hidden name="id" />
            <Input value={selectedTeam.name ?? ''}  type="text" name="name" placeholder="player name" required /> 
            <Input value={selectedTeam.social ?? ''} type="text" name="social" placeholder="https://www.facebook.com/joey_rapista" />
            <Button color="primary" type="submit">Save</Button> 
            <Button on:click={()=>teamEditMode=false} outline color="primary" type="submit">Cancel</Button> 
        </ButtonGroup> 
    </form>
    {/if}
<Hr/>
<Table>
    <TableHead> 
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Link</TableHeadCell>
            <TableHeadCell> </TableHeadCell>  
    </TableHead>
    <TableBody>
        {#each participants as participant} 
            <TableBodyRow> 
                <TableBodyCell>{participant.name}</TableBodyCell>
                <TableBodyCell><a target="_blank" class="underline text-orange-300" href={participant.social ?? ''}>social</a> </TableBodyCell>
                <TableBodyCell>
                    <Button size="sm" href={`/manage/${participant.id}/players`}><UsersSolid size="sm"></UsersSolid></Button>
                    <Button size="sm" on:click={()=> {teamEditMode=true; selectedTeam=participant}}><UserEditSolid size="sm"></UserEditSolid></Button>
                    <Button size="sm" on:click={()=> {deleteParticipantModal=true; selectedTeam=participant; console.log(selectedTeam)}}><TrashBinSolid size="sm"></TrashBinSolid></Button>
                </TableBodyCell> 
            </TableBodyRow>
        {/each} 
    </TableBody>
</Table>
 
 {/if}  
<Modal bind:open={deleteParticipantModal} size="xs" autoclose={false}>
    <div class="text-center">
        <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <h3 class="text-md font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete participant:</h3> 
        <p class="mb-5 text-lg font-normal"> <strong>{selectedTeam.name}</strong>?</p>
        <form action="?/deleteParticipant" method="POST">  
            <input type="hidden" name="id" value={selectedTeam.id}>
            <Button type="submit" color="primary" class="me-2">Yes</Button>
            <Button type="button" on:click={()=>{selectedTeam={}}} color="alternative">Cancel</Button>
        </form>
    </div>
</Modal>  -->
<!-- team ends -->













<!-- {#if participant_type === 'player'}
    {#if !playerEditMode}    
        <form class="space-y-2 mb-4" action="?/createParticipant" method="POST" use:enhance={handleCreatePlayer}>
            <Label>Player details</Label>
            <ButtonGroup class="w-full"> 
                <Input  type="text" name="name" placeholder="player name" required />
                <Input  type="text" name="identity" placeholder="game username or jersey number etc... " required />
                <Input  type="text" name="social" placeholder="https://www.facebook.com/joey_rapista" />
                <Button color="primary" type="submit">Add</Button> 
            </ButtonGroup> 
        </form>
    {/if}
    {#if playerEditMode}    
        <form class="space-y-2 mb-4" action="?/editParticipant" method="POST">
            <Label>Player details</Label>
            <ButtonGroup class="w-full"> 
                <input value={selectedPlayer.id ?? ''} hidden name="id" />
                <Input value={selectedPlayer.name ?? ''}  type="text" name="name" placeholder="player name" required />
                <Input value={selectedPlayer.identity ?? ''} type="text" name="identity" placeholder="game username or jersey number etc... " required />
                <Input value={selectedPlayer.social ?? ''} type="text" name="social" placeholder="https://www.facebook.com/joey_rapista" />
                <Button color="primary" type="submit">Save</Button> 
                <Button on:click={()=>playerEditMode=false} outline color="primary" type="submit">Cancel</Button> 
            </ButtonGroup> 
        </form>
    {/if}
<Hr/>
<Table>
    <TableHead> 
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Identity</TableHeadCell>
            <TableHeadCell>Link</TableHeadCell> 
            <TableHeadCell></TableHeadCell>
    </TableHead>
    <TableBody>
        {#each participants as participant} 
            <TableBodyRow> 
                <TableBodyCell>{participant.name ?? ''}</TableBodyCell>
                <TableBodyCell>{participant.identity ?? ''}</TableBodyCell>
                <TableBodyCell><a target="_blank"  class="underline text-orange-300" href={participant.social ?? ''}>social</a> </TableBodyCell>
                <TableBodyCell>
                    <Button size="sm" on:click={()=> {deletePlayerModal=true; selectedPlayer=participant}}><TrashBinSolid size="sm"></TrashBinSolid></Button>
                    <Button size="sm" on:click={()=> {playerEditMode=true; selectedPlayer=participant}}><UserEditSolid size="sm"></UserEditSolid></Button>
                </TableBodyCell>
            </TableBodyRow>
        {/each} 
    </TableBody>
</Table>

<Modal bind:open={deletePlayerModal} size="xs" autoclose={false}>
    <div class="text-center">
        <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <h3 class="text-md font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete participant:</h3> 
        <p class="mb-5 text-lg font-normal"> <strong>{selectedPlayer.name}</strong>?</p>
        <form action="?/deleteParticipant" method="POST">  
            <input type="hidden" name="id" value={selectedPlayer.id}>
            <Button type="submit" color="primary" class="me-2">Yes</Button>
            <Button type="button" on:click={()=>{selectedPlayer=null; deletePlayerModal=false}} color="alternative">Cancel</Button>
        </form>
    </div>
</Modal> 
{/if} -->