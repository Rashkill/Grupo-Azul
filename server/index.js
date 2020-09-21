const express = require('express');
const cors = require('cors');
const port = 4000
const {getAcomp} = require('./routes/getAcomp');
const {addAcomp} = require('./routes/addAcomp');
const {addFile} = require('./routes/addFile');
const {getConnection} = require('./db/conn');
const app = express()
const multer = require('multer');
const fs =  require('fs');

app.use(cors());
app.use(express.json());

// const upload_dir = './uploads';

// SET STORAGE
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now())
//     }
//   })
   
// var upload = multer({ 
    //storage: storage
    // ,
    // fileFilter: (req, file, cb) => {
    //     if (
    //       file.mimetype == 'image/png' ||
    //       file.mimetype == 'image/jpg' ||
    //       file.mimetype == 'image/jpeg' ||
    //       file.mimetype == 'document/pdf' ||

    //     ) {
    //       cb(null, true);
    //     } else {
    //       cb(null, false);
    //       return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    //     }
    // } 
//});
var upload = multer();
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
 //Agregando Acompañante
app.post('/addacomp', async (req,res)=>{
    await addAcomp(req,res);
})
//Agregando Archivo
app.post('/addfile', upload.array("files",2), (req, res) => {
    const files = req.files
    console.log("req: ",files);
    console.log("nombre: ",req.body.nombre);
    // console.log("apellido: ",req.body.apellido);
    // console.log("valorHora: ",req.body.valorHora);
    //await addAcomp(req,res);
    // var img = fs.readFileSync(req.file.path);
    // var encode_image = img.toString('base64');
    // var image = new Buffer(encode_image, 'base64');

    let db = getConnection();
    let sql = `INSERT INTO Acompañante(Nombre,Apellido,Dni,Telefono,Domicilio,Email,Banco,Cvu,ValorHora,Poliza,Afip) VALUES(?,?,?,?,?,?,?,?,?,?,?)`; 

    // insert one row into the langs table
    db.run(sql, req.body.nombre,req.body.apellido,req.body.dni,req.body.telefono,req.body.domicilio,req.body.email,req.body.banco,req.body.cvu,req.body.valorHora,req.files[0].buffer,req.files[1].buffer, function(err) {
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})