var express = require('express'),
    hbs = require('express-handlebars'),
    session = require('express-session'),
    path = require('path'),
    bodyParser = require('body-parser'),
    config = require('config'),
    socket_io = require('socket.io');

require('./APP/Commons/Database');

var app = express(),
    PORT = process.env.PORT || config.get('Server.PORT');

//Express-Session Middleware Settup
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

//View Engine Settup
app.set('views', path.join(__dirname, '/APP/Views'));
app.engine('handlebars', hbs({ defaultLayout: path.join(__dirname, '/APP/Views/Layouts/Layout') }));
app.set('view engine', 'handlebars');

//Static File
app.use(express.static(path.join(__dirname, '/Public')));

//Body-Parser Middleware Settup
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(require('./APP/Controllers/HomeController'));
app.use(require('./APP/API/CommonAPI'));

var server = app.listen(PORT, function () {
    console.log(`Server Running In: http://localhost:${PORT}`)
});

var io = socket_io(server);
require('./app/socket/socket')(io);