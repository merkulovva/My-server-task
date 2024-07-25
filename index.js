const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

const handleStatic = (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ header: "Hello", body: "Octagon NodeJS Test" }));
};

const handleDynamic = (req, res, query) => {
    const params = ['a', 'b', 'c'];
    const values = params.map(param => parseFloat(query[param]));
    
    if (values.some(value => isNaN(value))) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ header: "Error" }));
    } else {
        const result = values.reduce((acc, curr) => acc * curr, 1) / 3;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ header: "Calculated", body: result.toString() }));
    }
};

const requestHandler = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (pathname === '/static') {
        handleStatic(req, res);
    } else if (pathname === '/dynamic') {
        handleDynamic(req, res, query);
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Page Not Found</h1>');
    }
};

const server = http.createServer(requestHandler);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
