import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const currentFilePath = fileURLToPath(import.meta.url)
const currentDirPath = path.dirname(currentFilePath)
const serverEnvPath = path.join(currentDirPath, '..', '.env')

dotenv.config({ path: serverEnvPath, quiet: true })
