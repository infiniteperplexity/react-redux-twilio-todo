const port = process.env.PORT || 8080;
const path = require("path");
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');


const dbPromise = sqlite.open('./db/todo.db', {Promise});

app.get('/', function(req, res) {
   res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/*.js', function(req, res) {
   res.sendFile(path.join(__dirname, req.url));
});

app.get('/*.jsx', function(req, res) {



res.sendFile(path.join(__dirname, req.url));
});

app.get('/sql.select.*', function(req, res) {
	let db = await dbPromise;
	
	// pull the entire database at this point
});




// app.get('/post/:id', async (req, res, next) => {
//   try {
//     const db = await dbPromise;
//     const [post, categories] = await Promise.all([
//       db.get('SELECT * FROM Post WHERE id = ?', req.params.id),
//       db.all('SELECT * FROM Category')
//     ]);
//     res.render('post', { post, categories });
//   } catch (err) {
//     next(err);
//   }
// });

app.post('/sql.insert.*', function(req, res) {
	// insert into table
});

app.post('/sql.delete.*', function(req, res) {

});


app.listen(port, () => console.log('Example app listening on port'+port+'!'))


import express from 'express';
import Promise from 'bluebird';
import sqlite from 'sqlite';
 
// const app = express();
// const port = process.env.PORT || 3000;
// const dbPromise = sqlite.open('./database.sqlite', { Promise });
 
// app.get('/post/:id', async (req, res, next) => {
//   try {
//     const db = await dbPromise;
//     const [post, categories] = await Promise.all([
//       db.get('SELECT * FROM Post WHERE id = ?', req.params.id),
//       db.all('SELECT * FROM Category')
//     ]);
//     res.render('post', { post, categories });
//   } catch (err) {
//     next(err);
//   }
// });
 
// app.listen(port);