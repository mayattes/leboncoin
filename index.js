var express = require('express');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
var passport = require('passport');
var bodyParser = require('body-parser');
var LocalStrategy = require('passport-local');
var User = require('./models/user');
var multer = require("multer");
var upload = multer({ dest: "public/uploads/" });
var app = express();
app.use(express.static("public"));

var mongoose = require('mongoose');

mongoose.connect('mongodb://10.90.0.34:27017/leboncoin-koumba');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Activer la gestion de la session
// app.use(expressSession({
//     secret: 'azerty',
//     resave: false,
//     saveUninitialized: false,
//     store: new MongoStore({ mongooseConnection: mongoose.connection })
// }));

// Activer `passport`
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser()); // JSON.stringify
// passport.deserializeUser(User.deserializeUser()); // JSON.parse

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

/* Student.find({}, function (err, students) {
    console.log(students);

}); */


app.get('/', function (req, res) {
    //Annonce.find({ _id: req.params }, function (err, ann) { 
    Annonce.find({}, function (err, ann) {
        res.render('home.ejs', {
            ann: ann,
        });

    });
});

app.get('/', function (req, res) {
    Ann.find({ _id: req.params }, function (err, ann) { 
        res.render('home.ejs', {
            ann: ann,
        });

    });
});


app.get('/deposer', function (req, res) {
    res.render('deposer.ejs');
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

/*app.get('/offres', function (req, res) {
    res.render('offres.ejs');
});*/

app.get('/offres', function (req, res) {
    Annonce.find({}, function (err, ann) {
        res.render('offres.ejs', {
            ann: ann,
        });

    });
});


app.post("/upload", upload.single("picture"), function (req, res) {
    console.log(req.file);
    res.send("File uploaded");
})

app.get('/annonce/:id', function (req, res) {
    Annonce.find({_id: req.params.id}, function (err, ann) {
        res.render('annonce.ejs', {
            ann: ann[0],
        });

    });
});

//supprimer une annonce
app.get('/annonce/:id/remove', function (req, res) {
    annonce.remove({ _id: req.body.id }, function (err) {
        if (!err) {
        message.type = 'notification!';
        } else { message.type = 'error'; }
        }); 

    });
});

//modifier une annonce





 app.listen(3000, function () {
    console.log('hello');
});



 