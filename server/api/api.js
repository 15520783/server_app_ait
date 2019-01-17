'use strict';
const authen = require('./authen.api');
const job = require('./job.api');

module.exports = function (app, model) {
    authen(app,model);
    job(app,model);
}