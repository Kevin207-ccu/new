//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const encrypt=require("mongoose-encryption")
console.log(process.env.API_KEY)

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
mongoose.connect("mongodb://127.0.0.1:27017/userDB?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.1")

const userSchema= new mongoose.Schema ({
    email:String,
    password:String
})

// const secret = "Thisisourlittlesecret"
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields: ['password'] })

const User = new mongoose.model("User", userSchema)

app.get("/", function(req, res){
  res.render("home");
  });
app.get("/login", function(req, res){
  res.render("login");
  });
app.get("/register", function(req, res){
  res.render("register");
  });

  app.post("/register", function(req, res){
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });


    newUser.save(function(err){
      if (!err){
          res.render("secrets");
      }
    });
  });

  app.post("/login", function(req, res){
    const username = req.body.username
    const password = req.body.password
    console.log(username)

    User.findOne({email:username},function(err,foundUser){
        if(err){
            console.log(err);
        } else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    })

  });

  app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
