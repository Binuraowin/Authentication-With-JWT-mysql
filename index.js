const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const cors = require('cors');

// app.use(morgan('dev'))
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

const authRote = require('./routes/authRoutes');

const corsOptions = {
    origin: '*',
    method: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(express.json());
app.use((req,res,next) =>{
        res.setHeader('Access-Control-Expose-Headers','Content-Range'),
        res.setHeader('Access-Control-Allow-Origin','*'),
        res.setHeader('Access-Control-Allow-Headers','*'),
        next()
})

app.use('/user',authRote);


app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods",'PUT,POST,PATCH,DELETE');
        return res.status(200).json({});
    }
})


app.use((req,res,next)=>{
    const err = new Error('not found');
    err.status = 404;
    next(err);
})

app.use((err, req,res,next)=>{
    res.status(err.status || 500);
    res.json({
        err:{
            message:err.message
        }
    })
})

module.exports = app;