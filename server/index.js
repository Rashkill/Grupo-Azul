const express = require('express');
const cors = require('cors');
const port = 4000
const compression = require('compression');
const {addAcomp, updAcomp, getAcomp, getAcompOnly, delAcomp} = require('./routes/acompañanteDBHandle');
const {addBenef, updBenef, getBenef, getBenefOnly, delBenef} = require('./routes/beneficiarioDBHandle');
const {addCoord, updCoord, getCoord, getCoordOnly, delCoord} = require('./routes/coordinadorDBHandle')
const {addJornada, updJornada, getJornadas, getJornadaOnly, delJornada} = require('./routes/jornadaDBHandle');
const {addLiq, updLiq, getLiq, getLiqOnly, delLiq} = require('./routes/liquidacionDBHandle');
//const {getConnection} = require('./db/conn');
const app = express()
const multer = require('multer');
const fs =  require('fs');
const {getConnection} = require('./db/conn');

var http = require('http');
var https = require('https');

http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

app.use(compression());
app.use(cors());
app.use(express.json());

var upload = multer();


/*-------------
    JORNADAS
---------------*/

 //Agregando Jornada
 app.post('/addJornada',  (req,res)=>{
   addJornada(req,res);
})

//Obtener Jornadas
app.get('/getJornadas',  (req, res) => {
   getJornadas(req,res);
})

//Actualizando Jornada
app.post('/updJornada/:id', upload.none(), (req, res) => {
   updJornada(req,res);
})

//Obtener una Jornada
app.get('/getJornadaOnly/:id', (req,res)=>{
   getJornadaOnly(req,res);
})

//Borrando Jornada
app.delete('/jornada/:id', (req,res)=>{
   delJornada(req,res);
})

/*-------------
  ACOMPAÑANTES
---------------*/

//Agregando Acompañante
app.post('/addAcomp', upload.fields([{name: "ConstanciaAFIP", maxCount: 1}, {name: "CV", maxCount: 1}]),  (req,res)=>{
   addAcomp(req,res);
})

//Get Acompañante
app.get('/getAcomp',  (req, res) => {
  getAcomp(req,res);
})

//Get Acompañante con campos especificos
app.get('/getAcomp/:fields',  (req, res) => {
   getAcomp(req,res);
 })

//Get Un Acompañante
app.get('/acompOnly/:id',  (req, res, next) => {
  getAcompOnly(req,res)
})

//Get Un Acompañante con campos especificos
app.get('/acompOnly/:id/:fields',  (req, res, next) => {
   getAcompOnly(req,res)
 })

//Actualizando Acompañante
app.post('/updAcomp/:id', upload.fields([{name: "ConstanciaAFIP", maxCount: 1}, {name: "CV", maxCount: 1}]),  (req, res) => {
  updAcomp(req,res);
})

//Borrando Acompañante
app.delete('/acomp/:id', (req,res)=>{
  delAcomp(req,res);
})


/*-------------
  BENEFICIARIOS
---------------*/

 //Agregando Beneficiario
 app.post('/addBenef', upload.single("FichaInicial"),  (req,res)=>{
   addBenef(req,res);
})

//Actualizando Beneficiario
app.post('/updBenef/:id', upload.single("FichaInicial"), (req, res) => {
  updBenef(req,res);
})

//Obteniendo Beneficiarios
app.get('/getBenef',  (req, res) => {
   getBenef(req,res);
})

//Obteniendo Beneficiarios con campos especificos
app.get('/getBenef/:fields',  (req, res) => {
   getBenef(req,res);
})

//Obteniendo Un Solo Beneficiario
app.get('/getBenefOnly/:id',  (req, res) => {
   getBenefOnly(req,res);
})

//Obteniendo Un Solo Beneficiario con campos especificos
app.get('/getBenefOnly/:id/:fields',  (req, res) => {
   getBenefOnly(req,res);
})

//Borrando Beneficiario
app.delete('/benef/:id',  (req, res) => {
   delBenef(req,res);
})


/*-------------
  COORDINADORES
---------------*/

//Agregando Coordinador
app.post('/addCoord', upload.fields([{name: "ConstanciaAFIP", maxCount: 1}, {name: "CV", maxCount: 1}]),  (req,res)=>{
   addCoord(req,res);
})

//Actualizando Coordinador
app.post('/updCoord/:id', upload.fields([{name: "ConstanciaAFIP", maxCount: 1}, {name: "CV", maxCount: 1}]),  (req,res)=>{
   updCoord(req,res);
})

//Get Coordinadores
app.get('/getCoord',  (req, res) => {
   getCoord(req,res)
})

//Get Coordinadores con campos especificos
app.get('/getCoord/:fields',  (req, res) => {
   getCoord(req,res)
})

//Get Un Coordinador
app.get('/getCoordOnly/:id',  (req, res) => {
   getCoordOnly(req,res)
})

//Get Un Coordinador con campos especificos
app.get('/getCoordOnly/:id/:fields',  (req, res) => {
   getCoordOnly(req,res)
})

//Borrand Coordinador
app.delete('/coord/:id',  (req, res)=>{
   delCoord(req,res);
})

/*-------------
  LIQUIDACIONES
---------------*/

//Agregando Liquidacion
app.post('/addLiq',  (req,res)=>{
   addLiq(req,res);
})

//Actualizando Liquidacion
app.post('/updLiq/:id', upload.none(), (req, res) =>{
   updLiq(req,res);
})

//Get Liquidaciones
app.get('/getLiq',  (req, res) => {
   getLiq(req,res)
})

//Get Liquidaciones con campos especificos
app.get('/getLiq/:fields',  (req, res) => {
   getLiq(req,res)
})

//Get Un Liquidacion
app.get('/getLiqOnly/:id',  (req, res) => {
   getLiqOnly(req,res)
})

//Get Un Liquidacion con campos especificos
app.get('/getLiqOnly/:id/:fields',  (req, res) => {
   getLiqOnly(req,res)
})

//Borrand Liquidacion
app.delete('/liq/:id',  (req, res)=>{
   delLiq(req,res);
})

app.listen(port, () => {
  console.log(`Base de datos activa en http://localhost:${port}`)
})