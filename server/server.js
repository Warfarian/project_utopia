require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require('openai');

// Import routes
const pinsRouter = require("./routes/pins");
const sheltersRouter = require("./routes/shelters");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/authRouter");

const app = express();
const mongoose = require("mongoose");

// Initialize OpenAI client with Nebius configuration
const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.com/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
});

console.log("Attempting to connect to MongoDB...");

// Set mongoose connection options
mongoose.set('bufferCommands', false); // Disable mongoose buffering
mongoose.set('bufferTimeoutMS', 10000); // Set buffer timeout to 10 seconds

mongoose
  .connect("mongodb://192.168.1.12:27017/DevPost", {
    serverSelectionTimeoutMS: 5000, // Reduce the server selection timeout
  })
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    console.error("Error details:", {
      name: err.name,
      message: err.message,
      code: err.code,
      codeName: err.codeName,
    });
    process.exit(1); // Exit the process on connection failure
  });

// Add connection event listeners
mongoose.connection.on('error', err => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected');
});

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`
    );
  });
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to strip markdown formatting
function stripMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic
    .replace(/`(.*?)`/g, '$1')       // Remove code
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Remove links
    .replace(/#{1,6}\s/g, '')        // Remove headers
    .replace(/\n+/g, ' ')            // Replace multiple newlines with single space
    .replace(/\s+/g, ' ')            // Replace multiple spaces with single space
    .trim();                         // Trim whitespace
}

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3-0324",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `You are a friendly assistant for Project Utopia, a platform connecting volunteers with local shelters. Here's how the platform works:

Main Features:
- Map: Add pins to mark locations needing help
- Shelters: Browse and filter local shelters by type (food banks, homeless, animal)
- Profile: Track volunteer hours, badges, and points earned
- Shop: Redeem points for rewards like cafe vouchers, movie tickets, gift cards

Points System:
- Earn 10 points per volunteer hour
- View points in Profile or Shop page
- Redeem points in Shop for various rewards

Navigation:
- Home: Overview and recent activity
- Map: Community help map
- Shelters: Directory of local shelters
- Shop: Redeem points for rewards
- Profile: Your stats and history

Keep responses concise and easy to read. Use this format:

Hi! [Brief greeting]
[1-2 sentences about what they asked]

If listing options, use bullet points:
- Option 1
- Option 2
- Option 3

Be friendly but direct. Focus on accurate information about the platform's actual features.`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    // Strip markdown from the response
    const cleanResponse = stripMarkdown(completion.choices[0].message.content);

    res.json({ message: cleanResponse });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process chat message" });
  }
});

// Routes
app.use("/api/pins", pinsRouter);
app.use("/api/shelters", sheltersRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Project Utopia API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
