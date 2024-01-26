<script> 
    export let data;
    import { Card, Dropdown, DropdownItem, Avatar, Button, Modal, Listgroup, ListgroupItem  } from 'flowbite-svelte';
    import { DotsHorizontalOutline } from 'flowbite-svelte-icons'; 
    import { getImageURL } from '$lib/utils' 

    const { awards } = data 
    console.log(awards)
</script>
<div>
    
    <Listgroup class="border-0 dark:!bg-transparent">
        {#each awards as award}
        <ListgroupItem >
            <div class="flex items-center space-x-4 rtl:space-x-reverse">
                <Avatar rounded src={award?.expand?.participant?.profile_picture ? getImageURL(award?.expand?.participant?.collectionId, award?.expand?.participant?.id, award?.expand?.participant?.profile_picture, "80x80") : `/PP.jpg`} class="flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {award?.expand?.participant?.name ?? ''}
                  </p> 
                </div>
                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  {award.title}
                </div>
              </div> 
        </ListgroupItem>  
        {/each}
        
      </Listgroup> 
</div> 