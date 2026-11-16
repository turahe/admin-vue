<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { errorMessage } from '@/api/errors'
import { useFormValidation } from '@/composables/useFormValidation'
import { EyeCloseIcon, EyeIcon } from '@/icons/layout'
import { useAuthStore } from '@/stores/auth'
import { validateSignIn, type SignInFormData } from './schema'

const showPassword = ref(false)
const submitError = ref('')
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const { values, errorOf, touch, handleSubmit, isSubmitting } = useFormValidation<SignInFormData>(
  { email: '', password: '', keepLoggedIn: false },
  validateSignIn,
)

const onSubmit = handleSubmit(async (data) => {
  submitError.value = ''
  try {
    await auth.login(data.email, data.password)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.push(redirect)
  } catch (caught) {
    submitError.value = errorMessage(caught)
  }
})
</script>

<template>
  <form class="space-y-5" novalidate @submit="onSubmit">
    <Field :data-invalid="Boolean(errorOf('email'))">
      <FieldLabel class="mb-1.5 block"> Email <span class="text-red-500">*</span> </FieldLabel>
      <Input
        v-model="values.email"
        type="email"
        placeholder="info@gmail.com"
        :aria-invalid="errorOf('email') ? 'true' : undefined"
        @blur="touch('email')"
      />
      <FieldError :errors="[{ message: errorOf('email') }]" />
    </Field>

    <Field :data-invalid="Boolean(errorOf('password'))">
      <FieldLabel class="mb-1.5 block"> Password <span class="text-red-500">*</span> </FieldLabel>
      <InputGroup>
        <InputGroupInput
          v-model="values.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter your password"
          :aria-invalid="errorOf('password') ? 'true' : undefined"
          @blur="touch('password')"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
            class="text-gray-500 dark:text-gray-400"
            @click="showPassword = !showPassword"
          >
            <EyeIcon v-if="showPassword" class="fill-current" />
            <EyeCloseIcon v-else class="fill-current" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FieldError :errors="[{ message: errorOf('password') }]" />
    </Field>

    <div class="flex items-center justify-between">
      <Field orientation="horizontal" class="w-auto items-center gap-3">
        <Checkbox
          id="keep-logged-in"
          :model-value="values.keepLoggedIn"
          @update:model-value="values.keepLoggedIn = Boolean($event)"
        />
        <FieldLabel
          for="keep-logged-in"
          class="text-theme-sm block cursor-pointer font-normal text-gray-700 dark:text-gray-400"
        >
          Keep me logged in
        </FieldLabel>
      </Field>
      <RouterLink
        to="/reset-password"
        class="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
      >
        Forgot password?
      </RouterLink>
    </div>

    <p v-if="submitError" class="text-sm text-error-600 dark:text-error-400">{{ submitError }}</p>

    <div>
      <Button class="w-full" size="lg" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Signing In...' : 'Sign In' }}
      </Button>
    </div>
  </form>
</template>
