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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { errorMessage } from '@/api/errors'
import { createTag, deleteTag, listTags, updateTag, type TagRow } from '@/services/taxonomy'
import { useConfirmStore, useToastStore } from '@/stores/feedback'
import { slugify } from '@/utils/slug'

const toast = useToastStore()
const confirm = useConfirmStore()
const loading = ref(true)
const error = ref('')
const rows = ref<TagRow[]>([])
const open = ref(false)
const editing = ref('')
const search = ref('')

const schema = toTypedSchema(
  object({
    name: string().required('Name is required'),
    slug: string().required('Slug is required'),
    description: string().default(''),
  }),
)
const { handleSubmit, errors, defineField, resetForm } = useForm({ validationSchema: schema })
const [name] = defineField('name')
const [slug] = defineField('slug')
const [description] = defineField('description')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const all = await listTags()
    const query = search.value.toLowerCase()
    rows.value = query ? all.filter((tag) => `${tag.name} ${tag.slug}`.toLowerCase().includes(query)) : all
  } catch (caught) {
    error.value = errorMessage(caught)
  } finally {
    loading.value = false
  }
}

void load()

function startCreate() {
  editing.value = ''
  resetForm({ values: { name: '', slug: '', description: '' } })
  open.value = true
}

function startEdit(row: TagRow) {
  editing.value = row.id
  resetForm({ values: { name: row.name, slug: row.slug, description: row.description } })
  open.value = true
}

const save = handleSubmit(async (values) => {
  try {
    if (editing.value) await updateTag(editing.value, values)
    else await createTag(values)
    open.value = false
    toast.push('Tag saved.')
    await load()
  } catch (caught) {
    toast.push(errorMessage(caught), 'error')
  }
})

async function remove(row: TagRow) {
  const ok = await confirm.ask('Delete tag', `Delete “${row.name}”?`)
  if (!ok) return
  try {
    await deleteTag(row.id)
    toast.push('Tag deleted.')
    await load()
  } catch (caught) {
    toast.push(errorMessage(caught), 'error')
  }
}
</script>

<template>
  <PageBreadcrumb page-title="Tags" />
  <form class="mb-4 flex flex-wrap gap-2" @submit.prevent="load">
    <Input v-model="search" placeholder="Search tags" class="max-w-sm" />
    <Button type="submit" variant="outline">Search</Button>
    <Button type="button" class="ms-auto" @click="startCreate">New tag</Button>
  </form>
  <SkeletonRows v-if="loading" />
  <div v-else-if="error" class="space-y-3">
    <p class="text-sm text-error-600">{{ error }}</p>
    <Button variant="outline" @click="load">Try again</Button>
  </div>
  <EmptyState v-else-if="!rows.length" title="No tags" description="Tags help readers find related stories.">
    <Button @click="startCreate">New tag</Button>
  </EmptyState>
  <div v-else class="overflow-x-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
    <table class="min-w-full text-sm">
      <thead class="border-b border-gray-200 text-gray-500 dark:border-gray-800">
        <tr>
          <th class="p-3 text-start font-medium">Name</th>
          <th class="p-3 text-start font-medium">Slug</th>
          <th class="p-3 text-start font-medium">Description</th>
          <th class="p-3 text-start font-medium">Posts</th>
          <th class="p-3 text-start font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id" class="border-b border-gray-100 dark:border-gray-800">
          <td class="p-3">{{ row.name }}</td>
          <td class="p-3 text-gray-500">{{ row.slug }}</td>
          <td class="p-3 text-gray-600 dark:text-gray-300">{{ row.description }}</td>
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
      <DialogHeader><DialogTitle>{{ editing ? 'Edit tag' : 'New tag' }}</DialogTitle></DialogHeader>
      <form class="mt-4 space-y-3" @submit.prevent="save">
        <Input v-model="name" placeholder="Name" @change="slug = slug || slugify(String(name ?? ''))" />
        <p v-if="errors.name" class="text-sm text-error-600">{{ errors.name }}</p>
        <Input v-model="slug" placeholder="Slug" />
        <p v-if="errors.slug" class="text-sm text-error-600">{{ errors.slug }}</p>
        <textarea v-model="description" rows="3" placeholder="Description" class="w-full rounded-[10px] border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
        <DialogFooter class="flex justify-end gap-2">
          <Button type="button" variant="outline" @click="open = false">Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
