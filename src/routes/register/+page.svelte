<script>
    import { enhance } from '$app/forms'; 
    import toast from 'svelte-french-toast';
    import { Label, Input, Button, Helper } from "flowbite-svelte";
    let loading
    let reg_result = {}
    const submitRegister = () => {
        loading = true;
        return async ({ result, update }) => {
            reg_result = result
            console.log(reg_result)
        switch (result.type) {  
            case 'error':
                toast.error("Something went wrong. Please try again.");  
                break;
            default:
                await update();
        }
        loading = false;
        };
    };
</script>
<div class="flex flex-col items-center h-full w-full text-gray-400 ">
    <h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-white">
        Register for an account
    </h2>
    <p class="text-center mt-1">
        or <a href="/login" class="font-medium hover:text-orange-400 hover:cursor-pointer underline">Log-in</a> if you already have an account.
    </p>

    <form action="?/register" method="POST" class="flex flex-col items-center space-y-2 w-full pt-4" use:enhance={submitRegister}>
        <div class="w-full max-w-md"> 
            <Label for="name" class="mb-2">Name</Label> 
            <Input name="name"  type="text" disable={loading}  required /> 
            {#if reg_result?.error?.data?.name?.message}     
                <Helper class="mt-2" color="red"> 
                    {reg_result?.error?.data?.name?.message ?? ""}
                </Helper>
            {/if}
        </div>
        <div class="w-full max-w-md"> 
            <Label for="email" class="mb-2">Email</Label> 
            <Input name="email"  type="email" disable={loading}  required /> 
            {#if reg_result?.error?.data?.email?.message}     
                <Helper class="mt-2" color="red"> 
                    {reg_result?.error?.data?.email?.message ?? ""}
                </Helper>
            {/if}
        </div> 
        <div class="w-full max-w-md"> 
            <Label for="password" class="mb-2">Password</Label> 
            <Input name="password"  type="password" disable={loading}  required /> 
            {#if reg_result?.error?.data?.password?.message}      
                <Helper class="mt-2" color="red"> 
                    {reg_result?.error?.data?.password?.message ?? ""}
                </Helper>
            {/if}
        </div>
        <div class="w-full max-w-md"> 
            <Label for="passwordConfirm" class="mb-2">Confirm Password</Label> 
            <Input name="passwordConfirm"  type="password" disable={loading}  required /> 
            {#if reg_result?.error?.data?.passwordConfirm?.message}
                <Helper class="mt-2" color="red"> 
                    {reg_result?.error?.data?.passwordConfirm?.message ?? ""}
                </Helper>
            {/if}
        </div> 
        <div class="w-full max-w-md pt-4"> 
            <Button disable={loading} class="w-full" type="submit">Register</Button>
        </div>
    </form>
</div>