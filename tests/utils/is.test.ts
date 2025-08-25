import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  is,
  isDef,
  isUnDef,
  isObject,
  isEmpty,
  isDate,
  isNull,
  isNullAndUnDef,
  isNullOrUnDef,
  isNumber,
  isPromise,
  isString,
  isFunction,
  isBoolean,
  isRegExp,
  isArray,
  isWindow,
  isElement,
  isMap,
  isServer,
  isClient,
  isUrl,
  isDark,
  isImgPath,
  isEmptyVal
} from '../../src/utils/is'

// Mock window and document for testing
const mockWindow = {
  matchMedia: vi.fn()
}

Object.defineProperty(global, 'window', {
  writable: true,
  value: mockWindow
})

describe('Type Checking Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('is', () => {
    it('should check object type correctly', () => {
      expect(is('hello', 'String')).toBe(true)
      expect(is(123, 'Number')).toBe(true)
      expect(is(true, 'Boolean')).toBe(true)
      expect(is([], 'Array')).toBe(true)
      expect(is({}, 'Object')).toBe(true)
      expect(is(null, 'Null')).toBe(true)
      expect(is(undefined, 'Undefined')).toBe(true)
    })

    it('should return false for incorrect type', () => {
      expect(is('hello', 'Number')).toBe(false)
      expect(is(123, 'String')).toBe(false)
      expect(is([], 'Object')).toBe(false)
    })
  })

  describe('isDef', () => {
    it('should return true for defined values', () => {
      expect(isDef('hello')).toBe(true)
      expect(isDef(0)).toBe(true)
      expect(isDef(false)).toBe(true)
      expect(isDef(null)).toBe(true)
      expect(isDef([])).toBe(true)
      expect(isDef({})).toBe(true)
    })

    it('should return false for undefined', () => {
      expect(isDef(undefined)).toBe(false)
    })
  })

  describe('isUnDef', () => {
    it('should return true for undefined', () => {
      expect(isUnDef(undefined)).toBe(true)
    })

    it('should return false for defined values', () => {
      expect(isUnDef('hello')).toBe(false)
      expect(isUnDef(0)).toBe(false)
      expect(isUnDef(null)).toBe(false)
      expect(isUnDef(false)).toBe(false)
    })
  })

  describe('isObject', () => {
    it('should return true for plain objects', () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ key: 'value' })).toBe(true)
    })

    it('should return false for non-objects', () => {
      expect(isObject(null)).toBe(false)
      expect(isObject([])).toBe(false)
      expect(isObject('string')).toBe(false)
      expect(isObject(123)).toBe(false)
      expect(isObject(true)).toBe(false)
      expect(isObject(undefined)).toBe(false)
    })
  })

  describe('isEmpty', () => {
    it('should return true for empty arrays', () => {
      expect(isEmpty([])).toBe(true)
    })

    it('should return false for non-empty arrays', () => {
      expect(isEmpty([1, 2, 3])).toBe(false)
      expect(isEmpty(['a'])).toBe(false)
    })

    it('should return true for empty strings', () => {
      expect(isEmpty('')).toBe(true)
    })

    it('should return false for non-empty strings', () => {
      expect(isEmpty('hello')).toBe(false)
      expect(isEmpty(' ')).toBe(false)
    })

    it('should return true for empty Maps', () => {
      expect(isEmpty(new Map())).toBe(true)
    })

    it('should return false for non-empty Maps', () => {
      const map = new Map()
      map.set('key', 'value')
      expect(isEmpty(map)).toBe(false)
    })

    it('should return true for empty Sets', () => {
      expect(isEmpty(new Set())).toBe(true)
    })

    it('should return false for non-empty Sets', () => {
      const set = new Set()
      set.add('value')
      expect(isEmpty(set)).toBe(false)
    })

    it('should return true for empty objects', () => {
      expect(isEmpty({})).toBe(true)
    })

    it('should return false for non-empty objects', () => {
      expect(isEmpty({ key: 'value' })).toBe(false)
    })

    it('should return false for other types', () => {
      expect(isEmpty(123)).toBe(false)
      expect(isEmpty(true)).toBe(false)
      expect(isEmpty(null)).toBe(false)
    })
  })

  describe('isDate', () => {
    it('should return true for Date objects', () => {
      expect(isDate(new Date())).toBe(true)
      expect(isDate(new Date('2023-12-25'))).toBe(true)
    })

    it('should return false for non-Date values', () => {
      expect(isDate('2023-12-25')).toBe(false)
      expect(isDate(123456789)).toBe(false)
      expect(isDate({})).toBe(false)
      expect(isDate(null)).toBe(false)
    })
  })

  describe('isNull', () => {
    it('should return true for null', () => {
      expect(isNull(null)).toBe(true)
    })

    it('should return false for non-null values', () => {
      expect(isNull(undefined)).toBe(false)
      expect(isNull(0)).toBe(false)
      expect(isNull('')).toBe(false)
      expect(isNull(false)).toBe(false)
    })
  })

  describe('isNullAndUnDef', () => {
    it('should return true only when both null and undefined', () => {
      // This function checks if value is both null AND undefined
      // which is logically impossible for a single value
      expect(isNullAndUnDef(null)).toBe(false)
      expect(isNullAndUnDef(undefined)).toBe(false)
    })

    it('should return false for all other values', () => {
      expect(isNullAndUnDef('hello')).toBe(false)
      expect(isNullAndUnDef(0)).toBe(false)
      expect(isNullAndUnDef(false)).toBe(false)
    })
  })

  describe('isNullOrUnDef', () => {
    it('should return true for null or undefined', () => {
      expect(isNullOrUnDef(null)).toBe(true)
      expect(isNullOrUnDef(undefined)).toBe(true)
    })

    it('should return false for other values', () => {
      expect(isNullOrUnDef('hello')).toBe(false)
      expect(isNullOrUnDef(0)).toBe(false)
      expect(isNullOrUnDef(false)).toBe(false)
      expect(isNullOrUnDef([])).toBe(false)
    })
  })

  describe('isNumber', () => {
    it('should return true for numbers', () => {
      expect(isNumber(123)).toBe(true)
      expect(isNumber(0)).toBe(true)
      expect(isNumber(-123)).toBe(true)
      expect(isNumber(3.14)).toBe(true)
      expect(isNumber(Infinity)).toBe(true)
      expect(isNumber(NaN)).toBe(true)
    })

    it('should return false for non-numbers', () => {
      expect(isNumber('123')).toBe(false)
      expect(isNumber('hello')).toBe(false)
      expect(isNumber(true)).toBe(false)
      expect(isNumber(null)).toBe(false)
    })
  })

  describe('isPromise', () => {
    it('should return true for Promise objects', () => {
      expect(isPromise(Promise.resolve())).toBe(true)
      expect(isPromise(Promise.reject().catch(() => {}))).toBe(true)
      expect(isPromise(new Promise(() => {}))).toBe(true)
    })

    it('should return true for thenable objects', () => {
      const thenable = {
        then: () => {},
        catch: () => {}
      }
      expect(isPromise(thenable)).toBe(true)
    })

    it('should return false for non-Promise objects', () => {
      expect(isPromise({})).toBe(false)
      expect(isPromise({ then: 'not a function' })).toBe(false)
      expect(isPromise({ then: () => {} })).toBe(false) // missing catch
      expect(isPromise('hello')).toBe(false)
      expect(isPromise(123)).toBe(false)
    })
  })

  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('hello')).toBe(true)
      expect(isString('')).toBe(true)
      expect(isString('123')).toBe(true)
    })

    it('should return false for non-strings', () => {
      expect(isString(123)).toBe(false)
      expect(isString(true)).toBe(false)
      expect(isString(null)).toBe(false)
      expect(isString({})).toBe(false)
    })
  })

  describe('isFunction', () => {
    it('should return true for functions', () => {
      expect(isFunction(() => {})).toBe(true)
      expect(isFunction(function () {})).toBe(true)
      expect(isFunction(async () => {})).toBe(true)
      expect(isFunction(console.log)).toBe(true)
    })

    it('should return false for non-functions', () => {
      expect(isFunction('hello')).toBe(false)
      expect(isFunction(123)).toBe(false)
      expect(isFunction({})).toBe(false)
      expect(isFunction(null)).toBe(false)
    })
  })

  describe('isBoolean', () => {
    it('should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true)
      expect(isBoolean(false)).toBe(true)
    })

    it('should return false for non-booleans', () => {
      expect(isBoolean('true')).toBe(false)
      expect(isBoolean(1)).toBe(false)
      expect(isBoolean(0)).toBe(false)
      expect(isBoolean(null)).toBe(false)
    })
  })

  describe('isRegExp', () => {
    it('should return true for RegExp objects', () => {
      expect(isRegExp(/test/)).toBe(true)
      expect(isRegExp(new RegExp('test'))).toBe(true)
      expect(isRegExp(/test/gi)).toBe(true)
    })

    it('should return false for non-RegExp values', () => {
      expect(isRegExp('/test/')).toBe(false)
      expect(isRegExp('test')).toBe(false)
      expect(isRegExp({})).toBe(false)
      expect(isRegExp(null)).toBe(false)
    })
  })

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true)
      expect(isArray([1, 2, 3])).toBe(true)
      expect(isArray(new Array())).toBe(true)
    })

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false)
      expect(isArray('hello')).toBe(false)
      expect(isArray(null)).toBe(false)
      expect(isArray(undefined)).toBe(false)
    })

    it('should return false for falsy values', () => {
      expect(isArray(null)).toBe(false)
      expect(isArray(undefined)).toBe(false)
      expect(isArray(false)).toBe(false)
    })
  })

  describe('isWindow', () => {
    it('should return true for window object when window is available', () => {
      // Mock window object
      const mockWindowObj = {}
      Object.defineProperty(mockWindowObj, Symbol.toStringTag, {
        value: 'Window'
      })

      expect(isWindow(mockWindowObj)).toBe(true)
    })

    it('should return false for non-window objects', () => {
      expect(isWindow({})).toBe(false)
      expect(isWindow(null)).toBe(false)
      expect(isWindow('window')).toBe(false)
    })
  })

  describe('isElement', () => {
    it('should return true for DOM elements', () => {
      const mockElement = {
        tagName: 'DIV',
        nodeType: 1
      }
      expect(isElement(mockElement)).toBe(true)
    })

    it('should return false for non-elements', () => {
      expect(isElement({})).toBe(false)
      expect(isElement({ tagName: undefined })).toBe(false)
      expect(isElement('div')).toBe(false)
      expect(isElement(null)).toBe(false)
    })
  })

  describe('isMap', () => {
    it('should return true for Map objects', () => {
      expect(isMap(new Map())).toBe(true)
      expect(isMap(new Map([['key', 'value']]))).toBe(true)
    })

    it('should return false for non-Map objects', () => {
      expect(isMap({})).toBe(false)
      expect(isMap([])).toBe(false)
      expect(isMap(new Set())).toBe(false)
      expect(isMap(null)).toBe(false)
    })
  })

  describe('isServer and isClient', () => {
    it('should correctly identify server/client environment', () => {
      // In vitest environment, window is undefined initially
      if (typeof window === 'undefined') {
        expect(isServer).toBe(true)
        expect(isClient).toBe(false)
      } else {
        expect(isServer).toBe(false)
        expect(isClient).toBe(true)
      }
    })
  })

  describe('isUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isUrl('https://example.com')).toBe(true)
      expect(isUrl('http://example.com')).toBe(true)
      expect(isUrl('https://example.com/path')).toBe(true)
      expect(isUrl('https://example.com:8080')).toBe(true)
      expect(isUrl('ftp://example.com')).toBe(true)
    })

    it('should return false for invalid URLs', () => {
      expect(isUrl('example.com')).toBe(false)
      expect(isUrl('not-a-url')).toBe(false)
      expect(isUrl('')).toBe(false)
      expect(isUrl('http://')).toBe(false)
    })

    it('should handle relative paths', () => {
      expect(isUrl('/path/to/resource')).toBe(false)
      expect(isUrl('./relative/path')).toBe(false)
    })
  })

  describe('isDark', () => {
    it('should return true when prefers-color-scheme is dark', () => {
      mockWindow.matchMedia.mockReturnValue({ matches: true })

      expect(isDark()).toBe(true)
      expect(mockWindow.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
    })

    it('should return false when prefers-color-scheme is not dark', () => {
      mockWindow.matchMedia.mockReturnValue({ matches: false })

      expect(isDark()).toBe(false)
      expect(mockWindow.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
    })
  })

  describe('isImgPath', () => {
    it('should return true for image URLs', () => {
      expect(isImgPath('https://example.com/image.png')).toBe(true)
      expect(isImgPath('https://example.com/image.jpg')).toBe(true)
      expect(isImgPath('https://example.com/image.jpeg')).toBe(true)
      expect(isImgPath('https://example.com/image.gif')).toBe(true)
      expect(isImgPath('https://example.com/image.svg')).toBe(true)
      expect(isImgPath('https://example.com/image.webp')).toBe(true)
      expect(isImgPath('https://example.com/image.ico')).toBe(true)
    })

    it('should return true for data URLs', () => {
      expect(isImgPath('data:image/png;base64,iVBORw0KGgoAAAANSU')).toBe(true)
      expect(isImgPath('data:image/jpeg;base64,/9j/4AAQSkZJRgABA')).toBe(true)
    })

    it('should return false for non-image URLs', () => {
      expect(isImgPath('https://example.com/document.pdf')).toBe(false)
      expect(isImgPath('https://example.com/script.js')).toBe(false)
      expect(isImgPath('https://example.com/')).toBe(false)
      expect(isImgPath('not-a-url')).toBe(false)
      expect(isImgPath('')).toBe(false)
    })

    it('should handle case insensitive extensions', () => {
      expect(isImgPath('https://example.com/IMAGE.PNG')).toBe(true)
      expect(isImgPath('https://example.com/Image.Jpg')).toBe(true)
    })
  })

  describe('isEmptyVal', () => {
    it('should return true for empty values', () => {
      expect(isEmptyVal('')).toBe(true)
      expect(isEmptyVal(null)).toBe(true)
      expect(isEmptyVal(undefined)).toBe(true)
    })

    it('should return false for non-empty values', () => {
      expect(isEmptyVal('hello')).toBe(false)
      expect(isEmptyVal(0)).toBe(false)
      expect(isEmptyVal(false)).toBe(false)
      expect(isEmptyVal([])).toBe(false)
      expect(isEmptyVal({})).toBe(false)
      expect(isEmptyVal(' ')).toBe(false) // space is not empty
    })
  })
})
