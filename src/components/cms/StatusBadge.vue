<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'

const props = defineProps<{ status: string }>()

const color = computed(() => {
  if (props.status === 'published' || props.status === 'approved' || props.status === 'active') return 'success'
  if (props.status === 'pending' || props.status === 'scheduled' || props.status === 'invited') return 'warning'
  if (props.status === 'spam' || props.status === 'suspended' || props.status === 'trash') return 'error'
  return 'gray'
})

const label = computed(() => props.status.replaceAll('_', ' '))
</script>

<template>
  <Badge variant="light" :color="color" size="sm" class="capitalize">{{ label }}</Badge>
</template>
