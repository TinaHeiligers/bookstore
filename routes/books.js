'use strict';

var express = require('express');
var router = express.Router();
var Book = require('../models').Book;
var Author = require('../models').Author;

module.exports = router;

//
//GET all books, this route works
router.get('/', function(req, res, next) {
    Book.findAll({})
    .then(function(books) {
        res.json({books: books});
    }).catch(next);
});
//Create a book

router.post('/', function(req, res, next) {
    Book.create(req.body)
    .then(function(createdBook) {
        console.log('book created', createdBook)
        res.json(createdBook);
    })
    .catch(next);
});
//change book title
router.put('/:id', function(req, res, next) {
    Book.update(req.body, {
        where: {id: req.params.id},
        returning: true
    })
    .then(function(results) {
        var updatedBook = results[1][0];
        res.json({
            book: updatedBook
        });
    })
    .catch(next);
});
//delete ONE book
router.delete('/:id', function(req, res, next) {
    //find the book,
    Book.findById(req.params.id)
    .then(function(foundBook) {
        foundBook.destroy();
    })
    .then(function() {
        res.status(200).send();
    })
    .catch(next);
});
