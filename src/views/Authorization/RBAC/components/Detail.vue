<script setup lang="ts">
import { Descriptions } from '@/components/Descriptions'
import type { DescriptionsSchema } from '@/hooks/web/useDescriptions'
import type { Policy } from '@/api/rbac/types'

const { descriptionsRegister } = useDescriptions()

const props = defineProps<{
  detailSchema: DescriptionsSchema[]
  currentRow?: Policy
}>()
</script>

<template>
  <Descriptions
    :descriptions-schema="detailSchema"
    :data="currentRow"
    @register="descriptionsRegister"
  />
</template>
