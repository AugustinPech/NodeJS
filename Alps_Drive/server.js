function start() {
    const express = require('express')
    const fs = require('fs')
    const app = express()
    const port = 3000
    app.get('/', (req, res) => {
        res.send('Hello World!')
        console.log("New connexion")
    })
    app.get('/api/drive/', async (req, res) => {
        const files = await fs.promises.readdir("./",{withFileTypes : true})
        const filesInexpectedFormat=files.map(file => {
            return {
                name: file.name,
                isFolder: file.isDirectory(),
            }
        })
        console.log("New connexion on /api/drive/")
        res.send(filesInexpectedFormat)
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