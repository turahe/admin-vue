<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { Form, FormSchema } from '@/components/Form'
import { ElLink, ElMessage } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'
import { BaseButton } from '@/components/Button'
import { useUserStore } from '@/store/modules/user'
import type { RegisterRequest } from '@/api/auth'

const { required, email, lengthRange, phone } = useValidator()

const emit = defineEmits(['to-login'])

const userStore = useUserStore()

// const { t } = useI18n() // Not used in this component

const rules = {
  country: [required()],
  username: [required(), lengthRange({ min: 3, max: 50 })],
  email: [required(), email()],
  phone: [required(), phone()],
  password: [required(), lengthRange({ min: 8, max: 100 })],
  password_confirmation: [required()]
}

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return <h2 class="text-2xl font-bold text-center w-[100%]">Create Account</h2>
        }
      }
    }
  },
  {
    field: 'country',
    label: 'Country',
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: 'Select your country',
      options: [
        { label: 'Indonesia', value: 'ID' },
        { label: 'United States', value: 'US' },
        { label: 'United Kingdom', value: 'GB' },
        { label: 'Germany', value: 'DE' },
        { label: 'France', value: 'FR' },
        { label: 'Japan', value: 'JP' },
        { label: 'China', value: 'CN' },
        { label: 'India', value: 'IN' }
      ]
    }
  },
  {
    field: 'username',
    label: 'Username',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: 'Enter your username'
    }
  },
  {
    field: 'email',
    label: 'Email',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: 'Enter your email address'
    }
  },
  {
    field: 'phone',
    label: 'Phone Number',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: '+1234567890'
    }
  },
  {
    field: 'password',
    label: 'Password',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: 'Enter your password (min 8 characters)'
    }
  },
  {
    field: 'password_confirmation',
    label: 'Confirm Password',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: 'Confirm your password'
    }
  },
  {
    field: 'register',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="w-[100%]">
                <BaseButton
                  loading={loading.value}
                  type="primary"
                  class="w-[100%]"
                  onClick={handleRegister}
                >
                  Create Account
                </BaseButton>
              </div>
              <div class="w-[100%] mt-15px">
                <BaseButton class="w-[100%]" onClick={toLogin}>
                  Back to Login
                </BaseButton>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'login_link',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <div class="text-center">
              Already have an account?{' '}
              <ElLink type="primary" underline={false} onClick={() => emit('to-login')}>
                Sign in here
              </ElLink>
            </div>
          )
        }
      }
    }
  }
])

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

const loading = ref(false)

// Handle registration
const handleRegister = async () => {
  const formRef = await getElFormExpose()
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const formData = await getFormData<RegisterRequest>()

      // Check if passwords match
      if (formData.password !== formData.password_confirmation) {
        ElMessage.error('Passwords do not match')
        loading.value = false
        return
      }

      try {
        const result = await userStore.register(formData)

        if (result.success) {
          ElMessage.success('Registration successful! Please check your email for verification.')
          emit('to-login')
        } else {
          ElMessage.error(result.message || 'Registration failed')
        }
      } catch (error) {
        console.error('Registration error:', error)
        ElMessage.error('Registration failed. Please try again.')
      } finally {
        loading.value = false
      }
    }
  })
}

// Go to login page
const toLogin = () => {
  emit('to-login')
}
</script>

<template>
  <Form
    :schema="schema"
    :rules="rules"
    label-position="top"
    hide-required-asterisk
    size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
    @register="formRegister"
  />
</template>
