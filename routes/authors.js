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
            res.render('authorlist',{
                authors: authors
            });
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
    //find the author
    Author.findById(req.params.id)
    .then(function(foundAuthor) {
        //remove the author
        foundAuthor.destroy();
    })
    .then(function() {
        //remove all books by that author
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



