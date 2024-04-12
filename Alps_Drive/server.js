class Server {
    constructor(port) {
        this.fs = require('fs')
        this.express = require('express')
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
    getFilesInDirectory = async (directoryPath) => {
        const files = await this.fs.promises.readdir(directoryPath, {withFileTypes : true});
        return files.map(file => {
            if(file.isDirectory()){
                return {
                    name: file.name,
                    isFolder: file.isDirectory(),
                }
            } else {
                console.log("2",this.path.join(directoryPath,file.name))
                const fileSize =this.fs.statSync(this.path.join(directoryPath,file.name)).size
                console.log("3",directoryPath,fileSize)
                return {
                    name: file.name,
                    size : fileSize,
                    isFolder: file.isDirectory(),
                    path: this.path.join(directoryPath,file.name)
                }
            }
        });
    }
    getDirectory = (path)=>{
         /*
        * This function manages the get request on the  route path
        */         
        this.app.get(
            path,
            async (req, res) => {                
                try{                    
                    const files = await this.getFilesInDirectory("/tmp/alps_drive")
                    console.log("New connexion on"+path)
                    res.status(200).send(files)
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
        * /home/augustin/Downloads
        */
        this.app.get(
            '/api/drive/:name',
            async (req, res) => {
                try {
                    const files = await this.getFilesInDirectory(this.path.join("/tmp/alps_drive"));
                    let file = files.find(element => element.name === req.params.name);
                    console.log(file,files)
                    console.log('New request for /api/drive/'+req.params.name)
                    if(file === undefined){
                        console.log('File /api/drive/'+req.params.name+' not found')
                        res.status(404).send(`Cannot find the file ${req.params.name}`)
                    } else {
                        console.log("1",file)                        
                        if(file.isFolder){
                            const content= await this.getFilesInDirectory(this.path.join("/tmp/alps_drive",file.name));
                                console.log("4",this.path.join("/tmp/alps_drive",file.name))
                                res.status(200).send(content)                   
                        } else {
                            console.log("5",file)
                            res.status(200).download(file.path)
                        }
                    }
                } catch (error) {
                    res.status(500).send(`Cannot get the file/folder : ${error}`);
                }
            }
        )
    }
    createDirectory = () => {
        this.app.post('/api/drive', async (req, res, next) => {
            const name = req.query.name;
            try {
                if (!name.match(/^[0-9a-zA-Z]+$/)) {
                    return res.status(400).send('Name contains non-alphanumeric characters');
                }
                const folderPath = this.path.join(this.tmp, name);
                await this.fs.promises.mkdir(folderPath, { recursive: true });
                return res.sendStatus(201);
            } catch (error) {
                return res.status(500).send(`Cannot create the folder: ${error}`);
            }
        });
    }

}


module.exports = {Server}

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

// }

module.exports = {Server}