'use strict';

//dependencies 
const express = require('express');
require('dotenv').config();


//setting up the app
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.set('view engine', 'ejs');


//routes
app.get('/',homeHandler);


//route handlers
function homeHandler(req, res){
  res.status(200).render('pages/index');


}

//listen to the port
app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
})