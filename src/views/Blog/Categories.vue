<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import EmptyState from '@/components/cms/EmptyState.vue'
import SkeletonRows from '@/components/cms/SkeletonRows.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { errorMessage } from '@/api/errors'
import { createCategory, deleteCategory, listCategories, updateCategory, type CategoryRow } from '@/services/taxonomy'
import { useConfirmStore, useToastStore } from '@/stores/feedback'
import { slugify } from '@/utils/slug'

const toast = useToastStore()
const confirm = useConfirmStore()
const loading = ref(true)
const error = ref('')
const rows = ref<CategoryRow[]>([])
const open = ref(false)
const editing = ref('')

const schema = toTypedSchema(
  object({
    name: string().required('Name is required'),
    slug: string().required('Slug is required'),
    description: string().default(''),
    parentId: string().default(''),
    imageUrl: string().default(''),
  }),
)

const { handleSubmit, errors, defineField, resetForm } = useForm({ validationSchema: schema })
const [name] = defineField('name')
const [slug] = defineField('slug')
const [description] = defineField('description')
const [parentId] = defineField('parentId')
const [imageUrl] = defineField('imageUrl')

async function load() {
  loading.value = true
  error.value = ''
  try {
    rows.value = await listCategories()
  } catch (caught) {
    error.value = errorMessage(caught)
  } finally {
    loading.value = false
  }
}

void load()

function startCreate() {
  editing.value = ''
  resetForm({ values: { name: '', slug: '', description: '', parentId: '', imageUrl: '' } })
  open.value = true
}

function startEdit(row: CategoryRow) {
  editing.value = row.id
  resetForm({
    values: {
      name: row.name,
      slug: row.slug,
      description: row.description,
      parentId: row.parentId,
      imageUrl: row.imageUrl,
    },
  })
  open.value = true
}

const save = handleSubmit(async (values) => {
  try {
    if (editing.value) await updateCategory(editing.value, values)
    else await createCategory(values)
    open.value = false
    toast.push('Category saved.')
    await load()
  } catch (caught) {
    toast.push(errorMessage(caught), 'error')
  }
})

async function remove(row: CategoryRow) {
  const ok = await confirm.ask('Delete category', `Delete “${row.name}”? Posts in it will be uncategorized.`)
  if (!ok) return
  try {
    await deleteCategory(row.id)
    toast.push('Category deleted.')
    await load()
  } catch (caught) {
    toast.push(errorMessage(caught), 'error')
  }
}

function parentName(id: string) {
  return rows.value.find((row) => row.id === id)?.name ?? '—'
}
</script>

<template>
  <PageBreadcrumb page-title="Categories" />
  <div class="mb-4 flex justify-between gap-3">
    <p class="text-sm text-gray-500 dark:text-gray-400">Hierarchical categories for the newsroom.</p>
    <Button @click="startCreate">New category</Button>
  </div>
  <SkeletonRows v-if="loading" />
  <div v-else-if="error" class="space-y-3">
    <p class="text-sm text-error-600">{{ error }}</p>
    <Button variant="outline" @click="load">Try again</Button>
  </div>
  <EmptyState v-else-if="!rows.length" title="No categories" description="Create the first category.">
    <Button @click="startCreate">New category</Button>
  </EmptyState>
  <div v-else class="overflow-x-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
    <table class="min-w-full text-sm">
      <thead class="border-b border-gray-200 text-gray-500 dark:border-gray-800">
        <tr>
          <th class="p-3 text-start font-medium">Name</th>
          <th class="p-3 text-start font-medium">Slug</th>
          <th class="p-3 text-start font-medium">Parent</th>
          <th class="p-3 text-start font-medium">Posts</th>
          <th class="p-3 text-start font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id" class="border-b border-gray-100 dark:border-gray-800">
          <td class="p-3" :class="row.parentId ? 'ps-8' : ''">{{ row.name }}</td>
          <td class="p-3 text-gray-500">{{ row.slug }}</td>
          <td class="p-3">{{ row.parentId ? parentName(row.parentId) : '—' }}</td>
          <td class="p-3">{{ row.postCount }}</td>
          <td class="p-3">
            <div class="flex gap-2">
              <Button size="xs" variant="outline" @click="startEdit(row)">Edit</Button>
              <Button size="xs" variant="destructive" @click="remove(row)">Delete</Button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <Dialog v-model:open="open">
    <DialogContent class="max-w-lg p-6">
      <DialogHeader>
        <DialogTitle>{{ editing ? 'Edit category' : 'New category' }}</DialogTitle>
      </DialogHeader>
      <form class="mt-4 space-y-3" @submit.prevent="save">
        <Input v-model="name" placeholder="Name" @change="slug = slug || slugify(String(name ?? ''))" />
        <p v-if="errors.name" class="text-sm text-error-600">{{ errors.name }}</p>
        <Input v-model="slug" placeholder="Slug" />
        <p v-if="errors.slug" class="text-sm text-error-600">{{ errors.slug }}</p>
        <textarea v-model="description" rows="3" placeholder="Description" class="w-full rounded-[10px] border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
        <select v-model="parentId" class="h-11 w-full rounded-[10px] border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
          <option value="">No parent</option>
          <option v-for="row in rows.filter((item) => item.id !== editing)" :key="row.id" :value="row.id">{{ row.name }}</option>
        </select>
        <Input v-model="imageUrl" placeholder="Image URL" />
        <DialogFooter class="flex justify-end gap-2">
          <Button type="button" variant="outline" @click="open = false">Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
