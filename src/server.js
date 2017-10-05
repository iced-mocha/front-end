import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Login from './components/login/Login.js';
import PrivacyPolicy from './components/privacy-policy/PrivacyPolicy.js'
import express from 'express';

let app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('layout', {
        // TODO: Replace this with actual web app
        content: ReactDOMServer.renderToString(<Login />)
    });
});

app.get('/login', function (req, res) {
    res.render('layout', {
        content: ReactDOMServer.renderToString(<Login />)
    });
});

app.get('/privacy-policy', function (req, res) {
  res.render('layout', {
    content: ReactDOMServer.renderToString(<PrivacyPolicy />)
  });
});

let server = app.listen(8080, function () {
  let host = server.address().address;
  let port = server.address().port;

  if (host === '::') {
    host = 'localhost';
  }

  console.log('App listening at http://%s:%s', host, port);
});
