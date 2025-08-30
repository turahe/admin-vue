<script setup lang="ts">
import { Form } from '@/components/Form'
import type { FormSchema } from '@/hooks/web/useForm'
import type { Address } from '@/api/address/types'

const { formRegister, formMethods } = useForm()
const { setFormValues } = formMethods

const props = defineProps<{
  formSchema: FormSchema[]
  currentRow?: Address
}>()

const emit = defineEmits<{
  submit: [data: any]
}>()

const submit = async () => {
  const elFormRef = formRegister()
  const formData = await elFormRef?.validate()
  emit('submit', formData)
}

defineExpose({
  submit
})

watch(
  () => props.currentRow,
  (currentRow) => {
    if (currentRow) {
      setFormValues(currentRow)
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <Form :form-schema="formSchema" @register="formRegister" />
</template>
