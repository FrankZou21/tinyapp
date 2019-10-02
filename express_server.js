const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

// const urlDatabase = {
//   "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "" },
//   "9sm5xK": { longURL: "http://www.google.com", userID: "" }
// };

const urlDatabase = {};

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

function urlsForUser(id) {
  let shortUrls = [];
  for (const urls in urlDatabase) {
    if(urlDatabase[urls].userID === id) {
      shortUrls.push(urls);
    }
  }
  return shortUrls;
}

function mapUrls(arrShortUrls) {
  let mapUrlsDatabase = new Object();
  for (const shortUrl of arrShortUrls) {
    mapUrlsDatabase[shortUrl] = urlDatabase[shortUrl].longURL;
  }
  return mapUrlsDatabase;
}

//Start of get post

app.get("/urls", (req, res) => {
  console.log(mapUrls(urlsForUser(req.cookies["user_id"])));
  let templateVars = { 
    urls: mapUrls(urlsForUser(req.cookies["user_id"])),
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { 
    user: users[req.cookies["user_id"]]
  };
  if (req.cookies["user_id"]){
    res.render("urls_new", templateVars);
  } else {
    res.render("urls_login", templateVars);
  }
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
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  let random = generateRandomString();
  urlDatabase[random] = [];
  urlDatabase[random].longURL = req.body.longURL;
  urlDatabase[random].userID = req.cookies["user_id"];
  res.redirect(`/urls/${random}`); 
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});


//Post for deleting
app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.cookies["user_id"]) {
    delete urlDatabase[req.params.shortURL];
    res.redirect(`/urls`); 
  } else {
    res.send("Access Denied")
  }
})

//Post for login page
app.post("/urls/login", (req, res) => {
  loginId = idLookUp(req.body.email);
  if (loginId === undefined) {
    res.send("Not a registered user!");
  } else {
    if (req.body.email === users[loginId].email && req.body.password === users[loginId].password){
      res.cookie("user_id", loginId);
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
  if (req.body.email === "" || req.body.password === "" || emailLookUp(req.body.email) === true) {
    res.send("Error Code 400");
  } else {
    let random = generateRandomString();
    res.cookie("user_id", random);
    users[random] = [];
    users[random].id = random;
    users[random].email = req.body.email;
    users[random].password = req.body.password;
    res.redirect(`/urls`);
  }
})

//Post for updating urlDatabase with input
app.post("/urls/:shortURL", (req, res) => {
  if(req.cookies["user_id"]) {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    urlDatabase[req.params.shortURL].userID = req.cookies["user_id"];
    res.redirect(`/urls`); 
  } else {
    res.send("Access Denied");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

