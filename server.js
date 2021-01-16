'use strict';

//dependencies 
const express = require('express');
require('dotenv').config();


//setting up the app
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('./public'));

//routes
app.get('/',homeHandler);


//route handlers
function homeHandler(req, res){
  res.status(200).send('homepage');
}

//listen to the port
app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
})