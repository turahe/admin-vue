import { describe, expect, it } from 'vitest'
import { defaultGrants } from '@/rbac/permissions'
import { slugify } from '@/utils/slug'

describe('slugify', () => {
  it('builds a url slug from a title', () => {
    expect(slugify('Morning Light on the Harbor Road')).toBe('morning-light-on-the-harbor-road')
  })

  it('drops punctuation', () => {
    expect(slugify('What readers finish?')).toBe('what-readers-finish')
  })
})

describe('default role grants', () => {
  it('lets contributors write but not publish', () => {
    expect(defaultGrants.contributor).toContain('posts.write')
    expect(defaultGrants.contributor).not.toContain('posts.publish')
  })

  it('gives subscribers only the dashboard', () => {
    expect(defaultGrants.subscriber).toEqual(['dashboard.view'])
  })
})
