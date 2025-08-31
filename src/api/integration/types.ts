export interface WhatsAppConfig {
  enabled: boolean
  phoneNumber: string
  apiKey: string
  webhookUrl: string
}

export interface GoogleConfig {
  enabled: boolean
  clientId: string
  clientSecret: string
  redirectUri: string
}

export interface TwitterConfig {
  enabled: boolean
  apiKey: string
  apiSecret: string
  accessToken: string
  accessTokenSecret: string
}

export interface FacebookConfig {
  enabled: boolean
  appId: string
  appSecret: string
  pageId: string
}

export interface GitHubConfig {
  enabled: boolean
  clientId: string
  clientSecret: string
  organization: string
}

export interface IntegrationConfigs {
  whatsapp: WhatsAppConfig
  google: GoogleConfig
  twitter: TwitterConfig
  facebook: FacebookConfig
  github: GitHubConfig
}

export interface SaveIntegrationRequest {
  configs: IntegrationConfigs
}

export interface SaveIntegrationResponse {
  success: boolean
  message: string
  data?: any
}

export interface TestIntegrationRequest {
  service: 'whatsapp' | 'google' | 'twitter' | 'facebook' | 'github'
  config: any
}

export interface TestIntegrationResponse {
  success: boolean
  message: string
  data?: any
}
