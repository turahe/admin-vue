<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Sidebar, SidebarContent, useSidebar } from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/auth'
import { cmsNavItems, othersItems, visibleNav } from './data'
import AppSidebarHeader from './SidebarHeader.vue'
import SidebarNavGroup from './SidebarNavGroup.vue'
import SidebarWidget from './SidebarWidget.vue'
import type { MenuType, NavItem } from './types'

const route = useRoute()
const { open, isMobile, isHovered } = useSidebar()
const { t } = useI18n()
const auth = useAuthStore()

const menuSections = computed(() => [
  {
    type: 'main' as const,
    label: t('nav.menu'),
    items: visibleNav(cmsNavItems(t), auth.can, auth.signedIn),
  },
  { type: 'others' as const, label: t('nav.template'), items: othersItems },
])

const findMatchingSubmenu = (path: string) => {
  for (const section of menuSections.value) {
    for (let index = 0; index < section.items.length; index++) {
      const nav: NavItem | undefined = section.items[index]
      if (nav?.subItems?.some((subItem) => subItem.path === path)) {
        return { type: section.type, index }
      }
    }
  }
  return null
}

const pathname = computed(() => route.path)
const showContent = computed(() => open.value || isHovered.value || isMobile.value)
const openSubmenu = ref<{ type: MenuType; index: number } | null>(null)

watch(
  pathname,
  (path) => {
    openSubmenu.value = findMatchingSubmenu(path)
  },
  { immediate: true },
)

const handleSubmenuToggle = (index: number, menuType: MenuType) => {
  const prevOpenSubmenu = openSubmenu.value
  if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
    openSubmenu.value = null
    return
  }
  openSubmenu.value = { type: menuType, index }
}
</script>

<template>
  <Sidebar side="left" collapsible="icon">
    <AppSidebarHeader :show-content="showContent" />

    <SidebarContent class="overflow-y-auto px-5 duration-300 ease-linear">
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <SidebarNavGroup
            v-for="section in menuSections"
            :key="section.type"
            :label="section.label"
            :menu-type="section.type"
            :items="section.items"
            :open-submenu="openSubmenu"
            :show-content="showContent"
            :pathname="pathname"
            @toggle-submenu="handleSubmenuToggle"
          />
        </div>
      </nav>
      <SidebarWidget v-if="showContent" />
    </SidebarContent>
  </Sidebar>
</template>
