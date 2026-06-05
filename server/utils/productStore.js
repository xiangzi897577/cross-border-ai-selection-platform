import path from 'path'
import { fileURLToPath } from 'url'
import { supabase } from '../lib/supabase.js'
import { readJsonFile } from './fileStore.js'
import { mapProductRowToProduct } from './productMapper.js'

const currentFilePath = fileURLToPath(import.meta.url)
const currentDirPath = path.dirname(currentFilePath)
const productsFilePath = path.join(currentDirPath, '..', 'data', 'products.json')
const PRODUCT_SELECT_COLUMNS = `
  id,
  product_name,
  category,
  amazon_price,
  cost_1688,
  shipping_cost,
  platform_fee_rate,
  estimated_monthly_sales,
  rating,
  review_count,
  competition_score,
  weight,
  volume_level,
  material,
  supplier,
  image,
  image_source,
  source_image_url,
  tags,
  risk_factors,
  recommendation_reason
`

export const INVALID_PRODUCTS_FORMAT_MESSAGE =
  'Products data format is invalid. Expected an array.'

export async function readProductsFromJson() {
  const products = await readJsonFile(productsFilePath)

  if (!Array.isArray(products)) {
    throw new Error(INVALID_PRODUCTS_FORMAT_MESSAGE)
  }

  return products
}

export async function readProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT_COLUMNS)
    .order('id', { ascending: true })

  if (error) {
    throw new Error(`Failed to read products from Supabase. ${error.message}`)
  }

  if (!Array.isArray(data)) {
    throw new Error(INVALID_PRODUCTS_FORMAT_MESSAGE)
  }

  return data.map((row) => mapProductRowToProduct(row))
}

export async function readProductById(productId) {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT_COLUMNS)
    .eq('id', productId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to read product from Supabase. ${error.message}`)
  }

  return data ? mapProductRowToProduct(data) : null
}
