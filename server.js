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

//route handlers

app.get('/', homeHandler);
app.get('searches/new', newSearch);
// app.get('/searches/show', formPage);
app.post('/serches', findBook);



// function formPage(req, res) {
//   res.render('pages/searches/show');
// }

function homeHandler(req, res) {
  res.status(200).render('pages/index');
}
function newSearch(req, res) {
  res.render('pages/searches/new');
}



function findBook(req, res) {
  let url = `https://www.googleapis.com/books/v1/volumes?q=quilting`;
  if (req.body.search === 'title') {
    url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.search}:${req.body.keyword}`;

  } else if (req.body.search === 'author') {

    url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.search}:${req.body.keyword}`;

  }
  superagent.get(url)
    .then(data => {
      let books = data.body.items.map((value) => {
        return new BOOK(value);
      });
      res.render('pages/searches/show', { books: books });

    }).catch(error => console.log(error));

}


function BOOK(data) {
  this.authors = data.volumeInfo.authors;
  this.title = data.voluneInfo.title;
  this.description = data.voluneInfo.description;
  // this.image_url = data.voluneInfo.imageLinks.thumbnail;
  this.image_url= "https://i.imgur.com/J5LVHEL.jpg";
}

//listen to the port
// const   handleError(error, res)=>{
//   response.render('pages/error', {error:error})
// }
app.get('/*', (req, res) => res.status(404).send('this route does not exist'));


app.listen(PORT, () =>
  console.log(`Now listening on port ${PORT}`));
