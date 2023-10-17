const app = require('./src/app.js')
const express = require('express');
const cors = require('cors');
const morgan = require('morgan')

// const app = express();

//settings
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2)

//middlewres
app.use(morgan('dev'));
app.use(cors())
    //Tratar de enter solo textos y no nada pesado
app.use(express.urlencoded({extended:false}))
app.use(express.json());

// Server start
app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`)
})

