<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Form, FormSchema } from '@/components/Form'
import { useValidator } from '@/hooks/web/useValidator'
import { useForm } from '@/hooks/web/useForm'
import { reactive } from 'vue'
import { FormItemRule } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const { formRegister, formMethods } = useForm()

const { getFormData } = formMethods

const { required, lengthRange, notSpace, notSpecialCharacters } = useValidator()

const formSchema = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: t('common.required'),
    component: 'Input'
  },
  {
    field: 'field2',
    label: t('common.lengthRange'),
    component: 'Input'
  },
  {
    field: 'field3',
    label: t('common.noSpace'),
    component: 'Input'
  },
  {
    field: 'field4',
    label: t('common.noSpecialCharacters'),
    component: 'Input'
  },
  {
    field: 'field5',
    label: t('common.isEqualValue1'),
    component: 'Input'
  },
  {
    field: 'field6',
    label: t('common.isEqualValue2'),
    component: 'Input'
  }
])

const rules = reactive<{
  [key: string]: FormItemRule[]
}>({
  field1: [required()],
  field2: [
    lengthRange({
      min: 2,
      max: 5
    })
  ],
  field3: [notSpace()],
  field4: [notSpecialCharacters()],
  field5: [
    {
      asyncValidator: async (_, val, callback) => {
        const formData = await getFormData()
        const { field6 } = formData
        if (val !== field6) {
          callback(new Error(t('common.twoValuesAreNotEqual')))
        } else {
          callback()
        }
      }
    }
  ]
})
</script>

<template>
  <ContentWrap title="useValidator">
    <Form :schema="formSchema" :rules="rules" @register="formRegister" />
  </ContentWrap>
</template>
