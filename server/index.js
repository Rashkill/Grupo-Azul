const express = require('express');
const cors = require('cors');
const port = 4000

const {addAcomp, updAcomp, getAcomp, getAcompOnly, delAcomp} = require('./routes/acompañanteDBHandle');
const {addBenef, updBenef, getBenef, getBenefOnly, delBenef} = require('./routes/beneficiarioDBHandle');
const {addCoord, updCoord, getCoord, getCoordOnly, delCoord} = require('./routes/coordinadorDBHandle')
const {addJornada, updJornada, getJornadas, getJornadaOnly, delJornada} = require('./routes/jornadaDBHandle');
//const {getConnection} = require('./db/conn');
const app = express()
const multer = require('multer');
const fs =  require('fs');

app.use(cors());
app.use(express.json());

var upload = multer();


/*-------------
    JORNADAS
---------------*/

 //Agregando Jornada
 app.post('/addJornada', async (req,res)=>{
  await addJornada(req,res);
})

//Obtener Jornadas
app.get('/getJornadas', async (req, res) => {
  await getJornadas(req,res);
})

//Actualizando Jornada
app.post('/updJornada/:id', async(req, res) => {
  await updJornada(req,res);
})

//Obtener una Jornada
app.get('/getJornadaOnly/:id', async(req,res)=>{
  await getJornadaOnly(req,res);
})

//Borrando Jornada
app.delete('/jornada/:id', async(req,res)=>{
  await getJornadaOnly(req,res);
})

/*-------------
  ACOMPAÑANTES
---------------*/

//Agregando Acompañante
app.post('/addAcomp', upload.fields([{name: "ConstanciaAFIP", maxCount: 1}, {name: "CV", maxCount: 1}]), async (req,res)=>{
  await addAcomp(req,res);
})

//Get Acompañante
app.get('/getAcomp', async (req, res) => {
    await getAcomp(req,res);
})

//Get Un Acompañante
app.get('/acompOnly/:id', async (req, res, next) => {
  await getAcompOnly(req,res)
})

//Actualizando Acompañante
app.post('/updAcomp/:id', upload.fields([{name: "ConstanciaAFIP", maxCount: 1}, {name: "CV", maxCount: 1}]), async (req, res) => {
  await updAcomp(req,res);
})

//Borrando Acompañante
app.delete('/acomp/:id', async(req,res)=>{
  await delAcomp(req,res);
})


/*-------------
  BENEFICIARIOS
---------------*/

 //Agregando Beneficiario
 app.post('/addBenef', upload.single("FichaInicial"), async (req,res)=>{
  await addBenef(req,res);
})

//Actualizando Beneficiario
app.post('/updBenef/:id', upload.single("FichaInicial"), (req, res) => {
  updBenef(req,res);
})

//Obteniendo Beneficiarios
app.get('/getBenef', async (req, res) => {
  await getBenef(req,res);
})

//Obteniendo Un Solo Beneficiario
app.get('/getBenefOnly/:id', async (req, res) => {
  await getBenefOnly(req,res);
})

//Borrando Beneficiario
app.delete('/benef/:id', async (req, res) => {
  await delBenef(req,res);
})


/*-------------
  COORDINADORES
---------------*/

//Agregando Coordinador
app.post('/addCoord', upload.fields([{name: "ConstanciaAFIP", maxCount: 1}, {name: "CV", maxCount: 1}]), async (req,res)=>{
  await addCoord(req,res);
})

//Agregando Coordinador
app.post('/updCoord', upload.fields([{name: "ConstanciaAFIP", maxCount: 1}, {name: "CV", maxCount: 1}]), async (req,res)=>{
  await updCoord(req,res);
})

//Get Coordinadores
app.get('/getCoord', async (req, res) => {
  await getCoord(req,res)
})

//Get Un Coordinador
app.get('/getCoordOnly/:id', async (req, res) => {
  await getCoordOnly(req,res)
})

//Borrand Coordinador
app.delete('/coord/:id', async (req, res)=>{
  await delCoord(req,res);
})

app.listen(port, () => {
  console.log(`Base de datos activa en http://localhost:${port}`)
})