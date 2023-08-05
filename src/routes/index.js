const { Router } = require("express")
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const router = Router();

router.get('/', async (req,res) => {
    try{
        const appDataPath = process.env.LOCALAPPDATA;
        const filePath = path.join(appDataPath, 'Riot Games', 'Riot Client', 'Config', 'lockfile');
    
    fs.readFile(filePath, 'utf8', async (err,data) => {
        if(err) {
            console.error('error', err);
            res.status(500).send('Error al leer')
            return
        }
        
        const lines = data.split('\n');
        
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
        let authToken = buff.toString('base64')
        
        let authKeys 
        
        
        const response = await fetch(`https://127.0.0.1:${port[0]}/entitlements/v1/token`, {
            headers: {'Content-Type': 'application/json', 'Authorization': `Basic ${authToken}`}
        })

        authKeys = await response.json()
        
        global.authKeys = await authKeys
    
        res.json(authKeys)
    })  
        }
            catch(err) {
                console.log(err)
        }
    
})

router.get('/getMatch', async (req, res) => {
    let bearerToken = global.authKeys.accessToken
    let entitlementToken = global.authKeys.token
    let playerId = global.authKeys.subject

    let matchId
    
    try {
        const response = await fetch(`https://glz-latam-1.na.a.pvp.net/core-game/v1/players/${playerId}`, {
            headers: {'Content-Type': 'application/json', 'X-Riot-Entitlements-JWT': `${entitlementToken}`, 'Authorization': `Bearer ${bearerToken}`}
        })

        matchId = await response.json()

        global.matchId = matchId.MatchID

        res.json({matchId})
    }
    catch (err) {
        console.log(err)
    }
})

router.get('/getMatchInfo', async (req,res) => {
    let matchInfo
    let bearerToken = global.authKeys.accessToken
    let entitlementToken = global.authKeys.token

    try{
        const response = await fetch(`https://glz-latam-1.na.a.pvp.net/core-game/v1/matches/${global.matchId}`, {
            headers: {'Content-Type': 'application/json', 'X-Riot-Entitlements-JWT': `${entitlementToken}`, 'Authorization': `Bearer ${bearerToken}`}
        })
        
        matchInfo = await response.json()

        let players = await Promise.all(matchInfo.Players.map(async (player) => {
            const responsePlayers = await fetch(`https://api.henrikdev.xyz/valorant/v1/by-puuid/account/${player.Subject}`)
            return responsePlayers.json()
                }))
                
        res.json({matchInfo, players})
    }
    catch (err) {
        console.log(err)
    }
})

// router.get('/test', async (req,res) => {
    // let similarChar = matchInfo.matchInfo.Players.map(player =>  player.CharacterID)
    // .filter((characterID, index, self) => self.indexOf(characterID) !== index);
    // let players = []
    // try{
    //     let players = await Promise.all(matchInfo.matchInfo.Players.map(async (player) => {
    //         const responsePlayers = await fetch(`https://api.henrikdev.xyz/valorant/v1/by-puuid/account/${player.Subject}`);
    //         return responsePlayers.json();
    //       }));

    //       res.json(players)
    // } catch(err) {
    //     console.log(err)
    // }
    // similarChar.forEach( async (char, index) =>{
    //     let puuid
    // playersInfo = [...playersInfo, matchInfo.matchInfo.Players.find((player) => player.CharacterID === char )]
    //         try{
    //             const response = await fetch(`https://api.henrikdev.xyz/valorant/v1/by-puuid/account/${playersInfo[index].Subject}`)
    //             .then((data) => data.json())
    //             .then((info) => puuid = info)
    //             console.log(puuid)
    //         }catch(err){
    //             console.log(err)
    //         }
    //     }
    // )
  // })



module.exports = router;