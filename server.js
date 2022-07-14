let mysql = require('mysql');
let config = require('./config.js');
const fetch = require('node-fetch');
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const { response } = require('express');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));

app.post('/api/getMovies', (req, res) => {

	let connection = mysql.createConnection(config);
	let sql = 'SELECT * FROM movies'
	
	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		let string = JSON.stringify(results);
		let obj = JSON.parse(string);
		res.send({ express: string });
	});
	connection.end();
});

app.post('/api/addReview', (req, res) => {
	let movieID = req.body.movieID;
	let userID = req.body.userID;
	let reviewTitle = req.body.reviewTitle;
	let reviewContent = req.body.reviewContent;
	let reviewScore = req.body.reviewScore;

	let connection = mysql.createConnection(config);

	let sql = 'INSERT INTO review (movieID, userID, reviewTitle, reviewContent, reviewScore) VALUES (?, ?, ?, ?, ?)'
	let data = [movieID, userID, reviewTitle, reviewContent, reviewScore];

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		console.log('Success')
		// res.send('Sucess');
	});
	connection.end();
})

app.post('/api/loadUserSettings', (req, res) => {

	let connection = mysql.createConnection(config);
	let userID = req.body.userID;

	let sql = `SELECT mode FROM user WHERE userID = ?`;
	console.log(sql);
	let data = [userID];
	console.log(data);

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		let string = JSON.stringify(results);
		//let obj = JSON.parse(string);
		res.send({ express: string });
	});
	connection.end();
});

app.listen(port, () => console.log(`Listening on port ${port}`));

//app.listen(port, '172.31.31.77'); 
