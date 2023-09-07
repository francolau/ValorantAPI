const { Router, response } = require("express")
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const router = Router();

router.get('/', async (req, res) => {
    try {
      // Obtener la ruta del archivo de configuración
      const appDataPath = process.env.LOCALAPPDATA;
      const filePath = path.join(appDataPath, 'Riot Games', 'Riot Client', 'Config', 'lockfile');
      
      // Leer el archivo de configuración
      fs.readFile(filePath, 'utf8', async (err, data) => {
          if (err) {
              console.error('Error:', err);
              res.status(500).send('Error al leer el archivo de configuración');
              return;
            }
            // Dividir las líneas del archivo
            const lines = data.split('\n');
            
            // Obtener contraseñas y puertos
            const pw = lines.map(line => line.trim().split(':')[3]);
            const port = lines.map(line => line.trim().split(':')[2]);
            
            // Construir la clave de autenticación y token
            const authKey = 'riot:' + pw[0];
            const buff = Buffer.from(authKey);
            const authToken = buff.toString('base64');
            
            // Variables para almacenar la información del juego
            let authJson
            let matchId 
            let matchInfo 
            let matchPlayers 
            let mainPlayer;
            let mainPlayerTeamID;
            let allies;
            let enemies;
            let alliesDetails;
            let enemiesDetails;
  
        // Obtener token de autenticación
        try {
          const response = await fetch(`https://127.0.0.1:${port[0]}/entitlements/v1/token`, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${authToken}` }
          });
  
          authJson = await response.json();
  
          // Almacenar las claves de autenticación
          const authKeys = {
            entitlementToken: authJson.token,
            bearerToken: authJson.accessToken,
            playerId: authJson.subject
          };
  
          // Obtener el ID del partido
          try {
            const response = await fetch(`https://glz-latam-1.na.a.pvp.net/core-game/v1/players/${authKeys.playerId}`, {
              headers: { 'Content-Type': 'application/json', 'X-Riot-Entitlements-JWT': `${authKeys.entitlementToken}`, 'Authorization': `Bearer ${authKeys.bearerToken}` }
            });
  
            matchId = await response.json();
  
            // Obtener información del partido
            try {
              const response = await fetch(`https://glz-latam-1.na.a.pvp.net/core-game/v1/matches/${matchId.MatchID}`, {
                headers: { 'Content-Type': 'application/json', 'X-Riot-Entitlements-JWT': `${authKeys.entitlementToken}`, 'Authorization': `Bearer ${authKeys.bearerToken}` }
              });
  
              matchInfo = await response.json();
  
              // Encontrar al jugador principal y su equipo
              mainPlayer = matchInfo.Players.find(player => player.Subject === authKeys.playerId);
              mainPlayerTeamID = mainPlayer ? mainPlayer.TeamID : null;
  
              // Filtrar jugadores de tu equipo y enemigos
              allies = matchInfo.Players.filter(player => player.TeamID === mainPlayerTeamID);
              enemies = matchInfo.Players.filter(player => player.TeamID !== mainPlayerTeamID);
  
              // Obtener información de los jugadores en paralelo
              async function getPlayerInfo(subject) {
                const response = await fetch(`https://api.henrikdev.xyz/valorant/v1/by-puuid/account/${subject}`);
                return response.json();
              }
  
              const playerRequests = [...allies, ...enemies].map(player => getPlayerInfo(player.Subject));
              matchPlayers = await Promise.all(playerRequests);
  
              // Separar la información en aliados y enemigos
              alliesDetails = matchPlayers.slice(0, allies.length);
              enemiesDetails = matchPlayers.slice(enemies.length);
  
              // Responder con la información recopilada
              res.json({ authKeys, matchId: matchId.MatchID || 'No se encontró un partido', matchInfo, matchPlayers: { alliesDetails, enemiesDetails } });

            } catch (err) {
              console.log('Error al obtener información del partido:', err);
              res.status(500).send('Error al obtener información del partido');
            }
          } catch (err) {
            console.log('Error al obtener el ID del partido:', err);
            res.status(500).send('Error al obtener el ID del partido');
          }
        } catch (err) {
          console.log('Error al obtener el token de autenticación:', err);
          res.status(500).send('Error al obtener el token de autenticación');
        }
      });
    } catch (err) {
      console.log('Error general:', err);
      res.status(500).send('Error general');
    }
  });

module.exports = router;