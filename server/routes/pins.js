const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const data = require('../data/mockData')

// Helper function to save data back to mockData.js
const saveData = () => {
  const filePath = path.join(__dirname, '../data/mockData.js')
  const fileContent = `// Mock data store
const data = ${JSON.stringify(data, null, 2)}

module.exports = data
`
  fs.writeFileSync(filePath, fileContent, 'utf8')
}

// Get all pins
router.get('/', async (req, res) => {
  try {
    console.log('[GET] /api/pins - Fetching all pins')
    // Add user name to each pin
    const pinsWithUsers = data.pins.map(pin => {
      const user = data.users.find(u => u.id === pin.createdBy)
      return {
        ...pin,
        createdBy: { id: user.id, name: user.name }
      }
    })
    console.log(`[GET] /api/pins - Found ${pinsWithUsers.length} pins`)
    res.json(pinsWithUsers)
  } catch (error) {
    console.error('[GET] /api/pins - Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Create new pin
router.post('/', async (req, res) => {
  try {
    console.log('[POST] /api/pins - Creating new pin:', req.body)
    const pin = {
      id: Date.now().toString(),
      ...req.body,
      timestamp: new Date()
    }
    data.pins.push(pin)
    
    // Save updated data back to file
    saveData()
    
    console.log('[POST] /api/pins - Created pin:', pin.id)
    res.status(201).json(pin)
  } catch (error) {
    console.error('[POST] /api/pins - Error:', error.message)
    res.status(400).json({ error: error.message })
  }
})

// Get pin by ID
router.get('/:id', async (req, res) => {
  try {
    console.log(`[GET] /api/pins/${req.params.id} - Fetching pin`)
    const pin = data.pins.find(p => p.id === req.params.id)
    if (!pin) {
      console.log(`[GET] /api/pins/${req.params.id} - Pin not found`)
      return res.status(404).json({ error: 'Pin not found' })
    }
    const user = data.users.find(u => u.id === pin.createdBy)
    console.log(`[GET] /api/pins/${req.params.id} - Found pin`)
    res.json({
      ...pin,
      createdBy: { id: user.id, name: user.name }
    })
  } catch (error) {
    console.error(`[GET] /api/pins/${req.params.id} - Error:`, error.message)
    res.status(500).json({ error: error.message })
  }
})

// Delete pin
router.delete('/:id', async (req, res) => {
  try {
    console.log(`[DELETE] /api/pins/${req.params.id} - Deleting pin`)
    const index = data.pins.findIndex(p => p.id === req.params.id)
    if (index === -1) {
      console.log(`[DELETE] /api/pins/${req.params.id} - Pin not found`)
      return res.status(404).json({ error: 'Pin not found' })
    }
    data.pins.splice(index, 1)
    
    // Save updated data back to file
    saveData()
    
    console.log(`[DELETE] /api/pins/${req.params.id} - Pin deleted`)
    res.json({ message: 'Pin deleted successfully' })
  } catch (error) {
    console.error(`[DELETE] /api/pins/${req.params.id} - Error:`, error.message)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router