const server = require('./server.js')
const server1 = new server.Server(3000)
server1.start()
server1.getRoot()
server1.getDirectory('/api/drive/')
server1.getFileByName()