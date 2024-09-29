const http = require('http');
const query = require('querystring');
const httpResponses = require('./httpResponses.js');
const dataResponses = require('./dataResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': httpResponses.getIndex,
  '/style.css': httpResponses.getCSS,
  '/getUsers': dataResponses.getUsers,
  '/notReal': dataResponses.notReal,
  '/addUser': dataResponses.addUser,
  index: httpResponses.getIndex,
};

const parseBody = (request, response, handler) => {
  const body = [];
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });
  request.on('data', (chunk) => {
    body.push(chunk);
  });
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    request.body = query.parse(bodyString);
    handler(request, response);
  });
};

const onRequest = (request, response) => {
  // Parse URL
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedURL = new URL(request.url, `${protocol}://${request.headers.host}`);
  if (urlStruct[parsedURL.pathname]) {
    // Check if POST
    if (request.method !== 'POST') {
      urlStruct[parsedURL.pathname](request, response);
    } else {
      parseBody(request, response, urlStruct[parsedURL.pathname]);
    }
  } else {
    // default line
    urlStruct['/notReal'](request, response);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on: 127.0.0.01:${port}`);
});
