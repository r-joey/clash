<script> 
    import { enhance, applyAction } from "$app/forms"
    import { invalidateAll } from "$app/navigation"
    import { Label, Input, Button, Modal, Hr } from 'flowbite-svelte'
    import toast from 'svelte-french-toast'; 
    export let user

    let loading;
    let emailModalOpen;
    let usernameModalOpen;

    $: emailModalOpen = false
    $: usernameModalOpen = false
    $: loading = false

	const submitUpdateEmail = () => {
		loading = true;
		emailModalOpen = true;
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
          toast.success('We have sent you a confirmation link to your new email. Please check your new email.')
					emailModalOpen = false;
					break;
				case 'error':
          toast.error(result?.error?.data?.newEmail?.message ? result?.error?.data?.newEmail?.message : 'Something went wrong while updating your email. Please try again')
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};

    const submitUpdateUsername = () => {
		loading = true;
		usernameModalOpen = true;
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
                    toast.success('Username updated successfully.')
					usernameModalOpen = false;
					break;
				case 'error':
                    console.log(result.error)
                    toast.error(result?.error?.data?.username?.message ? result?.error?.data?.username?.message : 'Something went wrong while updating your username. Please try again')
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};

</script>

<div class="flex flex-col w-full h-full space-y-12">
    <div class="w-full">
        <h3 class="text-2xl font-medium dark:text-gray-400">Change email</h3> 
        <Hr classHr="my-4" />
          <Button on:click={() => (emailModalOpen = true)}>Change Email</Button>
          
          <Modal bind:open={emailModalOpen} size="md" autoclose={false} class="w-full">
            <form class="flex flex-col space-y-6" action="?/updateEmail" method="POST" use:enhance={submitUpdateEmail}>
              <h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Change email</h3>
              <Label class="space-y-2">
                <span>Enter your new email</span>
                <Input type="email" name="email" disabled={loading} required />
              </Label> 
              <Button disabled={loading} type="submit" class="w-full1">Change my email</Button> 
            </form>
          </Modal>
    </div>

    <div class="w-full">
        <h3 class="text-2xl font-medium dark:text-gray-400">Change username</h3> 
        <Hr classHr="my-4" />

        <Label class="space-y-2 mb-4">
            <span>Username</span>
            <Input type="text" name="username" value={user?.username} disabled />
        </Label> 
        <Button disabled={loading} on:click={() => (usernameModalOpen = true)} class="w-full1">Change username</Button> 
        <Modal bind:open={usernameModalOpen} size="md" autoclose={false} class="w-full">
            <form class="flex flex-col space-y-4" action="?/updateUsername" method="POST" use:enhance={submitUpdateUsername}>
              <h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Change username</h3>
              <Label class="space-y-2">
                <span>Enter your new username</span>
                <Input type="text" name="username" disabled={loading} required />
              </Label> 
              <Button disabled={loading} type="submit" class="w-full1">Change my username</Button> 
            </form>
        </Modal>
    </div>
</div>