<script>
  import "../app.pcss"; 
  import { Toaster } from 'svelte-french-toast';
  import { getImageURL } from '$lib/utils' 
  import { GradientButton , Button, Navbar, NavBrand, NavHamburger, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte';
  export let data  
</script> 
<Toaster />
<Navbar > 
  <NavBrand href="/">
    <img src="/logo.png" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Clash</span>
  </NavBrand>
  <div class="flex md:order-2">
    {#if data.user}
    <GradientButton  href="/create" outline  color="pinkToOrange" class="mr-3">Creat</GradientButton>
    <Avatar border class="dark:ring-orange-500 hover:cursor-pointer" id="avatar-menu" src={data?.user?.avatar ? getImageURL(data.user?.collectionId, data.user?.id, data.user?.avatar, "80x80") : `/PP.jpg`} /> 
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
 
</Navbar>
 
 
<div class="py-4">
  <div class="mx-auto max-w-7xl mb-20 pt-4 px-5 sm:px-10 md:px-16">
    <slot />
  </div>
</div>
