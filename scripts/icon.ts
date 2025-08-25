import inquirer from 'inquirer'
import chalk from 'chalk'
import pkg from '../package.json'
import { createIconGenerator } from './icon.lib'

/**
 * Main function to generate icon data files for the IconPicker component
 * This script reads icon collections from @iconify/json and generates
 * TypeScript files with icon data for use in the application
 */
async function generateIcon(): Promise<void> {
  try {
    const iconGenerator = createIconGenerator()

    // Verify the iconify directory exists
    if (!(await iconGenerator.verifyIconifyDirectory())) {
      throw new Error('Iconify directory not found. Please install @iconify/json package.')
    }

    // Read the collections.json file to get available icon sets
    const raw = await iconGenerator.readCollectionsData()

    // Transform raw collection data into a more usable format with proper typing
    const collections = iconGenerator.transformCollections(raw)

    // Create choices array for the interactive prompt
    const choices = iconGenerator.createPromptChoices(collections)

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
    
    // Generate the icon set
    const result = await iconGenerator.generateIconSet(iconSet, collections)
    
    // Display success message with generated icon set information
    console.log(
      `✨ ${chalk.cyan(`[${pkg.name}]`)} - Icon generated successfully: ${chalk.green(`[${result.prefix}]`)}`
    )
    console.log(`📁 Output file: ${chalk.blue(result.outputFilePath)}`)
    console.log(`📊 Total icons: ${chalk.yellow(result.iconCount)}`)
    
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
