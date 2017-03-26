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
        type: Sequelize.STRING,
        defaultValue: "123-4-56-789102-0"
    },
    synopsis: {
        type: Sequelize.TEXT
    },
    pubDate: {
        type: Sequelize.DATE
    },
    categories: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
        set: function (categories) {
            categories = categories || [];

            if (typeof categories === 'string') {
                categories = categories.split(',').map(function(string) {
                    return string.trim();
                });
            }

            this.setDataValue('categories', categories);
        }
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
}, {
    //class Methods
    classMethods: {
        findByCategory: function(cat) {
            return this.findAll({
                where: {
                    categories: {
                        $contains: [cat]
                    }
                }
            });
        }
    },
    instanceMethods: {
        findSimilar: function () {
            return Book.findAll({
                where: {
                    id: {
                        $ne: this.id
                    },
                    categories: {
                        $overlap: this.categories
                    }
                }
            });
        }
    }
});

module.exports = Book;
