const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const res = require("express/lib/response");
const app = express();
const PORT = 8080; // default port 8080
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

function generateRandomString() {
  return Math.random().toString(36).slice(-6)
}
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  const templateVars = {shortURL: shortURL, user: req.cookies["userLoginData"]}
  console.log(longURL)
  //console.log(req.params, urlDatabase)
  res.redirect(templateVars);
});
app.post('/login', (req, res) =>{
  //console.log(req.body)
  res.cookie("username", req.body.username)
  res.redirect("/urls")
});

app.get('/urls', (req, res) => {
  const templateVars = {urls: urlDatabase, username: req.cookies["userLoginData"] };
  res.render("urls_index", templateVars);
});
app.post("/urls/:shortURL/delete", (req, res) => {
  //console.log(req.params)
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
});
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = `http://${req.body.longURL}`;
  res.redirect(`/urls`)
});
app.post('/logout', (req, res) => {
  console.log(req.cookies.username)
  res.clearCookie('username');
  res.redirect('/urls');
});
app.post("/urls", (req, res) => {
  let randoString = generateRandomString();
  urlDatabase[randoString] = `http://${req.body.longURL}`;
  res.redirect(`/urls/${randoString}`);
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = `http://${req.body.longURL}`
})
app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies["userLoginData"]}
  res.render("urls_new", templateVars);
});
app.get("/register", (req, res) => {
  const templateVars = {username: req.cookies["userLoginData"]}
  res.render("urls_register", templateVars)
});

app.post("/register", (req, res) => {
  let randomString = generateRandomString();
  users[randomString] = {id: randomString, email: req.body.Email,password: req.body.password};
  res.cookie("userLoginData", users[randomString].userid)
  console.log("userlogindata:", req.cookies.userLoginData)
  res.redirect("/urls")
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["userLoginData"] };
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
