<script setup lang="ts">
import { ref } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import SkeletonRows from '@/components/cms/SkeletonRows.vue'
import { Button } from '@/components/ui/button'
import { errorMessage } from '@/api/errors'
import { getRoles, saveRole, type ApiRoleGrant } from '@/services/users'
import { useToastStore } from '@/stores/feedback'

const toast = useToastStore()
const loading = ref(true)
const error = ref('')
const catalog = ref<string[]>([])
const roles = ref<ApiRoleGrant[]>([])

async function load() {
  loading.value = true
  error.value = ''
  try {
    const matrix = await getRoles()
    catalog.value = matrix.permissions
    roles.value = matrix.roles
  } catch (caught) {
    error.value = errorMessage(caught)
  } finally {
    loading.value = false
  }
}

void load()

function has(role: ApiRoleGrant, permission: string) {
  return role.permissions.includes('*') || role.permissions.includes(permission)
}

async function toggle(role: ApiRoleGrant, permission: string) {
  if (role.protected || role.permissions.includes('*')) return
  const next = role.permissions.includes(permission)
    ? role.permissions.filter((item) => item !== permission)
    : [...role.permissions, permission]
  roles.value = roles.value.map((item) => (item.name === role.name ? { ...item, permissions: next } : item))
  try {
    await saveRole(role.name, next)
    toast.push('Role updated.')
  } catch (caught) {
    toast.push(errorMessage(caught), 'error')
    await load()
  }
}
</script>

<template>
  <PageBreadcrumb page-title="Roles and permissions" />
  <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
    Permissions come from the Blog API. A protected role, including one with every permission, stays unchanged.
  </p>
  <SkeletonRows v-if="loading" />
  <div v-else-if="error" class="space-y-3">
    <p class="text-sm text-error-600">{{ error }}</p>
    <Button variant="outline" @click="load">Try again</Button>
  </div>
  <div v-else class="overflow-x-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
    <table class="min-w-full text-sm">
      <thead class="border-b border-gray-200 text-gray-500 dark:border-gray-800">
        <tr>
          <th class="p-3 text-start">Permission</th>
          <th v-for="role in roles" :key="role.name" class="p-3 text-start capitalize">{{ role.name.replaceAll('_', ' ') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="permission in catalog" :key="permission" class="border-b border-gray-100 dark:border-gray-800">
          <td class="p-3 font-medium text-gray-800 dark:text-white/90">{{ permission }}</td>
          <td v-for="role in roles" :key="role.name" class="p-3">
            <input
              type="checkbox"
              :checked="has(role, permission)"
              :disabled="role.protected || role.permissions.includes('*')"
              @change="toggle(role, permission)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
