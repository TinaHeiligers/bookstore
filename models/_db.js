'use strict';
var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/bookstoreapi', {logging: false});
module.exports = db;
