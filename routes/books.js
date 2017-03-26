
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
        res.render('booklist', {
            books: books
        })
    }).catch(next);
});

//Create a book without an Author, add book to db, adding author to db not working yet through the form.
// router.post('/', function(req, res, next) {
//     Book.create(req.body)
//     .then(function(createdBook) {
//         console.log('book created', createdBook.dataValues);
//         //create a book page to render out here
//         res.json(createdBook);
//     })
//     .catch(next);
// });

router.post('/', function(req, res, next) {
    //currently, if the author does not exist, this bombs out.
    // console.log(req.body.name, req.body.language);
    Author.findOrCreate({
        where: {
            name: req.body.name,
            language: req.body.language
        }
    })
    .spread(function(returnedAuthor, createdBookBool) {
        // console.log('returnedAuthor: ?????');
        console.log(returnedAuthor.dataValues);
        return Book.create({
            title: req.body.title,
            synopsis: req.body.synopsis,
            ISBN: req.body.ISBN,
            categories: req.body.categories,
            pubDate: req.body.pubDate,
            AuthorId: returnedAuthor.dataValues.id
        })
        .then(function(newBook) {
            // res.json(newBook);
            res.render('booktitle', {
                book: newBook
            });
        })
        .catch(next);
    });
});

function generateError (message, status) {
    let err = new Error(message);
    err.status = status;
    return err;
}
router.get('/:id', function(req, res, next) {
    Book.findById(req.params.id)
    .then(function(foundBook) {
        res.render('editbook', {
            book: foundBook
        })
    })
    .catch(next);
})

//for front-end, this route was interfering with the route for the add page.
router.get('/book/:title', function (req, res, next) {

    Book.findOne({
            where: {
                title: req.params.title
            },
            include: [
                {model: Author}
            ]
        })
        .then(function (book) {
            res.render('booktitle', {
                book: book
            });
    })
    .catch(next);

});
router.get('/add', function(req, res) {
    // res.status(200);
    res.render('addbook');
});


router.get('/search', function (req, res, next) {
    Book.findbByCategory(req.query.search)
        .then(function(books) {
            res.render('index', {
                books: books
            });
        })
        .catch(next);
})

//change book title
router.put('/book/:id', function(req, res, next) {
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
router.delete('/book/:id', function(req, res, next) {
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
