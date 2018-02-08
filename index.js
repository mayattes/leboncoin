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

var mongoose = require('mongoose');

mongoose.connect('mongodb://10.90.0.34:27017/leboncoin-koumba');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Activer la gestion de la session
app.use(expressSession({
    secret: 'azerty',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Activer `passport`
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // JSON.stringify
passport.deserializeUser(User.deserializeUser()); // JSON.parse

// //routage
// app.get('/', function (req, res) {
//     res.render('home');
// });

app.get('/secret', function (req, res) {
    if (req.isAuthenticated()) {
        console.log(req.user);
        res.render('secret');
    } else {
        res.redirect('/');
    }
});

app.get('/register', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/secret');
    } else {
        res.render('register');
    }
});

app.post('/register', function (req, res) {
    // Créer un utilisateur, en utilisant le model defini
    // Nous aurons besoin de `req.body.username` et `req.body.password`
    User.register(
        new User({
            username: req.body.username,
            // D'autres champs peuvent être ajoutés ici
        }),
        req.body.password, // password will be hashed
        function (err, user) {
            if (err) {
                console.log(err);
                return res.render('register');
            } else {
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/secret');
                });
            }
        }
    );
});

app.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/secret');
    } else {
        res.render('login');
    }
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}));

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect('/');
});

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
    Annonce.remove({ _id: req.params.id }, function (err, ann) {
        res.render('annonce.ejs', {
            ann: ann[0],
        });
    });

});

//modifier une annonce
app.get('/annonce/:id/modifier', function (req, res) {
    Annonce.findOne({ _id: req.params.id }, function (err, ann) {
        res.render('annonce.ejs', {
            ann: ann,
        });
    });

});


 app.listen(3000, function () {
    console.log('hello');
});



 