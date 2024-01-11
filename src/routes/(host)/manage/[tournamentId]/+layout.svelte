<script> 
    import { Button, Dropdown, DropdownItem, Tabs, TabItem} from 'flowbite-svelte'
    import { page } from '$app/stores';
    // import { DotsHorizontalOutline, GearSolid } from 'flowbite-svelte-icons'
    export let data;  
    const { tournament } = data  
    const navigation = [
        {title: 'Details', href: `/manage/${tournament.id}/details`},
        {title: 'Participants', href: `/manage/${tournament.id}/participants`},
        {title: 'Stages', href: `/manage/${tournament.id}/stages`},
        {title: 'Settings', href: `/manage/${tournament.id}/settings`},
    ] 
</script>  
 
<div class="flex flex-col-1 gap-3 flex-wrap mb-3"> 
  {#each navigation as navItem}
    <Button outline={$page.url.pathname === navItem.href ? false : true} href={navItem.href}>{navItem.title}</Button>
  {/each}
  
</div>
<slot/>