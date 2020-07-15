// code away!
const express = require('express');
const server = express();
const port  = 5000

server.use(express.json());

server.get('/', (req, res)=>{
    res.send(`Stay strong Taja`)
})

server.listen(port, ()=>{
    console.log(`Server listening on port ${port}`)
})