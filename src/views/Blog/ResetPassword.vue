<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'
import { useI18n } from 'vue-i18n'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { errorMessage } from '@/api/errors'
import { resetPassword } from '@/services/auth'
import { useToastStore } from '@/stores/feedback'

const { t } = useI18n()
const router = useRouter()
const toast = useToastStore()
const schema = toTypedSchema(
  object({
    email: string().email().required(),
    token: string().required(),
    password: string().min(12, 'Use at least 12 characters').required(),
  }),
)
const { handleSubmit, errors, defineField, isSubmitting, setFieldError } = useForm({
  validationSchema: schema,
  initialValues: { token: '' },
})
const [email] = defineField('email')
const [token] = defineField('token')
const [password] = defineField('password')

const submit = handleSubmit(async (values) => {
  try {
    await resetPassword(values.email, values.token, values.password)
    toast.push('Password updated. Sign in with the new password.')
    await router.push('/signin')
  } catch (caught) {
    setFieldError('token', errorMessage(caught))
  }
})
</script>

<template>
  <AuthLayout>
    <div class="flex w-full flex-1 flex-col justify-center lg:w-1/2">
      <div class="mx-auto w-full max-w-md px-6">
        <h1 class="text-title-sm text-gray-800 dark:text-white/90">{{ t('auth.reset') }}</h1>
        <form class="mt-6 space-y-3" @submit.prevent="submit">
          <Input v-model="email" type="email" :placeholder="t('auth.email')" />
          <p v-if="errors.email" class="text-sm text-error-600">{{ errors.email }}</p>
          <Input v-model="token" :placeholder="t('auth.token')" />
          <p v-if="errors.token" class="text-sm text-error-600">{{ errors.token }}</p>
          <Input v-model="password" type="password" :placeholder="t('auth.newPassword')" />
          <p v-if="errors.password" class="text-sm text-error-600">{{ errors.password }}</p>
          <Button type="submit" class="w-full" :disabled="isSubmitting">{{ t('auth.reset') }}</Button>
        </form>
        <RouterLink to="/signin" class="mt-4 inline-block text-sm text-brand-500">{{ t('auth.login') }}</RouterLink>
      </div>
    </div>
  </AuthLayout>
</template>
