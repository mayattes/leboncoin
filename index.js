var express = require('express');
var multer = require("multer");
var upload = multer({ dest: "public/uploads/" });
var app = express();
app.use(express.static("public"));

var mongoose = require('mongoose');

mongoose.connect('mongodb://10.90.0.34:27017/leboncoin-koumba');

/* var studentSchema = new mongoose.Schema({
    name: String,
    age: Number
}); */

var annonceSchema = new mongoose.Schema({
    title: String,   
    town: String,
    description: String,
    picture: String,
    price: String,
    picture: String,
    town: String,
    nickname: String,
    email: String,
    telephone: String

});

/* var Student = mongoose.model("Student", studentSchema); */
var Annonce = mongoose.model("annonce", annonceSchema);

/* var ann = new Annonce({
    title: "Coffret blu-ray'Stanlay kubrick' neuf",
    price: "20 €",
    town: "Paris 75002",
    description: "Vends coffret blu-ray 'Stanley-kubrick: un réalisateur visionnaire' le coffret inclu: -2001 : l'odyssée de l'espace, Eyes Wid Shut, Full Metal Jacket, Orange mécanique, Shinning, Lolita, Barry Lyndon"
}); */



/* ann.save(function (err, obj) {
    if (err) {
        console.log("something went wrong");
    } else {
        console.log("we just saved the new student " + obj.name);
    }
}); */

/* Student.find({}, function (err, students) {
    console.log(students);

}); */


app.get('/', function (req, res) {
    res.render('home.ejs');
});


app.post('/deposer', upload.single("picture"), function (req, res) {
    var ann = new Annonce({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        picture: req.file.filename,
        town: req.body.town,
        nickname: req.body.nickname,
        email: req.body.email,
        telephone: req.body.telephone
    });

    ann.save(function (err, obj) {
        if (err) {
            console.log("something went wrong");
        } else {
            console.log("we just saved the new student " + obj.title);
            res.redirect("/");
        }
    });
});

app.get('/offres', function (req, res) {
    res.render('offres.ejs');
});

app.post("/upload", upload.single("picture"), function (req, res) {
    console.log(req.file);
    res.send("File uploaded");
})


 app.listen(3000, function () {
    console.log('hello');
});



 