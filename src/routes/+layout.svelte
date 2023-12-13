<script>
  import "../app.pcss"; 
  import { page } from '$app/stores';
  import { Toaster } from 'svelte-french-toast';
  import { getImageURL } from '$lib/utils' 
  import { Button, Navbar, NavBrand, NavLi, NavUl, NavHamburger, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider, ImagePlaceholder, Skeleton, TextPlaceholder } from 'flowbite-svelte';
  $: activeUrl = $page.url.pathname;
  export let data  
</script> 
<Toaster />
<Navbar > 
  <NavBrand href="/">
    <img src="https://flowbite-svelte.com/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Clash</span>
  </NavBrand>
  <div class="flex md:order-2">
    {#if data.user}
    <Button href="/create" outline class="mr-3">Creat</Button>
    <Avatar border class="dark:ring-orange-500 hover:cursor-pointer" id="avatar-menu" src={data?.user?.avatar ? getImageURL(data.user?.collectionId, data.user?.id, data.user?.avatar, "100x100") : `https://ui-avatars.com/api/?name=JR?bold=true`} /> 
    {:else}
    <Button href="/login" size="sm">Login</Button>
    {/if}
    <NavHamburger />
  </div>
  {#if data.user}
  <Dropdown placement="bottom" triggeredBy="#avatar-menu">
    <DropdownHeader>
      <span class="block text-sm">{data.user.name}</span>
      <span class="block truncate text-sm font-medium">{data.user.email}</span>
    </DropdownHeader>
    <DropdownItem href="/dashboard">Dashboard</DropdownItem>
    <DropdownItem href="/settings">Settings</DropdownItem> 
    <DropdownDivider />
    <form action="/logout" method="POST">
      <DropdownItem><Button type="submit">Log out</Button> </DropdownItem>  
    </form>
  </Dropdown>
  {/if}
  
  <NavUl {activeUrl} class="order-1">
    <NavLi href="/">Home</NavLi>
    <NavLi href="/favorites">Favorites</NavLi> 
  </NavUl>
</Navbar>
 
 
<div class="py-4">
  <div class="mx-auto max-w-7xl pt-4 px-5 sm:px-10 md:px-16">
    <slot />
  </div>
</div>
