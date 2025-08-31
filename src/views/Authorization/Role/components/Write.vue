<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, unref, nextTick } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTree, ElCheckboxGroup, ElCheckbox } from 'element-plus'
import { getMenuApi } from '@/api/menu'
import { filter, eachTree } from '@/utils/tree'
import { findIndex } from '@/utils'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const treeRef = ref<typeof ElTree>()

const formSchema = ref<FormSchema[]>([
  {
    field: 'name',
    label: t('role.roleName'),
    component: 'Input',
    componentProps: {
      placeholder: 'Enter role name'
    }
  },
  {
    field: 'key',
    label: 'Role Key',
    component: 'Input',
    componentProps: {
      placeholder: 'Enter role key (e.g., admin, user)'
    }
  },
  {
    field: 'description',
    label: 'Description',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      placeholder: 'Enter role description'
    }
  },
  {
    field: 'status',
    label: t('menu.status'),
    component: 'Select',
    value: 'active',
    componentProps: {
      options: [
        {
          label: t('userDemo.enable'),
          value: 'active'
        },
        {
          label: t('userDemo.disable'),
          value: 'inactive'
        }
      ]
    }
  },
  {
    field: 'sort',
    label: 'Sort Order',
    component: 'InputNumber',
    value: 0,
    componentProps: {
      placeholder: 'Enter sort order'
    }
  },
  {
    field: 'permissionIds',
    label: t('role.menu'),
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex w-full">
                <div class="flex-1">
                  <ElTree
                    ref={treeRef}
                    show-checkbox
                    node-key="id"
                    highlight-current
                    check-strictly
                    expand-on-click-node={false}
                    data={treeData.value}
                    onNode-click={nodeClick}
                  >
                    {{
                      default: (data) => {
                        return <span>{data.data.meta?.title || data.data.name}</span>
                      }
                    }}
                  </ElTree>
                </div>
                <div class="flex-1">
                  {unref(currentTreeData) && unref(currentTreeData)?.permissionList ? (
                    <ElCheckboxGroup v-model={unref(currentTreeData).meta.permission}>
                      {unref(currentTreeData)?.permissionList.map((v: any) => {
                        return <ElCheckbox label={v.value}>{v.label}</ElCheckbox>
                      })}
                    </ElCheckboxGroup>
                  ) : null}
                </div>
              </div>
            </>
          )
        }
      }
    }
  }
])

const currentTreeData = ref()
const nodeClick = (treeData: any) => {
  currentTreeData.value = treeData
}

const rules = reactive({
  name: [required()],
  key: [required()],
  status: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const treeData = ref([])
const getMenuList = async () => {
  try {
    const res: any = await getMenuApi()
    if (res) {
      treeData.value = res.data || res.list || []
      if (!props.currentRow) return
      await nextTick()
      const checked: any[] = []
      eachTree(props.currentRow.menu || [], (v) => {
        checked.push({
          id: v.id,
          permission: v.meta?.permission || []
        })
      })
      eachTree(treeData.value, (v) => {
        const index = findIndex(checked, (item) => {
          return item.id === v.id
        })
        if (index > -1) {
          const meta = { ...(v.meta || {}) }
          meta.permission = checked[index].permission
          v.meta = meta
        }
      })
      for (const item of checked) {
        unref(treeRef)?.setChecked(item.id, true, false)
      }
    }
  } catch (error) {
    console.error('Failed to load menu data:', error)
  }
}
getMenuList()

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    const checkedKeys = unref(treeRef)?.getCheckedKeys() || []
    const data = filter(unref(treeData), (item: any) => {
      return checkedKeys.includes(item.id)
    })
    formData.permissionIds = data.map((item: any) => item.id) || []
    console.log(formData)
    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
