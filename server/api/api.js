'use strict';
const authen = require('./authen.api');

module.exports = function (app, model) {
    authen(app,model);
}