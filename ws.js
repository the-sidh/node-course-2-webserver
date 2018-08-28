const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();



app.use((req, res, next) => {
	var now = new Date().toString();
	const logLine = `${now} - ${req.method}  ${req.url}\n`;
	console.log(logLine);
	fs.appendFileSync('./log.txt', logLine);
	next();
});

app.use((req, res, next) => {
	var maintenceMode=false;
	if (maintenceMode) {
		res.render('maintainence.hbs', {
			tryAgain: '15'
		});
	} else {
		next();
	}
});



hbs.registerPartials(__dirname + '/views/partials');
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

app.listen(3000);