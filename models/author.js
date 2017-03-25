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
    classMethods: {
        getAllBooks: function(authorId) {
            //find all books where the author_id is authorId
            if (!authorId) {
                var err = new Error('No Author Provided');
                throw err;
            }

            Book.findAll({
                where: {
                    author_id: authorId
                }
            }).then(function(returnedBooks) {
                //returnedBooks will be an array
                return returnedBooks;
            })
        }
    }
},
{
    instanceMethods: {
        getAllBooks: function() {
            //return all the books with the author_id in their field
            return this.getBooks().then(function(returnedBooks) {
                return returnedBooks;
            })
        }
    }
});

module.exports = Author;
