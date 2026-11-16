<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/3">
      <h1 class="text-title-sm text-gray-800 dark:text-white/90">You do not have access</h1>
      <p class="mt-2 text-sm text-gray-500">This account cannot open that page.</p>
      <RouterLink to="/" class="mt-6 inline-block"><Button>Back to dashboard</Button></RouterLink>
    </div>
</template>
