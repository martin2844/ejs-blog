  //jshint esversion:6

//Node Modules

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const striptags = require('striptags');
require('dotenv').config();

// Auth Modules
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");







//(node:12872) DeprecationWarning: collection.findAndModify is deprecated. Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead.
mongoose.set('useFindAndModify', false);


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


//Todays Date

let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1; //January is 0!
let yyyy = today.getFullYear();

if (dd < 10) {
  dd = '0' + dd;
}

if (mm < 10) {
  mm = '0' + mm;
}

today = dd + '/' + mm + '/' + yyyy;


//server setup
const app = express();
app.set('view engine', 'ejs');



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//session setup
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

//passport setup
app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});





//mongoose connection, to local host for this version.
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser:true});

//create the schema for the posts
const postSchema = new mongoose.Schema ({
  author: String,
  title: String,
  content: String,
  noTags: String,
  imageURL: String,
  ytURL: String,
  timeStamp: Date,
  date: String,
  dd: Number,
  mm: Number,
  yyyy: Number,
  tag1: String,
  tag2: String
});


//create the schema for the users

const userSchema = new mongoose.Schema ({
  user: String,
  password: String
 });

//plugin to salt and hash the password
userSchema.plugin(passportLocalMongoose);


//create the mongoose model
const Post = mongoose.model("Post", postSchema);

//create the user mongoose model
const User = mongoose.model("User", userSchema);


//avoid deprecation warning
mongoose.set('useCreateIndex', true);

//passport local mongoose configurations
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//routes


app.get(["/", "/index/:page"], (req,res,next) => {
  let perPage = 9;
  let page = req.params.page || 1;
  

  Post.find({})
  .skip((perPage * page) - perPage)
  .limit(perPage)
  .exec((err, posts) => {
    Post.countDocuments((err, count) => {
      if (err) return next(err);
      // console.log("test")
      // console.log(JSON.stringify(posts.content))
      // Missing a way to strip HTML tags from post content, so it only shows txt on frontpage
            res.render("home", {
        home: homeStartingContent,
        posts: posts,
        current: page,
        pages: Math.ceil(count / perPage)

      
      });
     
     
    });
  });

}
);

app.get("/archive", (req,res) => {
  Post.find({}).select({ "title": 1, "date": 1, "yyyy":1, "mm":1, "dd":1, "_id": 1}).sort({timeStamp: 'descending'}).exec((err, posts) => {
    res.render("archive", {posts: posts});
  });

});

//ajustar base de datos, fechas


app.get("/test", (req,res) => {
  res.render("test", {about: aboutContent});
});



app.get("/about", (req,res) => {
  res.render("about", {about: aboutContent});
});

app.get("/contact", (req,res) => {
  res.render("contact", {contact:contactContent});
});

app.get("/auth", (req,res)=>{ 
  res.render("auth");
})


//compose route needs to be authenticated
app.get("/compose", (req,res) => {
  if (req.isAuthenticated()){
    res.render("compose");
    console.log(req.session.user);
  } else { 

    res.redirect("/auth");

  }
});






app.get("/logout", (req,res) => {
  req.logout();
  req.session.user = "";
  res.redirect("/");
})



// New USER Registration Method with Passport.

// User.register({username: "Martin"}, process.env.NEW_USER_PASSWORD, (err, user) => {
//   if (err) { 
//     console.log(err);
//   } else {
//    console.log("saved");
//     }
//   }
// );





app.post("/auth", (req,res)=> {
  const user = new User ({
      username: req.body.username,
      password: req.body.password
  });

req.login(user, (err)=> {
  if (err) {
    console.log(err);
  } else {
    passport.authenticate("local");
    req.session.user = req.user.username;

            res.redirect("/compose");
  }
});

});





app.get("/subscribe", (req,res) => {
  res.render("subscribe");
});

app.get("/posts/:postId", (req,res) => {
const requestedPostId = req.params.postId;
Post.findOne({_id: requestedPostId}, function(err,post){
  res.render("post", {title: post.title,
    content: post.content,
    image: post.imageURL,
    yt: post.ytURL,
    date: post.date,
    author: post.author,
    tag1: post.tag1,
    tag2: post.tag2,
    year: post.yyyy,
    day: post.dd,
    month:post.mm
  });
});

});


app.get("/tags/:tagFound", (req,res) => {
  const requestedTag = req.params.tagFound;
  console.log(requestedTag);
  Post.find( {$or:[ {tag1: requestedTag}, {tag2:requestedTag} ] } , function(err,posts){
    if(!err) res.render("tag", {posts: posts, tag: requestedTag });
  });

  });



app.post("/find", (req, res) => {
  let keyWordCap = req.body.keyword;
  let keyWord = _.lowerCase(keyWordCap);
  console.log(keyWord);
  Post.find({}, function (err, posts) {
  res.render("find", {keyWord: keyWord, posts: posts});
});
});


app.get("/find", (req,res) => {
  const findTerm = req.params.findWord;
  console.log(findTerm);
});


//posts

app.post("/compose", (req,res) => {
const post = new Post ({
  author: req.user.username,
  title: req.body.blogtitle,
  content: req.body.blogpost,
  noTags: striptags(req.body.blogpost),
  imageURL: req.body.imageURL,
  timeStamp: new Date(),
  ytURL: req.body.ytURL,
  date: today,
  tag1: req.body.tag1,
  tag2: req.body.tag2,
  dd: dd,
  mm: mm,
  yyyy: yyyy

});

post.save(function(err){
  if (!err) {
    res.redirect("/");
    console.log(post);
  } else {
    console.log(err);
  }
});


});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
