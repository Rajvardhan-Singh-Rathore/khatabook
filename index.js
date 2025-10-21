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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  const records = await Record.find().sort({ _id: -1 });
  res.render('index', { files: records });
});

app.get('/files/create', (req, res) => {
  res.render('create');
});

app.post('/create', async (req, res) => {
  const record = new Record({ date: req.body.date, details: req.body.details });
  await record.save();
  res.redirect('/');
});

app.get('/files/:id', async (req, res) => {
  const record = await Record.findById(req.params.id);
  res.render('read', { data: record.details, filename: record.date });
});

app.get('/files/:id/edit', async (req, res) => {
  const record = await Record.findById(req.params.id);
  res.render('edit', { data: record.details, filename: record._id });
});

app.post('/files/:id/edit', async (req, res) => {
  await Record.findByIdAndUpdate(req.params.id, { details: req.body.prevDetails });
  res.redirect('/');
});

app.get('/files/:id/delete', async (req, res) => {
  await Record.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});