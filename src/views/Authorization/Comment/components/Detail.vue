<script setup lang="ts">
import { Descriptions } from '@/components/Descriptions'
import type { DescriptionsSchema } from '@/hooks/web/useDescriptions'
import type { Comment } from '@/api/comment/types'

const { descriptionsRegister } = useDescriptions()

const props = defineProps<{
  detailSchema: DescriptionsSchema[]
  currentRow?: Comment
}>()
</script>

<template>
  <Descriptions
    :descriptions-schema="detailSchema"
    :data="currentRow"
    @register="descriptionsRegister"
  />
</template>
