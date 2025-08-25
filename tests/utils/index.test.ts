import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  withInstall,
  humpToUnderline,
  underlineToHump,
  humpToDash,
  setCssVar,
  getCssVar,
  findIndex,
  trim,
  formatTime,
  toAnyString,
  firstUpperCase,
  objToFormData
} from '../../src/utils/index'

// Mock DOM methods
const mockDocumentElement = {
  style: {
    setProperty: vi.fn(),
    getPropertyValue: vi.fn()
  }
}

const mockGetComputedStyle = vi.fn(() => ({
  getPropertyValue: vi.fn()
}))

// Mock document and window
Object.defineProperty(global, 'document', {
  writable: true,
  value: {
    documentElement: mockDocumentElement
  }
})

Object.defineProperty(global, 'getComputedStyle', {
  writable: true,
  value: mockGetComputedStyle
})

describe('Utils Index', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('withInstall', () => {
    it('should add install method to component', () => {
      const mockComponent = {
        name: 'TestComponent'
      }

      const installedComponent = withInstall(mockComponent)

      expect(installedComponent).toHaveProperty('install')
      expect(typeof installedComponent.install).toBe('function')
    })

    it('should install component with app.component', () => {
      const mockComponent = {
        name: 'TestComponent'
      }
      const mockApp = {
        component: vi.fn(),
        config: {
          globalProperties: {}
        }
      }

      const installedComponent = withInstall(mockComponent)
      installedComponent.install(mockApp)

      expect(mockApp.component).toHaveBeenCalledWith('TestComponent', mockComponent)
    })

    it('should add alias to global properties if provided', () => {
      const mockComponent = {
        name: 'TestComponent'
      }
      const mockApp = {
        component: vi.fn(),
        config: {
          globalProperties: {}
        }
      }

      const installedComponent = withInstall(mockComponent, '$test')
      installedComponent.install(mockApp)

      expect(mockApp.config.globalProperties.$test).toBe(mockComponent)
    })

    it('should use displayName if name is not available', () => {
      const mockComponent = {
        displayName: 'TestDisplayName'
      }
      const mockApp = {
        component: vi.fn(),
        config: {
          globalProperties: {}
        }
      }

      const installedComponent = withInstall(mockComponent)
      installedComponent.install(mockApp)

      expect(mockApp.component).toHaveBeenCalledWith('TestDisplayName', mockComponent)
    })
  })

  describe('humpToUnderline', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(humpToUnderline('camelCase')).toBe('-camel-case')
      expect(humpToUnderline('PascalCase')).toBe('-pascal-case')
      expect(humpToUnderline('simpleWord')).toBe('-simple-word')
    })

    it('should handle single words', () => {
      expect(humpToUnderline('word')).toBe('word')
      expect(humpToUnderline('Word')).toBe('-word')
    })

    it('should handle empty string', () => {
      expect(humpToUnderline('')).toBe('')
    })

    it('should handle strings with multiple consecutive capitals', () => {
      expect(humpToUnderline('XMLParser')).toBe('-x-m-l-parser')
    })
  })

  describe('underlineToHump', () => {
    it('should convert kebab-case to camelCase', () => {
      expect(underlineToHump('kebab-case')).toBe('kebabCase')
      expect(underlineToHump('multiple-word-string')).toBe('multipleWordString')
      expect(underlineToHump('single')).toBe('single')
    })

    it('should handle empty string', () => {
      expect(underlineToHump('')).toBe('')
    })

    it('should handle strings with consecutive dashes', () => {
      expect(underlineToHump('multiple--dashes')).toBe('multipleDashes')
    })

    it('should handle strings starting with dash', () => {
      expect(underlineToHump('-leading-dash')).toBe('LeadingDash')
    })
  })

  describe('humpToDash', () => {
    it('should convert camelCase to dash-case', () => {
      expect(humpToDash('camelCase')).toBe('-camel-case')
      expect(humpToDash('PascalCase')).toBe('-pascal-case')
    })

    it('should handle single words', () => {
      expect(humpToDash('word')).toBe('word')
    })
  })

  describe('setCssVar and getCssVar', () => {
    it('should set CSS custom property', () => {
      setCssVar('--test-color', '#ffffff')

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith('--test-color', '#ffffff')
    })

    it('should set CSS custom property on custom element', () => {
      const customElement = {
        style: {
          setProperty: vi.fn()
        }
      }

      setCssVar('--test-color', '#ffffff', customElement as any)

      expect(customElement.style.setProperty).toHaveBeenCalledWith('--test-color', '#ffffff')
    })

    it('should get CSS custom property', () => {
      mockGetComputedStyle.mockReturnValue({
        getPropertyValue: vi.fn().mockReturnValue('#ffffff')
      })

      const result = getCssVar('--test-color')

      expect(mockGetComputedStyle).toHaveBeenCalledWith(mockDocumentElement)
      expect(result).toBe('#ffffff')
    })
  })

  describe('findIndex', () => {
    it('should find index using native findIndex if available', () => {
      const array = [1, 2, 3, 4, 5]
      const predicate = (item: number) => item === 3

      const result = findIndex(array, predicate)

      expect(result).toBe(2)
    })

    it('should find index using fallback implementation', () => {
      const array = [{ id: 1 }, { id: 2 }, { id: 3 }]
      // Mock array without findIndex
      const arrayWithoutFindIndex = { ...array, findIndex: undefined }
      Object.setPrototypeOf(arrayWithoutFindIndex, Array.prototype)

      const predicate = (item: any) => item.id === 2

      const result = findIndex(arrayWithoutFindIndex as any, predicate)

      expect(result).toBe(1)
    })

    it('should return -1 if item not found', () => {
      const array = [1, 2, 3]
      const predicate = (item: number) => item === 5

      const result = findIndex(array, predicate)

      expect(result).toBe(-1)
    })
  })

  describe('trim', () => {
    it('should remove leading and trailing whitespace', () => {
      expect(trim('  hello world  ')).toBe('hello world')
      expect(trim('\t\n  test  \t\n')).toBe('test')
    })

    it('should handle strings without whitespace', () => {
      expect(trim('hello')).toBe('hello')
    })

    it('should handle empty string', () => {
      expect(trim('')).toBe('')
    })

    it('should handle string with only whitespace', () => {
      expect(trim('   ')).toBe('')
    })
  })

  describe('formatTime', () => {
    it('should format date with default format', () => {
      const date = new Date('2023-12-25 15:30:45')
      const result = formatTime(date, 'yyyy-MM-dd HH:mm:ss')

      expect(result).toBe('2023-12-25 15:30:45')
    })

    it('should format date with custom format', () => {
      const date = new Date('2023-12-25 15:30:45')
      const result = formatTime(date, 'MM/dd/yyyy')

      expect(result).toBe('12/25/2023')
    })

    it('should handle timestamp input', () => {
      const timestamp = new Date('2023-12-25 15:30:45').getTime()
      const result = formatTime(timestamp, 'yyyy-MM-dd')

      expect(result).toBe('2023-12-25')
    })

    it('should handle string date input', () => {
      const result = formatTime('2023-12-25', 'yyyy-MM-dd')

      expect(result).toBe('2023-12-25')
    })

    it('should return empty string for null/undefined', () => {
      expect(formatTime(null, 'yyyy-MM-dd')).toBe('')
      expect(formatTime(undefined, 'yyyy-MM-dd')).toBe('')
    })

    it('should format with milliseconds', () => {
      const date = new Date('2023-12-25 15:30:45.123')
      const result = formatTime(date, 'yyyy-MM-dd HH:mm:ss.S')

      expect(result).toBe('2023-12-25 15:30:45.123')
    })

    it('should format with quarters', () => {
      const date = new Date('2023-06-15')
      const result = formatTime(date, 'yyyy-qq')

      expect(result).toBe('2023-02')
    })
  })

  describe('toAnyString', () => {
    it('should generate random string with expected pattern', () => {
      const result = toAnyString()

      expect(result).toMatch(/^\d+-\d+-4\d+-[89ab]\d+-\d+$/)
      expect(result).toHaveLength(23) // 5+1+5+1+5+1+5+1+5 = 23
    })

    it('should generate different strings on multiple calls', () => {
      const result1 = toAnyString()
      const result2 = toAnyString()

      expect(result1).not.toBe(result2)
    })
  })

  describe('firstUpperCase', () => {
    it('should capitalize first letter of each word', () => {
      expect(firstUpperCase('hello world')).toBe('Hello World')
      expect(firstUpperCase('this is a test')).toBe('This Is A Test')
    })

    it('should handle single word', () => {
      expect(firstUpperCase('hello')).toBe('Hello')
    })

    it('should handle empty string', () => {
      expect(firstUpperCase('')).toBe('')
    })

    it('should handle mixed case input', () => {
      expect(firstUpperCase('hELLo WoRLD')).toBe('Hello World')
    })

    it('should handle words with numbers', () => {
      expect(firstUpperCase('hello123 world456')).toBe('Hello123 World456')
    })
  })

  describe('objToFormData', () => {
    it('should convert object to FormData', () => {
      const mockFormData = {
        append: vi.fn()
      }
      global.FormData = vi.fn(() => mockFormData) as any

      const obj = {
        name: 'John',
        age: 30,
        city: 'New York'
      }

      const result = objToFormData(obj)

      expect(FormData).toHaveBeenCalled()
      expect(mockFormData.append).toHaveBeenCalledWith('name', 'John')
      expect(mockFormData.append).toHaveBeenCalledWith('age', 30)
      expect(mockFormData.append).toHaveBeenCalledWith('city', 'New York')
      expect(result).toBe(mockFormData)
    })

    it('should handle empty object', () => {
      const mockFormData = {
        append: vi.fn()
      }
      global.FormData = vi.fn(() => mockFormData) as any

      const result = objToFormData({})

      expect(FormData).toHaveBeenCalled()
      expect(mockFormData.append).not.toHaveBeenCalled()
      expect(result).toBe(mockFormData)
    })

    it('should handle object with null and undefined values', () => {
      const mockFormData = {
        append: vi.fn()
      }
      global.FormData = vi.fn(() => mockFormData) as any

      const obj = {
        name: 'John',
        age: null,
        city: undefined,
        active: false
      }

      objToFormData(obj)

      expect(mockFormData.append).toHaveBeenCalledWith('name', 'John')
      expect(mockFormData.append).toHaveBeenCalledWith('age', null)
      expect(mockFormData.append).toHaveBeenCalledWith('city', undefined)
      expect(mockFormData.append).toHaveBeenCalledWith('active', false)
    })
  })
})
