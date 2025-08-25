import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import chalk from 'chalk'
import pkg from '../package.json'
import { ICON_PREFIX } from '../src/constants'

/**
 * Icon interface defining the structure of icon data
 * @interface Icon
 * @property {string} name - Display name of the icon set
 * @property {string} prefix - Icon prefix identifier
 * @property {string[]} icons - Array of icon names in the set
 */
interface Icon {
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
interface Collection {
  id: string
  name: string
  prefix: string
}

/**
 * Main function to generate icon data files for the IconPicker component
 * This script reads icon collections from @iconify/json and generates
 * TypeScript files with icon data for use in the application
 */
async function generateIcon(): Promise<void> {
  try {
    // Path to the @iconify/json package containing icon collections
    const iconifyDir = path.resolve(process.cwd(), 'node_modules/@iconify/json')
    
    // Verify the iconify directory exists
    if (!(await fs.pathExists(iconifyDir))) {
      throw new Error(`Iconify directory not found: ${iconifyDir}`)
    }

    // Read the collections.json file to get available icon sets
    const collectionsPath = path.join(iconifyDir, 'collections.json')
    const raw = await fs.readJSON(collectionsPath)

    // Transform raw collection data into a more usable format with proper typing
    const collections: Collection[] = Object.entries(raw).map(([id, v]: [string, any]) => ({
      id,
      name: v.name || id,
      prefix: v.prefix || id
    }))

    // Create choices array for the interactive prompt
    const choices = collections.map((item) => ({ 
      key: item.id, 
      value: item.id, 
      name: item.name 
    }))

    // Start interactive prompt to let user select which icon set to generate
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'iconSet',
        choices,
        message: 'Select the icon set that needs to be generated:'
      }
    ])

    const { iconSet } = answers
    
    // Find the selected collection
    const selectedCollection = collections.find(item => item.id === iconSet)
    if (!selectedCollection) {
      throw new Error(`Selected icon set not found: ${iconSet}`)
    }

    // Define output directory for generated icon data files
    const outputDir = path.resolve(process.cwd(), 'src/components/IconPicker/src/data')
    
    // Ensure the output directory exists (create if it doesn't)
    await fs.ensureDir(outputDir)
    
    // Read the specific icon collection JSON file
    const collectionDataPath = path.join(iconifyDir, 'json', `${iconSet}.json`)
    const data = await fs.readJSON(collectionDataPath)
    
    if (!data || !data.icons) {
      throw new Error(`Invalid icon collection data for: ${iconSet}`)
    }

    const { prefix, icons: iconData } = data
    
    // Create prefix name by combining ICON_PREFIX constant with collection prefix
    const prefixName = `${ICON_PREFIX}${prefix}`
    
    // Generate full icon names by combining prefix with individual icon names
    const iconNames = Object.keys(iconData).map((iconName) => `${prefixName}:${iconName}`)

    // Prepare the icon data object
    const iconSetData: Icon = {
      name: selectedCollection.name,
      prefix: prefixName,
      icons: iconNames
    }

    // Generate the output file path
    const outputFilePath = path.join(outputDir, `icons.${prefix}.ts`)
    
    // Write the generated icon data to a TypeScript file
    const fileContent = `export default ${JSON.stringify(iconSetData, null, 2)}`
    await fs.writeFile(outputFilePath, fileContent, 'utf8')
    
    // Display success message with generated icon set information
    console.log(
      `✨ ${chalk.cyan(`[${pkg.name}]`)} - Icon generated successfully: ${chalk.green(`[${prefix}]`)}`
    )
    console.log(`📁 Output file: ${chalk.blue(outputFilePath)}`)
    console.log(`📊 Total icons: ${chalk.yellow(iconNames.length)}`)
    
  } catch (error) {
    console.error(chalk.red('❌ Error generating icons:'), error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

// Execute the icon generation function when script is run
generateIcon().catch((error) => {
  console.error(chalk.red('❌ Fatal error:'), error)
  process.exit(1)
})
