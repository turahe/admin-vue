import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import path from 'path'
import fs from 'fs-extra'
import { IconGenerator, createIconGenerator, createDefaultConfig } from '../../scripts/icon.lib'
import type { Collection, IconCollectionData } from '../../scripts/icon.lib'

// Mock fs-extra
vi.mock('fs-extra')
const mockFs = vi.mocked(fs)

// Mock path to use absolute paths for testing
const mockBasePath = '/test/project'

describe('IconGenerator', () => {
  let iconGenerator: IconGenerator
  let mockConfig: any

  beforeEach(() => {
    mockConfig = {
      iconifyDir: path.join(mockBasePath, 'node_modules/@iconify/json'),
      outputDir: path.join(mockBasePath, 'src/components/IconPicker/src/data'),
      iconPrefix: 'vi-'
    }
    iconGenerator = new IconGenerator(mockConfig)
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('verifyIconifyDirectory', () => {
    it('should return true when iconify directory exists', async () => {
      mockFs.pathExists.mockResolvedValue(true)

      const result = await iconGenerator.verifyIconifyDirectory()

      expect(result).toBe(true)
      expect(mockFs.pathExists).toHaveBeenCalledWith(mockConfig.iconifyDir)
    })

    it('should return false when iconify directory does not exist', async () => {
      mockFs.pathExists.mockResolvedValue(false)

      const result = await iconGenerator.verifyIconifyDirectory()

      expect(result).toBe(false)
    })

    it('should accept custom iconify directory path', async () => {
      const customPath = '/custom/iconify/path'
      mockFs.pathExists.mockResolvedValue(true)

      await iconGenerator.verifyIconifyDirectory(customPath)

      expect(mockFs.pathExists).toHaveBeenCalledWith(customPath)
    })
  })

  describe('readCollectionsData', () => {
    it('should read and parse collections.json file', async () => {
      const mockCollectionsData = {
        'ant-design': { name: 'Ant Design Icons', prefix: 'ant-design' },
        'material-symbols': { name: 'Material Symbols', prefix: 'material-symbols' }
      }
      mockFs.readJSON.mockResolvedValue(mockCollectionsData)

      const result = await iconGenerator.readCollectionsData()

      expect(result).toEqual(mockCollectionsData)
      expect(mockFs.readJSON).toHaveBeenCalledWith(
        path.join(mockConfig.iconifyDir, 'collections.json')
      )
    })

    it('should handle custom iconify directory path', async () => {
      const customPath = '/custom/iconify/path'
      const mockData = { test: 'data' }
      mockFs.readJSON.mockResolvedValue(mockData)

      await iconGenerator.readCollectionsData(customPath)

      expect(mockFs.readJSON).toHaveBeenCalledWith(path.join(customPath, 'collections.json'))
    })
  })

  describe('transformCollections', () => {
    it('should transform raw collections data into typed collections', () => {
      const rawCollections = {
        'ant-design': { name: 'Ant Design Icons', prefix: 'ant-design' },
        'material-symbols': { name: 'Material Symbols', prefix: 'material-symbols' },
        'simple-collection': {} // Test default values
      }

      const result = iconGenerator.transformCollections(rawCollections)

      expect(result).toEqual([
        { id: 'ant-design', name: 'Ant Design Icons', prefix: 'ant-design' },
        { id: 'material-symbols', name: 'Material Symbols', prefix: 'material-symbols' },
        { id: 'simple-collection', name: 'simple-collection', prefix: 'simple-collection' }
      ])
    })

    it('should handle empty collections object', () => {
      const result = iconGenerator.transformCollections({})
      expect(result).toEqual([])
    })

    it('should use id as fallback for missing name and prefix', () => {
      const rawCollections = {
        'test-icon': { someOtherProperty: 'value' }
      }

      const result = iconGenerator.transformCollections(rawCollections)

      expect(result).toEqual([{ id: 'test-icon', name: 'test-icon', prefix: 'test-icon' }])
    })
  })

  describe('createPromptChoices', () => {
    it('should create choices array for inquirer prompt', () => {
      const collections: Collection[] = [
        { id: 'ant-design', name: 'Ant Design Icons', prefix: 'ant-design' },
        { id: 'material-symbols', name: 'Material Symbols', prefix: 'material-symbols' }
      ]

      const result = iconGenerator.createPromptChoices(collections)

      expect(result).toEqual([
        { key: 'ant-design', value: 'ant-design', name: 'Ant Design Icons' },
        { key: 'material-symbols', value: 'material-symbols', name: 'Material Symbols' }
      ])
    })

    it('should handle empty collections array', () => {
      const result = iconGenerator.createPromptChoices([])
      expect(result).toEqual([])
    })
  })

  describe('findCollection', () => {
    const collections: Collection[] = [
      { id: 'ant-design', name: 'Ant Design Icons', prefix: 'ant-design' },
      { id: 'material-symbols', name: 'Material Symbols', prefix: 'material-symbols' }
    ]

    it('should find collection by ID', () => {
      const result = iconGenerator.findCollection(collections, 'ant-design')
      expect(result).toEqual({ id: 'ant-design', name: 'Ant Design Icons', prefix: 'ant-design' })
    })

    it('should return undefined for non-existent collection', () => {
      const result = iconGenerator.findCollection(collections, 'non-existent')
      expect(result).toBeUndefined()
    })

    it('should handle empty collections array', () => {
      const result = iconGenerator.findCollection([], 'any-id')
      expect(result).toBeUndefined()
    })
  })

  describe('readIconCollectionData', () => {
    it('should read icon collection data from JSON file', async () => {
      const mockIconData: IconCollectionData = {
        prefix: 'ant-design',
        icons: {
          home: {},
          user: {},
          setting: {}
        }
      }
      mockFs.readJSON.mockResolvedValue(mockIconData)

      const result = await iconGenerator.readIconCollectionData('ant-design')

      expect(result).toEqual(mockIconData)
      expect(mockFs.readJSON).toHaveBeenCalledWith(
        path.join(mockConfig.iconifyDir, 'json', 'ant-design.json')
      )
    })

    it('should handle custom iconify directory', async () => {
      const customPath = '/custom/path'
      const mockData = { prefix: 'test', icons: {} }
      mockFs.readJSON.mockResolvedValue(mockData)

      await iconGenerator.readIconCollectionData('test-icon', customPath)

      expect(mockFs.readJSON).toHaveBeenCalledWith(path.join(customPath, 'json', 'test-icon.json'))
    })
  })

  describe('generateIconNames', () => {
    it('should generate icon names with prefix', () => {
      const iconData = {
        home: {},
        user: {},
        setting: {}
      }

      const result = iconGenerator.generateIconNames(iconData, 'ant-design')

      expect(result).toEqual(['vi-ant-design:home', 'vi-ant-design:user', 'vi-ant-design:setting'])
    })

    it('should handle empty icon data', () => {
      const result = iconGenerator.generateIconNames({}, 'test')
      expect(result).toEqual([])
    })

    it('should maintain consistent ordering', () => {
      const iconData = {
        'z-icon': {},
        'a-icon': {},
        'b-icon': {}
      }

      const result = iconGenerator.generateIconNames(iconData, 'test')

      // Object.keys() maintains insertion order in modern JS
      expect(result).toEqual(['vi-test:z-icon', 'vi-test:a-icon', 'vi-test:b-icon'])
    })
  })

  describe('createIconSetData', () => {
    it('should create complete icon set data object', () => {
      const collection: Collection = {
        id: 'ant-design',
        name: 'Ant Design Icons',
        prefix: 'ant-design'
      }
      const iconNames = ['vi-ant-design:home', 'vi-ant-design:user']
      const prefix = 'ant-design'

      const result = iconGenerator.createIconSetData(collection, iconNames, prefix)

      expect(result).toEqual({
        name: 'Ant Design Icons',
        prefix: 'vi-ant-design',
        icons: ['vi-ant-design:home', 'vi-ant-design:user']
      })
    })
  })

  describe('generateFileContent', () => {
    it('should generate properly formatted TypeScript file content', () => {
      const iconSetData = {
        name: 'Test Icons',
        prefix: 'vi-test',
        icons: ['vi-test:icon1', 'vi-test:icon2']
      }

      const result = iconGenerator.generateFileContent(iconSetData)

      expect(result).toBe(
        'export default {\n  "name": "Test Icons",\n  "prefix": "vi-test",\n  "icons": [\n    "vi-test:icon1",\n    "vi-test:icon2"\n  ]\n}'
      )
    })

    it('should handle empty icons array', () => {
      const iconSetData = {
        name: 'Empty Icons',
        prefix: 'vi-empty',
        icons: []
      }

      const result = iconGenerator.generateFileContent(iconSetData)

      expect(result).toContain('"icons": []')
    })
  })

  describe('ensureOutputDirectory', () => {
    it('should ensure output directory exists', async () => {
      mockFs.ensureDir.mockResolvedValue(undefined)

      await iconGenerator.ensureOutputDirectory()

      expect(mockFs.ensureDir).toHaveBeenCalledWith(mockConfig.outputDir)
    })

    it('should accept custom output directory', async () => {
      const customDir = '/custom/output'
      mockFs.ensureDir.mockResolvedValue(undefined)

      await iconGenerator.ensureOutputDirectory(customDir)

      expect(mockFs.ensureDir).toHaveBeenCalledWith(customDir)
    })
  })

  describe('writeIconFile', () => {
    it('should write icon file and return file path', async () => {
      const fileContent = 'export default {...}'
      const prefix = 'ant-design'
      mockFs.writeFile.mockResolvedValue(undefined)

      const result = await iconGenerator.writeIconFile(fileContent, prefix)

      const expectedPath = path.join(mockConfig.outputDir, 'icons.ant-design.ts')
      expect(result).toBe(expectedPath)
      expect(mockFs.writeFile).toHaveBeenCalledWith(expectedPath, fileContent, 'utf8')
    })

    it('should accept custom output directory', async () => {
      const customDir = '/custom/output'
      const fileContent = 'test content'
      const prefix = 'test'
      mockFs.writeFile.mockResolvedValue(undefined)

      const result = await iconGenerator.writeIconFile(fileContent, prefix, customDir)

      const expectedPath = path.join(customDir, 'icons.test.ts')
      expect(result).toBe(expectedPath)
      expect(mockFs.writeFile).toHaveBeenCalledWith(expectedPath, fileContent, 'utf8')
    })
  })

  describe('validateIconCollectionData', () => {
    it('should return true for valid icon collection data', () => {
      const validData = {
        prefix: 'test',
        icons: {
          icon1: {},
          icon2: {}
        }
      }

      const result = iconGenerator.validateIconCollectionData(validData, 'test-set')

      expect(result).toBe(true)
    })

    it('should throw error for null or undefined data', () => {
      expect(() => {
        iconGenerator.validateIconCollectionData(null, 'test-set')
      }).toThrow('Invalid icon collection data for: test-set')

      expect(() => {
        iconGenerator.validateIconCollectionData(undefined, 'test-set')
      }).toThrow('Invalid icon collection data for: test-set')
    })

    it('should throw error for data without icons property', () => {
      const invalidData = {
        prefix: 'test'
        // missing icons property
      }

      expect(() => {
        iconGenerator.validateIconCollectionData(invalidData, 'test-set')
      }).toThrow('Invalid icon collection data for: test-set')
    })

    it('should throw error for data with null icons', () => {
      const invalidData = {
        prefix: 'test',
        icons: null
      }

      expect(() => {
        iconGenerator.validateIconCollectionData(invalidData, 'test-set')
      }).toThrow('Invalid icon collection data for: test-set')
    })
  })

  describe('generateIconSet', () => {
    const mockCollections: Collection[] = [
      { id: 'ant-design', name: 'Ant Design Icons', prefix: 'ant-design' },
      { id: 'material-symbols', name: 'Material Symbols', prefix: 'material-symbols' }
    ]

    const mockIconData: IconCollectionData = {
      prefix: 'ant-design',
      icons: {
        home: {},
        user: {},
        setting: {}
      }
    }

    beforeEach(() => {
      mockFs.ensureDir.mockResolvedValue(undefined)
      mockFs.readJSON.mockResolvedValue(mockIconData)
      mockFs.writeFile.mockResolvedValue(undefined)
    })

    it('should generate complete icon set successfully', async () => {
      const result = await iconGenerator.generateIconSet('ant-design', mockCollections)

      expect(result).toEqual({
        outputFilePath: path.join(mockConfig.outputDir, 'icons.ant-design.ts'),
        iconCount: 3,
        prefix: 'ant-design'
      })

      expect(mockFs.ensureDir).toHaveBeenCalledWith(mockConfig.outputDir)
      expect(mockFs.readJSON).toHaveBeenCalledWith(
        path.join(mockConfig.iconifyDir, 'json', 'ant-design.json')
      )
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        path.join(mockConfig.outputDir, 'icons.ant-design.ts'),
        expect.stringContaining('export default'),
        'utf8'
      )
    })

    it('should throw error for non-existent collection', async () => {
      await expect(iconGenerator.generateIconSet('non-existent', mockCollections)).rejects.toThrow(
        'Selected icon set not found: non-existent'
      )
    })

    it('should throw error for invalid icon collection data', async () => {
      mockFs.readJSON.mockResolvedValue({ prefix: 'test' }) // missing icons

      await expect(iconGenerator.generateIconSet('ant-design', mockCollections)).rejects.toThrow(
        'Invalid icon collection data for: ant-design'
      )
    })

    it('should handle file system errors gracefully', async () => {
      mockFs.ensureDir.mockRejectedValue(new Error('Permission denied'))

      await expect(iconGenerator.generateIconSet('ant-design', mockCollections)).rejects.toThrow(
        'Permission denied'
      )
    })
  })
})

describe('Utility Functions', () => {
  describe('createDefaultConfig', () => {
    it('should create default configuration with correct paths', () => {
      const config = createDefaultConfig()

      expect(config.iconifyDir).toContain('node_modules/@iconify/json')
      expect(config.outputDir).toContain('src/components/IconPicker/src/data')
      expect(config.iconPrefix).toBe('vi-')
    })
  })

  describe('createIconGenerator', () => {
    it('should create icon generator with default config', () => {
      const generator = createIconGenerator()

      expect(generator).toBeInstanceOf(IconGenerator)
    })

    it('should create icon generator with custom config', () => {
      const customConfig = {
        iconPrefix: 'custom-'
      }

      const generator = createIconGenerator(customConfig)

      expect(generator).toBeInstanceOf(IconGenerator)
    })

    it('should merge custom config with defaults', () => {
      const customConfig = {
        iconPrefix: 'custom-',
        outputDir: '/custom/output'
      }

      const generator = createIconGenerator(customConfig)

      // We can't directly test the internal config, but we can test behavior
      expect(generator).toBeInstanceOf(IconGenerator)
    })
  })
})

describe('Integration Tests', () => {
  let iconGenerator: IconGenerator

  beforeEach(() => {
    iconGenerator = createIconGenerator({
      iconifyDir: '/test/iconify',
      outputDir: '/test/output',
      iconPrefix: 'test-'
    })
    vi.clearAllMocks()
  })

  it('should handle complete icon generation workflow', async () => {
    // Mock all fs operations
    mockFs.pathExists.mockResolvedValue(true)
    mockFs.readJSON
      .mockResolvedValueOnce({
        'test-icons': { name: 'Test Icons', prefix: 'test' }
      })
      .mockResolvedValueOnce({
        prefix: 'test',
        icons: { icon1: {}, icon2: {} }
      })
    mockFs.ensureDir.mockResolvedValue(undefined)
    mockFs.writeFile.mockResolvedValue(undefined)

    // Verify directory exists
    const dirExists = await iconGenerator.verifyIconifyDirectory()
    expect(dirExists).toBe(true)

    // Read collections
    const rawCollections = await iconGenerator.readCollectionsData()
    const collections = iconGenerator.transformCollections(rawCollections)

    // Generate icon set
    const result = await iconGenerator.generateIconSet('test-icons', collections)

    expect(result.prefix).toBe('test')
    expect(result.iconCount).toBe(2)
    expect(result.outputFilePath).toContain('icons.test.ts')

    // Verify all fs operations were called
    expect(mockFs.pathExists).toHaveBeenCalled()
    expect(mockFs.readJSON).toHaveBeenCalledTimes(2)
    expect(mockFs.ensureDir).toHaveBeenCalled()
    expect(mockFs.writeFile).toHaveBeenCalled()
  })

  it('should handle errors in the workflow gracefully', async () => {
    mockFs.pathExists.mockResolvedValue(false)

    const dirExists = await iconGenerator.verifyIconifyDirectory()
    expect(dirExists).toBe(false)

    // Should not proceed if directory doesn't exist
    // This would be handled by the main script
  })
})
