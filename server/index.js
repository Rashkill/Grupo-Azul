const express = require('express');
const cors = require('cors');
const port = 4000
const {getAcomp} = require('./routes/getAcomp');
const {addAcomp} = require('./routes/addAcomp');
const {addBenef, getBenef} = require('./routes/addGetBenef');
const {addJornada, updJornada} = require('./routes/jornadaDBHandle');
const {addFile} = require('./routes/addFile');
const {getConnection} = require('./db/conn');
const app = express()
const multer = require('multer');
const fs =  require('fs');

app.use(cors());
app.use(express.json());

var upload = multer();


 //Agregando Jornada
 app.post('/addjornada', async (req,res)=>{
  await addJornada(req,res);
})

//Get Jornadas
app.get('/jornadas', async (req, res, next) => {
  let db = getConnection();
  let sql = `SELECT * FROM jornada
         ORDER BY id`;
  var arrayData = [];
  db.all(sql, [], (err, rows) => {
      if (err) {
          res.status(400).json({"error":err.message});
          return;
      }
      rows.forEach((row) => {
          // console.log(row);
          arrayData.push(row);
      });
      res.json(rows)
  });
})

//Actualizando Jornada
app.post('/updateJornada/:id', async(req, res) => {
  await updJornada(req,res);
})

//Get Acompañante
app.get('/acomp', async (req, res, next) => {
    // const acomp = await getAcomp(req, res, next);
    // console.log("acomp: "+ acomp);
    // res.json(acomp);
    let db = getConnection();
    let sql = `SELECT * FROM acompañante
           ORDER BY id`;
    var arrayData = [];
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        rows.forEach((row) => {
            // console.log(row);
            arrayData.push(row);
        });
        res.json(rows)
    });
})

//Get Un Acompañante
app.get('/acompOnly/:id', async (req, res, next) => {
  var id = req.params.id;
  let db = getConnection();
  let sql = "SELECT * FROM acompañante WHERE id="+id;
  var arrayData = [];
  db.all(sql, [], (err, row) => {
      if (err) {
          res.status(400).json({"error":err.message});
          return;
      }
      console.log(row);
      res.json(row);
  });
})
 //Agregando Acompañante
app.post('/addacomp', async (req,res)=>{
    await addAcomp(req,res);
})


//Agregando Acompañante y Archivo
app.post('/addfile', upload.array("files",2), (req, res) => {
    const files = req.files
    console.log("req: ",files);
    console.log("nombre: ",req.body.cvu);
    console.log("length: ",req.files.length);
    var nombre= "";
    if(req.body.nombre){
      nombre=req.body.nombre;
    }
    var apellido= "";
    if(req.body.apellido){
      apellido=req.body.apellido;
    }
    var dni = 0;
    if(req.body.dni){
      dni=req.body.dni;
    }
    var telefono = 0;
    if(req.body.telefono){
      telefono=req.body.telefono;
    }
    var domicilio = "";
    if(req.body.domicilio){
      domicilio=req.body.domicilio;
    }
    var email = "";
    if(req.body.email){
      email=req.body.email;
    }
    var banco = "";
    if(req.body.banco){
      banco=req.body.banco;
    }
    var cvu = "";
    if(req.body.cvu){
      cvu=req.body.cvu;
    }
    var valorHora = 0;
    if(req.body.valorHora){
      valorHora=req.body.valorHora;
    }
    var filePdf;
    var fileImg;
    if(files){
      files.forEach(e  =>{
        if(e.mimetype == "application/pdf"){
          filePdf = e.buffer;
        };
        if(e.mimetype == "image/jpeg" ||e.mimetype == "image/png" ){
          fileImg = e.buffer;
        };
      });
    };


    let db = getConnection();
    let sql = `INSERT INTO Acompañante(Nombre,Apellido,Dni,Telefono,Domicilio,Email,Banco,Cvu,ValorHora,Poliza,Afip) VALUES(?,?,?,?,?,?,?,?,?,?,?)`; 

    // insert one row into the langs table
    db.run(sql,nombre,apellido,dni,telefono,domicilio,email,req.body.banco,cvu,valorHora,fileImg,filePdf, function(err) {
      if (err) {
        res.status(400).json({"error":err.message});
        console.log(err.message);
        return;
      }
      res.status(200).json("succed");
      console.log("succed");
    });


    // var db = getConnection();
    // db.run('UPDATE Acompañante SET Poliza = (?) WHERE id=27', bufferdirecto , function(err){
    //     if (err) return console.log(err);
    //     console.log('saved to database');
    // });
});
//Agregando Acompañante y Archivo
app.post('/updateAcomp/:id', upload.array("files",2), (req, res) => {
  const files = req.files
  console.log("req: ",files);
  console.log("id: ",req.params.id);
  var filePdf;
  var fileImg;
  if(files){
    files.forEach(e  =>{
      if(e.mimetype == "application/pdf"){
        filePdf = e.buffer;
      };
      if(e.mimetype == "image/jpeg" ||e.mimetype == "image/png" ){
        fileImg = e.buffer;
      };
    });
  };

  let db = getConnection();
  let sql = `UPDATE Acompañante SET Nombre=?, Apellido=?, Dni=?, Telefono=?,Domicilio=?,Email=?,Banco=?,Cvu=?,ValorHora=?,Poliza=?,Afip=? WHERE id=?`; 

  // insert one row into the langs table
  db.run(sql,req.body.nombre,req.body.apellido,req.body.dni,req.body.telefono,req.body.domicilio,req.body.email,req.body.banco,req.body.cvu,req.body.valorHora,fileImg,filePdf,req.params.id, function(err) {
    if (err) {
      res.status(400).json({"error":err.message});
      console.log(err.message);
      return;
    }
    res.status(200).json("succed");
    console.log("succed");
  });

})
//Retornando Imagenes
app.get('/photo/:id', (req, res) => {
    var filename = req.params.id; 
   
    let db = getConnection();
    let sql = `SELECT Poliza FROM acompañante WHERE id="${filename}"`;

    db.all(sql,[], (err, row) => {
        if (err) {
          return console.error(err.message);
        }
        if(row){
            // var bufferBase64 = new Buffer( row[0].Poliza, 'binary' ).toString('base64');
            var img = new Buffer(row[0].Poliza).toString('base64');
            // res.contentType('image/jpeg')
            // res.send(img)  
            res.json(img)
            // res.send(bufferBase64)  
            // console.log(row) 
            // var bufferBase64 = new Buffer( blob, 'binary' ).toString('base64');
            // const img = Buffer.from(row[0].Poliza, 'base64');
            // console.log(img)
            // res.writeHead(200, {
            // 'Content-Type': 'image/png'
            // });
            // res.end(img); 
        }
      });
})
//Borrando Acompañante
app.delete('/acomp/:id', (req,res)=>{
  var id = req.params.id;
  // delete a row based on id
  let db = getConnection();
  let sql = `DELETE FROM acompañante WHERE id="${id}"`;
  db.run(sql, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Se ha borrado la fila ${id}`);
    res.json("Se ha borrado la fila");
  });

})

//Get Beneficiarios
app.get('/beneficiarios', async (req, res, next) => {
  let db = getConnection();
  let sql = `SELECT * FROM beneficiario
         ORDER BY id`;
  var arrayData = [];
  db.all(sql, [], (err, rows) => {
      if (err) {
          res.status(400).json({"error":err.message});
          return;
      }
      rows.forEach((row) => {
          arrayData.push(row);
      });
      res.json(rows)
  });
})

 //Agregando Beneficiario
 app.post('/addabenef', async (req,res)=>{
  await addBenef(req,res);
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})