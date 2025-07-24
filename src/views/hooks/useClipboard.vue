<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useClipboard } from '@/hooks/web/useClipboard'
import { ElInput } from 'element-plus'
import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const { copy, copied, text, isSupported } = useClipboard()

const source = ref('')
</script>

<template>
  <ContentWrap title="useClipboard">
    <ElInput v-model="source" :placeholder="t('common.pleaseEnterTheContentToBeCopied')" />
    <div v-if="isSupported">
      <BaseButton @click="copy(source)" type="primary" class="mt-20px">
        <span v-if="!copied">{{ t('common.copy') }}</span>
        <span v-else>{{ t('common.copied') }}</span>
      </BaseButton>
      <p>
        {{ t('common.currentCopied') }}: <code>{{ text || 'none' }}</code>
      </p>
    </div>
    <p v-else> {{ t('common.yourBrowserDoesNotSupportClipboardAPI') }} </p>
  </ContentWrap>
</template>
