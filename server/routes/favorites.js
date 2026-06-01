import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { readJsonFile, writeJsonFile } from '../utils/fileStore.js'
import { enrichProductMetrics } from '../utils/productMetrics.js'

const router = express.Router()

const currentFilePath = fileURLToPath(import.meta.url)
const currentDirPath = path.dirname(currentFilePath)
const favoritesFilePath = path.join(currentDirPath, '..', 'data', 'favorites.json')
const productsFilePath = path.join(currentDirPath, '..', 'data', 'products.json')

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

router.get('/', async (req, res) => {
  try {
    const favoriteIds = await readJsonFile(favoritesFilePath)
    const products = await readJsonFile(productsFilePath)

    if (!Array.isArray(favoriteIds)) {
      return res.status(500).json({
        status: 'error',
        message: 'Favorites data format is invalid. Expected an array of product ids.',
      })
    }

    if (!Array.isArray(products)) {
      return res.status(500).json({
        status: 'error',
        message: 'Products data format is invalid. Expected an array.',
      })
    }

    // Create a map of products for efficient lookup  
    //eg:
    // 1 → { id: 1, productName: 'A 商品' }
    // 2 → { id: 2, productName: 'B 商品' }  
    const productMap = new Map(products.map((product) => [product.id, product]))

    const favoriteProducts = favoriteIds
      // Get the product for each favorite ID 
      .map((favoriteId) => productMap.get(favoriteId))
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
    const productId = parseProductId(req.body?.productId)

    if (productId === null) {
      return res.status(400).json({
        status: 'error',
        message: 'productId is invalid. Please provide a valid positive integer productId.',
      })
    }

    const products = await readJsonFile(productsFilePath)

    if (!Array.isArray(products)) {
      return res.status(500).json({
        status: 'error',
        message: 'Products data format is invalid. Expected an array.',
      })
    }

    const targetProduct = products.find((product) => product.id === productId)

    if (!targetProduct) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found. Cannot add it to favorites.',
      })
    }

    const favoriteIds = await readJsonFile(favoritesFilePath)

    if (!Array.isArray(favoriteIds)) {
      return res.status(500).json({
        status: 'error',
        message: 'Favorites data format is invalid. Expected an array of product ids.',
      })
    }

    if (favoriteIds.includes(productId)) {
      return res.status(409).json({
        status: 'error',
        message: '该商品已在候选池中。',
        product: enrichProductMetrics(targetProduct),
      })
    }

    const nextFavoriteIds = [...favoriteIds, productId]
    await writeJsonFile(favoritesFilePath, nextFavoriteIds)

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
    const productId = parseProductId(req.params.id)

    if (productId === null) {
      return res.status(400).json({
        status: 'error',
        message: 'productId is invalid. Please provide a valid positive integer productId.',
      })
    }

    const favoriteIds = await readJsonFile(favoritesFilePath)

    if (!Array.isArray(favoriteIds)) {
      return res.status(500).json({
        status: 'error',
        message: 'Favorites data format is invalid. Expected an array of product ids.',
      })
    }

    if (!favoriteIds.includes(productId)) {
      return res.status(404).json({
        status: 'error',
        message: '该商品不在候选池中，无法删除。',
      })
    }

    const nextFavoriteIds = favoriteIds.filter((favoriteId) => favoriteId !== productId)
    await writeJsonFile(favoritesFilePath, nextFavoriteIds)

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
