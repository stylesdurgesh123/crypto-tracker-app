const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const { connectToDatabase } = require('./utils/db');
const coinsRouter = require('./routes/coins');
const historyRouter = require('./routes/history');

// Routes
app.use('/api/coins', coinsRouter);
app.use('/api/history', historyRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 4000;

// Start server after DB connection
connectToDatabase()
  .then(() => {
    // Initialize cron after DB is ready
    require('./tasks/cron');

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

