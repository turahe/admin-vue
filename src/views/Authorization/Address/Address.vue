<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ref, unref, nextTick, watch, reactive } from 'vue'
import { ElTree, ElInput, ElDivider } from 'element-plus'
import {
  getAddressesByEntityApi,
  getPrimaryAddressApi,
  getAddressesByTypeApi,
  createAddressApi,
  searchAddressesByCityApi,
  searchAddressesByCountryApi,
  searchAddressesByPostalCodeApi,
  searchAddressesByStateApi,
  getAddressByIdApi,
  updateAddressApi,
  deleteAddressApi,
  setAddressAsPrimaryApi,
  setAddressTypeApi
} from '@/api/address'
import type { Address, CreateAddressRequest, UpdateAddressRequest } from '@/api/address/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { BaseButton } from '@/components/Button'

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await getAddressesByEntityApi({
      entity_type: 'user',
      entity_id: '1',
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    })
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  },
  fetchDelApi: async () => {
    const res = await deleteAddressApi(unref(ids))
    return !!res
  }
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'selection',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'selection'
    }
  },
  {
    field: 'index',
    label: 'Index',
    form: {
      hidden: true
    },
    search: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'index'
    }
  },
  {
    field: 'address_line_1',
    label: 'Address Line 1',
    form: {
      component: 'Input'
    },
    search: {
      component: 'Input'
    }
  },
  {
    field: 'address_line_2',
    label: 'Address Line 2',
    form: {
      component: 'Input'
    },
    search: {
      hidden: true
    }
  },
  {
    field: 'city',
    label: 'City',
    form: {
      component: 'Input'
    },
    search: {
      component: 'Input'
    }
  },
  {
    field: 'state',
    label: 'State/Province',
    form: {
      component: 'Input'
    },
    search: {
      component: 'Input'
    }
  },
  {
    field: 'postal_code',
    label: 'Postal Code',
    form: {
      component: 'Input'
    },
    search: {
      component: 'Input'
    }
  },
  {
    field: 'country',
    label: 'Country',
    form: {
      component: 'Input'
    },
    search: {
      component: 'Input'
    }
  },
  {
    field: 'address_type',
    label: 'Address Type',
    form: {
      component: 'Select',
      componentProps: {
        options: [
          { label: 'Home', value: 'home' },
          { label: 'Work', value: 'work' },
          { label: 'Billing', value: 'billing' },
          { label: 'Shipping', value: 'shipping' }
        ]
      }
    },
    search: {
      component: 'Select',
      componentProps: {
        options: [
          { label: 'All', value: '' },
          { label: 'Home', value: 'home' },
          { label: 'Work', value: 'work' },
          { label: 'Billing', value: 'billing' },
          { label: 'Shipping', value: 'shipping' }
        ]
      }
    }
  },
  {
    field: 'is_primary',
    label: 'Primary',
    form: {
      component: 'Switch'
    },
    search: {
      hidden: true
    },
    table: {
      type: 'switch'
    }
  },
  {
    field: 'action',
    label: 'Action',
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    search: {
      hidden: true
    },
    table: {
      width: 240,
      slots: {
        default: (data: any) => {
          const row = data.row as Address
          return (
            <>
              <BaseButton type="primary" onClick={() => action(row, 'edit')}>
                {t('exampleDemo.edit')}
              </BaseButton>
              <BaseButton type="success" onClick={() => action(row, 'detail')}>
                {t('exampleDemo.detail')}
              </BaseButton>
              <BaseButton type="danger" onClick={() => delData(row)}>
                {t('exampleDemo.del')}
              </BaseButton>
            </>
          )
        }
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<Address>()
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
}

const delLoading = ref(false)
const ids = ref<string[]>([])

const delData = async (row?: Address) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row ? [row.id] : elTableExpose?.getSelectionRows().map((v: Address) => v.id) || []
  delLoading.value = true

  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const action = (row: Address, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = { ...row }
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    try {
      let res
      if (actionType.value === 'edit' && currentRow.value?.id) {
        res = await updateAddressApi(currentRow.value.id, formData as UpdateAddressRequest)
      } else {
        res = await createAddressApi(formData as CreateAddressRequest)
      }
      if (res) {
        currentPage.value = 1
        getList()
      }
    } catch (error) {
      console.log(error)
    } finally {
      saveLoading.value = false
      dialogVisible.value = false
    }
  }
}
</script>

<template>
  <div class="flex w-100% h-100%">
    <ContentWrap class="flex-1">
      <Search
        :schema="allSchemas.searchSchema"
        @reset="setSearchParams"
        @search="setSearchParams"
      />

      <div class="mb-10px">
        <BaseButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</BaseButton>
        <BaseButton :loading="delLoading" type="danger" @click="delData()">
          {{ t('exampleDemo.del') }}
        </BaseButton>
      </div>
      <Table
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :columns="allSchemas.tableColumns"
        :data="dataList"
        :loading="loading"
        @register="tableRegister"
        :pagination="{
          total
        }"
      />
    </ContentWrap>

    <Dialog v-model="dialogVisible" :title="dialogTitle">
      <Write
        v-if="actionType !== 'detail'"
        ref="writeRef"
        :form-schema="allSchemas.formSchema"
        :current-row="currentRow"
      />

      <Detail
        v-if="actionType === 'detail'"
        :detail-schema="allSchemas.detailSchema"
        :current-row="currentRow"
      />

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
  </div>
</template>
