'use strict';
var db = require('./_db');
var Author = require('./author');
var Book = require('./book');

//relations
Book.belongsTo(Author);
Author.hasMany(Book);

module.exports = {
    db: db,
    Book: Book,
    Author: Author
}
