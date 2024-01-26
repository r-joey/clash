<script>
    export let data 
    const { tournament } = data 
</script>
 
<div class="text-sm text-gray-300">
    <div class="no-tailwindcss-base">
        {@html tournament.information}
    </div>
</div> 