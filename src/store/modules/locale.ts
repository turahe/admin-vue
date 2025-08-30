import { defineStore } from 'pinia'
import { store } from '../index'
import en from 'element-plus/es/locale/lang/en'
import id from 'element-plus/es/locale/lang/id'
import { useStorage } from '@/hooks/web/useStorage'
import { LocaleDropdownType } from '@/components/LocaleDropdown'

const { getStorage, setStorage } = useStorage('localStorage')

const elLocaleMap = {
  en: en,
  id: id
}
interface LocaleState {
  currentLocale: LocaleDropdownType
  localeMap: LocaleDropdownType[]
}

export const useLocaleStore = defineStore('locales', {
  state: (): LocaleState => {
    return {
      currentLocale: {
        lang: getStorage('lang') || 'en',
        elLocale: elLocaleMap[getStorage('lang') || 'en']
      },
      // Multi-language
      localeMap: [
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
  getters: {
    getCurrentLocale(): LocaleDropdownType {
      return this.currentLocale
    },
    getLocaleMap(): LocaleDropdownType[] {
      return this.localeMap
    }
  },
  actions: {
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
