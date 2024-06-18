const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  return users.some((user) => user.username === username);
};

public_users.post("/register", (req,res) => {
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: "Please provide username and password"});
  }
  else if(doesExist(req.body.username)){
    return res.send("Username already exists");
  }
  else{
  users.push({username: req.body.username, password: req.body.password});
  return res.send("User created successfully");
  }
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
    const Books = await getBooks();
    return res.status(200).send(JSON.stringify(Books, null, 4));
});

const getBooks = () => {
  return books;
};


// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res)=> {
  const isbn = req.params.isbn;
  let book=await getBookBasedonISBN(isbn);
  if (book) {
    return res.status(200).json(books[isbn]);
  }
  
  return res.send("Book not found");
 });
  const getBookBasedonISBN=(isbn)=>{
    return books[isbn];
  }
// Get book details based on author
public_users.get('/author/:author',async (req, res)=> {
  for(let book in books){
    let author=await books[book].author;
    if(author===req.params.author){
      return res.status(200).json(books[book]);
    }
  }
  return res.send("Book not found");
});

// Get all books based on title
public_users.get('/title/:title',async (req, res)=> {
  for(let book in books){
    let title=await books[book].title;
    if(title===req.params.title){
      return res.status(200).json(books[book]);
    }
  }
  return res.send("Book not found");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  if(books[req.params.isbn]){
    res.send(books[req.params.isbn].reviews);
  }
  else{
    res.send("Book not found");
  }
});

module.exports.general = public_users;
