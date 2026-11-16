<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>

<template>
  <div class="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center dark:border-gray-700">
    <h3 class="text-base font-medium text-gray-800 dark:text-white/90">{{ title }}</h3>
    <p v-if="description" class="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
      {{ description }}
    </p>
    <div v-if="$slots.default" class="mt-4 flex justify-center">
      <slot />
    </div>
  </div>
</template>
