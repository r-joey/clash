<script>
    import { enhance, applyAction } from '$app/forms'
    import { Label, Input, Button } from "flowbite-svelte";
    import toast from 'svelte-french-toast';


    let loading = false;

    const submitChangepassowrd = () => {
    loading = true
    return async ({ result, update }) => {
        switch (result.type) { 
            case 'error':
                toast.error('Something went wrong while updating your password. Please try again.')
                break
            default:
                await update();
        }
        loading = false
    }
    }

</script>

<div class="flex flex-col w-full h-full">
	<div class="w-full">
		<form action="?/updatePassword" method="POST" class="flex flex-col space-y-4 w-full" use:enhance={submitChangepassowrd}>
			<h3 class="text-2xl font-medium dark:text-gray-400">Change Password</h3> 
            <div>
                <Label for="oldPassword" class="mb-2">Old Password</Label> 
                <Input name="oldPassword" type="password" disable={loading} required />
            </div>
            <div>
                <Label for="password" class="mb-2">New Password</Label> 
                <Input name="password"  type="password" disable={loading}  required />
            </div>
			<div>
                <Label for="passwordConfirm" class="mb-2">Confirm new Password</Label> 
                <Input name="passwordConfirm"  type="password" disable={loading}  required />
            </div> 
			 
            <!-- <a href="/reset-password" class="font-medium  hover:text-orange-400 dark:text-gray-400">I forgot my password</a> -->
            <a href="/reset-password" class="font-medium text-gray-400 hover:text-orange-400 hover:cursor-pointer hover:underline">Forgot password?</a>
			<Button disable={loading}  type="submit">Update Password</Button>
		</form>
	</div>
</div>