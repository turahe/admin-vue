<script setup lang="ts">
defineProps<{ title: string; url: string; description: string }>()
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
    <p class="text-xs text-gray-500 dark:text-gray-400">Search preview</p>
    <p class="mt-2 truncate text-base text-brand-600 dark:text-brand-400">{{ title || 'Untitled page' }}</p>
    <p class="truncate text-sm text-success-600 dark:text-success-400">{{ url || 'https://example.com' }}</p>
    <p class="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
      {{ description || 'Add a meta description so this result explains the page.' }}
    </p>
  </div>
</template>
