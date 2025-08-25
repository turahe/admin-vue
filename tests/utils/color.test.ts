import { describe, it, expect } from 'vitest'
import {
  isHexColor,
  rgbToHex,
  hexToRGB,
  colorIsDark,
  darken,
  lighten,
  calculateBestTextColor,
  mix
} from '../../src/utils/color'

describe('Color Utils', () => {
  describe('isHexColor', () => {
    it('should validate 6-digit hex colors', () => {
      expect(isHexColor('#ffffff')).toBe(true)
      expect(isHexColor('#000000')).toBe(true)
      expect(isHexColor('#ff0000')).toBe(true)
      expect(isHexColor('#123ABC')).toBe(true)
    })

    it('should validate 3-digit hex colors', () => {
      expect(isHexColor('#fff')).toBe(true)
      expect(isHexColor('#000')).toBe(true)
      expect(isHexColor('#f00')).toBe(true)
      expect(isHexColor('#1aB')).toBe(true)
    })

    it('should reject invalid hex colors', () => {
      expect(isHexColor('ffffff')).toBe(false) // missing #
      expect(isHexColor('#gggggg')).toBe(false) // invalid characters
      expect(isHexColor('#ff')).toBe(false) // too short
      expect(isHexColor('#fffffff')).toBe(false) // too long
      expect(isHexColor('')).toBe(false)
      expect(isHexColor('rgb(255,255,255)')).toBe(false)
    })
  })

  describe('rgbToHex', () => {
    it('should convert RGB values to hex', () => {
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff')
      expect(rgbToHex(0, 0, 0)).toBe('#000000')
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000')
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00')
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff')
    })

    it('should handle mid-range values', () => {
      expect(rgbToHex(128, 128, 128)).toBe('#808080')
      expect(rgbToHex(192, 192, 192)).toBe('#c0c0c0')
    })

    it('should pad with zeros when needed', () => {
      expect(rgbToHex(1, 2, 3)).toBe('#010203')
      expect(rgbToHex(10, 20, 30)).toBe('#0a141e')
    })
  })

  describe('hexToRGB', () => {
    it('should convert 6-digit hex to RGB', () => {
      expect(hexToRGB('#ffffff')).toBe('RGB(255,255,255)')
      expect(hexToRGB('#000000')).toBe('RGB(0,0,0)')
      expect(hexToRGB('#ff0000')).toBe('RGB(255,0,0)')
      expect(hexToRGB('#00ff00')).toBe('RGB(0,255,0)')
      expect(hexToRGB('#0000ff')).toBe('RGB(0,0,255)')
    })

    it('should convert 3-digit hex to RGB', () => {
      expect(hexToRGB('#fff')).toBe('RGB(255,255,255)')
      expect(hexToRGB('#000')).toBe('RGB(0,0,0)')
      expect(hexToRGB('#f00')).toBe('RGB(255,0,0)')
      expect(hexToRGB('#0f0')).toBe('RGB(0,255,0)')
      expect(hexToRGB('#00f')).toBe('RGB(0,0,255)')
    })

    it('should handle mixed case', () => {
      expect(hexToRGB('#FFffFF')).toBe('RGB(255,255,255)')
      expect(hexToRGB('#AaBbCc')).toBe('RGB(170,187,204)')
    })

    it('should add opacity when provided', () => {
      expect(hexToRGB('#ffffff', 0.5)).toBe('RGBA(255,255,255,0.5)')
      expect(hexToRGB('#000000', 1)).toBe('RGBA(0,0,0,1)')
      expect(hexToRGB('#ff0000', 0.8)).toBe('RGBA(255,0,0,0.8)')
    })

    it('should return original string for invalid hex', () => {
      expect(hexToRGB('invalid')).toBe('invalid')
      expect(hexToRGB('rgb(255,255,255)')).toBe('rgb(255,255,255)')
    })
  })

  describe('colorIsDark', () => {
    it('should identify dark colors', () => {
      expect(colorIsDark('#000000')).toBe(true)
      expect(colorIsDark('#333333')).toBe(true)
      expect(colorIsDark('#800000')).toBe(true) // dark red
    })

    it('should identify light colors', () => {
      expect(colorIsDark('#ffffff')).toBe(false)
      expect(colorIsDark('#cccccc')).toBe(false)
      expect(colorIsDark('#ffff00')).toBe(false) // yellow
    })

    it('should handle 3-digit hex colors', () => {
      expect(colorIsDark('#000')).toBe(true)
      expect(colorIsDark('#fff')).toBe(false)
    })

    it('should return undefined for invalid colors', () => {
      expect(colorIsDark('invalid')).toBeUndefined()
      expect(colorIsDark('rgb(255,255,255)')).toBeUndefined()
    })
  })

  describe('darken', () => {
    it('should darken colors by percentage', () => {
      const darkened = darken('#ffffff', 10)
      expect(darkened).toBe('#e6e6e6')
    })

    it('should handle colors without # prefix', () => {
      const darkened = darken('ffffff', 10)
      expect(darkened).toBe('#e6e6e6')
    })

    it('should handle 100% darkening', () => {
      const darkened = darken('#ffffff', 100)
      expect(darkened).toBe('#000000')
    })

    it('should handle 0% darkening', () => {
      const darkened = darken('#ffffff', 0)
      expect(darkened).toBe('#ffffff')
    })

    it('should not go below 0', () => {
      const darkened = darken('#333333', 100)
      expect(darkened).toBe('#000000')
    })
  })

  describe('lighten', () => {
    it('should lighten colors by percentage', () => {
      const lightened = lighten('#000000', 10)
      expect(lightened).toBe('#1a1a1a')
    })

    it('should handle colors without # prefix', () => {
      const lightened = lighten('000000', 10)
      expect(lightened).toBe('#1a1a1a')
    })

    it('should handle 100% lightening', () => {
      const lightened = lighten('#000000', 100)
      expect(lightened).toBe('#ffffff')
    })

    it('should handle 0% lightening', () => {
      const lightened = lighten('#000000', 0)
      expect(lightened).toBe('#000000')
    })

    it('should not go above 255', () => {
      const lightened = lighten('#cccccc', 100)
      expect(lightened).toBe('#ffffff')
    })
  })

  describe('calculateBestTextColor', () => {
    it('should return black for light backgrounds', () => {
      expect(calculateBestTextColor('#ffffff')).toBe('#000000')
      expect(calculateBestTextColor('#ffff00')).toBe('#000000') // yellow
      expect(calculateBestTextColor('#00ffff')).toBe('#000000') // cyan
    })

    it('should return white for dark backgrounds', () => {
      expect(calculateBestTextColor('#000000')).toBe('#FFFFFF')
      expect(calculateBestTextColor('#333333')).toBe('#FFFFFF')
      expect(calculateBestTextColor('#800000')).toBe('#FFFFFF') // dark red
    })

    it('should handle colors without # prefix', () => {
      // The function expects # prefix to be removed
      expect(calculateBestTextColor('ffffff')).toBe('#000000')
      expect(calculateBestTextColor('000000')).toBe('#FFFFFF')
    })
  })

  describe('mix', () => {
    it('should mix two colors with default weight', () => {
      const mixed = mix('#ffffff', '#000000')
      expect(mixed).toBe('#808080') // 50% mix should be gray
    })

    it('should mix colors with custom weight', () => {
      const mixed = mix('#ffffff', '#000000', 0.8)
      expect(mixed).toBe('#cccccc') // 80% white, 20% black
    })

    it('should handle 0 weight (100% color2)', () => {
      const mixed = mix('#ffffff', '#000000', 0)
      expect(mixed).toBe('#000000')
    })

    it('should handle 1 weight (100% color1)', () => {
      const mixed = mix('#ffffff', '#000000', 1)
      expect(mixed).toBe('#ffffff')
    })

    it('should mix colored values', () => {
      const mixed = mix('#ff0000', '#0000ff', 0.5)
      expect(mixed).toBe('#800080') // red + blue = purple
    })

    it('should handle 6-digit hex colors', () => {
      const mixed = mix('#ff0000', '#00ff00', 0.5)
      expect(mixed).toBe('#808000') // red + green = olive
    })

    it('should pad with zeros when needed', () => {
      const mixed = mix('#010101', '#020202', 0.5)
      expect(mixed).toBe('#010101') // Very close colors
    })
  })
})
