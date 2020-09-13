const express = require('express');
const cors = require('cors');
const port = 4000
const {getAcomp} = require('./routes/getAcomp');
const {addAcomp} = require('./routes/addAcomp');
const {addFile} = require('./routes/addFile');
const {getConnection} = require('./db/conn');
const app = express()

app.use(cors());
app.use(express.json());

// SET STORAGE
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now())
//     }
//   })
   
// var upload = multer({ storage: storage })


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
app.post('/addfile', async (req, res) => {
    await addFile(req,res);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})