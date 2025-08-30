<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useNetwork } from '@/hooks/web/useNetwork'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const { online } = useNetwork()
</script>

<template>
  <ContentWrap title="useNetwork">
    {{ t('common.currentNetworkStatus') }}:
    <code>{{ online ? t(' ') : t('common.disconnected') }}</code>
  </ContentWrap>
</template>
