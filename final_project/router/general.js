const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Register a new user
public_users.post("/register", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(201).json({
        message: "User successfully registered"
    });
});


// Internal API used by Axios
public_users.get('/api/books', (req, res) => {
    return res.status(200).json(books);
});


// Task 10: Get all books using Axios + async/await
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/books`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books"
        });
    }
});


// Task 11: Get book details based on ISBN using Axios + async/await
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/books`);

        const isbn = req.params.isbn;
        const book = response.data[isbn];

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        return res.status(200).json(book);

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving book"
        });
    }
});


// Task 12: Get book details based on author using Axios + async/await
public_users.get('/author/:author', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/books`);

        const author = req.params.author.toLowerCase();

        const result = Object.values(response.data).filter(
            book => book.author.toLowerCase() === author
        );

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books by author"
        });
    }
});


// Task 13: Get book details based on title using Axios + async/await
public_users.get('/title/:title', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/books`);

        const title = req.params.title.toLowerCase();

        const result = Object.values(response.data).filter(
            book => book.title.toLowerCase() === title
        );

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books by title"
        });
    }
});


// Get book review
public_users.get('/review/:isbn', (req, res) => {

    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.status(200).json(books[isbn].reviews);
});


module.exports.general = public_users;
