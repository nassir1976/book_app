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
// ========== application configration======
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ===== public directory for css======

app.use(express.static('./public'));

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));



app.set('view engine', 'ejs');

//=========================Routes==============================

// rende homepage
app.get('/', homeHandler);
// form
app.get('/search', newSearch);

// call back function/render/searches/show
app.post('/searches', findBook);

// render to detail
app.get('/detail/:id', getDetails);


app.post('/books', saveBook);




// =========== render index page======
function homeHandler(req, res) {
  const SQL = 'SELECT * FROM shelf;';
  return client.query(SQL)
    .then(results => {

      console.log(results.rows);

      res.render('pages/index', { books: results.rows });
    });
}

function newSearch(req, res) {
  res.status(200).render('pages/searches/new.ejs');
}

//==============search book from API ==========

function findBook(req, res) {

  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if (req.body.search[1] === 'title') { url += `+intitle:${req.body.search[0]}`; }

  if (req.body.search[1] === 'author') { url += `+inauthor:${req.body.search[0]}`; }

  superagent.get(url)

    .then(data => {
      // console.log('data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', data.body.items[0].volumeInfo);

      let books = data.body.items.map(value => {
        return new Book(value);
      });
      console.log(books);
      res.render('pages/searches/show', { books: books });
    }).catch(error => console.log(error));

}
//==============detail function for every single book==========

function getDetails(req, res) {
  console.log('req.params>>>>>>>>>>', req.params);
  const SQL = 'SELECT * FROM shelf WHERE id=$1;';
  const values = [req.params.id];
  client.query(SQL, values)
    .then(results => {
      console.log(">>>>>>>>>>", results.rows);
      res.render('pages/books/detail', { book: results.rows[0] });

    });

}



// ============== add(save) to database==========

function saveBook(req, res) {
  let SQL = `INSERT INTO shelf(author,title,img_url,isbn,description)VALUES($1,$2,$3,$4,$5)RETURNING*`;
  console.log('.>>>>>>>>>', req.body);
  const values = [req.body.author, req.body.title, req.body.img_url, req.body.isbn, req.body.description];
  client.query(SQL, values)
    .then(results => {
      console.log('........', results);
      // res.render('pages/index', { books: results.rows });
      res.redirect('/');
    });

}
//===================== Constructors ============================

function Book(data) {
  console.log('data', data);
  this.author = data.volumeInfo.authors && data.volumeInfo.authors[0] || 'unlisted';
  this.title = data.volumeInfo.title;
  this.description = data.volumeInfo.description || 'not Avilable';
  this.img_url = data.volumeInfo.imageLinks ? data.volumeInfo.imageLinks.smallThumbnail : `https://i.imgur.com/J5LVHEL.jpg`;
  data.volumeInfo.industryIdentifiers ? data.volumeInfo.industryIdentifiers[0].identifier : 'ISBN not found';
  // this.isbn = data.volumeInfo.industryIdentifiers[0].identifier;
}

app.get('/*', (req, res) => res.status(404).send('this route does not exist'));


app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
  console.log(client.connectionParameters.database);
});


