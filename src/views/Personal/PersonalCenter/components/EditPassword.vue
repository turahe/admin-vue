<script setup lang="ts">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { ElMessage, ElMessageBox, ElDivider } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const { required } = useValidator()

const formSchema = reactive<FormSchema[]>([
  {
    field: 'password',
    label: t('personal.oldPassword'),
    component: 'InputPassword',
    colProps: {
      span: 24
    }
  },
  {
    field: 'newPassword',
    label: t('personal.newPassword'),
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      strength: true
    }
  },
  {
    field: 'newPassword2',
    label: t('personal.confirmNewPassword'),
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      strength: true
    }
  }
])

const rules = reactive({
  password: [required()],
  newPassword: [
    required(),
    {
      asyncValidator: async (_, val, callback) => {
        const formData = await getFormData()
        const { newPassword2 } = formData
        if (val !== newPassword2) {
          callback(new Error(t('personal.newPasswordNotMatch')))
        } else {
          callback()
        }
      }
    }
  ],
  newPassword2: [
    required(),
    {
      asyncValidator: async (_, val, callback) => {
        const formData = await getFormData()
        const { newPassword } = formData
        if (val !== newPassword) {
          callback(new Error(t('personal.confirmNewPasswordNotMatch')))
        } else {
          callback()
        }
      }
    }
  ]
})

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

const saveLoading = ref(false)
const save = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    ElMessageBox.confirm(t('personal.confirmModify'), t('common.tip'), {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    })
      .then(async () => {
        try {
          saveLoading.value = true
          // 这里可以调用修改密码的接口
          ElMessage.success(t('common.success'))
        } catch (error) {
          console.log(error)
        } finally {
          saveLoading.value = false
        }
      })
      .catch(() => {})
  }
}
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
  <ElDivider />
  <BaseButton type="primary" @click="save">{{ t('common.confirm') }}</BaseButton>
</template>
