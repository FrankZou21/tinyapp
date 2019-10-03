const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
var cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');

const {getUserByEmail, generateRandomString, idLookUp, urlsForUser, mapUrls } = require("./helpers")

app.use(cookieSession({
  name: 'user_id',
  keys: ['key1', 'key2']
}))

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {};

const users = {};

//Start of get post

//Get to render the main page
app.get("/urls", (req, res) => {
  let templateVars = { 
    urls: mapUrls(urlsForUser(req.session.user_id, urlDatabase), urlDatabase),
    user: users[req.session.user_id],
  };
  res.render("urls_index", templateVars);
});

//Get to render urlsnew page or redirects user to login if user is not signed in
app.get("/urls/new", (req, res) => {
  let templateVars = { 
    user: users[req.session.user_id]
  };
  if (req.session.user_id){
    res.render("urls_new", templateVars);
  } else {
    res.render("urls_login", templateVars);
  }
});
 
//GET for user registration
app.get("/urls/register", (req, res) => {
  let templateVars = { 
    user: users[req.session.user_id]
  };
  res.render("urls_registration", templateVars);
});

//GET for login page
app.get("/urls/login", (req, res) => {
  let templateVars = { 
    user: users[req.session.user_id]
  };
  res.render("urls_login", templateVars);
});

//Get to update urls_show page
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.session.user_id]
  };
  res.render("urls_show", templateVars);
});

//Post to update database with urls and user id
app.post("/urls", (req, res) => {
  let random = generateRandomString();
  urlDatabase[random] = [];
  urlDatabase[random].longURL = req.body.longURL;
  urlDatabase[random].userID = req.session.user_id;
  res.redirect(`/urls/${random}`); 
});

//Get to obtain longurl and redirects user to that site
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});


//Post for deleting
app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id) {
    delete urlDatabase[req.params.shortURL];
    res.redirect(`/urls`); 
  } else {
    res.send("Access Denied")
  }
})

//Post for login page
app.post("/urls/login", (req, res) => {
  let loginId = idLookUp(req.body.email, users);
  if (loginId === undefined) {
    res.send("Not a registered user!");
  } else {
    if (req.body.email === users[loginId].email && bcrypt.compareSync(req.body.password, users[loginId].password) === true) {
      req.session.user_id = loginId;
      res.redirect("/urls");
    } else {
      res.send("Not a registered user!");
  }
}
});

//Post for logging out
app.post("/urls/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect(`/urls`);
});

//Post that updates user base
app.post("/urls/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "" || getUserByEmail(req.body.email, users) !== false) {
    res.send("Error Code 400");
  } else {
    let random = generateRandomString();
    req.session.user_id = random;
    users[random] = [];
    users[random].id = random;
    users[random].email = req.body.email;
    users[random].password = bcrypt.hashSync(req.body.password, 10);
    res.redirect(`/urls`);
  }
})

//Post for updating urlDatabase with input
app.post("/urls/:shortURL", (req, res) => {
  if(req.session.user_id) {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    urlDatabase[req.params.shortURL].userID = req.session.user_id;
    res.redirect(`/urls`); 
  } else {
    res.send("Access Denied");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


