class Server {
    constructor(port) {
        this.regex = /^[a-zA-Z0-9\.\-\_]+$/gm
        this.fs = require('fs')
        this.express = require('express')
        this.os = require('os'); 
        this.path = require('path');
        this.busboy=require('express-busboy') 
        this.tmp= this.path.join(this.os.tmpdir(),"alps_drive")
        this.app = this.express()
        this.port = port
        this.ifFolderExists()
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
        this.busboy.extend(this.app, {
            upload: true,
            path: this.os.tmpdir(),
        });
        this.app.listen(
            this.port, () => {
                console.log(`Example app listening on port ${this.port}`)
            }
        )
    }
    ifFolderExists = ()=> {
        if (!this.fs.existsSync(this.path.join(this.tmp))){
            this.fs.mkdirSync(this.path.join(this.tmp));
        }
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
        console.log("getFilesInDirectory")
        const files = await this.fs.promises.readdir(directoryPath, {withFileTypes : true});
        return files.map(file => {
            if(file.isDirectory()){
                return {
                    name: file.name,
                    isFolder: file.isDirectory(),
                }
            } else {
                const fileSize =this.fs.statSync(this.path.join(directoryPath,file.name)).size
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
                console.log ("getDirectory")

                try{                    
                    const files = await this.getFilesInDirectory("/tmp/alps_drive")
                    console.log("New connexion on "+path)
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
        * /^[a-zA-Z\.\_]+$/gm is a regex that allows only alphanumeric characters, . and _
        * /home/augustin/Downloads
        */
        this.app.get(
            '/api/drive/:name',
            async (req, res) => {
                console.log ("getFileByName")
                try {
                    const files = await this.getFilesInDirectory(this.path.join("/tmp/alps_drive"));
                    let file = files.find(element => element.name === req.params.name);
                    console.log('New request for /api/drive/'+req.params.name)
                    if(file === undefined){
                        console.log('File /api/drive/'+req.params.name+' not found')
                        res.status(404).send(`Cannot find the file ${req.params.name}`)
                    } else {                       
                        if(file.isFolder){
                            const content= await this.getFilesInDirectory(this.path.join("/tmp/alps_drive",file.name));
                            res.status(200).send(content)                   
                        } else {
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
                if (!name.match(this.regex )) {
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
    uploadFile = () => {
        this.app.put('/api/drive/', (req, res) => {
            console.log("uploadFile")
            const name = req.files.file.filename;
            console.log("FILES", req.files)
            try {
                if (!name.match(this.regex )) {
                    return res.status(400).send('Name contains non-alphanumeric characters');
                }
                const filePath = this.path.join(this.tmp, name);
                this.fs.rename(req.files.file.file, filePath, (err) => {
                    if (err) {
                        return res.status(500).send(`Cannot upload the file: ${err}`);
                    }
                })
                console.log(filePath);
                
                return res.sendStatus(201);
            } catch (error) {
                return res.status(500).send(`Cannot upload the file: ${error}`);
            }
        })
    }
    deleteDirectory=()=>{
        this.app.delete('/api/drive/:name', async (req, res) => {
            console.log ("deleteDirectory")
            const name = req.params.name;
            try {
                if (!name.match(this.regex )) {
                    return res.status(400).send('Name contains non-alphanumeric characters');
                }
                const folderPath = this.path.join(this.tmp, name);
                await this.fs.promises.rmdir(folderPath, { recursive: true });
                return res.sendStatus(204);
            } catch (error) {
                return res.status(500).send(`Cannot delete the folder: ${error}`);
            }
        });
    }
    deleteFile= ()=> {
        this.app.delete('/api/drive/:name', async (req, res) => {
            console.log("deleteFile")
            const name = req.params.name;
            try {
                if (!name.match(this.regex)) {
                    console.log(name)
                    return res.status(400).send('Name contains non-alphanumeric characters other tan . and _');
                }
                const filePath = this.path.join(this.tmp, name);
                await this.fs.promises.unlink(filePath);
                return res.sendStatus(204);
            } catch (error) {
                return res.status(500).send(`Cannot delete the file: ${error}`);
            }
        });
    }
}

module.exports = {Server}