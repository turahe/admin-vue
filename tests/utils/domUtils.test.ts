import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  hasClass,
  addClass,
  removeClass,
  getBoundingClientRect,
  getViewportOffset,
  on,
  off,
  once,
  getStyle,
  setStyle,
  isScroll,
  getScrollContainer,
  isInContainer
} from '../../src/utils/domUtils'

// Mock DOM environment
const createMockElement = (overrides = {}) => ({
  className: '',
  classList: {
    contains: vi.fn(),
    add: vi.fn(),
    remove: vi.fn()
  },
  getBoundingClientRect: vi.fn(() => ({
    left: 0,
    top: 0,
    right: 100,
    bottom: 100,
    width: 100,
    height: 100
  })),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  style: {},
  currentStyle: {},
  filters: {
    item: vi.fn(() => ({ opacity: 100 }))
  },
  parentNode: null,
  tagName: 'DIV',
  ...overrides
})

const mockDocument = {
  documentElement: {
    scrollLeft: 0,
    scrollTop: 0,
    clientLeft: 0,
    clientTop: 0,
    clientWidth: 1024,
    clientHeight: 768
  },
  defaultView: {
    getComputedStyle: vi.fn(() => ({}))
  }
}

const mockWindow = {
  pageXOffset: 0,
  pageYOffset: 0,
  document: mockDocument,
  innerWidth: 1024,
  innerHeight: 768
}

Object.defineProperty(global, 'document', {
  writable: true,
  value: mockDocument
})

Object.defineProperty(global, 'window', {
  writable: true,
  value: mockWindow
})

