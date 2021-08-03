const fs = require('fs');
const http = require('http');

const replaceTemplate = require('./modules/replaceTemplate');

const overview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const card = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const producT = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { searchParams , pathname } = new URL("http://127.0.0.1:8000" + req.url);

  //Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj.map((el) => replaceTemplate(card, el));
    const output = overview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

  //Product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[searchParams.get('id')];
    const output = replaceTemplate(producT, product);

    res.end(output);

  //API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);

  //Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html'
    }); 
    res.end('Page not found');
  }
}); 

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});