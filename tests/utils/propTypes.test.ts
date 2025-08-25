import { describe, it, expect } from 'vitest'
import { propTypes } from '../../src/utils/propTypes'

describe('PropTypes Utils', () => {
  describe('propTypes', () => {
    it('should have func property', () => {
      expect(propTypes.func).toBeDefined()
      expect(typeof propTypes.func).toBe('object')
    })

    it('should have bool property', () => {
      expect(propTypes.bool).toBeDefined()
      expect(typeof propTypes.bool).toBe('object')
    })

    it('should have string property', () => {
      expect(propTypes.string).toBeDefined()
      expect(typeof propTypes.string).toBe('object')
    })

    it('should have number property', () => {
      expect(propTypes.number).toBeDefined()
      expect(typeof propTypes.number).toBe('object')
    })

    it('should have object property', () => {
      expect(propTypes.object).toBeDefined()
      expect(typeof propTypes.object).toBe('object')
    })

    it('should have integer property', () => {
      expect(propTypes.integer).toBeDefined()
      expect(typeof propTypes.integer).toBe('object')
    })

    it('should have style property', () => {
      expect(propTypes.style).toBeDefined()
      expect(typeof propTypes.style).toBe('object')
    })
  })

  describe('style prop type', () => {
    it('should be validatable type for style prop', () => {
      const styleProp = propTypes.style

      expect(styleProp).toBeDefined()
      expect(styleProp.type).toEqual([String, Object])
    })

    it('should validate string style values', () => {
      const styleProp = propTypes.style

      // Check if it has validation method
      expect(typeof styleProp.validator || styleProp.validate).toBe('function')
    })

    it('should validate object style values', () => {
      const styleProp = propTypes.style

      // The style prop should accept both string and object types
      expect(styleProp.type).toContain(String)
      expect(styleProp.type).toContain(Object)
    })
  })

  describe('prop type functionality', () => {
    it('should create validatable prop types', () => {
      // Test that each prop type has the expected structure
      const propTypeNames = ['func', 'bool', 'string', 'number', 'object', 'integer']

      propTypeNames.forEach((propName) => {
        const propType = propTypes[propName]
        expect(propType).toBeDefined()
        expect(typeof propType).toBe('object')
      })
    })

    it('should extend base propTypes with custom style property', () => {
      // Verify that propTypes includes both base types and custom style
      expect(propTypes.func).toBeDefined()
      expect(propTypes.bool).toBeDefined()
      expect(propTypes.string).toBeDefined()
      expect(propTypes.number).toBeDefined()
      expect(propTypes.object).toBeDefined()
      expect(propTypes.integer).toBeDefined()
      expect(propTypes.style).toBeDefined()
    })

    it('should maintain vue-types compatibility', () => {
      // Test that prop types work as expected for Vue component props
      const stringProp = propTypes.string
      const numberProp = propTypes.number
      const boolProp = propTypes.bool
      const funcProp = propTypes.func
      const objectProp = propTypes.object
      const integerProp = propTypes.integer
      const styleProp = propTypes.style

      // All should be objects (vue-types validators)
      expect(typeof stringProp).toBe('object')
      expect(typeof numberProp).toBe('object')
      expect(typeof boolProp).toBe('object')
      expect(typeof funcProp).toBe('object')
      expect(typeof objectProp).toBe('object')
      expect(typeof integerProp).toBe('object')
      expect(typeof styleProp).toBe('object')
    })
  })

  describe('static methods', () => {
    it('should have static style getter', () => {
      expect(typeof propTypes.style).toBe('object')

      // The style prop should be accessible as a static property
      const styleDescriptor = Object.getOwnPropertyDescriptor(propTypes.constructor, 'style')
      expect(styleDescriptor).toBeDefined()
    })

    it('should return consistent style prop type', () => {
      const style1 = propTypes.style
      const style2 = propTypes.style

      // Should return the same structure each time
      expect(style1.type).toEqual(style2.type)
    })
  })

  describe('CSS Properties compatibility', () => {
    it('should accept CSS string values', () => {
      const styleProp = propTypes.style

      // Should accept String type for CSS strings like "color: red; margin: 10px"
      expect(styleProp.type).toContain(String)
    })

    it('should accept CSS object values', () => {
      const styleProp = propTypes.style

      // Should accept Object type for CSS objects like { color: 'red', margin: '10px' }
      expect(styleProp.type).toContain(Object)
    })

    it('should be compatible with Vue CSSProperties type', () => {
      const styleProp = propTypes.style

      // The style prop should work with Vue's CSSProperties interface
      // This is mainly a type-level check, but we can verify the structure
      expect(styleProp.type).toEqual([String, Object])
    })
  })

  describe('Integration with vue-types', () => {
    it('should inherit from vue-types interface', () => {
      // Verify propTypes has the expected vue-types methods/properties
      expect(propTypes).toBeDefined()

      // Check that it has the basic prop types from vue-types
      const baseTypes = ['func', 'bool', 'string', 'number', 'object', 'integer']
      baseTypes.forEach((type) => {
        expect(propTypes[type]).toBeDefined()
      })
    })

    it('should extend vue-types with custom style type', () => {
      // The style property should be a custom addition
      expect(propTypes.style).toBeDefined()
      expect(propTypes.style.type).toEqual([String, Object])
    })

    it('should maintain vue-types validatable structure', () => {
      // Each prop type should have the structure expected by Vue
      const propType = propTypes.string
      expect(typeof propType).toBe('object')

      // Vue-types typically have type and other validation properties
      expect(propType).toBeDefined()
    })
  })
})
