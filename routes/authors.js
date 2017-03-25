'use strict';
var express = require('express');
var router = express.Router();
var Author = require('../models').Author;
//need the book model to get at all th books for an author?
var book = require('../models').Book;

module.exports = router;

//GET all authors
router.get('/', function(req, res, next) {
    Author.findAll({})
        .then(function(authors) {
            res.json({authors: authors});
        })
        .catch(next);
});

//create an author: comes with a body carrying all author info
router.post('/', function(req, res, next) {
    Author.create(req.body)
        .then(function(newAuthor) {
            res.json({
                author: newAuthor
            });
        })
        .then(function() {
            res.redirect('/');//redirect to all authors
        })
        .catch(next)
});
//change author language
//format of '/authors/author_id/newLangugage'
//i.e. '/authors/1/french', so the req.body will contain the language
router.put('/:id', function(req, res, next) {
    Author.update(req.body, {
        where: {id: req.params.id},
        returning: true
    })
    .then(function(allResults) {
        var updatedAuthor = allResults[1][0];
        res.json({
            author: updatedAuthor
        });
    })
    .catch(next);
});

//delete author and all associated books
