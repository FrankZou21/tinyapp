const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  return Math.random().toString(36).substr(2, 6);
}

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  let random = generateRandomString();
  urlDatabase[random] = req.body.longURL;
  res.redirect(`/urls/${random}`); 
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  console.log(longURL);
  console.log(urlDatabase);
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {

  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`); 
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

