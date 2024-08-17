const express = require('express');
let axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password){
    let foundusername = users.filter((user)=> user.username === username);

    if (foundusername.length >0){
        return res.status(400).json({message:"Same username found!"})
    }
    users.push({
        "username":username,
        "password":password
    });
    return res.status(200).json({message:"user added !"})
  }else{
    return res.status(400).json({message:"no provided username/password"})
  }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  return res.status(300).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let filteredBooks = [];
  for(let key in books){
    if(books[key].author === author){
        filteredBooks.push(books[key]);
    }
  }
  
  if (filteredBooks.length > 0){
      return res.status(300).json(filteredBooks);
  }
  else{
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let filteredBooks = [];
  for ( let key in books){
    if(books[key].title === title){
        filteredBooks.push(books[key]);
    }
  }

  if (filteredBooks.length >0){
    res.status(200).json(filteredBooks);
  }else{
    
    return res.status(300).json({ message: "No books found for this author" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
    let isbn = req.params.isbn;
    return res.status(300).json(books[isbn].reviews);
});




         
const getBooks = async () => {
    try {
      const response = await axios.get('https://arafafengiro-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
      console.log('Books list:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  }; 

  const getBookByIsbn = async (isbn) => {
    try {
      const response = await axios.get(`https://arafafengiro-5000.
      theianext-1-labs-prod-misc-tools-us-east-0.proxy.
      cognitiveclass.ai/isbn/${isbn}`);
      
      console.log('Book details:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching book details by ISBN:', error);
    }
  };

  const getBookByAuthor = async (author) => {
    try {
      const response = await axios.get(`https://arafafengiro-5000.
      theianext-1-labs-prod-misc-tools-us-east-0.proxy.
      cognitiveclass.ai/author/${author}`);
      console.log('Books by author:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching books by author:', error);
    }
  };

  const getBookByTitle = async (title) => {
    try {
      const response = await axios.get(`https://arafafengiro-5000.
      theianext-1-labs-prod-misc-tools-us-east-0.proxy.
      cognitiveclass.ai/title/${title}`);
      console.log('Books with title:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching books by title:', error);
    }
  };



module.exports.general = public_users;
