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
app.get('/new', newSearch);
app.get('/', homeHandler);
app.get('/searches/show', formPage);
app.get('/serches/show', search);


//route handlers

function formPage(req, res) {
  res.render('pages/searches/new.ejs');
}

function homeHandler(req, res) {
  res.status(200).render('pages/index');
}
function newSearch(req, res) {
  res.status(200).render('pages/searches/new.ejs');
}



function search(req, res) {
  let url = `https://www.googleapis.com/books/v1/volumes?q=quilting`
  if (req.body.search === 'title') {
    url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.search}:${req.body.keyword}`;

  } else if (req.body.search === 'author') {

    url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.search}:${req.body.keyword}`;

  }
  superagent.get(url)
    .then(data => {
      let books = data.body.items.map((value) => {
        return new Books(value);
      });
      res.render('pages/searches/show', { books: books });

    }).catch(error => console.log(error));

}


function Books(data) {
  this.authors = data.volumeInfo.authors;
  this.title = data.volumeInfo.title;
  this.description = data.volumeInfo.description;
  this.image_url = data.volumeInfo.imageLinks.thumbnail;
}

//listen to the port
// const   handleError(error, res)=>{
//   response.render('pages/error', {error:error})
// }
app.get('/*', (req, res) => res.status(404).send('this route does not exist'));


app.listen(PORT, () =>
  console.log(`Now listening on port ${PORT}`));
