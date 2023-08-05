const { Router } = require("express")
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const valId = 'ab5369a0-ada5-5221-a681-2f7f5ac5f4ff'

const router = Router();

router.get('/', async (req,res) => {
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
        let authToken = buff.toString('base64')
        
        let authKeys 
        
        
        const response = await fetch(`https://127.0.0.1:${port[0]}/entitlements/v1/token`, {
            headers: {'Content-Type': 'application/json', 'Authorization': `Basic ${authToken}`}
        }).then((data) => data.json())
        .then((info) => authKeys = info)
        
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

    let matchId
    
    try {
        const response = await fetch(`https://glz-latam-1.na.a.pvp.net/core-game/v1/players/${valId}`, {
            headers: {'Content-Type': 'application/json', 'X-Riot-Entitlements-JWT': `${entitlementToken}`, 'Authorization': `Bearer ${bearerToken}`}
        })
        .then((data) => data.json())
        .then((info) => matchId = info.MatchID)

        global.matchId = matchId

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
        .then((data) => data.json())
        .then((info) => matchInfo = info)

        let similarCharacters = matchInfo.Players.map(player => player.CharacterID)
        .filter((characterID, index, self) => self.indexOf(characterID) !== index);

        res.json({matchInfo, similarCharacters})
    }
    catch (err) {
        console.log(err)
    }
})

