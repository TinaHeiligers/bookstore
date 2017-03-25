'use strict';
var Sequelize = require('sequelize');
var db = require('./_db');
var Book = require('./book');

var Author = db.define('Author', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    birthday: {
        type: Sequelize.DATEONLY//date without time
    },
    language: {
        type: Sequelize.STRING
    }
    //books come from association (Author.hasMany(books))
    //getBook, setBook, addBook, removeBook?
    //getBooks, setBooks, addBooks, removeBooks
}, {
    instanceMethods: {
        getAllBooks: function() {
            return this.getBooks();
            //return all the books with the author_id in their field
        }
    }
})

module.exports = Author;
