<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ref, unref, nextTick, watch, reactive } from 'vue'
import { ElTree, ElInput, ElDivider } from 'element-plus'
import {
  getTaxonomiesApi,
  createTaxonomyApi,
  getTaxonomyHierarchyApi,
  getRootTaxonomiesApi,
  searchTaxonomiesApi,
  searchTaxonomiesAdvancedApi,
  getTaxonomyBySlugApi,
  getTaxonomyByIdApi,
  updateTaxonomyApi,
  deleteTaxonomyApi,
  getTaxonomyAncestorsApi,
  getTaxonomyChildrenApi,
  getTaxonomyDescendantsApi,
  getTaxonomySiblingsApi
} from '@/api/taxonomy'
import type { Taxonomy, CreateTaxonomyRequest, UpdateTaxonomyRequest } from '@/api/taxonomy/types'
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
    const res = await getTaxonomiesApi({
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
    const res = await deleteTaxonomyApi(unref(ids))
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
    field: 'name',
    label: 'Name',
    form: {
      component: 'Input'
    },
    search: {
      component: 'Input'
    }
  },
  {
    field: 'slug',
    label: 'Slug',
    form: {
      component: 'Input'
    },
    search: {
      component: 'Input'
    }
  },
  {
    field: 'description',
    label: 'Description',
    form: {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3
      }
    },
    search: {
      component: 'Input'
    }
  },
  {
    field: 'type',
    label: 'Type',
    form: {
      component: 'Select',
      componentProps: {
        options: [
          { label: 'Category', value: 'category' },
          { label: 'Tag', value: 'tag' },
          { label: 'Custom', value: 'custom' }
        ]
      }
    },
    search: {
      component: 'Select',
      componentProps: {
        options: [
          { label: 'All', value: '' },
          { label: 'Category', value: 'category' },
          { label: 'Tag', value: 'tag' },
          { label: 'Custom', value: 'custom' }
        ]
      }
    }
  },
  {
    field: 'parent_id',
    label: 'Parent Taxonomy',
    form: {
      component: 'TreeSelect',
      componentProps: {
        nodeKey: 'id',
        props: {
          label: 'name'
        }
      },
      optionApi: async () => {
        const res = await getTaxonomyHierarchyApi()
        return res.data.hierarchy || []
      }
    },
    search: {
      hidden: true
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
          const row = data.row as Taxonomy
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

const currentRow = ref<Taxonomy>()
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
}

const delLoading = ref(false)
const ids = ref<string[]>([])

const delData = async (row?: Taxonomy) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row ? [row.id] : elTableExpose?.getSelectionRows().map((v: Taxonomy) => v.id) || []
  delLoading.value = true

  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const action = (row: Taxonomy, type: string) => {
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
        res = await updateTaxonomyApi(currentRow.value.id, formData as UpdateTaxonomyRequest)
      } else {
        res = await createTaxonomyApi(formData as CreateTaxonomyRequest)
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
