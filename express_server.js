const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port 8080

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  const templateVars = {shortURL: shortURL}
  console.log(longURL)
  //console.log(req.params, urlDatabase)
  res.redirect(templateVars);
});

app.get('/urls', (req, res) => {
  const templateVars = {urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.post("/urls/:shortURL/delete", (req, res) => {
  //console.log(req.params)
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls/")
});
app.post("/urls/:shortURL", (req, res) => {
  console.log(req.body, req.params)
  urlDatabase[req.params.shortURL] = `http://${req.body.longURL}`;
  res.redirect(`/urls`)
});
app.post("/urls", (req, res) => {
  let randoString = generateRandomString();
  urlDatabase[randoString] = `http://${req.body.longURL}`;
  res.redirect(`/urls/${randoString}`)
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = `http://${req.body.longURL}`
})
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
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

function generateRandomString() {
  return Math.random().toString(36).slice(-6)
}