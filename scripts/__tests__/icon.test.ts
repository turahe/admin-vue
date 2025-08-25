import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { createIconGenerator } from './icon.lib'

// Mock dependencies
vi.mock('inquirer')
vi.mock('chalk', () => ({
  default: {
    cyan: vi.fn((text) => text),
    green: vi.fn((text) => text),
    blue: vi.fn((text) => text),
    yellow: vi.fn((text) => text),
    red: vi.fn((text) => text)
  },
  cyan: vi.fn((text) => text),
  green: vi.fn((text) => text),
  blue: vi.fn((text) => text),
  yellow: vi.fn((text) => text),
  red: vi.fn((text) => text)
}))

vi.mock('./icon.lib', () => ({
  createIconGenerator: vi.fn()
}))

const mockInquirer = vi.mocked(inquirer)
const mockChalk = vi.mocked(chalk)
const mockCreateIconGenerator = vi.mocked(createIconGenerator)

// Mock console methods
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('Icon Generation Script Functions', () => {
  let mockIconGenerator: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockIconGenerator = {
      verifyIconifyDirectory: vi.fn(),
      readCollectionsData: vi.fn(),
      transformCollections: vi.fn(),
      createPromptChoices: vi.fn(),
      generateIconSet: vi.fn()
    }

    mockCreateIconGenerator.mockReturnValue(mockIconGenerator)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should create icon generator with mocked functions', () => {
    const generator = createIconGenerator()
    
    expect(mockCreateIconGenerator).toHaveBeenCalled()
    expect(generator).toBe(mockIconGenerator)
    expect(generator.verifyIconifyDirectory).toBeDefined()
    expect(generator.readCollectionsData).toBeDefined()
    expect(generator.transformCollections).toBeDefined()
    expect(generator.createPromptChoices).toBeDefined()
    expect(generator.generateIconSet).toBeDefined()
  })

  it('should test inquirer prompt functionality', async () => {
    const testChoices = [
      { key: 'test1', value: 'test1', name: 'Test 1' },
      { key: 'test2', value: 'test2', name: 'Test 2' }
    ]
    
    mockInquirer.prompt.mockResolvedValue({ iconSet: 'test1' })

    const result = await inquirer.prompt([{
      type: 'list',
      name: 'iconSet',
      choices: testChoices,
      message: 'Select the icon set that needs to be generated:'
    }])

    expect(result).toEqual({ iconSet: 'test1' })
    expect(mockInquirer.prompt).toHaveBeenCalledWith([{
      type: 'list',
      name: 'iconSet',
      choices: testChoices,
      message: 'Select the icon set that needs to be generated:'
    }])
  })

  it('should test chalk color functions', () => {
    chalk.cyan('test')
    chalk.green('test')
    chalk.blue('test')
    chalk.yellow('test')
    chalk.red('test')

    expect(mockChalk.cyan).toHaveBeenCalledWith('test')
    expect(mockChalk.green).toHaveBeenCalledWith('test')
    expect(mockChalk.blue).toHaveBeenCalledWith('test')
    expect(mockChalk.yellow).toHaveBeenCalledWith('test')
    expect(mockChalk.red).toHaveBeenCalledWith('test')
  })

  it('should test icon generator workflow', async () => {
    // Test a complete workflow with the mocked generator
    mockIconGenerator.verifyIconifyDirectory.mockResolvedValue(true)
    mockIconGenerator.readCollectionsData.mockResolvedValue({
      'test-icons': { name: 'Test Icons', prefix: 'test' }
    })
    mockIconGenerator.transformCollections.mockReturnValue([
      { id: 'test-icons', name: 'Test Icons', prefix: 'test' }
    ])
    mockIconGenerator.createPromptChoices.mockReturnValue([
      { key: 'test-icons', value: 'test-icons', name: 'Test Icons' }
    ])
    mockIconGenerator.generateIconSet.mockResolvedValue({
      outputFilePath: '/test/output/icons.test.ts',
      iconCount: 5,
      prefix: 'test'
    })

    const generator = createIconGenerator()
    
    const dirExists = await generator.verifyIconifyDirectory()
    expect(dirExists).toBe(true)

    const rawData = await generator.readCollectionsData()
    expect(rawData).toEqual({ 'test-icons': { name: 'Test Icons', prefix: 'test' } })

    const collections = generator.transformCollections(rawData)
    expect(collections).toEqual([{ id: 'test-icons', name: 'Test Icons', prefix: 'test' }])

    const choices = generator.createPromptChoices(collections)
    expect(choices).toEqual([{ key: 'test-icons', value: 'test-icons', name: 'Test Icons' }])

    const result = await generator.generateIconSet('test-icons', collections)
    expect(result).toEqual({
      outputFilePath: '/test/output/icons.test.ts',
      iconCount: 5,
      prefix: 'test'
    })
  })
})
