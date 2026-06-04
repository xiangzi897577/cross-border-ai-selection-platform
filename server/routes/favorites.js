import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { supabase } from '../lib/supabase.js'
import { readJsonFile } from '../utils/fileStore.js'
import { enrichProductMetrics } from '../utils/productMetrics.js'

const router = express.Router()

const currentFilePath = fileURLToPath(import.meta.url)
const currentDirPath = path.dirname(currentFilePath)
const productsFilePath = path.join(currentDirPath, '..', 'data', 'products.json')

function getClientId(req) {
  const rawClientId = req.headers['x-client-id']
  const clientId = Array.isArray(rawClientId) ? rawClientId[0] : rawClientId

  return typeof clientId === 'string' ? clientId.trim() : ''
}

function parseProductId(productId) {
  if (productId === undefined || productId === null || productId === '') {
    return null
  }

  const numberValue = Number(productId)

  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return null
  }

  return numberValue
}

async function readProducts() {
  const products = await readJsonFile(productsFilePath)

  if (!Array.isArray(products)) {
    throw new Error('Products data format is invalid. Expected an array.')
  }

  return products
}

function isUniqueConstraintError(error) {
  return error?.code === '23505'
}

router.get('/', async (req, res) => {
  try {
    const clientId = getClientId(req)

    if (!clientId) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing client id',
      })
    }

    const products = await readProducts()
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('product_id, created_at')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to query favorites from Supabase.',
        error: error.message,
      })
    }

    // Create a map of products for efficient lookup  
    //eg:
    // 1 → { id: 1, productName: 'A 商品' }
    // 2 → { id: 2, productName: 'B 商品' }  
    const productMap = new Map(products.map((product) => [product.id, product]))

    const favoriteProducts = favorites
      // Get the product for each favorite ID 
      .map((favorite) => productMap.get(favorite.product_id))
      .filter(Boolean)
      .map((product) => enrichProductMetrics(product))

    return res.json(favoriteProducts)
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to read favorites data.',
      error: error.message,
    })
  }
})

router.post('/', async (req, res) => {
  try {
    const clientId = getClientId(req)
    const productId = parseProductId(req.body?.productId)

    if (!clientId) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing client id',
      })
    }

    if (productId === null) {
      return res.status(400).json({
        status: 'error',
        message: 'productId is invalid. Please provide a valid positive integer productId.',
      })
    }

    const products = await readProducts()
    const targetProduct = products.find((product) => product.id === productId)

    if (!targetProduct) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found. Cannot add it to favorites.',
      })
    }

    const { error } = await supabase
      .from('favorites')
      .insert({
        client_id: clientId,
        product_id: productId,
      })

    if (isUniqueConstraintError(error)) {
      return res.status(409).json({
        status: 'error',
        message: 'Product already in favorites',
        product: enrichProductMetrics(targetProduct),
      })
    }

    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to add favorite product in Supabase.',
        error: error.message,
      })
    }

    return res.status(201).json({
      status: 'success',
      message: '商品已成功添加到候选池。',
      product: enrichProductMetrics(targetProduct),
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to add favorite product.',
      error: error.message,
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const clientId = getClientId(req)
    const productId = parseProductId(req.params.id)

    if (!clientId) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing client id',
      })
    }

    if (productId === null) {
      return res.status(400).json({
        status: 'error',
        message: 'productId is invalid. Please provide a valid positive integer productId.',
      })
    }

    const { data: deletedFavorites, error } = await supabase
      .from('favorites')
      .delete()
      .eq('client_id', clientId)
      .eq('product_id', productId)
      .select('product_id')

    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete favorite product from Supabase.',
        error: error.message,
      })
    }

    if (!Array.isArray(deletedFavorites) || deletedFavorites.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: '该商品不在候选池中，无法删除。',
      })
    }

    return res.json({
      status: 'success',
      message: '商品已成功从候选池中删除。',
      productId,
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete favorite product.',
      error: error.message,
    })
  }
})

export default router
