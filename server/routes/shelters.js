const express = require('express')
const router = express.Router()
const data = require('../data/mockData')

// Get all shelters
router.get('/', async (req, res) => {
  try {
    console.log('[GET] /api/shelters - Fetching all shelters')
    console.log(`[GET] /api/shelters - Found ${data.shelters.length} shelters`)
    res.json(data.shelters)
  } catch (error) {
    console.error('[GET] /api/shelters - Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Get shelter by ID
router.get('/:id', async (req, res) => {
  try {
    console.log(`[GET] /api/shelters/${req.params.id} - Fetching shelter`)
    const shelter = data.shelters.find(s => s.id === req.params.id)
    if (!shelter) {
      console.log(`[GET] /api/shelters/${req.params.id} - Shelter not found`)
      return res.status(404).json({ error: 'Shelter not found' })
    }
    console.log(`[GET] /api/shelters/${req.params.id} - Found shelter`)
    res.json(shelter)
  } catch (error) {
    console.error(`[GET] /api/shelters/${req.params.id} - Error:`, error.message)
    res.status(500).json({ error: error.message })
  }
})

// Create shelter (admin only)
router.post('/', async (req, res) => {
  try {
    console.log('[POST] /api/shelters - Creating new shelter:', req.body)
    const shelter = {
      id: Date.now().toString(),
      ...req.body
    }
    data.shelters.push(shelter)
    console.log('[POST] /api/shelters - Created shelter:', shelter.id)
    res.status(201).json(shelter)
  } catch (error) {
    console.error('[POST] /api/shelters - Error:', error.message)
    res.status(400).json({ error: error.message })
  }
})

// Update shelter (admin only)
router.put('/:id', async (req, res) => {
  try {
    console.log(`[PUT] /api/shelters/${req.params.id} - Updating shelter:`, req.body)
    const index = data.shelters.findIndex(s => s.id === req.params.id)
    if (index === -1) {
      console.log(`[PUT] /api/shelters/${req.params.id} - Shelter not found`)
      return res.status(404).json({ error: 'Shelter not found' })
    }
    data.shelters[index] = {
      ...data.shelters[index],
      ...req.body
    }
    console.log(`[PUT] /api/shelters/${req.params.id} - Updated shelter`)
    res.json(data.shelters[index])
  } catch (error) {
    console.error(`[PUT] /api/shelters/${req.params.id} - Error:`, error.message)
    res.status(400).json({ error: error.message })
  }
})

module.exports = router