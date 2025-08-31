<script setup lang="tsx">
import { PropType, ref, unref, nextTick } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { ElTag, ElTree } from 'element-plus'
import { findIndex } from '@/utils'
import { getMenuApi } from '@/api/menu'

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => undefined
  }
})

const filterPermissionName = (value: string) => {
  const index = findIndex(unref(currentTreeData)?.permissionList || [], (item) => {
    return item.value === value
  })
  return (unref(currentTreeData)?.permissionList || [])[index]?.label ?? ''
}

const renderTag = (enable?: boolean) => {
  return <ElTag type={!enable ? 'danger' : 'success'}>{enable ? 'Active' : 'Inactive'}</ElTag>
}

const treeRef = ref<typeof ElTree>()

const currentTreeData = ref()
const nodeClick = (treeData: any) => {
  currentTreeData.value = treeData
}

const treeData = ref<any[]>([])
const getMenuList = async () => {
  try {
    const res: any = await getMenuApi()
    if (res) {
      treeData.value = res.data || res.list || []
      await nextTick()
    }
  } catch (error) {
    console.error('Failed to load menu data:', error)
  }
}
getMenuList()

const detailSchema = ref<DescriptionsSchema[]>([
  {
    field: 'name',
    label: 'Role Name'
  },
  {
    field: 'key',
    label: 'Role Key'
  },
  {
    field: 'status',
    label: 'Status',
    slots: {
      default: (data: any) => {
        return renderTag(data.status === 'active')
      }
    }
  },
  {
    field: 'description',
    label: 'Description',
    span: 24
  },
  {
    field: 'sort',
    label: 'Sort Order'
  },
  {
    field: 'permissionIds',
    label: 'Menu Permissions',
    span: 24,
    slots: {
      default: () => {
        return (
          <>
            <div class="flex w-full">
              <div class="flex-1">
                <ElTree
                  ref={treeRef}
                  node-key="id"
                  props={{ children: 'children', label: 'name' }}
                  highlight-current
                  expand-on-click-node={false}
                  data={treeData.value}
                  onNode-click={nodeClick}
                >
                  {{
                    default: (data) => {
                      return <span>{data?.data?.meta?.title || data?.data?.name}</span>
                    }
                  }}
                </ElTree>
              </div>
              <div class="flex-1">
                {unref(currentTreeData)
                  ? unref(currentTreeData)?.meta?.permission?.map((v: string) => {
                      return <ElTag class="ml-2 mt-2">{filterPermissionName(v)}</ElTag>
                    })
                  : null}
              </div>
            </div>
          </>
        )
      }
    }
  }
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
