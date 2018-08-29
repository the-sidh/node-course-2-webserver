const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const axios = require('axios');

var app = express();

const port = process.env.PORT || 3000;



app.use((req, res, next) => {
	var now = new Date().toString();
	const logLine = `${now} - ${req.method}  ${req.url}\n`;
	console.log(logLine);
	fs.appendFileSync('./log.txt', logLine);
	next();
});

app.use((req, res, next) => {
	var maintenceMode = false;
	if (maintenceMode) {
		res.render('maintainence.hbs', {
			tryAgain: '15'
		});
	} else {
		next();
	}
});



hbs.registerPartials(__dirname + '/views/partials');


var token = 'Bearer 060e5d1750ed829c45515e733c517413e34c9aed';
var config = {
	headers: { 'Authorization': token }
};

axios.get(
	'https://api.github.com/user/repos',
	config
).then((response) => {
	var repos = [];
	if (response.status === 200) {
		response.data.forEach(element => {
			repos.push( element.html_url);
		});
	} hbs.registerHelper('getListOfRepos', () => {
		return repos;
	});
}).catch((error) => {
	console.log(error);
});



hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});
hbs.registerHelper('screenIt', (txt) => {
	return txt.toUpperCase();
});
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
	res.render('home.hbs', {
		pageTitle: 'home',
		wellcomeMsg: 'Hi!!',
	});
});

app.get('/repos', (req, res) => {
	res.render('repos.hbs', {
		pageTitle: 'Portfolio',
	});
});


app.get('/about', (req, res) => {
	res.render('about.hbs', {
		pageTitle: 'about',
	});
});


app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'Cannot fulfill request'
	});

})

app.listen(port, () => {
	console.log(`server listing on port ${port}`);
});



