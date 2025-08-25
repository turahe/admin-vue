import { describe, it, expect, vi } from 'vitest'
import { formatToDateTime, formatToDate, dateUtil } from '../../src/utils/dateUtil'
import dayjs from 'dayjs'

// Mock dayjs to control the behavior in tests
vi.mock('dayjs', () => {
  const actualDayjs = vi.importActual('dayjs')
  return {
    default: vi.fn().mockImplementation((date) => {
      const mockDayjs = actualDayjs.default(date)
      return {
        ...mockDayjs,
        format: vi.fn().mockImplementation((format) => mockDayjs.format(format))
      }
    })
  }
})

const mockDayjs = vi.mocked(dayjs)

describe('Date Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('formatToDateTime', () => {
    it('should format date to default datetime format', () => {
      const testDate = new Date('2023-12-25 15:30:45')
      const mockDateObj = {
        format: vi.fn().mockReturnValue('2023-12-25 15:30:45')
      }
      mockDayjs.mockReturnValue(mockDateObj as any)

      const result = formatToDateTime(testDate)

      expect(mockDayjs).toHaveBeenCalledWith(testDate)
      expect(mockDateObj.format).toHaveBeenCalledWith('YYYY-MM-DD HH:mm:ss')
      expect(result).toBe('2023-12-25 15:30:45')
    })

    it('should format date with custom format', () => {
      const testDate = new Date('2023-12-25 15:30:45')
      const customFormat = 'DD/MM/YYYY HH:mm'
      const expectedResult = '25/12/2023 15:30'
      const mockDateObj = {
        format: vi.fn().mockReturnValue(expectedResult)
      }
      mockDayjs.mockReturnValue(mockDateObj as any)

      const result = formatToDateTime(testDate, customFormat)

      expect(mockDayjs).toHaveBeenCalledWith(testDate)
      expect(mockDateObj.format).toHaveBeenCalledWith(customFormat)
      expect(result).toBe(expectedResult)
    })

    it('should handle string date input', () => {
      const testDate = '2023-12-25'
      const mockDateObj = {
        format: vi.fn().mockReturnValue('2023-12-25 00:00:00')
      }
      mockDayjs.mockReturnValue(mockDateObj as any)

      const result = formatToDateTime(testDate)

      expect(mockDayjs).toHaveBeenCalledWith(testDate)
      expect(mockDateObj.format).toHaveBeenCalledWith('YYYY-MM-DD HH:mm:ss')
      expect(result).toBe('2023-12-25 00:00:00')
    })

    it('should handle timestamp input', () => {
      const timestamp = 1703520645000 // 2023-12-25 15:30:45
      const mockDateObj = {
        format: vi.fn().mockReturnValue('2023-12-25 15:30:45')
      }
      mockDayjs.mockReturnValue(mockDateObj as any)

      const result = formatToDateTime(timestamp)

      expect(mockDayjs).toHaveBeenCalledWith(timestamp)
      expect(result).toBe('2023-12-25 15:30:45')
    })

    it('should handle undefined input', () => {
      const mockDateObj = {
        format: vi.fn().mockReturnValue('Invalid Date')
      }
      mockDayjs.mockReturnValue(mockDateObj as any)

      const result = formatToDateTime(undefined)

      expect(mockDayjs).toHaveBeenCalledWith(undefined)
      expect(result).toBe('Invalid Date')
    })
  })

  describe('formatToDate', () => {
    it('should format date to default date format', () => {
      const testDate = new Date('2023-12-25 15:30:45')
      const mockDateObj = {
        format: vi.fn().mockReturnValue('2023-12-25')
      }
      mockDayjs.mockReturnValue(mockDateObj as any)

      const result = formatToDate(testDate)

      expect(mockDayjs).toHaveBeenCalledWith(testDate)
      expect(mockDateObj.format).toHaveBeenCalledWith('YYYY-MM-DD')
      expect(result).toBe('2023-12-25')
    })

    it('should format date with custom format', () => {
      const testDate = new Date('2023-12-25')
      const customFormat = 'DD/MM/YYYY'
      const expectedResult = '25/12/2023'
      const mockDateObj = {
        format: vi.fn().mockReturnValue(expectedResult)
      }
      mockDayjs.mockReturnValue(mockDateObj as any)

      const result = formatToDate(testDate, customFormat)

      expect(mockDayjs).toHaveBeenCalledWith(testDate)
      expect(mockDateObj.format).toHaveBeenCalledWith(customFormat)
      expect(result).toBe(expectedResult)
    })

    it('should handle string date input', () => {
      const testDate = '2023-12-25'
      const mockDateObj = {
        format: vi.fn().mockReturnValue('2023-12-25')
      }
      mockDayjs.mockReturnValue(mockDateObj as any)

      const result = formatToDate(testDate)

      expect(mockDayjs).toHaveBeenCalledWith(testDate)
      expect(result).toBe('2023-12-25')
    })

    it('should format with month names', () => {
      const testDate = new Date('2023-12-25')
      const customFormat = 'MMMM DD, YYYY'
      const expectedResult = 'December 25, 2023'
      const mockDateObj = {
        format: vi.fn().mockReturnValue(expectedResult)
      }
      mockDayjs.mockReturnValue(mockDateObj as any)

      const result = formatToDate(testDate, customFormat)

      expect(mockDateObj.format).toHaveBeenCalledWith(customFormat)
      expect(result).toBe(expectedResult)
    })

    it('should handle relative formats', () => {
      const testDate = new Date()
      const customFormat = 'dddd'
      const expectedResult = 'Monday'
      const mockDateObj = {
        format: vi.fn().mockReturnValue(expectedResult)
      }
      mockDayjs.mockReturnValue(mockDateObj as any)

      const result = formatToDate(testDate, customFormat)

      expect(mockDateObj.format).toHaveBeenCalledWith(customFormat)
      expect(result).toBe(expectedResult)
    })
  })

  describe('dateUtil', () => {
    it('should export dayjs instance', () => {
      expect(dateUtil).toBe(dayjs)
    })

    it('should allow direct dayjs usage', () => {
      const testDate = '2023-12-25'
      const mockDateObj = {
        format: vi.fn().mockReturnValue('2023-12-25'),
        add: vi.fn(),
        subtract: vi.fn(),
        diff: vi.fn()
      }
      mockDayjs.mockReturnValue(mockDateObj as any)

      const result = dateUtil(testDate)

      expect(mockDayjs).toHaveBeenCalledWith(testDate)
      expect(result).toBe(mockDateObj)
    })
  })

  describe('Edge Cases', () => {
    it('should handle invalid date strings', () => {
      const invalidDate = 'not-a-date'
      const mockDateObj = {
        format: vi.fn().mockReturnValue('Invalid Date')
      }
      mockDayjs.mockReturnValue(mockDateObj as any)

      const result = formatToDateTime(invalidDate)

      expect(result).toBe('Invalid Date')
    })

    it('should handle null input', () => {
      const mockDateObj = {
        format: vi.fn().mockReturnValue('Invalid Date')
      }
      mockDayjs.mockReturnValue(mockDateObj as any)

      const result = formatToDate(null)

      expect(mockDayjs).toHaveBeenCalledWith(null)
      expect(result).toBe('Invalid Date')
    })

    it('should handle very old dates', () => {
      const oldDate = new Date('1900-01-01')
      const mockDateObj = {
        format: vi.fn().mockReturnValue('1900-01-01')
      }
      mockDayjs.mockReturnValue(mockDateObj as any)

      const result = formatToDate(oldDate)

      expect(mockDayjs).toHaveBeenCalledWith(oldDate)
      expect(result).toBe('1900-01-01')
    })

    it('should handle future dates', () => {
      const futureDate = new Date('2100-12-31')
      const mockDateObj = {
        format: vi.fn().mockReturnValue('2100-12-31')
      }
      mockDayjs.mockReturnValue(mockDateObj as any)

      const result = formatToDate(futureDate)

      expect(mockDayjs).toHaveBeenCalledWith(futureDate)
      expect(result).toBe('2100-12-31')
    })
  })

  describe('Format Constants', () => {
    it('should use correct default datetime format', () => {
      const testDate = new Date()
      const mockDateObj = {
        format: vi.fn().mockReturnValue('')
      }
      mockDayjs.mockReturnValue(mockDateObj as any)

      formatToDateTime(testDate)

      expect(mockDateObj.format).toHaveBeenCalledWith('YYYY-MM-DD HH:mm:ss')
    })

    it('should use correct default date format', () => {
      const testDate = new Date()
      const mockDateObj = {
        format: vi.fn().mockReturnValue('')
      }
      mockDayjs.mockReturnValue(mockDateObj as any)

      formatToDate(testDate)

      expect(mockDateObj.format).toHaveBeenCalledWith('YYYY-MM-DD')
    })
  })
})
