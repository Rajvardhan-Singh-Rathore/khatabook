const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Connect MongoDB
mongoose.connect(
  process.env.MONGO_URI ||
    'mongodb+srv://forfarzivada_db_user:knkszt9aujD5RAgN@khatabook.kutpwvm.mongodb.net/khatabook?retryWrites=true&w=majority&appName=Khatabook'
)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Schema & Model
const recordSchema = new mongoose.Schema({
  date: String,
  details: String
});
const Record = mongoose.model('Record', recordSchema);

// Express setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Routes

// Home page
app.get('/', async (req, res) => {
  try {
    const records = await Record.find().sort({ date: -1 });
    res.render('index', { records });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create record page
app.get('/files/create', (req, res) => {
  res.render('create');
});

// Create record POST
app.post('/files/create', async (req, res) => {
  try {
    const { date, details } = req.body;
    if (!date || !details) {
      return res.status(400).send('Date and Details are required.');
    }
    await Record.create({ date, details });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// View single record
app.get('/files/:id', async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).send('Record not found');
    res.render('read', { record });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Edit record page
app.get('/files/:id/edit', async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).send('Record not found');
    res.render('edit', { record });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Edit record POST
app.post('/files/:id/edit', async (req, res) => {
  try {
    const { date, details } = req.body;
    if (!date || !details) {
      return res.status(400).send('Date and Details are required.');
    }
    await Record.findByIdAndUpdate(req.params.id, { date, details });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete record
app.get('/files/:id/delete', async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
