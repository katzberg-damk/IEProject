const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const scenariosRoutes = require('./api/routes/scenarios');
const charactersRoutes = require('./api/routes/characters');
const sessionsRoutes = require('./api/routes/sessions');
mongoose.connect('mongodb+srv://MongoIEUSR:'+process.env.MONGO_ATLAS_PW+'@ieproject-qruv7.mongodb.net/test?retryWrites=true',
{
    useNewUrlParser:true
})

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, GET, POST, DELETE, PATCH'); 
    return res.status(200).json({});
    }  
    next(); 
});

app.use('/scenarios',scenariosRoutes);
app.use('/characters',charactersRoutes);
app.use('/sessions',sessionsRoutes);

app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;