// implement your API here
const express = require('express'); // built in node.js module to handle http traffic
const db = require('./data/db.js');
const hostname = '127.0.0.1'; // the local computer where the server is running
const port = 3000; // a port we'll use to watch for traffic
const cors = require('cors');
const server = express();

server.listen(port, hostname, () => {
  // start watching for connections on the port specified
  console.log(`Server running at http://${hostname}:${port}/`);
});

server.use(express.json());
server.use(cors());

var corsOptions = {
  origin: hostname,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


server.get('/',  cors(corsOptions), (req, res) => { res.send('Hello from Express')});