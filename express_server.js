const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const res = require("express/lib/response");
const { Router } = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

function generateRandomString() {
  return Math.random().toString(36).slice(-6)
}
 urlDatabase = {
  b6UTxQ: {
        longURL: "https://www.tsn.ca",
        userID: "aJ48lW"
    },
    i3BoGr: {
        longURL: "https://www.google.ca",
        userID: "maxaveertest"
    }
};
const users = { 
  "userRandomID": {
    id: "aJ48lW", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  },
  "maxaveertest": {id: "maxaveertest", 
  email: "maxaveer@gmail.com", 
  password: "VEER2IO"}
}
const getUserWithEmail = function(email) {
  for (let id in users) {
    if (users[id].email === email) {
      return users[id];
    }
  }
  return null;
};
app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/u/:shortURL", (req, res) => {
 
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    return res.send("Error: 404 page not found");
  }
  const longURL = urlDatabase[shortURL].longURL;
  
  res.redirect(longURL);
});
app.post('/login', (req, res) =>{
  
  //Logic must be added so that a cookie is set as userID 
  
  if (!getUserWithEmail(req.body.email)){
    return res.send("Error: 403 that Email was not found")
  } 
  if (getUserWithEmail(req.body.email)) {
    
  }
  for (let user in users) {
    //console.log("users sanity check", user)
    if (req.body.email === users[user].email){
      if (req.body.password === users[user].password) {
        res.cookie("userID", users[user].id)
        return res.redirect("/urls")
      }
    }
  }
res.send("login Failed")
});
app.get('/login', (req, res) => {
  const templateVars = {username: users[req.cookies.userID]  }
  res.render("urls_login", templateVars)
});
app.get('/urls', (req, res) => {
  if (!req.cookies.userID) {
    return res.redirect('/login')
  }
  const templateVars = {urls: urlDatabase, username: req.cookies["userID"]};
  //Render Urls onto page, if the url's userID matches the current user
  //Checking if our userID cookie matches the userID value found within our userDatabase object. 
  res.render("urls_index", templateVars);
});
app.post("/urls", (req, res) => {
  let randoString = generateRandomString();
  urlDatabase[randoString] = {longURL: `http://${req.body.longURL}`, userID: req.cookies['userID']};
  res.redirect(`/urls/${randoString}`);
});
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
});
app.post("/urls/:shortURL", (req, res) => {
  if(req.cookies.userID) {
    urlDatabase[req.params.shortURL].longURL = `http://${req.body.longURL}`;
  }
  res.redirect(`/urls`);
});
app.get("/urls/new", (req, res) => {
  if(!req.cookies.userID) {
    return res.redirect("/login");
  } 
  const templateVars = {username: req.cookies["userID"]}
  res.render("urls_new", templateVars);
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, username: req.cookies["userID"] };
  res.render("urls_show", templateVars);
});
app.post('/logout', (req, res) => {
 
  res.clearCookie('userID');
  res.redirect('/register');
});
app.get("/register", (req, res) => {
  const templateVars = {username: req.cookies["userID"]}
  res.render("urls_register", templateVars)
});
app.post("/register", (req, res) => {
  if(req.body.email === "" || req.body.password === "") {
    return res.send("<h3>403: password and email cannot be empty</h3>");
  } 
  
  if (getUserWithEmail(req.body.email)) {
    return res.send("<h3>403: Account already exists</h3>");
  }
  let randomString = generateRandomString();
  users[randomString] = {id: randomString, email: req.body.email, password: req.body.password};
  res.cookie("userID", randomString);
  res.redirect("/urls");
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
