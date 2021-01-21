'use strict';

//dependencies
const express = require('express');

const superagent = require('superagent');
require('dotenv').config();
const pg = require('pg');
const cors = require('cors');

//setting up the app
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(cors());


const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err=>console.error(err));



app.set('view engine', 'ejs');

//=========================Routes==============================

app.get('/', homeHandler);
// form
app.get('/search', newSearch);
// call back function
app.post('/searches', findBook);

app.get('/views/pages/books/detail/:value_id', getDetails );





//==========================Route Handelers========================

// function homeHandler(req, res) {
//   res.status(200).render('pages/index');
// }
function getDetails(req, res){
  console.log('req.params>>>>>>>>>>', req.params);
  const SQL = 'SELECT * FROM shelf WHERE id = $1'
  const values = [req.params.value_id];
  return client.query(SQL,values)
    .then(results => {
      // console.log(results.rows);
      res.render('pages/books/detail', {books: results.rows});

    });
  
}

function homeHandler(req, res) {

  const SQL =  'SELECT * FROM shelf;';
  return client.query(SQL)
    .then(results => {
      // console.log(results.rows);
      res.render('pages/index', {books: results.rows});

    });

  // res.status(200).render('pages/index');
}


function newSearch(req, res) {
  res.status(200).render('pages/searches/new.ejs');
}

function findBook(req, res) {

  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if (req.body.search[1] === 'title') {url += `+intitle:${req.body.search[0]}`;}

  if (req.body.search[1] === 'author') {url += `+inauthor:${req.body.search[0]}`;}

  superagent.get(url)

    .then(data => {
      // console.log('data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', data);

      let books = data.body.items.map(value => {
        return new Book(value);
      });
      res.render('pages/searches/show', { books:books});
    }).catch(error => console.log(error));

}


//===================== Constructors ============================

function Book(data) {
  console.log(data);
  this.authors = data.volumeInfo.authors;
  this.title = data.volumeInfo.title;
  this.description = data.volumeInfo.description;
  this.img_url = data.volumeInfo.imageLinks? data.volumeInfo.imageLinks.smallThumbnail:`https://i.imgur.com/J5LVHEL.jpg`;

}

app.get('/*', (req, res) => res.status(404).send('this route does not exist'));


app.listen(PORT, () =>{
  console.log(`Now listening on port ${PORT}`);
  console.log(client.connectionParameters.database);
});


