<script>
    import { Tabs, TabItem } from 'flowbite-svelte';
    import Profile from './Profile.svelte'; 
    import Account from './Account.svelte'; 
    import Security from './Security.svelte'; 
    export let data;
  </script>
  <h3 class="mb-3 text-xl font-semibold text-gray-400">Settings</h3>
  <Tabs style="pill"> 
      <TabItem open >
        <span slot="title">Profile</span>
        <Profile user={data?.user}/>
      </TabItem>  
      <TabItem> 
        <span slot="title">Account</span>
        <Account user={data?.user}/>
      </TabItem>  
      <TabItem>
        <span slot="title">Security</span>
        <Security/>
      </TabItem>  
  </Tabs>