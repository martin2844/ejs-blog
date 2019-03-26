//jshint esversion:6

//Node Modules

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");



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

// author

let author = "Martin";



//server setup}
const app = express();
app.set('view engine', 'ejs');



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//mongoose connection, to local host for this version.
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser:true});

//create the schema for the posts
const postSchema = new mongoose.Schema ({
  title: String,
  content: String,
  imageURL: String,
  ytURL: String,
  date: String,
  tag1: String,
  tag2: String
});
//create the mongoose model
const Post = mongoose.model("Post", postSchema);




//routes

app.get("/", (req,res) => {
  Post.find({}, function (err, posts) {
  res.render("home", {home: homeStartingContent, posts: posts});

});

}
);

app.get("/about", (req,res) => {
  res.render("about", {about: aboutContent});
});

app.get("/contact", (req,res) => {
  res.render("contact", {contact:contactContent});
});


app.get("/compose", (req,res) => {
  res.render("compose");
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
    author: author,
    tag1: post.tag1,
    tag2: post.tag2});
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
  let keyWord = req.body.keyword;
  console.log(keyWord);
  Post.find({}, function (err, posts) {
  res.render("find", {keyWord: keyWord });
});
});


app.get("/find", (req,res) => {
  const findTerm = req.params.findWord;
  console.log(findTerm);
});


//posts

app.post("/compose", (req,res) => {
const post = new Post ({
  title: req.body.blogtitle,
  content: req.body.blogpost,
  imageURL: req.body.imageURL,
  ytURL: req.body.ytURL,
  date: today,
  tag1: req.body.tag1,
  tag2: req.body.tag2
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











app.listen(3000, function() {
  console.log("Server started on port 3000");
});