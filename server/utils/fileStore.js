import { readFile, writeFile } from 'fs/promises'
// Utility functions for reading and writing JSON files

export async function readJsonFile(filePath) {
  // Reads a JSON file and returns the parsed object
  try {
    const fileContent = await readFile(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`JSON file does not exist: ${filePath}`)
    }

    if (error instanceof SyntaxError) {
      throw new Error(`JSON file format is invalid: ${filePath}`)
    }

    throw new Error(`Failed to read JSON file: ${filePath}. ${error.message}`)
  }
}

export async function writeJsonFile(filePath, data) {
  // Writes an object to a JSON file with pretty formatting 
  try {
    const fileContent = JSON.stringify(data, null, 2)
    await writeFile(filePath, fileContent, 'utf-8')
  } catch (error) {
    throw new Error(`Failed to write JSON file: ${filePath}. ${error.message}`)
  }
}
