const { Router } = require("express")
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const router = Router();

router.get('/getToken', async (req,res) => {
    try{

        const filePath = 'C:/Users/Franc/AppData/Local/Riot Games/Riot Client/Config/lockfile'
    
    fs.readFile(filePath, 'utf8', async (err,data) => {
        if(err) {
            console.error('error', err);
            res.status(500).send('Error al leer')
            return
        }

        
        const lines = data.split('\n'); // Separar el contenido en líneas
        
        const pw = lines.map(line => {
            const cleanedLine = line.trim();
            const parts = cleanedLine.split(':');
            return parts[3];
        });

        const port = lines.map(line => {
            const cleanedLine = line.trim();
            const parts = cleanedLine.split(':');
            return parts[2];
        });

        const authKey = 'riot:' + pw[0]
        let buff = Buffer(authKey)
        let base64Data = buff.toString('base64')

        const dataEncoded = {
            "token": base64Data,
            'port': port[0]
        }
        
        const response = await fetch(`https://127.0.0.1:${dataEncoded.port}/entitlements/v1/token`, {
            headers: {'Content-Type': 'application/json', 'Authorization': `Basic ${dataEncoded.token}`}
        })
    
        res.json(await response.json())
    })
}
catch(err) {
    console.log(err)
}
    
})

router.get('/', async (req,res) => {

    let title = 'riot:7US28lYHLOK4i5yy6On92g'
    let buff = Buffer(title)
    let base64Data = buff.toString('base64')

    const data = {
        "encoded": base64Data,
        "firstData": await global.firstData
    }
    res.json({data})
})

module.exports = router;