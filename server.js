const http = require("http");
const app = require("./index");
const server = http.createServer(app);

// server listening
let listen = server.listen(3000, () => {
    console.log(`Server running on port 3000`);
  });
  
module.exports = {app, server, listen};
