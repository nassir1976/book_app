'use strict';

//dependencies 
const express = require('express');

const superagent = require('superagent');
require('dotenv').config();


//setting up the app
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

//=========================Routes==============================

app.get('/', homeHandler);
app.get('/search', newSearch);
// app.get('/searches/show', formPage);

// call back function
app.get('/searches', findBook);


//route handlers

//==========================Route Handelers========================

// function formPage(req, res) {
//   res.render('pages/searches/show');
// }

function homeHandler(req, res) {
  res.status(200).render('pages/index');
}
function newSearch(req, res) {
  res.status(200).render('pages/searches/new.ejs');
}



function findBook(req, res) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=quilting';

  if (req.body.search === 'title') {
    url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.search}:${req.body.keyword}`;

  } else if (req.body.search === 'author') {

    url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.search}:${req.body.keyword}`;

  }
  console.log(url);
  superagent.get(url)
    .then(data => {

      let books = data.body.items.map((value) => {
        return new Book(value);
      });
      res.render('pages/searches/show', { books: books });

      console.log(books);

    }).catch(error => console.log(error));




}



//===================== Constructors ============================

function Book(data) {
  this.authors = data.volumeInfo.authors;
  this.title = data.volumeInfo.title;
  this.description = data.volumeInfo.description;
  // this.image_url = data.voluneInfo.imageLinks.thumbnail;
  this.image_url= "https://i.imgur.com/J5LVHEL.jpg";
}

//listen to the port
// function handleError(res){
// return res.status(500).render ('page/error');
// }
app.get('/*', (req, res) => res.status(404).send('this route does not exist'));


app.listen(PORT, () =>
  console.log(`Now listening on port ${PORT}`));
