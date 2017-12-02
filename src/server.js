import path from 'path';
import request from 'request-promise';
import { Server } from 'https';
import Express from 'express';
import React from 'react';
import fs from 'fs';
import { renderToString } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import { App } from './components/App';

var privateKey  = fs.readFileSync('server.key', 'utf8');
var certificate = fs.readFileSync('server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

const app = new Express();
const server = new Server(credentials, app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(Express.static(path.join(__dirname, 'static')));

app.get('/facebook/user', (req, res) => {
  var options = {
    url: 'https://graph.facebook.com/me',
    auth: {
      bearer: req.query.fb_token
    }
  }
  request(options)
    .then(response => {
      res.setHeader('Content-Type', 'application/json');
      res.send(response);
    }).catch(err => {
      res.send(err);
    });
});

app.get('*', (req, res) => {
  let markup = '';
  let status = 200;

  const context = {};
  markup = renderToString(
    <Router location={req.url} context={context}>
      <App />
    </Router>,
  );

  if (context.url) {
    return res.redirect(302, context.url);
  }

  if (context.is404) {
    status = 404;
  }

  return res.status(status).render('index', { markup });
});

const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'production';
server.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.info('\nServer running on port ' + port);
});
