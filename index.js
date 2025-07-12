const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', function (req, res) {
    fs.readdir(`./files`, function (err, files) {
        if (err) {
            return res.status(500).send("Error reading files directory.");
        }
        res.render("index", { files: files });
    });
});

app.get('/files/:filename', function (req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {
        if (err) {
            return res.status(500).send("Error reading file.");
        }
        res.render("show", {
            data: filedata,
            filename: req.params.filename
        });
    });
});

app.get('/edit/:filename', function (req, res) {
    res.render('edit', { filename: req.params.filename });
});

app.post('/edit', function (req, res) {
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function (err) {
        if (err) {
            return res.status(500).send("Error renaming file.");
        }
        res.redirect("/");
    });
});

app.post('/create', function (req, res) {
    const filename = req.body.title.split(' ').join('') + '.txt';
    fs.writeFile(`./files/${filename}`, req.body.details, function (err) {
        if (err) {
            return res.status(500).send("Error writing file.");
        }
        res.redirect("/");
    });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
