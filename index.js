const express = require('express');
const app = express();
const db_conn = require('./controller/db');
const authRouter = require('./routes/auth');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173'
  }));
  

// Connect to the database
db_conn();

// Middleware
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
  
app.use(limiter);
// Define Routes
app.use('/api/auth', authRouter); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
