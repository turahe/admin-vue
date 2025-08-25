import { defineStore } from 'pinia'
import { store } from '../index'
import { setCssVar, humpToUnderline } from '@/utils'
import { colorIsDark, hexToRGB, lighten, mix } from '@/utils/color'
import { ElMessage, ComponentSize } from 'element-plus'
import { useCssVar } from '@vueuse/core'
import { unref } from 'vue'
import { useDark } from '@vueuse/core'

/**
 * Application state interface defining the structure of app-wide configuration
 * @interface AppState
 * @property {boolean} breadcrumb - Whether to show breadcrumb navigation
 * @property {boolean} breadcrumbIcon - Whether to show icons in breadcrumb
 * @property {boolean} collapse - Whether the sidebar menu is collapsed
 * @property {boolean} uniqueOpened - Whether only one submenu can be open at a time
 * @property {boolean} hamburger - Whether to show the hamburger menu toggle
 * @property {boolean} screenfull - Whether to show the fullscreen toggle button
 * @property {boolean} size - Whether to show the component size selector
 * @property {boolean} locale - Whether to show the language selector
 * @property {boolean} tagsView - Whether to show the tags view navigation
 * @property {boolean} tagsViewIcon - Whether to show icons in tags view
 * @property {boolean} logo - Whether to show the application logo
 * @property {boolean} fixedHeader - Whether the header is fixed at the top
 * @property {boolean} greyMode - Whether to enable grey mode (for special occasions)
 * @property {boolean} dynamicRouter - Whether to enable dynamic routing
 * @property {boolean} serverDynamicRouter - Whether to enable server-side dynamic routing
 * @property {boolean} pageLoading - Whether to show page loading indicator
 * @property {LayoutType} layout - Current layout type (classic, top, etc.)
 * @property {string} title - Application title
 * @property {boolean} isDark - Whether dark mode is enabled
 * @property {ComponentSize} currentSize - Current component size setting
 * @property {ComponentSize[]} sizeMap - Available component size options
 * @property {boolean} mobile - Whether the application is in mobile mode
 * @property {boolean} footer - Whether to show the footer
 * @property {ThemeTypes} theme - Application theme configuration
 * @property {boolean} fixedMenu - Whether the menu is fixed
 */
interface AppState {
  breadcrumb: boolean
  breadcrumbIcon: boolean
  collapse: boolean
  uniqueOpened: boolean
  hamburger: boolean
  screenfull: boolean
  size: boolean
  locale: boolean
  tagsView: boolean
  tagsViewIcon: boolean
  logo: boolean
  fixedHeader: boolean
  greyMode: boolean
  dynamicRouter: boolean
  serverDynamicRouter: boolean
  pageLoading: boolean
  layout: LayoutType
  title: string
  isDark: boolean
  currentSize: ComponentSize
  sizeMap: ComponentSize[]
  mobile: boolean
  footer: boolean
  theme: ThemeTypes
  fixedMenu: boolean
}

/**
 * Application Store - Manages application-wide configuration and UI state
 * 
 * This store handles:
 * - UI layout configuration (sidebar, header, footer)
 * - Theme and color scheme management
 * - Component size settings
 * - Dark/light mode switching
 * - Mobile responsiveness settings
 * - Navigation preferences (breadcrumbs, tags view)
 * - Dynamic routing configuration
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const appStore = useAppStore()
 * 
 * // Toggle sidebar collapse
 * appStore.setCollapse(!appStore.getCollapse)
 * 
 * // Switch to dark mode
 * appStore.setIsDark(true)
 * 
 * // Change layout
 * appStore.setLayout('top')
 * ```
 */
