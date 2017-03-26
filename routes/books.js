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

//Create a book without an Author
router.post('/', function(req, res, next) {
    Book.create(req.body)
    .then(function(createdBook) {
        console.log('book created', createdBook.dataValues);
        //create a book page to render out here
        res.json(createdBook);
    })
    .catch(next);
});

//Create a book with an Author: for front-end if getting there
//Using a form where there will be a field for an Author Name
//need to use Author.findOrCreate({ where: AuthorId: ...}).then(Book.create()) etc
//I need to find the author by the req.body passed in from the field(this will be the author name). Then use the author name to get the Author Id to attach to the book
//Then create the book etc.

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
//For searching through books from the front-end:
router.get('/search', function (req, res, next) {

    Book.findByCategory(req.query.search)
        .then(function (books) {
            res.render('index', {
                books: books
            });
        })
        .catch(next);

});

//For front-end: add form for adding a book
router.get('/add', function(req, res) {
    res.render('addBook');
});
//for front-end
router.get('/:title', function (req, res, next) {

    Book.findOne({
            where: {
                title: req.params.title
            },
            include: [
                {model: Author}
            ]
        })
        .then(function (book) {
            if (book === null) {
                throw generateError('No book found with that title', 404);
            } else {
                res.render('booktitle', {
                    book: book
                });

            }
        })
        .catch(next);

});
