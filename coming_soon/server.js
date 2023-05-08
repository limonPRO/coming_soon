const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/subscriptions', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log('Error connecting to MongoDB', err);
});

// Create subscription schema
const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: 'Invalid email address',
    },
  },
}, {
  timestamps: true,
});

// Create subscription model
const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Create API endpoint for creating a new subscription
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;

  Subscription.create({ email })
    .then(() => {
      res.json({ success: true, message: 'Subscription successful' });
    })
    .catch((err) => {
      res.json({ success: false, message: 'Subscription failed' });
    });
});

app.get('/api/subscribe', async(req, res) => {
    try {
        const subscriptions = await Subscription.find({});
        res.json({ success: true, data: subscriptions });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
      }
  });

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
