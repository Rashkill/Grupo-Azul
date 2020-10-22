const sqlite3 = require('sqlite3').verbose();
const {getConnection} = require('../db/conn');
// open the database

const addAcomp = (req,res) =>{
  let db = getConnection();
  let sql = `INSERT INTO Acompañante(Nombre,Apellido,DNI,CUIL,EntidadBancaria,CBU,Domicilio,Email,Telefono,ValorHora,NumeroPoliza,NombreSeguros,ConstanciaAFIP,CV)` + 
  ` VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`; 

  let ConstanciaAFIP = req.files.ConstanciaAFIP[0].buffer;
  let CV = req.files.CV[0].buffer;
  // insert one row into the langs table
  db.run(sql,
    req.body.Nombre,
    req.body.Apellido,
    req.body.DNI,
    req.body.CUIL,
    req.body.EntidadBancaria,
    req.body.CBU,
    req.body.Domicilio,
    req.body.Email,
    req.body.Telefono,
    req.body.ValorHora,
    req.body.NumeroPoliza,
    req.body.NombreSeguros,
    ConstanciaAFIP,
    CV, 
    function(err) {
    if (err) {
      res.status(400).json({"error":err.message});
      console.log(err.message);
      return;
    }
    res.status(200).json("Acompañante añadido");
    console.log("Acompañante añadido");
  });
}

const updAcomp = (req,res) =>{
  let db = getConnection();
  let sql = 'UPDATE Acompañante SET Nombre=?,Apellido=?,DNI=?,CUIL=?,EntidadBancaria=?,CBU=?,Domicilio=?,Email=?,Telefono=?,ValorHora=?,NumeroPoliza=?,NombreSeguros=?,ConstanciaAFIP=?,CV=? WHERE Id=?'; 

  let ConstanciaAFIP = req.files.ConstanciaAFIP[0].buffer
  let CV = req.files.CV[0].buffer;

  db.run(sql,
    req.body.Nombre,
    req.body.Apellido,
    req.body.DNI,
    req.body.CUIL,
    req.body.EntidadBancaria,
    req.body.CBU,
    req.body.Domicilio,
    req.body.Email,
    req.body.Telefono,
    req.body.ValorHora,
    req.body.NumeroPoliza,
    req.body.NombreSeguros,
    ConstanciaAFIP,
    CV, 
    req.params.id,
    function(err) {
    if (err) {
      res.status(400).json({"error":err.message});
      console.log(err.message);
      return;
    }
    res.status(200).json("Acompañante Actualizado");
    console.log("Acompañante Actualizado");
  });
}

const getAcomp = (req,res) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let db = getConnection();
    let sql = `SELECT ${fields} FROM Acompañante
           ORDER BY Id`;
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
}

const getAcompOnly = (req,res) =>{
  let fields = req.params.fields ? req.params.fields : "*";
  let db = getConnection();
    let sql = `SELECT ${fields} FROM Acompañante WHERE id=`+req.params.id;

  db.all(sql, [], (err, row) => {
      if (err) {
          res.status(400).json({"error":err.message});
          return;
      }
      res.json(row);
  });
}

const delAcomp = (req,res) =>{
  let db = getConnection();
  let sql = `DELETE FROM Coordinador WHERE id="${req.params.id}"`;
  db.run(sql, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Se ha borrado la fila`);
    res.json("Se ha borrado la fila");
  });
}

module.exports={addAcomp, updAcomp, getAcomp, getAcompOnly, delAcomp}
