<script> 
    import { Button } from 'flowbite-svelte'
    import { page } from '$app/stores'; 
    export let data;  
    const { tournament } = data  
    const navigation = [
        {title: 'Details', href: `/manage/${tournament.id}/details`},
        {title: 'Participants', href: `/manage/${tournament.id}/participants`},
        {title: 'Stages', href: `/manage/${tournament.id}/stages`},
        {title: 'Awards', href: `/manage/${tournament.id}/awards`},
        {title: 'Settings', href: `/manage/${tournament.id}/settings`},
    ] 
</script>  
 
<div class="flex flex-nowrap overflow-x-auto gap-3 items-center justify-start whitespace-nowrap mb-3"> 
  {#each navigation as navItem}
    <Button size="sm" outline={$page.url.pathname === navItem.href ? false : true} href={navItem.href}>{navItem.title}</Button>
  {/each}
  
</div>
<slot/>