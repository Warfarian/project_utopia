const express = require('express')
const router = express.Router()
const data = require('../data/mockData')

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = data.users.find(u => u.id === req.params.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const index = data.users.findIndex(u => u.id === req.params.id)
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' })
    }
    data.users[index] = {
      ...data.users[index],
      ...req.body
    }
    res.json(data.users[index])
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Add volunteer activity
router.post('/:id/volunteer', async (req, res) => {
  try {
    const user = data.users.find(u => u.id === req.params.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const activity = {
      id: Date.now().toString(),
      ...req.body
    }

    user.volunteerHistory.unshift(activity)
    user.stats.volunteeredHours += activity.hours
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Redeem reward
router.post('/:id/rewards/:rewardId/redeem', async (req, res) => {
  try {
    const user = data.users.find(u => u.id === req.params.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const reward = user.rewards.find(r => r.id === req.params.rewardId)
    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' })
    }

    if (reward.status === 'redeemed') {
      return res.status(400).json({ error: 'Reward already redeemed' })
    }

    reward.status = 'redeemed'
    reward.redeemedAt = new Date()
    user.stats.rewardsEarned += 1
    res.json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router