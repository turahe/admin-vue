import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

async function mountBreadcrumb(pageTitle: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }],
  })
  router.push('/')
  await router.isReady()

  return mount(PageBreadcrumb, {
    props: { pageTitle },
    global: { plugins: [router] },
  })
}

describe('PageBreadcrumb', () => {
  it('shows the current page and a link back home', async () => {
    const wrapper = await mountBreadcrumb('Form Elements')

    expect(wrapper.get('h2').text()).toBe('Form Elements')
    expect(wrapper.text()).toContain('Form Elements')

    const home = wrapper.get('a')
    expect(home.text()).toContain('Home')
    expect(home.attributes('href')).toBe('/')
  })
})