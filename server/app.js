var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config({ path: ".env" });
var cors = require('cors')
const fileupload = require('express-fileupload');

var customerRouter = require('./routes/customer');
var bookRouter = require('./routes/book');
var transactionRouter = require('./routes/transaction');

var app = express();
const port = 3001;

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));
app.use(fileupload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/customer', customerRouter);
app.use('/book', bookRouter);
app.use('/transaction', transactionRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});

module.exports = app;