const   express   =     require("express"),
        bodyParser                     = require("body-parser"),
        formidable                     = require("formidable"),
        path                           = require("path"),
        fs                             = require("fs"),
        mongoose                       = require("mongoose"),
        methodOverride                 = require("method-override"),
        passport                       = require("passport"),
        LocalStrategy                  = require("passport-local"),
        passportLocalMongoose          = require("passport-local-mongoose"),
        User                           = require("./models/user"),
        Post                           = require("./models/posts");
      

        
       

var dbUrl = "mongodb+srv://ice669:07066944154@cluster0.oghz8.mongodb.net/i4g?retryWrites=true&w=majority";
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true}).then(function(reqult){
    console.log("Connected With Db");
}).catch(function(err){
    console.log(err);
})

var app = express();
var folder = path.join(__dirname + "files");
        if(!fs.existsSync(folder)){
            fs.mkdirSync(folder);
        }
        
        app.use(require("express-session")({
            secret: "This is working Fine",
            resave:false,
            saveUninitialized: false
        }));
app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('files'));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
   res.locals.currentUser = req.user;
    next();
});
function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
        }else{
        res.redirect('/login')
         }
        }

app.get("/post", isLoggedin, function(req,res){
    res.render("protected");
})
app.get("/login", function(req,res){
    res.render("login");
})
app.get("/", function(req,res){
    Post.find({}).populate("postedBy","likes").sort("likes").exec().then(function(result){
           res.render("index", {posts: result});
    }).catch(function(err){
        console.log(err);
    })
    
})


// Content Post Handle
app.get("/post/:id",function(req,res){
    var _id = mongoose.Types.ObjectId(req.params.id);
    Post.findById({_id}).populate("postedBy","likes").exec().then(function(result){
        res.render("single", {spost: result});
    }).catch(function(err){
        console.log(err);
    })
})
app.post("/post", isLoggedin, function(req,res){
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.multiples = true;
    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/files/' + file.name;
    });
    form.parse(req, (err, fields, files) => {
            const imgAddress=[];
            const vid = files.vid.name;
            for (let index = 0; index < files.image.length; index++) {
                imgAddress[index] = files.image[index].name
            }   
        const newH = { postT: fields.postT, postC: fields.postC, discription: fields.discription, spec: fields.spec,
                    vid: vid, image1: imgAddress[0],image2: imgAddress[1],
                    image3: imgAddress[2],image4: imgAddress[3],image5: imgAddress[4], postedBy: req.user
                }

    Post.create(newH).then(function(result){
        res.redirect("/");
    }).catch(function(err){
        console.log(err)
    });
});
    
});


app.put("/like/:id", isLoggedin, function(req,res){
    var _id = mongoose.Types.ObjectId(req.params.id);
    Post.findByIdAndUpdate(_id).then(function(result){
        result.likes.push(req.user._id);
        res.redirect('/post/' + _id);
        console.log(result);
        result.save()
    }).catch(function(err){
        console.log(err)
    })
})
app.put("/unlike/:id", isLoggedin, function(req,res){
    var _id = mongoose.Types.ObjectId(req.params.id);
    Post.findByIdAndUpdate(_id).then(function(result){
        result.likes.pull(req.user._id);
        res.redirect('/post/' + _id);
        console.log(result);
        result.save()
    }).catch(function(err){
        console.log(err)
    })
})
// Local Authentication Mi

app.post("/register", function(req,res){
    req.body.username;
    req.body.password;
    User.register(new User({username:req.body.username, name:req.body.name}),   req.body.password).then(function(result){
        passport.authenticate("local")(req,res,function(result){
            res.send("Singed Success");
            console.log(req.body.name);
        });
    }).catch(function(err){    
        console.log(err)
        res.render("index");
    })
})

// Login Post
app.post("/login",passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: "/register"
}), function(req,res){
       
})

//Logout

app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/login")
});

const PORT = process.env.PORT || 3000;
if(app.listen(PORT)){
    console.log("listening");
}else{
    console.log("I Can't Listen oo");
}