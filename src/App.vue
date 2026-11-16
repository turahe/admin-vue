<template>
  <ConfigProvider :dir="dir">
    <ThemeProvider>
      <SidebarProvider>
        <RouterView />
        <ToastHost />
        <ConfirmHost />
      </SidebarProvider>
    </ThemeProvider>
  </ConfigProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ConfigProvider } from 'reka-ui'
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'
import ConfirmHost from './components/cms/ConfirmHost.vue'
import ToastHost from './components/cms/ToastHost.vue'
import { useRTL } from './composables/useRTL'

// reka-ui popper wrappers (dropdowns, popovers, tooltips, selects) read their direction from here;
// without it they stay `ltr` and floating-ui aligns them as if the page was left-to-right.
const { isRtl } = useRTL()
const dir = computed(() => (isRtl.value ? 'rtl' : 'ltr'))
</script>
