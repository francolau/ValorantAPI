# Obtener Información de Partidas de Valorant

Este README documenta un fragmento de código Node.js que se utiliza para obtener información sobre partidas de Valorant utilizando la API de Riot Games y la informacion de [valorant-api-docs by techchrism](https://github.com/techchrism/valorant-api-docs) y [unofficial-valorat-api](https://github.com/Henrik-3/unofficial-valorant-api). El código incluye la lectura de un archivo de configuración local, autenticación y recuperación de datos de partidas en curso, jugadores y equipos.

## Cosas a tener en cuenta

- El codigo expone una ruta `/` en una aplicacion Express para que se utilice solo y durante el inicio del juego Valorant, especificamente cuando se inicia una partida y ya dentro de ella querramos recolectar los datos como lo son los nombres de aliados y enemigos presentes.
- Tener en cuenta que el token de autenticacion varía localmente y cada vez que iniciamos en nuestro juego por lo que solo funcionará para la cuenta iniciada en el momento de ejecución del programa. __No funciona para externas partidas, ni para aquellos usuarios no logeados localmente__

## Requisitos Previos

Asegúrate de tener las siguientes dependencias y configuraciones antes de ejecutar el código:

1. **Node.js:** Asegúrate de tener Node.js instalado en tu sistema. Puedes descargarlo desde [https://nodejs.org/](https://nodejs.org/).

2. **Dependencias:** Instala las dependencias requeridas ejecutando el siguiente comando en la carpeta de tu proyecto:

   ```bash
   npm install express node-fetch fs path dotenv
   ```

3. **Archivo de configuracion:** Este codigo asume que se encuentra el archivo de configuracion especifico de Riot Client en la ruta por `process.env.LOCALAPPDATA`. Asegurate de chequear esta informacion.

## Uso

- Para iniciar utilizar `npm start` y se vera localizado en http://localhost:3000 la información en su totalidad.
- **authKeys** Comprende los distintos tokens que se necesitan para enviar las solicitudes y el ID del jugador (este no cambia).
- **matchId** Es el id del partido en cuestion a analizar.
- **matchInfo** Informacion sobre el partido dando a conocer sus jugadores y detalles de conexion.
- **matchPlayers** Informacion detallada de los jugadores conectados en el partido en vivo.