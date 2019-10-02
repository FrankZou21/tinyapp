const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {};

function generateRandomString() {
  return Math.random().toString(36).substr(2, 6);
}

function emailLookUp(emailIn) {
  for (const id in users) {
    if (users[id].email === emailIn) {
      return true;
    }
  }
  return false;
}

function idLookUp(emailIn) {
  for (const id in users) {
    if (users[id].email === emailIn) {
      return id;
    }
  }
  return;
}

app.get("/urls", (req, res) => {
  let templateVars = { 
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { 
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_new", templateVars);
});
 
//GET for user registration
app.get("/urls/register", (req, res) => {
  let templateVars = { 
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_registration", templateVars);
});

//GET for login page
app.get("/urls/login", (req, res) => {
  let templateVars = { 
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_login", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"],
    user: users["user_id"]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  let random = generateRandomString();
  urlDatabase[random] = req.body.longURL;
  res.redirect(`/urls/${random}`); 
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`); 
})

//Post for login page
app.post("/urls/login", (req, res) => {
  loginId = idLookUp(req.body.email);
  if (req.body.email === users[loginId].email && req.body.password === users[loginId].password){
    res.cookie("user_id", loginId);
    res.redirect("/urls");
  } else {
    res.send("Not a registered user!");
  }
});

//Post for logging out
app.post("/urls/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect(`/urls`);
});

//Post that updates user base
app.post("/urls/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "" || emailLookUp(req.body.email) === true) {
    res.send("Error Code 400");
  } else {
    let random = generateRandomString();
    res.cookie("user_id", random);
    users[random] = [];
    users[random].id = random;
    users[random].email = req.body.email;
    users[random].password = req.body.password;
    console.log(users);
    res.redirect(`/urls`);
  }
})

//Post for updating urlDatabase with input
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(`/urls`); 
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

