<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'
import { changeUserPasswordApi } from '@/api/user'
import type { ChangePasswordRequest } from '@/api/user/types'
import type { FormSchema } from '@/components/Form/src/types'
import { ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { required } = useValidator()

const userId = route.params.id as string
const loading = ref(false)

const formSchema: FormSchema[] = [
  {
    field: 'current_password',
    label: 'Current Password',
    component: 'Input',
    componentProps: {
      type: 'password',
      placeholder: 'Enter current password',
      showPassword: true
    }
  },
  {
    field: 'new_password',
    label: 'New Password',
    component: 'Input',
    componentProps: {
      type: 'password',
      placeholder: 'Enter new password',
      showPassword: true
    }
  },
  {
    field: 'new_password_confirmation',
    label: 'Confirm New Password',
    component: 'Input',
    componentProps: {
      type: 'password',
      placeholder: 'Confirm new password',
      showPassword: true
    }
  }
]

const rules = reactive({
  current_password: [required()],
  new_password: [
    required(),
    {
      min: 8,
      max: 128,
      message: 'Password must be between 8 and 128 characters',
      trigger: 'blur'
    }
  ],
  new_password_confirmation: [
    required(),
    {
      validator: (rule: any, value: string, callback: any) => {
        const newPassword = formData.value.new_password
        if (value !== newPassword) {
          callback(new Error('Password confirmation does not match'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

const formData = ref<ChangePasswordRequest>({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const handleSubmit = async () => {
  try {
    loading.value = true
    const elForm = await getElFormExpose()
    const valid = await elForm?.validate()

    if (valid) {
      const data = await getFormData()

      await changeUserPasswordApi(userId, data as ChangePasswordRequest)

      ElMessage.success('Password changed successfully')

      // Reset form
      formData.value = {
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      }

      // Go back to user list
      router.push('/authorization/permissions/user')
    }
  } catch (error: any) {
    console.error('Password change error:', error)
    ElMessage.error(error?.response?.data?.message || 'Failed to change password')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/authorization/permissions/user')
}
</script>

<template>
  <ContentWrap>
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Change Password</h1>
          <p class="text-gray-600">Change password for user ID: {{ userId }}</p>
        </div>

        <Form
          :schema="formSchema"
          :rules="rules"
          @register="formRegister"
          :model="formData"
          label-width="180px"
        />

        <div class="flex justify-end space-x-4 mt-8">
          <el-button @click="handleCancel" :disabled="loading"> Cancel </el-button>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            Change Password
          </el-button>
        </div>
      </div>
    </div>
  </ContentWrap>
</template>
