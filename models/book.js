'use strict';
var Sequelize = require('sequelize');
var db = require('./_db');

var Book = db.define('Book', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    //Author comes from association (Book.belongsTo(Author))?, not nescessarily
    //The association will add an Author_id to the table, gives me access to getAuthor, setAuthor, addAuthor, removeAuthor
    ISBN: {
        type: Sequelize.STRING
    },
    synopsis: {
        type: Sequelize.TEXT
    },
    pubDate: {
        type: Sequelize.DATE
    }
}, {
    //getterMethods
    getterMethods: {
        getBlurb: function() {
            if(!this.synopsis) {
                return '';
            }
            return this.synopsis.slice(0, 10) + '...';
        }
    }
});

module.exports = Book;
