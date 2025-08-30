<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
import { FormRules } from 'element-plus'
import { BaseButton } from '@/components/Button'

const { formRegister, formMethods } = useForm()
const { t } = useI18n()

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <h2 class="text-2xl font-bold text-center w-[100%]">{t('login.forgetPassword')}</h2>
          )
        }
      }
    }
  },
  {
    field: 'email',
    label: t('login.email'),
    value: '',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('login.emailPlaceholder')
    }
  },
  {
    field: 'submit',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <div class="w-[100%]">
              <BaseButton
                type="primary"
                class="w-[100%]"
                loading={loading.value}
                onClick={onSubmit}
              >
                {t('login.forgetPassword')}
              </BaseButton>
            </div>
          )
        }
      }
    }
  }
])

const rules: FormRules = {
  email: [{ required: true, message: t('login.emailPlaceholder'), trigger: 'blur' }]
}

const loading = ref(false)

const onSubmit = async () => {
  const formRef = await formMethods.getElFormExpose()
  formRef?.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        // TODO: handle password reset logic
      } finally {
        loading.value = false
      }
    }
  })
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
