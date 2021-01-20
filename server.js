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
// form
app.get('/search', newSearch);
// call back function
app.post('/searches', findBook);




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



// function findBook(req, res) {

//   let url = 'https://www.googleapis.com/books/v1/volumes?q=quilting';


//   if (req.body.search[0] === 'title') {
//     url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.search}`;

//   } else if (req.body.search[0] === 'author') {

//     url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.search}`;

//   }
//   console.log(url);
//   superagent.get(url)
//     .then(data => {

//       let books = data.body.items.map((value) => {
//         return new Book(value);
//       });
//       res.render('pages/searches/show', { books: books });

//       console.log(books);

//     }).catch(error => console.log(error));
// }
function findBook(req, res) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=quilting';

  if (req.body.search === 'title') {
    url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.search}:${req.body.keyword}`;

  } else if (req.body.search === 'author') {

    url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.search}:${req.body.keyword}`;

  }
  superagent.get(url)
    .then(data => {
      

      let books = data.body.items.map((value) => {
        return new Book(value);
      });
      res.render('pages/searches/show', { books: books });



    }).catch(error => console.log(error));




}


//===================== Constructors ============================

function Book(data) {
  console.log(data);
  this.authors = data.volumeInfo.authors;
  this.title = data.volumeInfo.title;
  this.description = data.volumeInfo.description;
  // this.img_url = data.volumeInfo.imageLinks? data.volumeInfo.imageLinks.smallThumbnail:`https://i.imgur.com/J5LVHEL.jpg`;
  this.img_url = data.volumeInfo.imageLinks.smallThumbnail || `https://i.imgur.com/J5LVHEL.jpg`;

}

//listen to the port
// function handleError(res){
// return res.status(500).render ('page/error');
// }
app.get('/*', (req, res) => res.status(404).send('this route does not exist'));


app.listen(PORT, () =>
  console.log(`Now listening on port ${PORT}`));
