var express        = require('express');
var MongoClient    = require('mongodb').MongoClient;
var bodyParser     = require('body-parser');
var app            = express();
var port = 8000;
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: 'nbgjfhdfgffhgjhgkfjg',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ 
    url: 'mongodb://localhost:27017/todolist',
  })
}))

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

MongoClient.connect('mongodb://localhost:27017/', {useNewUrlParser: true}, (err, database) => {
  if (err) return console.log(err)
  require('./routes')(app, database.db('todolist'));
  app.listen(port, () => {
    console.log('Listening port ' + port);
  });               
})