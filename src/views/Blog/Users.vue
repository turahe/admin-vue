<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import EmptyState from '@/components/cms/EmptyState.vue'
import SkeletonRows from '@/components/cms/SkeletonRows.vue'
import StatusBadge from '@/components/cms/StatusBadge.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { errorMessage } from '@/api/errors'
import { createUser, deleteUser, listUsers, updateUser } from '@/services/users'
import { useAuthStore } from '@/stores/auth'
import { useConfirmStore, useToastStore } from '@/stores/feedback'
import { getInitials } from '@/utils/get-initials'
import { formatDate } from '@/utils/format'
import { userRoles, userStatuses, type User, type UserRole, type UserStatus } from '@/types/cms'

const auth = useAuthStore()
const toast = useToastStore()
const confirm = useConfirmStore()
const loading = ref(true)
const error = ref('')
const rows = ref<User[]>([])
const open = ref(false)
const editing = ref('')

const schema = toTypedSchema(
  object({
    name: string().required('Name is required'),
    email: string().email('Enter a valid email').required('Email is required'),
    role: string().oneOf([...userRoles]).required(),
    status: string().oneOf([...userStatuses]).required(),
    password: string().test('length', 'Password must be at least 12 characters', (value) => {
      if (editing.value && !value) return true
      return (value ?? '').length >= 12
    }),
  }),
)

const { handleSubmit, errors, defineField, resetForm } = useForm({ validationSchema: schema })
const [name] = defineField('name')
const [email] = defineField('email')
const [role] = defineField('role')
const [status] = defineField('status')
const [password] = defineField('password')

async function load() {
  loading.value = true
  error.value = ''
  try {
    rows.value = await listUsers()
  } catch (caught) {
    error.value = errorMessage(caught)
  } finally {
    loading.value = false
  }
}

void load()

function startCreate() {
  editing.value = ''
  resetForm({ values: { name: '', email: '', role: 'author', status: 'invited', password: '' } })
  open.value = true
}

function startEdit(user: User) {
  editing.value = user.id
  resetForm({ values: { name: user.name, email: user.email, role: user.role, status: user.status, password: '' } })
  open.value = true
}

const save = handleSubmit(async (values) => {
  const input = {
    name: values.name,
    email: values.email,
    role: values.role as UserRole,
    status: values.status as UserStatus,
    password: values.password ?? '',
  }
  try {
    if (editing.value) await updateUser(editing.value, input)
    else await createUser(input)
    open.value = false
    toast.push('User saved.')
    await load()
    if (editing.value && editing.value === auth.user?.id) await auth.refresh()
  } catch (caught) {
    toast.push(errorMessage(caught), 'error')
  }
})

async function remove(user: User) {
  const ok = await confirm.ask('Delete user', `Delete ${user.email}?`)
  if (!ok) return
  try {
    await deleteUser(user.id)
    toast.push('User deleted.')
    await load()
  } catch (caught) {
    toast.push(errorMessage(caught), 'error')
  }
}
</script>

<template>
  <PageBreadcrumb page-title="Users" />
  <div class="mb-4 flex justify-end">
    <Button @click="startCreate">New user</Button>
  </div>
  <SkeletonRows v-if="loading" />
  <div v-else-if="error" class="space-y-3">
    <p class="text-sm text-error-600">{{ error }}</p>
    <Button variant="outline" @click="load">Try again</Button>
  </div>
  <EmptyState v-else-if="!rows.length" title="No users" />
  <div v-else class="overflow-x-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
    <table class="min-w-full text-sm">
      <thead class="border-b border-gray-200 text-gray-500 dark:border-gray-800">
        <tr>
          <th class="p-3 text-start">User</th>
          <th class="p-3 text-start">Role</th>
          <th class="p-3 text-start">Status</th>
          <th class="p-3 text-start">Last login</th>
          <th class="p-3 text-start">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in rows" :key="user.id" class="border-b border-gray-100 dark:border-gray-800">
          <td class="p-3">
            <div class="flex items-center gap-3">
              <span class="flex size-10 items-center justify-center rounded-full bg-brand-50 text-sm font-medium text-brand-600 dark:bg-brand-500/15">
                {{ getInitials(user.name) }}
              </span>
              <span>
                <span class="block font-medium text-gray-800 dark:text-white/90">{{ user.name }}</span>
                <span class="block text-xs text-gray-500">{{ user.email }}</span>
              </span>
            </div>
          </td>
          <td class="p-3 capitalize">{{ user.role.replaceAll('_', ' ') }}</td>
          <td class="p-3"><StatusBadge :status="user.status" /></td>
          <td class="p-3">{{ formatDate(user.lastLoginAt) }}</td>
          <td class="p-3">
            <div class="flex gap-2">
              <Button size="xs" variant="outline" @click="startEdit(user)">Edit</Button>
              <Button size="xs" variant="destructive" @click="remove(user)">Delete</Button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <Dialog v-model:open="open">
    <DialogContent class="max-w-lg p-6">
      <DialogHeader><DialogTitle>{{ editing ? 'Edit user' : 'New user' }}</DialogTitle></DialogHeader>
      <form class="mt-4 space-y-3" @submit.prevent="save">
        <Input v-model="name" placeholder="Name" />
        <p v-if="errors.name" class="text-sm text-error-600">{{ errors.name }}</p>
        <Input v-model="email" type="email" placeholder="Email" :disabled="Boolean(editing)" />
        <p v-if="errors.email" class="text-sm text-error-600">{{ errors.email }}</p>
        <select v-model="role" class="h-11 w-full rounded-[10px] border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
          <option v-for="item in userRoles" :key="item" :value="item">{{ item.replaceAll('_', ' ') }}</option>
        </select>
        <select v-model="status" class="h-11 w-full rounded-[10px] border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
          <option v-for="item in userStatuses" :key="item" :value="item">{{ item }}</option>
        </select>
        <Input v-model="password" type="password" :placeholder="editing ? 'New password (optional)' : 'Password'" />
        <p v-if="errors.password" class="text-sm text-error-600">{{ errors.password }}</p>
        <DialogFooter class="flex justify-end gap-2">
          <Button type="button" variant="outline" @click="open = false">Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
