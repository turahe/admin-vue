<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useTagsView } from '@/hooks/web/useTagsView'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const { push } = useRouter()

const { closeAll, closeLeft, closeRight, closeOther, closeCurrent, refreshPage, setTitle } =
  useTagsView()

const closeAllTabs = () => {
  closeAll(() => {
    push('/dashboard/analysis')
  })
}

const closeLeftTabs = () => {
  closeLeft()
}

const closeRightTabs = () => {
  closeRight()
}

const closeOtherTabs = () => {
  closeOther()
}

const refresh = () => {
  refreshPage()
}

const closeCurrentTab = () => {
  closeCurrent(undefined, () => {
    push('/dashboard/analysis')
  })
}

const setTabTitle = () => {
  setTitle(new Date().getTime().toString())
}

const setAnalysisTitle = () => {
  setTitle(`分析页-${new Date().getTime().toString()}`, '/dashboard/analysis')
}
</script>

<template>
  <ContentWrap title="useTagsView">
    <BaseButton type="primary" @click="closeAllTabs"> {{ t('common.closeAllTabs') }} </BaseButton>
    <BaseButton type="primary" @click="closeLeftTabs"> {{ t('common.closeLeftTabs') }} </BaseButton>
    <BaseButton type="primary" @click="closeRightTabs">
      {{ t('common.closeRightTabs') }}
    </BaseButton>
    <BaseButton type="primary" @click="closeOtherTabs">
      {{ t('common.closeOtherTabs') }}
    </BaseButton>
    <BaseButton type="primary" @click="closeCurrentTab">
      {{ t('common.closeCurrentTab') }}
    </BaseButton>
    <BaseButton type="primary" @click="refresh"> {{ t('common.refreshCurrentTab') }} </BaseButton>
    <BaseButton type="primary" @click="setTabTitle">
      {{ t('common.modifyCurrentTitle') }}
    </BaseButton>
    <BaseButton type="primary" @click="setAnalysisTitle">
      {{ t('common.modifyAnalysisPageTitle') }}
    </BaseButton>
  </ContentWrap>
</template>
