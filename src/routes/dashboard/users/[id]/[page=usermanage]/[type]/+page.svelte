<script lang="ts">
  import { page } from "$app/stores";

  export let data;
</script>

<h1 class="text-lg text-primary">
  {$page.params.type} images {$page.params.page} by id:{$page.params.id}
</h1>

<div class="w-full columns-2 break-inside-avoid gap-2">
  {#each data.result as image}
    <a href="/{image.type}/{image.id}" class="block break-inside-avoid-column pb-2">
      <img
        class="w-full rounded-lg"
        src="https://animalscdn.maxz.dev/{image.type}/{image.id}"
        alt="user uploaded {image.type}"
        loading="lazy"
      />
    </a>
  {/each}
</div>
