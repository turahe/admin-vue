<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import {
  getRoleListApi,
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
  deleteRoleByIdApi,
  updateRoleStatusApi
} from '@/api/role'
import type { RoleCreateRequest, RoleUpdateRequest } from '@/api/role'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ElTag, ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res: any = await getRoleListApi()
    // Handle different response structures
    const data = res.data || res.list || []
    const total = res.meta?.total || res.total || data.length
    return {
      list: data,
      total
    }
  }
})

const { dataList, loading, total } = tableState
const { getList } = tableMethods

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'name',
    label: t('role.roleName')
  },
  {
    field: 'key',
    label: 'Role Key'
  },
  {
    field: 'status',
    label: t('menu.status'),
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElTag type={data.row.status === 'inactive' ? 'danger' : 'success'}>
              {data.row.status === 'active' ? t('userDemo.enable') : t('userDemo.disable')}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'created_at',
    label: t('tableDemo.displayTime')
  },
  {
    field: 'description',
    label: t('userDemo.remark')
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: 280,
    slots: {
      default: (data: any) => {
        const row = data.row
        return (
          <>
            <BaseButton type="primary" onClick={() => action(row, 'edit')}>
              {t('exampleDemo.edit')}
            </BaseButton>
            <BaseButton type="success" onClick={() => action(row, 'detail')}>
              {t('exampleDemo.detail')}
            </BaseButton>
            <BaseButton
              type={row.status === 'active' ? 'warning' : 'success'}
              onClick={() => toggleStatus(row)}
            >
              {row.status === 'active' ? 'Deactivate' : 'Activate'}
            </BaseButton>
            <BaseButton type="danger" onClick={() => handleDelete(row)}>
              {t('exampleDemo.del')}
            </BaseButton>
          </>
        )
      }
    }
  }
])

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: t('role.roleName'),
    component: 'Input'
  },
  {
    field: 'status',
    label: 'Status',
    component: 'Select',
    componentProps: {
      options: [
        { label: 'All', value: '' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]
    }
  }
])

const searchParams = ref({})
const setSearchParams = (data: any) => {
  searchParams.value = data
  getList()
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref()
const actionType = ref('')

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const action = (row: any, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
}

const save = async () => {
  const write = unref(writeRef)
  const formData: any = await write?.submit()
  if (formData) {
    saveLoading.value = true
    try {
      if (actionType.value === 'edit') {
        await updateRoleApi(currentRow.value.id, formData)
        ElMessage.success('Role updated successfully')
      } else {
        await createRoleApi(formData)
        ElMessage.success('Role created successfully')
      }
      dialogVisible.value = false
      getList()
    } catch (error: any) {
      ElMessage.error(error?.message || 'Operation failed')
    } finally {
      saveLoading.value = false
    }
  }
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete the role "${row.name}"?`,
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )

    await deleteRoleByIdApi(row.id)
    ElMessage.success('Role deleted successfully')
    getList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error?.message || 'Delete failed')
    }
  }
}

const toggleStatus = async (row: any) => {
  try {
    const newStatus = row.status === 'active' ? 'inactive' : 'active'
    await updateRoleStatusApi(row.id, newStatus)
    ElMessage.success(`Role ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
    getList()
  } catch (error: any) {
    ElMessage.error(error?.message || 'Status update failed')
  }
}
</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />
    <div class="mb-10px">
      <BaseButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</BaseButton>
    </div>
    <Table
      :columns="tableColumns"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total
      }"
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :current-row="currentRow" />
    <Detail v-else :current-row="currentRow" />

    <template #footer>
      <BaseButton
        v-if="actionType !== 'detail'"
        type="primary"
        :loading="saveLoading"
        @click="save"
      >
        {{ t('exampleDemo.save') }}
      </BaseButton>
      <BaseButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
    </template>
  </Dialog>
</template>
