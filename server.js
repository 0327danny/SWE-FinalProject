const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');

const User = require('./models/User');
const Reservation = require('./models/Reservation');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 2000;

// Middleware to parse JSON bodies
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Serve static files from the "frontend" folder (side-by-side with backend)
app.use(express.static(path.join(__dirname, '../frontend'))); // <-- Updated path

// Routes
app.use('/api/auth', authRoutes);              // Authentication routes (login, register)
app.use('/api/reservations', reservationRoutes); // Reservation management routes
app.use('/api/inventory', inventoryRoutes);     // Inventory management routes
app.use('/api/promotions', promotionRoutes);    // Promotion management routes

// MongoDB Connection
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

    const userSchema = new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, enum: ['user', 'admin'], default: 'user' } // Add role field
  });
  const User = mongoose.model('User', userSchema);

// Serve index.html at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html')); // <-- Updated path
});

// User Registration (Sign Up)
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(409).json({ message: "Username already exists." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: "Account created successfully!" });
  } catch (error) {
      res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(401).json({ message: "Invalid username or password." });
      }

      // Compare the entered password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: "Invalid username or password." });
      }

      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

      // Respond with the token
      res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
      res.status(500).json({ message: "Server error. Please try again later." });
  }
});


const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    table: { type: Number, required: true } // Add table number to track which table is reserved
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;

app.get('/api/reservations/tables', adminMiddleware, async (req, res) => {
  const { date, time } = req.query;

  try {
      const reservations = await Reservation.find({
          date: new Date(date),
          time: time
      });

      let tables = Array(50).fill(true);
      reservations.forEach(reservation => {
          tables[reservation.table - 1] = false;
      });

      // Return table availability
      res.status(200).json(tables);
  } catch (err) {
      res.status(500).json({ message: 'Failed to fetch table availability' });
  }
});



const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
      return res.status(401).json({ message: "No token provided, please login." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
          return res.status(403).json({ message: "Invalid token." });
      }
      req.user = user;
      next();
  });
};


app.post('/api/reservations', async (req, res) => {
  const { name, email, phone, date, time, partySize, specialRequests } = req.body;

  try {
      const reservation = new Reservation({ name, email, phone, date, time, partySize, specialRequests });
      await reservation.save();
      res.status(201).json({ message: "Reservation confirmed!", reservation });
  } catch (error) {
      res.status(500).json({ message: "Server error. Please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = socketIo(server);
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle socket disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});