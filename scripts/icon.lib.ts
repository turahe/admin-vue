import path from 'path'
import fs from 'fs-extra'
import { ICON_PREFIX } from '../src/constants'

/**
 * Icon interface defining the structure of icon data
 * @interface Icon
 * @property {string} name - Display name of the icon set
 * @property {string} prefix - Icon prefix identifier
 * @property {string[]} icons - Array of icon names in the set
 */
export interface Icon {
  name: string
  prefix: string
  icons: string[]
}

/**
 * Collection interface for icon collections
 * @interface Collection
 * @property {string} id - Collection identifier
 * @property {string} name - Collection display name
 * @property {string} prefix - Collection prefix
 */
export interface Collection {
  id: string
  name: string
  prefix: string
}

/**
 * Icon generation configuration
 */
export interface IconGenerationConfig {
  iconifyDir: string
  outputDir: string
  iconPrefix: string
}

/**
 * Icon collection data structure
 */
export interface IconCollectionData {
  prefix: string
  icons: Record<string, any>
  [key: string]: any
}

/**
 * Utility class for icon generation operations
 */
export class IconGenerator {
  private config: IconGenerationConfig

  constructor(config: IconGenerationConfig) {
    this.config = config
  }

  /**
   * Verify that the iconify directory exists
   * @param iconifyDir - Path to the iconify directory
   * @returns Promise<boolean> - True if directory exists
   */
  async verifyIconifyDirectory(iconifyDir: string = this.config.iconifyDir): Promise<boolean> {
    return await fs.pathExists(iconifyDir)
  }

  /**
   * Read and parse collections.json file
   * @param iconifyDir - Path to the iconify directory
   * @returns Promise<any> - Parsed collections data
   */
  async readCollectionsData(iconifyDir: string = this.config.iconifyDir): Promise<any> {
    const collectionsPath = path.join(iconifyDir, 'collections.json')
    return await fs.readJSON(collectionsPath)
  }

  /**
   * Transform raw collection data into typed collections
   * @param rawCollections - Raw collection data from collections.json
   * @returns Collection[] - Array of typed collection objects
   */
  transformCollections(rawCollections: Record<string, any>): Collection[] {
    return Object.entries(rawCollections).map(([id, v]: [string, any]) => ({
      id,
      name: v.name || id,
      prefix: v.prefix || id
    }))
  }

  /**
   * Create choices array for inquirer prompt
   * @param collections - Array of collection objects
   * @returns Array of choice objects for inquirer
   */
  createPromptChoices(collections: Collection[]): Array<{ key: string; value: string; name: string }> {
    return collections.map((item) => ({ 
      key: item.id, 
      value: item.id, 
      name: item.name 
    }))
  }

  /**
   * Find a collection by its ID
   * @param collections - Array of collections
   * @param iconSetId - ID of the icon set to find
   * @returns Collection | undefined - Found collection or undefined
   */
  findCollection(collections: Collection[], iconSetId: string): Collection | undefined {
    return collections.find(item => item.id === iconSetId)
  }

  /**
   * Read icon collection data from JSON file
   * @param iconSetId - ID of the icon set
   * @param iconifyDir - Path to the iconify directory
   * @returns Promise<IconCollectionData> - Icon collection data
   */
  async readIconCollectionData(iconSetId: string, iconifyDir: string = this.config.iconifyDir): Promise<IconCollectionData> {
    const collectionDataPath = path.join(iconifyDir, 'json', `${iconSetId}.json`)
    return await fs.readJSON(collectionDataPath)
  }

  /**
   * Generate icon names with prefix
   * @param iconData - Raw icon data object
   * @param prefix - Icon prefix
   * @returns string[] - Array of prefixed icon names
   */
  generateIconNames(iconData: Record<string, any>, prefix: string): string[] {
    const prefixName = `${this.config.iconPrefix}${prefix}`
    return Object.keys(iconData).map((iconName) => `${prefixName}:${iconName}`)
  }

