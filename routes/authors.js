'use strict';
var express = require('express');
var router = express.Router();
var Author = require('../models').Author;
//need the book model to get at all th books for an author?
var Book = require('../models').Book;

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
    .then(function(createdAuthor) {
        res.json(createdAuthor);
    })
    .catch(next);
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
router.delete('/:id', function(req, res, next) {
    //find the book,
    Author.findById(req.params.id)
    .then(function(foundAuthor) {
        foundAuthor.destroy();
    })
    .then(function() {
        Book.destroy({
            where:{
                AuthorId: req.params.id
            }})
    })
    .then(function() {
        res.status(200).send();
    })
    .catch(next);
});
//find the author
//remove the author
////remove all books by that author
