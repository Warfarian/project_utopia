require('dotenv').config()
const express = require('express')
const cors = require('cors')

// Import routes
const pinsRouter = require('./routes/pins')
const sheltersRouter = require('./routes/shelters')
const usersRouter = require('./routes/users')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/pins', pinsRouter)
app.use('/api/shelters', sheltersRouter)
app.use('/api/users', usersRouter)

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Project Utopia API' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})