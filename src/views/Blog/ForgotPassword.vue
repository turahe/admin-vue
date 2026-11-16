<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'
import { useI18n } from 'vue-i18n'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { errorMessage } from '@/api/errors'
import { forgotPassword } from '@/services/auth'

const { t } = useI18n()
const message = ref('')
const schema = toTypedSchema(object({ email: string().email().required() }))
const { handleSubmit, errors, defineField, isSubmitting, setFieldError } = useForm({ validationSchema: schema })
const [email] = defineField('email')

const submit = handleSubmit(async (values) => {
  try {
    message.value = await forgotPassword(values.email)
  } catch (caught) {
    setFieldError('email', errorMessage(caught))
  }
})
</script>

<template>
  <AuthLayout>
    <div class="flex w-full flex-1 flex-col justify-center lg:w-1/2">
      <div class="mx-auto w-full max-w-md px-6">
        <h1 class="text-title-sm text-gray-800 dark:text-white/90">{{ t('auth.forgot') }}</h1>
        <form class="mt-6 space-y-3" @submit.prevent="submit">
          <Input v-model="email" type="email" :placeholder="t('auth.email')" />
          <p v-if="errors.email" class="text-sm text-error-600">{{ errors.email }}</p>
          <Button type="submit" class="w-full" :disabled="isSubmitting">{{ t('common.confirm') }}</Button>
        </form>
        <p v-if="message" class="mt-4 text-sm text-gray-600 dark:text-gray-300">{{ message }}</p>
        <RouterLink to="/signin" class="mt-4 inline-block text-sm text-brand-500">{{ t('auth.login') }}</RouterLink>
      </div>
    </div>
  </AuthLayout>
</template>
