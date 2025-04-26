const express = require('express')
const router = express.Router()
const data = require('../data/mockData')

// Get all shelters
router.get('/', async (req, res) => {
  try {
    res.json(data.shelters)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get shelter by ID
router.get('/:id', async (req, res) => {
  try {
    const shelter = data.shelters.find(s => s.id === req.params.id)
    if (!shelter) {
      return res.status(404).json({ error: 'Shelter not found' })
    }
    res.json(shelter)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create shelter (admin only)
router.post('/', async (req, res) => {
  try {
    const shelter = {
      id: Date.now().toString(),
      ...req.body
    }
    data.shelters.push(shelter)
    res.status(201).json(shelter)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Update shelter (admin only)
router.put('/:id', async (req, res) => {
  try {
    const index = data.shelters.findIndex(s => s.id === req.params.id)
    if (index === -1) {
      return res.status(404).json({ error: 'Shelter not found' })
    }
    data.shelters[index] = {
      ...data.shelters[index],
      ...req.body
    }
    res.json(data.shelters[index])
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router