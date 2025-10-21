const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://forfarzivada_db_user:knkszt9aujD5RAgN@khatabook.kutpwvm.mongodb.net/khatabook?retryWrites=true&w=majority&appName=Khatabook')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const recordSchema = new mongoose.Schema({
  date: String,
  details: String
});
const Record = mongoose.model('Record', recordSchema);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Home page: list all records
app.get('/', async (req, res) => {
  try {
    const records = await Record.find();
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
  const { date, details } = req.body;
  await Record.create({ date, details });
  res.redirect('/');
});

// Delete record
app.get('/files/:id/delete', async (req, res) => {
  await Record.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// Edit record page
app.get('/files/:id/edit', async (req, res) => {
  const record = await Record.findById(req.params.id);
  if (!record) return res.status(404).send('Record not found');
  res.render('edit', { record });
});

// Edit record POST
app.post('/files/:id/edit', async (req, res) => {
  const { date, details } = req.body;
  await Record.findByIdAndUpdate(req.params.id, { date, details });
  res.redirect('/');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
