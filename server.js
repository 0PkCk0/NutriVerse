const http = require("http");
const app = require("./index");
const server = http.createServer(app);


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', "true");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
// server listening
app.listen(3000, () => {
    console.log(`Server running on port 3000`);
});
  
module.exports = {app, server};
