<template>
  <div class="integration-settings">
    <div class="page-header">
      <h1 class="page-title">{{ $t('integration.title') }}</h1>
      <p class="page-description">{{ $t('integration.description') }}</p>
    </div>

    <div class="integration-grid">
      <!-- WhatsApp Integration -->
      <div class="integration-card" :class="{ active: whatsappConfig.enabled }">
        <div class="card-header">
          <div class="service-info">
            <div class="service-icon whatsapp">
              <i class="vi-ant-design:message-filled"></i>
            </div>
            <div class="service-details">
              <h3>{{ $t('integration.whatsapp.title') }}</h3>
              <p>{{ $t('integration.whatsapp.description') }}</p>
            </div>
          </div>
          <el-switch v-model="whatsappConfig.enabled" @change="handleWhatsAppToggle" />
        </div>

        <div v-if="whatsappConfig.enabled" class="card-content">
          <el-form :model="whatsappConfig" label-width="120px">
            <el-form-item :label="$t('integration.whatsapp.phoneNumber')">
              <el-input
                v-model="whatsappConfig.phoneNumber"
                :placeholder="$t('integration.whatsapp.phoneNumberPlaceholder')"
                type="tel"
              />
            </el-form-item>
            <el-form-item :label="$t('integration.whatsapp.apiKey')">
              <el-input
                v-model="whatsappConfig.apiKey"
                :placeholder="$t('integration.whatsapp.apiKeyPlaceholder')"
                type="password"
                show-password
              />
            </el-form-item>
            <el-form-item :label="$t('integration.whatsapp.webhookUrl')">
              <el-input
                v-model="whatsappConfig.webhookUrl"
                :placeholder="$t('integration.whatsapp.webhookUrlPlaceholder')"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- Google Integration -->
      <div class="integration-card" :class="{ active: googleConfig.enabled }">
        <div class="card-header">
          <div class="service-info">
            <div class="service-icon google">
              <i class="vi-ant-design:google-circle-filled"></i>
            </div>
            <div class="service-details">
              <h3>{{ $t('integration.google.title') }}</h3>
              <p>{{ $t('integration.google.description') }}</p>
            </div>
          </div>
          <el-switch v-model="googleConfig.enabled" @change="handleGoogleToggle" />
        </div>

        <div v-if="googleConfig.enabled" class="card-content">
          <el-form :model="googleConfig" label-width="120px">
            <el-form-item :label="$t('integration.google.clientId')">
              <el-input
                v-model="googleConfig.clientId"
                :placeholder="$t('integration.google.clientIdPlaceholder')"
              />
            </el-form-item>
            <el-form-item :label="$t('integration.google.clientSecret')">
              <el-input
                v-model="googleConfig.clientSecret"
                :placeholder="$t('integration.google.clientSecretPlaceholder')"
                type="password"
                show-password
              />
            </el-form-item>
            <el-form-item :label="$t('integration.google.redirectUri')">
              <el-input
                v-model="googleConfig.redirectUri"
                :placeholder="$t('integration.google.redirectUriPlaceholder')"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- Twitter/X Integration -->
      <div class="integration-card" :class="{ active: twitterConfig.enabled }">
        <div class="card-header">
          <div class="service-info">
            <div class="service-icon twitter">
              <i class="vi-ant-design:twitter-circle-filled"></i>
            </div>
            <div class="service-details">
              <h3>{{ $t('integration.twitter.title') }}</h3>
              <p>{{ $t('integration.twitter.description') }}</p>
            </div>
          </div>
          <el-switch v-model="twitterConfig.enabled" @change="handleTwitterToggle" />
        </div>

        <div v-if="twitterConfig.enabled" class="card-content">
          <el-form :model="twitterConfig" label-width="120px">
            <el-form-item :label="$t('integration.twitter.apiKey')">
              <el-input
                v-model="twitterConfig.apiKey"
                :placeholder="$t('integration.twitter.apiKeyPlaceholder')"
              />
            </el-form-item>
            <el-form-item :label="$t('integration.twitter.apiSecret')">
              <el-input
                v-model="twitterConfig.apiSecret"
                :placeholder="$t('integration.twitter.apiSecretPlaceholder')"
                type="password"
                show-password
              />
            </el-form-item>
            <el-form-item :label="$t('integration.twitter.accessToken')">
              <el-input
                v-model="twitterConfig.accessToken"
                :placeholder="$t('integration.twitter.accessTokenPlaceholder')"
                type="password"
                show-password
              />
            </el-form-item>
            <el-form-item :label="$t('integration.twitter.accessTokenSecret')">
              <el-input
                v-model="twitterConfig.accessTokenSecret"
                :placeholder="$t('integration.twitter.accessTokenSecretPlaceholder')"
                type="password"
                show-password
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- Facebook Integration -->
      <div class="integration-card" :class="{ active: facebookConfig.enabled }">
        <div class="card-header">
          <div class="service-info">
            <div class="service-icon facebook">
              <i class="vi-ant-design:facebook-filled"></i>
            </div>
            <div class="service-details">
              <h3>{{ $t('integration.facebook.title') }}</h3>
              <p>{{ $t('integration.facebook.description') }}</p>
            </div>
          </div>
          <el-switch v-model="facebookConfig.enabled" @change="handleFacebookToggle" />
        </div>

        <div v-if="facebookConfig.enabled" class="card-content">
          <el-form :model="facebookConfig" label-width="120px">
            <el-form-item :label="$t('integration.facebook.appId')">
              <el-input
                v-model="facebookConfig.appId"
                :placeholder="$t('integration.facebook.appIdPlaceholder')"
              />
            </el-form-item>
            <el-form-item :label="$t('integration.facebook.appSecret')">
              <el-input
                v-model="facebookConfig.appSecret"
                :placeholder="$t('integration.facebook.appSecretPlaceholder')"
                type="password"
                show-password
              />
            </el-form-item>
            <el-form-item :label="$t('integration.facebook.pageId')">
              <el-input
                v-model="facebookConfig.pageId"
                :placeholder="$t('integration.facebook.pageIdPlaceholder')"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- GitHub Integration -->
      <div class="integration-card" :class="{ active: githubConfig.enabled }">
        <div class="card-header">
          <div class="service-info">
            <div class="service-icon github">
              <i class="vi-ant-design:github-filled"></i>
            </div>
            <div class="service-details">
              <h3>{{ $t('integration.github.title') }}</h3>
              <p>{{ $t('integration.github.description') }}</p>
            </div>
          </div>
          <el-switch v-model="githubConfig.enabled" @change="handleGitHubToggle" />
        </div>

        <div v-if="githubConfig.enabled" class="card-content">
          <el-form :model="githubConfig" label-width="120px">
            <el-form-item :label="$t('integration.github.clientId')">
              <el-input
                v-model="githubConfig.clientId"
                :placeholder="$t('integration.github.clientIdPlaceholder')"
              />
            </el-form-item>
            <el-form-item :label="$t('integration.github.clientSecret')">
              <el-input
                v-model="githubConfig.clientSecret"
                :placeholder="$t('integration.github.clientSecretPlaceholder')"
                type="password"
                show-password
              />
            </el-form-item>
            <el-form-item :label="$t('integration.github.organization')">
              <el-input
                v-model="githubConfig.organization"
                :placeholder="$t('integration.github.organizationPlaceholder')"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <el-button @click="resetToDefaults" type="info">
        {{ $t('integration.resetToDefaults') }}
      </el-button>
      <el-button @click="saveAllConfigurations" type="primary">
        {{ $t('integration.saveAll') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import {
  getIntegrationConfigsApi,
  saveIntegrationConfigsApi,
  resetIntegrationConfigsApi
} from '@/api/integration'
import type { IntegrationConfigs } from '@/api/integration/types'

const { t } = useI18n()

// Configuration states for each integration
const whatsappConfig = reactive({
  enabled: false,
  phoneNumber: '',
  apiKey: '',
  webhookUrl: ''
})

const googleConfig = reactive({
  enabled: false,
  clientId: '',
  clientSecret: '',
  redirectUri: ''
})

const twitterConfig = reactive({
  enabled: false,
  apiKey: '',
  apiSecret: '',
  accessToken: '',
  accessTokenSecret: ''
})

const facebookConfig = reactive({
  enabled: false,
  appId: '',
  appSecret: '',
  pageId: ''
})

const githubConfig = reactive({
  enabled: false,
  clientId: '',
  clientSecret: '',
  organization: ''
})

// Toggle handlers
const handleWhatsAppToggle = (enabled: boolean) => {
  if (enabled) {
    ElMessage.success(t('integration.whatsapp.enabled'))
  } else {
    ElMessage.info(t('integration.whatsapp.disabled'))
  }
}

const handleGoogleToggle = (enabled: boolean) => {
  if (enabled) {
    ElMessage.success(t('integration.google.enabled'))
  } else {
    ElMessage.info(t('integration.google.disabled'))
  }
}

const handleTwitterToggle = (enabled: boolean) => {
  if (enabled) {
    ElMessage.success(t('integration.twitter.enabled'))
  } else {
    ElMessage.info(t('integration.twitter.disabled'))
  }
}

const handleFacebookToggle = (enabled: boolean) => {
  if (enabled) {
    ElMessage.success(t('integration.facebook.enabled'))
  } else {
    ElMessage.info(t('integration.facebook.disabled'))
  }
}

const handleGitHubToggle = (enabled: boolean) => {
  if (enabled) {
    ElMessage.success(t('integration.github.enabled'))
  } else {
    ElMessage.info(t('integration.github.disabled'))
  }
}

// Reset configurations to defaults
const resetToDefaults = async () => {
  try {
    await ElMessageBox.confirm(t('integration.resetConfirm'), t('integration.resetWarning'), {
      confirmButtonText: t('common.ok'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    })

    try {
      await resetIntegrationConfigsApi()

      // Reset all configurations
      Object.assign(whatsappConfig, { enabled: false, phoneNumber: '', apiKey: '', webhookUrl: '' })
      Object.assign(googleConfig, {
        enabled: false,
        clientId: '',
        clientSecret: '',
        redirectUri: ''
      })
      Object.assign(twitterConfig, {
        enabled: false,
        apiKey: '',
        apiSecret: '',
        accessToken: '',
        accessTokenSecret: ''
      })
      Object.assign(facebookConfig, { enabled: false, appId: '', appSecret: '', pageId: '' })
      Object.assign(githubConfig, {
        enabled: false,
        clientId: '',
        clientSecret: '',
        organization: ''
      })

      ElMessage.success(t('integration.resetSuccess'))
    } catch (error) {
      ElMessage.error(t('integration.resetError'))
      console.error('Error resetting configurations:', error)
    }
  } catch {
    // User cancelled
  }
}

// Save all configurations
const saveAllConfigurations = async () => {
  try {
    const enabledIntegrations = [
      whatsappConfig.enabled && 'WhatsApp',
      googleConfig.enabled && 'Google',
      twitterConfig.enabled && 'Twitter',
      facebookConfig.enabled && 'Facebook',
      githubConfig.enabled && 'GitHub'
    ].filter(Boolean)

    if (enabledIntegrations.length === 0) {
      ElMessage.warning(t('integration.noIntegrationsEnabled'))
      return
    }

    const configs: IntegrationConfigs = {
      whatsapp: whatsappConfig,
      google: googleConfig,
      twitter: twitterConfig,
      facebook: facebookConfig,
      github: githubConfig
    }

    const response = await saveIntegrationConfigsApi({ configs })

    if (response.data?.success) {
      ElMessage.success(t('integration.saveSuccess'))
    } else {
      ElMessage.error(response.data?.message || t('integration.saveError'))
    }
  } catch (error) {
    ElMessage.error(t('integration.saveError'))
    console.error('Error saving configurations:', error)
  }
}

// Load configurations on mount
onMounted(async () => {
  try {
    const response = await getIntegrationConfigsApi()
    if (response.data) {
      const configs = response.data

      // Update local state with loaded configurations
      Object.assign(whatsappConfig, configs.whatsapp)
      Object.assign(googleConfig, configs.google)
      Object.assign(twitterConfig, configs.twitter)
      Object.assign(facebookConfig, configs.facebook)
      Object.assign(githubConfig, configs.github)
    }
  } catch (error) {
    console.error('Error loading integration configurations:', error)
    // Keep default values if loading fails
  }
})
</script>

<style scoped lang="less">
// Responsive design
@media (width <= 768px) {
  .integration-settings {
    padding: 16px;
  }

  .integration-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .integration-card {
    padding: 16px;
  }

  .service-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
}

.integration-settings {
  max-width: 1200px;
  padding: 24px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;

  .page-title {
    margin: 0 0 8px;
    font-size: 28px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .page-description {
    margin: 0;
    font-size: 16px;
    color: var(--el-text-color-regular);
  }
}

.integration-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.integration-card {
  padding: 24px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 12px;
  transition: all 0.3s ease;

  &.active {
    border-color: var(--el-color-primary);
    box-shadow: 0 4px 12px rgb(64 158 255 / 10%);
  }

  &:hover {
    box-shadow: 0 4px 16px rgb(0 0 0 / 10%);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.service-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.service-icon {
  display: flex;
  width: 48px;
  height: 48px;
  font-size: 24px;
  color: white;
  border-radius: 12px;
  align-items: center;
  justify-content: center;

  &.whatsapp {
    background: linear-gradient(135deg, #25d366, #128c7e);
  }

  &.google {
    background: linear-gradient(135deg, #4285f4, #34a853);
  }

  &.twitter {
    background: linear-gradient(135deg, #1da1f2, #14171a);
  }

  &.facebook {
    background: linear-gradient(135deg, #1877f2, #0c1b33);
  }

  &.github {
    background: linear-gradient(135deg, #333, #24292e);
  }
}

.service-details {
  h3 {
    margin: 0 0 4px;
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.4;
    color: var(--el-text-color-regular);
  }
}

.card-content {
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}
</style>