router.get('/test', (req,res) => {

    const matchInfo = {
    "matchInfo": {
        "MatchID": "50ac0f07-1c40-4d27-b208-3b8484e39331",
        "Version": 1691201251368,
        "State": "IN_PROGRESS",
        "MapID": "/Game/Maps/HURM/HURM_Bowl/HURM_Bowl",
        "ModeID": "/Game/GameModes/HURM/HURMGameMode.HURMGameMode_C",
        "ProvisioningFlow": "Matchmaking",
        "GamePodID": "aresriot.mtl-ctl-scl2-2.latam-gp-santiago-1",
        "AllMUCName": "50ac0f07-1c40-4d27-b208-3b8484e39331-all@ares-coregame.la1.pvp.net",
        "TeamMUCName": "50ac0f07-1c40-4d27-b208-3b8484e39331-red@ares-coregame.la1.pvp.net",
        "TeamVoiceID": "50ac0f07-1c40-4d27-b208-3b8484e39331-tm2",
        "IsReconnectable": true,
        "ConnectionDetails": {
          "GameServerHosts": [
            "151.106.249.1"
          ],
          "GameServerHost": "151.106.249.1",
          "GameServerPort": 7256,
          "GameServerObfuscatedIP": 3794982314,
          "GameClientHash": 807318050,
          "PlayerKey": "1ZyrCd1jQ2yzz8yXx2WQPkD9qnKroQ4eapq+/vyZbWjaq83Po1qjjzOfLQJcwv4iptBCa4vodiqw4SSLGm+uHQ=="
        },
        "PostGameDetails": null,
        "Players": [
          {
            "Subject": "9ed95174-f041-593f-b3d0-4e3ba637d512",
            "TeamID": "Blue",
            "CharacterID": "a3bfb853-43b2-7238-a4f1-ad90e9e46bcc",
            "PlayerIdentity": {
              "Subject": "9ed95174-f041-593f-b3d0-4e3ba637d512",
              "PlayerCardID": "0bc3b158-40b0-ab2a-4b8b-04be15e3b7d1",
              "PlayerTitleID": "39374ca0-447b-1d4e-aa38-e6b0e0b07946",
              "AccountLevel": 192,
              "PreferredLevelBorderID": "547ac9dd-495d-f11d-d921-3fbd14604ae0",
              "Incognito": true,
              "HideAccountLevel": true
            },
            "SeasonalBadgeInfo": {
              "SeasonID": "",
              "NumberOfWins": 0,
              "WinsByTier": null,
              "Rank": 0,
              "LeaderboardRank": 0
            },
            "IsCoach": false,
            "IsAssociated": true
          },
          {
            "Subject": "0e800513-d455-5b40-b242-1b5a205865ea",
            "TeamID": "Blue",
            "CharacterID": "cc8b64c8-4b25-4ff9-6e7f-37b4da43d235",
            "PlayerIdentity": {
              "Subject": "0e800513-d455-5b40-b242-1b5a205865ea",
              "PlayerCardID": "ba21deb2-4dce-38c7-904c-9db6033738e3",
              "PlayerTitleID": "171e2f90-41e0-48d0-bbf5-28a531c7eafb",
              "AccountLevel": 212,
              "PreferredLevelBorderID": "bd1082ab-462c-3fb8-e049-28a9750acf0f",
              "Incognito": true,
              "HideAccountLevel": true
            },
            "SeasonalBadgeInfo": {
              "SeasonID": "",
              "NumberOfWins": 0,
              "WinsByTier": null,
              "Rank": 0,
              "LeaderboardRank": 0
            },
            "IsCoach": false,
            "IsAssociated": true
          },
          {
            "Subject": "97666074-5dcd-51d8-bcef-f73eaf8cb13d",
            "TeamID": "Blue",
            "CharacterID": "6f2a04ca-43e0-be17-7f36-b3908627744d",
            "PlayerIdentity": {
              "Subject": "97666074-5dcd-51d8-bcef-f73eaf8cb13d",
              "PlayerCardID": "8b8c15ec-432a-85ab-b58b-9b918877e4f7",
              "PlayerTitleID": "129190d4-42fa-4e79-75e3-ffb5679d1dc2",
              "AccountLevel": 374,
              "PreferredLevelBorderID": "ebc736cd-4b6a-137b-e2b0-1486e31312c9",
              "Incognito": true,
              "HideAccountLevel": true
            },
            "SeasonalBadgeInfo": {
              "SeasonID": "",
              "NumberOfWins": 0,
              "WinsByTier": null,
              "Rank": 0,
              "LeaderboardRank": 0
            },
            "IsCoach": false,
            "IsAssociated": true
          },
          {
            "Subject": "17a57696-b409-57a4-9de0-6820220e6232",
            "TeamID": "Blue",
            "CharacterID": "add6443a-41bd-e414-f6ad-e58d267f4e95",
            "PlayerIdentity": {
              "Subject": "17a57696-b409-57a4-9de0-6820220e6232",
              "PlayerCardID": "4ca63988-4ca6-2911-a1b5-98a4b765dffd",
              "PlayerTitleID": "63057041-4f65-5579-e5a6-d88ae7007ebb",
              "AccountLevel": 203,
              "PreferredLevelBorderID": "00000000-0000-0000-0000-000000000000",
              "Incognito": false,
              "HideAccountLevel": false
            },
            "SeasonalBadgeInfo": {
              "SeasonID": "",
              "NumberOfWins": 0,
              "WinsByTier": null,
              "Rank": 0,
              "LeaderboardRank": 0
            },
            "IsCoach": false,
            "IsAssociated": true
          },
          {
            "Subject": "e323b475-88d8-50b7-b15a-1a54b4f1ba9a",
            "TeamID": "Blue",
            "CharacterID": "f94c3b30-42be-e959-889c-5aa313dba261",
            "PlayerIdentity": {
              "Subject": "e323b475-88d8-50b7-b15a-1a54b4f1ba9a",
              "PlayerCardID": "fca32892-4f2f-228b-0f5c-209ad50199b3",
              "PlayerTitleID": "171e2f90-41e0-48d0-bbf5-28a531c7eafb",
              "AccountLevel": 158,
              "PreferredLevelBorderID": "49413ac2-4ed5-6953-5791-db838ccb58f3",
              "Incognito": false,
              "HideAccountLevel": true
            },
            "SeasonalBadgeInfo": {
              "SeasonID": "",
              "NumberOfWins": 0,
              "WinsByTier": null,
              "Rank": 0,
              "LeaderboardRank": 0
            },
            "IsCoach": false,
            "IsAssociated": true
          },
          {
            "Subject": "bccb276f-b971-5ac5-bd40-266162ba5381",
            "TeamID": "Red",
            "CharacterID": "cc8b64c8-4b25-4ff9-6e7f-37b4da43d235",
            "PlayerIdentity": {
              "Subject": "bccb276f-b971-5ac5-bd40-266162ba5381",
              "PlayerCardID": "bb6ae873-43ec-efb4-3ea6-93ac00a82d4e",
              "PlayerTitleID": "63057041-4f65-5579-e5a6-d88ae7007ebb",
              "AccountLevel": 64,
              "PreferredLevelBorderID": "00000000-0000-0000-0000-000000000000",
              "Incognito": true,
              "HideAccountLevel": false
            },
            "SeasonalBadgeInfo": {
              "SeasonID": "",
              "NumberOfWins": 0,
              "WinsByTier": null,
              "Rank": 0,
              "LeaderboardRank": 0
            },
            "IsCoach": false,
            "IsAssociated": true
          },
          {
            "Subject": "d9438280-f31e-5efc-a527-d90f26cf1bdb",
            "TeamID": "Red",
            "CharacterID": "5f8d3a7f-467b-97f3-062c-13acf203c006",
            "PlayerIdentity": {
              "Subject": "d9438280-f31e-5efc-a527-d90f26cf1bdb",
              "PlayerCardID": "e99656df-bbb0-4db4-867b-29a31cbe2e51",
              "PlayerTitleID": "d13e579c-435e-44d4-cec2-6eae5a3c5ed4",
              "AccountLevel": 35,
              "PreferredLevelBorderID": "00000000-0000-0000-0000-000000000000",
              "Incognito": false,
              "HideAccountLevel": false
            },
            "SeasonalBadgeInfo": {
              "SeasonID": "",
              "NumberOfWins": 0,
              "WinsByTier": null,
              "Rank": 0,
              "LeaderboardRank": 0
            },
            "IsCoach": false,
            "IsAssociated": true
          },
          {
            "Subject": "9ec895f3-5aeb-5cbb-a51b-62cb38df8f99",
            "TeamID": "Red",
            "CharacterID": "569fdd95-4d10-43ab-ca70-79becc718b46",
            "PlayerIdentity": {
              "Subject": "9ec895f3-5aeb-5cbb-a51b-62cb38df8f99",
              "PlayerCardID": "6a82ba95-436f-9d3c-8710-d3a9e09e8445",
              "PlayerTitleID": "887d1bc0-43b4-c084-4723-e0963a491722",
              "AccountLevel": 64,
              "PreferredLevelBorderID": "00000000-0000-0000-0000-000000000000",
              "Incognito": false,
              "HideAccountLevel": false
            },
            "SeasonalBadgeInfo": {
              "SeasonID": "",
              "NumberOfWins": 0,
              "WinsByTier": null,
              "Rank": 0,
              "LeaderboardRank": 0
            },
            "IsCoach": false,
            "IsAssociated": true
          },
          {
            "Subject": "59b9b741-441f-5bd3-b5ec-458c05357a9b",
            "TeamID": "Red",
            "CharacterID": "eb93336a-449b-9c1b-0a54-a891f7921d69",
            "PlayerIdentity": {
              "Subject": "59b9b741-441f-5bd3-b5ec-458c05357a9b",
              "PlayerCardID": "b3cf378a-415c-d080-9847-a1b0f47def56",
              "PlayerTitleID": "254021ec-426c-85de-3eba-faaeff17a5f5",
              "AccountLevel": 160,
              "PreferredLevelBorderID": "6f610ab6-4a21-63fd-ac19-4a9204bc2721",
              "Incognito": true,
              "HideAccountLevel": false
            },
            "SeasonalBadgeInfo": {
              "SeasonID": "",
              "NumberOfWins": 0,
              "WinsByTier": null,
              "Rank": 0,
              "LeaderboardRank": 0
            },
            "IsCoach": false,
            "IsAssociated": true
          },
          {
            "Subject": "ab5369a0-ada5-5221-a681-2f7f5ac5f4ff",
            "TeamID": "Red",
            "CharacterID": "f94c3b30-42be-e959-889c-5aa313dba261",
            "PlayerIdentity": {
              "Subject": "ab5369a0-ada5-5221-a681-2f7f5ac5f4ff",
              "PlayerCardID": "4783e1f5-4132-d19f-01d8-a08edccf44be",
              "PlayerTitleID": "3d5ec384-436c-2d09-6359-6b89ec5c9682",
              "AccountLevel": 232,
              "PreferredLevelBorderID": "547ac9dd-495d-f11d-d921-3fbd14604ae0",
              "Incognito": false,
              "HideAccountLevel": true
            },
            "SeasonalBadgeInfo": {
              "SeasonID": "",
              "NumberOfWins": 0,
              "WinsByTier": null,
              "Rank": 0,
              "LeaderboardRank": 0
            },
            "IsCoach": false,
            "IsAssociated": true
          }
        ],
        "MatchmakingData": {
          "QueueID": "hurm",
          "IsRanked": false
        }
      }
    }

    let similarChar = matchInfo.matchInfo.Players.map(player => player.CharacterID)
    .filter((characterID, index, self) => self.indexOf(characterID) !== index);

    res.send({'hello': 'world'})
})



module.exports = router;