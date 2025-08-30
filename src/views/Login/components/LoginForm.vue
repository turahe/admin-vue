<script setup lang="tsx">
import { reactive, ref, watch, onMounted, unref } from 'vue'
import { Form, FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCheckbox, ElLink, ElMessage } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { useValidator } from '@/hooks/web/useValidator'
import { Icon } from '@/components/Icon'
import { useUserStore } from '@/store/modules/user'
import { BaseButton } from '@/components/Button'
import type { LoginRequest } from '@/api/auth'

const { required } = useValidator()

const emit = defineEmits(['to-register', 'to-forget-password'])

const appStore = useAppStore()

const userStore = useUserStore()

const permissionStore = usePermissionStore()

const { currentRoute, addRoute, push } = useRouter()

const { t } = useI18n()

const rules = {
  identity: [required()],
  password: [required()]
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
          return <h2 class="text-2xl font-bold text-center w-[100%]">{t('login.login')}</h2>
        }
      }
    }
  },
  {
    field: 'identity',
    label: t('login.identity') || 'Email, Username or Phone',
    // value: 'admin@example.com', // or 'admin' or '+1234567890'
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: 'Enter email, username or phone'
    }
  },
  {
    field: 'password',
    label: t('login.password'),
    // value: 'admin',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: 'admin or test',
      // 按下enter键触发登录
      onKeydown: (_e: any) => {
        if (_e.key === 'Enter') {
          _e.stopPropagation() // 阻止事件冒泡
          signIn()
        }
      }
    }
  },
  {
    field: 'tool',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex justify-between items-center w-[100%]">
                <ElCheckbox v-model={remember.value} label={t('login.remember')} size="small" />
                <ElLink type="primary" underline={false} onClick={() => emit('to-forget-password')}>
                  {t('login.forgetPassword')}
                </ElLink>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'login',
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
                  onClick={signIn}
                >
                  {t('login.login')}
                </BaseButton>
              </div>
              <div class="w-[100%] mt-15px">
                <BaseButton class="w-[100%]" onClick={toRegister}>
                  {t('login.register')}
                </BaseButton>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'other',
    component: 'Divider',
    label: t('login.otherLogin'),
    componentProps: {
      contentPosition: 'center'
    }
  },
  {
    field: 'otherIcon',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex justify-between w-[100%]">
                <Icon
                  icon="vi-ant-design:github-filled"
                  size={iconSize}
                  class="cursor-pointer ant-icon"
                  color={iconColor}
                  hoverColor={hoverColor}
                />
                <Icon
                  icon="vi-ant-design:wechat-filled"
                  size={iconSize}
                  class="cursor-pointer ant-icon"
                  color={iconColor}
                  hoverColor={hoverColor}
                />
                <Icon
                  icon="vi-ant-design:alipay-circle-filled"
                  size={iconSize}
                  color={iconColor}
                  hoverColor={hoverColor}
                  class="cursor-pointer ant-icon"
                />
                <Icon
                  icon="vi-ant-design:weibo-circle-filled"
                  size={iconSize}
                  color={iconColor}
                  hoverColor={hoverColor}
                  class="cursor-pointer ant-icon"
                />
              </div>
            </>
          )
        }
      }
    }
  }
])

const iconSize = 30

const remember = ref(userStore.getRememberMe)

const initLoginInfo = () => {
  console.log('Initializing login info')
  const loginInfo = userStore.getLoginInfo
  console.log('Login info from store:', loginInfo)
  if (loginInfo) {
    const { identity, password } = loginInfo
    console.log('Setting form values:', { identity, password })
    setValues({ identity, password })
  }
}
onMounted(() => {
  console.log('LoginForm mounted')
  initLoginInfo()
})

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose, setValues } = formMethods
console.log('Form methods:', { formRegister, formMethods })

const loading = ref(false)

const iconColor = '#999'

const hoverColor = 'var(--el-color-primary)'

const redirect = ref<string>('')

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

// 登录
const signIn = async () => {
  console.log('Sign in function called')
  const formRef = await getElFormExpose()
  console.log('Form ref:', formRef)
  await formRef?.validate(async (isValid) => {
    console.log('Form validation result:', isValid)
    if (isValid) {
      loading.value = true
      const formData = await getFormData<LoginRequest>()
      console.log('Retrieved form data:', formData)

      try {
        console.log('Form data before login:', formData)
        const result = await userStore.login(formData)
        console.log('Login result:', result)

        if (result.success) {
          // 是否记住我
          if (unref(remember)) {
            userStore.setLoginInfo({
              identity: formData.identity,
              password: formData.password
            })
          } else {
            userStore.setLoginInfo(undefined)
          }
          userStore.setRememberMe(unref(remember))

          ElMessage.success('Login successful!')

          // Fetch user profile after successful login
          try {
            await userStore.fetchUserProfile()
          } catch (error) {
            console.warn('Failed to fetch user profile:', error)
            // Continue with login even if profile fetch fails
          }

          // 是否使用动态路由
          console.log('Navigation logic - Dynamic router:', appStore.getDynamicRouter)
          console.log('Permission store addRouters:', permissionStore.getAddRouters)

          if (appStore.getDynamicRouter) {
            console.log('Using dynamic router, calling getRole()')
            getRole()
          } else {
            console.log('Using static router, generating routes')
            await permissionStore.generateRoutes('static').catch((error) => {
              console.error('Error generating static routes:', error)
            })

            const addRouters = permissionStore.getAddRouters
            console.log('Generated addRouters:', addRouters)

            addRouters.forEach((route) => {
              console.log('Adding route:', route)
              addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
            })

            permissionStore.setIsAddRouters(true)

            const targetPath = redirect.value || addRouters[0]?.path || '/dashboard'
            console.log('Navigating to:', targetPath)
            push({ path: targetPath })
          }
        } else {
          ElMessage.error(result.message || 'Login failed')
        }
      } catch (error) {
        console.error('Login error:', error)
        ElMessage.error('Login failed. Please try again.')
      } finally {
        loading.value = false
      }
    }
  })
}

// 获取角色信息 - simplified for now
const getRole = async () => {
  console.log('getRole function called')
  const userInfo = userStore.getUserInfo
  console.log('User info in getRole:', userInfo)

  if (userInfo) {
    console.log('User info exists, generating static routes')
    // For now, use static routes since we don't have role API
    await permissionStore.generateRoutes('static').catch((error) => {
      console.error('Error generating static routes in getRole:', error)
    })

    const addRouters = permissionStore.getAddRouters
    console.log('Generated addRouters in getRole:', addRouters)

    addRouters.forEach((route) => {
      console.log('Adding route in getRole:', route)
      addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
    })

    permissionStore.setIsAddRouters(true)

    const targetPath = redirect.value || addRouters[0]?.path || '/dashboard'
    console.log('Navigating to in getRole:', targetPath)
    push({ path: targetPath })
  } else {
    console.log('No user info, cannot proceed with navigation')
  }
}

// 去注册页面
const toRegister = () => {
  emit('to-register')
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
