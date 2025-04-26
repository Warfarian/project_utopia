const express = require('express')
const router = express.Router()
const data = require('../data/mockData')

// Get all pins
router.get('/', async (req, res) => {
  try {
    // Add user name to each pin
    const pinsWithUsers = data.pins.map(pin => {
      const user = data.users.find(u => u.id === pin.createdBy)
      return {
        ...pin,
        createdBy: { id: user.id, name: user.name }
      }
    })
    res.json(pinsWithUsers)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create new pin
router.post('/', async (req, res) => {
  try {
    const pin = {
      id: Date.now().toString(),
      ...req.body,
      timestamp: new Date()
    }
    data.pins.push(pin)
    res.status(201).json(pin)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Get pin by ID
router.get('/:id', async (req, res) => {
  try {
    const pin = data.pins.find(p => p.id === req.params.id)
    if (!pin) {
      return res.status(404).json({ error: 'Pin not found' })
    }
    const user = data.users.find(u => u.id === pin.createdBy)
    res.json({
      ...pin,
      createdBy: { id: user.id, name: user.name }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete pin
router.delete('/:id', async (req, res) => {
  try {
    const index = data.pins.findIndex(p => p.id === req.params.id)
    if (index === -1) {
      return res.status(404).json({ error: 'Pin not found' })
    }
    data.pins.splice(index, 1)
    res.json({ message: 'Pin deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router