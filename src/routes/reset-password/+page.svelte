<script> 
    export let form 
    import { enhance } from '$app/forms'; 
    import { InfoCircleSolid } from 'flowbite-svelte-icons';
    import { Button, Input, Alert } from 'flowbite-svelte';
    
    let loading
    const resetPassword = () => {
        loading = true; 
        return async ({ result, update }) => { 
        switch (result.type) { 
            case 'success':
                await update();
                break; 
            case 'error':  
                break;
            default:
                await update();
        }
        loading = false;
        };
    };
    
    </script> 
  <div class="flex flex-col items-center h-full w-full">
      <h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-white">
          Reset your password
      </h2>
      <p class=" text-white text-center mt-1">
          We'll send you an email with a link to reset your password.
      </p>
  
      <form action="?/resetPassword" use:enhance={resetPassword} method="POST" class="flex flex-col items-center space-y-2 w-full pt-4">
         
          <div class="form-control w-full max-w-md">
           
              <Input type="email" placeholder="Email" name="email" class="input input-bordered w-full max-w-md" />
          </div>
  
          
          <div class="w-full max-w-md pt-2 mb-3">
              <Button type="submit" class="w-full">Request password reset</Button>
          </div> 
      </form>
      {#if form?.success}
      <div class="mt-3"> 
          <Alert border color="green">
              <InfoCircleSolid slot="icon" class="w-4 h-4" />
              <span class="font-medium">Email sent!</span>
              An email has been sent to reset your password!
              </Alert>
          </div>
      {/if}
  </div>

