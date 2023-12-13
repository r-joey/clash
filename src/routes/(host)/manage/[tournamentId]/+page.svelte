<script> 
    import { Dropdown, DropdownItem, Tabs, TabItem} from 'flowbite-svelte'
    import { DotsHorizontalOutline, GearSolid } from 'flowbite-svelte-icons'
    import Details from './Details.svelte';
    import Participants from './Participants.svelte';
    import Stages from './Stages.svelte';
    export let data;  
    const { tournament } = data  
</script>  
 
  <Tabs style="pill" contentClass="py-4" >
    <TabItem open >
      <span slot="title">Details</span>
      <Details {tournament}/>
    </TabItem>
    <TabItem >
      <span slot="title">Participants</span>
       <Participants {tournament}/>
    </TabItem>
    <TabItem>
      <span slot="title">Stages</span>
      <Stages {tournament}/>
    </TabItem> 
    <TabItem>
      <span slot="title"><GearSolid/></span>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        <b>Settings:</b>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </TabItem> 
  </Tabs>   