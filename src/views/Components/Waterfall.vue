<script setup lang="ts">
import { Waterfall } from '@/components/Waterfall'
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref } from 'vue'
import { toAnyString } from '@/utils'

const data = ref<any>([])

/**
 * Generate random integer between min and max (inclusive)
 */
const randomInteger = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generate placeholder image URL
 */
const generateImageUrl = (width: number, height: number): string => {
  return `https://picsum.photos/${width}/${height}?random=${Math.random()}`
}

const getList = () => {
  const list: any = []
  for (let i = 0; i < 20; i++) {
    // Generate random dimensions between 100 and 500
    const height = randomInteger(100, 500)
    const width = randomInteger(100, 500)
    list.push({
      width,
      height,
      id: toAnyString(),
      image_uri: generateImageUrl(width, height)
    })
  }
  data.value = [...unref(data), ...list]
  if (unref(data).length >= 60) {
    end.value = true
  }
}
getList()

const { t } = useI18n()

const loading = ref(false)

const end = ref(false)

const loadMore = () => {
  loading.value = true
  setTimeout(() => {
    getList()
    loading.value = false
  }, 1000)
}
</script>

<template>
  <ContentWrap :title="t('router.waterfall')">
    <Waterfall
      :data="data"
      :loading="loading"
      :end="end"
      :props="{
        src: 'image_uri',
        height: 'height'
      }"
      @load-more="loadMore"
    />
  </ContentWrap>
</template>
