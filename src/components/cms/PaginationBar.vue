<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'

const props = defineProps<{ page: number; pageSize: number; total: number }>()
const emit = defineEmits<{ 'update:page': [page: number] }>()

const pages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const from = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1))
const to = computed(() => Math.min(props.total, props.page * props.pageSize))
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3">
    <p class="text-sm text-gray-500 dark:text-gray-400">{{ from }}–{{ to }} of {{ total }}</p>
    <div class="flex items-center gap-2">
      <Button variant="outline" size="sm" :disabled="page <= 1" @click="emit('update:page', page - 1)">
        Previous
      </Button>
      <span class="text-sm text-gray-700 dark:text-gray-300">{{ page }} / {{ pages }}</span>
      <Button variant="outline" size="sm" :disabled="page >= pages" @click="emit('update:page', page + 1)">
        Next
      </Button>
    </div>
  </div>
</template>
