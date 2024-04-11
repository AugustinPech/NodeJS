function start() {
    const express = require('express')
    const app = express()
    const port = 3000
    app.get('/', (req, res) => {
        res.send('Hello World!')
        console.log("New connexion")
    })
    
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
    app.use( function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader("Access-Control-Allow-Headers", "*");
        next();
        });
}
module.exports = {start}