describe('DOM Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('hasClass', () => {
    it('should return true if element has class (using classList)', () => {
      const element = createMockElement()
      element.classList.contains.mockReturnValue(true)

      const result = hasClass(element as any, 'test-class')

      expect(element.classList.contains).toHaveBeenCalledWith('test-class')
      expect(result).toBe(true)
    })

    it('should return false if element does not have class (using classList)', () => {
      const element = createMockElement()
      element.classList.contains.mockReturnValue(false)

      const result = hasClass(element as any, 'test-class')

      expect(result).toBe(false)
    })

    it('should fallback to className string check when classList is not available', () => {
      const element = createMockElement({
        classList: null,
        className: 'class1 test-class class2'
      })

      const result = hasClass(element as any, 'test-class')

      expect(result).toBe(true)
    })

    it('should return false for className string check when class not found', () => {
      const element = createMockElement({
        classList: null,
        className: 'class1 class2'
      })

      const result = hasClass(element as any, 'test-class')

      expect(result).toBe(false)
    })

    it('should return false for invalid inputs', () => {
      expect(hasClass(null as any, 'test-class')).toBe(false)
      expect(hasClass(createMockElement() as any, '')).toBe(false)
      expect(hasClass(null as any, '')).toBe(false)
    })

    it('should throw error for class names with spaces', () => {
      const element = createMockElement()

      expect(() => {
        hasClass(element as any, 'class with space')
      }).toThrow('className should not contain space.')
    })
  })

  describe('addClass', () => {
    it('should add class using classList', () => {
      const element = createMockElement()

      addClass(element as any, 'new-class')

      expect(element.classList.add).toHaveBeenCalledWith('new-class')
    })

    it('should add multiple classes using classList', () => {
      const element = createMockElement()

      addClass(element as any, 'class1 class2 class3')

      expect(element.classList.add).toHaveBeenCalledWith('class1')
      expect(element.classList.add).toHaveBeenCalledWith('class2')
      expect(element.classList.add).toHaveBeenCalledWith('class3')
    })

    it('should fallback to className manipulation when classList not available', () => {
      const element = createMockElement({
        classList: null,
        className: 'existing-class'
      })
      element.hasClass = vi.fn().mockReturnValue(false)

      addClass(element as any, 'new-class')

      expect(element.className).toBe('existing-class new-class')
    })

    it('should not add duplicate classes when using className', () => {
      const element = createMockElement({
        classList: null,
        className: 'existing-class'
      })

      // Mock hasClass to return true for existing-class
      const originalHasClass = hasClass
      vi.mocked(hasClass).mockImplementation((el, cls) => (cls === 'existing-class' ? true : false))

      addClass(element as any, 'existing-class new-class')

      expect(element.className).toBe('existing-class new-class')
    })

    it('should handle empty element', () => {
      expect(() => addClass(null as any, 'test-class')).not.toThrow()
    })

    it('should skip empty class names', () => {
      const element = createMockElement()

      addClass(element as any, 'class1  class2') // extra spaces

      expect(element.classList.add).toHaveBeenCalledWith('class1')
      expect(element.classList.add).toHaveBeenCalledWith('class2')
    })
  })

  describe('removeClass', () => {
    it('should remove class using classList', () => {
      const element = createMockElement()

      removeClass(element as any, 'remove-class')

      expect(element.classList.remove).toHaveBeenCalledWith('remove-class')
    })

    it('should remove multiple classes using classList', () => {
      const element = createMockElement()

      removeClass(element as any, 'class1 class2')

      expect(element.classList.remove).toHaveBeenCalledWith('class1')
      expect(element.classList.remove).toHaveBeenCalledWith('class2')
    })

    it('should fallback to className manipulation when classList not available', () => {
      const element = createMockElement({
        classList: null,
        className: 'class1 remove-me class2'
      })

      removeClass(element as any, 'remove-me')

      expect(element.className).toBe('class1 class2')
    })

    it('should handle empty element or class', () => {
      expect(() => removeClass(null as any, 'test-class')).not.toThrow()
      expect(() => removeClass(createMockElement() as any, '')).not.toThrow()
    })
  })

  describe('getBoundingClientRect', () => {
    it('should return DOMRect when element has getBoundingClientRect', () => {
      const mockRect = { left: 10, top: 20, width: 100, height: 50 }
      const element = createMockElement()
      element.getBoundingClientRect.mockReturnValue(mockRect)

      const result = getBoundingClientRect(element as any)

      expect(result).toBe(mockRect)
      expect(element.getBoundingClientRect).toHaveBeenCalled()
    })

    it('should return 0 for invalid element', () => {
      expect(getBoundingClientRect(null as any)).toBe(0)
      expect(getBoundingClientRect(undefined as any)).toBe(0)
    })

    it('should return 0 for element without getBoundingClientRect', () => {
      const element = { someProperty: 'value' }

      expect(getBoundingClientRect(element as any)).toBe(0)
    })
  })

  describe('getViewportOffset', () => {
    it('should calculate viewport offset correctly', () => {
      const element = createMockElement()
      element.getBoundingClientRect.mockReturnValue({
        left: 50,
        top: 100,
        width: 200,
        height: 150
      })

      const result = getViewportOffset(element as any)

      expect(result).toEqual({
        left: 50,
        top: 100,
        right: 1024 - 200 - 50, // clientWidth - width - left = 774
        bottom: 768 - 150 - 100, // clientHeight - height - top = 518
        rightIncludeBody: 1024 - 50, // clientWidth - left = 974
        bottomIncludeBody: 768 - 100 // clientHeight - top = 668
      })
    })

    it('should handle scrolled viewport', () => {
      // Mock scrolled document
      mockDocument.documentElement.scrollLeft = 100
      mockDocument.documentElement.scrollTop = 50
      mockWindow.pageXOffset = 100
      mockWindow.pageYOffset = 50

      const element = createMockElement()
      element.getBoundingClientRect.mockReturnValue({
        left: 150,
        top: 200,
        width: 100,
        height: 100
      })

      const result = getViewportOffset(element as any)

      expect(result.left).toBe(150) // Element position relative to viewport
      expect(result.top).toBe(200)
    })
  })

  describe('on, off, once', () => {
    it('should add event listener', () => {
      const element = createMockElement()
      const handler = vi.fn()

      on(element as any, 'click', handler)

      expect(element.addEventListener).toHaveBeenCalledWith('click', handler, false)
    })

    it('should remove event listener', () => {
      const element = createMockElement()
      const handler = vi.fn()

      off(element as any, 'click', handler)

      expect(element.removeEventListener).toHaveBeenCalledWith('click', handler, false)
    })

    it('should add one-time event listener', () => {
      const element = createMockElement()
      const handler = vi.fn()

      once(element as any, 'click', handler)

      expect(element.addEventListener).toHaveBeenCalled()

      // Simulate event firing
      const addedListener = element.addEventListener.mock.calls[0][1]
      addedListener()

      expect(handler).toHaveBeenCalled()
      expect(element.removeEventListener).toHaveBeenCalled()
    })

    it('should handle invalid elements gracefully', () => {
      expect(() => on(null as any, 'click', vi.fn())).not.toThrow()
      expect(() => off(null as any, 'click', vi.fn())).not.toThrow()
    })
  })

  describe('getStyle and setStyle', () => {
    it('should get computed style for modern browsers', () => {
      const element = createMockElement()
      const computedStyle = { color: 'red', fontSize: '16px' }
      mockDocument.defaultView.getComputedStyle.mockReturnValue(computedStyle)

      const result = getStyle(element as any, 'color')

      expect(mockDocument.defaultView.getComputedStyle).toHaveBeenCalledWith(element, '')
      expect(result).toBe('red')
    })

    it('should handle cssFloat property', () => {
      const element = createMockElement()
      element.style.cssFloat = 'left'
      mockDocument.defaultView.getComputedStyle.mockReturnValue({ cssFloat: 'left' })

      const result = getStyle(element as any, 'float')

      expect(result).toBe('left')
    })

    it('should set single style property', () => {
      const element = createMockElement()

      setStyle(element as any, 'color', 'red')

      expect(element.style.color).toBe('red')
    })

    it('should set multiple style properties', () => {
      const element = createMockElement()

      setStyle(element as any, {
        color: 'red',
        fontSize: '16px',
        marginTop: '10px'
      })

      expect(element.style.color).toBe('red')
      expect(element.style.fontSize).toBe('16px')
      expect(element.style.marginTop).toBe('10px')
    })

    it('should handle invalid inputs gracefully', () => {
      expect(() => getStyle(null as any, 'color')).not.toThrow()
      expect(() => setStyle(null as any, 'color', 'red')).not.toThrow()
    })
  })

  describe('isScroll', () => {
    it('should detect scrollable element', () => {
      const element = createMockElement()
      mockDocument.defaultView.getComputedStyle.mockReturnValue({
        overflow: 'scroll'
      })

      const result = isScroll(element as any, null)

      expect(result).toBeTruthy()
    })

    it('should detect auto overflow', () => {
      const element = createMockElement()
      mockDocument.defaultView.getComputedStyle.mockReturnValue({
        overflow: 'auto'
      })

      const result = isScroll(element as any, null)

      expect(result).toBeTruthy()
    })

    it('should return false for visible overflow', () => {
      const element = createMockElement()
      mockDocument.defaultView.getComputedStyle.mockReturnValue({
        overflow: 'visible'
      })

      const result = isScroll(element as any, null)

      expect(result).toBeFalsy()
    })

    it('should check specific direction', () => {
      const element = createMockElement()
      mockDocument.defaultView.getComputedStyle.mockReturnValue({
        'overflow-y': 'scroll',
        'overflow-x': 'hidden'
      })

      const resultY = isScroll(element as any, true)
      const resultX = isScroll(element as any, false)

      expect(resultY).toBeTruthy()
      expect(resultX).toBeFalsy()
    })
  })

  describe('getScrollContainer', () => {
    it('should return window for document elements', () => {
      const result = getScrollContainer(mockDocument.documentElement as any)

      expect(result).toBe(window)
    })

    it('should find scrollable parent', () => {
      const scrollableParent = createMockElement()
      const element = createMockElement({
        parentNode: scrollableParent
      })

      mockDocument.defaultView.getComputedStyle.mockImplementation((el) => {
        if (el === scrollableParent) {
          return { overflow: 'scroll' }
        }
        return { overflow: 'visible' }
      })

      const result = getScrollContainer(element as any)

      expect(result).toBe(scrollableParent)
    })

    it('should return window if no scrollable parent found', () => {
      const parent = createMockElement({ parentNode: null })
      const element = createMockElement({ parentNode: parent })

      mockDocument.defaultView.getComputedStyle.mockReturnValue({
        overflow: 'visible'
      })

      const result = getScrollContainer(element as any)

      expect(result).toBe(window)
    })
  })

  describe('isInContainer', () => {
    it('should check if element is in window container', () => {
      const element = createMockElement()
      element.getBoundingClientRect.mockReturnValue({
        top: 100,
        bottom: 200,
        left: 50,
        right: 150
      })

      const result = isInContainer(element as any, window)

      expect(result).toBe(true)
    })

    it('should check if element is outside window container', () => {
      const element = createMockElement()
      element.getBoundingClientRect.mockReturnValue({
        top: 1000,
        bottom: 1100,
        left: 50,
        right: 150
      })

      const result = isInContainer(element as any, window)

      expect(result).toBe(false)
    })

    it('should check if element is in custom container', () => {
      const container = createMockElement()
      container.getBoundingClientRect.mockReturnValue({
        top: 0,
        bottom: 500,
        left: 0,
        right: 500
      })

      const element = createMockElement()
      element.getBoundingClientRect.mockReturnValue({
        top: 100,
        bottom: 200,
        left: 50,
        right: 150
      })

      const result = isInContainer(element as any, container)

      expect(result).toBe(true)
    })

    it('should return false for invalid inputs', () => {
      expect(isInContainer(null as any, window)).toBe(false)
      expect(isInContainer(createMockElement() as any, null)).toBe(false)
    })
  })
})
