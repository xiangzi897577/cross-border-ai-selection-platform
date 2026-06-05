import '../config/env.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { supabase } from '../lib/supabase.js'
import { readJsonFile } from '../utils/fileStore.js'
import { mapProductToRow } from '../utils/productMapper.js'

const currentFilePath = fileURLToPath(import.meta.url)
const currentDirPath = path.dirname(currentFilePath)
const productsFilePath = path.join(currentDirPath, '..', 'data', 'products.json')

function validateProducts(products) {
  if (!Array.isArray(products)) {
    throw new Error('products.json data format is invalid. Expected an array.')
  }

  const invalidProducts = products.filter((product) => {
    return product === null || product === undefined || product.id === null || product.id === undefined
  })

  if (invalidProducts.length > 0) {
    throw new Error(`Found ${invalidProducts.length} products without id.`)
  }
}

async function importProductsToSupabase() {
  const products = await readJsonFile(productsFilePath)
  validateProducts(products)

  const rows = products.map((product) => mapProductToRow(product))
  const { data, error } = await supabase
    .from('products')
    .upsert(rows, { onConflict: 'id' })
    .select('id')

  const successCount = Array.isArray(data) ? data.length : 0
  const failureCount = error ? products.length : 0

  console.log(`products.json 商品数量: ${products.length}`)
  console.log(`Supabase 成功写入数量: ${successCount}`)
  console.log(`失败数量: ${failureCount}`)

  if (error) {
    console.error(`失败原因: ${error.message}`)
    process.exitCode = 1
    return
  }

  console.log('失败原因: 无')
}

importProductsToSupabase().catch((error) => {
  console.log('products.json 商品数量: 0')
  console.log('Supabase 成功写入数量: 0')
  console.log('失败数量: 未知')
  console.error(`失败原因: ${error.message}`)
  process.exitCode = 1
})
