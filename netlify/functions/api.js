const express = require("express");
const serverless = require("serverless-http");
const fs = require("fs");
const path = require("path");

const app = express();

// -----------------------------
// ✅ Correct Paths for Netlify
// -----------------------------
const rootPath = path.resolve(__dirname, "../../");
const viewsPath = path.join(rootPath, "views");
const publicPath = path.join(rootPath, "public");

// Use /tmp for files to avoid read-only errors in serverless
const filesPath = path.join("/tmp", "files");

// Ensure 'files' folder exists in /tmp
if (!fs.existsSync(filesPath)) {
  fs.mkdirSync(filesPath, { recursive: true });
  console.log("📁 Created 'files' folder at:", filesPath);
}

// Debug paths
console.log("✅ Root Path:", rootPath);
console.log("✅ Views Path:", viewsPath);
console.log("✅ Files Path:", filesPath);

// -----------------------------
// Express setup
// -----------------------------
app.set("view engine", "ejs");
app.set("views", viewsPath);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicPath));

// -----------------------------
// Routes
// -----------------------------
app.get("/", (req, res) => {
  fs.readdir(filesPath, (err, files) => {
    if (err) return res.status(500).send(err);
    res.render("index", { files });
  });
});

app.get("/files/:filename/delete", (req, res) => {
  fs.unlink(path.join(filesPath, req.params.filename), (err) => {
    if (err) return res.status(500).send(err);
    res.redirect("/");
  });
});

app.get("/files/:filename/edit", (req, res) => {
  fs.readFile(path.join(filesPath, req.params.filename), "utf8", (err, data) => {
    if (err) return res.status(500).send(err);
    res.render("edit", { data, filename: req.params.filename });
  });
});

app.post("/files/:filename/edit", (req, res) => {
  fs.writeFile(path.join(filesPath, req.params.filename), req.body.prevDetails, (err) => {
    if (err) return res.status(500).send(err);
    res.redirect("/");
  });
});

app.get("/files/create", (req, res) => {
  res.render("create");
});

app.post("/create", (req, res) => {
  const filename = req.body.date.split("/").join("") + ".txt";
  fs.writeFile(path.join(filesPath, filename), req.body.details, (err) => {
    if (err) return res.status(500).send(err);
    res.redirect("/");
  });
});

app.get("/files/:filename", (req, res) => {
  const filepath = path.join(filesPath, req.params.filename);
  fs.readFile(filepath, "utf8", (err, data) => {
    if (err) return res.status(500).send(err);
    res.render("read", { data, filename: req.params.filename });
  });
});

// -----------------------------
// Export for Netlify
// -----------------------------
module.exports.handler = serverless(app);
