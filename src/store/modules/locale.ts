import { defineStore } from 'pinia'
import { store } from '../index'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import id from 'element-plus/es/locale/lang/id'
import { useStorage } from '@/hooks/web/useStorage'
import { LocaleDropdownType } from '@/components/LocaleDropdown'

const { getStorage, setStorage } = useStorage('localStorage')

/**
 * Element Plus locale mapping for different languages
 * Maps language codes to their corresponding Element Plus locale configurations
 */
const elLocaleMap = {
  'zh-CN': zhCn,
  en: en,
  id: id
}

/**
 * Locale state interface defining the structure of internationalization data
 * @interface LocaleState
 * @property {LocaleDropdownType} currentLocale - Currently selected language and its Element Plus locale
 * @property {LocaleDropdownType[]} localeMap - Available language options with display names
 */
interface LocaleState {
  currentLocale: LocaleDropdownType
  localeMap: LocaleDropdownType[]
}

/**
 * Locale Store - Manages application internationalization and language settings
 * 
 * This store handles:
 * - Current language selection and persistence
 * - Element Plus locale configuration
 * - Available language options
 * - Language switching functionality
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const localeStore = useLocaleStore()
 * 
 * // Get current language
 * const currentLang = localeStore.getCurrentLocale.lang
 * 
 * // Switch language
 * localeStore.setCurrentLocale({ lang: 'zh-CN', name: '简体中文' })
 * ```
 */
export const useLocaleStore = defineStore('locales', {
  /**
   * Initial state configuration for the locale store
   * @returns {LocaleState} Initial locale state with default values
   */
  state: (): LocaleState => {
    return {
      currentLocale: {
        lang: getStorage('lang') || 'en',
        elLocale: elLocaleMap[getStorage('lang') || 'en']
      },
      // Available languages
      localeMap: [
        {
          lang: 'zh-CN',
          name: '简体中文'
        },
        {
          lang: 'en',
          name: 'English'
        },
        {
          lang: 'id',
          name: 'Indonesia'
        }
      ]
    }
  },
  /**
   * Computed properties (getters) for accessing locale state
   */
  getters: {
    /**
     * Get the currently selected language and its Element Plus locale
     * @returns {LocaleDropdownType} Current language configuration
     */
    getCurrentLocale(): LocaleDropdownType {
      return this.currentLocale
    },
    
    /**
     * Get all available language options
     * @returns {LocaleDropdownType[]} Array of supported languages
     */
    getLocaleMap(): LocaleDropdownType[] {
      return this.localeMap
    }
  },
  
  /**
   * Actions for modifying locale state and performing language operations
   */
  actions: {
    /**
     * Set the current language and update Element Plus locale
     * @param {LocaleDropdownType} localeMap - Language configuration to apply
     * 
     * This action:
     * 1. Updates the current language setting
     * 2. Applies the corresponding Element Plus locale
     * 3. Persists the selection to localStorage
     */
    setCurrentLocale(localeMap: LocaleDropdownType) {
      // this.locale = Object.assign(this.locale, localeMap)
      this.currentLocale.lang = localeMap?.lang
      this.currentLocale.elLocale = elLocaleMap[localeMap?.lang]
      setStorage('lang', localeMap?.lang)
    }
  }
})

export const useLocaleStoreWithOut = () => {
  return useLocaleStore(store)
}
