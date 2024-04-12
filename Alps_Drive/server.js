class Server {
    constructor(port) {
        this.express = require('express')
        this.fs = require('fs')
        this.os = require('os'); 
        this.path = require('path'); 
        this.app = this.express()
        this.port = port
        this.tmp= this.path.join(this.os.tmpdir(),"alps_drive")
    }
    start = ()=>{
        /*
        * This function is a middleware that allows CORS
        */
       this.app.use( function (req, res, next) {
           res.setHeader("Access-Control-Allow-Origin", "*");
           res.setHeader('Access-Control-Allow-Methods', '*');
           res.setHeader("Access-Control-Allow-Headers", "*");
           next();
        });
        this.app.listen(
            this.port, () => {
                console.log(`Example app listening on port ${this.port}`)
            }
        )
    }
    getRoot = ()=>{
        this.app.get('/', (req, res) => {
            try {
                const conexionMsg = 
            'Hello you ! \nWelcome to the Alps Drive API !'
            +'\nHere we have a simple API to manage your files'
            +'\nYou can ACCESS to your files with the route         /api/drive/'
            +'\nYou can ACCESS to a specific file with the route    /api/drive/:name'
            // +'\nYou can CREATE a folder with the route              /api/drive/?name=yourFolderName'
            // +'\nYou can DELETE a folder with the route              /api/drive/:name'
            // +'\nYou can UPLOAD a file with the route                /api/drive/:name'
            // +'\nYou can DOWNLOAD a file with the route              /api/drive/:name'
            // +'\nYou can DELETE a file with the route                /api/drive/:name'
            // +'\nYou can MOVE a file with the route                  /api/drive/:name'
            // +'\nYou can COPY a file with the route                  /api/drive/:name'
            // +'\nYou can RENAME a file with the route                /api/drive/:name'
            // +'\nYou can GET the content of a file with the route    /api/drive/:name'
            // +'\nYou can GET the content of a folder with the route  /api/drive/:name'
            +'\nHave fun !\n'
                res.status(200).send(conexionMsg)
                console.log("New connexion")
            } catch (error) {
                res.status(500).send(`Cannot get the root: ${error}`);
            }
        })
    }
    getDirectory = (path)=>{
         /*
        * This function manages the get request on the  route path
        */         
        this.app.get(
            path,
            async (req, res) => {                
                try{                    
                    const files = await this.fs.promises.readdir("/tmp/alps_drive",{withFileTypes : true})
                    const filesInexpectedFormat=files.map(
                        file => {
                            if(file.isDirectory()){
                                return {
                                    name: file.name,
                                    isFolder: file.isDirectory(),
                                }
                            } else {
                                return {
                                    name: file.name,
                                    size: this.fs.statSync(this.path.join(this.tmp,file.name)).size,
                                    isFolder: file.isDirectory(),
                                }
                            }
                        }
                    )
                    console.log("New connexion on"+path)
                    res.status(200).send(filesInexpectedFormat)
                } catch (error) {
                    res.status(500).send(`Cannot get the drive: ${error}`);
                }
            }
        )
    }
    getFileByName =() =>{
        /*
        * This function manages the get request on the route '/api/drive/:name'
        * /^\/api\/drive\/[a-zA-Z]+(?:\.[a-zA-Z]{4})?$/gm,
        */
        this.app.get(
            '/api/drive/:name',
            async (req, res) => {
                try {
                    const files = await this.fs.promises.readdir(
                            "/tmp/alps_drive",{withFileTypes : true})
                    let file = files.find(element => element.name === req.params.name)
                    file.isFolder=file.isDirectory()
                    if(file.isFolder){                        
                        this.getDirectory(this.path.join('/api/drive/',req.params.name))                        
                    }
                    // if(file.isFolder){
                    //     file.content= await this.fs.promises.readdir(
                    //         this.path.join(this.tmp,req.params.name),
                    //         {withFileTypes : true}
                    //     )
                    //     file.content.map(element => {
                    //         element.size=this.fs.statSync(this.path.join(this.tmp,req.params.name,element.name)).size
                    //         element.isFolder=element.isDirectory()
                    //     })
                    // }
                    // res.status(200).send(file.content)
                    console.log('New request for  /api/drive/'+req.params.name)
                } catch (error) {
                    res.status(500).send(`Cannot get the drive: ${error}`);
                }
            }
        )
    }
}



// function start() {
//     const express = require('express')
//     const fs = require('fs')
//     const os = require('os'); 
//     const path = require('path'); 
//     const app = express()
//     const port = 3000
//     /*
//     * This function is a middleware that allows CORS
//     */
//     app.use( function (req, res, next) {
//         res.setHeader("Access-Control-Allow-Origin", "*");
//         res.setHeader('Access-Control-Allow-Methods', '*');
//         res.setHeader("Access-Control-Allow-Headers", "*");
//         next();
//         });
//     /*
//     * This function manages the get request on the route '/'
//     */
//    app.get('/', (req, res) => {
//        try {
//             res.status(200).send('Hello World!')
//             console.log("New connexion")
//         } catch (error) {
//             res.status(500).send(`Cannot get the root: ${error}`);
//         }
//     })
//     /*
//     * This function manages the get request on the  route '/api/drive/'
//     */
//     app.get(
//         '/api/drive/',
//         async (req, res) => {
//             try{
//                 const files = await fs.promises.readdir("/tmp/alps_drive",{withFileTypes : true})
//                 const filesInexpectedFormat=files.map(
//                     file => {
//                         return {
//                             name: file.name,
//                             isFolder: file.isDirectory(),
//                         }
//                     }
//                 )
//                 console.log("New connexion on /api/drive/")
//                 res.status(200).send(filesInexpectedFormat)
//             } catch (error) {
//                 res.status(500).send(`Cannot get the drive: ${error}`);
//             }
//         }
//     )
//     /*
//     * This function manages the post request on the route '/api/drive/:name'
//     * /^\/api\/drive\/[a-zA-Z]+(?:\.[a-zA-Z]{4})?$/gm,
//     */
//     app.get(
//         '/api/drive/:name',
//         async (req, res) => {
//             try {
//                 const files = await fs.promises.readdir("/tmp/alps_drive",{withFileTypes : true})
//                 const filesInexpectedFormat=files.map(
//                     file => {
//                         return {
//                             name: file.name,
//                             isFolder: file.isDirectory(),
//                         }
//                     }
//                 )
//                 let target = filesInexpectedFormat.find(file => file.name === req.params.name)
//                 console.log("New connexion on /api/drive/")
//                 res.status(200).send(target)
//             } catch (error) {
//                 res.status(500).send(`Cannot get the drive: ${error}`);
//             }
//         }
//     )
//     /*
//     * This function manages the post request on the route '/api/drive/'
//     */
//     app.post(
//             '/api/drive/',
//             async (req, res, next) => {
//                 try {
//                     const name = req.query.name
//                     const folderPath= path.join(os.tmpdir(),"alps_drive", name)
//                     await fs.promises.mkdir(folderPath, {recursive: true})
//                     return res.sendStatus(201);
//                 } catch (error) {
//                     return res.status(500).send(`Cannot create the folder: ${error}`);
//                 }
//             }
//         );

// }

module.exports = {Server}