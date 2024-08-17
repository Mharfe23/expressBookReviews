const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let user = users.filter((user)=>{
        return user.username === username
    });

    if (user.length > 0){
        return true
    }
    return false
}

const authenticatedUser = (username,password)=>{
    let user = users.filter((user)=>{
        return user.username === username && user.password === password
    });
    if (user.length > 0){
        return true
    }
    return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!isValid(username)){
     return res.status(300).json({message: "username not valid"});
  }
  if (!authenticatedUser(username,password)){
    return res.status(300).json({message: "password not valid"});
  }
  let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 * 1000000});
        // Store access token and username in session
    req.session.authorization = {
            accessToken, username
    }
    return res.status(200).send("User successfully logged in");

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.body.review;
  let username = req.session.authorization['username'];
 

  if(!review){
    res.status(400).json({message:"review not provided"});
  }

  for (let key in books){
    if(key === isbn){
        books[key].reviews[username] = review;
        return res.status(200).json({message:"Review added"})
    }
  }

  return res.status(300).json({message: "No book with that isbn"});
});

regd_users.delete('/auth/review/:isbn',(req,res)=>{
    let isbn = req.params.isbn;
    let username = req.session.authorization['username'];

    if (!username) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    
    delete books[isbn].reviews[username];
    
    return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
