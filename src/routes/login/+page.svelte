<script>
    import { enhance } from '$app/forms'; 
    import toast from 'svelte-french-toast';
    import { Label, Input, Button, Spinner } from "flowbite-svelte";
    export let form;
    let loading = false;

    const submitLogin = () => {
        loading = true;
        console.log(loading)
        return async ({ result, update }) => { 
        switch (result.type) { 
            case 'success':
                await update();
                break; 
            case 'error': 
                toast.error("Incorrect email or password."); 
                break;
            default:
                await update();
        }
        loading = false;
        };
    };
</script>
<div class="flex flex-col items-center h-full w-full text-gray-400">
    <h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-white">
        Login to your host account
    </h2>
    <p class="text-center mt-1">
        or <a href="/register" class="font-medium hover:text-orange-400 hover:cursor-pointer underline">Register</a> if you don't have an account.
    </p>

    <form action="?/login" method="POST" class="flex flex-col items-center space-y-2 w-full pt-4" use:enhance={submitLogin}>
       
        <div class="w-full max-w-md"> 
            <Label for="email" class="mb-2">Email</Label> 
            <Input name="email"  type="email" disabled={loading}  required /> 
        </div> 
        <div class="w-full max-w-md"> 
            <Label for="password" class="mb-2">Password</Label> 
            <Input name="password"  type="password" disabled={loading}  required />
        </div>  
        <div class="w-full max-w-md">
            <a href="/reset-password" class="font-medium hover:text-orange-400 hover:cursor-pointer hover:underline">Forgot password?</a>
        </div>
        <div class="w-full max-w-md pt-2"> 
            <Button disabled={loading} class="w-full" type="submit">
                {#if loading} 
                    <Spinner class="me-3" size="4" color="white" /> 
                {/if}
                Login
            </Button>
        </div>
        {#if form?.notVerified}
            <div role="alert" class="alert alert-error w-full max-w-md"> 
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>You must verify your email before you can login.</span>
          </div>
        {/if}
    </form>
</div>