const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some((user) => user.username === username);
};

//returns boolean
const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};
const doesExist = (username) => {
  return users.some((user) => user.username === username);
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  if(!isValid(req.body.username) ){
    return res.status(400).json({message: "Please provide username and password"});
  }
  else if(!authenticatedUser(req.body.username,req.body.password)){
    return res.send("Invalid username or password, pls register");
  }
  else{
      let token=jwt.sign({username:req.body.username}, "access",{expiresIn: 60*60});
      req.session.authorization = {accessToken: token, username: req.body.username};
      return res.send("Login successful");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization.username;
  const review = req.body.review; // string
  const isbn = req.params.isbn;
  if (!review) {
    res.status(400).json({ message: "Review is empty!" });
  } else {
    books[isbn].reviews[user] = review;
    res.status(200).json({ message: "Book review updated." });
  }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization.username;
  const isbn = req.params.isbn;
  delete books[isbn].reviews[user];
  res.status(200).json({ message: "Book review deleted." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
