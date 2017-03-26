module.exports = function (env) {

    var bookLink = function (book) {
        return '<a href="' + book.route + '">' + book.title + '</a>';
    };

    bookLink.safe = true;

    env.addFilter('bookLink', bookLink);

};
