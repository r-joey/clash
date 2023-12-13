<script>
    import { enhance, applyAction } from '$app/forms'
    import { invalidateAll } from '$app/navigation';  
    import { getImageURL } from '$lib/utils' 
    import { Avatar, Label, Input, Button, Fileupload } from 'flowbite-svelte'
    import toast from 'svelte-french-toast';
    export let user;
    let loading; 
    $: loading = false

    const showPreview = (event) => {
        const target = event.target
        const files = target.files

        if (files.length > 0) {
            const src = URL.createObjectURL(files[0])
            const preview = document.getElementById("avatar-preview") 
            preview.src = src
        }
    }

    const submitUpdateProfile = () => {
        loading = true
        return async ({ result }) => {
            switch (result.type) {
                case 'success':
                    await invalidateAll()
                    toast.success('Profile successfully updated!')
                    break
                case 'error':
                    toast.error('Something went wrong while updating your profile. Please try again.')
                    break
                default:
                    await applyAction(result)
            }
            loading = false
        }
    }


</script> 

<div class="flex flex-col w-full h-full">
	<div class="w-full">
		<form action="?/updateProfile" method="POST" enctype="multipart/form-data" use:enhance={submitUpdateProfile} class="flex flex-col space-y-4 w-full">
			<h3 class="text-2xl font-medium dark:text-gray-400">Update Profile</h3> 
            <div>
                <Label class="mb-2" for="avatar">Profile picture</Label> 
                <Avatar class="mb-2" id="avatar-preview" src={user?.avatar ? getImageURL(user?.collectionId, user?.id, user?.avatar, "100x100") : `https://ui-avatars.com/api/?name=JR?bold=true`} size="xl"/>
                <Fileupload on:change={showPreview} type="file" name="avatar" id="avatar" accept="image/*"  disabled={loading}/>
            </div>
            <div>
                <Label for="name" class="mb-2">Name</Label>
                <Input type="text" id="name" name="name" placeholder="John" value={user?.name} required />
            </div>
			<Button type="submit">Update Profile</Button>
		</form>
	</div>
</div>