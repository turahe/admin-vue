<script setup lang="ts">
import { Descriptions } from '@/components/Descriptions'
import type { DescriptionsSchema } from '@/hooks/web/useDescriptions'
import type { Organization } from '@/api/organization/types'

const { descriptionsRegister } = useDescriptions()

const props = defineProps<{
  detailSchema: DescriptionsSchema[]
  currentRow?: Organization
}>()
</script>

<template>
  <Descriptions
    :descriptions-schema="detailSchema"
    :data="currentRow"
    @register="descriptionsRegister"
  />
</template>
