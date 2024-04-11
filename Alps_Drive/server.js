function start() {
    const express = require('express')
    const fs = require('fs')
    const os = require('os'); 
    const path = require('path'); 
    const app = express()
    const port = 3000
    app.use( function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader("Access-Control-Allow-Headers", "*");
        next();
        });
    // app.get('/', (req, res) => {
    //     res.send('Hello World!')
    //     console.log("New connexion")
    // })
    app.get(
        '/api/drive/',
        async (req, res) => {
            const files = await fs.promises.readdir("/tmp/alps_drive",{withFileTypes : true})
            const filesInexpectedFormat=files.map(
                file => {
                    return {
                        name: file.name,
                        isFolder: file.isDirectory(),
                    }
                }
            )
            console.log("New connexion on /api/drive/")
            res.send(filesInexpectedFormat)
        }
    )
    app.post(
            '/api/drive/',
            async (req, res, next) => {
                try {
                    const name = req.query.name
                    const folderPath= path.join(os.tmpdir(),"alps_drive", name)
                    await fs.promises.mkdir(folderPath, {recursive: true})
                    return res.sendStatus(201);
                } catch (error) {
                    return res.status(500).send(`Cannot create the folder: ${error}`);
                }
            }
        );
    app.listen(
        port, () => {
            console.log(`Example app listening on port ${port}`)
        }
    )

}

module.exports = {start}