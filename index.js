const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const currentDate = new Date();

//extracting file name using date
const file_name = `${currentDate.getDate().toString()+"/"+(currentDate.getMonth()+1).toString()+"/"+currentDate.getFullYear().toString().slice(2,4)}`;
// console.log(file_name);

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const callback = (err, files) => {
  if(err){
    res.send(err.message);
  }
}
app.get('/', (req, res) => {
  fs.readdir("./files",(err, files) => {
  if(err){
    res.status(500).send(err);
  }else{
    res.render("index", { files });
  }
});

app.get("/files/:filename/delete",(req,res)=>{
  fs.unlink(`./files/${req.params.filename}`, (err)=>{
    if(err) return res.status(500).send(err);
  });
  res.redirect(`/`);
})

});
app.get('/files/:filename/edit', (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, 'utf8', (err, data) =>{
        if(err){
          res.status(500).send(err);
        }else{
          res.render("edit",{data,filename:req.params.filename});
        }
      })
});
app.post('/files/:filename/edit', (req, res) => {
  fs.writeFile(`./files/${req.params.filename}`,`${req.body.prevDetails}`,(err) => {
    if(err){
      res.status(500).send(err);
    }else{
      res.redirect(`/`);
    }
  })
});
app.get('/files/create', (req, res) => {
  res.render("create");
});

app.post('/create', (req, res) => {
  fs.writeFile(`./files/${req.body.date.split("/").join("")}.txt`,req.body.details,(err) => {
    if(err){
      res.status(500).send(err);
    }else{
      res.redirect(`/`);
    }
  })
});
app.get('/files/:filename', (req, res) => {
  let filename = req.params.filename;
  fs.readFile(`./files/${req.params.filename}`, 'utf8', (err, data) =>{
    if(err){
      res.status(500).send(err);
    }else{
      res.render("read", { data , filename});
    }
  })
});

app.listen(3000);