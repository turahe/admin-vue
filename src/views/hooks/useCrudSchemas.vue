<script setup lang="ts">
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useI18n } from '@/hooks/web/useI18n'
import { reactive } from 'vue'
import { JsonEditor } from '@/components/JsonEditor'
import { ContentWrap } from '@/components/ContentWrap'
import { ElRow, ElCol } from 'element-plus'

const { t } = useI18n()

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
    label: t('tableDemo.index'),
    type: 'index',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    }
  },
  {
    field: 'title',
    label: t('tableDemo.title'),
    search: {
      component: 'Input'
    },
    form: {
      component: 'Input',
      colProps: {
        span: 24
      }
    },
    detail: {
      span: 24
    }
  },
  {
    field: 'author',
    label: t('tableDemo.author'),
    search: {
      hidden: true
    }
  },
  {
    field: 'display_time',
    label: t('tableDemo.displayTime'),
    search: {
      hidden: true
    },
    form: {
      component: 'DatePicker',
      componentProps: {
        type: 'datetime',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      }
    }
  },
  {
    field: 'importance',
    label: t('tableDemo.importance'),
    search: {
      hidden: true
    },
    form: {
      component: 'Select',
      componentProps: {
        style: {
          width: '100%'
        },
        options: [
          {
            label: t('common.important'),
            value: 3
          },
          {
            label: t('common.good'),
            value: 2
          },
          {
            label: t('common.general'),
            value: 1
          }
        ]
      }
    }
  },
  {
    field: 'pageviews',
    label: t('tableDemo.pageviews'),
    search: {
      hidden: true
    },
    form: {
      component: 'InputNumber',
      value: 0
    }
  },
  {
    field: 'content',
    label: t('exampleDemo.content'),
    search: {
      hidden: true
    },
    table: {
      show: false
    },
    form: {
      component: 'Editor',
      colProps: {
        span: 24
      }
    },
    detail: {
      span: 24
    }
  },
  {
    field: 'action',
    width: '260px',
    label: t('tableDemo.action'),
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
</script>

<template>
  <ContentWrap title="useCrudSchemas">
    <ElRow :gutter="20">
      <ElCol :span="24">
        <ContentWrap :title="t('common.originalData')" class="mt-20px">
          <JsonEditor v-model="crudSchemas" />
        </ContentWrap>
      </ElCol>
      <ElCol :span="24">
        <ContentWrap :title="t('common.queryComponentDataStructure')" class="mt-20px">
          <JsonEditor v-model="allSchemas.searchSchema" />
        </ContentWrap>
      </ElCol>
      <ElCol :span="24">
        <ContentWrap :title="t('common.formComponentDataStructure')" class="mt-20px">
          <JsonEditor v-model="allSchemas.formSchema" />
        </ContentWrap>
      </ElCol>
      <ElCol :span="24">
        <ContentWrap :title="t('common.tableComponentDataStructure')" class="mt-20px">
          <JsonEditor v-model="allSchemas.tableColumns" />
        </ContentWrap>
      </ElCol>
      <ElCol :span="24">
        <ContentWrap :title="t('common.detailComponentDataStructure')" class="mt-20px">
          <JsonEditor v-model="allSchemas.detailSchema" />
        </ContentWrap>
      </ElCol>
    </ElRow>
  </ContentWrap>
</template>