export const useAppStore = defineStore('app', {
  /**
   * Initial state configuration for the application store
   * @returns {AppState} Initial app state with default values
   */
  state: (): AppState => {
    return {
      sizeMap: ['default', 'large', 'small'],
      mobile: false, // Whether it's mobile device
      title: import.meta.env.VITE_APP_TITLE, // Application title
      pageLoading: false, // Route transition loading
      breadcrumb: true, // Breadcrumb navigation
      breadcrumbIcon: true, // Breadcrumb icons
      collapse: false, // Sidebar collapse state
      uniqueOpened: false, // Only one submenu open at a time
      hamburger: true, // Hamburger menu toggle
      screenfull: true, // Fullscreen toggle
      size: true, // Component size selector
      locale: true, // Language selector
      tagsView: true, // Tags view navigation
      tagsViewIcon: true, // Tags view icons
      logo: true, // Application logo
      fixedHeader: true, // Fixed header
      footer: true, // Footer display
      greyMode: false, // Grey mode for special occasions
      dynamicRouter: true, // Dynamic routing
      serverDynamicRouter: true, // Server-side dynamic routing
      fixedMenu: false, // Fixed menu

      layout: 'classic', // Layout type
      isDark: false, // Dark mode
      currentSize: 'default', // Component size
      theme: {
        // Primary theme color
        elColorPrimary: '#409eff',
        // Left menu border color
        leftMenuBorderColor: 'inherit',
        // Left menu background color
        leftMenuBgColor: '#001529',
        // Left menu light background color
        leftMenuBgLightColor: '#0f2438',
        // Left menu active background color
        leftMenuBgActiveColor: 'var(--el-color-primary)',
        // Left menu collapse active background color
        leftMenuCollapseBgActiveColor: 'var(--el-color-primary)',
        // Left menu text color
        leftMenuTextColor: '#bfcbd9',
        // Left menu active text color
        leftMenuTextActiveColor: '#fff',
        // Logo title text color
        logoTitleTextColor: '#fff',
        // Logo border color
        logoBorderColor: 'inherit',
        // Top header background color
        topHeaderBgColor: '#fff',
        // Top header text color
        topHeaderTextColor: 'inherit',
        // Top header hover color
        topHeaderHoverColor: '#f6f6f6',
        // Top header border color
        topToolBorderColor: '#eee'
      }
    }
  },
  
  /**
   * Computed properties (getters) for accessing application state
   */
  getters: {
    /**
     * Get breadcrumb navigation display state
     * @returns {boolean} Whether breadcrumbs are shown
     */
    getBreadcrumb(): boolean {
      return this.breadcrumb
    },
    
    /**
     * Get breadcrumb icon display state
     * @returns {boolean} Whether breadcrumb icons are shown
     */
    getBreadcrumbIcon(): boolean {
      return this.breadcrumbIcon
    },
    
    /**
     * Get sidebar collapse state
     * @returns {boolean} Whether sidebar is collapsed
     */
    getCollapse(): boolean {
      return this.collapse
    },
    
    /**
     * Get unique opened submenu state
     * @returns {boolean} Whether only one submenu can be open
     */
    getUniqueOpened(): boolean {
      return this.uniqueOpened
    },
    
    /**
     * Get hamburger menu toggle state
     * @returns {boolean} Whether hamburger menu is shown
     */
    getHamburger(): boolean {
      return this.hamburger
    },
    
    /**
     * Get fullscreen toggle button state
     * @returns {boolean} Whether fullscreen toggle is shown
     */
    getScreenfull(): boolean {
      return this.screenfull
    },
    
    /**
     * Get component size selector state
     * @returns {boolean} Whether size selector is shown
     */
    getSize(): boolean {
      return this.size
    },
    
    /**
     * Get language selector state
     * @returns {boolean} Whether language selector is shown
     */
    getLocale(): boolean {
      return this.locale
    },
    
    /**
     * Get tags view navigation state
     * @returns {boolean} Whether tags view is shown
     */
    getTagsView(): boolean {
      return this.tagsView
    },
    
    /**
     * Get tags view icon display state
     * @returns {boolean} Whether tags view icons are shown
     */
    getTagsViewIcon(): boolean {
      return this.tagsViewIcon
    },
    
    /**
     * Get application logo display state
     * @returns {boolean} Whether logo is shown
     */
    getLogo(): boolean {
      return this.logo
    },
    
    /**
     * Get fixed header state
     * @returns {boolean} Whether header is fixed
     */
    getFixedHeader(): boolean {
      return this.fixedHeader
    },
    
    /**
     * Get grey mode state
     * @returns {boolean} Whether grey mode is enabled
     */
    getGreyMode(): boolean {
      return this.greyMode
    },
    
    /**
     * Get dynamic routing state
     * @returns {boolean} Whether dynamic routing is enabled
     */
    getDynamicRouter(): boolean {
      return this.dynamicRouter
    },
    
    /**
     * Get server-side dynamic routing state
     * @returns {boolean} Whether server-side dynamic routing is enabled
     */
    getServerDynamicRouter(): boolean {
      return this.serverDynamicRouter
    },
    
    /**
     * Get fixed menu state
     * @returns {boolean} Whether menu is fixed
     */
    getFixedMenu(): boolean {
      return this.fixedMenu
    },
    
    /**
     * Get page loading state
     * @returns {boolean} Whether page loading is shown
     */
    getPageLoading(): boolean {
      return this.pageLoading
    },
    
    /**
     * Get current layout type
     * @returns {LayoutType} Current layout configuration
     */
    getLayout(): LayoutType {
      return this.layout
    },
    
    /**
     * Get application title
     * @returns {string} Current application title
     */
    getTitle(): string {
      return this.title
    },
    
    /**
     * Get dark mode state
     * @returns {boolean} Whether dark mode is enabled
     */
    getIsDark(): boolean {
      return this.isDark
    },
    
    /**
     * Get current component size
     * @returns {ComponentSize} Current size setting
     */
    getCurrentSize(): ComponentSize {
      return this.currentSize
    },
    
    /**
     * Get available component size options
     * @returns {ComponentSize[]} Array of available sizes
     */
    getSizeMap(): ComponentSize[] {
      return this.sizeMap
    },
    
    /**
     * Get mobile device state
     * @returns {boolean} Whether application is in mobile mode
     */
    getMobile(): boolean {
      return this.mobile
    },
    
    /**
     * Get current theme configuration
     * @returns {ThemeTypes} Theme color and style settings
     */
    getTheme(): ThemeTypes {
      return this.theme
    },
    
    /**
     * Get footer display state
     * @returns {boolean} Whether footer is shown
     */
    getFooter(): boolean {
      return this.footer
    }
  },
  
  /**
   * Actions for modifying application state and performing app-wide operations
   */
  actions: {
    /**
     * Set breadcrumb navigation display state
     * @param {boolean} breadcrumb - Whether to show breadcrumbs
     */
    setBreadcrumb(breadcrumb: boolean) {
      this.breadcrumb = breadcrumb
    },
    
    /**
     * Set breadcrumb icon display state
     * @param {boolean} breadcrumbIcon - Whether to show breadcrumb icons
     */
    setBreadcrumbIcon(breadcrumbIcon: boolean) {
      this.breadcrumbIcon = breadcrumbIcon
    },
    
    /**
     * Set sidebar collapse state
     * @param {boolean} collapse - Whether to collapse sidebar
     */
    setCollapse(collapse: boolean) {
      this.collapse = collapse
    },
    
    /**
     * Set unique opened submenu state
     * @param {boolean} uniqueOpened - Whether only one submenu can be open
     */
    setUniqueOpened(uniqueOpened: boolean) {
      this.uniqueOpened = uniqueOpened
    },
    
    /**
     * Set hamburger menu toggle state
     * @param {boolean} hamburger - Whether to show hamburger menu
     */
    setHamburger(hamburger: boolean) {
      this.hamburger = hamburger
    },
    
    /**
     * Set fullscreen toggle button state
     * @param {boolean} screenfull - Whether to show fullscreen toggle
     */
    setScreenfull(screenfull: boolean) {
      this.screenfull = screenfull
    },
    
    /**
     * Set component size selector state
     * @param {boolean} size - Whether to show size selector
     */
    setSize(size: boolean) {
      this.size = size
    },
    
    /**
     * Set language selector state
     * @param {boolean} locale - Whether to show language selector
     */
    setLocale(locale: boolean) {
      this.locale = locale
    },
    
    /**
     * Set tags view navigation state
     * @param {boolean} tagsView - Whether to show tags view
     */
    setTagsView(tagsView: boolean) {
      this.tagsView = tagsView
    },
    
    /**
     * Set tags view icon display state
     * @param {boolean} tagsViewIcon - Whether to show tags view icons
     */
    setTagsViewIcon(tagsViewIcon: boolean) {
      this.tagsViewIcon = tagsViewIcon
    },
    
    /**
     * Set application logo display state
     * @param {boolean} logo - Whether to show logo
     */
    setLogo(logo: boolean) {
      this.logo = logo
    },
    
    /**
     * Set fixed header state
     * @param {boolean} fixedHeader - Whether to fix header at top
     */
    setFixedHeader(fixedHeader: boolean) {
      this.fixedHeader = fixedHeader
    },
    
    /**
     * Set grey mode state
     * @param {boolean} greyMode - Whether to enable grey mode
     */
    setGreyMode(greyMode: boolean) {
      this.greyMode = greyMode
    },
    
    /**
     * Set dynamic routing state
     * @param {boolean} dynamicRouter - Whether to enable dynamic routing
     */
    setDynamicRouter(dynamicRouter: boolean) {
      this.dynamicRouter = dynamicRouter
    },
    
    /**
     * Set server-side dynamic routing state
     * @param {boolean} serverDynamicRouter - Whether to enable server-side dynamic routing
     */
    setServerDynamicRouter(serverDynamicRouter: boolean) {
      this.serverDynamicRouter = serverDynamicRouter
    },
    
    /**
     * Set fixed menu state
     * @param {boolean} fixedMenu - Whether to fix menu position
     */
    setFixedMenu(fixedMenu: boolean) {
      this.fixedMenu = fixedMenu
    },
    
    /**
     * Set page loading state
     * @param {boolean} pageLoading - Whether to show page loading
     */
    setPageLoading(pageLoading: boolean) {
      this.pageLoading = pageLoading
    },
    
    /**
     * Set application layout type
     * @param {LayoutType} layout - Layout configuration to apply
     * 
     * Note: Mobile devices only support 'classic' layout
     */
    setLayout(layout: LayoutType) {
      if (this.mobile && layout !== 'classic') {
        ElMessage.warning('Mobile mode does not support switching to other layouts')
        return
      }
      this.layout = layout
    },
    
    /**
     * Set application title
     * @param {string} title - New application title
     */
    setTitle(title: string) {
      this.title = title
    },
    
    /**
     * Set dark mode state and apply theme changes
     * @param {boolean} isDark - Whether to enable dark mode
     * 
     * This action:
     * 1. Updates the dark mode state
     * 2. Applies appropriate CSS classes to document
     * 3. Updates primary color light variants
     */
    setIsDark(isDark: boolean) {
      this.isDark = isDark
      if (this.isDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
      this.setPrimaryLight()
    },
    
    /**
     * Set current component size
     * @param {ComponentSize} currentSize - Component size to apply
     */
    setCurrentSize(currentSize: ComponentSize) {
      this.currentSize = currentSize
    },
    
    /**
     * Set mobile device state
     * @param {boolean} mobile - Whether application is in mobile mode
     */
    setMobile(mobile: boolean) {
      this.mobile = mobile
    },
    
    /**
     * Set theme configuration by merging with existing theme
     * @param {ThemeTypes} theme - Theme properties to update
     */
    setTheme(theme: ThemeTypes) {
      this.theme = Object.assign(this.theme, theme)
    },
    
    /**
     * Apply theme configuration to CSS custom properties
     * 
     * This action:
     * 1. Converts theme properties to CSS variables
     * 2. Updates primary color light variants
     */
    setCssVarTheme() {
      for (const key in this.theme) {
        setCssVar(`--${humpToUnderline(key)}`, this.theme[key])
      }
      this.setPrimaryLight()
    },
    
    /**
     * Set footer display state
     * @param {boolean} footer - Whether to show footer
     */
    setFooter(footer: boolean) {
      this.footer = footer
    },
    
    /**
     * Generate primary color light variants based on current theme
     * 
     * This action creates lighter shades of the primary color
     * for use in hover states and secondary elements
     */
    setPrimaryLight() {
      if (this.theme.elColorPrimary) {
        const elColorPrimary = this.theme.elColorPrimary
        const color = this.isDark ? '#000000' : '#ffffff'
        const lightList = [3, 5, 7, 8, 9]
        lightList.forEach((v) => {
          setCssVar(`--el-color-primary-light-${v}`, mix(color, elColorPrimary, v / 10))
        })
        setCssVar(`--el-color-primary-dark-2`, mix(color, elColorPrimary, 0.2))
      }
    },
    
    /**
     * Set menu theme colors based on provided color
     * @param {string} color - Base color for menu theming
     * 
     * This action:
     * 1. Analyzes the color brightness
     * 2. Generates appropriate text and border colors
     * 3. Applies theme to CSS variables
     */
    setMenuTheme(color: string) {
      const primaryColor = useCssVar('--el-color-primary', document.documentElement)
      const isDarkColor = colorIsDark(color)
      const theme: Recordable = {
        // Left menu border color
        leftMenuBorderColor: isDarkColor ? 'inherit' : '#eee',
        // Left menu background color
        leftMenuBgColor: color,
        // Left menu light background color
        leftMenuBgLightColor: isDarkColor ? lighten(color!, 6) : color,
        // Left menu active background color
        leftMenuBgActiveColor: isDarkColor
          ? 'var(--el-color-primary)'
          : hexToRGB(unref(primaryColor) as string, 0.1),
        // Left menu collapse active background color
        leftMenuCollapseBgActiveColor: isDarkColor
          ? 'var(--el-color-primary)'
          : hexToRGB(unref(primaryColor) as string, 0.1),
        // Left menu text color
        leftMenuTextColor: isDarkColor ? '#bfcbd9' : '#333',
        // Left menu active text color
        leftMenuTextActiveColor: isDarkColor ? '#fff' : 'var(--el-color-primary)',
        // Logo title text color
        logoTitleTextColor: isDarkColor ? '#fff' : 'inherit',
        // Logo border color
        logoBorderColor: isDarkColor ? color : '#eee'
      }
      this.setTheme(theme)
      this.setCssVarTheme()
    },
    
    /**
     * Set header theme colors based on provided color
     * @param {string} color - Base color for header theming
     * 
     * This action:
     * 1. Analyzes the color brightness
     * 2. Generates appropriate text and hover colors
     * 3. Updates CSS variables and theme state
     * 4. Applies menu theme if using top layout
     */
    setHeaderTheme(color: string) {
      const isDarkColor = colorIsDark(color)
      const textColor = isDarkColor ? '#fff' : 'inherit'
      const textHoverColor = isDarkColor ? lighten(color!, 6) : '#f6f6f6'
      const topToolBorderColor = isDarkColor ? color : '#eee'
      setCssVar('--top-header-bg-color', color)
      setCssVar('--top-header-text-color', textColor)
      setCssVar('--top-header-hover-color', textHoverColor)
      this.setTheme({
        topHeaderBgColor: color,
        topHeaderTextColor: textColor,
        topHeaderHoverColor: textHoverColor,
        topToolBorderColor
      })
      if (this.getLayout === 'top') {
        this.setMenuTheme(color)
      }
    },
    
    /**
     * Initialize theme configuration on application startup
     * 
     * This action:
     * 1. Sets up dark mode detection
     * 2. Updates application title from environment
     * 3. Applies initial theme settings
     */
    initTheme() {
      const isDark = useDark({
        valueDark: 'dark',
        valueLight: 'light'
      })
      isDark.value = this.getIsDark
      const newTitle = import.meta.env.VITE_APP_TITLE
      newTitle !== this.getTitle && this.setTitle(newTitle)
    }
  },
  
  /**
   * Enable persistence for this store
   * Application state will be automatically saved to localStorage and restored on page reload
   */
  persist: true
})

/**
 * Convenience function to use the app store outside of Vue components
 * 
 * This function provides access to the app store in non-reactive contexts
 * such as utility functions, API interceptors, or other stores.
 * 
 * @returns {ReturnType<typeof useAppStore>} App store instance
 * 
 * @example
 * ```typescript
 * // In a utility function
 * function checkMobileMode() {
 *   const appStore = useAppStoreWithOut()
 *   return appStore.getMobile
 * }
 * 
 * // In an API interceptor
 * const appStore = useAppStoreWithOut()
 * if (appStore.getIsDark) {
 *   // Apply dark mode specific logic
 * }
 * ```
 */
export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