  /**
   * Create icon set data object
   * @param selectedCollection - Selected collection info
   * @param iconNames - Array of icon names
   * @param prefix - Icon prefix
   * @returns Icon - Complete icon set data
   */
  createIconSetData(selectedCollection: Collection, iconNames: string[], prefix: string): Icon {
    const prefixName = `${this.config.iconPrefix}${prefix}`
    return {
      name: selectedCollection.name,
      prefix: prefixName,
      icons: iconNames
    }
  }

  /**
   * Generate TypeScript file content
   * @param iconSetData - Icon set data object
   * @returns string - TypeScript file content
   */
  generateFileContent(iconSetData: Icon): string {
    return `export default ${JSON.stringify(iconSetData, null, 2)}`
  }

  /**
   * Ensure output directory exists
   * @param outputDir - Path to output directory
   * @returns Promise<void>
   */
  async ensureOutputDirectory(outputDir: string = this.config.outputDir): Promise<void> {
    await fs.ensureDir(outputDir)
  }

  /**
   * Write icon data to TypeScript file
   * @param fileContent - TypeScript file content
   * @param prefix - Icon prefix for filename
   * @param outputDir - Output directory path
   * @returns Promise<string> - Path to written file
   */
  async writeIconFile(fileContent: string, prefix: string, outputDir: string = this.config.outputDir): Promise<string> {
    const outputFilePath = path.join(outputDir, `icons.${prefix}.ts`)
    await fs.writeFile(outputFilePath, fileContent, 'utf8')
    return outputFilePath
  }

  /**
   * Validate icon collection data
   * @param data - Icon collection data
   * @param iconSetId - Icon set ID for error messages
   * @returns boolean - True if valid
   * @throws Error if invalid
   */
  validateIconCollectionData(data: any, iconSetId: string): boolean {
    if (!data || !data.icons) {
      throw new Error(`Invalid icon collection data for: ${iconSetId}`)
    }
    return true
  }

  /**
   * Generate icon set from collection ID
   * @param iconSetId - ID of the icon set to generate
   * @param collections - Array of available collections
   * @returns Promise<{outputFilePath: string, iconCount: number, prefix: string}>
   */
  async generateIconSet(iconSetId: string, collections: Collection[]): Promise<{
    outputFilePath: string
    iconCount: number
    prefix: string
  }> {
    // Find the selected collection
    const selectedCollection = this.findCollection(collections, iconSetId)
    if (!selectedCollection) {
      throw new Error(`Selected icon set not found: ${iconSetId}`)
    }

    // Ensure output directory exists
    await this.ensureOutputDirectory()

    // Read icon collection data
    const data = await this.readIconCollectionData(iconSetId)
    
    // Validate data
    this.validateIconCollectionData(data, iconSetId)

    const { prefix, icons: iconData } = data

    // Generate icon names
    const iconNames = this.generateIconNames(iconData, prefix)

    // Create icon set data
    const iconSetData = this.createIconSetData(selectedCollection, iconNames, prefix)

    // Generate file content
    const fileContent = this.generateFileContent(iconSetData)

    // Write file
    const outputFilePath = await this.writeIconFile(fileContent, prefix)

    return {
      outputFilePath,
      iconCount: iconNames.length,
      prefix
    }
  }
}

/**
 * Create default icon generator configuration
 * @returns IconGenerationConfig - Default configuration
 */
export function createDefaultConfig(): IconGenerationConfig {
  return {
    iconifyDir: path.resolve(process.cwd(), 'node_modules/@iconify/json'),
    outputDir: path.resolve(process.cwd(), 'src/components/IconPicker/src/data'),
    iconPrefix: ICON_PREFIX
  }
}

/**
 * Create icon generator instance with default configuration
 * @returns IconGenerator - Configured icon generator
 */
export function createIconGenerator(config?: Partial<IconGenerationConfig>): IconGenerator {
  const defaultConfig = createDefaultConfig()
  const finalConfig = { ...defaultConfig, ...config }
  return new IconGenerator(finalConfig)
}
