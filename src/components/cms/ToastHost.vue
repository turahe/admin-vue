<script setup lang="ts">
import { useToastStore } from '@/stores/feedback'

const toast = useToastStore()
</script>

<template>
  <div class="pointer-events-none fixed end-4 top-20 z-50 flex w-[min(100%-2rem,22rem)] flex-col gap-2">
    <button
      v-for="item in toast.items"
      :key="item.id"
      type="button"
      class="pointer-events-auto rounded-xl border px-4 py-3 text-start text-sm shadow-theme-md"
      :class="
        item.tone === 'error'
          ? 'border-error-200 bg-error-50 text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-300'
          : 'border-success-200 bg-success-50 text-success-700 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-300'
      "
      @click="toast.dismiss(item.id)"
    >
      {{ item.message }}
    </button>
  </div>
</template>
