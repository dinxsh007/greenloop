const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const pickupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  wasteType: { type: String, required: true, trim: true },
  quantity: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  notes: { type: String, default: '' },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const PickupRequest = mongoose.model('PickupRequest', pickupSchema);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'GREENLOOP backend is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/requests', async (req, res) => {
  try {
    const requests = await PickupRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch requests',
      error: error.message
    });
  }
});

app.post('/api/requests', async (req, res) => {
  try {
    const { name, email, phone, wasteType, quantity, address, notes } = req.body;

    if (!name || !email || !phone || !wasteType || !quantity || !address) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const request = new PickupRequest({
      name,
      email,
      phone,
      wasteType,
      quantity,
      address,
      notes
    });

    await request.save();

    res.status(201).json({
      message: 'Pickup request submitted successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      message: 'Could not save request',
      error: error.message
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function startServer() {
  const mongoURI = process.env.MONGO_URI;

  try {
    const mongoConfig = mongoURI
      ? { mongoUri: mongoURI }
      : { binary: { version: '7.0.14' } };

    const mongoServer = mongoURI ? null : await MongoMemoryServer.create(mongoConfig);
    const uri = mongoURI || mongoServer.getUri();

    await mongoose.connect(uri);
    console.log('MongoDB connected successfully.');
    if (process.env.VERCEL) {
      return app;
    }
    app.listen(PORT, () => {
      console.log(`GREENLOOP app running on http://localhost:${PORT}`);
    });
    return app;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
