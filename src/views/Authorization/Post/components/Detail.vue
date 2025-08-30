<script setup lang="ts">
import { Descriptions } from '@/components/Descriptions'
import type { DescriptionsSchema } from '@/hooks/web/useDescriptions'
import type { Post } from '@/api/post/types'

const { descriptionsRegister } = useDescriptions()

const props = defineProps<{
  detailSchema: DescriptionsSchema[]
  currentRow?: Post
}>()
</script>

<template>
  <Descriptions
    :descriptions-schema="detailSchema"
    :data="currentRow"
    @register="descriptionsRegister"
  />
</template>
